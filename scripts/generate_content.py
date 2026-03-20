import os
import json
import datetime
import requests
from pathlib import Path
from bs4 import BeautifulSoup
from openai import OpenAI
import fal_client  # lee FAL_KEY del entorno automáticamente

# ── Configuración ──────────────────────────────────────────────
REPO_ROOT   = Path(__file__).parent.parent
ARTICLES_ES = REPO_ROOT / "src/content/articles/es"
ARTICLES_EN = REPO_ROOT / "src/content/articles/en"
IMAGES_DIR  = REPO_ROOT / "public/images/articles"
EVENTS_FILE = REPO_ROOT / "src/data/events.json"

SECTIONS = ["fiestas", "turismo", "gastronomia", "cultura"]

SOURCES = [
    "https://www.diariodecadiz.es",
    "https://www.lavozdigital.es",
]

FORBIDDEN_WORDS = [
    "muerto", "muerte", "asesinato", "accidente", "herido", "crimen",
    "detenido", "político", "partido", "elecciones", "protesta",
    "huelga", "tragedia", "catástrofe", "incendio", "condena",
]

openai_client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

# ── Catch-up: cuántos artículos generar hoy ───────────────────
def articles_to_generate() -> int:
    files = sorted(ARTICLES_ES.glob("*.md"), reverse=True)
    if not files:
        return 1
    for line in files[0].read_text().splitlines():
        if line.startswith("publishedAt:"):
            date_str = line.split(":", 1)[1].strip().strip('"')
            last_date = datetime.date.fromisoformat(date_str[:10])
            days_missed = (datetime.date.today() - last_date).days
            return min(max(days_missed, 1), 7)
    return 1

# ── Sección rotante ────────────────────────────────────────────
def next_section() -> str:
    files = sorted(ARTICLES_ES.glob("*.md"), reverse=True)
    if not files:
        return SECTIONS[0]
    for line in files[0].read_text().splitlines():
        if line.startswith("category:"):
            last = line.split(":", 1)[1].strip().strip('"')
            idx = SECTIONS.index(last) if last in SECTIONS else -1
            return SECTIONS[(idx + 1) % len(SECTIONS)]
    return SECTIONS[0]

# ── Scraping de noticias ───────────────────────────────────────
def fetch_news(section: str) -> dict | None:
    keywords = {
        "fiestas":     ["fiesta", "carnaval", "festival", "celebración", "semana santa"],
        "turismo":     ["turismo", "playa", "visita", "ruta", "viaje", "monumento"],
        "gastronomia": ["gastronomía", "restaurante", "cocina", "atún", "pescado", "vino"],
        "cultura":     ["cultura", "flamenco", "música", "arte", "exposición", "teatro"],
    }
    section_keywords = keywords[section]

    for source_url in SOURCES:
        try:
            r = requests.get(source_url, timeout=10,
                             headers={"User-Agent": "Mozilla/5.0"})
            soup = BeautifulSoup(r.text, "html.parser")
            for link in soup.find_all("a", href=True):
                title = link.get_text(strip=True)
                href  = link["href"]
                if len(title) < 20:
                    continue
                title_lower = title.lower()
                if any(w in title_lower for w in FORBIDDEN_WORDS):
                    continue
                if not any(k in title_lower for k in section_keywords):
                    continue
                if href.startswith("/"):
                    href = source_url.rstrip("/") + href
                return {"title": title, "url": href, "source": source_url}
        except Exception as e:
            print(f"  Error scraping {source_url}: {e}")
            continue
    return None

