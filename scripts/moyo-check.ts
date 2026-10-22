// Contrôle « zéro oubli » d'un site Moyo, à partir de la fiche client (moyo.client.ts).
//   node scripts/moyo-check.ts          → mode développement : les manques sont des avertissements
//   node scripts/moyo-check.ts --prod   → mode mise en ligne : tout manque bloque (utilisé par la CI)
// Écrit CHECKLIST.md (état lisible du projet) et complète moyo.suivi.json (tâches à cocher).
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import fiche from '../moyo.client.ts';
import { OPTIONS, type OptionId } from '../src/moyo/catalogue.ts';
import { deriveProjet } from '../src/moyo/projet.ts';

const PROD = process.argv.includes('--prod');
const projet = deriveProjet(fiche);
const [langueDefaut, ...autresLangues] = projet.langues;

type Niveau = 'ok' | 'avert' | 'erreur';
const lignes: { section: string; niveau: Niveau; texte: string }[] = [];
const ok = (section: string, texte: string) => lignes.push({ section, niveau: 'ok', texte });
// Un manque bloque toujours en production ; en développement, seulement si `bloquant`.
const manque = (section: string, texte: string, bloquant = false) =>
  lignes.push({ section, niveau: PROD || bloquant ? 'erreur' : 'avert', texte });

// --- 1. Fiche client ---------------------------------------------------------------------------
const F = 'Fiche client';
if (fiche.exemple) manque(F, 'La fiche contient encore les données d’exemple (exemple: true).');
if (/exemple\.(fr|com)/.test(fiche.site.url)) manque(F, `URL du site à renseigner (actuellement ${fiche.site.url}).`);
// Domaine provisoire (test, recette, préproduction…) : canonical, sitemap, robots.txt et llms.txt seraient faux.
else if (/localhost|[/.-](test|tests|staging|preprod|recette|demo)[.-]/i.test(fiche.site.url))
  manque(F, `URL du site provisoire (${fiche.site.url}) : domaine définitif à confirmer (canonical, sitemap).`);
const e = fiche.editeur;
const obligatoires: [string, string][] = [
  ['raisonSociale', 'Raison sociale / nom'],
  ['formeJuridique', 'Forme juridique'],
  ['representant', 'Représentant (nom, prénom)'],
  ['adresse', 'Adresse'],
  ['immatriculation', 'Immatriculation (RCS, RNE, RNA…)'],
  ['telephone', 'Téléphone'],
  ['email', 'E-mail'],
  ['directeurPublication', 'Directeur de la publication'],
];
for (const [k, label] of obligatoires) {
  if (!String(e[k as keyof typeof e] ?? '').trim()) manque(F, `Éditeur : ${label} à renseigner.`);
}
const association = /association/i.test(e.formeJuridique);
if (!association && !e.siret.trim()) manque(F, 'Éditeur : SIRET à renseigner.');
if (/\b(SARL|SAS|SASU|SA|EURL|SCI|SNC)\b/i.test(e.formeJuridique) && !e.capital.trim())
  manque(F, 'Éditeur : capital social obligatoire pour une société.');
if (!fiche.hebergeur.nom || !fiche.hebergeur.adresse) manque(F, 'Hébergeur : nom et adresse obligatoires.');
if (!fiche.contactEmail) manque(F, 'Adresse de réception du formulaire de contact à renseigner.');
if (!fiche.dateMiseAJourLegale) manque(F, 'Date de mise à jour des pages légales à renseigner.');
if (!lignes.some((l) => l.section === F)) ok(F, 'Fiche complète.');

// --- 2. Langues ---------------------------------------------------------------------------------
const L = 'Langues';
if (autresLangues.length && !projet.has('multi'))
  manque(L, `Plusieurs langues (${projet.langues.join(', ')}) sans l’option « Site multilingue ».`, true);
else if (projet.has('multi') && !autresLangues.length)
  manque(L, 'Option « Site multilingue » active mais une seule langue dans la fiche (site.langues).');
