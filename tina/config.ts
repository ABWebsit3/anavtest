// Espace d'édition du client (TinaCMS) : /admin/ sur le site en ligne.
// Les modifications sont commitées sur GitHub, ce qui relance la CI et redéploie le site.
// Identifiants TinaCloud : variables TINA_CLIENT_ID et TINA_TOKEN (jamais dans le dépôt).
import { defineConfig, type Template, type TinaField } from 'tinacms';

const champsCommuns = [
  { type: 'string' as const, name: 'titre', label: 'Titre', isTitle: true, required: true },
  { type: 'string' as const, name: 'description', label: 'Description (Google, 150 caractères env.)', required: true, ui: { component: 'textarea' } },
];

// --- Sections des pages (même liste que src/content.config.ts, rendu : src/components/sections/) ---------------
type Champ = Record<string, unknown>;
const texte = (name: string, label: string, extra: Champ = {}) => ({ type: 'string', name, label, ...extra }) as TinaField;
const multiligne = (name: string, label: string) =>
  texte(name, label, { ui: { component: 'textarea', description: '**gras**, [lien](https://…) ; ligne vide = nouveau paragraphe ; « - » en début de ligne = liste' } });
const choix = (name: string, label: string, options: [string, string][]) =>
  texte(name, label, { options: options.map(([value, label]) => ({ value, label })) });
const liste = (name: string, label: string) => texte(name, label, { list: true });
const champsLien = [texte('libelle', 'Libellé'), texte('url', 'Adresse (/page/, https://…, ou un numéro de téléphone)')];
const objet = (name: string, label: string, fields: TinaField[], extra: Champ = {}) => ({ type: 'object', name, label, fields, ...extra }) as TinaField;
const lien = (name = 'lien', label = 'Lien') => objet(name, label, champsLien);
const bouton = (name = 'bouton', label = 'Bouton', extra: Champ = {}) =>
  objet(name, label, [...champsLien, choix('style', 'Style', [['primaire', 'Plein'], ['secondaire', 'Contour'], ['clair', 'Blanc']])], extra);
const commun = [
  texte('ancre', 'Ancre (#…) pour le sommaire, ex. faq'),
  choix('fond', 'Fond', [['blanc', 'Blanc'], ['gris', 'Gris clair'], ['bleu', 'Bleu clair'], ['sombre', 'Bleu nuit']]),
];
const photo = [
  { type: 'image', name: 'image', label: 'Photo' } as TinaField,
  texte('imageAlt', 'Description de la photo (accessibilité)'),
  texte('consignePhoto', 'Photo à fournir (consigne affichée tant qu’il n’y a pas de photo)'),
];
const libelle = (champ: string) => ({ itemProps: (x: Record<string, string>) => ({ label: x?.[champ] }) });
const image = (name: string, label: string) => ({ type: 'image', name, label }) as TinaField;
const booleen = (name: string, label: string) => ({ type: 'boolean', name, label }) as TinaField;

