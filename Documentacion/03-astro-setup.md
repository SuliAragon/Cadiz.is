# 03 — Astro Setup

## Instalación

```bash
# Crear proyecto Astro
npm create astro@latest WebBlogEstaticaCadiz.is

# Durante el wizard:
# ✓ How would you like to start your new project? Empty
# ✓ Install dependencies? Yes
# ✓ Do you plan to write TypeScript? No (usamos JS)
# ✓ Initialize a new git repository? Yes

cd WebBlogEstaticaCadiz.is
```

## Dependencias adicionales

```bash
# Integración de imágenes optimizadas (ya incluida en Astro 4)

# Sitemap automático
npm install @astrojs/sitemap

# RSS feed
npm install @astrojs/rss

# Optimización de imágenes sharp
npm install sharp
```

---

## astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://USUARIO.github.io',
  base: '/cadiz-is',   // Nombre del repositorio en GitHub

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-ES',
          en: 'en-US',
          fr: 'fr-FR',
        },
      },
    }),
  ],

  // Internacionalización
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'fr'],
    routing: {
      prefixDefaultLocale: true,  // /es/, /en/, /fr/
    },
  },

  // Build estático (GitHub Pages)
  output: 'static',

  // Carpeta de salida
  outDir: './dist',

  // Markdown
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
```

---

## package.json

```json
{
  "name": "webcadiz-is",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^4.0.0",
    "@astrojs/sitemap": "^3.0.0",
    "@astrojs/rss": "^4.0.0",
    "sharp": "^0.33.0"
  }
}
```

---

## Content Collections (src/content/config.js)

Astro valida el frontmatter de los Markdown mediante Zod. Define los schemas:

```javascript
import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string(),
    category: z.enum(['fiestas', 'turismo', 'gastronomia', 'cultura']),
    author: z.string(),
    publishedAt: z.coerce.date(),
    image: z.string(),
    imageAlt: z.string(),
    imageCredit: z.string().optional(),
    isAiGenerated: z.boolean().default(true),
    tags: z.array(z.string()).default([]),
    isFeatured: z.boolean().default(false),
  }),
});

export const collections = { articles };
```

---

## Estructura de carpetas src/content/

```
src/content/
├── config.js              # Schemas de validación
├── articles/
│   ├── es/                # Artículos en español
│   │   └── YYYY-MM-DD-slug.md
│   ├── en/                # Artículos en inglés
│   │   └── YYYY-MM-DD-slug.md
│   └── fr/                # Artículos en francés
│       └── YYYY-MM-DD-slug.md
├── events/
│   └── events.json        # Todos los eventos
├── places/
│   └── places.json        # Todos los lugares
└── authors/
    └── authors.json       # Los 10 autores editoriales
```

---

## Páginas básicas (src/pages/)

```
src/pages/
├── index.astro            # Redirect automático a /es/
├── es/
│   ├── index.astro        # Home ES
│   ├── [category].astro   # /es/fiestas, /es/turismo, etc.
│   ├── articulos/
│   │   └── [slug].astro   # /es/articulos/slug-del-articulo
│   ├── agenda.astro       # /es/agenda
│   ├── lugares.astro      # /es/lugares
│   └── quiz.astro         # /es/quiz
├── en/
│   ├── index.astro
│   ├── [category].astro
│   ├── articles/
│   │   └── [slug].astro
│   ├── agenda.astro
│   └── places.astro
└── fr/
    ├── index.astro
    ├── [category].astro
    ├── articles/
    │   └── [slug].astro
    ├── agenda.astro
    └── lieux.astro
```

---

## Layout base (src/layouts/BaseLayout.astro)

```astro
---
const { title, description, image, lang = 'es' } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!DOCTYPE html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title} | cadiz.is</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    {image && <meta property="og:image" content={image} />}

    <!-- Fuentes -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Source+Serif+4:wght@400;600&family=DM+Sans:wght@400;500&display=swap" />

    <link rel="stylesheet" href="/styles/global.css" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

---

## Variables de entorno

No hay variables de entorno en el sitio Astro (es puramente estático). Las variables solo las necesita el **agente OpenClaw** en GitHub Actions:

```env
# Solo para GitHub Actions (OpenClaw)
ANTHROPIC_API_KEY=sk-ant-...
FAL_KEY=fal-...
```

El sitio Astro no hace fetch a APIs externas — todo el contenido está en el repo.
