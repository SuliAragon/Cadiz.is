# 11 — Guía de Migración desde WebBlogCadiz.is (Dinámica → Estática)

## Resumen de cambios

| Aspecto | WebBlogCadiz.is (original) | WebBlogEstaticaCadiz.is (nuevo) |
|---------|---------------------------|--------------------------------|
| **Backend** | Django 4.2 + DRF | Sin backend |
| **Base de datos** | SQLite / PostgreSQL | Sin BD (archivos en repo) |
| **Frontend** | React 19 + Vite | Astro.js 4 |
| **Routing** | React Router DOM | Astro file-based routing |
| **Estado global** | Zustand | Sin estado (HTML estático) |
| **Fetch de datos** | axios → API Django | `getCollection()` de Astro |
| **i18n frontend** | react-i18next | Astro i18n + JSON files |
| **i18n backend** | django-parler | Carpetas por idioma |
| **Imágenes** | DALL-E 3 | fal.ai FLUX |
| **Deploy backend** | Railway (~$5-10/mes) | Sin backend → $0 |
| **Deploy frontend** | GitHub Pages | GitHub Pages (igual) |
| **Agente publica** | HTTP POST a API | git commit + push |
| **Total coste** | ~$5-10/mes | $0/mes (+ fal.ai ~$1/mes) |

---

## Qué se mantiene igual

- **Identidad visual**: misma paleta, tipografías, diseño de cards
- **Contenido**: mismas categorías (Fiestas, Turismo, Gastronomía, Cultura)
- **Autores editoriales**: los 10 mismos autores gaditanos
- **Reglas de contenido**: mismo tono positivo, mismo contenido prohibido
- **Ciclos de publicación**: 3 veces al día (mañana, tarde, noche)
- **Multiidioma**: ES/EN/FR
- **Páginas**: Home, Categorías, Artículo, Agenda, Lugares, Quiz

---

## Qué cambia o se simplifica

### Sin páginas de detalle de lugar con mapa
En el proyecto original, `PlaceDetailPage` usaba coordenadas GPS para mostrar un mapa. En la versión estática, podemos incluir un mapa embed de OpenStreetMap (iFrame estático) o simplemente mostrar la información sin mapa interactivo.

### Sin contador de vistas en tiempo real
El contador `views` de los artículos era un campo en la base de datos que se incrementaba en cada visita. En estático, esto no es posible sin un servicio externo. **Solución**: añadir Umami Analytics (script externo, gratuito).

### Sin búsqueda dinámica
El endpoint `/api/articles/search/` de Django permitía búsqueda full-text. En estático usamos **Pagefind**, que indexa el HTML durante el build.

### Sin quiz interactivo guardado
El quiz era solo frontend (sin BD), así que se puede mantener igual usando JavaScript vanilla en un componente Astro con `client:load`.

---

## Plan de migración paso a paso

### Fase 1: Preparación del repositorio (1-2 horas)
```bash
# 1. Crear nuevo repositorio GitHub "cadiz-is" (público)
# 2. Inicializar proyecto Astro
npm create astro@latest cadiz-is
cd cadiz-is

# 3. Configurar astro.config.mjs (ver doc 03)
# 4. Instalar dependencias
npm install @astrojs/sitemap sharp

# 5. Configurar GitHub Pages y Actions (ver doc 07 y 10)
```

### Fase 2: Migrar el contenido existente (2-3 horas)
```bash
# Exportar artículos de Django a Markdown
python backend/scripts/export_to_markdown.py

# El script genera:
# - src/content/articles/es/YYYY-MM-DD-slug.md
# - src/content/articles/en/YYYY-MM-DD-slug.md
# - src/content/articles/fr/YYYY-MM-DD-slug.md

# Exportar eventos a JSON
python backend/scripts/export_events.py
# → src/content/events/events.json

# Exportar lugares a JSON
python backend/scripts/export_places.py
# → src/content/places/places.json

# Exportar autores a JSON
python backend/scripts/export_authors.py
# → src/content/authors/authors.json
```

