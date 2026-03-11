document.addEventListener("DOMContentLoaded", () => {
  console.log("WebsVoltio Premium: Iniciado.");

  // Animaciones de Scroll (Fade-in)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});