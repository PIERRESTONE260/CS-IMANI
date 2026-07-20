const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzEmfk3dUB8VS-xZu-rzvBHSMhO3Q2xHiziF49omT-CjxoYjSjX_vlrVtNENnRtfzyd/exec"; // Collez l'URL ici

document.getElementById('enrollmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('btnSubmit');
    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = "Envoi en cours...";

    const data = {
        nomEleve: document.getElementById('nomEleve').value,
        option: document.getElementById('option').value,
        classe: document.getElementById('classe').value,
        nomParent: document.getElementById('nomParent').value,
        telephone: document.getElementById('telephone').value,
        idPaiement: document.getElementById('idPaiement').value
    };

    try {
        // Envoi vers Google Apps Script
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            body: JSON.stringify(data)
        });

        alert("Inscription envoyée avec succès à CS BANZA !");
        e.target.reset();
    } catch (error) {
        alert("Erreur réseau. Vérifiez votre connexion.");
    } finally {
        btn.disabled = false;
        btn.innerText = originalText;
    }
});