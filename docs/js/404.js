// Page 404 « Hors des cartes » : langue, adresse demandée et rose des vents affolée.
// Même choix de langue que langue.js (lien ?lang=…, choix mémorisé, langues du navigateur).

const TEXTES = {
  fr: {
    titrePage: 'Hors des cartes · Alexandre CAUSSADE',
    choixLangue: 'Langue',
    surtitre: 'Erreur 404 · Journal de bord',
    titre: 'Hors des cartes',
    message: "Cette page n'apparaît sur aucun relevé. La route s'arrête là où s'arrête la carte.",
    destination: 'Destination',
    position: 'Position',
    positionValeur: '404° N — inconnue',
    fond: 'Fond',
    fondValeur: 'non sondé',
    cap: 'Cap',
    reprendre: 'Reprendre la route →',
    coinHaut: '404°00′N · ??°??′O',
    coinBas: 'Relevé incomplet',
    carteAlt: "Fragment de carte marine déchiré : la route part du port et s'arrête au bord, où commence la terra incognita.",
  },
  en: {
    titrePage: 'Off the charts · Alexandre CAUSSADE',
    choixLangue: 'Language',
    surtitre: 'Error 404 · Logbook',
    titre: 'Off the charts',
    message: 'This page appears on no survey. The route ends where the chart ends.',
    destination: 'Destination',
    position: 'Position',
    positionValeur: '404° N — unknown',
    fond: 'Depth',
    fondValeur: 'not sounded',
    cap: 'Heading',
    reprendre: 'Back on course →',
    coinHaut: '404°00′N · ??°??′W',
    coinBas: 'Survey incomplete',
    carteAlt: 'Torn fragment of a nautical chart: the route leaves port and stops at the edge, where terra incognita begins.',
  },
};
const LANGUES = Object.keys(TEXTES);

function choisirLangue() {
  const demandee = new URLSearchParams(location.search).get('lang');
  if (LANGUES.includes(demandee)) {
    try { localStorage.setItem('langue', demandee); } catch (e) { /* stockage bloqué */ }
    return demandee;
  }
  try {
    const memorisee = localStorage.getItem('langue');
    if (LANGUES.includes(memorisee)) return memorisee;
  } catch (e) { /* stockage bloqué */ }
  const preferee = (navigator.languages || [navigator.language]).find((l) => /^(fr|en)\b/i.test(l || ''));
  return preferee ? preferee.slice(0, 2).toLowerCase() : 'en';
}

const LANGUE = choisirLangue();
const T = TEXTES[LANGUE];

document.documentElement.lang = LANGUE;
document.title = T.titrePage;
document.querySelectorAll('[data-texte]').forEach((el) => { el.textContent = T[el.dataset.texte]; });
document.querySelectorAll('[data-label]').forEach((el) => el.setAttribute('aria-label', T[el.dataset.label]));
document.querySelector('.langues a[lang="' + LANGUE + '"]').setAttribute('aria-current', 'true');

// L'adresse introuvable, affichée telle quelle (textContent : aucun HTML interprété)
let chemin = location.pathname;
try { chemin = decodeURIComponent(chemin); } catch (e) { /* adresse mal encodée : on la garde brute */ }
document.getElementById('destination').textContent = chemin;
document.getElementById('destination').title = chemin;

// Rose des vents : l'aiguille cherche un nord qu'elle ne trouve pas.
// Un ressort amorti la tire vers un cap choisi au hasard, qui change sans cesse.
const aiguille = document.getElementById('aiguille');
const cap = document.getElementById('cap');
const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (calme) {
  cap.textContent = '044° ?';
} else {
  let angle = 44;
  let vitesse = 0;
  let cible = 44;
  let prochainChangement = 0;
  let precedent = 0;

  const boucle = (temps) => {
    const dt = Math.min((temps - precedent) / 1000 || 0, 0.05);
    precedent = temps;
    if (temps > prochainChangement) {
      // Grands écarts de temps en temps, petites hésitations le reste du temps
      cible = angle + (Math.random() < 0.35 ? (Math.random() - 0.5) * 540 : (Math.random() - 0.5) * 70);
      prochainChangement = temps + 900 + Math.random() * 2200;
    }
    vitesse += ((cible - angle) * 9 - vitesse * 2.6) * dt;
    angle += vitesse * dt;
    aiguille.style.setProperty('--cap', angle.toFixed(2) + 'deg');
    const affiche = Math.round(((angle % 360) + 360) % 360);
    cap.textContent = String(affiche).padStart(3, '0') + '° ?';
    requestAnimationFrame(boucle);
  };
  requestAnimationFrame(boucle);
}
