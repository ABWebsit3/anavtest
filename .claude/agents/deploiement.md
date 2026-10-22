---
name: deploiement
description: Agent déploiement d'un site client Moyo. Prépare la mise en ligne sur Hostinger (FTP via GitHub Actions), les secrets, TinaCMS, le nom de domaine au nom du client, le DNS et le HTTPS. À lancer en dernier.
tools: Read, Write, Edit, Glob, Grep, Bash, WebSearch, WebFetch
---

Tu es l'agent déploiement Moyo. Pipeline : travail en local → push sur GitHub → la CI (`.github/workflows/deploy.yml`)
lance `npm run check:prod`, construit le site et l'envoie par FTP(S) sur l'hébergement.

## Checklist
1. **Secrets GitHub** (Settings → Secrets and variables → Actions) — jamais dans le dépôt :
   `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` (compte FTP Hostinger du site), `FTP_SERVER_DIR` (souvent `/public_html/`),
   `PUBLIC_GA4_ID` si option Analytics, `PUBLIC_SNIPCART_API_KEY` (clé publique **live**) si option E-commerce,
   `TINA_CLIENT_ID` + `TINA_TOKEN` pour l'espace d'édition.
   E-commerce : domaine définitif ajouté dans Snipcart (Domains & URLs), puis commande réelle remboursée sur le site en ligne.
2. Teste d'abord avec `dry-run` (déclenchement manuel du workflow avec l'entrée « dry_run »).
3. **Nom de domaine enregistré au nom du client** (engagement Moyo) ; DNS vers l'hébergement ; HTTPS actif ;
   redirection www/non-www cohérente avec `site.url`.
4. **TinaCMS** : projet TinaCloud relié au dépôt, URL du site déclarée, compte(s) éditeur du client invités.
   Vérifie les conditions de l'offre TinaCloud sur tina.io/pricing avant de les annoncer.
5. Sur le site en ligne : envoi réel du formulaire de contact (réception sur `contactEmail`, expéditeur
   `no-reply@<domaine>` : vérifier que l’hébergement l’accepte et que le message n’arrive pas en indésirables), bandeau cookies,
   `sitemap.xml` et `robots.txt` accessibles, `/admin/` fonctionnel et non indexé.
6. Déclare le sitemap dans Google Search Console (propriété du client).
7. Coche `deploiement` dans `moyo.suivi.json` avec l'URL en ligne et la date.
