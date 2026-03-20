# Cómo se hizo cadiz.is

*Un portal sobre la ciudad más antigua de Occidente, construido sin servidor, sin base de datos, y con más ganas que presupuesto. Esta página cuenta todo el proceso: las decisiones, los errores, los costes y el resultado.*

---

## El creador

**Jesús Aragón** — desarrollador, gaditano de adopción y responsable de que este proyecto exista.

La idea de cadiz.is nació de una convicción simple: Cádiz merece un portal a la altura de su historia. Una ciudad de 3.000 años que aparece en Google con fotos de stock y artículos de 2015 merece algo mejor. Este es ese intento.

---

## La inversión

Transparencia total. Esto es lo que ha costado cadiz.is hasta hoy:

| Concepto | Coste | Notas |
|---|---|---|
| Hosting (GitHub Pages) | **Gratis** | Repos públicos, sin límite |
| Framework (Astro) | **Gratis** | Open source |
| Dominio cadizis.com | **Pendiente** | ~$12/año cuando se compre |
| fal.ai — imágenes IA | **$20** | ~800 imágenes con Flux Dev |
| OpenAI API — textos IA | **$10** | +4 años de artículos diarios |
| **Total hasta hoy** | **~$30** | |

Un portal editorial trilingüe con generación automática de contenido por **30 dólares**. Sin servidor, sin suscripciones mensuales, sin infraestructura que mantener.

---

## La tecnología

| Elemento | Decisión | Por qué |
|---|---|---|
| Framework | **Astro 4** | HTML puro en build, casi sin JS en cliente |
| Hosting | **GitHub Pages** | Gratis, versionado, automático |
| CI/CD | **GitHub Actions** | Deploy automático en cada push |
| Contenido | **Markdown + JSON** | Sin base de datos, editable desde cualquier editor |
| Idiomas | **ES + EN** | i18n nativo de Astro con prefijo de ruta |
| Fuentes | **Lora + Nunito Sans** | Identidad propia, diferenciada |
| Imágenes IA | **fal.ai Flux Dev** | Mejor ratio calidad/precio |
| Textos IA | **OpenAI GPT-4o** | Generación y traducción de artículos |

---

## El punto de partida

Todo empezó con una web que ya existía.

`WebBlogCadiz.is` era un blog sobre Cádiz construido con Django y React — funcional, completo, con base de datos, con autores, con categorías. Una arquitectura sólida para una redacción de verdad. El problema era ese precisamente: requería servidor, mantenimiento, costes mensuales, y una infraestructura que pesaba demasiado para un proyecto que en ese momento todavía estaba encontrando su camino.

La pregunta que me hice fue sencilla: ¿y si lo convierto en estático?

No como una rebaja. Como una decisión estratégica. Un sitio estático bien hecho puede tener el mismo aspecto, la misma estructura, el mismo alma que uno dinámico. Y puede vivir gratis en GitHub Pages, versionado en Git, sin ningún servidor que mantener. El contenido en Markdown. Los datos en JSON. El código en un repositorio público.

Esa idea fue el arranque de `cadiz.is`.

---

## Elegir las herramientas

Decidí construirlo con **Astro**. No fue una elección al azar — Astro es el framework perfecto para esto: genera HTML puro en tiempo de build, casi sin JavaScript en el cliente, y tiene un sistema de i18n nativo que me permitía manejar varios idiomas sin malabarismos.

La identidad visual la tomé prestada del sitio dinámico como punto de partida: las mismas fuentes, la misma paleta. La idea era que cualquiera que conociera la web original la reconociera. Que no pareciera una versión menor, sino la misma ciudad contada de otra manera.

Desde el primer momento tuve claro que quería al menos dos idiomas. Cádiz no es solo una ciudad española — es una ciudad que recibe gente de toda Europa, que tiene historia fenicia, romana, árabe, americana. El inglés no era un extra: era parte de la identidad del proyecto.

---

## Los primeros tropiezos

Construir algo desde cero siempre tiene sus momentos. El primero llegó casi de inmediato.

Astro reserva internamente el campo `slug` en sus colecciones de contenido. Lo había usado en el frontmatter de los artículos, con toda la naturalidad del mundo, y el sistema me devolvió un error que al principio no entendí. La solución fue renombrarlo a `articleSlug` — un cambio menor en nombre pero que había que propagar por todos los archivos Markdown, el esquema de validación y los componentes que construían las URLs.

El segundo problema fue más tonto: había puesto los archivos JSON de datos (eventos, lugares, autores) dentro de `src/content/`, que es la carpeta que Astro reserva para sus colecciones. Astro los rechazó. Los moví a `src/data/` y todo volvió a funcionar. A veces los errores más frustrantes tienen las soluciones más simples.

El tercero fue el sitemap. Había instalado `@astrojs/sitemap` con ilusión, pero el plugin necesita una URL de sitio real para funcionar. La mía en ese momento era un placeholder. El build se rompía en silencio. Lo desactivé y lo dejé para cuando tuviera dominio propio.

---

## Subirlo a GitHub Pages

