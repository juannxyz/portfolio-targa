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
    const processPath = document.querySelector("#cPath");
    const processMaskPath = document.querySelector("#cPathMask");
    const processSvg = document.querySelector("#cSvg");
    const chartWrap = document.querySelector(".chart-wrap");
    const bird = document.querySelector("#bird");
    const processSteps = document.querySelectorAll(".process-step");
    const processTicks = document.querySelectorAll("[data-tick]");
    const curveArrow = document.querySelector("#curveArrow");

    const STEP_THRESHOLDS = [0.02, 0.35, 0.58, 0.82];
    const TICK_THRESHOLDS = [0.35, 0.58, 0.82, 0.9];

    let ticking = false;
    let processPathLength = 0;

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

    function setupProcessPath() {
        if (!processPath || !processMaskPath) {
            return;
        }

        processPathLength = processPath.getTotalLength();
        processMaskPath.style.strokeDasharray = `${processPathLength} ${processPathLength}`;
        processMaskPath.style.strokeDashoffset = String(processPathLength);
    }

    function getProcessProgress() {
        if (!processRoot) {
            return 0;
        }

        const rect = processRoot.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const scrollable = processRoot.offsetHeight * 0.75;
        const scrolled = (viewportHeight * 0.65) - rect.top;

        return clamp(scrolled / scrollable, 0, 1);
    }

    function placeBird(progress) {
        if (!processPath || !processSvg || !chartWrap || !bird || !processPathLength) {
            return;
        }

        const point = processPath.getPointAtLength(processPathLength * progress);
        const svgRect = processSvg.getBoundingClientRect();
        const wrapRect = chartWrap.getBoundingClientRect();
        const viewBox = processSvg.viewBox.baseVal;

        if (!svgRect.width || !svgRect.height || !viewBox.width || !viewBox.height) {
            return;
        }

        const scaleX = svgRect.width / viewBox.width;
        const scaleY = svgRect.height / viewBox.height;
        const birdX = svgRect.left - wrapRect.left + (point.x * scaleX);
        const birdY = svgRect.top - wrapRect.top + (point.y * scaleY);

        bird.style.left = `${birdX}px`;
        bird.style.top = `${birdY}px`;
        bird.style.opacity = progress > 0.01 ? "1" : "0";
    }

    function updateProcessProgress() {
        if (!processRoot || !processPath || !processMaskPath) {
            return;
        }

        if (!processPathLength) {
            setupProcessPath();
        }

        const progress = getProcessProgress();

        processMaskPath.style.strokeDashoffset = String(processPathLength * (1 - progress));
        placeBird(progress);

        processSteps.forEach((step, index) => {
            step.classList.toggle("on", progress >= STEP_THRESHOLDS[index]);
        });

        processTicks.forEach((tick, index) => {
            tick.classList.toggle("on", progress >= TICK_THRESHOLDS[index]);
        });

        if (curveArrow) {
            curveArrow.style.opacity = String(clamp((progress - 0.88) / 0.12, 0, 1));
        }
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

        setupProcessPath();
        requestScrollUpdate();
    });

    setupReveal();
    setMenuState(false);
    setupProcessPath();
    updateScrollEffects();
})();
