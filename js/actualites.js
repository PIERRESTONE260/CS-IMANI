const newsData = [
    { title: "Rentrée 2024", date: "01 Sept", excerpt: "Préparez vos fournitures..." },
    { title: "Nouveaux Labos", date: "15 Août", excerpt: "Inauguration de la salle info..." }
];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.news-grid');
    
    // Si on voulait charger dynamiquement depuis un JSON plus tard
    console.log("Système d'actualités CS IMANI chargé.");
    
    // Exemple d'interaction : cliquer sur une news
    document.querySelectorAll('.news-card').forEach(card => {
        card.addEventListener('click', () => {
            // Logique pour ouvrir l'article complet
        });
    });
});