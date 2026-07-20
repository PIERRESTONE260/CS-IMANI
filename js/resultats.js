// Remplacez par l'URL de votre Web App Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbzmyuv8SMVpHCjr9OTuS1jAVVGRXZhwyqbpCOcuY-dpLhT0L0Dag6u9SoUTLnEcWk0s/exec";

function checkResults() {
    const matricule = document.getElementById('studentID').value.trim();
    const password = document.getElementById('studentPass').value.trim();
    const display = document.getElementById('resultDisplay');

    if (!matricule || !password) {
        return alert("Veuillez remplir le matricule et le mot de passe.");
    }

    // 1. Logique de mot de passe par cycle (basée sur votre règle)
    let mdpAttendu = "";
    if (matricule.startsWith("10")) mdpAttendu = "26BANZA@1010";
    else if (matricule.startsWith("20")) mdpAttendu = "26BANZA@2020";
    else if (matricule.startsWith("30")) mdpAttendu = "26BANZA@3030";

    if (password !== mdpAttendu) {
        return alert("Mot de passe incorrect pour ce cycle.");
    }

    // 2. Requête vers la base de données (Google Sheets)
    // On envoie le matricule pour récupérer les notes et le profil
    fetch(`${API_URL}?action=getBulletin&matricule=${matricule}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "error") {
                alert("Matricule introuvable.");
            } else {
                afficherBulletin(data);
            }
        })
        .catch(err => {
            console.error(err);
            alert("Erreur de connexion au serveur.");
        });
}

function afficherBulletin(data) {
    const display = document.getElementById('resultDisplay');
    display.classList.remove('hidden');

    // Mise à jour des informations de l'élève
    document.getElementById('displayNom').innerText = data.nom + " " + data.postnom;
    document.getElementById('displayClasse').innerText = data.classe;
    
    // Mise à jour de la barre de progression (pourcentage)
    const bar = document.getElementById('progressFill');
    bar.style.width = data.pourcentage + "%";
    bar.innerText = data.pourcentage + "%";
    
    // Mention automatique
    document.getElementById('displayMention').innerText = 
        data.pourcentage >= 60 ? "Mention: Distinction ✨" : "Mention: Satisfaction";

    // Affichage des notes (récupérées de la base "Notes")
    const details = document.getElementById('notesDetails');
    details.innerHTML = `
        <div style="border-top: 1px solid #ccc; padding-top: 10px;">
            <p><strong>Mathématiques :</strong> ${data.maths}/10</p>
            <p><strong>Français :</strong> ${data.francais}/10</p>
            <p><strong>Sciences :</strong> ${data.science}/10</p>
        </div>
    `;
}