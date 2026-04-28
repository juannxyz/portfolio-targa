const translations = {
    pt: {
        pageTitle: "Jaburu",
        navHome: "HOME",
        navProjects: "PROJETOS",
        navContact: "CONTATO",
        navAbout: "QUEM SOMOS",
        heroBrand: "COM JABURU",
        heroPhrase: "Coisas acontecem",
        heroLogoAlt: "Logo Jaburu",
        footerLogoAlt: "Logo Jaburu menor",
        navMenuLabel: "Abrir menu",
        projectsEyebrow: "Selecao recente",
        projectsTitle: "Projetos",
        projectsLead: "Explore uma selecao dos meus projetos mais recentes. Cada proposta equilibra atmosfera, gesto arquitetonico e funcao com linguagem autoral.",
        projectsPrev: "Projeto anterior",
        projectsNext: "Proximo projeto",
        projectsDots: "Selecao de projetos",
        contactTitleLine1: "Fale conosco",
        contactTitleLine2: "estamos prontos para",
        contactTitleAccent: "te atender.",
        contactLead: "Preencha o formulario ao lado e envie sua mensagem. Responderemos o mais rapido possivel.",
        contactFeature1Title: "Resposta rapida",
        contactFeature1Text: "Fale diretamente com nosso time pelo WhatsApp.",
        contactFeature2Title: "Atendimento seguro",
        contactFeature2Text: "Seus dados estao protegidos e serao usados apenas para contato.",
        contactFeature3Title: "Estamos disponiveis",
        contactFeature3Text: "De segunda a sexta, das 8h as 18h.",
        contactFormTitle: "Envie sua mensagem",
        contactFormSubtitle: "Preencha os campos abaixo e envie sua mensagem.",
        contactNameLabel: "Seu nome",
        contactNamePlaceholder: "Digite seu nome",
        contactPhoneLabel: "Seu contato (WhatsApp)",
        contactPhonePlaceholder: "(11) 99999-9999",
        contactMessageLabel: "Sua mensagem",
        contactMessagePlaceholder: "Escreva sua mensagem aqui...",
        contactSubmit: "Enviar Mensagem pelo WhatsApp",
        contactPrivacy: "Nao armazenamos seus dados. Sua mensagem sera enviada diretamente pelo WhatsApp.",
        aboutEyebrow: "Quem somos",
        aboutTitle: "Arquitetura com direcao, atmosfera e presenca digital."
    },
    en: {
        pageTitle: "Jaburu",
        navHome: "HOME",
        navProjects: "PROJECTS",
        navContact: "CONTACT",
        navAbout: "ABOUT US",
        heroBrand: "WITH JABURU",
        heroPhrase: "Things happen",
        heroLogoAlt: "Jaburu logo",
        footerLogoAlt: "Small Jaburu logo",
        navMenuLabel: "Open menu",
        projectsEyebrow: "Recent selection",
        projectsTitle: "Projects",
        projectsLead: "Explore a selection of recent work shaped by atmosphere, architectural gesture, and function with a stronger visual signature.",
        projectsPrev: "Previous project",
        projectsNext: "Next project",
        projectsDots: "Project selection",
        contactTitleLine1: "Get in touch",
        contactTitleLine2: "we are ready to",
        contactTitleAccent: "support you.",
        contactLead: "Fill in the form beside and send your message. We will reply as quickly as possible.",
        contactFeature1Title: "Fast response",
        contactFeature1Text: "Talk directly with our team through WhatsApp.",
        contactFeature2Title: "Secure service",
        contactFeature2Text: "Your data is protected and used only for contact purposes.",
        contactFeature3Title: "We are available",
        contactFeature3Text: "Monday to Friday, from 8am to 6pm.",
        contactFormTitle: "Send your message",
        contactFormSubtitle: "Fill in the fields below and send your message.",
        contactNameLabel: "Your name",
        contactNamePlaceholder: "Type your name",
        contactPhoneLabel: "Your contact (WhatsApp)",
        contactPhonePlaceholder: "(11) 99999-9999",
        contactMessageLabel: "Your message",
        contactMessagePlaceholder: "Write your message here...",
        contactSubmit: "Send Message on WhatsApp",
        contactPrivacy: "We do not store your data. Your message will be sent directly through WhatsApp.",
        aboutEyebrow: "About us",
        aboutTitle: "Architecture with direction, atmosphere, and digital presence."
    }
};

