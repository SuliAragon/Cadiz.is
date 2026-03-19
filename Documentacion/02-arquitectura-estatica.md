# 02 — Arquitectura Estática

## De dinámico a estático: el cambio conceptual

En el proyecto original (WebBlogCadiz.is), la arquitectura era:

```
Usuario → React SPA → Django REST API → SQLite/PostgreSQL
                              ↑
                         OpenClaw (via HTTP POST)
```

En la arquitectura estática:

```
Usuario → HTML estático (GitHub Pages CDN)
               ↑
         Astro build (GitHub Actions)
               ↑
         Archivos Markdown/JSON en el repo
               ↑
         OpenClaw (git commit + push)
```

**No hay servidor.** No hay base de datos. Todo son archivos.

---

## Dónde vive el contenido

### Antes (WebBlogCadiz.is)
- **Artículos**: filas en tabla `articles` de SQLite/PostgreSQL
- **Imágenes**: URL apuntando a un servidor o servicio externo
- **Eventos**: filas en tabla `events`
- **Lugares**: filas en tabla `places`

### Ahora (WebBlogEstaticaCadiz.is)
- **Artículos**: archivos `.md` en `src/content/articles/{idioma}/`
- **Imágenes**: archivos `.webp` en `public/images/articles/`
- **Eventos**: archivo `src/content/events/events.json`
- **Lugares**: archivo `src/content/places/places.json`
- **Autores**: archivo `src/content/authors/authors.json`

---

## Flujo completo de publicación

```
1. GitHub Actions ejecuta openclaw.yml (cron)
          │
          ▼
2. OpenClaw (Python + Claude SDK) arranca
          │
          ▼
3. Busca noticias sobre Cádiz (web_search)
          │
          ▼
4. Selecciona hasta 4 noticias aptas
          │
          ▼
5. Para cada noticia:
   ├── Genera artículo en ES (Markdown)
   ├── Traduce a EN y FR (Markdown)
   ├── Genera prompt de imagen → llama fal.ai API
   ├── Descarga imagen → guarda en public/images/articles/
   └── Escribe los 3 archivos .md con frontmatter
          │
          ▼
6. Actualiza events.json si hay eventos nuevos/expirados
          │
          ▼
7. git add . && git commit -m "OpenClaw: 4 nuevos artículos [fecha]"
   git push origin main
          │
          ▼
8. GitHub Actions detecta el push → ejecuta deploy.yml
          │
          ▼
9. npm run build (Astro genera HTML estático en dist/)
          │
          ▼
10. Deploy a GitHub Pages (rama gh-pages o carpeta dist)
          │
          ▼
11. En ~2 minutos, el contenido está publicado en producción
```

---

## Estructura de un artículo Markdown

OpenClaw genera archivos con este formato:

```markdown
---
title: "El Carnaval de Cádiz 2026 bate récords de participación"
slug: "carnaval-cadiz-2026-record-participacion"
excerpt: "Más de 150 comparsas y chirigotas llenarán el Falla y las calles gaditanas..."
category: "fiestas"
author: "rocio-fernandez"
publishedAt: "2026-03-18T08:00:00Z"
image: "/images/articles/carnaval-cadiz-2026.webp"
imageAlt: "Vista aérea del Gran Teatro Falla durante el Carnaval de Cádiz"
imageCredit: "Imagen generada con IA (fal.ai)"
isAiGenerated: true
tags: ["carnaval", "fiestas", "cultura", "2026"]
---

El Carnaval de Cádiz 2026 promete ser...

(contenido en Markdown)
```

---

## Estructura de events.json

```json
{
  "events": [
    {
      "id": "carnaval-2026",
      "slug": "carnaval-cadiz-2026",
      "title": {
        "es": "Carnaval de Cádiz 2026",
        "en": "Cadiz Carnival 2026",
        "fr": "Carnaval de Cadix 2026"
      },
      "description": {
        "es": "El mayor festival de humor y música de España...",
        "en": "Spain's greatest humour and music festival...",
        "fr": "Le plus grand festival d'humour et de musique d'Espagne..."
      },
      "startDate": "2026-02-28",
      "endDate": "2026-03-10",
      "locationName": {
        "es": "Gran Teatro Falla y casco histórico",
        "en": "Gran Teatro Falla and historic centre",
        "fr": "Gran Teatro Falla et centre historique"
      },
      "category": "fiestas",
      "isFeatured": true,
      "image": "/images/events/carnaval-2026.webp",
      "isAiGenerated": false
    }
  ]
}
```

---

## Ventajas de esta arquitectura

| Aspecto | Beneficio |
|---------|-----------|
| **Coste** | $0/mes (GitHub Pages es gratuito) |
| **Velocidad** | HTML pre-renderizado servido desde CDN global |
| **Seguridad** | Sin servidor, sin base de datos, sin superficie de ataque |
| **Fiabilidad** | GitHub Pages tiene 99.9%+ uptime |
| **SEO** | HTML estático es lo mejor para indexación |
| **Historial** | Todo el contenido versionado en Git |
| **Backup** | El repo ES el backup |

---

## Limitaciones y cómo las manejamos

### Sin contador de vistas
- **Solución**: Umami Analytics (self-hosted y gratuito) o Plausible
- Script externo, sin impacto en el HTML estático

### Sin búsqueda dinámica
- **Solución**: [Pagefind](https://pagefind.app/) — búsqueda estática que se indexa en el build
- Zero coste, funciona offline

### Sin formularios
- **Solución**: No los necesitamos en este proyecto

### Rebuild para nuevo contenido
- **Solución**: GitHub Actions reconstruye automáticamente en cada push
- Tiempo de build: ~1-2 minutos
- El contenido está live en ~3 minutos tras el commit de OpenClaw
