document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    // Toggle du menu Mobile
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('open'); // Pour l'animation en X du bouton
    });

    // Fermer le menu si on clique ailleurs
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('open');
        }
    });

    // --- NOUVEL AJOUT : Logique du Carrousel ---
    const slides = document.querySelectorAll('.hero-carousel img');
    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Change d'image toutes les 4 secondes
    if (slides.length > 0) {
        setInterval(nextSlide, 4000);
    }
});

// Enregistrement du Service Worker pour le mode "Application Installable"
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW enregistré !'))
            .catch(err => console.log('Erreur SW:', err));
    });
}