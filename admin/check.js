
(()=>{"use strict";
const items=[
["CSS compartilhado","./assets/app.css"],
["JavaScript compartilhado","./assets/shell.js"],
["Dashboard","./dashboard.html"],
["Pedidos","./pedidos.html"],
["Cozinha","./cozinha.html"],
["Delivery","./delivery.html"],
["Estoque","./estoque.html"],
["Produtos","./produtos.html"],
["Clientes","./clientes.html"],
["Equipe","./equipe.html"],
["Financeiro","./financeiro.html"],
["Relatórios","./relatorios.html"],
["Chat & IA","./chat.html"],
["Configurações","./configuracoes.html"]
];
Promise.all(items.map(async ([name,url])=>{
 try{const r=await fetch(url,{cache:"no-store"});return{name,url,ok:r.ok,status:r.status}}
 catch(e){return{name,url,ok:false,status:"erro"}}
})).then(results=>{
 const root=document.getElementById("checks");
 root.innerHTML=results.map(x=>`<div class="${x.ok?"ok":"bad"}"><b>${x.ok?"✓":"×"} ${x.name}</b><span>${x.url} — ${x.status}</span></div>`).join("");
});
})();