const modelesSections: Template[] = [
  {
    name: 'accroche', label: 'Accroche (accueil)', ui: libelle('titre'),
    fields: [...commun, texte('surtitre', 'Surtitre'), texte('titre', 'Titre principal (H1)'), multiligne('texte', 'Texte'),
      bouton('boutons', 'Boutons', { list: true, ui: libelle('libelle') }), liste('puces', 'Points forts'), ...photo,
      objet('encart', 'Encart sur la photo', [texte('surtitre', 'Surtitre'), multiligne('texte', 'Texte'), texte('telephone', 'Téléphone')])],
  },
  {
    name: 'bandeau', label: 'Bandeau de page (titre H1)', ui: libelle('titre'),
    fields: [...commun, texte('titre', 'Titre principal (H1)'), multiligne('texte', 'Introduction'),
      objet('sommaire', 'Sommaire', [texte('libelle', 'Libellé'), texte('ancre', 'Ancre de la section visée')], { list: true, ui: libelle('libelle') })],
  },
  {
    name: 'cartes', label: 'Cartes', ui: libelle('titre'),
    fields: [...commun, texte('surtitre', 'Surtitre'), texte('titre', 'Titre'), multiligne('texte', 'Introduction'),
      choix('style', 'Style', [['simples', 'Simples'], ['numerotees', 'Numérotées (01, 02…)'], ['etapes', 'Étapes'], ['pastel', 'Couleurs pastel'], ['etiquettes', 'Étiquettes (titre seul)']]),
      { type: 'number', name: 'colonnes', label: 'Colonnes (1 à 4)' } as TinaField,
      objet('cartes', 'Cartes', [texte('surtitre', 'Surtitre'), texte('titre', 'Titre'), multiligne('texte', 'Texte'), liste('liste', 'Liste à puces'), lien()], { list: true, ui: libelle('titre') }),
      multiligne('note', 'Note sous les cartes'),
      objet('appel', 'Bandeau d’appel sous les cartes', [texte('texte', 'Texte'), bouton()])],
  },
  {
    name: 'colonnes', label: 'Deux colonnes', ui: libelle('titre'),
    fields: [...commun, texte('surtitre', 'Surtitre'), texte('titre', 'Titre'), texte('sousTitre', 'Sous-titre'), multiligne('texte', 'Texte'),
      objet('encadre', 'Encadré', [texte('titre', 'Titre'), multiligne('texte', 'Texte')]), lien(),
      ...photo, multiligne('texteDroite', 'Texte à droite'),
      objet('listes', 'Listes à droite', [texte('titre', 'Titre'), booleen('coches', 'Puces en coches'), liste('items', 'Éléments')], { list: true, ui: libelle('titre') }),
      multiligne('noteDroite', 'Note à droite')],
  },
  {
    name: 'chiffres', label: 'Repères (fond sombre)', ui: libelle('titre'),
    fields: [...commun, texte('titre', 'Titre'), objet('chiffres', 'Repères', [texte('valeur', 'Valeur ou mot'), texte('texte', 'Texte')], { list: true, ui: libelle('valeur') }), bouton()],
  },
  {
    name: 'lieux', label: 'Lieux d’accueil (modifiables dans « Réglages du site »)', ui: libelle('titre'),
    fields: [...commun, texte('titre', 'Titre'), multiligne('texte', 'Introduction'), lien(), choix('affichage', 'Affichage', [['resume', 'Résumé'], ['detail', 'Détaillé (adresse, horaires, itinéraire)']])],
  },
  {
    name: 'faq', label: 'Questions fréquentes', ui: libelle('titre'),
    fields: [...commun, texte('titre', 'Titre'), multiligne('texte', 'Introduction'),
      objet('questions', 'Questions', [texte('question', 'Question'), multiligne('reponse', 'Réponse')], { list: true, ui: libelle('question') })],
  },
  {
    name: 'liens', label: 'Numéros et liens utiles', ui: libelle('titre'),
    fields: [...commun, texte('titre', 'Titre'),
      objet('liens', 'Liens', [texte('valeur', 'Numéro ou intitulé'), texte('texte', 'Description'), texte('url', 'Adresse (vide = appeler le numéro)')], { list: true, ui: libelle('valeur') }),
      multiligne('note', 'Note')],
  },
  {
    name: 'equipe', label: 'Équipe / bureau', ui: libelle('titre'),
    fields: [...commun, texte('titre', 'Titre'), multiligne('texte', 'Introduction'),
      objet('membres', 'Membres', [texte('fonction', 'Fonction'), texte('nom', 'Nom'), texte('description', 'Description'), image('photo', 'Photo')], { list: true, ui: libelle('nom') })],
  },
  {
    name: 'partenaires', label: 'Partenaires', ui: libelle('titre'),
    fields: [...commun, texte('titre', 'Titre'), multiligne('texte', 'Introduction'), choix('format', 'Format', [['grand', 'Grandes cartes'], ['petit', 'Vignettes']]),
      objet('partenaires', 'Partenaires', [texte('nom', 'Nom'), multiligne('texte', 'Texte'), image('logo', 'Logo'), lien()], { list: true, ui: libelle('nom') })],
  },
  {
    name: 'encart', label: 'Encart', ui: libelle('titre'),
    fields: [...commun, choix('couleur', 'Couleur', [['blanc', 'Blanc'], ['vert', 'Vert clair'], ['bleu', 'Bleu clair']]),
      booleen('document', 'Icône document (PDF)'), texte('surtitre', 'Surtitre'), texte('titre', 'Titre'), multiligne('texte', 'Texte'), bouton(),
      objet('aside', 'Bloc d’information à droite (remplace le bouton)', [texte('titre', 'Titre'), multiligne('texte', 'Texte')])],
  },
  {
    name: 'formulaire', label: 'Formulaire de contact', ui: libelle('titre'),
    fields: [...commun, texte('titre', 'Titre'), multiligne('texte', 'Texte'), objet('encadre', 'Encadré', [texte('titre', 'Titre'), multiligne('texte', 'Texte')])],
  },
  {
    name: 'appel', label: 'Appel « Vous avez besoin d’aide ? » (modifiable dans « Réglages du site »)', ui: libelle('titre'),
    fields: [...commun, texte('titre', 'Titre (vide = celui des réglages)'), multiligne('texte', 'Texte (vide = celui des réglages)')],
  },
  {
    name: 'texte', label: 'Texte libre', ui: libelle('titre'),
    fields: [...commun, texte('titre', 'Titre'), multiligne('texte', 'Texte')],
  },
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
          { type: 'object', name: 'sections', label: 'Sections de la page', list: true, templates: modelesSections },
          { type: 'rich-text', name: 'body', label: 'Contenu libre (sous les sections)', isBody: true },
        ],
      },
      {
        // Réglages communs à toutes les pages d'une langue : un fichier par langue (fr.md, en.md…).
        name: 'reglages',
        label: 'Réglages du site (en-tête, lieux, pied de page)',
        path: 'content/reglages',
        format: 'md',
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          objet('bandeau', 'Bandeau d’urgence', [texte('texte', 'Texte'), texte('urgence', 'Numéros d’urgence ([17](tel:17))'), lien('quitter', 'Bouton « Quitter le site »')]),
          objet('logo', 'Logo', [texte('sigle', 'Sigle (si pas d’image)'), texte('nom', 'Nom', { required: true }), texte('sousTitre', 'Sous-titre'), image('image', 'Image du logo')]),
          texte('telephone', 'Téléphone du bouton d’appel (en-tête)'),
          objet('lieux', 'Lieux d’accueil', [
            texte('nom', 'Nom', { required: true }), texte('batiment', 'Bâtiment'), texte('adresse', 'Adresse (vide = permanence sans adresse)'),
            liste('telephones', 'Téléphones'), texte('email', 'E-mail'), multiligne('horaires', 'Horaires d’ouverture'),
            texte('itineraire', 'Lien itinéraire (Google Maps…)'), multiligne('description', 'Description'), lien('rendezVous', 'Bouton de rendez-vous'),
          ], { list: true, ui: libelle('nom') }),
          objet('appel', 'Appel de fin de page', [texte('titre', 'Titre', { required: true }), multiligne('texte', 'Texte'),
            objet('boutons', 'Boutons', [texte('libelle', 'Libellé', { required: true }), texte('url', 'Adresse ou numéro', { required: true })], { list: true, ui: libelle('libelle') })]),
          objet('pied', 'Pied de page', [
            multiligne('presentation', 'Présentation'),
            objet('contacts', 'Contacts', [texte('libelle', 'Libellé', { required: true }), texte('url', 'Adresse ou numéro', { required: true })], { list: true, ui: libelle('libelle') }),
            texte('titreLogos', 'Titre des logos'),
            objet('logos', 'Logos', [texte('nom', 'Nom', { required: true }), image('image', 'Logo'), texte('url', 'Lien')], { list: true, ui: libelle('nom') }),
          ]),
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
