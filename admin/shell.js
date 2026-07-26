
(()=>{"use strict";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const page=document.body.dataset.page||"dashboard";
const theme=localStorage.getItem("dakkai-theme")||"dakkai";document.body.dataset.theme=theme;
$$("[data-nav]").forEach(a=>a.classList.toggle("active",a.dataset.nav===page));
const side=$("#sidebar"),over=$("#overlay");
$("#mobileMenu")?.addEventListener("click",()=>{side.classList.add("open");over.classList.add("show")});
over?.addEventListener("click",()=>{side.classList.remove("open");over.classList.remove("show");$("#themePanel")?.classList.remove("open")});
$("#collapse")?.addEventListener("click",()=>document.body.classList.toggle("sidebar-collapsed"));
$("#themeButton")?.addEventListener("click",()=>{$("#themePanel").classList.add("open");over.classList.add("show")});
$("#closeTheme")?.addEventListener("click",()=>{$("#themePanel").classList.remove("open");over.classList.remove("show")});
$$("[data-theme]").forEach(b=>b.addEventListener("click",()=>{document.body.dataset.theme=b.dataset.theme;localStorage.setItem("dakkai-theme",b.dataset.theme)}));
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#globalSearch")?.focus()}if(e.key==="Escape"){side.classList.remove("open");over.classList.remove("show");$("#chatDrawer")?.classList.remove("open");$("#themePanel")?.classList.remove("open")}});
const drawer=$("#chatDrawer"),fab=$("#chatFab"),closeChat=$("#closeChat"),messages=$("#chatMessages"),input=$("#chatInput"),send=$("#chatSend");
const key="dakkai-team-chat-v1";
let chat=JSON.parse(localStorage.getItem(key)||"[]");
if(!chat.length)chat=[
{id:1,author:"Dakkai IA",type:"ai",text:"Central inteligente ativada. Posso resumir conversas, registrar decisões e transformar orientações da equipe em procedimentos.",time:new Date().toISOString()},
{id:2,author:"Gerência",type:"team",text:"Equipe, use este canal para comunicar atrasos, faltas de estoque e decisões operacionais.",time:new Date().toISOString()}
];
function render(){if(!messages)return;messages.innerHTML=chat.slice(-80).map(m=>`<article class="msg ${m.type==="mine"?"mine":m.type==="ai"?"ai":""}"><strong>${escapeHtml(m.author)}</strong><p>${escapeHtml(m.text)}</p><time>${new Date(m.time).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</time></article>`).join("");messages.scrollTop=messages.scrollHeight}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function learn(text){
const lower=text.toLowerCase();
let reply="Mensagem registrada. Vou considerar esse contexto nas próximas análises da operação.";
if(lower.includes("estoque"))reply="Registrei o tema de estoque. Na próxima etapa, vou cruzar essa conversa com produtos, insumos e movimentações do Supabase.";
else if(lower.includes("atras"))reply="Identifiquei um possível atraso. Recomendo verificar pedidos em preparação, tempo médio da cozinha e entregas em rota.";
else if(lower.includes("cliente"))reply="Registrei a informação do cliente. Quando conectarmos o CRM, poderei relacionar histórico, frequência e preferências.";
else if(lower.includes("pedido"))reply="Entendi. Vou usar essa informação para ajudar na análise dos pedidos e do fluxo da cozinha.";
else if(lower.includes("procedimento")||lower.includes("regra"))reply="Essa orientação pode virar um procedimento oficial. Na etapa de IA com base de conhecimento, ela ficará disponível para toda a equipe.";
setTimeout(()=>{chat.push({id:Date.now()+1,author:"Dakkai IA",type:"ai",text:reply,time:new Date().toISOString()});localStorage.setItem(key,JSON.stringify(chat));render()},550)
}
function sendMsg(){const text=input?.value.trim();if(!text)return;chat.push({id:Date.now(),author:"Natan",type:"mine",text,time:new Date().toISOString()});input.value="";localStorage.setItem(key,JSON.stringify(chat));render();learn(text)}
fab?.addEventListener("click",()=>{drawer.classList.add("open");render()});closeChat?.addEventListener("click",()=>drawer.classList.remove("open"));send?.addEventListener("click",sendMsg);input?.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMsg()}});
$$("[data-chat-tab]").forEach(b=>b.addEventListener("click",()=>{$$("[data-chat-tab]").forEach(x=>x.classList.remove("active"));b.classList.add("active");if(b.dataset.chatTab==="ai"){input.placeholder="Pergunte ou ensine algo para a Dakkai IA..."}else{input.placeholder="Escreva para a equipe..."}}));
render();
})();
