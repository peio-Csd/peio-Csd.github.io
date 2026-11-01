// Design « Carnet de bord » : construit la page à partir de CONTENT (js/content.js),
// trace une route que suit une ancre au fil du défilement et fait tourner la rose des vents.

const BASE = '';
const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
const racine = document.documentElement;
const contenu = document.getElementById('contenu');
const carte = document.querySelector('.carte');
const SVG = 'http://www.w3.org/2000/svg';

// La photo de la première section devient le fond de l'écran d'accueil
const PHOTO_ACCUEIL = (CONTENT.sections[0].photo || { src: 'images/profil.jpg' }).src;

function creer(tag, classe, texte) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texte) el.textContent = texte;
  return el;
}

function creerSvg(tag, attributs) {
  const el = document.createElementNS(SVG, tag);
  Object.entries(attributs || {}).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

function creerLien(texte, url) {
  const a = creer('a', null, texte);
  a.href = url;
  if (url.startsWith('http')) {
    a.target = '_blank';
    a.rel = 'noopener';
  }
  return a;
}

function creerImage(photo, paresseuse) {
  const img = creer('img');
  img.src = BASE + photo.src;
  img.alt = photo.alt || '';
  if (paresseuse) img.loading = 'lazy';
  return img;
}

function creerLegende(n, texte) {
  const legende = creer('figcaption');
  legende.appendChild(creer('b', null, 'Fig. ' + String(n).padStart(2, '0')));
  legende.appendChild(document.createTextNode(' — ' + texte));
  return legende;
}

// "2023 – 2028 — Diplôme…" → ["2023 – 2028", "Diplôme…"]
function separerDate(item) {
  const i = item.indexOf(' — ');
  return i > 0 && i < 32 ? [item.slice(0, i), item.slice(i + 3)] : [null, item];
}

/* ---------- Construction ---------- */

let numeroFigure = 0;

// Bande de photos qui défile à l'horizontale pendant qu'on fait défiler la page
function creerTraversee(galerie) {
  const div = creer('div', 'traversee');
  const ecran = creer('div', 'ecran');
  const bande = creer('div', 'bande');
  galerie.photos.forEach((photo) => {
    const figure = creer('figure');
    figure.appendChild(creerImage(photo, false));
    figure.appendChild(creerLegende(++numeroFigure, photo.alt || ''));
    bande.appendChild(figure);
  });
  ecran.appendChild(creer('span', 'compteur', galerie.photos.length + ' ' + T.defiler));
  ecran.appendChild(bande);
  ecran.appendChild(creer('span', 'jauge'));
  div.appendChild(ecran);
  return div;
}

// Mosaïque révélée par une ligne de balayage
function creerGalerie(galerie) {
  const div = creer('div', 'galerie revele-groupe ' + (galerie.modele || ''));
  galerie.photos.forEach((photo, i) => {
    const figure = creer('figure', photo.taille || null);
    figure.style.setProperty('--i', i);
    const cadre = creer('div', 'cadre-image');
    cadre.appendChild(creerImage(photo, true));
    figure.appendChild(cadre);
    figure.appendChild(creerLegende(++numeroFigure, photo.alt || ''));
    div.appendChild(figure);
  });
  return div;
}

/* ---------- Poissons ---------- */

// Poisson dessiné au trait, tourné vers la droite ; l'accessoire se dessine par-dessus
const CORPS_POISSON = '<path class="queue" d="M-13,0 L-23,-8 L-20,0 L-23,8 Z"/>'
  + '<path class="corps" d="M-14,0 Q-2,-11 14,-2 Q17,0 14,2 Q-2,11 -14,0 Z"/>'
  + '<path d="M3,-6 Q6,0 3,6"/><circle class="oeil" cx="9" cy="-2" r="1.3"/>';
const ACCESSOIRES = {
  surf: '<path class="vague" d="M-30,16 Q-22,12 -14,16 T2,16 T18,16 T34,16 T50,16 T66,16"/>'
    + '<path class="aileron" d="M-15,11 L-12,16 L-9,11"/>'
    + '<path class="planche" d="M-24,8.5 Q-24,6 -16,6 H22 Q34,6 42,8.5 Q34,11 22,11 H-16 Q-24,11 -24,8.5 Z"/><path class="liseret" d="M-20,8.5 H36"/>',
  trombone: '<path d="M18,1 V-5 H38"/><path class="pavillon" d="M37,-4 L48,-10 V0 Z"/><g class="coulisse"><path d="M16,1 H46 V5 H24"/></g>',
  trompette: '<path d="M15,0 H35 M22,0 V-4 M26,0 V-4 M30,0 V-4"/><path class="pavillon" d="M34,-2 L44,-7 V7 L34,2 Z"/>',
  sousaphone: '<circle class="tuba" cx="-2" r="15"/><path d="M13,-1 Q17,-7 11,-11"/><path class="pavillon" d="M5,-12 L-3,-28 H21 L12,-11"/>',
};
// Position du pavillon (en % de l'image) d'où partent les notes
const PAVILLONS = { trombone: [93, 42], trompette: [88, 50], sousaphone: [44, 2] };

function creerPoisson(accessoire, style) {
  const poisson = creer('span', 'poisson' + (accessoire ? ' ' + accessoire : ''));
  Object.entries(style || {}).forEach(([k, v]) => poisson.style.setProperty(k, v));
  poisson.innerHTML = '<svg viewBox="-30 -30 84 60" aria-hidden="true">' + (ACCESSOIRES[accessoire] || '') + CORPS_POISSON + '</svg>';
  if (PAVILLONS[accessoire]) {
    ['♪', '♫', '♩'].forEach((signe, k) => {
      const note = creer('span', 'note', signe);
      note.style.left = PAVILLONS[accessoire][0] + '%';
      note.style.top = PAVILLONS[accessoire][1] + '%';
      note.style.setProperty('--n', k * 0.8 + 's');
      poisson.appendChild(note);
    });
  }
  return poisson;
}

// Sauvetage : un banc de poissons, et un surfeur qui glisse en sens inverse
function creerBancSauvetage() {
  const couloir = creer('div', 'couloir sauvetage');
  couloir.setAttribute('aria-hidden', 'true');
  const banc = creer('div', 'banc');
  [[0, 26, 1], [70, 0, 0.8], [74, 54, 0.85], [140, 4, 0.7], [146, 40, 0.75], [136, 70, 0.6], [200, 26, 0.6]].forEach(([x, y, echelle], k) => {
    banc.appendChild(creerPoisson(null, { left: 210 - x + 'px', top: y + 'px', '--taille': 110 * echelle + 'px', '--delai': -k * 0.4 + 's' }));
  });
  couloir.appendChild(banc);
  couloir.appendChild(creerPoisson('surf', { '--taille': '150px' }));
  return couloir;
}

// Musique : une fanfare de poissons qui passe en jouant
function creerFanfare() {
  const couloir = creer('div', 'couloir fanfare');
  couloir.setAttribute('aria-hidden', 'true');
  const cortege = creer('div', 'cortege');
  [['sousaphone', '#9fb8ff'], ['trompette', 'var(--rose)'], ['trombone', 'var(--laiton)']].forEach(([instrument, couleur], k) => {
    cortege.appendChild(creerPoisson(instrument, { '--c': couleur, '--taille': '170px', '--delai': -k * 0.7 + 's' }));
  });
  couloir.appendChild(cortege);
  return couloir;
}

function creerSonar() {
  const div = creer('div', 'sonar');
  div.setAttribute('aria-hidden', 'true');
  div.appendChild(creer('span', 'balayage'));
  for (let i = 0; i < 3; i++) {
    const onde = creer('span', 'onde');
    onde.style.setProperty('--i', i);
    div.appendChild(onde);
  }
  [[22, 30, 0.6], [71, 62, 2.4], [58, 24, 4.1], [35, 74, 3.2]].forEach(([x, y, d]) => {
    const echo = creer('span', 'echo');
    echo.style.left = x + '%';
    echo.style.top = y + '%';
    echo.style.setProperty('--d', d + 's');
    div.appendChild(echo);
  });
  div.appendChild(creer('span', 'legende', T.sondage));
  return div;
}

function ajouterVisuel(parent, element, niveauSection) {
  if (element.photo && element.photo.src !== PHOTO_ACCUEIL) {
    const figure = creer('figure', 'bandeau revele');
    figure.appendChild(creerImage(element.photo, true));
    parent.appendChild(figure);
  }
  if (element.galerie) parent.appendChild(niveauSection ? creerTraversee(element.galerie) : creerGalerie(element.galerie));
}

function creerListe(liste) {
  const datee = liste.some((item) => typeof item === 'string' && separerDate(item)[0]);
  const liens = liste.every((item) => typeof item !== 'string');
  const ul = creer('ul', datee ? 'journal' : liens ? 'signaux' : null);
  liste.forEach((item, i) => {
    const li = creer('li');
    li.style.setProperty('--i', i);
    if (typeof item !== 'string') {
      li.appendChild(creerLien(item.texte, item.lien));
    } else if (datee) {
      const [date, texte] = separerDate(item);
      li.appendChild(creer('span', 'date', date || ''));
      li.appendChild(creer('span', null, texte));
    } else {
      li.textContent = item;
    }
    ul.appendChild(li);
  });
  return ul;
}

// "Titre : description" (ou "Title: description") → ["Titre", "description"]
function separerTitre(texte) {
  const trouve = texte.match(/ ?: /);
  return trouve && trouve.index > 0 ? [texte.slice(0, trouve.index), texte.slice(trouve.index + trouve[0].length)] : [null, texte];
}

function majuscule(texte) {
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

// Plaque : le logo sur papier clair (ou sur fond de nuit avec "fond": "sombre"),
// ou une photo qui remplit le cadre
function creerPlaque(photo) {
  const photos = [].concat(photo);
  const logos = photos.every((p) => p.logo);
  const plaque = creer('div', 'plaque' + (logos ? ' logos' : '') + (photos.some((p) => p.fond === 'sombre') ? ' sombre' : ''));
  photos.forEach((p) => plaque.appendChild(creerImage(p, true)));
  return plaque;
}

function creerCredit(photo) {
  const small = creer('small', 'credit', T.credit);
  small.appendChild(photo.source ? creerLien(photo.credit, photo.source) : document.createTextNode(photo.credit));
  return small;
}

// Une fiche (date, intitulé, description), avec sa plaque si elle a une photo ou un logo
function creerFiche(item, i, classes) {
  const { texte: ligneComplete, photo } = typeof item === 'string' ? { texte: item } : item;
  const [date, reste] = separerDate(ligneComplete);
  const [titre, texte] = separerTitre(reste);
  // En cours : « Depuis … » (« Since … »), ou une période (« 2023 – 2028 ») qui se termine après cette année
  const enCours = date && (date.startsWith(T.depuis) || (date.includes('–') && Number(date.slice(-4)) > new Date().getFullYear()));
  const fiche = creer('article', 'fiche ' + classes + (enCours ? ' en-cours' : '') + (photo ? ' avec-plaque' : ''));
  fiche.style.setProperty('--i', i);
  if (photo) fiche.appendChild(creerPlaque(photo));
  const corps = creer('div', 'corps');
  if (date) corps.appendChild(creer('span', 'date', date));
  corps.appendChild(creer('h4', null, titre || texte));
  if (titre && / ?; /.test(texte)) {
    // Plusieurs volets d'une même expérience : « Nom : détail ; Nom : détail »
    const ul = creer('ul', 'volets');
    texte.split(/ ?; /).forEach((volet) => {
      const [nom, detail] = separerTitre(volet);
      const li = creer('li');
      if (nom) li.appendChild(creer('b', null, nom));
      li.appendChild(creer('span', null, majuscule(detail)));
      ul.appendChild(li);
    });
    corps.appendChild(ul);
  } else if (titre) {
    corps.appendChild(creer('p', null, majuscule(texte)));
  }
  const credit = photo && [].concat(photo).find((p) => p.credit);
  if (credit) corps.appendChild(creerCredit(credit));
  fiche.appendChild(corps);
  return fiche;
}

// Mode compact (téléphones et tablettes, voir la fin de css/style.css) : le détail est replié
// et s'ouvre d'un appui sur l'élément. Sur ordinateur, le bouton est masqué et le détail visible.
function rendreDepliable(el, detail) {
  if (!detail) return;
  const volet = creer('div', 'detail');
  const interieur = creer('div');
  detail.replaceWith(volet);
  interieur.appendChild(detail);
  volet.appendChild(interieur);
  const bouton = creer('button', 'deplier');
  bouton.type = 'button';
  bouton.setAttribute('aria-label', T.detail);
  bouton.setAttribute('aria-expanded', 'false');
  volet.before(bouton);
  el.classList.add('depliable');
  el.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    bouton.setAttribute('aria-expanded', el.classList.toggle('ouvert'));
  });
}

