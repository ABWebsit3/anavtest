// Mise en forme des textes saisis dans TinaCMS (champs multilignes des sections) : Markdown réduit et sûr.
//   **gras**, [lien](https://… | /page/ | tel:… | mailto:…), paragraphes séparés par une ligne vide,
//   lignes commençant par « - » → liste à puces. Tout le reste est échappé.

const echapper = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const urlSure = (u: string) => /^(https?:\/\/|\/|#|tel:|mailto:)/.test(u);

/** Une ligne : gras et liens. */
export function enLigne(s: string | null | undefined): string {
  if (!s) return '';
  return echapper(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t: string, u: string) => (urlSure(u) ? `<a href="${u}">${t}</a>` : t))
    .replace(/\n/g, '<br>');
}

/** Plusieurs paragraphes et listes. */
export function enBlocs(s: string | null | undefined): string {
  if (!s) return '';
  return s
    .trim()
    .split(/\n\s*\n/)
    .map((bloc) => {
      const lignes = bloc.split('\n');
      if (lignes.every((l) => /^\s*-\s+/.test(l)))
        return `<ul>${lignes.map((l) => `<li>${enLigne(l.replace(/^\s*-\s+/, ''))}</li>`).join('')}</ul>`;
      return `<p>${enLigne(bloc)}</p>`;
    })
    .join('');
}

/** Lien tel: à partir d'un numéro affiché (« 04 68 41 40 97 » → tel:+33468414097, « 3919 » → tel:3919). */
export function tel(numero: string): string {
  const chiffres = numero.replace(/[^\d+]/g, '');
  return `tel:${/^0\d{9}$/.test(chiffres) ? `+33${chiffres.slice(1)}` : chiffres}`;
}

/** Initiales d'un nom, sans civilité (« Maître Robert Mary » → RM). */
export function initiales(nom: string): string {
  return nom
    .replace(/^(Maître|Me|Monsieur|M\.|Madame|Mme|Docteur|Dr)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((m) => m[0].toUpperCase())
    .join('');
}
