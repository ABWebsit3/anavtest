// Point d'accès unique du site à la fiche client et au projet dérivé.
import fiche from '../../moyo.client.ts';
import { deriveProjet } from './projet.ts';
import type { Langue } from './fiche.ts';

export { fiche };
export const projet = deriveProjet(fiche);
export const langueDefaut = fiche.site.langues[0];

/** Préfixe d'URL d'une langue ('' pour la langue par défaut, '/en' sinon). */
export const prefixe = (lang: Langue) => (lang === langueDefaut ? '' : `/${lang}`);

/** Découpe l'id d'un contenu (« en/services ») en langue + nom. */
export function decouper(id: string) {
  const [lang, ...reste] = id.split('/');
  return { lang: lang as Langue, nom: reste.join('/') };
}

export const urlPage = (id: string) => {
  const { lang, nom } = decouper(id);
  return `${prefixe(lang)}/${nom === 'accueil' ? '' : `${nom}/`}`;
};
export const urlProduit = (id: string) => {
  const { lang, nom } = decouper(id);
  return `${prefixe(lang)}/boutique/${nom}/`;
};
export const urlArticle = (id: string) => {
  const { lang, nom } = decouper(id);
  return `${prefixe(lang)}/blog/${nom}/`;
};
