# Diario de cadiz.is

*Cómo construimos un portal sobre la ciudad más antigua de Occidente, sin servidor, sin base de datos, y con más ganas que presupuesto.*

---

## El punto de partida

Todo empezó con una web que ya existía.

`WebBlogCadiz.is` era un blog sobre Cádiz construido con Django y React — funcional, completo, con base de datos, con autores, con categorías. Una arquitectura sólida para una redacción de verdad. El problema era ese precisamente: requería servidor, mantenimiento, costes mensuales, y una infraestructura que pesaba demasiado para un proyecto que en ese momento todavía estaba encontrando su camino.

La pregunta que nos hicimos fue sencilla: ¿y si lo convertimos en estático?

No como una rebaja. Como una decisión estratégica. Un sitio estático bien hecho puede tener el mismo aspecto, la misma estructura, el mismo alma que uno dinámico. Y puede vivir gratis en GitHub Pages, versionado en Git, sin ningún servidor que mantener. El contenido en Markdown. Los datos en JSON. El código en un repositorio público.

Esa idea fue el arranque de `cadiz.is`.

---

## Elegir las herramientas

Decidimos construirlo con **Astro**. No fue una elección al azar — Astro es el framework perfecto para esto: genera HTML puro en tiempo de build, casi sin JavaScript en el cliente, y tiene un sistema de i18n nativo que nos permitía manejar tres idiomas (español, inglés y francés) sin malabarismos.

La identidad visual la tomamos prestada del sitio dinámico: las mismas fuentes, la misma paleta, los mismos componentes. La idea era que cualquiera que conociera la web original reconociera esta. Que no pareciera una versión menor, sino la misma ciudad contada de otra manera.

Desde el primer momento supimos que queríamos tres idiomas. Cádiz no es solo una ciudad española — es una ciudad que recibe gente de toda Europa, que tiene historia fenicia, romana, árabe, americana. El inglés y el francés no eran un extra: eran parte de la identidad del proyecto.

---

## Los primeros tropiezos

Construir algo desde cero siempre tiene sus momentos. El primero llegó casi de inmediato.

Astro reserva internamente el campo `slug` en sus colecciones de contenido. Nosotros lo habíamos usado en el frontmatter de los artículos, con toda la naturalidad del mundo, y el sistema nos devolvió un error que al principio no entendimos. La solución fue renombrarlo a `articleSlug` — un cambio menor en nombre pero que había que propagar por todos los archivos Markdown, el esquema de validación y los componentes que construían las URLs.

El segundo problema fue más tonto: habíamos puesto los archivos JSON de datos (eventos, lugares, autores) dentro de `src/content/`, que es la carpeta que Astro reserva para sus colecciones. Astro los rechazó. Los movimos a `src/data/` y todo volvió a funcionar. A veces los errores más frustrantes tienen las soluciones más simples.

El tercero fue el sitemap. Habíamos instalado `@astrojs/sitemap` con ilusión, pero el plugin necesita una URL de sitio real para funcionar. La nuestra en ese momento era un placeholder. El build se rompía en silencio. Lo desactivamos y lo dejamos para cuando tuviéramos dominio propio.

---

## Subirlo a GitHub Pages

Cuando el build local funcionó por primera vez — 27 páginas generadas, cero errores — fue un momento pequeño pero satisfactorio. Una de esas victorias silenciosas que solo se celebran internamente.

Lo siguiente fue configurar GitHub Actions para que cada push a `main` desplegara automáticamente. Creamos el workflow, lo pusimos en `.github/workflows/deploy.yml`, hicimos push... y entonces descubrimos que habíamos cometido el error clásico del principiante: `node_modules/` y `dist/` estaban dentro del repositorio. Miles de archivos que no deberían estar ahí. Tuvimos que crear el `.gitignore` a posteriori, limpiar el historial con `git rm --cached`, y hacer un commit de limpieza que borró de golpe más de 10.000 archivos del tracking.

Un poco de vergüenza, mucho aprendizaje.

---

## El dominio que no era nuestro

En algún momento de euforia configuramos `cadiz.is` como dominio personalizado en GitHub Pages. GitHub nos respondió con un `InvalidDNSError`. Lógico: para configurar un dominio personalizado primero hay que poseerlo.

