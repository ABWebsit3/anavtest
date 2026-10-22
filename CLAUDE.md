# Site client Moyo — règles du projet

Ce dépôt est créé depuis le modèle `moyo-site-template`. Moyo est un service d'ABweb (Alexandre Bailot, EI) :
location de sites internet (forfaits Essentielle / Standard / Premium + options).

## Source de vérité
- **`moyo.client.ts`** (la fiche client) décide de tout : forfait, options, langues, infos légales.
  Ne construis rien qui n'y est pas, n'oublie rien qui y est.
- `src/moyo/catalogue.ts` : forfaits (plafond de pages 3/6/10, niveau SEO) et options (dont celles incluses).
- `src/moyo/projet.ts` : options actives = options incluses dans le forfait + options achetées.
- **`npm run check`** liste ce qui manque (écrit `CHECKLIST.md`) ; **`npm run check:prod`** bloque la mise en ligne.

## Règles absolues
1. **Ne jamais inventer** une donnée légale, un prix, un avis, un chiffre ou une référence client.
   Laisser le champ vide : il s'affiche « [À compléter] » et bloque la mise en ligne. Signaler ce qui manque.
2. **Aucun secret dans le dépôt** (identifiants FTP, TinaCloud, clés API) : uniquement en secrets GitHub ou `.env` local.
3. **Aucun service tiers sans consentement** : tout script qui dépose des cookies ou appelle un tiers passe par
   tarteaucitron (`src/layouts/Layout.astro`) ET apparaît dans la confidentialité (`src/legal/Confidentialite.astro`).
   Ajouter le service dans `deriveProjet()` (`src/moyo/projet.ts`) pour que les deux suivent.
4. **Respecter le forfait** : pas plus de pages que le plafond (pages légales, blog et boutique non comptés).
5. Contenus éditables par le client = fichiers Markdown de `content/` (TinaCMS). Pas de texte client codé en dur.
6. Ton du site : celui choisi par le client (vouvoiement par défaut). Pages légales : ton neutre, en français.
7. Une tâche terminée se coche dans `moyo.suivi.json` (`"fait": true` + note courte), jamais avant vérification.
8. Vérifier les informations avant de les affirmer (sources officielles), et dire quand on ne sait pas.

## Agents (`.claude/agents/`)
Lance `/nouveau-site` : l'agent **chef-de-projet** lit la fiche et délègue à
`legal`, `traduction`, `seo-technique`, `seo-contenu`, `options`, `recette`, `deploiement`.

## Commandes
- `npm run dev` (site) · `npm run dev:cms` (site + espace d'édition TinaCMS sur /admin/)
- `npm run check` · `npm run check:prod` · `npm run build` · `npm run build:cms`
