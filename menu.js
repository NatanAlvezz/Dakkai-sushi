/*
  DAKKAI SUSHI — CARDÁPIO OFICIAL DO SITE
  ========================================
  Itens e preços do cardápio oficial.
  As fotos ficam na pasta assets/ (com o nome do prato).
  Para mudar um preço, item ou foto, edite apenas este arquivo.
*/

window.DAKKAI_MENU = {
  categorias: [
    {
      nome: "Combinados",
      itens: [
        { nome: "Combo Família", descricao: "10 Uramaki Salmão Filadélfia, 10 Uramaki Kani, 10 Uramaki Salmão Grelhado, 10 Hossomaki Salmão, 10 Hossomaki Pepino, 10 Hossomaki Kani, 20 Hot Filadélfia e 20 Hot Banana com Doce de Leite", preco: "R$ 119,90", foto: "assets/combo sambaqui.png" },
        { nome: "Dakkai Minha Delícia — 22 peças", descricao: "5 Uramaki Salmão Filadélfia, 5 Uramaki Salmão Grelhado, 4 Hossomaki Salmão, 4 Niguiri Salmão, 4 Joy Salmão", preco: "R$ 49,90", foto: "assets/uramaki salmao.png" },
        { nome: "Dakkai Chef — 50 peças", descricao: "10 Uramaki Salmão Filadélfia, 10 Ura Skin, 10 Hossomaki Salmão, 5 Niguiri Salmão, 5 Niguiri Skin, 10 Hot Filadélfia", preco: "R$ 98,00", foto: "assets/Niguiri Skin.png" },
        { nome: "Dakkai Salmão — 46 peças", descricao: "8 Sashimi Salmão, 10 Uramaki Salmão Filadélfia, 10 Uramaki Salmão Grelhado, 10 Hossomaki Salmão, 4 Niguiri Salmão, 4 Joy", preco: "R$ 149,90", foto: "assets/sashimi salmao.png" },
        { nome: "Trio Joy Especiais — 12 peças", descricao: "4 Joy Salmão Gorgonzola, 4 Joy Salmão Brie, 4 Joy Salmão Amêndoas", preco: "R$ 59,90", foto: "assets/joy gorgonzola.png" },
        { nome: "Combo Gourmet — 32 peças", descricao: "10 Uramaki Salmão Filadélfia Laminado e Trufado com raspa de limão, 10 Hossomaki Salmão, 4 Niguiri Salmão Queijo Brie, 4 Joy Salmão, 4 Sashimi Salmão com Salsa Trufada", preco: "R$ 169,90" }
      ]
    },
    {
      nome: "Joy",
      itens: [
        { nome: "Joy Salmão — 4 un", descricao: "Salmão, arroz japonês, cream cheese e ceboletes", preco: "R$ 22,90", foto: "assets/joy salmão.png" },
        { nome: "Joy Salmão Amêndoas — 4 un", descricao: "Salmão, cream cheese, amêndoas e molho teriyaki", preco: "R$ 26,90", foto: "assets/joy salmão amendoas.png" },
        { nome: "Joy (Dupla) Salmão Gorgonzola", descricao: "Salmão, arroz japonês, creme gorgonzola e nozes", preco: "R$ 26,00", foto: "assets/joy gorgonzola.png" }
      ]
    },
    {
      nome: "Hot Roll",
      itens: [
        { nome: "Hot Holl Salmão & Camarão — 10 un", descricao: "Empanado crocante com recheio de salmão e camarão", preco: "Consulte no WhatsApp", foto: "assets/joy salmao e camarao.png" },
        { nome: "Hot Filadélfia", descricao: "Empanado crocante, salmão e cream cheese", preco: "Consulte no WhatsApp", foto: "assets/hot holl salmao.png" },
        { nome: "Hot Banana com Doce de Leite", descricao: "Hot doce empanado com banana e doce de leite", preco: "Consulte no WhatsApp", foto: "assets/hot holl banana com doce de leite.png" }
      ]
    },
    {
      nome: "Sashimi",
      itens: [
        { nome: "Sashimi Salmão — 6 lâminas", descricao: "Lâminas frescas de salmão", preco: "R$ 36,00", foto: "assets/sashimi salmao.png" },
        { nome: "Sashimi Salmão Crispy — 16 lâminas", descricao: "Salmão maçaricado com molho de ostras, togarashi e crispy de batata-doce", preco: "R$ 69,00", foto: "assets/sashimi salmao crispy.png" }
      ]
    },
    {
      nome: "Niguiris",
      itens: [
        { nome: "Niguiri Salmão — 4 un", descricao: "Salmão e arroz japonês", preco: "R$ 26,90", foto: "assets/niguiri salmao.png" },
        { nome: "Niguiris Salmão Brie — 4 un", descricao: "Maçaricado com queijo brie e geleia de pimenta", preco: "R$ 39,90" }
      ]
    },
    {
      nome: "Temaki",
      itens: [
        { nome: "Temaki Califórnia", descricao: "Cone de alga nori com shari, manga, pepino japonês e abacate, finalizado com raspa de limão (vegano)", preco: "R$ 29,90" },
        { nome: "Temaki Salmão Filadélfia", descricao: "Salmão, cream cheese e arroz japonês", preco: "R$ 44,90" },
        { nome: "Temaki Salmão Spyce Alho-Poró", descricao: "Salmão com toque picante e alho-poró crocante", preco: "R$ 44,90", foto: "assets/hot holl salmao alho poro.png" },
        { nome: "Temaki Salmão Sem Arroz", descricao: "Versão low carb, só salmão e recheio", preco: "R$ 49,90" }
      ]
    },
    {
      nome: "Uramaki",
      itens: [
        { nome: "Uramaki Califórnia — 10 peças", descricao: "Shari com gergelim torrado, pepino, manga, aspargos e cream cheese (opção vegana)", preco: "R$ 21,90" },
        { nome: "Uramaki Cogumelos Filadélfia — 10 peças", descricao: "Cogumelos salteados e cream cheese (opção vegana)", preco: "R$ 24,90" },
        { nome: "Uramakis Salmão Filadélfia", descricao: "Holl de salmão, arroz japonês, cream cheese, nori e gergelim", preco: "R$ 47,00", foto: "assets/uramaki salmao.png" },
        { nome: "Uramakis Salmão Crocante", descricao: "Salmão empanado, laminado, crispy de alho-poró", preco: "R$ 61,00" },
        { nome: "Uramakis Camarão Filadélfia", descricao: "Holl de camarão, arroz japonês, cream cheese, nori e gergelim", preco: "R$ 47,00" },
        { nome: "Uramakis Camarão Crocante", descricao: "Camarão empanado, laminado, crispy de couve", preco: "R$ 56,00" }
      ]
    },
    {
      nome: "Hossomaki",
      itens: [
        { nome: "Hossomaki Salmão — 8 un", descricao: "Clássico de salmão", preco: "R$ 26,90" },
        { nome: "Hossomaki Kani — 8 un", descricao: "Kani e arroz japonês", preco: "R$ 21,90" },
        { nome: "Hossomaki Pepino — 8 un", descricao: "Refrescante e leve", preco: "R$ 18,00" },
        { nome: "Hossomaki de Manga — 8 un", descricao: "Vegano — o planeta agradece", preco: "R$ 16,90" }
      ]
    },
    {
      nome: "Entradas",
      itens: [
        { nome: "Sonomono", descricao: "Salada agridoce de pepino com gergelim", preco: "R$ 19,90" }
      ]
    },
    {
      nome: "Bebidas",
      itens: [
        { nome: "Refrigerante Fanta Laranja 350ml", descricao: "Lata", preco: "R$ 7,00" },
        { nome: "Fanta Guaraná 350ml", descricao: "Lata", preco: "R$ 7,00" },
        { nome: "Água Tônica Schweppes 350ml", descricao: "Lata", preco: "R$ 7,00" },
        { nome: "Água Mineral com Gás 500ml", descricao: "Flua", preco: "R$ 5,00" }
      ]
    }
  ]
};

