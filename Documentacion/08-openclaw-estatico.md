# 08 — OpenClaw Adaptado a Web Estática

## Cambio de paradigma

En el proyecto original, OpenClaw publicaba contenido haciendo **peticiones HTTP** a la API Django:

```python
# ANTES (WebBlogCadiz.is)
response = requests.post(
    f"{API_URL}/api/articles/",
    json=article_data,
    headers={"Authorization": f"Token {API_TOKEN}"}
)
```

En la versión estática, OpenClaw publica haciendo **commits a Git**:

```python
# AHORA (WebBlogEstaticaCadiz.is)
# 1. Escribe el archivo Markdown
with open(f"src/content/articles/es/{filename}.md", "w") as f:
    f.write(markdown_content)

# 2. Commit y push
subprocess.run(["git", "add", "."])
subprocess.run(["git", "commit", "-m", f"OpenClaw: {title}"])
subprocess.run(["git", "push", "origin", "main"])
```

---

## Arquitectura del agente

```
agent/
├── openclaw.py              # Script principal (punto de entrada)
├── tools/
│   ├── content_generator.py # Genera artículos con Claude
│   ├── image_generator.py   # Genera imágenes con fal.ai
│   ├── markdown_writer.py   # Escribe archivos .md
│   ├── json_updater.py      # Actualiza events.json, places.json
│   └── git_publisher.py     # git commit + push
└── prompts/
    └── system_prompt.md     # Instrucciones del agente
```

---

## openclaw.py — script principal

```python
#!/usr/bin/env python3
"""
OpenClaw — Agente editorial autónomo de cadiz.is
Ejecutado por GitHub Actions 3 veces al día.
"""

import os
import json
from datetime import datetime
from anthropic import Anthropic
from tools.content_generator import generate_article
from tools.image_generator import generate_image
from tools.markdown_writer import write_article
from tools.json_updater import update_events
from tools.git_publisher import commit_and_push

CYCLE_NAMES = {
    "morning": "Monitorización de noticias + artículos de actualidad",
    "afternoon": "Artículos de profundidad cultural y turística",
    "evening": "Contenido evergreen y atemporal",
}

def main():
    cycle = os.environ.get("OPENCLAW_CYCLE", "morning")
    print(f"🦞 OpenClaw iniciando ciclo: {cycle} — {CYCLE_NAMES.get(cycle)}")
    print(f"📅 Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M UTC')}")

    client = Anthropic()

    # 1. Buscar noticias (ciclo mañana) o generar evergreen
    articles_published = []

    for i in range(4):  # Hasta 4 artículos por ciclo
        print(f"\n📝 Generando artículo {i+1}/4...")

        # Genera contenido en ES/EN/FR
        article = generate_article(client, cycle, articles_published)

        if not article:
            print(f"  ✗ No se pudo generar artículo {i+1}")
            continue

        # Genera imagen
        print(f"  🖼️ Generando imagen con fal.ai...")
        image_path = generate_image(article["imagePrompt"], article["slug"])

        article["image"] = f"/images/articles/{article['slug']}.webp"

        # Escribe archivos Markdown
        for lang in ["es", "en", "fr"]:
            write_article(article, lang)
            print(f"  ✓ Escrito: src/content/articles/{lang}/{article['slug']}.md")

        articles_published.append(article["slug"])

    # 2. Actualizar eventos expirados
    print(f"\n📅 Actualizando events.json...")
    update_events(client)

    # 3. Commit y push si hay cambios
    if articles_published:
        message = f"OpenClaw [{cycle}]: {len(articles_published)} artículos — {datetime.now().strftime('%Y-%m-%d')}"
        commit_and_push(message)
        print(f"\n✅ Publicados {len(articles_published)} artículos")
    else:
        print("\n⚠️ No se publicaron artículos en este ciclo")

if __name__ == "__main__":
    main()
```

---

## tools/content_generator.py

