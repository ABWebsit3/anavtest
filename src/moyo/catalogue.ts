// Catalogue Moyo : forfaits et options vendus sur moyoweb.fr.
// ⚠ Copie de moyoweb/src/data/devis.ts (PLANS, OPTS) : à resynchroniser si les offres changent.

export type PlanId = 'starter' | 'pro' | 'elite';
export type OptionId = 'ecom' | 'seo' | 'multi' | 'resa' | 'chat' | 'feed' | 'logo' | 'gmb' | 'news' | 'seag' | 'seaf' | 'ana';

export interface Plan {
  id: PlanId;
  name: string;
  pagesMax: number;
  seo: 'aucun' | 'base' | 'premium';
  extras: string[]; // prestations du forfait à ne pas oublier (hors options)
}

export interface Option {
  id: OptionId;
  name: string;
  inc?: Partial<Record<PlanId, number>>; // incluse dans ces forfaits (quantité)
}

export const PLANS: Record<PlanId, Plan> = {
  starter: { id: 'starter', name: 'Essentielle', pagesMax: 3, seo: 'aucun', extras: ['Design personnalisé', 'Formulaire de contact'] },
  pro: { id: 'pro', name: 'Standard', pagesMax: 6, seo: 'base', extras: ['Design premium', 'Formulaire de contact', 'SEO de base'] },
  elite: { id: 'elite', name: 'Premium', pagesMax: 10, seo: 'premium', extras: ['Design sur-mesure', 'Formulaire de contact', 'Intégration API / automatisations', 'SEO premium'] },
};

export const OPTIONS: Record<OptionId, Option> = {
  ecom: { id: 'ecom', name: 'E-commerce' },
  seo: { id: 'seo', name: 'Articles SEO', inc: { pro: 3, elite: 6 } },
  multi: { id: 'multi', name: 'Site multilingue', inc: { pro: 1, elite: 1 } },
  resa: { id: 'resa', name: 'Système de réservation' },
  chat: { id: 'chat', name: 'Chat Messenger / WhatsApp' },
  feed: { id: 'feed', name: 'Fil d’actualités' },
  logo: { id: 'logo', name: 'Création de logo' },
  gmb: { id: 'gmb', name: 'Google My Business' },
  news: { id: 'news', name: 'Newsletter / Emailing' },
  seag: { id: 'seag', name: 'SEA (Google)' },
  seaf: { id: 'seaf', name: 'SEA (Facebook)' },
  ana: { id: 'ana', name: 'Rapport Analytics', inc: { pro: 1, elite: 1 } },
};