/* Renderização automática — não precisa mexer daqui para baixo */
(() => {
  "use strict";

  const root = document.querySelector("#menu-lista");
  if (!root) return;

  const categorias = (window.DAKKAI_MENU.categorias || [])
    .filter((categoria) => Array.isArray(categoria.itens) && categoria.itens.length);

  if (!categorias.length) return;

  const escapeHtml = (value) =>
    String(value || "").replace(/[&<>\"']/g, (ch) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
    ));

  const cardComFoto = (item) => `
    <figure class="menu-card">
      <img src="${encodeURI(item.foto)}" alt="${escapeHtml(item.nome)}" loading="lazy" decoding="async" onerror="this.style.display='none'">
      <figcaption class="menu-card-info">
        <strong>${escapeHtml(item.nome)}</strong>
        <small>${escapeHtml(item.descricao)}</small>
        <span class="price">${escapeHtml(item.preco)}</span>
      </figcaption>
    </figure>
  `;

  const linhaSimples = (item) => `
    <div class="menu-row">
      <div>
        <strong>${escapeHtml(item.nome)}</strong>
        <small>${escapeHtml(item.descricao)}</small>
      </div>
      <span class="price">${escapeHtml(item.preco)}</span>
    </div>
  `;

  root.innerHTML = categorias.map((categoria) => {
    const comFoto = categoria.itens.filter((item) => item.foto);
    const semFoto = categoria.itens.filter((item) => !item.foto);

    return `
      <section class="menu-cat">
        <h2>${escapeHtml(categoria.nome)}</h2>
        ${comFoto.length ? `<div class="menu-grid">${comFoto.map(cardComFoto).join("")}</div>` : ""}
        ${semFoto.map(linhaSimples).join("")}
      </section>
    `;
  }).join("") + `
    <p class="menu-obs">Preços e disponibilidade podem variar — qualquer dúvida, é só chamar a gente no WhatsApp.</p>
  `;
})();
