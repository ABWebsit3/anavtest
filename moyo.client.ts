// FICHE CLIENT — point de départ de tout le projet (voir README, « Démarrer un nouveau site »).
// Les agents et `npm run check` lisent cette fiche : forfait, options et infos légales décident
// de ce qui doit être construit. Ne jamais inventer une donnée légale : laisser '' (→ [À compléter]).
import { defineClient } from './src/moyo/fiche.ts';

export default defineClient({
  exemple: false, // ← passer à false une fois la fiche remplie avec les vraies données du client

  forfait: 'pro', // 'starter' (Essentielle) | 'pro' (Standard) | 'elite' (Premium)
  engagement: true,
  options: [], // ex. ['ecom', 'resa', 'chat'] — celles incluses dans le forfait sont ajoutées d'office
  articlesSeoAchetes: 0,

  site: {
    nom: 'ANAV-AJ',
    url: 'https://www.anav-test.fr',
    langues: ['fr'],
    description: 'Association d’aide aux victimes d’infractions pénales à Narbonne : accueil gratuit et confidentiel, accompagnement juridique, social et psychologique.',
    couleurs: { primaire: '#1D4E89', fond: '#F7F8F6', texte: '#14213D' },
    typeSchema: 'NGO', // association loi 1901 : schema.org/NGO (sous-type d'Organization), voir agent seo-technique
  },

  editeur: {
    // Repris de la maquette fournie (pied de page, page Contact) : à confirmer par le client.
    raisonSociale: 'Association Narbonnaise d’Aide aux Victimes d’Infractions Pénales et Actions de Justice',
    nomCommercial: 'ANAV-AJ',
    formeJuridique: 'Association loi 1901',
    representant: '',
    adresse: 'Espace Maraussan, 56 route de Lunes, 11100 Narbonne',
    siren: '',
    siret: '',
    immatriculation: '',
    capital: '',
    tvaIntracom: '',
    telephone: '04 68 41 40 97',
    email: 'anav2@wanadoo.fr',
    directeurPublication: '',
  },

  // Hébergement Moyo : entité et adresse issues des conditions générales Hostinger (clients UE).
  hebergeur: { nom: 'Hostinger International Ltd', adresse: '61 Lordou Vironos Street, 6023 Larnaca, Chypre', telephone: '' },

  // Option e-commerce (Snipcart) uniquement. Produits : content/produits/<langue>/<produit>.md
  boutique: { devise: 'EUR', mentionPrix: '' },

  contactEmail: 'anav2@wanadoo.fr',

  prestataires: {},

  // Option Analytics : '2 mois' ou '14 mois', une fois la conservation réglée dans la propriété GA4 du client.
  ga4Conservation: '',

  dateMiseAJourLegale: '',
});
