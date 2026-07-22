// Variable globale pour stocker toutes les actualités (pour la modale)
let toutesLesActualites = [];

document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('main.container');
    
    // 1. On s'assure d'avoir la structure HTML pour séparer "Dernières" et "Anciennes"
    if (mainContainer && !document.getElementById('anciennesSection')) {
        mainContainer.innerHTML = `
            <h2>Dernières Actualités</h2>
            <div class="news-grid" id="newsGrid">
                <!-- Contenu dynamique -->
            </div>

            <div id="anciennesSection" style="margin-top: 40px;">
                <h2 style="border-left-color: #7f8c8d; color: #7f8c8d;">Anciennes Actualités</h2>
                <div class="news-grid" id="anciennesGrid">
                    <!-- Anciennes actualités -->
                </div>
            </div>

            <!-- Modale pour la lecture complète -->
            <div id="modalArticle" class="modal">
                <div class="modal-content">
                    <span class="close-btn" onclick="fermerModal()">&times;</span>
                    <img id="modalImg" src="" alt="Image complète" style="width:100%; border-radius:10px;">
                    <h2 id="modalTitle"></h2>
                    <p id="modalFullText"></p>
                </div>
            </div>
        `;
    }

    const containerDernieres = document.getElementById('newsGrid');
    const containerAnciennes = document.getElementById('anciennesGrid');
    
    // 2. TES ACTUALITÉS LOCALES DE SECOURS (Elles vont dans les anciennes pour servir d'historique)
    const newsDataSecours = [
        { 
            id: 'secours_1', 
            titre: "Rentrée Scolaire", 
            date: "01 Sept", 
            extrait: "Préparez vos fournitures...", 
            contenu_complet: "Cette année scolaire, nous avons rénové notre établissement pour que les élèves se sentent en sécurité...", 
            image: "img/actualites/rentre.png" 
        },
        { 
            id: 'secours_2', 
            titre: "Nouveaux Labos", 
            date: "15 Août", 
            extrait: "Inauguration de la salle informatique...", 
            contenu_complet: "L'inauguration de notre labo informatique, pour que nos futurs développeurs soient dans les meilleures conditions...", 
            image: "img/galerie_info.png" 
        }
    ];

    // Fonction de génération du HTML d'une carte
    const creerCarteHtml = (actu) => {
        let imageUrl = actu.image;
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('img/')) {
            imageUrl = `https://centre-cotrole-cs-banza.onrender.com/static/${actu.image}`;
        }

        // Gestion de l'affichage de la date (soit date_creation formatée, soit la chaîne date fournie)
        let affichageDate = actu.date || "";
        if (actu.date_creation && !actu.date) {
            try {
                const d = new Date(actu.date_creation);
                affichageDate = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
            } catch(e) {
                affichageDate = "";
            }
        }

        return `
            <article class="news-card" onclick="ouvrirArticle('${actu.id}')" style="cursor: pointer;">
                <img src="${imageUrl}" class="news-img" alt="image" onerror="this.src='img/default.jpg'">
                <div style="padding: 15px;">
                    <span class="news-date">${affichageDate}</span>
                    <h3>${actu.titre}</h3>
                    <p>${actu.extrait || actu.contenu_complet?.substring(0, 80) + '...' || ''}</p>
                    <button class="read-more">Lire la suite</button>
                </div>
            </article>`;
    };

    // Fonction principale de tri et d'affichage avec persistance garantie
    const traiterEtAfficherActualites = (dataApi) => {
        // Fusion sécurisée de toutes les sources pour la modale (API + Secours locaux)
        toutesLesActualites = [...dataApi, ...newsDataSecours];

        containerDernieres.innerHTML = "";
        containerAnciennes.innerHTML = "";

        const maintenant = new Date();
        const unMoisEnMs = 30 * 24 * 60 * 60 * 1000; // Période exacte de 30 jours

        let countDernieres = 0;

        // A) Analyse et tri automatique des actualités du Centre de Contrôle
        dataApi.forEach(actu => {
            // Sécurité sur la date de création renvoyée par l'API
            let dateActu = actu.date_creation ? new Date(actu.date_creation) : new Date();
            if (isNaN(dateActu.getTime())) {
                dateActu = new Date(); // Fallback si la date est invalide
            }

            let ageEnMs = maintenant - dateActu;

            // Règle d'or : Moins de 30 jours -> Dernières | Plus de 30 jours -> Archivé automatiquement dans Anciennes (jamais supprimé)
            if (ageEnMs <= unMoisEnMs) {
                containerDernieres.innerHTML += creerCarteHtml(actu);
                countDernieres++;
            } else {
                containerAnciennes.innerHTML += creerCarteHtml(actu);
            }
        });

        // Message propre si aucune actualité récente n'est trouvée
        if (countDernieres === 0) {
            containerDernieres.innerHTML = "<p style='color: #666; font-style: italic;'>Aucune actualité publiée ce mois-ci. Retrouvez l'historique complet de nos activités dans les anciennes actualités ci-dessous.</p>";
        }

        // B) Ajout systématique des actualités de secours dans les anciennes pour enrichir l'historique
        newsDataSecours.forEach(actu => {
            containerAnciennes.innerHTML += creerCarteHtml(actu);
        });
    };

    // 3. Appel de l'API du Centre de Contrôle en ligne
    const API_URL = "https://centre-cotrole-cs-banza.onrender.com/api/actualites";
    
    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error("Erreur réseau API");
            return response.json();
        })
        .then(data => {
            traiterEtAfficherAnormalesOuDirectes = data;
            traiterEtAfficherActualites(Array.isArray(data) ? data : []);
        })
        .catch(err => {
            console.warn("Centre de Contrôle distant injoignable, basculement sur le mode secours local :", err);
            traiterEtAfficherActualites([]); // Laisse les secours locaux s'afficher dans les anciennes
        });
});

// --- LOGIQUE DE LA MODALE ---

function ouvrirArticle(id) {
    // Recherche de l'article par son ID (gère aussi bien les ID numériques que textuels)
    const actu = toutesLesActualites.find(a => String(a.id) === String(id)); 
    if (!actu) return;

    let imageUrl = actu.image;
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('img/')) {
        imageUrl = `https://centre-cotrole-cs-banza.onrender.com/static/${actu.image}`;
    }

    document.getElementById('modalTitle').innerText = actu.titre || "";
    document.getElementById('modalFullText').innerText = actu.contenu_complet || actu.contenu || "";
    document.getElementById('modalImg').src = imageUrl;
    document.getElementById('modalArticle').style.display = "block";
}

function fermerModal() {
    document.getElementById('modalArticle').style.display = "none";
}