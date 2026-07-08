function checkResults() {
    const id = document.getElementById('studentID').value.trim();
    const display = document.getElementById('resultDisplay');
    const bar = document.getElementById('progressFill');
    const nom = document.getElementById('displayNom');
    const mention = document.getElementById('displayMention');

    if (!id) return alert("Entrez un ID valide");

    // Animation de chargement
    display.classList.remove('hidden');
    bar.style.width = "0%";
    nom.innerText = "Recherche...";
    
    setTimeout(() => {
        // Simulation de données (En production, on ferait un fetch)
        const score = 75; 
        nom.innerText = "Élève ID: " + id;
        bar.style.width = score + "%";
        bar.innerText = score + "%";
        mention.innerText = score >= 60 ? "Mention: Distinction ✨" : "Mention: Satisfaction";
    }, 1500);
}