# ── Generación de artículo con OpenAI ─────────────────────────
def generate_article(section: str, news: dict | None) -> dict:
    today   = datetime.date.today().isoformat()
    context = (f"Noticia de referencia: {news['title']} ({news['url']})"
               if news else
               f"Genera una noticia positiva y actual sobre {section} en Cádiz o su provincia.")

    prompt_es = f"""
Eres un periodista del portal cadiz.is. Escribe un artículo en español sobre la sección "{section}".
{context}

El artículo debe:
- Tener entre 400 y 600 palabras
- Ser positivo, informativo y turístico
- Transmitir la alegría y cultura de Cádiz
- NO incluir política, accidentes ni tragedias

Responde SOLO en JSON con este formato exacto:
{{
  "title": "Título del artículo",
  "slug": "titulo-en-minusculas-con-guiones",
  "excerpt": "Resumen de 1-2 frases",
  "body": "Cuerpo completo del artículo en Markdown",
  "image_prompt": "Descripción en inglés para generar una imagen fotorrealista relacionada con el artículo, warm Mediterranean light, Cádiz, Spain, high quality photography"
}}
"""
    resp_es = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt_es}],
        response_format={"type": "json_object"},
    )
    data_es = json.loads(resp_es.choices[0].message.content)

    prompt_en = f"""
Translate this Spanish article to natural English for the cadiz.is travel portal.
Title: {data_es['title']}
Body: {data_es['body']}

Respond ONLY in JSON:
{{"title": "...", "excerpt": "...", "body": "..."}}
"""
    resp_en = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt_en}],
        response_format={"type": "json_object"},
    )
    data_en = json.loads(resp_en.choices[0].message.content)

    return {
        "slug":         data_es["slug"],
        "section":      section,
        "date":         today,
        "image_prompt": data_es["image_prompt"],
        "es": {"title": data_es["title"], "excerpt": data_es["excerpt"], "body": data_es["body"]},
        "en": {"title": data_en["title"], "excerpt": data_en["excerpt"], "body": data_en["body"]},
    }

# ── Generación de imagen con fal.ai Flux Dev ──────────────────
def generate_image(image_prompt: str, slug: str) -> str | None:
    try:
        result = fal_client.run(
            "fal-ai/flux/dev",
            arguments={
                "prompt": image_prompt,
                "image_size": "landscape_16_9",
                "num_inference_steps": 28,
                "num_images": 1,
            },
        )
        image_url = result["images"][0]["url"]
        img_data  = requests.get(image_url, timeout=30).content
        img_path  = IMAGES_DIR / f"{slug}.png"
        img_path.write_bytes(img_data)
        print(f"  Imagen guardada: {img_path.name}")
        return f"/images/articles/{slug}.png"
    except Exception as e:
        print(f"  Error generando imagen: {e}")
        return None

# ── Escribir archivos Markdown ─────────────────────────────────
def write_markdown(article: dict, image_path: str | None):
    slug    = article["slug"]
    date    = article["date"]
    section = article["section"]
    img     = image_path or "/images/articles/placeholder.png"

    for lang, data in [("es", article["es"]), ("en", article["en"])]:
        folder   = ARTICLES_ES if lang == "es" else ARTICLES_EN
        filepath = folder / f"{date}-{slug}.md"
        content  = f"""---
title: "{data['title']}"
articleSlug: "{slug}"
excerpt: "{data['excerpt']}"
category: "{section}"
publishedAt: "{date}"
image: "{img}"
author: "cadiz.is"
lang: "{lang}"
---

{data['body']}
"""
        filepath.write_text(content, encoding="utf-8")
        print(f"  Artículo escrito: {filepath.name} [{lang}]")

# ── Limpieza de eventos caducados ─────────────────────────────
def clean_expired_events():
    with open(EVENTS_FILE, encoding="utf-8") as f:
        data = json.load(f)
    today  = datetime.date.today().isoformat()
    before = len(data["events"])
    data["events"] = [e for e in data["events"] if e.get("endDate", "9999") >= today]
    after  = len(data["events"])
    if before != after:
        data["lastUpdated"] = datetime.datetime.utcnow().isoformat() + "Z"
        with open(EVENTS_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"  Eventos eliminados: {before - after}")

# ── Main ──────────────────────────────────────────────────────
def main():
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    print("── Limpiando eventos caducados ──")
    clean_expired_events()

    count   = articles_to_generate()
    section = next_section()
    print(f"── Generando {count} artículo(s) ──")

    for i in range(count):
        print(f"\n[{i+1}/{count}] Sección: {section}")
        news    = fetch_news(section)
        print(f"  Noticia: {news['title'] if news else 'generada por IA'}")
        article = generate_article(section, news)
        img     = generate_image(article["image_prompt"], article["slug"])
        write_markdown(article, img)
        idx     = SECTIONS.index(section)
        section = SECTIONS[(idx + 1) % len(SECTIONS)]

    print("\n✓ Proceso completado.")

if __name__ == "__main__":
    main()
