document.addEventListener('DOMContentLoaded', () => {
    // Remplacez par votre lien de publication CSV
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSnehMzrPtz_JWvIUzyhY93nQC4Lm15gNB3YvMPXXw2zYPVeb04tKeIpCmTbxU5on8-gcY5AOkz_CXf/pub?gid=0&single=true&output=csv";

    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').slice(1); // On ignore la première ligne (les titres)
            const tbody = document.getElementById('admisBody');
            
            rows.forEach(row => {
                const cols = row.split(',');
                if (cols.length >= 3) {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${cols[0]}</td><td>${cols[1]}</td><td>${cols[2]}</td>`;
                    tbody.appendChild(tr);
                }
            });
        });

    // Fonction de filtrage (reste inchangée)
    const filterInput = document.getElementById('filterAdmis');
    filterInput.addEventListener('keyup', () => {
        const value = filterInput.value.toLowerCase();
        const rows = document.querySelectorAll('#admisBody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(value) ? '' : 'none';
        });
    });
});