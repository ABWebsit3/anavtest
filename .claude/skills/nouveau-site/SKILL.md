---
name: nouveau-site
description: Démarre ou reprend la création d'un site client Moyo à partir de la fiche moyo.client.ts, en déléguant aux agents (chef-de-projet, legal, traduction, seo-technique, seo-contenu, options, recette, deploiement). À utiliser quand l'utilisateur dit « nouveau site », « on lance le site de X », « où en est le site », ou tape /nouveau-site.
---

# Nouveau site Moyo

1. Si `moyo.client.ts` contient encore `exemple: true`, aide d'abord l'utilisateur à remplir la fiche :
   demande le devis accepté (forfait, engagement, options, articles achetés), les réponses au questionnaire
   pré-RDV et les informations légales du client. **Ne remplis aucun champ légal toi-même** : laisse `''`.
2. Lance `npm install` si `node_modules` est absent, puis `npm run check`.
3. Confie la suite à l'agent **chef-de-projet** (outil Agent, `subagent_type: chef-de-projet`) en lui passant
   le contenu de `CHECKLIST.md` et la demande de l'utilisateur.
4. Rends compte à l'utilisateur en français : ce qui est fait, ce qui reste, ce qu'il doit fournir.
