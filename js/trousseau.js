document.addEventListener('DOMContentLoaded', () => {
    const classeSelect = document.getElementById('classe-select');
    const optionContainer = document.getElementById('option-container');
    const optionSelect = document.getElementById('option-select');
    const btnTelecharger = document.getElementById('btn-telecharger');

    // Gestion de l'affichage du menu "Option" selon la classe choisie
    classeSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        
        // Si la valeur commence par 'sec' (Secondaire), on affiche le choix des options
        if (value.startsWith('sec')) {
            optionContainer.style.display = 'block';
        } else {
            optionContainer.style.display = 'none';
        }
    });

    // Logique de téléchargement
    btnTelecharger.addEventListener('click', () => {
        const classe = classeSelect.value;
        const option = optionSelect.value;

        if (!classe) {
            alert("Veuillez sélectionner une classe.");
            return;
        }

        // Mapping des noms de fichiers selon vos spécifications
        const mapping = {
            'mat1': 'trousseau_1er_maternelle',
            'mat2': 'trousseau_2em_maternelle',
            'mat3': 'trousseau_3em_maternelle',
            'pri1': 'trousseau_1er_primaire',
            'pri2': 'trousseau_2em_primaire',
            'pri3': 'trousseau_3em_primaire',
            'pri4': 'trousseau_4em_primaire',
            'pri5': 'trousseau_5em_primaire',
            'pri6': 'trousseau_6em_primaire',
            'eb7': 'trousseau_7em_eb',
            'eb8': 'trousseau_8em_eb',
            'sec1': `trousseau_1er_secondaire_${option}`,
            'sec2': `trousseau_2em_secondaire_${option}`,
            'sec3': `trousseau_3em_secondaire_${option}`,
            'sec4': `trousseau_4em_secondaire_${option}`
        };

        const fileName = mapping[classe] ? `docs/${mapping[classe]}.pdf` : `docs/trousseau_${classe}.pdf`;

        // Action de téléchargement
        const a = document.createElement("a");
        a.href = fileName;
        a.download = fileName.split('/').pop(); // Nom du fichier pour le téléchargement
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});