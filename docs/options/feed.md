# Fil d'actualités (`feed`)
**Vendu :** « Affiche tes derniers posts Instagram / Facebook. »

1. Les intégrations officielles chargent des scripts Meta (cookies) : uniquement après consentement (tarteaucitron
   propose des services Facebook/Instagram) ou affichage au clic.
2. Alternative sans cookie : récupérer les publications au build (API officielle, jeton **en secret GitHub**) et les
   afficher en HTML statique — vérifier les conditions de l'API à jour.
3. Renseigner `prestataires.reseauxSociaux` ; ajouter le service dans `deriveProjet()` si script tiers.
