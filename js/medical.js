document.getElementById('medicalForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var btn = document.getElementById('btnSubmitMedical');
    btn.disabled = true;
    btn.textContent = "Transmission en cours...";

    // Récupération des cases cochées pour les maladies d'enfance
    var maladiesCochees = [];
    document.querySelectorAll('input[name="maladie"]:checked').forEach(function(checkbox) {
        maladiesCochees.push(checkbox.value);
    });

    // Récupération du bouton radio pour l'asthme
    var asthmatiqueVal = "";
    var asthmatiqueRadio = document.querySelector('input[name="asthmatique"]:checked');
    if (asthmatiqueRadio) {
        asthmatiqueVal = asthmatiqueRadio.value;
    }

    // Gestion de la photo passeport (Conversion en Base64)
    var photoInput = document.getElementById('photoPasseport');
    var file = photoInput.files[0];

    if (file) {
        var reader = new FileReader();
        reader.onloadfunction = function(uploadEvent) {
            var base64Image = uploadEvent.target.result;
            envoyerDonneesMedicales(base64Image, maladiesCochees, asthmatiqueVal);
        };
        reader.readAsDataURL(file);
    } else {
        envoyerDonneesMedicales("", maladiesCochees, asthmatiqueVal);
    }
});

function envoyerDonneesMedicales(photoBase64, maladies, asthmatiqueVal) {
    var donnees = {
        nom: document.getElementById('nom').value.trim(),
        prenom: document.getElementById('prenom').value.trim(),
        classe: document.getElementById('classeEleve') ? document.getElementById('classeEleve').value.trim() : "Divers", // Assure-toi d'avoir un champ classe ou adapte selon ton input
        dateNaissance: document.getElementById('dateNaissance').value,
        lieuNaissance: document.getElementById('lieuNaissance').value.trim(),
        sexe: document.getElementById('sexe').value,
        groupeSanguin: document.getElementById('groupeSanguin').value,
        taille: document.getElementById('taille').value.trim(),
        poids: document.getElementById('poids').value.trim(),
        constitution: document.getElementById('constitution').value.trim(),
        appareilPulmonaire: document.getElementById('appareilPulmonaire').value.trim(),
        appareilCardio: document.getElementById('appareilCardio').value.trim(),
        pipiAuLit: document.getElementById('pipiAuLit').value,
        maladies: maladies,
        vaccinations: document.getElementById('vaccinations').value.trim(),
        traitementCours: document.getElementById('traitementCours').value.trim(),
        asthmatique: asthmatiqueVal,
        allergies: document.getElementById('allergies').value.trim(),
        regimeAlimentaire: document.getElementById('regimeAlimentaire').value.trim(),
        soinsJournaliers: document.getElementById('soinsJournaliers').value.trim(),
        contreIndications: document.getElementById('contreIndications').value.trim(),
        photoBase64: photoBase64
    };

    // Remplace l'URL ci-dessous par l'URL de ton application Web déployée sur Google Apps Script
    var urlAPI = "https://script.google.com/macros/s/AKfycbzOgGy6-UmCWSOS2zlwkGR_zwOOwYcLqo2r8ArIlxlGX6TQNf-R23HZWp9LZoRHp_E/exec";

    fetch(urlAPI, {
        method: "POST",
        mode: "no-cors", // Nécessaire pour les requêtes Apps Script depuis une page web externe
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(donnees)
    })
    .then(response => {
        alert("Fiche médicale transmise et enregistrée avec succès !");
        document.getElementById('medicalForm').reset();
        var btn = document.getElementById('btnSubmitMedical');
        btn.disabled = false;
        btn.textContent = "Enregistrer et Transmettre la Fiche Médicale";
    })
    .catch(error => {
        console.error("Erreur:", error);
        alert("Une erreur est survenue lors de l'envoi de la fiche.");
        var btn = document.getElementById('btnSubmitMedical');
        btn.disabled = false;
        btn.textContent = "Enregistrer et Transmettre la Fiche Médicale";
    });
}