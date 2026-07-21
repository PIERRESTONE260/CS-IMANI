document.addEventListener('DOMContentLoaded', () => {
    // Lien de publication CSV de votre Google Sheet reliée aux inscriptions
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSnehMzrPtz_JWvIUzyhY93nQC4Lm15gNB3YvMPXXw2zYPVeb04tKeIpCmTbxU5on8-gcY5AOkz_CXf/pub?gid=0&single=true&output=csv";

    const tbody = document.getElementById('admisBody');

    fetch(csvUrl)
        .then(response => {
            if (!response.ok) throw new Error("Erreur de chargement du fichier CSV");
            return response.text();
        })
        .then(data => {
            // Découpage par ligne et suppression de la première ligne (les en-têtes)
            const rows = data.split('\n').map(row => row.trim()).filter(row => row.length > 0);
            const dataRows = rows.slice(1); 

            tbody.innerHTML = ""; // Nettoyage préalable

            if (dataRows.length === 0) {
                tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Aucun admis enregistré pour le moment.</td></tr>`;
                return;
            }

            dataRows.forEach(row => {
                // Gestion basique de séparation des colonnes par virgule
                const cols = row.split(',').map(col => col.replace(/^["'](.*)["']$/, '$1').trim());
                
                // On s'assure qu'on a assez de colonnes (ex: Horodatage, Nom, Option, Classe -> 4 colonnes minimum)
                if (cols.length >= 4 && cols[1] !== "") {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${cols[1]}</td> <!-- Nom de l'élève (colonne 2 du tableur) -->
                        <td>${cols[2]}</td> <!-- Option (colonne 3 du tableur) -->
                        <td>${cols[3]}</td> <!-- Classe (colonne 4 du tableur) -->
                    `;
                    tbody.appendChild(tr);
                }
            });
        })
        .catch(err => {
            console.warn("Impossible de récupérer la liste des admis :", err);
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: red;">Erreur de connexion aux données.</td></tr>`;
        });

    // Fonction de filtrage instantané connectée à l'input
    const filterInput = document.getElementById('filterAdmis');
    if (filterInput) {
        filterInput.addEventListener('keyup', () => {
            const value = filterInput.value.toLowerCase();
            const rows = document.querySelectorAll('#admisBody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(value) ? '' : 'none';
            });
        });
    }
});