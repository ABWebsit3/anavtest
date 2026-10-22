// @ts-check
import { defineConfig } from 'astro/config';
import fiche from './moyo.client.ts';

const [defaultLocale, ...autres] = fiche.site.langues;

// Site 100 % statique (dist/) : envoyé par FTP sur l'hébergement Hostinger du client.
export default defineConfig({
  site: fiche.site.url,
  trailingSlash: 'always',
  build: { format: 'directory' },
  i18n: {
    locales: [defaultLocale, ...autres],
    defaultLocale,
    routing: { prefixDefaultLocale: false },
  },
});
