# 10 — GitHub Actions: Workflows de Automatización

## Visión general

El proyecto usa **dos workflows** de GitHub Actions:

| Workflow | Archivo | Disparador | Propósito |
|----------|---------|------------|-----------|
| Deploy | `deploy.yml` | Push a `main` | Construye Astro y despliega en GitHub Pages |
| OpenClaw | `openclaw.yml` | Cron 3x/día | Ejecuta el agente IA para publicar contenido |

---

## deploy.yml — Build y Deploy

```yaml
# .github/workflows/deploy.yml
name: Deploy cadiz.is to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

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

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Astro site
        run: npm run build

      - name: Upload Pages artifact
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

## openclaw.yml — Agente OpenClaw

```yaml
# .github/workflows/openclaw.yml
name: OpenClaw — Publicación autónoma

on:
  # Cron 3 veces al día (UTC)
  schedule:
    - cron: '0 7 * * *'    # 07:00 UTC = 08:00 CET (ciclo mañana)
    - cron: '0 15 * * *'   # 15:00 UTC = 16:00 CET (ciclo tarde)
    - cron: '0 23 * * *'   # 23:00 UTC = 00:00 CET (ciclo noche)

  # Permite ejecución manual con parámetros
  workflow_dispatch:
    inputs:
      cycle:
        description: 'Ciclo de publicación'
        required: true
        default: 'morning'
        type: choice
        options:
          - morning
          - afternoon
          - evening

permissions:
  contents: write   # Necesario para git push

jobs:
  openclaw:
    name: OpenClaw Agent
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0   # Historial completo para git push

      - name: Setup Python 3.11
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'

      - name: Install Python dependencies
        run: pip install -r agent/requirements.txt

      - name: Determine cycle
        id: cycle
        run: |
          # Si se ejecuta manualmente, usa el input
          if [ "${{ github.event_name }}" = "workflow_dispatch" ]; then
            echo "cycle=${{ github.event.inputs.cycle }}" >> $GITHUB_OUTPUT
          else
            # Determina el ciclo según la hora UTC
            HOUR=$(date -u +%H)
            if [ "$HOUR" = "07" ]; then
              echo "cycle=morning" >> $GITHUB_OUTPUT
            elif [ "$HOUR" = "15" ]; then
              echo "cycle=afternoon" >> $GITHUB_OUTPUT
            else
              echo "cycle=evening" >> $GITHUB_OUTPUT
            fi
          fi

      - name: Run OpenClaw Agent
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          FAL_KEY: ${{ secrets.FAL_KEY }}
          OPENCLAW_CYCLE: ${{ steps.cycle.outputs.cycle }}
          GIT_AUTHOR_NAME: OpenClaw
          GIT_AUTHOR_EMAIL: openclaw@cadiz.is
          GIT_COMMITTER_NAME: OpenClaw
          GIT_COMMITTER_EMAIL: openclaw@cadiz.is
        run: python agent/openclaw.py

      - name: Summary
        run: |
          echo "## OpenClaw completado" >> $GITHUB_STEP_SUMMARY
          echo "- Ciclo: ${{ steps.cycle.outputs.cycle }}" >> $GITHUB_STEP_SUMMARY
          echo "- Fecha: $(date -u)" >> $GITHUB_STEP_SUMMARY
          git log --oneline -5 >> $GITHUB_STEP_SUMMARY
```

---

## agent/requirements.txt

```
anthropic>=0.40.0
fal-client>=0.5.0
requests>=2.31.0
python-dateutil>=2.8.0
```

---

## Flujo completo de un ciclo

```
07:00 UTC — GitHub Actions ejecuta openclaw.yml (cron)
        │
        ▼
python agent/openclaw.py (con OPENCLAW_CYCLE=morning)
        │
        ├── Genera 4 artículos (Claude)
        ├── Genera 4 imágenes (fal.ai) → public/images/articles/
        ├── Escribe 12 archivos .md (4 artículos × 3 idiomas)
        ├── Actualiza events.json si hace falta
        └── git commit + push
                │
                ▼
        GitHub detecta push a main
                │
                ▼
        deploy.yml se ejecuta automáticamente
                │
                ├── npm ci
                ├── astro build  (genera dist/)
                └── deploy a GitHub Pages
                        │
                        ▼
        ~4 minutos después: sitio actualizado en producción
```

---

## Monitorización de workflows

### Ver historial de ejecuciones
```bash
# Listar las últimas ejecuciones
gh run list --workflow=openclaw.yml --limit=10

# Ver el log de un run
gh run view <RUN_ID> --log

# Ver solo el resumen
gh run view <RUN_ID>
```

### Ejecutar manualmente
```bash
# Ciclo de mañana
gh workflow run openclaw.yml --field cycle=morning

# Ciclo de tarde
gh workflow run openclaw.yml --field cycle=afternoon

# Ciclo de noche
gh workflow run openclaw.yml --field cycle=evening
```

---

## Gestión de errores en el workflow

Si OpenClaw falla (error de API, timeout, etc.):
- El workflow falla con código de salida no-0
- GitHub envía una notificación por email
- El sitio **no se ve afectado** (el build de Astro no se ejecuta si no hay commit nuevo)
- El siguiente ciclo (8 horas después) intentará publicar de nuevo

Para reintentar manualmente:
```bash
gh run rerun <RUN_ID>
# O ejecutar workflow manualmente:
gh workflow run openclaw.yml --field cycle=morning
```

---

## Secrets necesarios

Configurar en GitHub → Settings → Secrets and variables → Actions:

| Secret | Valor | Dónde obtenerlo |
|--------|-------|----------------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | console.anthropic.com |
| `FAL_KEY` | `fal-...` | fal.ai → Settings → API Keys |

El `GITHUB_TOKEN` es **automático** — GitHub lo inyecta en cada workflow.

---

## Costes de GitHub Actions

GitHub Actions es **gratuito** para repositorios públicos (sin límite de minutos). Para repositorios privados, hay 2000 minutos gratuitos/mes.

Tiempo estimado por run de OpenClaw:
- Setup + install: ~2 minutos
- Generación de 4 artículos (Claude): ~2-3 minutos
- Generación de 4 imágenes (fal.ai): ~1 minuto
- Git commit + push: ~30 segundos
- **Total**: ~6-7 minutos por run

Con 3 runs/día = ~21 minutos/día = ~630 minutos/mes (dentro del límite gratuito incluso en privado).
