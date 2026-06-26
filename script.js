
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(() => console.log("Service Worker enregistré avec succès !"))
    .catch((err) => console.log("Erreur d'enregistrement du SW:", err));
}

// 1. CONFIGURATION - Remplacez par l'URL que vous avez obtenue à l'étape 1
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzEmfk3dUB8VS-xZu-rzvBHSMhO3Q2xHiziF49omT-CjxoYjSjX_vlrVtNENnRtfzyd/exec";

// 2. NAVIGATION ENTRE LES PAGES
function showPage(pageId) {
    // Cache toutes les pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // Affiche la page demandée
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        // Remonte en haut de page automatiquement
        window.scrollTo(0, 0);
    }
}

// 3. GESTION DE L'INSCRIPTION (Envoi vers Google Sheets)
const enrollmentForm = document.getElementById('enrollmentForm');

if (enrollmentForm) {
    enrollmentForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Empêche le rechargement de la page

        const submitBtn = enrollmentForm.querySelector('.btn-submit');
        submitBtn.innerText = "Envoi en cours...";
        submitBtn.disabled = true;

        // Récupération des données du formulaire
        const formData = {
            nomEleve: document.getElementById('nomEleve').value,
            option: document.getElementById('option').value,
            classe: document.getElementById('classe').value,
            nomParent: document.getElementById('nomParent').value,
            telephone: document.getElementById('telephone').value,
            idPaiement: document.getElementById('idPaiement').value
        };

        // Envoi des données via FETCH
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Important pour Google Apps Script
            cache: 'no-cache',
            body: JSON.stringify(formData)
        })
        .then(() => {
            alert("Félicitations ! L'inscription pour " + formData.nomEleve + " a été envoyée avec succès.");
            enrollmentForm.reset();
            showPage('home'); // Retour à l'accueil
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert("Une erreur est survenue lors de l'envoi.");
        })
        .finally(() => {
            submitBtn.innerText = "Envoyer l'inscription";
            submitBtn.disabled = false;
        });
    });
}

// 4. LOGIQUE DYNAMIQUE DES RÉSULTATS (Animation)
function verifierResultats() {
    const searchId = document.getElementById('searchId').value;
    const resultBox = document.getElementById('resultBox');
    const progressBar = document.getElementById('progressBar');
    const resNom = document.getElementById('resNom');
    const resMention = document.getElementById('resMention');

    if (searchId.trim() === "") {
        alert("Veuillez entrer un identifiant.");
        return;
    }

    // On montre la boîte et on réinitialise l'animation
    resultBox.classList.remove('hidden');
    progressBar.style.width = "0%";
    progressBar.innerText = "0%";
    resNom.innerText = "Recherche en cours...";
    resMention.innerText = "Veuillez patienter...";

    // Simulation d'une recherche en base de données (1.5 seconde)
    setTimeout(() => {
        // Pour la présentation, on simule un résultat positif
        const score = 78; // Vous pouvez rendre ça aléatoire pour la démo
        
        resNom.innerText = "Élève : " + searchId.toUpperCase();
        progressBar.style.width = score + "%";
        progressBar.innerText = score + "%";
        
        if (score >= 60) {
            resMention.innerText = "Mention : Distinction ✨";
            resMention.style.color = "green";
        } else {
            resMention.innerText = "Mention : Satisfaction";
            resMention.style.color = "orange";
        }
    }, 1500);
}