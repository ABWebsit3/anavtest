// Contenus éditables (TinaCMS) : content/pages/<langue>/<page>.md et content/articles/<langue>/<article>.md.
// Le dossier donne la langue, le nom du fichier donne l'adresse (accueil.md → page d'accueil).
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const pages = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './content/pages' }),
  schema: z.object({
    titre: z.string(),
    description: z.string(),
    menu: z.string().optional(), // libellé dans le menu (absent = pas dans le menu)
    ordre: z.number().default(50),
    formulaire: z.boolean().default(false), // affiche le formulaire de contact sous le contenu
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './content/articles' }),
  schema: z.object({
    titre: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    motCle: z.string().optional(), // requête principale visée (agent seo-contenu)
  }),
});

// Option e-commerce (Snipcart) : content/produits/<langue>/<produit>.md
// Le nom du fichier sert d'identifiant Snipcart (data-item-id) : identique dans toutes les langues, ne pas le changer
// après la mise en vente (les commandes passées y font référence).
const produits = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './content/produits' }),
  schema: z.object({
    nom: z.string(),
    description: z.string(),
    prix: z.number().positive(), // dans la devise de la fiche (boutique.devise)
    image: z.string().optional(), // ex. /images/produit.jpg (médiathèque TinaCMS)
    poids: z.number().positive().optional(), // en grammes, pour le calcul de la livraison
    ordre: z.number().default(50),
  }),
});

export const collections = { pages, articles, produits };