// Longue liste datée d'un cadre : en mode compact, seules les premières lignes sont affichées
const LIGNES_COMPACTES = 3;
function rendreRepliable(ul) {
  const cachees = ul.children.length - LIGNES_COMPACTES;
  if (cachees < 1) return null;
  const bouton = creer('button', 'plus', T.voirAutres(cachees));
  bouton.type = 'button';
  bouton.setAttribute('aria-expanded', 'false');
  ul.classList.add('replie');
  bouton.addEventListener('click', () => {
    const replie = ul.classList.toggle('replie');
    bouton.textContent = replie ? T.voirAutres(cachees) : T.reduire;
    bouton.setAttribute('aria-expanded', !replie);
    if (replie) bouton.scrollIntoView({ block: 'nearest' });
  });
  return bouton;
}

// Expériences : toutes les fiches côte à côte
function creerCases(liste) {
  const div = creer('div', 'cases');
  liste.forEach((item, i) => div.appendChild(creerFiche(item, i, 'revele')));
  return div;
}

// Projets, expériences : une fiche à la fois ; au clic, elle se change en bulles
// qui remontent et la suivante se forme à sa place
// Formation : frise chronologique de part et d'autre d'un axe qui se trace au défilement
function creerDefile(bloc, mode) {
  const div = creer('div', 'defile ' + mode);
  div.dataset.mode = mode;
  const ecran = creer('div', 'ecran');
  const total = String(bloc.liste.length).padStart(2, '0');
  const compteur = creer('span', 'compteur');
  compteur.append(creer('b', null, bloc.titre), creer('span', 'numero', '01 / ' + total));
  ecran.appendChild(compteur);
  bloc.liste.forEach((item, i) => {
    const fiche = creerFiche(item, i, mode === 'frise' ? 'revele' : '');
    if (mode === 'frise') {
      fiche.style.gridRow = i + 1;
      const corps = fiche.querySelector('.corps');
      rendreDepliable(corps, corps.querySelector(':scope > p, :scope > .volets'));
    }
    ecran.appendChild(fiche);
  });
  ecran.appendChild(creer('span', 'jauge'));
  div.appendChild(ecran);
  if (mode === 'effervescence') rendreCliquable(div, bloc.consigne || T.consigne);
  return div;
}

