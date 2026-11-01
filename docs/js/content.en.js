const CONTENT_EN = {
  "nom": "Alexandre CAUSSADE",
  "accroche": "Computer engineering student at INSA Rennes, trombonist and surf lifesaver.",
  "sections": [
    {
      "titre": "My profile",
      "photo": { "src": "images/profil.jpg", "alt": "Sunset over the ocean, in purple tones", "fondu": true },
      "blocs": [
        {
          "titre": "Who am I?",
          "texte": "Originally from the Basque Country, I am a student in the Computer Science department of INSA Rennes, specialising in cybersecurity. I was admitted to my school with High-Level Artist status, and I share my time between my studies, music and competitive lifesaving."
        },
        {
          "titre": "Current projects",
          "affichage": "effervescence",
          "consigne": "Click the project to see the next one →",
          "liste": [
            {
              "texte": "Since September 2026 — Wind turbine project — INSA Rennes, in partnership with EDF: a project led by INSA Rennes with the support of Sopra Steria, bringing together the Mechanical Engineering and Electrical Engineering departments to build an educational model that raises awareness of cybersecurity in the energy sector",
              "photo": { "src": "images/projet-eolienne.jpg", "alt": "Offshore wind turbines in the mist", "credit": "Andy Dingley · CC BY-SA 3.0", "source": "https://commons.wikimedia.org/wiki/File:Barrow_Offshore_wind_turbines_NR.jpg" }
            },
            {
              "texte": "Since May 2026 — Consulting — Primaval Bretagne: supporting the company's digital transformation by developing custom tools in the field of wealth management",
              "photo": { "src": "images/logo-primaval.png", "alt": "Primaval logo", "logo": true, "fond": "sombre" }
            }
          ]
        },
        {
          "titre": "Past experience",
          "affichage": "effervescence",
          "consigne": "Click the experience to see the next one →",
          "liste": [
            {
              "texte": "June – July 2026 — Intern — DXC Technology (La Défense): studied the conditions for deploying agentic AI (Claude Mythos, GPT 5.6), along with its dangers and cybersecurity challenges, to raise awareness within DXC's France cybersecurity division, with the support of major vendors such as Palo Alto Networks and Microsoft",
              "photo": { "src": "images/logo-dxc.png", "alt": "DXC Technology logo", "logo": true }
            },
            {
              "texte": "September 2025 – May 2026 — OMR research project: worked with 3 students and 2 faculty researchers on an AI that turns a sheet of music in JPG format into a format that can be edited in an application",
              "photo": { "src": "images/projet-omr.jpg", "alt": "Brooklyn sheet music for trombone" }
            },
            {
              "texte": "April 2026 — Cyberschool Rennes CTF (PNRB): 4th place out of about twenty teams, in a team of 5 students",
              "photo": { "src": "images/logo-cyberschool.png", "alt": "Cyberschool logo", "logo": true }
            },
            {
              "texte": "February 2023 — Intern — Au Pair Butrfly (Bidart): analysis of the marketing mix and customer journey",
              "photo": { "src": "images/logo-butrfly.png", "alt": "Au Pair Butrfly logo", "logo": true }
            },
            {
              "texte": "December 2021 – October 2022 — Innovation competitions — ESTIA: French Tech Pays Basque Hackathon (October 2022): “Encouraging student housing with local residents”, first prize in the high school category; 24h de l'innovation (December 2021): team project for EDF, in charge of data management and search engine optimisation",
              "photo": [
                { "src": "images/logo-estia.png", "alt": "ESTIA logo", "logo": true },
                { "src": "images/logo-24h.png", "alt": "24h de l'innovation logo", "logo": true }
              ]
            }
          ]
        },
        {
          "titre": "Skills",
          "affichage": "bulles",
          "liste": [
            "Cybersecurity: awareness of the challenges (energy sector and agentic AI), CTF participation",
            "Artificial intelligence: monitoring and analysis of agentic AI, research project on sheet music recognition (OMR)",
            "Custom tool development: designing digital solutions for wealth management",
            "Project management and teamwork: multidisciplinary projects with faculty researchers and industrial partners (EDF, Sopra Steria)",
            "Leadership: conducting the INSA band, co-presidency of an association of more than 50 people",
            "Marketing analysis and innovation: marketing mix, customer journey, hackathon, 24h de l'innovation",
            "Programming languages: C, Java, Python, C++, Prolog, OCaml, Angular, Kotlin",
            "Tools and frameworks: GitHub, GitLab, VS Code, IntelliJ, Linux",
            "Languages: French (native), English B2, Spanish B2"
          ]
        },
        {
          "titre": "Education",
          "affichage": "frise",
          "liste": [
            "2011 — Joining the conservatoire: I started the trombone at the Conservatoire Maurice Ravel in Bayonne. At the same time, I took up lifesaving sport at the Biarritz Sauvetage Côtier club",
            "2020 — Lycée André Malraux, Biarritz: entered the general track, while keeping up both the conservatoire and competitive lifesaving",
            "2022 — Music and first aid: Certificat d'Études Musicales: end-of-cycle diploma from the conservatoire; First aid: PSE1, PSE2, BNSSA and SSAL training with Biarritz Sauvetage Côtier, until 2023",
            "2023 — Baccalauréat and admission to INSA Rennes: General baccalauréat: obtained at Lycée André Malraux, as I finished my time at the conservatoire; High-Level Artist: admitted to INSA Rennes with this status, which adapts the curriculum to combine engineering studies and musical practice; Common core: two years of general scientific training before choosing a specialisation",
            "2025 — Computer Science department: I chose computer science for my last three years of school, alongside my first research project, on AI sheet music recognition (OMR)",
            "2026 — Cybersecurity track: I chose the department's cybersecurity track, following on from my internship at DXC on the security challenges of agentic AI and the wind turbine project on cybersecurity in the energy sector",
            "2028 — Engineering degree (expected): end of my studies at INSA Rennes, with an engineering degree in computer science specialised in cybersecurity"
          ]
        },
        {
          "titre": "Contact",
          "liste": [
            { "texte": "Email", "lien": "mailto:alexandre.peio.caussade@gmail.com" },
            { "texte": "LinkedIn", "lien": "https://www.linkedin.com/in/alexandre-caussade-43498119b/" },
            { "texte": "GitHub", "lien": "https://github.com/peio-Csd" }
          ],
          "cv": { "texte": "CV (in French)", "lien": "documents/CV_Alexandre_Caussade.pdf" }
        }
      ]
    },
    {
      "titre": "My interests",
      "rupture": true,
      "poissons": "sauvetage",
      "galerie": {
        "modele": "sauvetage",
        "photos": [
          { "src": "images/sauvetage-1.jpg", "alt": "Run on the Grande Plage in Biarritz, Red Bull competition", "taille": "grande" },
          { "src": "images/sauvetage-2.jpg", "alt": "Getting out of the water with a rescue board, local competition", "taille": "haute" },
          { "src": "images/sauvetage-3.jpg", "alt": "Surfski in the waves, Red Bull competition" },
          { "src": "images/sauvetage-4.jpg", "alt": "Riding a wave on a rescue board, Red Bull competition" },
          { "src": "images/sauvetage-5.jpg", "alt": "Brittany surf contest" }
        ]
      },
      "blocs": [
        {
          "titre": "Sport",
          "cadre": true,
          "texte": "Member of the competition section of Biarritz Sauvetage Côtier since 2013. Selected for the French Championships from 2019 to 2021. Volunteer on the FFSS first aid team in 2023 (about 20 hours).",
          "liste": [
            "2025 — Nouvelle-Aquitaine Championships: 14th in surfski, 15th in paddle board, 18th in Oceanman",
            "2023 — 13th in the Red Bull Ocean Rescue selection",
            "2022 — 3rd in the long-distance race, French Championships",
            "2022 — French Championships: 8th in kayak, 10th in paddle board, 12th in beach flags",
            "2021 — 4th in surfski, French Championships",
            "2021 — 13th in rescue board, French Rescue",
            "2019 — 2nd in beach flags, Aquitaine Championships"
          ]
        },
        {
          "titre": "Music",
          "poissons": "fanfare",
          "galerie": {
            "modele": "musique",
            "photos": [
              { "src": "images/musique-2.jpg", "alt": "INSA Rennes band 1" },
              { "src": "images/musique-3.jpg", "alt": "Speech at an INSA Rennes band event" },
              { "src": "images/musique-1.jpg", "alt": "INSA Rennes band 2" },
              { "src": "images/musique-4.jpg", "alt": "National trombone quartet competition, rising talent category" }
            ]
          },
          "cadre": true,
          "texte": "Trombonist trained at the Conservatoire Maurice Ravel in Bayonne (2011 – 2023). At INSA, I joined the jazz ensemble and the classical orchestra. I was solo trombone in the brass band Galettes So'6 and I conduct the INSA band. I also play in semi-professional ensembles: the Harmonie de Biarritz and the Harmonie Bayonnaise.",
          "liste": [
            "Since 2026 — Member of the Groove Collective: an orchestra based on the line-up of Raye's Heritage Orchestra, influenced by jazz while incorporating pop, R&B and soul",
            "2025 – 2026 — Co-president of FanfarINSArrasin: an association of more than 50 people, conducting the orchestra, administration and event organisation (festivals, trips across France)",
            "2024 – 2026 — Member of the Galettes So'6 collective: a brass band inspired by jazz, funk and electro",
            "Since 2023 — High-Level Artist at INSA Rennes",
            "2022 — Certificat d'Études Musicales",
            "2022 — Second prize at the national trombone quartet competition",
            "2022 — Concerts with the Harmonie Bayonnaise (10, in France and Spain), my trombone quartet (5), the Harmonie de Biarritz – Itsas Onua (3), the banda Band'Aqui, Cuivres en Pays Basque and the conservatoire orchestras"
          ]
        }
      ]
    }
  ]
};
