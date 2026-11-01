# Portfolio — Alexandre CAUSSADE

Site personnel (HTML/CSS/JS, sans backend) sur une seule page qui défile, au design « Carnet de bord » : une carte marine de nuit où une ancre suit sa route de Biarritz à Rennes au fil du défilement en s'enfonçant vers les abysses (le fond s'assombrit, la profondeur s'affiche en haut à droite, un bouton fait remonter à la surface dans un nuage de bulles), avec lignes de sonde, rose des vents, sonar et galeries de photos. Parties :
l'écran d'accueil (le nom et l'accroche à gauche, à droite une console de passerelle où le premier bloc de **Mon profil**, « Qui suis-je ? », se tape comme une commande `cat qui_suis_je.txt` ; un clic dans la console affiche tout d'un coup), puis sur la carte la suite de **Mon profil** (projets et expériences qu'on fait défiler en cliquant, compétences en bulles, formation en frise chronologique, contact) et **Mes intérêts** (cadres Sport et Musique).

## Arborescence

```
portfolio/
├── package.json        # Script npm start
├── README.md
└── docs/
    ├── index.html
    ├── css/style.css
    ├── images/         # Photos (bandeaux 1920×640, galeries)
    └── js/
        ├── content.js     # ← TOUT LE TEXTE FRANÇAIS DU SITE EST ICI
        ├── content.en.js  # ← Le même contenu en anglais
        ├── langue.js   # Choisit la langue ; textes de l'interface en français et en anglais
        └── main.js     # Construit la page, la route de l'ancre et la rose des vents
```

## Lancer le site

```bash
npm install   # une seule fois
npm start     # http://localhost:3000, la page se recharge à chaque modification
```

Tu peux aussi simplement ouvrir `docs/index.html` dans ton navigateur.

## Remplir le contenu

Modifie `docs/js/content.js` et remplace tous les textes entre `[crochets]`, puis fais la même modification dans `docs/js/content.en.js` : les deux fichiers doivent garder la même structure.

Le site s'affiche en français si le français passe avant l'anglais dans les langues préférées du navigateur, sinon en anglais. Le bouton FR / EN en haut de la page change de langue et ce choix est mémorisé sur le navigateur ; `?lang=fr` ou `?lang=en` dans l'adresse donne un lien vers une langue précise. En anglais, les séparateurs s'écrivent `Title: description` et `Name: detail; Name: detail`, et les dates en cours commencent par `Since`.

Chaque section contient des **blocs**. Un bloc accepte :

| Champ   | Rôle                                    |
|---------|-----------------------------------------|
| `titre` | Titre du bloc (obligatoire)             |
| `texte` | Paragraphe                              |
| `liste` | Liste à puces (texte, ou lien : `{ "texte": "GitHub", "lien": "https://..." }`) |
| `lien`  | Lien « Voir le projet »                 |
| `cadre` | `true` pour l'afficher dans un cadre    |
| `affichage` | `"cases"` (une fiche par élément « date — intitulé : description » ; pour regrouper plusieurs volets d'une même expérience : « date — intitulé : Nom : détail ; Nom : détail »), `"effervescence"` (mêmes éléments que `cases`, une fiche à la fois : un clic sur la fiche ou sur le bouton la change en bulles qui remontent, et la suivante se forme à sa place ; le texte du bouton se règle avec `"consigne"` sur le bloc), `"frise"` (frise chronologique en quinconce, utilisée pour la formation) ou `"bulles"` (une bulle par élément « titre : contenu », les énumérations courtes deviennent des pastilles). Un élément de `cases`/`effervescence`/`frise` peut aussi être `{ "texte": "...", "photo": { "src": "images/logo-x.png", "alt": "...", "logo": true } }` : l'image s'affiche dans une plaque au-dessus du texte. Avec `"logo": true` elle est posée sur fond clair sans être recadrée (ajoute `"fond": "sombre"` pour un logo blanc) ; sinon c'est une photo qui remplit le cadre (avec `"credit"` et `"source"` si elle vient d'ailleurs). `photo` peut être une liste pour afficher plusieurs logos. |
| `photo` | Photo pleine largeur affichée juste avant : `{ "src": "images/x.jpg", "alt": "..." }` (marche aussi sur une section) |
| `galerie` | Photos affichées juste avant : `{ "modele": "musique", "photos": [{ "src": ..., "alt": ... }] }`. Sur une section, elles défilent à l'horizontale ; sur un bloc, elles forment une mosaïque (disposition du modèle `musique` dans `css/style.css`). |
| `rupture` | `true` sur une section pour afficher un sonar animé juste avant |
| `poissons` | `"sauvetage"` sur une section qui a une galerie horizontale : un banc de poissons et un poisson secouriste avec sa bouée la traversent ; `"fanfare"` sur un bloc : une fanfare de poissons (sousaphone, trompette, trombone) passe en haut du bloc en lâchant des notes |

Pour ajouter une section (ex : « Voyages »), ajoute un objet `{ "titre": ..., "blocs": [...] }` dans `sections`. Le premier bloc de la première section s'affiche toujours dans la console de l'accueil.

## Téléphones et tablettes

Sur écran tactile ou fenêtre de moins de 980 px, le site passe en mode compact (dernier bloc `@media` de `css/style.css`) : les fiches de Formation et de Compétences n'affichent que leur titre et se déplient d'un appui, et les listes des cadres Sport et Musique n'affichent que leurs 3 premières lignes (`LIGNES_COMPACTES` dans `main.js`) avec un bouton « Voir les N autres ». Les photos de Sauvetage et de Musique s'affichent entières, les unes sous les autres, sans défilement horizontal. Sur ordinateur, tout reste ouvert et les galeries gardent leur mise en scène. Dans la frise, écris chaque ligne « date — titre : détail » pour que le titre soit court.

## Changer une photo

Mets ta photo dans `docs/images/` puis change le `src` correspondant dans `content.js`.
Pour la recadrer en bandeau (ImageMagick) :

```bash
convert ma-photo.jpg -resize 1920x -gravity center -crop 1920x640+0+0 +repage -quality 80 docs/images/profil.jpg
```

Les logos des projets et expériences (`images/logo-*.png`) sont préparés à partir de `photos_proj/` (rognés, sans métadonnées) :

```bash
convert photos_proj/Logo.png -trim +repage -resize '800x>' -strip docs/images/logo-x.png
```

Les originaux sont dans `fond_mon_profil/`, `sauvetage/`, `musique/` et `photos_proj/`. Les versions web sont réduites, sans métadonnées (`-strip`, ce qui retire aussi la position GPS), et jamais agrandies : les photos de faible résolution vont dans les petites cases des galeries.

Les couleurs du site (variables en haut de `css/style.css`) sont tirées de `images/profil.jpg`.

## Mise en ligne

Le site est publié sur https://caussade.dev par GitHub Pages, depuis le dossier `docs/` de la branche `main` du dépôt `peio-Csd/peio-Csd.github.io`. Il n'y a rien à construire :

```bash
git add .
git commit -m "Description de la modification"
git push
```

Le site est à jour environ une minute plus tard.

- Ne supprime pas `docs/CNAME` (il garde le domaine) ni `docs/.nojekyll`.
- Le dépôt est public : `.gitignore` laisse en local les originaux (`fond_mon_profil/`, `sauvetage/`, `musique/`, `photos_proj/`, `CV/`) et `CV.txt`. Seules les versions web de `docs/` sont publiées.
- Pour changer le CV en ligne, remplace `docs/documents/CV_Alexandre_Caussade.pdf`.