// Un clic sur la fiche (ou sur le bouton) amène la suivante ;
// le bouton « Revenir en arrière » n'apparaît qu'une fois qu'on a avancé
function rendreCliquable(div, consigne) {
  const fiches = [...div.querySelectorAll('.fiche')];
  if (fiches.length < 2) return placer(div, fiches, 0);
  const commandes = creer('div', 'commandes');
  const retour = creer('button', 'retour', T.retour);
  const suivant = creer('button', 'suivant', consigne);
  retour.type = suivant.type = 'button';
  retour.hidden = true;
  commandes.append(retour, suivant);
  div.appendChild(commandes);

  let index = 0;
  function aller(nouveau) {
    const ancien = index;
    index = (nouveau + fiches.length) % fiches.length;
    placer(div, fiches, index, ancien);
    retour.hidden = index === 0;
    suivant.textContent = index === fiches.length - 1 ? T.premier : consigne;
    suivant.classList.add('deja');
  }
  retour.addEventListener('click', () => aller(index - 1));
  suivant.addEventListener('click', () => aller(index + 1));
  fiches.forEach((fiche) => fiche.addEventListener('click', (e) => {
    if (!e.target.closest('a')) aller(index + 1);
  }));
  placer(div, fiches, 0);
}

// Affiche la fiche active ; l'ancienne se dissout en bulles, la nouvelle se forme
function placer(div, fiches, index, ancien) {
  fiches.forEach((fiche, i) => {
    fiche.classList.remove('dissout', 'forme');
    fiche.classList.toggle('visible', i === index);
    fiche.setAttribute('aria-hidden', i !== index);
  });
  if (!reduit && ancien !== undefined && ancien !== index) {
    void div.offsetWidth; // relance les animations si on clique vite
    enBulles(fiches[ancien]);
    fiches[ancien].classList.add('dissout');
    fiches[index].classList.add('forme');
  }
  const n = fiches.length;
  div.querySelector('.numero').textContent = String(index + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
  div.style.setProperty('--avance', index / Math.max(1, n - 1));
}

/* ---------- Bulles d'air ---------- */

// Bulles qui remontent depuis (x, y) (coordonnées dans l'écran), réparties sur une largeur
// « dispersion ». Elles sont posées dans la page et suivent donc le défilement,
// sauf avec fixe : true, où elles restent à l'écran (remontée à la surface)
function lacherBulles(x, y, nombre, dispersion, hauteur, { delaiMax = 0.6, fixe = false } = {}) {
  if (reduit) return;
  for (let k = 0; k < nombre; k++) {
    const bulle = creer('span', 'air' + (fixe ? ' fixe' : ''));
    bulle.setAttribute('aria-hidden', 'true');
    bulle.style.left = x + (fixe ? 0 : scrollX) + (Math.random() - 0.5) * dispersion + 'px';
    bulle.style.top = y + (fixe ? 0 : scrollY) + 'px';
    bulle.style.setProperty('--t', 4 + Math.random() * 16 + 'px');
    bulle.style.setProperty('--monte', hauteur * (0.6 + Math.random() * 0.5) + 'px');
    bulle.style.setProperty('--oscille', (Math.random() - 0.5) * 60 + 'px');
    bulle.style.setProperty('--delai', Math.random() * delaiMax + 's');
    bulle.style.setProperty('--duree', 1.4 + Math.random() * 1.4 + 's');
    bulle.addEventListener('animationend', () => bulle.remove());
    document.body.appendChild(bulle);
  }
}

// Toute la fiche se change en bulles : on en sème sur sa surface, le bas part en premier
function enBulles(el) {
  const r = el.getBoundingClientRect();
  const nombre = Math.min(220, Math.round((r.width * r.height) / 1500));
  for (let k = 0; k < nombre; k++) {
    const y = r.top + Math.random() * r.height;
    const retard = 0.05 + ((r.bottom - y) / r.height) * 0.3;
    lacherBulles(r.left + Math.random() * r.width, y, 1, 0, 180 + Math.random() * 300, { delaiMax: retard });
  }
}

// Retour à l'accueil : un rideau de bulles remonte pendant que la page remonte avec elles
async function remonterALaSurface(evenement) {
  if (evenement) evenement.preventDefault();
  const depart = scrollY;
  if (reduit) return scrollTo({ top: 0, behavior: 'instant' });
  lacherBulles(innerWidth / 2, innerHeight + 20, 70, innerWidth, innerHeight * 1.3, { fixe: true });
  await animer(Math.min(2600, 900 + depart / 6), (t) => {
    const lisse = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    scrollTo({ top: depart * (1 - lisse), behavior: 'instant' });
  });
}

// Compétences : une bulle par domaine ; les énumérations courtes deviennent des pastilles
function creerBulles(liste) {
  const div = creer('div', 'bulles');
  liste.forEach((item, i) => {
    const [titre, texte] = separerTitre(item);
    const bulle = creer('div', 'bulle revele');
    bulle.style.setProperty('--i', i);
    if (titre) bulle.appendChild(creer('h4', null, titre));
    const elements = texte.split(', ');
    if (elements.length > 2 && elements.every((e) => e.length <= 30)) {
      const ul = creer('ul', 'pastilles');
      elements.forEach((e) => ul.appendChild(creer('li', null, e)));
      bulle.appendChild(ul);
    } else {
      bulle.appendChild(creer('p', null, majuscule(texte)));
    }
    rendreDepliable(bulle, bulle.querySelector(':scope > p, :scope > .pastilles'));
    div.appendChild(bulle);
  });
  return div;
}

function creerBloc(bloc, numero, intro) {
  // Une mise en scène fait plusieurs écrans de haut : elle n'atteindrait pas toujours le seuil d'apparition
  const defile = bloc.affichage === 'effervescence' || bloc.affichage === 'frise';
  const div = creer('div', 'bloc' + (defile ? '' : ' revele') + (bloc.cadre ? ' cadre' : '') + (intro ? ' intro' : '') + (bloc.affichage ? ' large' : ''));
  const h3 = creer('h3', null, bloc.titre);
  h3.dataset.n = numero;
  div.appendChild(h3);
  if (bloc.texte) div.appendChild(creer('p', null, bloc.texte));
  if (bloc.liste && defile) {
    div.appendChild(creerDefile(bloc, bloc.affichage));
  } else if (bloc.liste) {
    const affichages = { cases: creerCases, bulles: creerBulles };
    const liste = (affichages[bloc.affichage] || creerListe)(bloc.liste);
    div.appendChild(liste);
    const plus = bloc.cadre && liste.matches('.journal') && rendreRepliable(liste);
    if (plus) div.appendChild(plus);
  }
  // Le CV se télécharge, sur sa propre ligne sous les liens de contact
  if (bloc.cv) {
    const ul = creerListe([bloc.cv]);
    ul.classList.add('cv');
    ul.querySelector('a').setAttribute('download', '');
    div.appendChild(ul);
  }
  if (bloc.lien) {
    const p = creer('p');
    p.appendChild(creerLien(T.voirProjet, bloc.lien));
    div.appendChild(p);
  }
  return div;
}

// decalage : nombre de blocs déjà affichés ailleurs (la console), pour garder la numérotation
function creerSection(section, index, total, decalage = 0) {
  const el = creer('section', 'escale');
  const n = String(index + 1).padStart(2, '0');
  if (section.rupture) el.appendChild(creerSonar());

  const entete = creer('header', 'escale-titre revele');
  entete.appendChild(creer('span', 'etiquette', T.escale + ' ' + n + ' / ' + String(total).padStart(2, '0')));
  entete.appendChild(creer('h2', null, section.titre));
  entete.appendChild(creer('span', 'trait'));
  el.appendChild(entete);

  ajouterVisuel(el, section, true);
  // Les poissons nagent entre les photos et le cadre qui suit
  if (section.poissons === 'sauvetage') el.appendChild(creerBancSauvetage());

  // Une section faite uniquement de courts blocs devient une grille de cartouches
  const enGrille = section.blocs.length > 1 && section.blocs.every((b) => !b.liste && !b.cadre && !b.galerie && !b.photo);
  const conteneur = enGrille ? creer('div', 'grille') : el;
  section.blocs.forEach((bloc, i) => {
    ajouterVisuel(conteneur, bloc, false);
    if (bloc.poissons === 'fanfare') conteneur.appendChild(creerFanfare());
    const div = creerBloc(bloc, n + '.' + (i + 1 + decalage), index === 0 && i === 0 && !decalage && !bloc.liste);
    if (enGrille) div.style.setProperty('--i', i);
    conteneur.appendChild(div);
  });
  if (enGrille) el.appendChild(conteneur);
  return el;
}

/* ---------- Tableau de bord de l'accueil : le premier bloc de « Mon profil » ---------- */

// Vitesse de déchiffrement, en mots par minute (lecture confortable : 200 à 250)
const MOTS_PAR_MINUTE = 240;

// "Qui suis-je ?" → "qui_suis_je.txt"
function nomDeFichier(titre) {
  return titre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') + '.txt';
}

function ligne(classe, ...enfants) {
  const p = creer('p', classe);
  p.append(...enfants);
  return p;
}

const GLYPHES = '01ABCDEF#$%&@<>/{}[]=+*';
function glyphe() {
  return GLYPHES[Math.floor(Math.random() * GLYPHES.length)];
}

// Appelle etape(t) à chaque image pendant duree ms, t allant de 0 à 1
function animer(duree, etape) {
  return new Promise((ok) => {
    const debut = performance.now();
    (function pas() {
      const t = reduit ? 1 : Math.min(1, (performance.now() - debut) / duree);
      etape(t);
      if (t < 1) requestAnimationFrame(pas);
      else ok();
    })();
  });
}

// Le texte arrive chiffré et se déchiffre de gauche à droite, à vitesse de lecture
async function lancerDechiffrement(bloc) {
  const ecran = document.getElementById('console');
  document.getElementById('console-titre').textContent = T.passerelle;
  document.getElementById('console-texte').textContent = bloc.texte;

  ecran.append(ligne('systeme', T.fichier + nomDeFichier(bloc.titre) + '.enc · AES-256'));
  const etat = ligne('systeme', T.dechiffrement(0));
  const clair = creer('span');
  const chiffre = creer('span', 'chiffre', bloc.texte.replace(/\S/g, glyphe));
  ecran.append(etat, ligne('sortie espace', clair, chiffre));
  if (!reduit) await new Promise((ok) => setTimeout(ok, 1400));

  const duree = (bloc.texte.split(/\s+/).length / MOTS_PAR_MINUTE) * 45000;
  let dernier = 0;
  await animer(duree, (t) => {
    if (t < 1 && performance.now() - dernier < 45) return;
    dernier = performance.now();
    const n = Math.floor(bloc.texte.length * t);
    clair.textContent = bloc.texte.slice(0, n);
    chiffre.textContent = bloc.texte.slice(n).replace(/\S/g, glyphe);
    etat.textContent = T.dechiffrement(Math.round(t * 100));
  });
  etat.textContent = T.dechiffre;
  ecran.append(ligne('valide', T.integrite));
}

function init() {
  document.getElementById('annee').textContent = new Date().getFullYear();
  document.querySelector('#accueil .fond').src = BASE + PHOTO_ACCUEIL;
  const [prenom, ...reste] = CONTENT.nom.split(' ');
  const h1 = document.getElementById('nom');
  h1.append(prenom + ' ');
  h1.appendChild(creer('em', null, reste.join(' ')));
  document.getElementById('accroche').textContent = CONTENT.accroche;
  // Le premier bloc (Qui suis-je ?) s'affiche dans la console de l'accueil, le reste sur la carte
  const [profil, ...suite] = CONTENT.sections;
  lancerDechiffrement(profil.blocs[0]);
  const total = CONTENT.sections.length;
  contenu.appendChild(creerSection({ ...profil, blocs: profil.blocs.slice(1) }, 0, total, 1));
  suite.forEach((s, i) => contenu.appendChild(creerSection(s, i + 1, total)));
}

/* ---------- Apparitions ---------- */

let observateur;
function observer(el) {
  if (observateur) observateur.observe(el);
  else el.classList.add('visible');
}
function observerApparitions() {
  if (!reduit && 'IntersectionObserver' in window) {
    observateur = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observateur.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  }
  // Les poissons ne nagent qu'une fois arrivés à l'écran
  document.querySelectorAll('.revele, .revele-groupe, .journal, .couloir').forEach(observer);
}

/* ---------- Lignes de sonde (courbes de profondeur) ---------- */

// Petit générateur pseudo-aléatoire pour que la carte soit la même à chaque visite
function aleatoire(graine) {
  return () => {
    graine = (graine * 16807) % 2147483647;
    return (graine - 1) / 2147483646;
  };
}

let tailleSondes = '';
function dessinerSondes() {
  const largeur = innerWidth;
  const hauteur = carte.offsetHeight;
  if (tailleSondes === largeur + 'x' + hauteur) return;
  tailleSondes = largeur + 'x' + hauteur;
  const svg = document.querySelector('.sondes');
  svg.replaceChildren();
  const hasard = aleatoire(42);
  for (let cy = 200; cy < hauteur; cy += 650 + hasard() * 350) {
    const cx = (hasard() < 0.5 ? 0.12 : 0.82) * largeur + (hasard() - 0.5) * 220;
    const f = [hasard() * 6, hasard() * 6, hasard() * 6];
    const groupe = creerSvg('g');
    const anneaux = 5 + Math.floor(hasard() * 5);
    for (let k = 1; k <= anneaux; k++) {
      const r = 28 + k * (26 + hasard() * 10);
      const rayon = (a) => r * (1 + 0.18 * Math.sin(3 * a + f[0] + k * 0.15) + 0.09 * Math.sin(5 * a + f[1]) + 0.05 * Math.sin(7 * a + f[2] - k * 0.2));
      let d = '';
      for (let a = 0; a <= Math.PI * 2 + 0.01; a += Math.PI / 48) {
        d += (d ? 'L' : 'M') + (cx + rayon(a) * Math.cos(a)).toFixed(1) + ',' + (cy + rayon(a) * Math.sin(a) * 0.8).toFixed(1);
      }
      groupe.appendChild(creerSvg('path', { d: d + 'Z', pathLength: 1 }));
      // Profondeur inscrite sur la courbe, comme sur une carte marine
      if (k % 2 === 0) {
        const t = creerSvg('text', { x: (cx + rayon(0) + 4).toFixed(0), y: (cy + 3).toFixed(0) });
        t.textContent = k * 10;
        groupe.appendChild(t);
      }
    }
    svg.appendChild(groupe);
    observer(groupe);
  }
}

/* ---------- Route et ancre ---------- */

const parcours = document.querySelector('.parcours');
const prevue = parcours.querySelector('.prevue');
const suivie = parcours.querySelector('.suivie');
const ancre = parcours.querySelector('.ancre');
let route = { xs: [], cumul: [], pas: 8, total: 1 };
let reperes = [];
let traversees = [];
let frises = [];

// La route serpente dans la partie gauche du couloir, à bonne distance des textes
function routeX(y, largeur) {
  const centre = largeur * 0.36;
  const amplitude = centre - 8;
  return centre + amplitude * (0.6 * Math.sin(y / 310) + 0.4 * Math.sin(y / 137 + 1));
}

function tracerRoute() {
  const largeur = parcours.offsetWidth;
  const hauteur = carte.offsetHeight;
  const xs = [];
  const cumul = [0];
  let d = '';
  for (let y = 0, i = 0; y <= hauteur; y += route.pas, i++) {
    xs.push(routeX(y, largeur));
    d += (d ? 'L' : 'M') + xs[i].toFixed(1) + ',' + y;
    if (i) cumul.push(cumul[i - 1] + Math.hypot(xs[i] - xs[i - 1], route.pas));
  }
  route = { xs, cumul, pas: route.pas, total: cumul[cumul.length - 1] || 1 };
  prevue.setAttribute('d', d);
  suivie.setAttribute('d', d);
  suivie.style.strokeDasharray = route.total;

  // Un repère sur la route à chaque escale
  parcours.querySelectorAll('.escale-repere').forEach((r) => r.remove());
  const haut = carte.getBoundingClientRect().top;
  reperes = [...document.querySelectorAll('.escale-titre')].map((titre) => {
    const y = titre.getBoundingClientRect().top - haut + 40;
    const repere = creer('span', 'escale-repere');
    repere.style.left = routeX(y, largeur) + 'px';
    repere.style.top = y + 'px';
    parcours.appendChild(repere);
    return [y, repere];
  });
}

// Les bandes horizontales occupent toute la largeur et la hauteur dépend de leur longueur
function dimensionnerTraversees() {
  const gauche = contenu.getBoundingClientRect().left;
  traversees = [...document.querySelectorAll('.traversee')].map((el) => {
    el.style.marginLeft = -gauche + 'px';
    const bande = el.querySelector('.bande');
    const distance = Math.max(0, bande.scrollWidth - innerWidth);
    el.style.height = innerHeight + distance + 'px';
    return [el, bande, distance];
  });
  // Les couloirs des poissons aussi, pour qu'ils traversent l'écran d'un bord à l'autre
  document.querySelectorAll('.couloir').forEach((el) => {
    el.style.marginLeft = -el.parentElement.getBoundingClientRect().left + 'px';
  });
}

function listerFrises() {
  frises = [...document.querySelectorAll('.defile.frise')];
}

function mettreEnPage() {
  dimensionnerTraversees();
  listerFrises();
  tracerRoute();
  dessinerSondes();
  if (reduit) image();
}

/* ---------- Boucle d'animation ---------- */

// Profondeur affichée en haut à droite, avec le nom de la zone océanique
const PROFONDEUR_MAX = 6000;
const ZONES = [200, 1000, 4000, Infinity].map((limite, i) => [limite, T.zones[i]]);
const jauge = { metres: document.getElementById('metres'), zone: document.getElementById('zone') };
const boutonSurface = document.getElementById('surface');
let derniereProfondeur = -1;

function limiter(v, min, max) { return Math.min(max, Math.max(min, v)); }

function image() {
  const vh = innerHeight;
  racine.style.setProperty('--p', limiter(scrollY / vh, 0, 1).toFixed(3));

  // Ancre : elle se tient au milieu de l'écran, sur la route
  const r = carte.getBoundingClientRect();
  const y = limiter(vh * 0.5 - r.top, 0, r.height);
  const i = Math.min(route.xs.length - 1, Math.floor(y / route.pas));
  const x = route.xs[i] || 0;
  const pente = route.xs[Math.min(route.xs.length - 1, i + 1)] - x || 0;
  const angle = (Math.atan2(pente, route.pas) * 180) / Math.PI;
  ancre.style.setProperty('--bx', x.toFixed(1) + 'px');
  ancre.style.setProperty('--by', y.toFixed(1) + 'px');
  ancre.style.setProperty('--bangle', (-angle * 0.5).toFixed(1) + 'deg');
  // Elle n'apparaît qu'une fois entré dans le contenu, pas sur l'écran d'accueil
  ancre.style.setProperty('--bvis', limiter((y - 150) / 250, 0, 1).toFixed(2));
  suivie.style.strokeDashoffset = (route.total - (route.cumul[i] || 0)).toFixed(1);
  reperes.forEach(([ry, repere]) => repere.classList.toggle('atteint', y >= ry));

  // Rose des vents : cap selon la route
  const degres = Math.round((360 - angle * 3 + 360) % 360);
  racine.style.setProperty('--cap', -degres + 'deg');

  // Bandes horizontales
  traversees.forEach(([el, bande, distance]) => {
    const t = limiter(-el.getBoundingClientRect().top / Math.max(1, distance), 0, 1);
    bande.style.setProperty('--tx', (-t * distance).toFixed(1) + 'px');
    el.style.setProperty('--avance', t.toFixed(3));
  });

  // Frises : l'axe se trace au fil du défilement
  frises.forEach((el) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--avance', limiter((vh * 0.6 - r.top) / r.height, 0, 1).toFixed(3));
  });

  // Plus on descend, plus on s'enfonce dans les abysses
  const prof = limiter(scrollY / Math.max(1, racine.scrollHeight - vh), 0, 1);
  racine.style.setProperty('--prof', prof.toFixed(3));
  const metres = Math.round((prof * PROFONDEUR_MAX) / 10) * 10;
  if (metres !== derniereProfondeur) {
    derniereProfondeur = metres;
    jauge.metres.textContent = metres ? '−' + metres.toLocaleString(T.locale) : '0';
    jauge.zone.textContent = ZONES.find(([limite]) => metres < limite)[1];
  }
  boutonSurface.classList.toggle('montre', scrollY > vh * 0.9);

  if (!reduit) requestAnimationFrame(image);
}

init();
boutonSurface.addEventListener('click', remonterALaSurface);
document.querySelector('footer a[href="#accueil"]').addEventListener('click', remonterALaSurface);
observerApparitions();
mettreEnPage();
addEventListener('resize', mettreEnPage);
// Déplier une fiche change la hauteur de la carte : la route et les sondes suivent
let attenteMiseEnPage;
new ResizeObserver(() => {
  clearTimeout(attenteMiseEnPage);
  attenteMiseEnPage = setTimeout(mettreEnPage, 150);
}).observe(carte);
addEventListener('load', mettreEnPage);
if (document.fonts) document.fonts.ready.then(mettreEnPage);
document.querySelectorAll('.traversee img').forEach((img) => img.addEventListener('load', mettreEnPage));
if (reduit) addEventListener('scroll', image, { passive: true });
requestAnimationFrame(image);
