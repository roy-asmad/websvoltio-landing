document.addEventListener("DOMContentLoaded", () => {
  console.log("WebsVoltio Premium: Iniciado.");

  /* ================= ANIMACIONES DE SCROLL ================= */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  /* ================= ACORDEÓN DE PREGUNTAS FRECUENTES ================= */
  const faqSummaries = document.querySelectorAll('.faq-summary');
  
  faqSummaries.forEach(summary => {
    summary.addEventListener('click', () => {
      const item = summary.parentElement;
      
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      item.classList.toggle('active');
    });
  });

  /* ================= BOTÓN FLOTANTE "VOLVER ARRIBA" ================= */
  const btnTop = document.getElementById('btn-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btnTop.classList.add('show');
    } else {
      btnTop.classList.remove('show');
    }
  });

  if (btnTop) {
    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ================= CARRUSEL: INTERACCIÓN Y DIFUMINADOS ================= */
  const track = document.getElementById('portfolio-track');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  if (track) {
    const wrapper = track.closest('.carousel-wrapper');
    
    const updateCarouselUI = () => {
      if (track.scrollLeft <= 20) {
        wrapper.classList.remove('show-left');
        if (btnPrev) { btnPrev.style.opacity = '0'; btnPrev.style.pointerEvents = 'none'; }
      } else {
        wrapper.classList.add('show-left');
        if (btnPrev) { btnPrev.style.opacity = '1'; btnPrev.style.pointerEvents = 'auto'; }
      }
      
      if (Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth - 2) {
        wrapper.classList.remove('show-right');
        if (btnNext) { btnNext.style.opacity = '0'; btnNext.style.pointerEvents = 'none'; }
      } else {
        wrapper.classList.add('show-right');
        if (btnNext) { btnNext.style.opacity = '1'; btnNext.style.pointerEvents = 'auto'; }
      }
    };

    updateCarouselUI();
    track.addEventListener('scroll', updateCarouselUI);

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        track.scrollBy({ left: 380, behavior: 'smooth' });
      });
    }
    
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        track.scrollBy({ left: -380, behavior: 'smooth' });
      });
    }
  }
});