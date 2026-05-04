(() => {
    const nav = document.querySelector(".nav");
    const navToggle = document.querySelector("[data-nav-toggle]");
    const navMenu = document.querySelector("[data-nav-menu]");
    const navToggleIcon = navToggle ? navToggle.querySelector("i") : null;
    const navLinks = document.querySelectorAll(".nav__link");
    const revealElements = document.querySelectorAll(".reveal");
    const aboutSection = document.querySelector(".about-section");
    const aboutCards = document.querySelectorAll(".about-card[data-speed]");
    const processRoot = document.querySelector("[data-process-root]");

    let ticking = false;

    function setMenuState(isOpen) {
        if (!nav || !navToggle || !navMenu) {
            return;
        }

        nav.classList.toggle("is-open", isOpen);
        navToggle.setAttribute("aria-expanded", String(isOpen));

        if (navToggleIcon) {
            navToggleIcon.classList.toggle("fa-bars", !isOpen);
            navToggleIcon.classList.toggle("fa-xmark", isOpen);
        }
    }

    function setupReveal() {
        revealElements.forEach((element, index) => {
            element.style.setProperty("--reveal-order", String(index % 3));
        });

        if (!("IntersectionObserver" in window)) {
            revealElements.forEach((element) => {
                element.classList.add("is-visible");
            });

            return;
        }

        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                currentObserver.unobserve(entry.target);
            });
        }, {
            threshold: 0.16
        });

        revealElements.forEach((element) => {
            observer.observe(element);
        });
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function updateParallax() {
        if (!aboutSection || !aboutCards.length) {
            return;
        }

        const rect = aboutSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
        const centeredProgress = (progress - 0.5) * 2;
        const amplitude = viewportWidth < 430 ? 110 : viewportWidth < 768 ? 160 : 280;

        aboutCards.forEach((card) => {
            const speed = Number(card.dataset.speed) || 0;
            const y = centeredProgress * speed * amplitude;
            card.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
        });
    }

    function updateProcessProgress() {
        if (!processRoot) {
            return;
        }

        const rect = processRoot.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height * 0.2), 0, 1);
        processRoot.style.setProperty("--process-progress", progress.toFixed(3));
    }

    function updateScrollEffects() {
        updateParallax();
        updateProcessProgress();
        ticking = false;
    }

    function requestScrollUpdate() {
        if (ticking) {
            return;
        }

        ticking = true;
        window.requestAnimationFrame(updateScrollEffects);
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                setMenuState(false);
            }
        });
    });

    if (navToggle) {
        navToggle.addEventListener("click", () => {
            const isOpen = navToggle.getAttribute("aria-expanded") === "true";
            setMenuState(!isOpen);
        });
    }

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            setMenuState(false);
        }

        requestScrollUpdate();
    });

    setupReveal();
    setMenuState(false);
    updateScrollEffects();
})();