El TLD `.is` pertenece a Islandia. Caro. Y `malaga.is` — la referencia más directa del proyecto — funciona porque ellos sí tienen ese dominio. Nosotros no. De momento la web vive en `suliaragon.github.io/Cadiz.is` y el nombre de marca sigue siendo `cadiz.is`, con la promesa de que algún día el dominio estará a la altura.

La alternativa que más nos convence para cuando llegue ese momento es `cadizis.com` — el dominio dice literalmente "Cádiz is", mantiene el juego de palabras del word slider del hero, y un `.com` es accesible y barato. Lo anotamos. Seguimos.

---

## Las imágenes que no eran imágenes

Cuando añadimos las primeras imágenes a la web, algo no funcionaba. Las fotos no aparecían. El código parecía correcto. El build también.

El problema tenía dos capas.

La primera: con `base: '/Cadiz.is'` configurado en Astro, todos los archivos estáticos se sirven bajo ese prefijo. Pero los componentes usaban rutas como `/images/articles/caleta.jpg` — sin el prefijo. El fix fue añadir `import.meta.env.BASE_URL` a cada `src` de imagen en cada componente. Tedioso pero directo.

La segunda era más sutil y más ridícula: los archivos `.jpg` que habíamos copiado del sitio dinámico pesaban 1.9KB cada uno. No eran imágenes reales. Eran metadatos, thumbnails corruptos, algo que el sistema había generado en algún punto y que nosotros habíamos copiado sin comprobar. Los `.png` del mismo directorio, esos sí eran las imágenes reales, con sus 600-800KB de peso. Los copiamos, actualizamos todas las referencias, y las fotos aparecieron por fin.

Esa fue la primera vez que vimos la web con imágenes de verdad. Merece la pena recordarlo.

---

## El momento malaga.is

En algún punto del proceso alguien se fijó en que `cadiz.is` y `malaga.is` se parecían bastante. Fuimos a ver `malaga.is` con ojos críticos.

El parecido era real. Mismas fuentes — Playfair Display e Inter. Mismo color de acento terracota — exactamente `#e07a5f`, hasta el último dígito hexadecimal. Quiz interactivo. Estructura de categorías. Layout de cards.

No era una copia, pero era una inspiración demasiado evidente. Y aunque la ley no protege las paletas de colores ni los layouts genéricos, la imagen sí importa. No queríamos que alguien pusiera las dos webs lado a lado y sacara conclusiones.

Tomamos la decisión de diferenciarnos de verdad. Cambiamos las fuentes — de Playfair Display a **Lora**, de Inter a **Nunito Sans**. Cambiamos la paleta — el terracota de `#e07a5f` pasó a ser un `#d4622a` más oscuro y más gaditano, y añadimos un `--accent-gold: #c9a84c` que no tiene nada que ver con Málaga y sí mucho con esa luz dorada del atardecer en La Caleta. El fondo pasó de blanco frío a un `#fdf8f0` de arena cálida.

La web sigue siendo parecida en estructura — porque las dos son blogs editoriales de ciudad y eso dicta buena parte de las decisiones. Pero ya no se confunden.

---

## El estado actual

Hoy `cadiz.is` tiene 51 páginas generadas en menos de un segundo. Ocho artículos por idioma, distribuidos en cuatro secciones: Fiestas, Turismo, Gastronomía y Cultura. Una agenda de eventos. Una guía de lugares de la provincia. Un quiz sobre la ciudad.

La home tiene un artículo destacado con foto grande, cinco más en grid, y una sección introductoria que explica qué es el proyecto en los tres idiomas. "Ver todos los artículos" lleva a una página de archivo real. El diseño es responsive y las animaciones del hero funcionan bien en móvil.

Los artículos son, por ahora, generados. No vienen de la base de datos original — esa es inaccesible desde aquí — sino escritos a partir del conocimiento de Cádiz y de la documentación del proyecto. Cuando el agente OpenClaw entre en escena, los reemplazará con contenido real, actual, con imágenes propias generadas por IA.

Ese es el siguiente capítulo. Este diario lo contará.

---

*Última actualización: 19 de marzo de 2026.*
