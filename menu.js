/*
  DAKKAI SUSHI — CARDÁPIO DO SITE
  =================================
  Estas são as categorias oficiais (as mesmas do cardápio digital).
  Para exibir os itens direto na página, basta preencher "itens", ex.:

  { nome: "Combinados", itens: [
    { nome: "Combinado 30 peças", descricao: "Salmão, kani e hot", preco: "R$ 0,00" }
  ]}

  Enquanto uma categoria estiver vazia, a página mostra automaticamente
  o cardápio digital completo (MenuDino) logo abaixo.
*/

window.DAKKAI_MENU = {
  categorias: [
    { nome: "Especiais", itens: [] },
    { nome: "Combinados", itens: [] },
    { nome: "Entradas", itens: [] },
    { nome: "Temaki", itens: [] },
    { nome: "Hot Roll", itens: [] },
    { nome: "Hossomaki", itens: [] },
    { nome: "Uramaki", itens: [] },
    { nome: "Joy", itens: [] },
    { nome: "Niguiris", itens: [] },
    { nome: "Sashimi", itens: [] },
    { nome: "Teppanyaki", itens: [] },
    { nome: "Bebidas", itens: [] }
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
    String(value || "").replace(/[&<>"']/g, (ch) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
    ));

  root.innerHTML = categorias.map((categoria) => `
    <section class="menu-cat">
      <h2>${escapeHtml(categoria.nome)}</h2>
      ${categoria.itens.map((item) => `
        <div class="menu-item">
          <div>
            <strong>${escapeHtml(item.nome)}</strong>
            <small>${escapeHtml(item.descricao)}</small>
          </div>
          <span class="price">${escapeHtml(item.preco)}</span>
        </div>
      `).join("")}
    </section>
  `).join("");
})();
