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

  // Acordeón FAQ Suave
  const faqSummaries = document.querySelectorAll('.faq-summary');
  faqSummaries.forEach(summary => {
    summary.addEventListener('click', () => {
      const item = summary.parentElement;
      // Cerrar otros abiertos (Opcional)
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      // Abrir/Cerrar el actual
      item.classList.toggle('active');
    });
  });

  // Botón Volver Arriba
  const btnTop = document.getElementById('btn-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btnTop.classList.add('show');
    } else {
      btnTop.classList.remove('show');
    }
  });

  btnTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Lógica de flechas para el Carrusel de Portafolio
  const track = document.getElementById('portfolio-track');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  if (track && btnPrev && btnNext) {
    const updateButtons = () => {
      // Ocultar "Anterior" si estamos al inicio
      if (track.scrollLeft <= 0) {
        btnPrev.style.opacity = '0';
        btnPrev.style.pointerEvents = 'none';
      } else {
        btnPrev.style.opacity = '1';
        btnPrev.style.pointerEvents = 'auto';
      }
      
      // Ocultar "Siguiente" si estamos al final (margen de 2px por redondeo)
      if (Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth - 2) {
        btnNext.style.opacity = '0';
        btnNext.style.pointerEvents = 'none';
      } else {
        btnNext.style.opacity = '1';
        btnNext.style.pointerEvents = 'auto';
      }
    };

    // Revisar estado de botones al cargar y al hacer scroll
    updateButtons();
    track.addEventListener('scroll', updateButtons);

    btnNext.addEventListener('click', () => {
      track.scrollBy({ left: 380, behavior: 'smooth' });
    });
    
    btnPrev.addEventListener('click', () => {
      track.scrollBy({ left: -380, behavior: 'smooth' });
    });
  }
});