# Diario de Desarrollo — cadiz.is estático

Registro cronológico del proceso de construcción de `WebBlogEstaticaCadiz.is`,
la versión estática del blog sobre Cádiz, desplegada en GitHub Pages.

---

## Sesión 1 — Arranque del proyecto

### Punto de partida
El proyecto `WebBlogCadiz.is` era un blog dinámico construido con Django + React.
Funcionaba bien pero requería servidor, base de datos y mantenimiento continuo.
La idea fue convertirlo en un sitio 100% estático para poder alojarlo gratis en
GitHub Pages, eliminando toda la infraestructura de backend.

### Decisiones iniciales
- **Framework elegido**: Astro 4 (genera HTML estático en build time, cero JS por defecto)
- **Despliegue**: GitHub Pages en el repositorio `SuliAragon/Cadiz.is`
- **URL inicial**: `https://SuliAragon.github.io/Cadiz.is/`
- **Contenido**: Markdown + JSON versionado en Git (sin base de datos)
- **Idiomas**: ES / EN / FR con routing nativo de Astro (`/es/`, `/en/`, `/fr/`)
- **CSS**: Vanilla CSS con las mismas variables de diseño que el sitio dinámico
- **Fuentes**: Playfair Display (títulos), Inter (cuerpo), DM Sans (UI)
- **Colores**: `--accent: #0466c8` (Azul Atlántico), `--accent-warm: #e07a5f` (Terracota)

### Estructura de carpetas definida
```
src/
  content/articles/{es,en,fr}/   ← Artículos en Markdown
  data/                          ← events.json, places.json, authors.json
  i18n/                          ← Traducciones y helpers
  pages/{es,en,fr}/              ← Rutas por idioma
  components/                    ← Componentes Astro
  layouts/                       ← BaseLayout
  styles/                        ← variables.css + global.css
public/
  images/                        ← Imágenes estáticas
```

---

## Sesión 1 — Construcción del núcleo

### Lo que se construyó
- `astro.config.mjs` con i18n nativo (`prefixDefaultLocale: true`)
- Schema de Content Collections (`src/content/config.ts`) con validación Zod
- Sistema de traducciones `src/i18n/index.ts` con helper `t(lang, key)`
- 10 preguntas de quiz en ES/EN/FR (`src/i18n/quizQuestions.ts`)
- Todos los componentes: `ArticleCard`, `ArticleGrid`, `EventCard`, `EventFeatured`, `PlaceCard`, `Badge`, `AiBadge`
- Layout base con SEO, OG tags y hreflang alternates
- Navbar con selector de idioma y menú móvil en vanilla JS
- Páginas de home, categorías, agenda, lugares, quiz y detalle de artículo para los 3 idiomas
- Primer artículo de muestra: "La Caleta al atardecer" en ES/EN/FR
- Datos en JSON: 4 eventos, 6 lugares, 10 autores
- GitHub Actions workflow (`deploy.yml`) para despliegue automático en push a `main`

### Errores encontrados y soluciones

**Error 1 — `ContentSchemaContainsSlugError`**
Astro reserva el campo `slug` en Content Collections. Lo habíamos nombrado `slug`
en el frontmatter y en el schema. Solución: renombrar a `articleSlug` en todos los
ficheros (config, markdown, componentes, páginas).

**Error 2 — JSON files fuera de colección**
`authors.json`, `events.json` y `places.json` estaban en `src/content/` pero Astro
exige que los ficheros JSON en esa carpeta sean parte de una colección con subdirectorio.
Solución: moverlos a `src/data/` (fuera de content collections) y actualizar todos
los imports.

**Error 3 — Sitemap fallando en build**
`@astrojs/sitemap` lanzaba error porque `site` tenía un valor placeholder
(`TU_USUARIO`). Solución: eliminar la integración del sitemap de `astro.config.mjs`
(dejada como comentario para cuando se configure el dominio real).

**Error 4 — `node_modules/` y `dist/` en el repositorio**
El `.gitignore` no existía cuando se hizo el primer commit. Solución: crear
`.gitignore`, ejecutar `git rm -r --cached dist/ node_modules/ .astro/` y
commitear la limpieza (10.772 ficheros eliminados del tracking).

**Resultado**: Build limpio, 27 páginas generadas, 0 errores. Push exitoso a GitHub.

---

## Sesión 2 — Configuración de GitHub Pages y dominio

### Activación de GitHub Pages
Se configuró GitHub Pages en `Settings → Pages → Source → GitHub Actions`.
El workflow `deploy.yml` se disparó automáticamente y el sitio quedó live en
`https://SuliAragon.github.io/Cadiz.is/`.

### Intento de dominio personalizado `cadiz.is`
Se intentó configurar `cadiz.is` como dominio personalizado en GitHub Pages.
GitHub devolvió `InvalidDNSError` porque los registros DNS no estaban configurados.

**Causa**: el dominio `cadiz.is` no estaba comprado. Para configurar un dominio
personalizado hay que ser propietario del dominio y añadir registros A en el
registrador apuntando a las IPs de GitHub:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**Decisión**: usar la URL de GitHub Pages por defecto hasta que se compre el dominio.
Se revirtió `astro.config.mjs` a `site: 'https://SuliAragon.github.io'` + `base: '/Cadiz.is'`
y se eliminó el fichero `public/CNAME`.

