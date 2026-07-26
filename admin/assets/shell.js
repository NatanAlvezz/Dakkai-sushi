(() => {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  // Tema
  const tema = localStorage.getItem("dakkai-theme") || "dakkai";
  document.body.dataset.theme = tema;

  $$("[data-theme]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.body.dataset.theme = btn.dataset.theme;
      localStorage.setItem("dakkai-theme", btn.dataset.theme);
    });
  });

  // Sidebar Mobile
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  $("#mobileMenu")?.addEventListener("click", () => {
    sidebar?.classList.add("open");
    overlay?.classList.add("show");
  });

  overlay?.addEventListener("click", () => {
    sidebar?.classList.remove("open");
    overlay?.classList.remove("show");
  });

  // Chat
  const chat = document.getElementById("chatDrawer");

  $("#chatFab")?.addEventListener("click", () => {
    chat?.classList.add("open");
  });

  $("#closeChat")?.addEventListener("click", () => {
    chat?.classList.remove("open");
  });

  // Atalho CTRL+K
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      $("#globalSearch")?.focus();
    }
  });

  console.log("✅ Dakkai OS carregado.");
})();
