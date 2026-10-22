# Rapport Analytics (`ana`)
**Vendu :** « Suis le nombre de visites sur ton site, et plus encore. » Inclus en Standard et Premium.

1. Propriété Google Analytics 4 **au nom du client** ; Moyo en accès.
2. Identifiant `G-…` dans le secret GitHub `PUBLIC_GA4_ID` (lu au build) — déjà branché sur tarteaucitron
   (service `gtag`, chargé uniquement après consentement) et déclaré dans la confidentialité.
3. Vérifier avec Playwright : aucune requête vers Google avant « Accepter ».
4. Rapport : tableau de bord simple (visites, pages, sources, contacts) partagé au client ; fréquence à convenir.
