# E-commerce (`ecom`) — Snipcart

**Vendu :** « Un module pour vendre tes produits. Création des produits et configuration avec la banque incluses. »
**Solution retenue par Moyo : [Snipcart](https://snipcart.com)** (panier JavaScript sur site statique, Snipcart Inc.,
Québec, Canada — racheté par Duda en 2021).

> Les informations ci-dessous ont été vérifiées en octobre 2026 à partir de sources secondaires (la documentation
> Snipcart n'était pas joignable depuis l'environnement de création du modèle). **Relis la doc officielle à jour**
> avant chaque mise en place : https://docs.snipcart.com/v3/

## Ce que le modèle fait déjà
| Élément | Où |
|---|---|
| Chargement du panier (script officiel, stratégie `on-user-interaction`) | `src/components/Snipcart.astro`, inclus par `Layout.astro` si `ecom` actif |
| Bouton « Ajouter au panier » (`snipcart-add-item` + `data-item-*` dans le HTML statique) | `src/components/BoutonPanier.astro` |
| Bouton panier + compteur (`snipcart-checkout`, `snipcart-items-count`) | `src/components/Header.astro` |
| Pages `/boutique/` et `/boutique/<produit>/` (+ `/en/…`) | `src/pages/[...slug].astro` |
| Produits éditables par le client | `content/produits/<langue>/<produit>.md`, collection « Produits » dans TinaCMS |
| Confidentialité (Snipcart destinataire, transfert Canada, stockage du panier) et CGV | `src/legal/` |
| Contrôles (produits, prix identiques par langue, devise, clé, boutons dans le HTML) | `npm run check` |

Les pages produits et la page boutique **ne comptent pas** dans le plafond de pages du forfait (comme le blog).

## Étapes
1. **Compte Snipcart au nom du client** (il est le marchand). Moyo peut y être invité comme utilisateur.
   Tarif constaté : 2 % par transaction, avec un minimum mensuel (≈ 20 $ sous 1 000 $ de ventes) **plus** les frais
   de la passerelle — sources contradictoires : **vérifie sur https://snipcart.com/pricing** et annonce-le au client
   par écrit avant de commencer.
2. **Passerelle de paiement** (Stripe, PayPal… selon ce que propose Snipcart) **au nom du client**, reliée dans le
   tableau de bord Snipcart. Renseigne `prestataires.paiement` dans la fiche (ex. « Stripe (Stripe Payments Europe,
   Limited, Irlande) » — entité à vérifier dans le contrat du client).
3. **Domaines autorisés** (tableau de bord → Domains & URLs) : domaine définitif (`site.url`) et, pour les tests,
   le domaine de prévisualisation. Sans cela, la validation des commandes échoue.
4. **Clés API** : clé publique de **test** dans `.env` (local) ; clé **live** uniquement dans le secret GitHub
   `PUBLIC_SNIPCART_API_KEY`. Ne jamais écrire une clé dans le code. Ne jamais utiliser la clé secrète (API REST)
   côté site.
5. **Fiche client** : `boutique.devise` (même devise que le compte Snipcart) et `boutique.mentionPrix`
   (« Prix TTC » si le client est assujetti à la TVA, sinon « TVA non applicable, art. 293 B du CGI »).
6. **Réglages Snipcart** (tableau de bord) : devise, taxes (TVA ou aucune), livraison (zones, tarifs, poids),
   e-mails de commande en français, nom et adresse du marchand, lien vers les CGV `/conditions-generales-de-vente/`.
   Langue du panier : vérifier dans la doc comment Snipcart choisit la langue (le site renseigne `<html lang>`),
   et la traduction des textes du panier pour chaque langue de la fiche.
7. **Produits** (fournis par le client, rien d'inventé) : un fichier par produit dans `content/produits/<langue>/`.
   - Nom de fichier = identifiant Snipcart : court, sans accent, **jamais renommé** après la première vente.
   - Même nom de fichier et **même prix** dans chaque langue (le contrôle le vérifie).
   - Photos dans `public/images/` (médiathèque TinaCMS), poids en grammes si la livraison dépend du poids.
   - Variantes (taille, couleur) : attributs `data-item-custom…` à ajouter dans `BoutonPanier.astro` en suivant la
     doc « Product definition » ; un prix différent par variante doit lui aussi être lisible dans le HTML.
8. **Légal** (agent `legal`) : CGV de vente complètes, mention de prix, droit de rétractation, médiateur.
9. **Tests** : en mode test, commande complète (ajout, panier, livraison, paiement test, e-mail reçu) sur le site
   construit et publié (la validation relit la page `data-item-url` publiée). Puis, en live, une vraie commande
   remboursée. Vérifier que le prix modifié dans le HTML n'est pas accepté (validation Snipcart).
10. Coche `option:ecom` dans `moyo.suivi.json` avec : compte, passerelle, nombre de produits, date des tests.

## Points de vigilance
- Le script Snipcart se charge à la première interaction **ou au bout de 2,75 s** (stratégie officielle) : il appelle
  donc les serveurs Snipcart sur toutes les pages. L'agent `legal` vérifie que la confidentialité le décrit et que
  ce stockage relève bien de l'exemption « panier d'achat » de la CNIL (source à citer), sinon il le passe derrière
  tarteaucitron.
- Le transfert vers le Canada est décrit dans la confidentialité (décision d'adéquation UE) : l'agent `legal`
  vérifie que cette décision est toujours en vigueur et ajoute le DPA Snipcart (https://cdn.snipcart.com/legal/dpa.pdf).
