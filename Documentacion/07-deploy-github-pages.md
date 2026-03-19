# 07 — Deploy en GitHub Pages

## Por qué GitHub Pages

GitHub Pages ofrece hosting estático **completamente gratuito** para repositorios públicos. El dominio es `USUARIO.github.io/REPOSITORIO` y el deploy es automático mediante GitHub Actions.

**Requisitos:**
- Repositorio público en GitHub
- Archivo de workflow en `.github/workflows/deploy.yml`
- El proyecto genera HTML estático (`astro build`)

---

## Configuración del repositorio

### 1. Crear el repositorio en GitHub

```bash
# En GitHub: crear repositorio "cadiz-is" (público)
# Después, en local:
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USUARIO/cadiz-is.git
git push -u origin main
```

### 2. Activar GitHub Pages

En GitHub → Settings → Pages:
- **Source**: GitHub Actions
- (No seleccionar rama manualmente, lo gestiona el workflow)

### 3. Configurar base en Astro

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://USUARIO.github.io',
  base: '/cadiz-is',    // Nombre exacto del repositorio
  output: 'static',
});
```

---

## Workflow de deploy (.github/workflows/deploy.yml)

```yaml
name: Deploy cadiz.is to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:  # Permite ejecución manual

permissions:
  contents: read
  pages: write
  id-token: write

# Evita deploys simultáneos
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    name: Build Astro
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Astro
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    name: Deploy to GitHub Pages
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## Dominio personalizado (opcional)

Si en el futuro se quiere usar `cadiz.is` en lugar de `USUARIO.github.io/cadiz-is`:

1. En el DNS de `cadiz.is`, añadir CNAME: `www` → `USUARIO.github.io`
2. En GitHub Pages Settings, poner `www.cadiz.is` como dominio personalizado
3. En `astro.config.mjs`, cambiar:
   ```javascript
   site: 'https://www.cadiz.is',
   base: '/',  // Dominio propio, sin subcarpeta
   ```
4. Crear archivo `public/CNAME` con el contenido:
   ```
   www.cadiz.is
   ```

---

## URLs del sitio desplegado

Con repositorio `cadiz-is` bajo usuario `USUARIO`:

| Ruta | URL |
|------|-----|
| Home (ES) | `https://USUARIO.github.io/cadiz-is/es/` |
| Home (EN) | `https://USUARIO.github.io/cadiz-is/en/` |
| Home (FR) | `https://USUARIO.github.io/cadiz-is/fr/` |
| Artículo | `https://USUARIO.github.io/cadiz-is/es/articulos/carnaval-2026` |
| Agenda | `https://USUARIO.github.io/cadiz-is/es/agenda` |
| Lugares | `https://USUARIO.github.io/cadiz-is/es/lugares` |

---

## Tiempos de build y deploy

| Paso | Tiempo aproximado |
|------|------------------|
| Checkout + setup | ~30 segundos |
| `npm install` | ~45 segundos |
| `astro build` | ~1-2 minutos |
| Upload artifact | ~30 segundos |
| Deploy a GitHub Pages | ~30 segundos |
| **Total** | **~3-4 minutos** |

Tras cada `git push` de OpenClaw, el sitio está actualizado en ~4 minutos.

---

## Limitaciones de GitHub Pages

| Límite | Valor |
|--------|-------|
| Tamaño del sitio | 1 GB |
| Ancho de banda mensual | 100 GB (más que suficiente) |
| Builds por hora | Sin límite explícito |
| Repositorios privados | Solo en plan Pro/Team (nosotros usamos público) |

Con artículos de ~2KB y imágenes de ~200KB, el sitio tardará años en alcanzar el límite de 1 GB.

---

## Verificar el deploy

```bash
# Ver el estado del workflow en la terminal
gh run list --workflow=deploy.yml

# Ver detalles de un run específico
gh run view <RUN_ID>

# Ver los logs
gh run view <RUN_ID> --log
```

---

## Secrets necesarios en el repositorio

Para el workflow de OpenClaw (no para el deploy):

1. En GitHub → Settings → Secrets and variables → Actions
2. Añadir:
   - `ANTHROPIC_API_KEY`: API key de Anthropic para Claude
   - `FAL_KEY`: API key de fal.ai para imágenes

El `GITHUB_TOKEN` es **automático** — GitHub lo inyecta en cada workflow sin configuración.
