# Modèle de site client Moyo

Modèle de dépôt pour créer chaque site client Moyo (Astro + TinaCMS, déploiement FTP sur Hostinger),
avec des **agents Claude Code** spécialisés et un **contrôle automatique** pour ne rien oublier.

## Démarrer un nouveau site
1. Sur GitHub : **Use this template → Create a new repository** (privé), nommé d'après le client.
2. En local : `git clone …`, puis `npm install`.
3. Remplir **`moyo.client.ts`** à partir du devis accepté et du questionnaire pré-RDV
   (forfait, engagement, options, articles SEO achetés, langues, informations légales du client).
   Un champ inconnu reste vide `''` : il s'affiche « [À compléter] » et bloque la mise en ligne.
4. Dans Claude Code : **`/nouveau-site`**. Le chef de projet lit la fiche, liste ce qui manque et fait
   travailler les agents.
5. Suivre l'avancement dans **`CHECKLIST.md`** (régénéré par `npm run check`).
6. Ajouter les secrets GitHub (voir « Mise en ligne »), passer `exemple: false`, pousser sur `main`.

## Les agents (`.claude/agents/`)
| Agent | Rôle | Quand |
|---|---|---|
| `chef-de-projet` | lit la fiche, établit la checklist, délègue, vérifie | toujours |
| `legal` | mentions légales, confidentialité, tarteaucitron, CGV si e-commerce | toujours |
| `traduction` | versions de chaque page/article, textes d'interface, hreflang | option Site multilingue |
| `seo-technique` | balises, Open Graph, données structurées, sitemap, robots, llms.txt | toujours |
| `seo-contenu` | SEO de base (Standard) / premium (Premium), articles SEO (inclus + achetés) | Standard, Premium ou articles achetés |
| `options` | livre chaque option vendue selon sa fiche `docs/options/` | une fois par option active |
| `recette` | contrôle qualité avant mise en ligne (Playwright) | toujours, à la fin |
| `deploiement` | secrets, FTP, domaine au nom du client, DNS, TinaCMS, Search Console | toujours, en dernier |

## Le contrôle « zéro oubli »
`npm run check` (développement) et `npm run check:prod` (mise en ligne, utilisé par la CI) vérifient :
- la fiche client (infos légales obligatoires, URL définitive, fin des données d'exemple) ;
- les langues (option multilingue, textes d'interface, traductions de chaque page et article) ;
- le nombre de pages par rapport au forfait (3 / 6 / 10, pages légales non comptées) ;
- le nombre d'articles SEO (inclus dans le forfait + achetés) ;
- la boutique (option e-commerce) : produits complets, même prix dans chaque langue, devise, mention de prix,
  clé Snipcart, bouton Snipcart présent dans le HTML de chaque page produit ;
- les prestataires à déclarer pour chaque option active ;
- les tâches de chaque agent cochées dans `moyo.suivi.json` ;
- après le build : aucun « [À compléter] » dans les pages.

## Structure
```
moyo.client.ts          fiche client (source de vérité)
moyo.suivi.json         tâches à cocher par les agents
CHECKLIST.md            état du projet (généré)
content/pages/<lang>/   pages éditables (TinaCMS) — accueil.md = page d'accueil
content/articles/<lang>/ articles SEO
content/produits/<lang>/ produits de la boutique (option e-commerce, Snipcart)
src/moyo/               catalogue des forfaits/options, dérivation du projet
src/legal/              mentions légales, confidentialité, CGV de vente (option e-commerce)
src/i18n/ui.ts          textes d'interface par langue
src/pages/contact.php.ts génère dist/contact.php (formulaire de contact, PHP mail() de l'hébergement)
tina/config.ts          espace d'édition du client
docs/options/           fiche de chaque option vendue
```

## Commandes
| Commande | Rôle |
|---|---|
| `npm run dev` | site en local (http://localhost:4321) |
| `npm run dev:cms` | site + espace d'édition TinaCMS en local (http://localhost:4321/admin/index.html) |
| `npm run check` | contrôle Moyo en mode développement |
| `npm run check:prod` | contrôle Moyo bloquant (mise en ligne) |
| `npm run build` | site statique dans `dist/` |
| `npm run build:cms` | idem + espace d'édition (nécessite TINA_CLIENT_ID / TINA_TOKEN) |

## Mise en ligne (CI/CD)
Travail en local → `git push` sur `main` → GitHub Actions (`.github/workflows/deploy.yml`) :
`npm ci` → `npm run check:prod` → build → contrôle des pages → **envoi FTPS** dans `/public_html/`.
Les pull requests sont seulement contrôlées et construites. Un déclenchement manuel (*Run workflow*) fait une
simulation (`dry_run`) par défaut.

Secrets GitHub (Settings → Secrets and variables → Actions) :
| Secret | Obligatoire | Valeur |
|---|---|---|
| `FTP_SERVER` | oui | serveur FTP Hostinger du site |
| `FTP_USERNAME` | oui | utilisateur FTP |
| `FTP_PASSWORD` | oui | mot de passe FTP |
| `FTP_SERVER_DIR` | non | dossier distant (défaut `/public_html/`) |
| `PUBLIC_GA4_ID` | si option Analytics | identifiant GA4 `G-…` |
| `PUBLIC_SNIPCART_API_KEY` | si option E-commerce | clé publique **live** Snipcart (tableau de bord Snipcart → API keys) |
| `TINA_CLIENT_ID`, `TINA_TOKEN` | pour l'édition en ligne | projet TinaCloud relié au dépôt |

## Espace d'édition (TinaCMS)
- En local : `npm run dev:cms`, aucun compte nécessaire.
- En ligne (`/admin/`) : nécessite un projet **TinaCloud** relié au dépôt GitHub du client. Les modifications du
  client sont commitées sur GitHub, ce qui relance la CI et met le site à jour.
  À la création du modèle, TinaCloud proposait une offre gratuite limitée à 2 utilisateurs
  (source : [tina.io/pricing](https://tina.io/pricing)) — **à revérifier** avant de l'annoncer à un client.
- Le client peut modifier le contenu des pages, créer des articles et gérer ses produits ; il ne peut pas créer de pages
  (le nombre de pages dépend du forfait).

## Garder le modèle à jour
- Le catalogue `src/moyo/catalogue.ts` copie les offres de moyoweb.fr (`moyoweb/src/data/devis.ts`) :
  le mettre à jour si les forfaits ou les options changent.
- Les avertissements `npm audit` viennent de l'outillage TinaCMS (dépendances de développement) ;
  le site publié n'embarque aucune de ces dépendances (`npm audit --omit=dev` : 0 vulnérabilité).
