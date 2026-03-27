document.addEventListener("DOMContentLoaded", () => {
    // 1. Intersection Observer for 3D Reveals
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("active");
                observer.unobserve(e.target);
            }
        });
    }, { root: null, rootMargin: "-50px 0px", threshold: 0.15 });
    document.querySelectorAll(".reveal-3d").forEach(el => observer.observe(el));

    // --- VARIABLES GLOBALES PARA EVENTOS ---
    const nav = document.getElementById('nav');
    const hero = document.getElementById('hero');
    const energyBolt = document.querySelector(".energy");
    const sections = Array.from(document.querySelectorAll(".screen-section"));
    const footer = document.getElementById("footer");

    // Navegación móvil
    const btnNext = document.getElementById('nextSection');
    const btnPrev = document.getElementById('prevSection');
    const sectionIds = ['hero', 'problem', 'solution', 'phases', 'footer'];
    const sectionsArr = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

    // 2. CENTRALIZACIÓN DE EVENTOS SCROLL (Performance Optimizado)
    let isScrolling = false;

    function onScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                updateScrollTasks();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    function updateScrollTasks() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const cy = windowHeight / 2;
        const isMobile = window.innerWidth < 768;

        // A. Navbar Compacto
        if (nav && hero) {
            nav.classList.toggle('nav-compact', scrollY > hero.offsetHeight - 80);
        }

        // B. Identificar Sección Activa Globalmente
        let activeIndex = -1;
        let activeSec = null;
        let minD = Infinity;

        sections.forEach((sec, index) => {
            const r = sec.getBoundingClientRect();
            const d = Math.abs(r.top + r.height / 2 - cy);
            if (d < minD) { minD = d; activeSec = sec; activeIndex = index; }
        });

        // C. Lógica del Rayo 3D
        if (energyBolt) {
            const isNearBottom = (windowHeight + scrollY) >= (document.documentElement.scrollHeight - 100);

            if (isNearBottom && footer) {
                const logo = footer.querySelector(".logo");
                if (logo) {
                    const r = logo.getBoundingClientRect();
                    energyBolt.style.transform = `translate3d(${r.left + r.width / 2}px, ${r.top - 60}px, 0) translate(-50%, -50%) scale(0.9) rotate(0deg)`;
                    energyBolt.classList.replace('energy-mode-danger', 'energy-mode-standard');
                }
            } else if (activeSec) {
                const txt = activeSec.querySelector("h1, h2");
                if (txt) {
                    const r = txt.getBoundingClientRect();
                    const isCenteredAbove = isMobile || activeSec.id === "hero" || activeSec.id === "solution";

                    let xPos = isCenteredAbove ? r.left + (r.width / 2) : (activeIndex % 2 !== 0 ? r.right + 25 : r.left - 45);
                    let yPos = isCenteredAbove ? (isMobile ? r.top - 60 : r.top - 80) : r.top + (r.height / 2);
                    let rotation = isCenteredAbove ? 0 : (activeIndex % 2 !== 0 ? 15 : -15);
                    let scale = isCenteredAbove ? (isMobile ? 0.9 : 1.1) : 0.85;

                    energyBolt.style.transform = `translate3d(${xPos}px, ${yPos}px, 0) translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
                }

                // Cambio de color independizado del texto
                if (activeSec.id === 'problem') {
                    energyBolt.classList.add('energy-mode-danger');
                    energyBolt.classList.remove('energy-mode-standard');
                } else {
                    energyBolt.classList.add('energy-mode-standard');
                    energyBolt.classList.remove('energy-mode-danger');
                }
            }
        }

        // D. Lógica de Navegación Móvil (Visibilidad)
        let navCurrentIdx = sectionsArr.findIndex(sec => {
            const rect = sec.getBoundingClientRect();
            return rect.top <= cy && rect.bottom >= cy;
        });

        if (navCurrentIdx !== -1) {
            btnPrev?.classList.toggle('hidden', navCurrentIdx === 0);
            btnNext?.classList.toggle('hidden', navCurrentIdx === sectionsArr.length - 1);
        }
    }

    // 3. Smooth Scrolling General
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener("click", e => {
            e.preventDefault();
            const t = document.getElementById(a.getAttribute("href").substring(1));
            if (t) window.scrollTo({ top: t.offsetTop - 30, behavior: "smooth" });
        });
    });

    // 4. Parallax Bloom Effect (Optimizado con rAF)
    const blobs = document.querySelectorAll('.blob');
    if (blobs.length === 3) {
        let mouseTicking = false;
        window.addEventListener('mousemove', e => {
            if (!mouseTicking) {
                window.requestAnimationFrame(() => {
                    const x = (e.clientX - window.innerWidth / 2) / 15;
                    const y = (e.clientY - window.innerHeight / 2) / 15;
                    blobs[0].style.transform = `translate3d(${x * 1.2}px, ${y * 1.2}px, 0)`;
                    blobs[1].style.transform = `translate3d(${x * -1.8}px, ${y * -1.8}px, 0)`;
                    blobs[2].style.transform = `translate3d(${x * 2.5}px, ${y * 2.5}px, 0)`;
                    mouseTicking = false;
                });
                mouseTicking = true;
            }
        }, { passive: true });
    }

    // 5. Calculadora de Presupuesto (Lógica intacta)
    const typeBtns = document.querySelectorAll(".type-btn");
    const budgetInput = document.getElementById("budgetInput");
    const budgetHint = document.getElementById("budgetHint");
    const resultIcon = document.getElementById("resultIcon");
    const title = document.getElementById("resultTitle");
    const text = document.getElementById("resultText");
    const longDesc = document.getElementById("resultLongDesc");
    const btn = document.getElementById("budgetBtn");

    const webConfigs = {
        "1": { t: "Web básica", s: "Ideal para tener presencia en internet.", l: "Tarjeta de presentación digital con información esencial, ubicación y contacto directo.", i: "article", minIdeal: 150, maxIdeal: 350 },
        "2": { t: "Landing interactiva", s: "Perfecta para captar clientes y mensajes.", l: "Diseño de una sola página enfocado en ventas, con botones de acción y optimización para anuncios.", i: "rocket_launch", minIdeal: 250, maxIdeal: 550 },
        "3": { t: "Web completa", s: "Estructura profesional multi-sección.", l: "Estructura robusta con varias secciones, galería de servicios y preparada para posicionarse en Google.", i: "business", minIdeal: 400, maxIdeal: 900 }
    };

    let currentType = "1";

    function updateCalculator() {
        if (!budgetInput) return; // Evita errores si no existe en pantalla
        const config = webConfigs[currentType];
        const budget = parseInt(budgetInput.value) || 0;

        title.textContent = config.t;
        text.textContent = config.s;
        longDesc.textContent = config.l;
        resultIcon.textContent = config.i;

        if (budget > 2000) {
            budgetInput.classList.add("input-danger");
            budgetHint.textContent = "Para proyectos mayores a S/ 2000, solicite una asesoría personalizada.";
            budgetHint.style.color = "#ff4d4d";
        } else {
            budgetInput.classList.remove("input-danger");
            if (budget < 150) {
                budgetHint.textContent = "El monto mínimo de inversión es S/ 150.";
                budgetHint.style.color = "#ff4d4d";
            } else if (budget < config.minIdeal) {
                budgetHint.textContent = `Para una ${config.t}, el rango ideal es entre S/ ${config.minIdeal} y S/ ${config.maxIdeal}.`;
                budgetHint.style.color = "var(--text-dark)";
            } else {
                budgetHint.textContent = "Presupuesto óptimo para los resultados esperados.";
                budgetHint.style.color = "#00ffd0";
            }
        }
        btn.href = `https://wa.me/51970597061?text=${encodeURIComponent(`Hola WebsVoltio, me interesa una ${config.t}. Mi presupuesto estimado es de S/ ${budget}.`)}`;
    }

    typeBtns.forEach(b => {
        b.addEventListener("click", () => {
            typeBtns.forEach(btn => btn.classList.remove("active"));
            b.classList.add("active");
            currentType = b.dataset.type;
            updateCalculator();
        });
    });

    budgetInput?.addEventListener("input", updateCalculator);

    // 6. Navegación por flechas (Acciones de clic)
    function navigate(direction) {
        const windowHeight = window.innerHeight;
        let currentIdx = sectionsArr.findIndex(sec => {
            const rect = sec.getBoundingClientRect();
            return rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2;
        });

        let targetIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;
        if (targetIdx >= 0 && targetIdx < sectionsArr.length) {
            const targetSec = sectionsArr[targetIdx];
            if (targetSec) window.scrollTo({ top: targetSec.offsetTop - 60, behavior: 'smooth' });
        }
    }

    btnNext?.addEventListener('click', () => navigate('next'));
    btnPrev?.addEventListener('click', () => navigate('prev'));

    // 7. Marquee Bucle
    const marquee = document.querySelector('.trust-marquee');
    if (marquee) {
        const group = marquee.querySelector('.marquee-group');
        marquee.appendChild(group.cloneNode(true));
    }

    // Inicializaciones
    updateScrollTasks();
    updateCalculator();
});