const projectCatalog = {
    pt: [
        {
            title: "Projeto 1",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            url: "#"
        },
        {
            title: "Projeto 2",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            url: "#"
        },
        {
            title: "Projeto 3",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            url: "#"
        }
    ],
    en: [
        {
            title: "Project 1",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            url: "#"
        },
        {
            title: "Project 2",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            url: "#"
        },
        {
            title: "Project 3",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            url: "#"
        }
    ]
};

const languageButtons = document.querySelectorAll("[data-lang]");
const textTargets = document.querySelectorAll("[data-i18n]");
const altTargets = document.querySelectorAll("[data-i18n-alt]");
const nav = document.querySelector(".nav");
const navToggle = document.querySelector("[data-nav-toggle]");
const navToggleIcon = navToggle ? navToggle.querySelector("i") : null;
const navLinks = document.querySelectorAll(".nav__menu .nav__link-item");
const placeholderTargets = document.querySelectorAll("[data-i18n-placeholder]");
const contactForm = document.querySelector("[data-contact-form]");

const carousel = {
    cards: document.querySelectorAll("[data-project-card]"),
    dots: document.querySelectorAll("[data-project-dot]"),
    prev: document.querySelector("[data-projects-prev]"),
    next: document.querySelector("[data-projects-next]"),
    label: document.querySelector(".projects__dots"),
    stage: document.querySelector(".projects__stage")
};

let currentLanguage = "pt";
let activeProjectIndex = 0;
let pointerStartX = 0;
let pointerIsDown = false;
let swipeTriggered = false;

function setMenuState(isOpen) {
    if (!nav || !navToggle) {
        return;
    }

    nav.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));

    if (navToggleIcon) {
        navToggleIcon.classList.toggle("fa-bars", !isOpen);
        navToggleIcon.classList.toggle("fa-xmark", isOpen);
    }
}

function modulo(value, total) {
    return ((value % total) + total) % total;
}

function getCardPosition(cardIndex, activeIndex, total) {
    const distance = modulo(cardIndex - activeIndex, total);

    if (distance === 0) {
        return "center";
    }

    if (distance === 1) {
        return "right";
    }

    return "left";
}

function updateProjects() {
    const projects = projectCatalog[currentLanguage];
    const total = projects.length;

    carousel.cards.forEach((card, cardIndex) => {
        const project = projects[cardIndex];
        const position = getCardPosition(cardIndex, activeProjectIndex, total);
        const image = card.querySelector("[data-project-image]");
        const title = card.querySelector("[data-project-title]");
        const description = card.querySelector("[data-project-description]");

        card.dataset.position = position;
        card.href = project.url;
        card.setAttribute("aria-label", project.title);

        image.alt = project.title;
        title.textContent = project.title;
        description.textContent = project.description;
    });

    carousel.dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeProjectIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-pressed", String(isActive));
    });
}

function setProjectIndex(index) {
    activeProjectIndex = modulo(index, projectCatalog[currentLanguage].length);
    updateProjects();
}

