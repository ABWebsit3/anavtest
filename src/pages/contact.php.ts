// Génère dist/contact.php : réception du formulaire de contact sur l'hébergement (PHP mail()).
// L'adresse de réception vient de la fiche client (contactEmail) ; elle n'est jamais exposée dans le HTML.
import type { APIRoute } from 'astro';
import { fiche } from '../moyo/site';

const php = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

export const GET: APIRoute = () => {
  const host = new URL(fiche.site.url).hostname.replace(/^www\./, '');
  const code = `<?php
// Généré au build depuis moyo.client.ts — ne pas modifier sur le serveur.
declare(strict_types=1);

const DESTINATAIRE = ${php(fiche.contactEmail)};
const EXPEDITEUR = ${php(`no-reply@${host}`)};
const SITE = ${php(fiche.site.nom)};

function retour(string $etat): never {
  $chemin = (string)($_POST['retour'] ?? '/');
  if (!preg_match('#^/(?!/)[A-Za-z0-9/_\\-.]*$#', $chemin)) $chemin = '/';
  header('Location: ' . $chemin . '?contact=' . $etat . '#contact', true, 303);
  exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { http_response_code(405); exit; }
if (!empty($_POST['website'])) retour('ok'); // pot de miel : robot

// Limite : 5 envois par adresse IP toutes les 10 minutes.
$ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'inconnue');
$fichier = sys_get_temp_dir() . '/moyo-contact-' . hash('sha256', $ip . SITE);
$horodatages = is_file($fichier) ? array_filter(array_map('intval', explode(',', (string)file_get_contents($fichier))), fn($t) => $t > time() - 600) : [];
if (count($horodatages) >= 5) retour('erreur');
$horodatages[] = time();
@file_put_contents($fichier, implode(',', $horodatages));

$ligne = fn(string $k, int $max): string => trim(str_replace(["\\r", "\\n"], ' ', mb_substr((string)($_POST[$k] ?? ''), 0, $max)));
$nom = $ligne('nom', 100);
$email = $ligne('email', 254);
$telephone = $ligne('telephone', 30);
$message = trim(mb_substr((string)($_POST['message'] ?? ''), 0, 5000));
if ($nom === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) retour('erreur');

$sujet = '=?UTF-8?B?' . base64_encode('[' . SITE . '] Nouveau message de ' . $nom) . '?=';
$corps = "Nom : $nom\\nE-mail : $email\\n" . ($telephone !== '' ? "Téléphone : $telephone\\n" : '') . "\\n$message\\n";
$entetes = implode("\\r\\n", [
  'From: ' . EXPEDITEUR,
  'Reply-To: ' . $email,
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'Content-Transfer-Encoding: 8bit',
]);
retour(mail(DESTINATAIRE, $sujet, $corps, $entetes) ? 'ok' : 'erreur');
`;
  return new Response(code, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
