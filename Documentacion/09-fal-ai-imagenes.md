# 09 — Generación de Imágenes con fal.ai

## Por qué fal.ai en lugar de DALL-E 3

En el proyecto original se usaba DALL-E 3 de OpenAI. Para la versión estática, migramos a **fal.ai** por:

| Criterio | DALL-E 3 | fal.ai |
|----------|----------|--------|
| **Precio por imagen 1792x1024** | ~$0.080 | ~$0.003-0.006 |
| **Velocidad** | 10-20 segundos | 2-5 segundos |
| **Calidad** | Excelente | Excelente (FLUX) |
| **API simplicidad** | Sencilla | Sencilla |
| **Modelos disponibles** | DALL-E 3 | FLUX, SDXL, y más |
| **Ahorro mensual (12 imgs/día)** | ~$28.80/mes | ~$1.08-2.16/mes |

Con fal.ai ahorramos ~$27/mes manteniendo calidad equivalente o superior.

---

## Modelo recomendado: FLUX.1 [schnell]

Después de comparar opciones en fal.ai:

| Modelo | Precio/img | Calidad | Velocidad | Uso recomendado |
|--------|-----------|---------|-----------|----------------|
| `fal-ai/flux/schnell` | ~$0.003 | Muy buena | ~2s | **Producción (nuestro caso)** |
| `fal-ai/flux/dev` | ~$0.025 | Excelente | ~5s | Alta calidad puntual |
| `fal-ai/flux-pro` | ~$0.055 | Premium | ~8s | Casos especiales |
| `fal-ai/fast-sdxl` | ~$0.002 | Buena | ~2s | Alternativa económica |

**Recomendación**: `fal-ai/flux/schnell` — excelente relación calidad-precio para 12 imágenes/día.

---

## Instalación

```bash
pip install fal-client
```

---

## tools/image_generator.py

```python
import fal_client
import requests
import os
from pathlib import Path

FAL_KEY = os.environ["FAL_KEY"]

def generate_image(prompt: str, slug: str) -> str | None:
    """
    Genera una imagen con fal.ai FLUX y la guarda en public/images/articles/.
    Devuelve la ruta relativa del archivo o None si falla.
    """

    # Construir prompt optimizado para Cádiz
    full_prompt = f"{prompt}, Cádiz Spain, golden light, mediterranean atmosphere, photorealistic, high quality, 16:9 ratio"

    try:
        # Llamada a fal.ai
        result = fal_client.subscribe(
            "fal-ai/flux/schnell",
            arguments={
                "prompt": full_prompt,
                "image_size": "landscape_16_9",  # 1344x768
                "num_inference_steps": 4,         # schnell: 4 pasos es suficiente
                "num_images": 1,
            },
        )

        # Obtener URL de la imagen generada
        image_url = result["images"][0]["url"]

        # Descargar y guardar
        return download_image(image_url, slug)

    except Exception as e:
        print(f"  Error generando imagen: {e}")
        return get_fallback_image(slug)


def download_image(url: str, slug: str) -> str:
    """Descarga la imagen y la guarda en public/images/articles/."""

    output_dir = Path("public/images/articles")
    output_dir.mkdir(parents=True, exist_ok=True)

    output_path = output_dir / f"{slug}.webp"

    response = requests.get(url, timeout=30)
    response.raise_for_status()

    output_path.write_bytes(response.content)
    print(f"  ✓ Imagen guardada: {output_path}")

    return f"/images/articles/{slug}.webp"


def get_fallback_image(slug: str) -> str:
    """Devuelve imagen de fallback por categoría si la generación falla."""

    fallbacks = {
        "fiestas":     "/images/fallback/fiestas.webp",
        "turismo":     "/images/fallback/turismo.webp",
        "gastronomia": "/images/fallback/gastronomia.webp",
        "cultura":     "/images/fallback/cultura.webp",
    }

    # Detectar categoría desde el slug
    for category in fallbacks:
        if category in slug:
            return fallbacks[category]

    return "/images/fallback/default.webp"
```

---

## Prompts de imagen para fal.ai

La calidad de los prompts es clave. OpenClaw debe generar prompts con esta estructura:

### Estructura del prompt
```
[TEMA ESPECÍFICO], [CONTEXTO CÁDIZ], [ESTILO VISUAL], [CONDICIONES DE LUZ]
```

### Ejemplos por categoría

**Fiestas — Carnaval:**
```
A vibrant street parade with colorful carnival costumes and chirigotas performing,
historic white buildings of Cádiz in background, festive atmosphere, golden sunlight,
photorealistic photography style
```

**Turismo — Playa:**
```
Aerial view of La Caleta beach in Cádiz with turquoise Atlantic waters,
two historic castles framing the cove, sunny Mediterranean day,
wide angle photography, sharp details
```

**Gastronomía:**
```
Fresh fried fish (pescaíto frito) served on white paper in a traditional
Cádiz freiduría, golden crispy texture, warm restaurant lighting,
close-up food photography, appetizing presentation
```

**Cultura — Flamenco:**
```
Flamenco dancer in red dress performing in a traditional tablao in Cádiz,
dramatic stage lighting, motion blur on the dress, emotional expression,
high contrast photography
```

---

## Coste estimado mensual

Con 12 imágenes/día y `fal-ai/flux/schnell`:

```
12 imágenes/día × 30 días = 360 imágenes/mes
360 × $0.003 = $1.08/mes

Comparación:
DALL-E 3: 360 × $0.080 = $28.80/mes
fal.ai:   360 × $0.003 = $1.08/mes

Ahorro: $27.72/mes ($332/año)
```

---

## Configuración de fal.ai

1. Registrarse en [fal.ai](https://fal.ai)
2. Ir a Settings → API Keys
3. Crear una nueva API key
4. En GitHub → Settings → Secrets → añadir `FAL_KEY`

---

## Imágenes de fallback

En `public/images/fallback/` mantener estas imágenes estáticas por si falla fal.ai:

```
public/images/fallback/
├── fiestas.webp        # Imagen genérica de fiestas de Cádiz
├── turismo.webp        # Imagen genérica de turismo
├── gastronomia.webp    # Imagen genérica de gastronomía
├── cultura.webp        # Imagen genérica de cultura
└── default.webp        # Imagen por defecto
```

---

## Tamaños y formatos

| Uso | Tamaño | Formato |
|-----|--------|---------|
| Artículo hero | 1344×756 (16:9) | WebP |
| Artículo card | 1344×756 → redimensionado por CSS | WebP |
| Evento destacado | 1344×756 | WebP |
| Evento card | 800×600 | WebP |
| Autor (avatar) | 200×200 | WebP |

Astro optimiza automáticamente las imágenes en el build con `sharp`.
