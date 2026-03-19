# cadiz.is — Web estática

Blog editorial sobre Cádiz, desplegado en **GitHub Pages** como sitio 100% estático.
Contenido versionado en Git (Markdown + JSON), sin backend ni base de datos.

---

## Por qué estático

El proyecto original (WebBlogCadiz.is) usaba Django + React con un backend en Railway (coste mensual). Al migrar a una arquitectura estática:

- **Deploy gratuito** con GitHub Pages
- **Sin servidor backend** — el contenido vive como archivos Markdown/JSON en el repositorio
- **Velocidad máxima** — HTML/CSS servido directamente desde CDN de GitHub
- **Integración con OpenClaw** (a desarrollar por separado) — el agente generará contenido, lo commitará y GitHub Actions redespliegará la web automáticamente

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | **Astro 4** — output estático |
| Estilos | Vanilla CSS (variables + global) |
| i18n | Astro i18n nativo — `/es/`, `/en/`, `/fr/` |
| Contenido | Markdown + JSON (Content Collections) |
| Imágenes | `public/images/` versionadas en Git |
| Deploy | **GitHub Pages** via Actions |
| CI/CD | GitHub Actions (`deploy.yml`) |

---

## Estructura del proyecto

```
src/
├── content/
│   ├── config.ts              ← schema de Content Collections
│   ├── articles/
│   │   ├── es/                ← YYYY-MM-DD-slug.md
│   │   ├── en/
│   │   └── fr/
│   ├── events.json
│   ├── places.json
│   └── authors.json
├── pages/
│   ├── index.astro            ← redirect → /es/
│   ├── es/
│   │   ├── index.astro        ← portada ES
│   │   ├── [category].astro   ← fiestas/turismo/gastronomia/cultura
│   │   ├── articulos/[slug].astro
│   │   ├── agenda.astro
│   │   ├── lugares.astro
│   │   └── quiz.astro
│   ├── en/                    ← mismas páginas en inglés
│   └── fr/                    ← mismas páginas en francés
├── components/
│   ├── layout/ (Navbar, Footer, LanguageSwitcher)
│   ├── articles/ (ArticleCard, ArticleGrid)
│   ├── events/ (EventCard, EventFeatured)
│   ├── places/ (PlaceCard)
│   └── ui/ (Badge, AiBadge)
├── layouts/
│   └── BaseLayout.astro
├── i18n/
│   ├── es.json / en.json / fr.json
│   ├── index.ts               ← helper t() + CATEGORIES + getLangFromUrl()
│   └── quizQuestions.ts
└── styles/
    ├── variables.css
    └── global.css

public/
└── images/
    ├── articles/
    ├── events/
    ├── places/
    └── authors/

.github/
└── workflows/
    └── deploy.yml             ← build + deploy automático en push a main
```

---

## Arrancar en local

```bash
npm install
npm run dev      # http://localhost:4321/cadiz-is/es/
npm run build    # genera dist/
npm run preview  # previsualiza el build
```

---

## Añadir un artículo manualmente

1. Crea el fichero en `src/content/articles/{lang}/YYYY-MM-DD-slug.md`
2. Rellena el frontmatter (ver ejemplo abajo)
3. `git commit + git push` → GitHub Actions construye y despliega (~2 min)

```markdown
---
title: "Título del artículo"
slug: "slug-del-articulo"
excerpt: "Resumen de una frase."
category: "fiestas"  # fiestas | turismo | gastronomia | cultura
author: "rocio-fernandez"
publishedAt: "2026-03-20T08:00:00Z"
image: "/images/articles/nombre-imagen.webp"
imageAlt: "Descripción de la imagen"
imageCredit: "Crédito de la imagen"
isAiGenerated: true
isFeatured: false
tags: ["etiqueta1", "etiqueta2"]
---

Contenido en Markdown...
```

---

## Actualizar eventos y lugares

- **Eventos**: edita `src/content/events.json` — los pasados se filtran automáticamente
- **Lugares**: edita `src/content/places.json`
- **Autores**: edita `src/content/authors.json`

---

## Configurar deploy en GitHub Pages

1. En `astro.config.mjs`, cambia `site` y `base` por tu usuario/repositorio real
2. En GitHub → Settings → Pages → Source → **GitHub Actions**
3. Haz push a `main` → se despliega automáticamente

---

## Páginas disponibles

| Ruta ES | Ruta EN | Ruta FR |
|---------|---------|---------|
| `/es/` | `/en/` | `/fr/` |
| `/es/fiestas` | `/en/fiestas` | `/fr/fiestas` |
| `/es/turismo` | `/en/turismo` | `/fr/turismo` |
| `/es/gastronomia` | `/en/gastronomia` | `/fr/gastronomia` |
| `/es/cultura` | `/en/cultura` | `/fr/cultura` |
| `/es/articulos/{slug}` | `/en/articles/{slug}` | `/fr/articles/{slug}` |
| `/es/agenda` | `/en/agenda` | `/fr/agenda` |
| `/es/lugares` | `/en/places` | `/fr/lieux` |
| `/es/quiz` | `/en/quiz` | `/fr/quiz` |

---

## Automatización con OpenClaw (a desarrollar)

El agente OpenClaw publicará contenido de forma autónoma:
1. Genera artículos en ES/EN/FR con Claude API
2. Genera imágenes con fal.ai FLUX.1
3. Escribe los `.md` en `src/content/articles/`
4. Hace `git commit + git push`
5. GitHub Actions detecta el push → Astro build → despliega en Pages

Ver documentación en `Documentacion/`.

---

## Documentación

| Archivo | Descripción |
|---------|-------------|
| [01-comparativa-frameworks.md](Documentacion/01-comparativa-frameworks.md) | Next.js vs Astro — por qué Astro |
| [02-arquitectura-estatica.md](Documentacion/02-arquitectura-estatica.md) | Cómo funciona sin backend |
| [03-astro-setup.md](Documentacion/03-astro-setup.md) | Configuración Astro |
| [04-contenido-markdown.md](Documentacion/04-contenido-markdown.md) | Sistema de contenido |
| [05-i18n-estatico.md](Documentacion/05-i18n-estatico.md) | Internacionalización |
| [06-design-styles.md](Documentacion/06-design-styles.md) | Sistema de diseño |
| [07-deploy-github-pages.md](Documentacion/07-deploy-github-pages.md) | Deploy en GitHub Pages |
| [10-github-actions.md](Documentacion/10-github-actions.md) | Workflow de deploy |
| [11-migracion-desde-dinamica.md](Documentacion/11-migracion-desde-dinamica.md) | Migración desde WebBlogCadiz.is |
