// sitemap.xml (agent seo-technique) : pages, blog, articles et pages légales, avec les versions par langue.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { fiche, projet, decouper, urlPage, urlArticle, urlProduit, prefixe } from '../moyo/site';

export const GET: APIRoute = async ({ site }) => {
  const pages = await getCollection('pages');
  const articles = await getCollection('articles');
  const groupes = new Map<string, { lang: string; loc: string }[]>();
  const ajouter = (cle: string, lang: string, loc: string) => groupes.set(cle, [...(groupes.get(cle) ?? []), { lang, loc }]);
  for (const p of pages) ajouter(`p:${decouper(p.id).nom}`, decouper(p.id).lang, urlPage(p.id));
  for (const a of articles) ajouter(`a:${decouper(a.id).nom}`, decouper(a.id).lang, urlArticle(a.id));
  for (const l of fiche.site.langues) if (articles.some((a) => decouper(a.id).lang === l)) ajouter('blog', l, `${prefixe(l)}/blog/`);
  if (projet.has('ecom')) {
    const produits = await getCollection('produits');
    for (const x of produits) ajouter(`x:${decouper(x.id).nom}`, decouper(x.id).lang, urlProduit(x.id));
    for (const l of fiche.site.langues) if (produits.some((x) => decouper(x.id).lang === l)) ajouter('boutique', l, `${prefixe(l)}/boutique/`);
  }
  for (const legal of ['mentions-legales', 'confidentialite', ...(projet.has('ecom') ? ['conditions-generales-de-vente'] : [])])
    ajouter(legal, 'fr', `/${legal}/`);

  const abs = (u: string) => new URL(u, site).href;
  const urls = [...groupes.values()].flatMap((versions) =>
    versions.map((v) => {
      const alt = versions.length > 1 ? versions.map((x) => `\n    <xhtml:link rel="alternate" hreflang="${x.lang}" href="${abs(x.loc)}"/>`).join('') : '';
      return `  <url>\n    <loc>${abs(v.loc)}</loc>${alt}\n  </url>`;
    }),
  );
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
