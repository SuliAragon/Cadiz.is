# 01 — Comparativa: Next.js vs Astro.js

## Contexto de la decisión

El profesor ha propuesto migrar el portal cadiz.is a una arquitectura estática para desplegarlo gratuitamente en GitHub Pages. Las dos alternativas principales son:

- **Next.js** con export estático (`output: 'export'`)
- **Astro.js** con generación estática nativa

---

## Comparativa Técnica

| Criterio | Next.js (Static Export) | Astro.js 4 |
|----------|------------------------|------------|
| **Propósito** | Framework React (SSR/SSG/SPA) | Framework multi-framework orientado a contenido |
| **JS en cliente** | Alto — React runtime siempre presente | Mínimo — Zero JS por defecto (solo donde se necesita) |
| **Velocidad de carga** | Buena | Excelente (Lighthouse 100 habitual) |
| **Markdown nativo** | Via `gray-matter` + config manual | Nativo con Content Collections |
| **i18n estático** | Requiere configuración extra | Routing i18n nativo (`/es/`, `/en/`, `/fr/`) |
| **Imágenes optimizadas** | `next/image` (requiere servidor o Vercel) | `astro:assets` (funciona en estático) |
| **Curva de aprendizaje** | Media-alta (requiere conocer React bien) | Baja-media (sintaxis tipo HTML + componentes) |
| **Compatibilidad GitHub Pages** | Requiere `output: 'export'` + ajustes | Diseñado para deploy estático |
| **Ecosistema** | Enorme (React) | Creciente, soporta React/Vue/Svelte si se necesita |
| **Tamaño del bundle** | ~200-400KB base | ~0-50KB base |
| **Content Collections** | No nativo | Sí, con validación Zod integrada |
| **RSS/Sitemap** | Plugins externos | Integración oficial `@astrojs/sitemap` |

---

## Por qué elegimos Astro.js

### 1. Diseñado para contenido estático
Astro nació para blogs y portales de contenido. El sistema de **Content Collections** permite organizar artículos en Markdown con frontmatter tipado, exactamente lo que necesitamos para que OpenClaw publique artículos.

```
src/content/articles/
├── es/
│   └── 2026-03-18-carnaval-cadiz.md
├── en/
│   └── 2026-03-18-cadiz-carnival.md
└── fr/
    └── 2026-03-18-carnaval-cadiz-fr.md
```

### 2. Zero JS por defecto
Para un blog de contenido, no necesitamos React en el cliente. Astro sirve HTML puro, lo que resulta en páginas que cargan en milisegundos. Si en algún componente necesitamos interactividad (ej. el quiz), podemos añadir JavaScript selectivo con `client:load`.

### 3. i18n nativo
Astro 4 incluye routing multiidioma nativo. Con un objeto de configuración, automáticamente genera rutas `/es/`, `/en/`, `/fr/` sin plugins externos.

### 4. Compatibilidad perfecta con GitHub Pages
El comando `astro build` genera una carpeta `dist/` con HTML estático puro, sin dependencias de servidor Node.js. Solo hay que apuntar GitHub Pages a esa carpeta.

### 5. Imágenes optimizadas en estático
`astro:assets` optimiza imágenes en tiempo de build. Las imágenes que descarga OpenClaw de fal.ai se procesan automáticamente (WebP, tamaños responsive).

---

## Limitaciones conocidas de Astro para este proyecto

| Limitación | Solución |
|-----------|----------|
| Sin base de datos ni API propia | Todo el contenido vive en archivos Markdown/JSON en el repo |
| Sin contador de vistas en tiempo real | Podría usarse Umami Analytics o similar (script externo) |
| Sin búsqueda dinámica | Pagefind (búsqueda estática offline) o Algolia |
| Sin formularios de contacto | Formspree, Netlify Forms o similar (servicio externo) |
| Rebuild necesario para nuevo contenido | GitHub Actions ejecuta el build automáticamente tras cada commit de OpenClaw |

---

## Conclusión

**Astro.js es la elección correcta** para este proyecto porque:

1. Es la herramienta más adecuada para un portal de contenido estático
2. OpenClaw puede publicar simplemente haciendo `git commit` + `git push` con nuevos archivos Markdown
3. GitHub Actions reconstruye el sitio automáticamente tras cada push
4. El resultado es un sitio con rendimiento perfecto y coste cero

Next.js sería preferible si en el futuro necesitáramos Server Components, autenticación de usuarios, o una API backend integrada — casos de uso que no aplican aquí.