function applyLanguage(language) {
    const fallbackLanguage = translations.pt;
    const selectedLanguage = translations[language] || fallbackLanguage;

    currentLanguage = translations[language] ? language : "pt";

    document.documentElement.lang = currentLanguage === "en" ? "en" : "pt-br";
    document.title = selectedLanguage.pageTitle;

    textTargets.forEach((element) => {
        const translationKey = element.dataset.i18n;
        element.textContent = selectedLanguage[translationKey] || fallbackLanguage[translationKey] || "";
    });

    altTargets.forEach((element) => {
        const translationKey = element.dataset.i18nAlt;
        element.alt = selectedLanguage[translationKey] || fallbackLanguage[translationKey] || "";
    });

    placeholderTargets.forEach((element) => {
        const translationKey = element.dataset.i18nPlaceholder;
        element.placeholder = selectedLanguage[translationKey] || fallbackLanguage[translationKey] || "";
    });

    languageButtons.forEach((button) => {
        const isActive = button.dataset.lang === currentLanguage;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    if (carousel.prev && carousel.next) {
        carousel.prev.setAttribute("aria-label", selectedLanguage.projectsPrev);
        carousel.next.setAttribute("aria-label", selectedLanguage.projectsNext);
    }

    if (carousel.label) {
        carousel.label.setAttribute("aria-label", selectedLanguage.projectsDots);
    }

    localStorage.setItem("jaburu-language", currentLanguage);
    updateProjects();
}

languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
        applyLanguage(button.dataset.lang);
        button.blur();
    });
});

if (navToggle) {
    navToggle.addEventListener("click", () => {
        const isOpen = navToggle.getAttribute("aria-expanded") === "true";
        setMenuState(!isOpen);
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        setMenuState(false);
    });
});

carousel.dots.forEach((dot) => {
    dot.addEventListener("click", () => {
        setProjectIndex(Number(dot.dataset.projectDot));
    });
});

if (carousel.prev && carousel.next) {
    carousel.prev.addEventListener("click", () => {
        setProjectIndex(activeProjectIndex - 1);
    });

    carousel.next.addEventListener("click", () => {
        setProjectIndex(activeProjectIndex + 1);
    });
}

if (carousel.stage) {
    carousel.stage.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) {
            return;
        }

        pointerStartX = event.clientX;
        pointerIsDown = true;
        swipeTriggered = false;
        carousel.stage.classList.add("is-dragging");
    });

    carousel.stage.addEventListener("pointerup", (event) => {
        if (!pointerIsDown) {
            return;
        }

        const deltaX = event.clientX - pointerStartX;
        pointerIsDown = false;
        carousel.stage.classList.remove("is-dragging");

        if (Math.abs(deltaX) < 40) {
            return;
        }

        swipeTriggered = true;

        if (deltaX < 0) {
            setProjectIndex(activeProjectIndex + 1);
            return;
        }

        setProjectIndex(activeProjectIndex - 1);
    });

    carousel.stage.addEventListener("pointercancel", () => {
        pointerIsDown = false;
        carousel.stage.classList.remove("is-dragging");
    });

    carousel.stage.addEventListener("pointerleave", () => {
        if (!pointerIsDown) {
            return;
        }

        pointerIsDown = false;
        carousel.stage.classList.remove("is-dragging");
    });

    carousel.stage.addEventListener("click", (event) => {
        if (!swipeTriggered) {
            return;
        }

        event.preventDefault();
        swipeTriggered = false;
    }, true);
}

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = String(formData.get("name") || "").trim();
        const phone = String(formData.get("phone") || "").trim();
        const message = String(formData.get("message") || "").trim();
        const greeting = currentLanguage === "en" ? "Hello, I would like to know more." : "Ola, gostaria de saber mais.";

        const text = [
            greeting,
            name ? `${currentLanguage === "en" ? "Name" : "Nome"}: ${name}` : "",
            phone ? `${currentLanguage === "en" ? "WhatsApp" : "WhatsApp"}: ${phone}` : "",
            message ? `${currentLanguage === "en" ? "Message" : "Mensagem"}: ${message}` : ""
        ].filter(Boolean).join("\n");

        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, "_blank", "noopener");
    });
}

window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
        setMenuState(false);
    }
});

const savedLanguage = localStorage.getItem("jaburu-language");
applyLanguage(savedLanguage && translations[savedLanguage] ? savedLanguage : "pt");
setMenuState(false);
