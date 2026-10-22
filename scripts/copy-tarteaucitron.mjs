// Copie tarteaucitron.js (node_modules) vers public/tarteaucitron pour l'auto-héberger
// (aucun appel à un CDN tiers avant consentement). Copie les langues de la fiche client.
import { cpSync, existsSync, mkdirSync, readFileSync } from 'node:fs';

const src = 'node_modules/tarteaucitronjs';
const dest = 'public/tarteaucitron';
const fiche = readFileSync('moyo.client.ts', 'utf8');
const langues = [...new Set(['fr', ...((fiche.match(/langues:\s*\[([^\]]*)\]/)?.[1] ?? '').match(/[a-z]{2}/g) ?? [])])];
const files = [
  'tarteaucitron.min.js',
  'tarteaucitron.services.min.js',
  'css/tarteaucitron.min.css',
  'LICENSE',
  ...langues.map((l) => `lang/tarteaucitron.${l}.min.js`),
];

for (const f of files) {
  if (!existsSync(`${src}/${f}`)) {
    console.warn(`⚠️ tarteaucitron : ${f} introuvable (langue non traduite par tarteaucitron ?)`);
    continue;
  }
  const out = `${dest}/${f}`;
  mkdirSync(out.slice(0, out.lastIndexOf('/')), { recursive: true });
  cpSync(`${src}/${f}`, out);
}
console.log(`tarteaucitron copié dans ${dest} (langues : ${langues.join(', ')})`);
