// Données locales (en attendant de les recevoir du Centre de Contrôle)
const newsData = [
    { 
        id: 1, 
        titre: "Rentrée 2024", 
        date: "01 Sept", 
        extrait: "Préparez vos fournitures...", 
        contenu: "Cet année scolaire 2024 & 2025, nous avons énové notre établissement pour que les élèves ce sante en sécurité...", 
        image: "img/actualites/rentre.png" 
    },
    { 
        id: 2, 
        titre: "Nouveaux Labos", 
        date: "15 Août", 
        extrait: "Inauguration de la salle informatique...", 
        contenu: "L'inauguration de notre salle de labo informatique, donc nos future gestionnaire et dévélopppeur sont maintenant rassuré...", 
        image: "img/galerie_info.png" 
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.news-grid');
    
    // Fonction pour afficher les articles
    const renderNews = (data) => {
        container.innerHTML = ""; // On nettoie l'ancien contenu
        data.forEach(actu => {
            container.innerHTML += `
                <article class="news-card" onclick="ouvrirArticle(${actu.id})">
                    <img src="${actu.image}" class="news-img" alt="image">
                    <div style="padding: 15px;">
                        <span class="news-date">${actu.date}</span>
                        <h3>${actu.titre}</h3>
                        <p>${actu.extrait}</p>
                        <button class="read-more">Lire la suite</button>
                    </div>
                </article>`;
        });
    };

    const API_URL = "https://centre-controle-banza.onrender.com/api/actualites";
    
    // Appel à votre Centre de Contrôle (On garde votre structure fetch)
    fetch('http://127.0.0.1:5000/api/actualites')
        .then(response => response.json())
        .then(data => {
            renderNews(data);
        })
        .catch(err => {
            console.warn("Centre de Contrôle non détecté, utilisation des données locales", err);
            renderNews(newsData);
        });

    console.log("Système d'actualités CS BANZA chargé.");
});

// --- LOGIQUE POUR LA MODALE (AJOUTÉE) ---

function ouvrirArticle(id) {
    // Dans un cas réel, on cherche dans le tableau des données chargées
    const actu = newsData.find(a => a.id === id); 
    if (!actu) return;

    document.getElementById('modalTitle').innerText = actu.titre;
    document.getElementById('modalFullText').innerText = actu.contenu;
    document.getElementById('modalImg').src = actu.image;
    document.getElementById('modalArticle').style.display = "block";
}

function fermerModal() {
    document.getElementById('modalArticle').style.display = "none";
}