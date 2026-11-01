// Choisit la langue du site, puis traduit les textes écrits en dur dans index.html.
// Ordre : lien ?lang=…, choix déjà fait sur ce navigateur, langues préférées du navigateur.
// Une préférence ni française ni anglaise affiche l'anglais.

const TEXTES = {
  fr: {
    locale: 'fr-FR',
    depuis: 'Depuis',
    escale: 'Escale',
    defiler: 'photos · faire défiler →',
    sondage: 'Sondage en cours…',
    credit: 'Photo : ',
    consigne: 'Cliquez sur la fiche pour la faire défiler →',
    retour: '← Revenir en arrière',
    premier: 'Revenir au premier ↺',
    voirProjet: 'Voir le projet →',
    passerelle: 'Passerelle NAUTILUS',
    fichier: 'Fichier reçu : ',
    dechiffrement: (p) => 'Déchiffrement en cours… ' + p + ' %',
    dechiffre: 'Déchiffrement terminé · 100 %',
    integrite: '✓ Intégrité vérifiée — signature conforme',
    zones: ['Zone éclairée', 'Zone crépusculaire', 'Zone de minuit', 'Abysses'],
    choixLangue: 'Langue',
    profil: 'Mon profil',
    connexion: 'Connexion sécurisée · Mon profil',
    enLigne: 'En ligne',
    amarres: 'Larguez les amarres ↓',
    surface: 'Remonter à la surface',
    finJournal: '— Fin du journal de bord —',
    retourPort: 'Retour au port ↑',
    coinHaut: '43°29′N 1°34′O',
    coinBas: '48°07′N 1°41′O',
  },
  en: {
    locale: 'en-GB',
    depuis: 'Since',
    escale: 'Port of call',
    defiler: 'photos · scroll →',
    sondage: 'Sounding in progress…',
    credit: 'Photo: ',
    consigne: 'Click the card to see the next one →',
    retour: '← Go back',
    premier: 'Back to the first ↺',
    voirProjet: 'View the project →',
    passerelle: 'NAUTILUS bridge',
    fichier: 'File received: ',
    dechiffrement: (p) => 'Decrypting… ' + p + '%',
    dechiffre: 'Decryption complete · 100%',
    integrite: '✓ Integrity verified — signature valid',
    zones: ['Sunlight zone', 'Twilight zone', 'Midnight zone', 'Abyss'],
    choixLangue: 'Language',
    profil: 'My profile',
    connexion: 'Secure connection · My profile',
    enLigne: 'Online',
    amarres: 'Cast off ↓',
    surface: 'Return to the surface',
    finJournal: '— End of the logbook —',
    retourPort: 'Back to port ↑',
    coinHaut: '43°29′N 1°34′W',
    coinBas: '48°07′N 1°41′W',
  },
};

function choisirLangue() {
  const demandee = new URLSearchParams(location.search).get('lang');
  try {
    if (TEXTES[demandee]) localStorage.setItem('langue', demandee);
    else {
      const memorisee = localStorage.getItem('langue');
      if (TEXTES[memorisee]) return memorisee;
    }
  } catch (e) { /* stockage bloqué : on retombe sur la préférence du navigateur */ }
  if (TEXTES[demandee]) return demandee;
  const preferee = (navigator.languages || [navigator.language]).find((l) => /^(fr|en)\b/i.test(l || ''));
  return preferee ? preferee.slice(0, 2).toLowerCase() : 'en';
}

const LANGUE = choisirLangue();
const T = TEXTES[LANGUE];
const CONTENT = LANGUE === 'fr' ? CONTENT_FR : CONTENT_EN;

document.documentElement.lang = LANGUE;
document.querySelectorAll('[data-texte]').forEach((el) => { el.textContent = T[el.dataset.texte]; });
document.querySelectorAll('[data-label]').forEach((el) => el.setAttribute('aria-label', T[el.dataset.label]));
document.querySelector('.langues a[lang="' + LANGUE + '"]').setAttribute('aria-current', 'true');
