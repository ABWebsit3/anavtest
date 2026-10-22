// Format de la fiche client (moyo.client.ts). Tout champ laissé vide ('') s'affiche « [À compléter] »
// sur le site et bloque le déploiement (npm run check:prod).
import type { OptionId, PlanId } from './catalogue.ts';

export type Langue = 'fr' | 'en' | 'es' | 'de' | 'it' | 'pt' | 'nl';

export interface FicheClient {
  /** true tant que la fiche contient les données fictives du modèle : bloque le déploiement. */
  exemple: boolean;
  forfait: PlanId;
  engagement: boolean;
  /** Options achetées en plus du forfait. Les options incluses dans le forfait sont activées d'office. */
  options: OptionId[];
  /** Articles SEO achetés en plus de ceux inclus dans le forfait (3 en Standard, 6 en Premium). */
  articlesSeoAchetes: number;

  site: {
    nom: string;
    /** Adresse définitive, ex. https://www.exemple.fr (sans / final). */
    url: string;
    /** Première langue = langue par défaut (sans préfixe dans l'URL). Plus d'une langue = option « multi ». */
    langues: Langue[];
    description: string;
    couleurs: { primaire: string; fond: string; texte: string };
    /** Type schema.org de l'éditeur dans les données structurées (JSON-LD). Défaut : 'Organization'.
     *  'NGO' (association), 'LocalBusiness' ou un sous-type (commerce recevant du public, horaires fournis)… */
    typeSchema?: string;
  };

  /** Éditeur du site = le client (mentions légales, art. 6 III LCEN). */
  editeur: {
    raisonSociale: string;
    nomCommercial: string;
    /** ex. « Entrepreneur individuel », « SARL », « SAS », « Association loi 1901 ». */
    formeJuridique: string;
    /** Personne physique : nom et prénom (+ « EI » pour un entrepreneur individuel). */
    representant: string;
    adresse: string;
    siren: string;
    siret: string;
    /** ex. « RCS Narbonne 123 456 789 », « Registre national des entreprises (RNE) », « RNA W… ».
     *  Association : numéro RNA (W + 9 chiffres, récépissé de la préfecture) ; SIRET facultatif s'il n'en a pas. */
    immatriculation: string;
    /** Sociétés uniquement (laisser vide sinon). */
    capital: string;
    /** N° de TVA intracommunautaire, ou vide si non assujetti. */
    tvaIntracom: string;
    telephone: string;
    email: string;
    /** Personne morale : de plein droit son représentant légal (art. 93-2 loi n° 82-652 du 29 juillet 1982). */
    directeurPublication: string;
  };

  hebergeur: { nom: string; adresse: string; telephone: string };

  /** Option e-commerce (Snipcart). La clé publique Snipcart n'est PAS ici : secret PUBLIC_SNIPCART_API_KEY. */
  boutique: {
    /** Code ISO de la devise du compte Snipcart, ex. 'EUR'. */
    devise: string;
    /** « TVA non applicable, art. 293 B du CGI » ou « Prix TTC » : affiché sous chaque prix. */
    mentionPrix: string;
  };

  /** Adresse qui reçoit les messages du formulaire de contact. */
  contactEmail: string;

  /** Prestataires cités dans la politique de confidentialité, selon les options (nom + pays). */
  prestataires: {
    paiement?: string; // ecom : passerelle reliée à Snipcart, ex. « Stripe (Stripe Payments Europe, Limited, Irlande) »
    reservation?: string; // resa
    newsletter?: string; // news
    reseauxSociaux?: string; // feed / chat
  };

  /** Option Analytics : durée de conservation réglée dans la propriété GA4 (Administration > Conservation des données),
   *  citée dans la confidentialité. Vide tant que la propriété n'est pas réglée → [À compléter]. */
  ga4Conservation?: '' | '2 mois' | '14 mois';

  /** Date affichée sur les pages légales (« Dernière mise à jour »). */
  dateMiseAJourLegale: string;
}

export const defineClient = (f: FicheClient) => f;
