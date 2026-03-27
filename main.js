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

    // 2. Power Object (3D Bolt) Dynamic Flight Logic
    const energyBolt = document.querySelector(".energy");
    const sections = document.querySelectorAll(".screen-section");
    const footer = document.getElementById("footer");

    if (energyBolt) {
        const updateBolt = () => {
            let active = null, minD = Infinity, cy = window.innerHeight / 2;
            let activeIndex = 0;

            // 1. Detección de dispositivo móvil (Ancho menor a 768px)
            const isMobile = window.innerWidth < 768;

            // Check final de página (Footer) - Sin cambios
            const isNearBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 100);

            if (isNearBottom && footer) {
                const logo = footer.querySelector(".logo");
                if (logo) {
                    const r = logo.getBoundingClientRect();
                    energyBolt.style.transform = `translate3d(${r.left + r.width / 2}px, ${r.top - 60}px, 0) translate(-50%, -50%) scale(0.9) rotate(0deg)`;
                    energyBolt.classList.remove('energy-mode-danger');
                    energyBolt.classList.add('energy-mode-standard');
                }
                return;
            }

            // Identificar sección activa
            sections.forEach((sec, index) => {
                const r = sec.getBoundingClientRect();
                const d = Math.abs(r.top + r.height / 2 - cy);
                if (d < minD) { minD = d; active = sec; activeIndex = index; }
            });

            if (active) {
                const txt = active.querySelector("h1, h2");
                if (txt) {
                    const r = txt.getBoundingClientRect();

                    // --- LÓGICA MÓVIL ACTUALIZADA ---
                    // Si es móvil, SIEMPRE se centra arriba. Si es PC, solo en Hero y Solución.
                    const isCenteredAbove = isMobile || active.id === "hero" || active.id === "solution";

                    let xPos, yPos, rotation, scale;

                    if (isCenteredAbove) {
                        // Posición: Centrado horizontalmente sobre el título
                        xPos = r.left + (r.width / 2);
                        // Elevación: Un poco más arriba en móvil para no tapar el texto
                        yPos = isMobile ? r.top - 60 : r.top - 80;
                        rotation = 0;
                        scale = isMobile ? 0.9 : 1.1; // Un poco más pequeño en móvil para que no sea invasivo
                    } else {
                        // Comportamiento Lateral (Solo en PC para Problema y Precios)
                        const isRightSide = activeIndex % 2 !== 0;
                        xPos = isRightSide ? r.right + 25 : r.left - 45;
                        yPos = r.top + (r.height / 2);
                        rotation = isRightSide ? 15 : -15;
                        scale = 0.85;
                    }

                    energyBolt.style.transform = `translate3d(${xPos}px, ${yPos}px, 0) translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;

                    // Cambio de color (Problema = Rojo)
                    if (active.id === 'problem') {
                        energyBolt.classList.add('energy-mode-danger');
                        energyBolt.classList.remove('energy-mode-standard');
                    } else {
                        energyBolt.classList.add('energy-mode-standard');
                        energyBolt.classList.remove('energy-mode-danger');
                    }
                }
            }
        };

        window.addEventListener("scroll", updateBolt, { passive: true });
        window.addEventListener("resize", updateBolt, { passive: true });
        updateBolt();
    }

    // 3. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener("click", e => {
            e.preventDefault();
            const t = document.getElementById(a.getAttribute("href").substring(1));
            if (t) window.scrollTo({ top: t.offsetTop - 30, behavior: "smooth" });
        });
    });

    // 4. Parallax Bloom Effect
    const blobs = document.querySelectorAll('.blob');
    if (blobs.length === 3) {
        window.addEventListener('mousemove', e => {
            const x = (e.clientX - window.innerWidth / 2) / 15, y = (e.clientY - window.innerHeight / 2) / 15;
            blobs[0].style.transform = `translate3d(${x * 1.2}px, ${y * 1.2}px, 0)`;
            blobs[1].style.transform = `translate3d(${x * -1.8}px, ${y * -1.8}px, 0)`;
            blobs[2].style.transform = `translate3d(${x * 2.5}px, ${y * 2.5}px, 0)`;
        }, { passive: true });
    }

    // 5. Navbar Compacto
    const nav = document.getElementById('nav');
    const hero = document.getElementById('hero');
    if (nav && hero) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('nav-compact', window.scrollY > hero.offsetHeight - 80);
        }, { passive: true });
    }

    // 6. Calculadora de Presupuesto (Versión Profesional)
    const typeBtns = document.querySelectorAll(".type-btn");
    const budgetInput = document.getElementById("budgetInput");
    const budgetHint = document.getElementById("budgetHint");
    const resultIcon = document.getElementById("resultIcon");
    const title = document.getElementById("resultTitle");
    const text = document.getElementById("resultText");
    const longDesc = document.getElementById("resultLongDesc");
    const btn = document.getElementById("budgetBtn");

    const webConfigs = {
        "1": {
            t: "Web básica",
            s: "Ideal para tener presencia en internet.",
            l: "Tarjeta de presentación digital con información esencial, ubicación y contacto directo.",
            i: "article",
            minIdeal: 150, maxIdeal: 350
        },
        "2": {
            t: "Landing interactiva",
            s: "Perfecta para captar clientes y mensajes.",
            l: "Diseño de una sola página enfocado en ventas, con botones de acción y optimización para anuncios.",
            i: "rocket_launch",
            minIdeal: 250, maxIdeal: 550
        },
        "3": {
            t: "Web completa",
            s: "Estructura profesional multi-sección.",
            l: "Estructura robusta con varias secciones, galería de servicios y preparada para posicionarse en Google.",
            i: "business",
            minIdeal: 400, maxIdeal: 900
        }
    };

    let currentType = "1";

    function updateCalculator() {
        const config = webConfigs[currentType];
        const budget = parseInt(budgetInput.value) || 0;

        // Actualizar Textos e Icono
        title.textContent = config.t;
        text.textContent = config.s;
        longDesc.textContent = config.l;
        resultIcon.textContent = config.i;

        // --- Lógica de Alerta Visual (NUEVO) ---
        if (budget > 2000) {
            budgetInput.classList.add("input-danger");
            budgetHint.textContent = "Para proyectos mayores a S/ 2000, solicite una asesoría personalizada.";
            budgetHint.style.color = "#ff4d4d";
        } else {
            budgetInput.classList.remove("input-danger");

            // Validación de Rangos Estándar
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

        // Actualizar enlace de WhatsApp
        const message = `Hola WebsVoltio, me interesa una ${config.t}. Mi presupuesto estimado es de S/ ${budget}.`;
        btn.href = `https://wa.me/51970597061?text=${encodeURIComponent(message)}`;
    }

    // Eventos
    typeBtns.forEach(b => {
        b.addEventListener("click", () => {
            typeBtns.forEach(btn => btn.classList.remove("active"));
            b.classList.add("active");
            currentType = b.dataset.type;
            updateCalculator();
        });
    });

    budgetInput.addEventListener("input", updateCalculator);

    // Inicializar al cargar
    updateCalculator();

    // 7. Marquee
    const marquee = document.querySelector('.trust-marquee');
    if (marquee) {
        const group = marquee.querySelector('.marquee-group');
        marquee.appendChild(group.cloneNode(true));
    }

    // Navegación Secuencial Robusta
    const btnNext = document.getElementById('nextSection');
    const btnPrev = document.getElementById('prevSection');
    const sectionIds = ['hero', 'problem', 'solution', 'phases', 'footer'];

    function updateNavVisibility() {
        const scrollPos = window.scrollY;
        const windowHeight = window.innerHeight;
        const sectionsArr = sectionIds.map(id => document.getElementById(id));

        // Encontrar índice de la sección que ocupa la mayor parte de la pantalla
        let currentIdx = sectionsArr.findIndex(sec => {
            if (!sec) return false;
            const rect = sec.getBoundingClientRect();
            return rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2;
        });

        if (currentIdx === -1) return;

        // Ocultar flecha arriba en la primera sección
        if (currentIdx === 0) {
            btnPrev?.classList.add('hidden');
        } else {
            btnPrev?.classList.remove('hidden');
        }

        // Ocultar flecha abajo en la última sección
        if (currentIdx === sectionIds.length - 1) {
            btnNext?.classList.add('hidden');
        } else {
            btnNext?.classList.remove('hidden');
        }
    }

    function navigate(direction) {
        const sectionsArr = sectionIds.map(id => document.getElementById(id));
        const windowHeight = window.innerHeight;

        // Encontrar dónde estamos ahora
        let currentIdx = sectionsArr.findIndex(sec => {
            const rect = sec.getBoundingClientRect();
            return rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2;
        });

        let targetIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;

        // Validar límites
        if (targetIdx >= 0 && targetIdx < sectionsArr.length) {
            const targetSec = sectionsArr[targetIdx];
            if (targetSec) {
                // El offset de -60 es para no quedar tapado por el navbar
                window.scrollTo({
                    top: targetSec.offsetTop - 60,
                    behavior: 'smooth'
                });
            }
        }
    }

    btnNext?.addEventListener('click', () => navigate('next'));
    btnPrev?.addEventListener('click', () => navigate('prev'));
    window.addEventListener('scroll', updateNavVisibility, { passive: true });

    // Ejecutar una vez al cargar
    updateNavVisibility();
});