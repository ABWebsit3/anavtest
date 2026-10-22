# Système de réservation (`resa`)
**Vendu :** « Calendrier de réservation en ligne pour tes rendez-vous. »

1. Choisir avec le client un outil adapté à son activité (prise de RDV, réservation de prestations, acompte ?).
   Vérifier offre gratuite/payante et conformité RGPD sur le site officiel.
2. Compte **au nom du client**. Renseigner `prestataires.reservation` dans la fiche.
3. Intégration : de préférence chargée au clic (« Afficher le calendrier ») ou via tarteaucitron, pour ne pas déposer
   de cookies avant action du visiteur. Ajouter le service dans `deriveProjet()` s'il dépose des cookies.
4. Tester une réservation réelle et la notification reçue par le client.
