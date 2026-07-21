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
    
    // 2. TES ACTUALITÉS LOCALES EN DUR (Elles vont directement dans les anciennes pour servir de base historique)
    const newsDataSecours = [
        { 
            id: 1, 
            titre: "Rentrée Scolaire 2024", 
            date: "01 Sept", 
            extrait: "Préparez vos fournitures...", 
            contenu_complet: "Cette année scolaire, nous avons rénové notre établissement pour que les élèves se sentent en sécurité...", 
            image: "img/rentre.png" 
        },
        { 
            id: 2, 
            titre: "Nouveaux Labos", 
            date: "15 Août", 
            extrait: "Inauguration de la salle informatique...", 
            contenu_complet: "L'inauguration de notre salle de labo informatique, donc nos futurs gestionnaires et développeurs sont maintenant rassurés...", 
            image: "img/galerie_info.png" 
        }
    ];

    // Fonction de génération du HTML d'une carte
    const creerCarteHtml = (actu) => {
        let imageUrl = actu.image;
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('img/')) {
            imageUrl = `https://centre-cotrole-cs-banza.onrender.com/static/${actu.image}`;
        }

        return `
            <article class="news-card" onclick="ouvrirArticle(${actu.id})" style="cursor: pointer;">
                <img src="${imageUrl}" class="news-img" alt="image" onerror="this.src='img/default.jpg'">
                <div style="padding: 15px;">
                    <span class="news-date">${actu.date}</span>
                    <h3>${actu.titre}</h3>
                    <p>${actu.extrait}</p>
                    <button class="read-more">Lire la suite</button>
                </div>
            </article>`;
    };

    // Fonction principale de tri et d'affichage
    const traiterEtAfficherActualites = (dataApi) => {
        // On fusionne tout dans le tableau global pour que la modale retrouve tous les articles
        // Les articles locaux en dur sont combinés avec ceux de l'API
        toutesLesActualites = [...dataApi, ...newsDataSecours];

        containerDernieres.innerHTML = "";
        containerAnciennes.innerHTML = "";

        const maintenant = new Date();
        const unMoisEnMs = 30 * 24 * 60 * 60 * 1000; // 30 jours

        let countDernieres = 0;

        // A) Traitement des actualités provenant de l'API (Centre de Contrôle)
        dataApi.forEach(actu => {
            let dateActu = actu.date_creation ? new Date(actu.date_creation) : new Date();
            let ageEnMs = maintenant - dateActu;

            // Si l'article de l'API a moins d'un mois -> "Dernières actualités"
            // S'il est plus vieux -> "Anciennes actualités" (archivé sans suppression)
            if (ageEnMs <= unMoisEnMs) {
                containerDernieres.innerHTML += creerCarteHtml(actu);
                countDernieres++;
            } else {
                containerAnciennes.innerHTML += creerCarteHtml(actu);
            }
        });

        if (countDernieres === 0) {
            containerDernieres.innerHTML = "<p>Aucune actualité très récente. Consultez les anciennes actualités ci-dessous.</p>";
        }

        // B) Les actualités statiques en dur vont toujours dans "Anciennes Actualités" pour garder l'historique
        newsDataSecours.forEach(actu => {
            containerAnciennes.innerHTML += creerCarteHtml(actu);
        });
    };

    // 3. Appel vers ton Centre de Contrôle en ligne
    const API_URL = "https://centre-cotrole-cs-banza.onrender.com/api/actualites";
    
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            traiterEtAfficherActualites(data);
        })
        .catch(err => {
            console.warn("Centre de Contrôle injoignable, affichage exclusif des actualités locales", err);
            traiterEtAfficherActualites([]); // Si l'API échoue, les secours locaux s'affichent quand même dans les anciennes
        });

    console.log("Système d'actualités CS BANZA (avec persistance et archivage) chargé.");
});

// --- LOGIQUE DE LA MODALE ---

function ouvrirArticle(id) {
    const actu = toutesLesActualites.find(a => a.id === id); 
    if (!actu) return;

    let imageUrl = actu.image;
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('img/')) {
        imageUrl = `https://centre-cotrole-cs-banza.onrender.com/static/${actu.image}`;
    }

    document.getElementById('modalTitle').innerText = actu.titre;
    document.getElementById('modalFullText').innerText = actu.contenu_complet || actu.contenu;
    document.getElementById('modalImg').src = imageUrl;
    document.getElementById('modalArticle').style.display = "block";
}

function fermerModal() {
    document.getElementById('modalArticle').style.display = "none";
}