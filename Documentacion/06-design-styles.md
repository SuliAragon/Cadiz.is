# 06 — Sistema de Diseño y Estilos

## Principios de diseño

El diseño se mantiene igual al proyecto original: editorial, elegante, con sabor gaditano. La paleta y tipografía son idénticas para mantener la identidad visual.

---

## Paleta de colores

```css
:root {
  /* Fondos */
  --bg: #faf9f6;              /* Blanco cálido — fondo principal */
  --surface: #f0ede6;         /* Crema — cards, paneles */
  --surface-hover: #e8e4dc;   /* Hover de cards */
  --border: #e0dbd0;          /* Separadores, bordes */

  /* Texto */
  --text: #1a1814;            /* Casi negro cálido — texto principal */
  --text-secondary: #4a4540;  /* Texto secundario */
  --muted: #8a8070;           /* Texto terciario, metadatos */

  /* Colores de acento */
  --accent: #1a5fa8;          /* Azul Atlántico — enlaces, CTAs */
  --accent-hover: #154d8a;    /* Azul más oscuro al hover */
  --accent-warm: #c8762a;     /* Naranja-ocre — highlights cálidos */
  --green: #2d7a4f;           /* Verde — badge IA, positivo */

  /* Blanco */
  --white: #ffffff;

  /* Categorías */
  --color-fiestas: #e63946;   /* Rojo festivo */
  --color-turismo: #1a5fa8;   /* Azul atlántico */
  --color-gastronomia: #c8762a; /* Naranja-ocre */
  --color-cultura: #6b46c1;   /* Púrpura cultural */
}
```

---

## Tipografía

```css
:root {
  /* Familias */
  --font-display: 'Playfair Display', Georgia, serif;   /* Títulos editoriales */
  --font-body: 'Source Serif 4', Georgia, serif;        /* Cuerpo de texto */
  --font-ui: 'DM Sans', system-ui, sans-serif;          /* UI, etiquetas, nav */

  /* Tamaños */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */

  /* Pesos */
  --font-normal: 400;
  --font-semibold: 600;
  --font-bold: 700;

  /* Interlineado */
  --leading-tight: 1.25;
  --leading-normal: 1.6;
  --leading-relaxed: 1.75;
}
```

---

## Espaciado y dimensiones

```css
:root {
  /* Espaciado (sistema de 4px) */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */

  /* Contenedor */
  --container-max: 1200px;
  --container-padding: var(--space-6);

  /* Bordes */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* Sombras */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.10);
}
```

---

## CSS Global (src/styles/global.css)

```css
/* Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--text);
  background-color: var(--bg);
  line-height: var(--leading-normal);
  -webkit-font-smoothing: antialiased;
}

/* Tipografía base */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--text);
}

h1 { font-size: var(--text-4xl); }
h2 { font-size: var(--text-3xl); }
h3 { font-size: var(--text-2xl); }
h4 { font-size: var(--text-xl); }

a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--accent-hover);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Contenedor */
.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

/* Grid de artículos */
.article-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

@media (max-width: 768px) {
  .article-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .article-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Contenido de artículo */
.article-content {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  max-width: 72ch;
  margin: 0 auto;
}

.article-content h2 {
  margin-top: var(--space-10);
  margin-bottom: var(--space-4);
  font-size: var(--text-2xl);
}

.article-content p {
  margin-bottom: var(--space-5);
}

.article-content strong {
  font-weight: var(--font-semibold);
  color: var(--text);
}

/* Badge de categoría */
.category-badge {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.category-badge.fiestas   { background: var(--color-fiestas);    color: white; }
.category-badge.turismo   { background: var(--color-turismo);    color: white; }
.category-badge.gastronomia { background: var(--color-gastronomia); color: white; }
.category-badge.cultura   { background: var(--color-cultura);   color: white; }

/* Badge de IA */
.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  background: rgba(45, 122, 79, 0.1);
  color: var(--green);
  border: 1px solid rgba(45, 122, 79, 0.2);
  border-radius: var(--radius-sm);
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
}
```

---

## Componente ArticleCard (Astro)

```astro
---
// src/components/articles/ArticleCard.astro
const { article, lang } = Astro.props;
const { title, slug, excerpt, category, author, publishedAt, image, imageAlt, isAiGenerated } = article.data;

const formattedDate = new Date(publishedAt).toLocaleDateString(
  lang === 'en' ? 'en-GB' : lang === 'fr' ? 'fr-FR' : 'es-ES',
  { day: 'numeric', month: 'long', year: 'numeric' }
);
---

<article class="article-card">
  <a href={`/${lang}/articulos/${slug}`}>
    <div class="article-card__image">
      <img src={image} alt={imageAlt} loading="lazy" />
      <span class={`category-badge ${category}`}>{category}</span>
    </div>
    <div class="article-card__body">
      {isAiGenerated && <span class="ai-badge">✦ OpenClaw</span>}
      <h3 class="article-card__title">{title}</h3>
      <p class="article-card__excerpt">{excerpt}</p>
      <footer class="article-card__meta">
        <span class="author">{author}</span>
        <time datetime={publishedAt}>{formattedDate}</time>
      </footer>
    </div>
  </a>
</article>

<style>
  .article-card {
    background: var(--surface);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .article-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .article-card__image {
    position: relative;
    aspect-ratio: 16/9;
    overflow: hidden;
  }

  .article-card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .article-card:hover .article-card__image img {
    transform: scale(1.03);
  }

  .article-card__image .category-badge {
    position: absolute;
    top: var(--space-3);
    left: var(--space-3);
  }

  .article-card__body {
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .article-card__title {
    font-size: var(--text-xl);
    line-height: var(--leading-tight);
    color: var(--text);
  }

  .article-card__excerpt {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    line-height: var(--leading-normal);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .article-card__meta {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-ui);
    font-size: var(--text-xs);
    color: var(--muted);
    margin-top: auto;
  }
</style>
```