else ok(L, `Langue(s) : ${projet.langues.join(', ')}${autresLangues.length ? ` (par défaut : ${langueDefaut})` : ''}.`);
if (autresLangues.length > 1)
  lignes.push({ section: L, niveau: 'avert', texte: `${autresLangues.length} langues en plus de ${langueDefaut} : l’option n’en inclut qu’une, les autres sont facturables (à confirmer avec le client).` });
const ui = readFileSync('src/i18n/ui.ts', 'utf8').match(/UI[^=]*=\s*\{([^}]*)\}/)?.[1] ?? '';
for (const lang of projet.langues)
  if (!new RegExp(`\\b${lang}\\b`).test(ui)) manque(L, `Textes d’interface absents pour « ${lang} » dans src/i18n/ui.ts.`);

// --- 3. Pages -----------------------------------------------------------------------------------
const P = 'Pages';
const lister = (dir: string) => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.md')).sort() : []);
const pages = lister(join('content/pages', langueDefaut));
if (!pages.includes('accueil.md')) manque(P, `Page d’accueil manquante : content/pages/${langueDefaut}/accueil.md.`, true);
if (pages.length > projet.plan.pagesMax)
  manque(P, `${pages.length} pages pour un forfait ${projet.plan.name} limité à ${projet.plan.pagesMax} (pages légales non comptées).`, true);