**Nota para el futuro**: cuando se compre `cadiz.is`, los pasos serán:
1. Añadir registros A en el registrador
2. Cambiar `site` a `'https://cadiz.is'` y quitar `base` en `astro.config.mjs`
3. Cambiar `siteUrl` en `BaseLayout.astro`
4. Añadir `public/CNAME` con contenido `cadiz.is`
5. Push a main

---

## Sesión 2 — Imágenes y artículos

### Problema: imágenes no cargaban
Las imágenes referenciadas en el código (p.ej. `/images/articles/caleta-puesta-de-sol.png`)
no se mostraban en producción.

**Causa 1 — Rutas sin prefijo base**: Con `base: '/Cadiz.is'` configurado en Astro,
los ficheros de `public/` se sirven en `/Cadiz.is/images/...` pero los componentes
usaban `src={data.image}` que generaba `/images/...` sin el prefijo.

**Solución**: Añadir `import.meta.env.BASE_URL` a todos los `src` de imágenes en los
componentes `ArticleCard`, `EventCard`, `EventFeatured`, `PlaceCard` y las 3 páginas
de detalle de artículo.

**Causa 2 — Ficheros JPG corruptos**: Los `.jpg` copiados del sitio dinámico
(`caleta.jpg`, `cultura.jpg`, etc.) pesaban solo 1.9KB — estaban corruptos.
Los ficheros reales eran los `.png` (600-800KB cada uno).

**Solución**: Copiar los `.png` del sitio dinámico y actualizar todas las referencias
de `.jpg` a `.png` en los 24 ficheros Markdown y los 2 JSON de datos.

### Artículos generados
Como los artículos del sitio dinámico viven en base de datos (no accesibles), se
generaron 7 artículos nuevos × 3 idiomas = **21 ficheros Markdown** nuevos:

| Artículo | Categoría |
|---|---|
| El Carnaval de Cádiz 2026 | fiestas |
| La Semana Santa en Cádiz | fiestas |
| Los pueblos blancos de Cádiz | turismo |
| El pescaíto frito en Cádiz | gastronomia |
| El atún de almadraba de Barbate | gastronomia |
| El flamenco gaditano | cultura |
| Cádiz, la ciudad más antigua de Occidente | cultura |

Con el artículo original de La Caleta, el total es **8 artículos × 3 idiomas = 24 ficheros**.

---

## Sesión 2 — Mejoras en la página de inicio

### Problema: home solo mostraba 1 artículo
El deploy inicial solo tenía 1 artículo (La Caleta). Tras añadir los 21 nuevos,
la home mostraba todos pero sin límite.

### Cambios realizados en las 3 homes (ES/EN/FR):
1. **Sección intro**: texto descriptivo del portal + 4 botones de categoría
   (sin iconos — se probaron emojis pero se eliminaron porque se veían mal)
2. **Grid de artículos**: limitado a 6 más recientes (`slice(0, 6)`)
3. **Enlace "Ver todos los artículos"** en la cabecera de la sección

### CSS añadido a `global.css`:
- `.home-intro` — sección con degradado sutil y borde
- `.home-intro__text` — párrafo en Playfair Display, tamaño grande
- `.home-intro__pillars` — flex row con los 4 botones de categoría
- `.home-articles__header` — flex row para el título y el enlace "Ver todos"

---

## Estado actual del proyecto

### Funciona correctamente
- ✅ 48 páginas generadas (home × 3, categorías × 4 × 3, artículos × 8 × 3, agenda × 3, lugares × 3, quiz × 3, redirect raíz)
- ✅ Imágenes cargando en artículos, eventos y lugares
- ✅ Multiidioma ES/EN/FR con routing `/es/`, `/en/`, `/fr/`
- ✅ Quiz interactivo en vanilla JS (10 preguntas, 3 idiomas)
- ✅ Agenda con eventos futuros filtrados por fecha
- ✅ Navbar responsive con menú móvil
- ✅ SEO básico con meta tags, OG y hreflang
- ✅ GitHub Actions desplegando automáticamente en cada push a `main`
- ✅ Sección intro en la home con descripción del portal

### Pendiente / mejoras futuras
- ⏳ Comprar dominio `cadiz.is` y configurar DNS
- ⏳ Imágenes definitivas (las actuales son reutilizadas del sitio dinámico, no corresponden al contenido de cada artículo)
- ⏳ Habilitar sitemap (`@astrojs/sitemap`) cuando se configure el dominio real
- ⏳ Integración con agente OpenClaw para publicación automatizada de artículos
- ⏳ Más artículos y contenido de calidad

### Repositorio
- **GitHub**: `https://github.com/SuliAragon/Cadiz.is`
- **Web en producción**: `https://SuliAragon.github.io/Cadiz.is/`
- **Branch principal**: `main`
- **Deploy**: automático via GitHub Actions en cada push

---

*Diario iniciado el 19 de marzo de 2026.*
