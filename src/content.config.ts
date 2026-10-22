// Contenus éditables (TinaCMS) : content/pages/<langue>/<page>.md et content/articles/<langue>/<article>.md.
// Le dossier donne la langue, le nom du fichier donne l'adresse (accueil.md → page d'accueil).
// Les pages sont composées de sections (blocs du design, voir src/components/sections/) : même liste de
// modèles que dans tina/config.ts. Les réglages communs (bandeau, lieux, pied de page) sont dans content/reglages/.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Champs facultatifs : l'espace d'édition (Pages CMS, auparavant TinaCMS) peut écrire "", null ou omettre un champ vidé.
const vide = (v: unknown) => (v === '' || v === null ? undefined : v);
const txt = z.string().nullish();
const choix = <const T extends [string, ...string[]]>(valeurs: T) => z.preprocess(vide, z.enum(valeurs).optional());
const liste = <T extends z.ZodType>(t: T) => z.array(t).nullish().transform((v) => v ?? []);
const lien = z.object({ libelle: txt, url: txt }).nullish();
const bouton = z.object({ libelle: txt, url: txt, style: choix(['primaire', 'secondaire', 'clair']) });
const fond = choix(['blanc', 'gris', 'bleu', 'sombre']);
const commun = { ancre: txt, fond };

const sections = z.discriminatedUnion('_template', [
  z.object({
    _template: z.literal('accroche'),
    ...commun,
    surtitre: txt,
    titre: z.string(),
    texte: txt,
    boutons: liste(bouton),
    puces: liste(z.string()),
    image: txt,
    imageAlt: txt,
    consignePhoto: txt,
    encart: z.object({ surtitre: txt, texte: txt, telephone: txt }).nullish(),
  }),
  z.object({
    _template: z.literal('bandeau'),
    ...commun,
    titre: z.string(),
    texte: txt,
    sommaire: liste(z.object({ libelle: z.string(), ancre: z.string() })),
  }),
  z.object({
    _template: z.literal('cartes'),
    ...commun,
    surtitre: txt,
    titre: txt,
    texte: txt,
    style: choix(['simples', 'numerotees', 'etapes', 'pastel', 'etiquettes']),
    colonnes: z.preprocess(vide, z.number().int().min(1).max(4).optional()),
    cartes: liste(z.object({ surtitre: txt, titre: txt, texte: txt, liste: liste(z.string()), lien })),
    note: txt,
    appel: z.object({ texte: txt, bouton: bouton.nullish() }).nullish(),
  }),
  z.object({
    _template: z.literal('colonnes'),
    ...commun,
    surtitre: txt,
    titre: z.string(),
    sousTitre: txt,
    texte: txt,
    encadre: z.object({ titre: txt, texte: txt }).nullish(),
    lien,
    image: txt,
    imageAlt: txt,
    consignePhoto: txt,
    texteDroite: txt,
    listes: liste(z.object({ titre: txt, coches: z.boolean().nullish(), items: liste(z.string()) })),
    noteDroite: txt,
  }),
  z.object({
    _template: z.literal('chiffres'),
    ...commun,
    titre: txt,
    chiffres: liste(z.object({ valeur: z.string(), texte: txt })),
    bouton: bouton.nullish(),
  }),
  z.object({
    _template: z.literal('lieux'),
    ...commun,
    titre: txt,
    texte: txt,
    lien,
    affichage: choix(['resume', 'detail']),
  }),
  z.object({
    _template: z.literal('faq'),
    ...commun,
    titre: txt,
    texte: txt,
    questions: liste(z.object({ question: z.string(), reponse: txt })),
  }),
  z.object({
    _template: z.literal('liens'),
    ...commun,
    titre: txt,
    liens: liste(z.object({ valeur: z.string(), texte: txt, url: txt })),
    note: txt,
  }),
  z.object({
    _template: z.literal('equipe'),
    ...commun,
    titre: txt,
    texte: txt,
    membres: liste(z.object({ fonction: txt, nom: z.string(), description: txt, photo: txt })),
  }),
  z.object({
    _template: z.literal('partenaires'),
    ...commun,
    titre: txt,
    texte: txt,
    format: choix(['grand', 'petit']),
    partenaires: liste(z.object({ nom: z.string(), texte: txt, logo: txt, lien })),
  }),
  z.object({
    _template: z.literal('encart'),
    ...commun,
    couleur: choix(['blanc', 'vert', 'bleu']),
    document: z.boolean().nullish(),
    surtitre: txt,
    titre: z.string(),
    texte: txt,
    bouton: bouton.nullish(),
    aside: z.object({ titre: txt, texte: txt }).nullish(),
  }),
  z.object({
    _template: z.literal('formulaire'),
    ...commun,
    titre: txt,
    texte: txt,
    encadre: z.object({ titre: txt, texte: txt }).nullish(),
  }),
  z.object({
    _template: z.literal('appel'),
    ...commun,
    titre: txt,
    texte: txt,
  }),
  z.object({
    _template: z.literal('texte'),
    ...commun,
    titre: txt,
    texte: txt,
  }),
]);

export type Section = z.infer<typeof sections>;
export type SectionDe<T extends Section['_template']> = Extract<Section, { _template: T }>;

const pages = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './content/pages' }),
  schema: z.object({
    titre: z.string(),
    description: z.string(),
    menu: z.preprocess(vide, z.string().optional()), // libellé dans le menu (absent = pas dans le menu)
    ordre: z.preprocess(vide, z.number().default(50)),
    formulaire: z.preprocess(vide, z.boolean().default(false)), // affiche le formulaire de contact sous le contenu
    sections: liste(sections),
  }),
});

// Réglages communs à toutes les pages d'une langue : content/reglages/<langue>.md (en-tête, lieux, appel, pied de page).
const reglages = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/reglages' }),
  schema: z.object({
    bandeau: z.object({ texte: txt, urgence: txt, quitter: lien }).nullish(),
    logo: z.object({ sigle: txt, nom: z.string(), sousTitre: txt, image: txt }),
    telephone: txt, // bouton d'appel de l'en-tête
    lieux: liste(
      z.object({
        nom: z.string(),
        batiment: txt,
        adresse: txt,
        telephones: liste(z.string()),
        email: txt,
        horaires: txt,
        itineraire: txt,
        description: txt,
        rendezVous: lien,
      }),
    ),
    appel: z.object({ titre: z.string(), texte: txt, boutons: liste(z.object({ libelle: z.string(), url: z.string() })) }),
    pied: z.object({
      presentation: txt,
      contacts: liste(z.object({ libelle: z.string(), url: z.string() })),
      titreLogos: txt,
      logos: liste(z.object({ nom: z.string(), image: txt, url: txt })),
    }),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './content/articles' }),
  schema: z.object({
    titre: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    motCle: z.preprocess(vide, z.string().optional()), // requête principale visée (agent seo-contenu)
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

export const collections = { pages, reglages, articles, produits };