### Fase 3: Recrear el frontend en Astro (8-12 horas)
```
Componentes a recrear:
├── Layout (Navbar, Footer, LanguageSwitcher)
├── ArticleCard, ArticleGrid, ArticleHero
├── EventCard, EventFeatured, DaysUntil
├── PlaceCard
└── UI (AiBadge, AuthorByline, Badge)

Páginas a recrear:
├── es/index.astro (Home)
├── es/[category].astro
├── es/articulos/[slug].astro
├── es/agenda.astro
├── es/lugares.astro
└── es/quiz.astro
(repetir para /en/ y /fr/)
```

### Fase 4: Adaptar OpenClaw (2-3 horas)
```
Cambios en el agente:
├── Eliminar: llamadas HTTP a Django API
├── Añadir: escritura de archivos Markdown
├── Cambiar: DALL-E 3 → fal.ai
├── Añadir: git commit + push
└── Mantener: prompts, reglas, autores, ciclos
```

### Fase 5: Testing y deploy (1-2 horas)
```bash
# Test local
npm run dev
# → http://localhost:4321/cadiz-is/es/

# Build de prueba
npm run build
npm run preview

# Deploy
git push origin main
# → GitHub Actions construye y despliega automáticamente
```

---

## Script de exportación de artículos (Django → Markdown)

```python
# backend/scripts/export_to_markdown.py
"""
Exporta todos los artículos publicados de Django a archivos Markdown.
Ejecutar una sola vez durante la migración.
"""

import os
import django
import json
from pathlib import Path
from datetime import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cadiz.settings')
django.setup()

from articles.models import Article

def slugify_path(slug, published_at):
    date = published_at.strftime("%Y-%m-%d")
    return f"{date}-{slug}"

def export_article(article):
    for lang in ['es', 'en', 'fr']:
        try:
            article.set_current_language(lang)
            title = article.title
            content = article.content
            excerpt = article.excerpt
            image_alt = article.image_alt or ""
        except Exception:
            continue  # Skip si no hay traducción

        filename = f"{slugify_path(article.slug, article.published_at)}.md"
        filepath = Path(f"../src/content/articles/{lang}/{filename}")
        filepath.parent.mkdir(parents=True, exist_ok=True)

        author_slug = article.author.slug if article.author else "redaccion"
        category_slug = article.category.slug if article.category else "cultura"
        published_iso = article.published_at.strftime("%Y-%m-%dT%H:%M:%SZ")
        tags = [tag.name for tag in article.tags.all()]

        frontmatter = f"""---
title: "{title.replace('"', "'")}"
slug: "{article.slug}"
excerpt: "{excerpt.replace('"', "'")[:200]}"
category: "{category_slug}"
author: "{author_slug}"
publishedAt: "{published_iso}"
image: "{article.image_url or f'/images/fallback/{category_slug}.webp'}"
imageAlt: "{image_alt.replace('"', "'")}"
imageCredit: "{article.image_credit or ''}"
isAiGenerated: {str(article.is_ai_generated).lower()}
isFeatured: {str(article.is_featured).lower()}
tags: {json.dumps(tags)}
---

{content}
"""
        filepath.write_text(frontmatter, encoding="utf-8")
        print(f"  ✓ {lang}/{filename}")

# Exportar todos los artículos publicados
articles = Article.objects.filter(status='published').order_by('-published_at')
print(f"Exportando {articles.count()} artículos...")
for article in articles:
    export_article(article)

print("Exportación completada.")
```

---

## Checklist de migración

- [ ] Repositorio GitHub creado y configurado
- [ ] Proyecto Astro inicializado
- [ ] `astro.config.mjs` configurado con `site` y `base`
- [ ] Secrets `ANTHROPIC_API_KEY` y `FAL_KEY` configurados
- [ ] Workflow `deploy.yml` funcionando
- [ ] Workflow `openclaw.yml` configurado
- [ ] Artículos exportados a Markdown
- [ ] `events.json` generado desde Django
- [ ] `places.json` generado desde Django
- [ ] `authors.json` creado
- [ ] Paleta de colores y tipografía replicadas
- [ ] Componentes recreados en Astro
- [ ] Páginas ES/EN/FR funcionando
- [ ] i18n configurado y funcionando
- [ ] Build estático generando correctamente
- [ ] GitHub Pages mostrando el sitio
- [ ] OpenClaw adaptado publica un artículo de prueba
- [ ] El push de OpenClaw dispara el rebuild automáticamente
- [ ] Imágenes de fallback en `public/images/fallback/`
- [ ] Railway (backend Django) apagado para eliminar costes
