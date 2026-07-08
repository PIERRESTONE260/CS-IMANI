document.addEventListener('DOMContentLoaded', () => {
    const filterInput = document.getElementById('filterAdmis');
    
    if (filterInput) {
        filterInput.addEventListener('keyup', () => {
            const value = filterInput.value.toLowerCase();
            const rows = document.querySelectorAll('#admisTable tbody tr');

            rows.forEach(row => {
                const name = row.cells[0].textContent.toLowerCase();
                row.style.display = name.includes(value) ? '' : 'none';
            });
        });
    }
});