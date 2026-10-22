// Espace d'édition du client (TinaCMS) : /admin/ sur le site en ligne.
// Les modifications sont commitées sur GitHub, ce qui relance la CI et redéploie le site.
// Identifiants TinaCloud : variables TINA_CLIENT_ID et TINA_TOKEN (jamais dans le dépôt).
import { defineConfig } from 'tinacms';

const champsCommuns = [
  { type: 'string' as const, name: 'titre', label: 'Titre', isTitle: true, required: true },
  { type: 'string' as const, name: 'description', label: 'Description (Google, 150 caractères env.)', required: true, ui: { component: 'textarea' } },
];

export default defineConfig({
  branch: process.env.TINA_BRANCH || process.env.GITHUB_REF_NAME || 'main',
  clientId: process.env.TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',
  build: { outputFolder: 'admin', publicFolder: 'public' },
  media: { tina: { mediaRoot: 'images', publicFolder: 'public' } },
  schema: {
    collections: [
      {
        name: 'pages',
        label: 'Pages',
        path: 'content/pages',
        format: 'md',
        // Un dossier par langue (fr/, en/…) : le même nom de fichier dans chaque dossier = même page traduite.
        match: { include: '*/*' },
        ui: { allowedActions: { create: false, delete: false } }, // le nombre de pages dépend du forfait
        fields: [
          ...champsCommuns,
          { type: 'string', name: 'menu', label: 'Libellé dans le menu (vide = pas dans le menu)' },
          { type: 'number', name: 'ordre', label: 'Ordre dans le menu' },
          { type: 'boolean', name: 'formulaire', label: 'Afficher le formulaire de contact' },
          { type: 'rich-text', name: 'body', label: 'Contenu', isBody: true },
        ],
      },
      {
        name: 'articles',
        label: 'Articles',
        path: 'content/articles',
        format: 'md',
        match: { include: '*/*' },
        fields: [
          ...champsCommuns,
          { type: 'datetime', name: 'date', label: 'Date de publication', required: true },
          { type: 'string', name: 'motCle', label: 'Mot-clé principal visé' },
          { type: 'rich-text', name: 'body', label: 'Contenu', isBody: true },
        ],
      },
      {
        // Option e-commerce (Snipcart). Le nom du fichier = identifiant du produit : ne pas le renommer après la mise
        // en vente, et garder le même nom (et le même prix) dans chaque dossier de langue.
        name: 'produits',
        label: 'Produits (boutique)',
        path: 'content/produits',
        format: 'md',
        match: { include: '*/*' },
        fields: [
          { type: 'string', name: 'nom', label: 'Nom du produit', isTitle: true, required: true },
          { type: 'string', name: 'description', label: 'Description courte', required: true, ui: { component: 'textarea' } },
          { type: 'number', name: 'prix', label: 'Prix', required: true },
          { type: 'image', name: 'image', label: 'Photo' },
          { type: 'number', name: 'poids', label: 'Poids en grammes (livraison)' },
          { type: 'number', name: 'ordre', label: 'Ordre dans la boutique' },
          { type: 'rich-text', name: 'body', label: 'Description détaillée', isBody: true },
        ],
      },
    ],
  },
});