else ok(P, `${pages.length}/${projet.plan.pagesMax} pages (forfait ${projet.plan.name}, pages légales non comptées).`);
const aCompleter = (dir: string, f: string) => /\[À compléter|TODO/i.test(readFileSync(join(dir, f), 'utf8'));
for (const f of pages) if (aCompleter(join('content/pages', langueDefaut), f)) manque(P, `Contenu à compléter dans ${langueDefaut}/${f}.`);

// --- 3 bis. Images (agent seo-technique) : pas d'image de plus de 300 Ko dans public/ -------------
const I = 'Images';
const lourdes: string[] = [];
const parcourirImages = (dir: string) => {
  for (const n of existsSync(dir) ? readdirSync(dir, { withFileTypes: true }) : []) {
    const p = join(dir, n.name);
    if (n.isDirectory()) parcourirImages(p);
    else if (/\.(jpe?g|png|webp|avif|gif|svg)$/i.test(n.name) && statSync(p).size > 300 * 1024) lourdes.push(`${p} (${Math.round(statSync(p).size / 1024)} Ko)`);
  }
};
parcourirImages('public');
if (lourdes.length) manque(I, `Image(s) de plus de 300 Ko à compresser (WebP conseillé) : ${lourdes.join(', ')}.`);
else ok(I, 'Aucune image de plus de 300 Ko dans public/.');

// --- 4. Articles SEO ----------------------------------------------------------------------------
const A = 'Articles SEO';
const articles = lister(join('content/articles', langueDefaut));
if (projet.articlesSeo === 0 && articles.length === 0) ok(A, 'Aucun article prévu.');
else if (articles.length !== projet.articlesSeo)
  manque(A, `${articles.length} article(s) publié(s) pour ${projet.articlesSeo} prévu(s) (${projet.articlesInclus} inclus + ${fiche.articlesSeoAchetes} acheté(s)).`);
else ok(A, `${articles.length}/${projet.articlesSeo} articles (${projet.articlesInclus} inclus + ${fiche.articlesSeoAchetes} acheté(s)).`);

// --- 5. Traductions -----------------------------------------------------------------------------
const T = 'Traductions';
for (const lang of autresLangues) {
  const aTraduire: [string, string[]][] = [['pages', pages], ['articles', articles]];
  if (projet.has('ecom')) aTraduire.push(['produits', lister(join('content/produits', langueDefaut))]);
  for (const [type, liste] of aTraduire) {
    const traduits = lister(join('content', type, lang));
    const absents = liste.filter((f) => !traduits.includes(f));
    if (absents.length) manque(T, `${lang} : ${type} sans traduction → ${absents.join(', ')}.`);
  }
}
if (autresLangues.length && !lignes.some((l) => l.section === T)) ok(T, 'Toutes les pages et articles sont traduits.');

// --- 6. Options ---------------------------------------------------------------------------------
const O = 'Options';
const besoins: Partial<Record<OptionId, () => string | null>> = {
  ecom: () => (fiche.prestataires.paiement ? null : 'prestataires.paiement à renseigner (passerelle reliée à Snipcart : confidentialité, CGV).'),
  resa: () => (fiche.prestataires.reservation ? null : 'prestataires.reservation à renseigner (confidentialité).'),
  news: () => (fiche.prestataires.newsletter ? null : 'prestataires.newsletter à renseigner (confidentialité).'),
  feed: () => (fiche.prestataires.reseauxSociaux ? null : 'prestataires.reseauxSociaux à renseigner (confidentialité).'),
  chat: () => (fiche.prestataires.reseauxSociaux ? null : 'prestataires.reseauxSociaux à renseigner (confidentialité).'),
  ana: () =>
    [
      fiche.ga4Conservation ? '' : 'ga4Conservation à renseigner (« 2 mois » ou « 14 mois », réglage de la propriété GA4 : confidentialité).',
      !PROD || process.env.PUBLIC_GA4_ID ? '' : 'variable PUBLIC_GA4_ID absente (secret GitHub).',
    ].filter(Boolean).join(' ') || null,
};
for (const id of projet.actives) {
  const probleme = besoins[id]?.();
  if (probleme) manque(O, `${OPTIONS[id].name} : ${probleme}`);
}

// --- 6 bis. Boutique Snipcart (option e-commerce) -----------------------------------------------
const B = 'Boutique';
if (projet.has('ecom')) {
  const lireProduit = (lang: string, f: string) => {
    const brut = readFileSync(join('content/produits', lang, f), 'utf8');
    const champ = (k: string) => brut.match(new RegExp(`^${k}:\\s*(.+)$`, 'm'))?.[1]?.trim().replace(/^['"]|['"]$/g, '') ?? '';
    return { nom: champ('nom'), prix: Number(champ('prix')) };
  };
  const produits = lister(join('content/produits', langueDefaut));
  if (!produits.length) manque(B, `Aucun produit dans content/produits/${langueDefaut}/.`);
  for (const f of produits) {
    const p = lireProduit(langueDefaut, f);
    if (!p.nom) manque(B, `${f} : nom manquant.`, true);
    if (!(p.prix > 0)) manque(B, `${f} : prix manquant ou nul.`, true);
    for (const lang of autresLangues) {
      if (!existsSync(join('content/produits', lang, f))) continue; // signalé dans Traductions
      const q = lireProduit(lang, f);
      if (q.prix !== p.prix) manque(B, `${f} : prix différent en ${lang} (${q.prix}) et en ${langueDefaut} (${p.prix}).`, true);
    }
  }
  if (!/^[A-Z]{3}$/.test(fiche.boutique.devise)) manque(B, 'boutique.devise : code ISO à 3 lettres attendu (ex. EUR).', true);
  if (!fiche.boutique.mentionPrix) manque(B, 'boutique.mentionPrix à renseigner (« Prix TTC » ou « TVA non applicable, art. 293 B du CGI »).');
  if (PROD && !process.env.PUBLIC_SNIPCART_API_KEY) manque(B, 'variable PUBLIC_SNIPCART_API_KEY absente (secret GitHub, clé publique « live »).');
  if (produits.length && !lignes.some((l) => l.section === B)) ok(B, `${produits.length} produit(s), devise ${fiche.boutique.devise}.`);
}

// --- 7. Suivi des tâches (moyo.suivi.json) ------------------------------------------------------
const S = 'Suivi';
type Suivi = Record<string, { fait: boolean; note: string }>;
const fichierSuivi = 'moyo.suivi.json';
const suivi: Suivi = existsSync(fichierSuivi) ? JSON.parse(readFileSync(fichierSuivi, 'utf8')) : {};
const taches: [string, string][] = [
  ['legal', 'Pages légales relues (agent legal)'],
  ['seo-technique', 'SEO technique (agent seo-technique)'],
  ...(projet.plan.seo !== 'aucun' || projet.articlesSeo > 0 ? [['seo-contenu', 'SEO de contenu et articles (agent seo-contenu)'] as [string, string]] : []),
  ...(autresLangues.length ? [['traduction', 'Traductions relues (agent traduction)'] as [string, string]] : []),
  ...[...projet.actives].filter((id) => id !== 'seo' && id !== 'multi').map((id) => [`option:${id}`, `Option ${OPTIONS[id].name} livrée`] as [string, string]),
  ['recette', 'Recette complète (agent recette)'],
  ['deploiement', 'Mise en ligne vérifiée (agent deploiement)'],
];
for (const [cle] of taches) suivi[cle] ??= { fait: false, note: '' };
writeFileSync(fichierSuivi, JSON.stringify(suivi, null, 2) + '\n');
for (const [cle, label] of taches) {
  if (suivi[cle].fait) ok(S, `${label}${suivi[cle].note ? ` — ${suivi[cle].note}` : ''}`);
  else manque(S, `${label} : à faire.`);
}

// --- 8. Pages construites (après npm run build) -------------------------------------------------
const D = 'Build';
if (existsSync('dist')) {
  const html: string[] = [];
  const parcourir = (dir: string) => {
    for (const n of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, n.name);
      if (n.isDirectory()) parcourir(p);
      else if (n.name.endsWith('.html')) html.push(p);
    }
  };
  parcourir('dist');
  const trous = html.filter((p) => readFileSync(p, 'utf8').includes('[À compléter'));
  if (trous.length) manque(D, `« [À compléter] » encore affiché dans : ${trous.map((p) => p.slice(5)).join(', ')}.`);
  else ok(D, `${html.length} pages HTML, aucun « [À compléter] ».`);
  if (projet.has('ecom')) {
    const fiches = html.filter((p) => /\/boutique\/[^/]+\/index\.html$/.test(p));
    const sansBouton = fiches.filter((p) => !/class="[^"]*snipcart-add-item[^"]*"[^>]*data-item-id=|data-item-id=[^>]*class="[^"]*snipcart-add-item/.test(readFileSync(p, 'utf8')));
    if (sansBouton.length) manque(D, `Bouton Snipcart absent du HTML : ${sansBouton.map((p) => p.slice(5)).join(', ')}.`, true);
    else if (fiches.length) ok(D, `${fiches.length} page(s) produit avec bouton Snipcart dans le HTML statique.`);
  }
}

// --- Rapport ------------------------------------------------------------------------------------
const icone = { ok: '✅', avert: '⚠️', erreur: '❌' } as const;
const sections = [...new Set(lignes.map((l) => l.section))];
const md = [
  `# Checklist — ${fiche.site.nom}`,
  '',
  `Forfait **${projet.plan.name}** (${fiche.engagement ? 'engagement 24 mois' : 'sans engagement'}) · options actives : ${[...projet.actives].map((id) => OPTIONS[id].name).join(', ') || 'aucune'}.`,
  `Généré par \`npm run check${PROD ? ':prod' : ''}\` le ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}. Ne pas modifier à la main.`,
  '',
  ...sections.flatMap((s) => [`## ${s}`, '', ...lignes.filter((l) => l.section === s).map((l) => `- ${icone[l.niveau]} ${l.texte}`), '']),
].join('\n');
writeFileSync('CHECKLIST.md', md);

const erreurs = lignes.filter((l) => l.niveau === 'erreur');
const avert = lignes.filter((l) => l.niveau === 'avert');
for (const l of [...erreurs, ...avert]) console.log(`${icone[l.niveau]} [${l.section}] ${l.texte}`);
console.log(`\n${erreurs.length} erreur(s), ${avert.length} avertissement(s) — détail dans CHECKLIST.md`);
process.exit(erreurs.length ? 1 : 0);
