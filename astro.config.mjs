import { defineConfig } from 'astro/config';

// TODO: Cuando configures tu repo en GitHub, añade estas líneas:
// import sitemap from '@astrojs/sitemap';
// Y en integrations: [sitemap({ i18n: { defaultLocale: 'es', locales: { es: 'es-ES', en: 'en-US', fr: 'fr-FR' } } })]

export default defineConfig({
  site: 'https://SuliAragon.github.io',
  base: '/Cadiz.is',

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'fr'],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  output: 'static',
  outDir: './dist',
});
