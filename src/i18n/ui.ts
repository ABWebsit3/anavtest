// Textes fixes de l'interface, par langue. Agent traduction : ajouter chaque langue de la fiche.
// Une langue absente retombe sur le français (et `npm run check` le signale).
import type { Langue } from '../moyo/fiche.ts';

const fr = {
  nomLangue: 'Français',
  menu: 'Menu',
  blog: 'Blog',
  lireArticle: 'Lire l’article',
  publieLe: 'Publié le',
  mentionsLegales: 'Mentions légales',
  confidentialite: 'Confidentialité',
  cgv: 'Conditions générales de vente',
  gestionCookies: 'Gestion des cookies',
  changerLangue: 'Langue',
  contactTitre: 'Nous écrire',
  contactNom: 'Nom',
  contactEmail: 'E-mail',
  contactMessage: 'Message',
  contactEnvoyer: 'Envoyer',
  contactRgpd: 'Vos informations servent uniquement à répondre à votre message.',
  contactEnSavoirPlus: 'En savoir plus',
  contactOk: 'Merci ! Votre message a bien été envoyé.',
  contactErreur: 'L’envoi a échoué. Réessayez dans un instant ou écrivez-nous directement par e-mail.',
  pageIntrouvable: 'Page introuvable',
  retourAccueil: 'Retour à l’accueil',
  boutique: 'Boutique',
  panier: 'Panier',
  ajouterPanier: 'Ajouter au panier',
  voirProduit: 'Voir le produit',
};

export type Textes = typeof fr;

const en: Textes = {
  nomLangue: 'English',
  menu: 'Menu',
  blog: 'Blog',
  lireArticle: 'Read the article',
  publieLe: 'Published on',
  mentionsLegales: 'Legal notice',
  confidentialite: 'Privacy',
  cgv: 'Terms of sale',
  gestionCookies: 'Cookie settings',
  changerLangue: 'Language',
  contactTitre: 'Get in touch',
  contactNom: 'Name',
  contactEmail: 'Email',
  contactMessage: 'Message',
  contactEnvoyer: 'Send',
  contactRgpd: 'Your details are only used to reply to your message.',
  contactEnSavoirPlus: 'Learn more',
  contactOk: 'Thank you! Your message has been sent.',
  contactErreur: 'Sending failed. Please try again in a moment or email us directly.',
  pageIntrouvable: 'Page not found',
  retourAccueil: 'Back to home',
  boutique: 'Shop',
  panier: 'Cart',
  ajouterPanier: 'Add to cart',
  voirProduit: 'View product',
};

export const UI: Partial<Record<Langue, Textes>> = { fr, en };
export const t = (lang: Langue): Textes => UI[lang] ?? fr;
