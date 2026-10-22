// FICHE CLIENT — point de départ de tout le projet (voir README, « Démarrer un nouveau site »).
// Les agents et `npm run check` lisent cette fiche : forfait, options et infos légales décident
// de ce qui doit être construit. Ne jamais inventer une donnée légale : laisser '' (→ [À compléter]).
import { defineClient } from './src/moyo/fiche.ts';

export default defineClient({
  exemple: true, // ← passer à false une fois la fiche remplie avec les vraies données du client

  forfait: 'pro', // 'starter' (Essentielle) | 'pro' (Standard) | 'elite' (Premium)
  engagement: true,
  options: [], // ex. ['ecom', 'resa', 'chat'] — celles incluses dans le forfait sont ajoutées d'office
  articlesSeoAchetes: 0,

  site: {
    nom: 'Atelier Exemple',
    url: 'https://www.exemple.fr',
    langues: ['fr', 'en'],
    description: 'Site d’exemple du modèle Moyo (client fictif).',
    couleurs: { primaire: '#8A4FFF', fond: '#FFFBF4', texte: '#17131F' },
  },

  editeur: {
    raisonSociale: 'Atelier Exemple',
    nomCommercial: '',
    formeJuridique: '',
    representant: '',
    adresse: '',
    siren: '',
    siret: '',
    immatriculation: '',
    capital: '',
    tvaIntracom: '',
    telephone: '',
    email: 'contact@exemple.fr',
    directeurPublication: '',
  },

  // Hébergement Moyo : entité et adresse issues des conditions générales Hostinger (clients UE).
  hebergeur: { nom: 'Hostinger International Ltd', adresse: '61 Lordou Vironos Street, 6023 Larnaca, Chypre', telephone: '' },

  // Option e-commerce (Snipcart) uniquement. Produits : content/produits/<langue>/<produit>.md
  boutique: { devise: 'EUR', mentionPrix: '' },

  contactEmail: 'contact@exemple.fr',

  prestataires: {},

  dateMiseAJourLegale: '',
});
