// llms.txt : résumé du site pour les assistants IA (agent seo-technique).
import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import { fiche, projet, langueDefaut, decouper, urlPage, urlArticle, urlProduit } from '../moyo/site';

export const GET: APIRoute = async ({ site }) => {
  const abs = (u: string) => new URL(u, site).href;
  const pages = (await getCollection('pages')).filter((p) => decouper(p.id).lang === langueDefaut);
  const articles = (await getCollection('articles')).filter((a) => decouper(a.id).lang === langueDefaut);
  const produits = projet.has('ecom') ? (await getCollection('produits')).filter((x) => decouper(x.id).lang === langueDefaut) : [];
  const prix = (n: number) => new Intl.NumberFormat(langueDefaut, { style: 'currency', currency: fiche.boutique.devise }).format(n);
  const e = fiche.editeur;
  // Lieux d'accueil des réglages communs (content/reglages/<langue>.md), s'il y en a.
  const lieux = (await getEntry('reglages', langueDefaut))?.data.lieux ?? [];
  const lieu = (l: (typeof lieux)[number]) =>
    `- ${l.nom}${l.batiment ? `, ${l.batiment}` : ''} : ${[l.adresse ?? l.description, l.telephones.length && `tél. ${l.telephones.join(', ')}`, l.email, l.horaires && `horaires : ${l.horaires.replace(/\s*\n\s*/g, ' ; ')}`].filter(Boolean).join(' · ')}`;
  const txt = [
    `# ${fiche.site.nom}`,
    '',
    `> ${fiche.site.description}`,
    '',
    ...(e.email || e.telephone || e.adresse ? ['## Contact', '', ...[e.email && `- E-mail : ${e.email}`, e.telephone && `- Téléphone : ${e.telephone}`, e.adresse && `- Adresse : ${e.adresse}`].filter(Boolean), ''] : []),
    ...(lieux.length ? ['## Lieux d’accueil', '', ...lieux.map(lieu), ''] : []),
    '## Pages',
    '',
    ...pages.sort((a, b) => a.data.ordre - b.data.ordre).map((p) => `- [${p.data.titre}](${abs(urlPage(p.id))}) : ${p.data.description}`),
    ...(articles.length ? ['', '## Articles', '', ...articles.map((a) => `- [${a.data.titre}](${abs(urlArticle(a.id))}) : ${a.data.description}`)] : []),
    ...(produits.length ? ['', '## Boutique', '', ...produits.map((x) => `- [${x.data.nom}](${abs(urlProduit(x.id))}) : ${prix(x.data.prix)}. ${x.data.description}`)] : []),
    '',
  ].join('\n');
  return new Response(txt, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