```python
import json
from anthropic import Anthropic
from pathlib import Path

SYSTEM_PROMPT = Path("prompts/system_prompt.md").read_text()

def generate_article(client: Anthropic, cycle: str, published_today: list) -> dict | None:
    """
    Genera un artículo completo con Claude en ES/EN/FR.
    Devuelve dict con todos los campos del frontmatter + contenido.
    """

    avoid = ", ".join(published_today) if published_today else "ninguno"

    user_message = f"""
Ciclo actual: {cycle}
Artículos ya publicados hoy (evita repetir temática): {avoid}

Genera un nuevo artículo editorial sobre Cádiz. Devuelve un JSON con este formato exacto:

{{
  "title_es": "...",
  "title_en": "...",
  "title_fr": "...",
  "slug": "slug-sin-acentos-ni-espacios",
  "excerpt_es": "Resumen de máximo 200 caracteres...",
  "excerpt_en": "...",
  "excerpt_fr": "...",
  "category": "fiestas|turismo|gastronomia|cultura",
  "author": "slug-del-autor",
  "image_prompt": "Descripción detallada para fal.ai en inglés, realista, Cádiz...",
  "image_alt_es": "Descripción accesible de la imagen",
  "image_alt_en": "...",
  "image_alt_fr": "...",
  "content_es": "Contenido completo en Markdown (400-900 palabras)...",
  "content_en": "...",
  "content_fr": "...",
  "tags": ["tag1", "tag2", "tag3"],
  "is_featured": false
}}
"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=8000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}]
    )

    try:
        # Extrae el JSON de la respuesta
        text = response.content[0].text
        start = text.find("{")
        end = text.rfind("}") + 1
        data = json.loads(text[start:end])
        return data
    except (json.JSONDecodeError, IndexError) as e:
        print(f"  Error parseando respuesta: {e}")
        return None
```

---

## tools/markdown_writer.py

```python
from datetime import datetime, timezone
from pathlib import Path

def write_article(article: dict, lang: str) -> None:
    """Escribe el archivo Markdown del artículo para el idioma dado."""

    date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    filename = f"{date_str}-{article['slug']}.md"
    filepath = Path(f"src/content/articles/{lang}/{filename}")
    filepath.parent.mkdir(parents=True, exist_ok=True)

    published_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    frontmatter = f"""---
title: "{article[f'title_{lang}']}"
slug: "{article['slug']}"
excerpt: "{article[f'excerpt_{lang}']}"
category: "{article['category']}"
author: "{article['author']}"
publishedAt: "{published_at}"
image: "{article['image']}"
imageAlt: "{article[f'image_alt_{lang}']}"
imageCredit: "Imagen generada con IA (fal.ai)"
isAiGenerated: true
isFeatured: {str(article.get('is_featured', False)).lower()}
tags: {article['tags']}
---

{article[f'content_{lang}']}
"""

    filepath.write_text(frontmatter, encoding="utf-8")
```

---

## tools/git_publisher.py

```python
import subprocess
import os

def commit_and_push(message: str) -> bool:
    """Hace git commit y push de todos los cambios."""

    # Configura identidad Git (requerido en GitHub Actions)
    subprocess.run(["git", "config", "user.email", "openclaw@cadiz.is"])
    subprocess.run(["git", "config", "user.name", "OpenClaw"])

    # Stage todos los archivos nuevos/modificados
    subprocess.run(["git", "add", "."], check=True)

    # Verifica si hay cambios que commitear
    result = subprocess.run(
        ["git", "diff", "--staged", "--quiet"],
        capture_output=True
    )

    if result.returncode == 0:
        print("No hay cambios para commitear")
        return False

    # Commit
    subprocess.run(["git", "commit", "-m", message], check=True)

    # Push
    subprocess.run(["git", "push", "origin", "main"], check=True)

    return True
```

---

## Reglas del agente (sin cambios respecto al original)

Las reglas de contenido son idénticas al proyecto original:

**PROHIBIDO**: política, muertes, crímenes, polémicas, crisis, desastres

**PERMITIDO**: fiestas (30%), turismo (30%), gastronomía (25%), cultura (15%)

**Ciclos**:
- **Mañana** (08:00 CET): noticias del día + 4 artículos
- **Tarde** (16:00 CET): profundidad cultural + 4 artículos
- **Noche** (00:00 CET): evergreen + 4 artículos

**Autores**: los mismos 10 autores editoriales gaditanos con mismas especialidades

---

## Diferencias clave respecto al agente original

| Aspecto | WebBlogCadiz.is | WebBlogEstaticaCadiz.is |
|---------|----------------|------------------------|
| **Publicación** | HTTP POST a Django API | git commit + push |
| **Imágenes** | DALL-E 3 (OpenAI) | fal.ai API |
| **Almacenamiento** | PostgreSQL | Archivos Markdown/JSON |
| **Idiomas** | Campos en BD (django-parler) | Archivos separados por carpeta |
| **Autenticación** | Token Bearer (CADIZ_API_TOKEN) | GITHUB_TOKEN (automático) |
| **API KEY necesaria** | OPENAI_API_KEY | FAL_KEY |
