// Projet dérivé de la fiche client : options actives, quotas, services tiers.
// Utilisé par le site (pages légales, consentement, SEO) ET par scripts/moyo-check.ts.
import { OPTIONS, PLANS, type OptionId } from './catalogue.ts';
import type { FicheClient } from './fiche.ts';

export interface ServiceTiers {
  id: string; // identifiant tarteaucitron (https://tarteaucitron.io/fr/install/)
  nom: string;
  option: OptionId;
}

export function deriveProjet(f: FicheClient) {
  const plan = PLANS[f.forfait];
  const incluses = (Object.values(OPTIONS) as (typeof OPTIONS)[OptionId][])
    .filter((o) => (o.inc?.[f.forfait] ?? 0) > 0)
    .map((o) => o.id);
  const actives = new Set<OptionId>([...incluses, ...f.options]);
  const articlesInclus = OPTIONS.seo.inc?.[f.forfait] ?? 0;
  const articlesSeo = articlesInclus + Math.max(0, f.articlesSeoAchetes);
  if (articlesSeo > 0) actives.add('seo');
  else actives.delete('seo');

  // Services qui déposent des cookies ou appellent un tiers : déclarés dans tarteaucitron.
  const services: ServiceTiers[] = [];
  if (actives.has('ana')) services.push({ id: 'gtag', nom: 'Google Analytics 4', option: 'ana' });

  return {
    plan,
    actives,
    has: (o: OptionId) => actives.has(o),
    incluses,
    articlesInclus,
    articlesSeo,
    langues: f.site.langues,
    services,
  };
}

export type Projet = ReturnType<typeof deriveProjet>;
