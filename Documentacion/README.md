# Documentación — WebBlogEstaticaCadiz.is

Documentación completa del portal estático cadiz.is con OpenClaw.

---

## Índice

| # | Documento | Descripción |
|---|-----------|-------------|
| 01 | [Comparativa de Frameworks](01-comparativa-frameworks.md) | Next.js vs Astro.js — por qué elegimos Astro |
| 02 | [Arquitectura Estática](02-arquitectura-estatica.md) | Cómo funciona el sitio sin backend ni base de datos |
| 03 | [Astro Setup](03-astro-setup.md) | Instalación, configuración y estructura base |
| 04 | [Sistema de Contenido](04-contenido-markdown.md) | Artículos Markdown, events.json, places.json |
| 05 | [Internacionalización](05-i18n-estatico.md) | i18n en Astro: ES/EN/FR con routing nativo |
| 06 | [Diseño y Estilos](06-design-styles.md) | Paleta, tipografía, componentes CSS |
| 07 | [Deploy GitHub Pages](07-deploy-github-pages.md) | Configuración y workflow de deploy gratuito |
| 08 | [OpenClaw Estático](08-openclaw-estatico.md) | Agente IA adaptado para publicar via Git |
| 09 | [fal.ai Imágenes](09-fal-ai-imagenes.md) | Generación de imágenes con FLUX, mejor precio que DALL-E |
| 10 | [GitHub Actions](10-github-actions.md) | Workflows de deploy y automatización del agente |
| 11 | [Guía de Migración](11-migracion-desde-dinamica.md) | Migrar desde WebBlogCadiz.is (Django + React) |

---

## Decisiones clave

- **Astro.js** sobre Next.js: diseñado para contenido estático, zero JS por defecto, i18n nativo
- **fal.ai FLUX** sobre DALL-E 3: ~$0.003/img vs $0.080/img, misma calidad — ahorro de ~$27/mes
- **GitHub Pages** para deploy: gratuito, CDN global, automático con GitHub Actions
- **OpenClaw publica via Git**: escribe archivos Markdown y hace commit — sin servidor ni API

---

## Stack completo

```
Astro.js 4      → Framework estático (HTML puro)
fal.ai FLUX     → Generación de imágenes (OpenClaw)
Claude API      → Generación de contenido (OpenClaw)
GitHub Pages    → Hosting estático gratuito
GitHub Actions  → CI/CD y automatización del agente
```
