# Checklist — ANAV-AJ

Forfait **Standard** (engagement 24 mois) · options actives : Articles SEO, Site multilingue, Rapport Analytics.
Généré par `npm run check` le 22/10/2026 12:47:08. Ne pas modifier à la main.

## Fiche client

- ⚠️ URL du site provisoire (https://www.anav-test.fr) : domaine définitif à confirmer (canonical, sitemap).
- ⚠️ Éditeur : Représentant (nom, prénom) à renseigner.
- ⚠️ Éditeur : Immatriculation (RCS, RNE, RNA…) à renseigner.
- ⚠️ Éditeur : Directeur de la publication à renseigner.
- ⚠️ Date de mise à jour des pages légales à renseigner.

## Langues

- ⚠️ Option « Site multilingue » active mais une seule langue dans la fiche (site.langues).

## Pages

- ✅ 6/6 pages (forfait Standard, pages légales non comptées).
- ⚠️ Contenu à compléter dans fr/partenaires.md.

## Images

- ✅ Aucune image de plus de 300 Ko dans public/.

## Articles SEO

- ✅ 3/3 articles (3 inclus + 0 acheté(s)).

## Options

- ⚠️ Rapport Analytics : ga4Conservation à renseigner (« 2 mois » ou « 14 mois », réglage de la propriété GA4 : confidentialité).

## Suivi

- ⚠️ Pages légales relues (agent legal) : à faire.
- ✅ SEO technique (agent seo-technique) — Vérifié le 22/10/2026 : Lighthouse local mobile perf 98-100, accessibilité 96-100 (contraste des seuls « [À compléter] »), bonnes pratiques 100, SEO 100 ; JSON-LD NGO + lieux, WebSite, BreadcrumbList (validator.schema.org : 0 erreur). Restent côté client : domaine définitif (URL de test, bloquée par check:prod ; rebuild suffit), logo et image de partage (og:image absente, favicon « AJ » provisoire), horaires des lieux, photos (WebP ≤ 300 Ko).
- ✅ SEO de contenu et articles (agent seo-contenu) — Fait le 22/10/2026 (SEO de base, à valider par le client). Mots-clés par page : accueil « aide aux victimes Narbonne » ; aide-aux-victimes « accompagnement des victimes Narbonne » ; association « association ANAV-AJ » (requête de marque) ; partenaires « partenaires aide aux victimes Aude » ; actions-missions « stage de responsabilisation Narbonne » ; contact « bureau d'aide aux victimes Narbonne ». Articles (3/3, sourcés Service-Public.fr) : victime-infraction-premieres-demarches « victime d'une infraction que faire » ; porter-plainte-partie-civile « se constituer partie civile » ; indemnisation-victime-civi-sarvi « indemnisation victime CIVI ». Titres ≤ 60 car. affichés, descriptions ≤ 151, 1 H1/page, 4 liens internes ajoutés dans des champs existants. Articles et choix de mots-clés à relire et valider par l'association ; page /blog/ non reliée au menu (défaut du modèle).
- ⚠️ Option Rapport Analytics livrée : à faire.
- ⚠️ Recette complète (agent recette) : à faire.
- ⚠️ Mise en ligne vérifiée (agent deploiement) : à faire.

## Build

- ⚠️ « [À compléter] » encore affiché dans : 404.html, actions-missions/index.html, aide-aux-victimes/index.html, association/index.html, blog/indemnisation-victime-civi-sarvi/index.html, blog/index.html, blog/porter-plainte-partie-civile/index.html, blog/victime-infraction-premieres-demarches/index.html, confidentialite/index.html, contact/index.html, index.html, mentions-legales/index.html, partenaires/index.html.
