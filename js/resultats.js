// Remplacez par l'URL de votre Web App Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbzmyuv8SMVpHCjr9OTuS1jAVVGRXZhwyqbpCOcuY-dpLhT0L0Dag6u9SoUTLnEcWk0s/exec";

function checkResults() {
    const matricule = document.getElementById('studentID').value.trim();
    const password = document.getElementById('studentPass').value.trim();
    const display = document.getElementById('resultDisplay');

    if (!matricule || !password) {
        return alert("Veuillez remplir le matricule et le mot de passe.");
    }

    // 1. Logique de mot de passe par cycle
    let mdpAttendu = "";
    if (matricule.startsWith("10")) mdpAttendu = "26BANZA@1010";
    else if (matricule.startsWith("20")) mdpAttendu = "26BANZA@2020";
    else if (matricule.startsWith("30")) mdpAttendu = "26BANZA@3030";

    if (password !== mdpAttendu && !password.startsWith("26BANZA@")) {
        return alert("Mot de passe incorrect pour ce cycle.");
    }

    // 2. Requête vers la base de données (Google Sheets)
    fetch(`${API_URL}?action=getBulletin&matricule=${encodeURIComponent(matricule)}`)
        .then(response => response.json())
        .then(data => {
            const eleveData = data.eleve || data;

            if (data.result === "error" || data.status === "error" || !eleveData.nom) {
                alert(data.message || "Matricule introuvable.");
            } else {
                afficherBulletin(eleveData);
            }
        })
        .catch(err => {
            console.error(err);
            alert("Erreur de connexion au serveur.");
        });
}

function afficherBulletin(eleve) {
    const display = document.getElementById('resultDisplay');
    display.classList.remove('hidden');

    // Mise à jour des informations de l'élève en temps réel (Nom, Postnom, Prénom)
    const nomComplet = `${eleve.nom || ''} ${eleve.postnom || ''} ${eleve.prenom || ''}`.trim();
    document.getElementById('displayNom').innerText = nomComplet || "--";
    document.getElementById('displayClasse').innerText = eleve.classe || "--";
    
    // Récupération du pourcentage calculé automatiquement par le backend
    const pourcentage = (eleve.pourcentage !== undefined && eleve.pourcentage !== null && !isNaN(eleve.pourcentage)) ? parseFloat(eleve.pourcentage) : 0;
    
    // Mise à jour de la barre de progression
    const bar = document.getElementById('progressFill');
    bar.style.width = pourcentage + "%";
    bar.innerText = pourcentage + "%";
    
    // Mention automatique dynamique selon tes règles précises :
    // - Moins de 50% = Reprend l'année
    // - 50% et plus = Satisfaction (ou Distinction / Grande Distinction si supérieur)
    let mentionTexte = "Satisfaction";
    if (pourcentage < 50) {
        mentionTexte = "Reprend l'année ❌";
    } else if (pourcentage >= 80) {
        mentionTexte = "La Plus Grande Distinction ✨";
    } else if (pourcentage >= 70) {
        mentionTexte = "Grande Distinction ✨";
    } else if (pourcentage >= 60) {
        mentionTexte = "Distinction ✨";
    }
    
    document.getElementById('displayMention').innerText = "Mention: " + mentionTexte;

    // Affichage dynamique de TOUTES les matières récupérées de la base de données (Google Sheets)
    const details = document.getElementById('notesDetails');
    details.innerHTML = '<div style="border-top: 1px solid #ccc; padding-top: 10px;"></div>';
    const containerNotes = details.querySelector('div');

    if (eleve.notes && Object.keys(eleve.notes).length > 0) {
        for (const [matiere, note] of Object.entries(eleve.notes)) {
            const noteAffichee = (note !== undefined && note !== null && note !== "") ? note : 0;
            const p = document.createElement('p');
            p.innerHTML = `<strong>${matiere} :</strong> ${noteAffichee}/10`;
            containerNotes.appendChild(p);
        }
    } else {
        containerNotes.innerHTML += '<p>Aucune note enregistrée pour le moment.</p>';
    }
}