(() => {
  "use strict";

  const CONFIG = window.DAKKAI_CONFIG || {};
  const toast = document.querySelector("#toast");
  let toastTimer;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3200);
  };

  const cleanPhone = (value) => String(value || "").replace(/\D/g, "");
  const whatsappUrl = () => {
    const phone = cleanPhone(CONFIG.whatsapp);
    if (!phone) return "";
    const message = CONFIG.mensagemWhatsApp || "Olá! Vim pelo site do DAKKAI Sushi.";
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const actionUrls = {
    whatsapp: whatsappUrl,
    delivery: () => CONFIG.delivery || whatsappUrl(),
    cardapio: () => CONFIG.cardapio || "cardapio.html",
    reservas: () => CONFIG.reservas || whatsappUrl(),
    trabalheConosco: () => CONFIG.trabalheConosco || whatsappUrl(),
    instagram: () => CONFIG.instagram || "",
    maps: () => CONFIG.maps || ""
  };

  document.querySelectorAll("[data-action]").forEach((link) => {
    const resolver = actionUrls[link.dataset.action];
    const url = typeof resolver === "function" ? resolver() : "";
    if (url) {
      link.href = url;
      if (/^https?:/i.test(url)) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      return;
    }
    link.href = "#";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("Este canal está temporariamente indisponível.");
    });
  });

  ["atendimento", "horario", "endereco"].forEach((field) => {
    document.querySelectorAll(`[data-field="${field}"]`).forEach((element) => {
      if (CONFIG[field]) element.textContent = CONFIG[field];
    });
  });

  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".nav");
  const closeMenu = () => {
    nav?.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Abrir menu");
  };
  menuButton?.addEventListener("click", () => {
    const open = !nav?.classList.contains("open");
    nav?.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });
  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
  window.addEventListener("resize", () => { if (window.innerWidth > 900) closeMenu(); });

  const header = document.querySelector(".site-header");
  let headerTicking = false;
  const updateHeader = () => {
    header?.classList.toggle("scrolled", window.scrollY > 24);
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
    headerTicking = false;
  };
  window.addEventListener("scroll", () => {
    if (headerTicking) return;
    headerTicking = true;
    window.requestAnimationFrame(updateHeader);
  }, { passive: true });
  updateHeader();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  const revealTargets = document.querySelectorAll(".section-label,.section-content,.principles article,.experience-card,.gallery-card,.contact-details,.footer-inner > *");
  if (!reduceMotion && "IntersectionObserver" in window) {
    revealTargets.forEach((item) => item.classList.add("reveal-ready"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: "0px 0px -45px" });
    revealTargets.forEach((item) => observer.observe(item));
  }

  if (!reduceMotion && !isTouch) {
    document.querySelectorAll(".brush-button,.principles article,.gallery-card").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const box = element.getBoundingClientRect();
        element.style.setProperty("--pointer-x", `${event.clientX - box.left}px`);
        element.style.setProperty("--pointer-y", `${event.clientY - box.top}px`);
      });
      element.addEventListener("pointerleave", () => {
        element.style.removeProperty("--pointer-x");
        element.style.removeProperty("--pointer-y");
      });
    });
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}), { once: true });
  }
})();
