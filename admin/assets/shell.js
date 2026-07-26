(() => {
  "use strict";

  const $ = seletor => document.querySelector(seletor);
  const $$ = seletor => document.querySelectorAll(seletor);

  // Tema
  const tema = localStorage.getItem("dakkai-theme") || "dakkai";
  document.body.dataset.theme = tema;

  $$("[data-theme]").forEach(botao => {
    botao.addEventListener("click", () => {
      document.body.dataset.theme = botao.dataset.theme;
      localStorage.setItem("dakkai-theme", botao.dataset.theme);
    });
  });

  // Menu mobile
  const sidebar = $("#sidebar");
  const overlay = $("#overlay");

  $("#mobileMenu")?.addEventListener("click", () => {
    sidebar?.classList.add("open");
    overlay?.classList.add("show");
  });

  overlay?.addEventListener("click", () => {
    sidebar?.classList.remove("open");
    overlay?.classList.remove("show");
    $("#themePanel")?.classList.remove("open");
    $("#chatDrawer")?.classList.remove("open");
  });

  // Recolher menu
  $("#collapse")?.addEventListener("click", () => {
    document.body.classList.toggle("sidebar-collapsed");
  });

  // Painel de temas
  $("#themeButton")?.addEventListener("click", () => {
    $("#themePanel")?.classList.add("open");
    overlay?.classList.add("show");
  });

  $("#closeTheme")?.addEventListener("click", () => {
    $("#themePanel")?.classList.remove("open");
    overlay?.classList.remove("show");
  });

  // Chat
  $("#chatFab")?.addEventListener("click", () => {
    $("#chatDrawer")?.classList.add("open");
  });

  $("#closeChat")?.addEventListener("click", () => {
    $("#chatDrawer")?.classList.remove("open");
  });

  // Página ativa no menu
  const pagina = document.body.dataset.page || "dashboard";

  $$("[data-nav]").forEach(link => {
    link.classList.toggle("active", link.dataset.nav === pagina);
  });

  // Corrige o logout
  $$('a[href="./index.html"], a[href="index.html"]').forEach(link => {
    link.addEventListener("click", evento => {
      evento.preventDefault();

      Object.keys(localStorage).forEach(chave => {
        if (
          chave.toLowerCase().includes("dakkai") ||
          chave.startsWith("sb-")
        ) {
          localStorage.removeItem(chave);
        }
      });

      sessionStorage.clear();
      window.location.replace("./index.html");
    });
  });

  // Atalho de busca
  document.addEventListener("keydown", evento => {
    if (
      (evento.ctrlKey || evento.metaKey) &&
      evento.key.toLowerCase() === "k"
    ) {
      evento.preventDefault();
      $("#globalSearch")?.focus();
    }

    if (evento.key === "Escape") {
      sidebar?.classList.remove("open");
      overlay?.classList.remove("show");
      $("#chatDrawer")?.classList.remove("open");
      $("#themePanel")?.classList.remove("open");
    }
  });

  console.log("✅ Dakkai OS carregado e logout corrigido.");
})();
