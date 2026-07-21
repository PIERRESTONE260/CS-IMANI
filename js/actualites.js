// Variable globale pour stocker les actualités récupérées (pour la modale)
let toutesLesActualites = [];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.news-grid');
    
    // Données de secours locales au cas où le serveur Render met du temps à démarrer
    const newsDataSecours = [
        { 
            id: 1, 
            titre: "Rentrée Scolaire", 
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
            contenu_complet: "L'inauguration de notre salle de labo informatique, donc nos future gestionnaire et dévélopppeur sont maintenant rassuré...", 
            image: "img/galerie_info.png" 
        }
    ];

    // Fonction pour afficher les articles dans la grille
    const renderNews = (data) => {
        toutesLesActualites = data; // On sauvegarde pour la modale
        container.innerHTML = ""; // On nettoie l'ancien contenu
        
        if (!data || data.length === 0) {
            container.innerHTML = "<p>Aucune actualité pour le moment.</p>";
            return;
        }

        data.forEach(actu => {
            // Gestion intelligente de l'image (si elle vient de Render ou d'un dossier local)
            let imageUrl = actu.image;
            if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('img/')) {
                imageUrl = `https://centre-cotrole-cs-banza.onrender.com/static/${actu.image}`;
            }

            container.innerHTML += `
                <article class="news-card" onclick="ouvrirArticle(${actu.id})" style="cursor: pointer;">
                    <img src="${imageUrl}" class="news-img" alt="image" onerror="this.src='img/default.jpg'">
                    <div style="padding: 15px;">
                        <span class="news-date">${actu.date}</span>
                        <h3>${actu.titre}</h3>
                        <p>${actu.extrait}</p>
                        <button class="read-more">Lire la suite</button>
                    </div>
                </article>`;
        });
    };

    // URL officielle de ton API sur Render
    const API_URL = "https://centre-cotrole-cs-banza.onrender.com/api/actualites";
    
    // Appel vers ton Centre de Contrôle en ligne
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            renderNews(data);
        })
        .catch(err => {
            console.warn("Impossible joindre le Centre de Contrôle, affichage du secours", err);
            renderNews(newsDataSecours);
        });

    console.log("Système d'actualités CS BANZA chargé avec succès.");
});

// --- LOGIQUE CORRIGÉE POUR LA MODALE ---

function ouvrirArticle(id) {
    // On cherche l'article cliqué dans le tableau global (qu'il vienne de l'API ou du secours)
    const actu = toutesLesActualites.find(a => a.id === id); 
    if (!actu) return;

    let imageUrl = actu.image;
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('img/')) {
        imageUrl = `https://centre-cotrole-cs-banza.onrender.com/static/${actu.image}`;
    }

    document.getElementById('modalTitle').innerText = actu.titre;
    // Note : gère aussi bien 'contenu_complet' (Flask) que 'contenu' (local)
    document.getElementById('modalFullText').innerText = actu.contenu_complet || actu.contenu;
    document.getElementById('modalImg').src = imageUrl;
    document.getElementById('modalArticle').style.display = "block";
}

function fermerModal() {
    document.getElementById('modalArticle').style.display = "none";
}