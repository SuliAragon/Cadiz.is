# 04 — Sistema de Contenido con Markdown

## Cómo se organiza el contenido

En lugar de una base de datos, todo el contenido vive como archivos Markdown en el repositorio Git. Cada vez que OpenClaw publica un artículo, simplemente crea nuevos archivos `.md` y hace commit.

---

## Estructura de archivos de artículos

### Convención de nombres
```
YYYY-MM-DD-slug-del-articulo.md
```

Ejemplo:
```
2026-03-18-carnaval-cadiz-2026-record-participacion.md
```

### Organización por idioma
```
src/content/articles/
├── es/
│   └── 2026-03-18-carnaval-cadiz-2026-record-participacion.md
├── en/
│   └── 2026-03-18-cadiz-carnival-2026-record-participation.md
└── fr/
    └── 2026-03-18-carnaval-cadix-2026-record-participation.md
```

---

## Frontmatter de artículo (ES)

```markdown
---
title: "El Carnaval de Cádiz 2026 bate récords de participación"
slug: "carnaval-cadiz-2026-record-participacion"
excerpt: "Más de 150 comparsas y chirigotas llenarán el Teatro Falla y las calles gaditanas en la edición más multitudinaria de los últimos años."
category: "fiestas"
author: "rocio-fernandez"
publishedAt: "2026-03-18T08:00:00Z"
image: "/images/articles/carnaval-cadiz-2026-record.webp"
imageAlt: "Vista panorámica del Gran Teatro Falla durante el Carnaval de Cádiz 2026"
imageCredit: "Imagen generada con IA (fal.ai)"
isAiGenerated: true
isFeatured: false
tags: ["carnaval", "fiestas", "2026", "teatro-falla"]
---

El Carnaval de Cádiz 2026 promete batir todos los récords...

(cuerpo del artículo en Markdown)
```

---

## Campos del frontmatter

| Campo | Tipo | Descripción | Generado por |
|-------|------|-------------|--------------|
| `title` | string | Título del artículo | OpenClaw |
| `slug` | string | URL única (sin acentos, guiones) | OpenClaw |
| `excerpt` | string | Resumen (máx 200 chars) | OpenClaw |
| `category` | enum | `fiestas` / `turismo` / `gastronomia` / `cultura` | OpenClaw |
| `author` | string | Slug del autor (ej: `rocio-fernandez`) | OpenClaw |
| `publishedAt` | ISO 8601 | Fecha y hora de publicación | OpenClaw |
| `image` | string | Ruta a imagen en `/public/images/` | OpenClaw |
| `imageAlt` | string | Texto alternativo accesible | OpenClaw |
| `imageCredit` | string | Crédito de imagen | OpenClaw |
| `isAiGenerated` | boolean | Siempre `true` para OpenClaw | OpenClaw |
| `isFeatured` | boolean | Destacado en home | OpenClaw |
| `tags` | string[] | Etiquetas (lowercase, guiones) | OpenClaw |

---

## Estructura del cuerpo del artículo

OpenClaw genera el artículo con esta estructura:

```markdown
## Introducción

Párrafo de introducción contextual...

## Desarrollo

Contenido principal desarrollado...

## Detalles

Información adicional relevante...

## Cómo llegar / Dónde ir / Para saber más

Información práctica para el visitante...

---
*Artículo generado por OpenClaw, el asistente editorial de cadiz.is*
```

---

## Reglas de escritura para artículos

- **Longitud**: 400-900 palabras en español (ideal), máximo 1200
- **Tono**: positivo, amigable, turístico, inspirador
- **Formato**: Markdown con `##` para secciones, `**negrita**` para destacados
- **Idiomas EN/FR**: traducción natural, no literal
- **Sin política, crímenes, polémicas** (igual que en el proyecto original)

---

## events.json — estructura completa

```json
{
  "lastUpdated": "2026-03-18T08:00:00Z",
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
        "es": "El mayor festival de humor y música de España, declarado de Interés Turístico Internacional.",
        "en": "Spain's greatest humour and music festival, declared of International Tourist Interest.",
        "fr": "Le plus grand festival d'humour et de musique d'Espagne, déclaré d'Intérêt Touristique International."
      },
      "locationName": {
        "es": "Gran Teatro Falla y casco histórico",
        "en": "Gran Teatro Falla and historic centre",
        "fr": "Gran Teatro Falla et centre historique"
      },
      "startDate": "2026-02-28",
      "endDate": "2026-03-10",
      "startTime": "10:00",
      "category": "fiestas",
      "isFeatured": true,
      "image": "/images/events/carnaval-2026.webp",
      "isAiGenerated": false
    }
  ]
}
```

**Reglas para events.json:**
- Máximo **7 eventos** activos
- El **más próximo** es `isFeatured: true`
- OpenClaw elimina eventos con `endDate < hoy` antes de añadir nuevos
- Las descripciones: 120-160 caracteres, sin puntos suspensivos

---

## places.json — estructura completa

```json
{
  "places": [
    {
      "id": "playa-la-caleta",
      "slug": "playa-la-caleta",
      "name": {
        "es": "Playa La Caleta",
        "en": "La Caleta Beach",
        "fr": "Plage La Caleta"
      },
      "description": {
        "es": "La playa más icónica y céntrica de Cádiz, enmarcada entre dos castillos.",
        "en": "Cadiz's most iconic and central beach, framed by two castles.",
        "fr": "La plage la plus emblématique de Cadix, encadrée par deux châteaux."
      },
      "tips": {
        "es": "Mejor visitarla al atardecer para ver la puesta de sol sobre el Atlántico.",
        "en": "Best visited at sunset to see the sun set over the Atlantic.",
        "fr": "Idéale au coucher du soleil pour voir le soleil se coucher sur l'Atlantique."
      },
      "type": "playa",
      "latitude": 36.5271,
      "longitude": -6.3097,
      "image": "/images/places/playa-la-caleta.webp",
      "imageCredit": "Imagen generada con IA (fal.ai)",
      "isFeatured": true
    }
  ]
}
```

---

## authors.json — los 10 autores editoriales

```json
{
  "authors": [
    {
      "id": "rocio-fernandez",
      "slug": "rocio-fernandez",
      "name": "Rocío Fernández",
      "gender": "femenino",
      "photo": "/images/authors/rocio-fernandez.webp",
      "bio": {
        "es": "Especialista en el Carnaval de Cádiz con más de 15 años cubriendo el Gran Teatro Falla.",
        "en": "Specialist in the Cadiz Carnival with over 15 years covering the Gran Teatro Falla.",
        "fr": "Spécialiste du Carnaval de Cadix avec plus de 15 ans de couverture du Gran Teatro Falla."
      },
      "categories": ["fiestas"],
      "specialties": ["carnaval", "musica", "cultura-popular"]
    }
  ]
}
```