Cuando el build local funcionó por primera vez — 27 páginas generadas, cero errores — fue un momento pequeño pero satisfactorio. Una de esas victorias silenciosas que solo se celebran internamente.

Lo siguiente fue configurar GitHub Actions para que cada push a `main` desplegara automáticamente. Creé el workflow en `.github/workflows/deploy.yml`, hice push... y entonces descubrí que había cometido el error clásico del principiante: `node_modules/` y `dist/` estaban dentro del repositorio. Miles de archivos que no deberían estar ahí. Tuve que crear el `.gitignore` a posteriori, limpiar el historial con `git rm --cached`, y hacer un commit de limpieza que borró de golpe más de 10.000 archivos del tracking.

Un poco de vergüenza, mucho aprendizaje.

---

## El dominio que no era mío

En un momento de euforia configuré `cadiz.is` como dominio personalizado en GitHub Pages. GitHub me respondió con un `InvalidDNSError`. Lógico: para configurar un dominio personalizado primero hay que poseerlo.

El TLD `.is` pertenece a Islandia. Caro. Y `malaga.is` — la referencia más directa del proyecto — funciona porque ellos sí tienen ese dominio. Yo no.

De momento la web vive en `suliaragon.github.io/Cadiz.is`. La alternativa que más me convence para cuando llegue el momento es `cadizis.com` — el dominio dice literalmente "Cádiz is", mantiene el juego de palabras del word slider del hero, y un `.com` es accesible. Lo anoté. Seguí.

---

## Las imágenes que no eran imágenes

Cuando añadí las primeras imágenes a la web, algo no funcionaba. Las fotos no aparecían. El código parecía correcto. El build también.

El problema tenía dos capas.

La primera: con `base: '/Cadiz.is'` configurado en Astro, todos los archivos estáticos se sirven bajo ese prefijo. Pero los componentes usaban rutas como `/images/articles/caleta.jpg` sin el prefijo. El fix fue añadir `import.meta.env.BASE_URL` a cada `src` de imagen en cada componente. Tedioso pero directo.

La segunda era más sutil: los archivos `.jpg` que había copiado del sitio dinámico pesaban 1.9KB cada uno. No eran imágenes reales. Eran thumbnails corruptos. Los `.png` del mismo directorio, esos sí eran las imágenes reales, con sus 600–800KB de peso. Los copié, actualicé todas las referencias, y las fotos aparecieron por fin.

Esa fue la primera vez que vi la web con imágenes de verdad. Merece la pena recordarlo.

---

## El momento malaga.is

En algún punto me fijé en que `cadiz.is` y `malaga.is` se parecían bastante. Fui a ver `malaga.is` con ojos críticos.

El parecido era real. Mismas fuentes — Playfair Display e Inter. Mismo color de acento terracota — exactamente `#e07a5f`, hasta el último dígito hexadecimal. Quiz interactivo. Estructura de categorías. Layout de cards.

No era una copia, pero era una inspiración demasiado evidente. Tomé la decisión de diferenciarme de verdad. Cambié las fuentes — de Playfair Display a **Lora**, de Inter a **Nunito Sans**. Cambié la paleta — el terracota pasó a ser un `#d4622a` más oscuro y más gaditano, y añadí un `--accent-gold: #c9a84c` que tiene mucho que ver con esa luz dorada del atardecer en La Caleta. El fondo pasó de blanco frío a un `#fdf8f0` de arena cálida.

La web sigue siendo parecida en estructura — porque las dos son blogs editoriales de ciudad y eso dicta buena parte de las decisiones. Pero ya no se confunden.

---

## La automatización

La parte más ambiciosa del proyecto llegó después de tener la estructura montada: que la web se actualice sola, todos los días, sin intervención humana.

El sistema funciona así: un script Python corre cada mañana a las 8am en los servidores de GitHub. Visita [Diario de Cádiz](https://www.diariodecadiz.es) y [La Voz Digital](https://www.lavozdigital.es), filtra noticias positivas y turísticas (descarta automáticamente cualquier noticia con muerte, accidentes o política), genera un artículo completo en español e inglés con GPT-4o, crea una imagen relacionada con fal.ai Flux Dev, y hace un commit al repositorio. GitHub Actions lo despliega automáticamente.

El coste de todo esto: menos de un céntimo al día.

No hay servidor. No hay panel de administración. No hay base de datos. Solo código, APIs y un repositorio en GitHub que hace el resto.

---

## El estado actual

Hoy `cadiz.is` tiene 34 páginas en dos idiomas (español e inglés), distribuidas en cuatro secciones: Fiestas, Turismo, Gastronomía y Cultura. Una agenda de eventos con limpieza automática de fechas pasadas. Una guía de lugares de la provincia. Un quiz sobre la ciudad.

La home tiene un artículo destacado con foto grande y cinco más en grid. "Ver todos los artículos" lleva a una página de archivo real. El diseño es responsive.

Y cada mañana a las 8am, sin que nadie lo pida, aparece un artículo nuevo.

---

*Última actualización: 20 de marzo de 2026.*
