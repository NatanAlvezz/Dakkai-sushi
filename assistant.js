/*
  DAKKAI IA — assistente virtual do site.
  Funciona 100% no navegador, sem cadastros e sem custos.
  Responde sobre cardápio, delivery, horários, endereço, reservas
  e encaminha qualquer outro assunto para o WhatsApp da equipe.
*/

(() => {
  "use strict";

  const CONFIG = window.DAKKAI_CONFIG || {};
  const phone = String(CONFIG.whatsapp || "").replace(/\D/g, "");

  const wa = (text) =>
    "https://wa.me/" + phone + "?text=" +
    encodeURIComponent(text || CONFIG.mensagemWhatsApp || "Olá! Vim pelo site do DAKKAI Sushi.");

  const LINKS = {
    ifood: CONFIG.ifood || CONFIG.delivery || "",
    cardapio: CONFIG.cardapio || "cardapio.html",
    instagram: CONFIG.instagram || "",
    maps: CONFIG.maps || ""
  };

  const norm = (value) =>
    String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const INTENTS = [
    {
      keys: ["cardapio", "menu", "combinado", "temaki", "hot roll", "sashimi", "uramaki", "niguiri", "opcoes", "comida"],
      reply: () => ({
        text: "Nosso cardápio completo está aqui no site e também no iFood. Como prefere ver?",
        actions: [["Ver cardápio", LINKS.cardapio], ["Abrir no iFood", LINKS.ifood]]
      })
    },
    {
      keys: ["delivery", "entrega", "entregam", "pedir", "pedido", "ifood"],
      reply: () => ({
        text: "Entregamos pelo iFood e também atendemos direto pelo WhatsApp — como você preferir.",
        actions: [["Pedir no iFood", LINKS.ifood], ["Pedir no WhatsApp", wa()]]
      })
    },
    {
      keys: ["horario", "aberto", "abre", "fecha", "funciona", "funcionamento"],
      reply: () => {
        const horario = CONFIG.horario || "";
        const pendente = !horario || /atualizacao/.test(norm(horario));
        return {
          text: pendente
            ? "Nossos horários estão sendo atualizados. Pelo WhatsApp a equipe confirma na hora!"
            : "Nosso horário de atendimento: " + horario,
          actions: [["Confirmar no WhatsApp", wa("Olá! Qual o horário de atendimento de hoje?")]]
        };
      }
    },
    {
      keys: ["endereco", "local", "onde", "chegar", "sambaqui", "retirada", "retirar", "fica"],
      reply: () => ({
        text: "Estamos em: " + (CONFIG.endereco || "Sambaqui, Florianópolis/SC") + ". Retirada também disponível!",
        actions: [["Como chegar", LINKS.maps]]
      })
    },
    {
      keys: ["reserva", "reservar", "mesa"],
      reply: () => ({
        text: "Reservas são combinadas direto com a nossa equipe pelo WhatsApp — resposta rápida!",
        actions: [["Reservar pelo WhatsApp", wa("Olá! Gostaria de fazer uma reserva no DAKKAI Sushi.")]]
      })
    },
    {
      keys: ["trabalhe", "trabalhar", "vaga", "curriculo", "emprego"],
      reply: () => ({
        text: "Que ótimo! Envie seu currículo pelo WhatsApp que a equipe recebe na hora.",
        actions: [["Enviar currículo", wa("Olá! Tenho interesse em trabalhar no DAKKAI Sushi.")]]
      })
    },
    {
      keys: ["preco", "valor", "quanto custa", "quanto", "promocao", "desconto"],
      reply: () => ({
        text: "Os preços e promoções atualizados estão no cardápio do iFood.",
        actions: [["Ver preços no iFood", LINKS.ifood], ["Ver cardápio", LINKS.cardapio]]
      })
    },
    {
      keys: ["pagamento", "pix", "cartao", "dinheiro", "pagar"],
      reply: () => ({
        text: "No iFood você vê todas as formas de pagamento. Pedindo pelo WhatsApp, a equipe confirma Pix, cartão e dinheiro.",
        actions: [["Pedir no iFood", LINKS.ifood], ["Perguntar no WhatsApp", wa("Olá! Quais formas de pagamento vocês aceitam?")]]
      })
    },
    {
      keys: ["instagram", "insta", "rede social", "fotos"],
      reply: () => ({
        text: "Siga o DAKKAI no Instagram: @dakkaisushi.sambaqui 🍣",
        actions: [["Abrir Instagram", LINKS.instagram]]
      })
    },
    {
      keys: ["oi", "ola", "bom dia", "boa tarde", "boa noite", "hey", "eai"],
      reply: () => ({
        text: "Olá! Sou a assistente do DAKKAI 🍣 Posso ajudar com cardápio, pedidos, horários, endereço e reservas. O que você precisa?"
      })
    }
  ];

  const fallback = (question) => ({
    text: "Posso ajudar com cardápio, pedidos, horários, endereço e reservas. Para esse assunto, o melhor é falar direto com a equipe:",
    actions: [["Falar no WhatsApp", wa(question ? "Olá! Vim pelo site do DAKKAI. " + question : undefined)]]
  });

  const answer = (input) => {
    const text = norm(input);
    let best = null;
    let bestScore = 0;

    INTENTS.forEach((intent) => {
      const score = intent.keys.reduce(
        (total, key) => total + (text.includes(norm(key)) ? 1 : 0), 0
      );
      if (score > bestScore) {
        bestScore = score;
        best = intent;
      }
    });

    return best ? best.reply() : fallback(input);
  };

  /* ---------- Interface ---------- */

  const build = () => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dk-ai-button";
    button.setAttribute("aria-label", "Abrir assistente virtual do DAKKAI");
    button.innerHTML = "<span>✦</span> DAKKAI IA";

    const panel = document.createElement("div");
    panel.className = "dk-ai-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Assistente virtual DAKKAI");
    panel.innerHTML = `
      <div class="dk-ai-head">
        <strong>DAKKAI IA</strong>
        <button type="button" aria-label="Fechar assistente">×</button>
      </div>
      <div class="dk-ai-body"></div>
      <div class="dk-ai-chips"></div>
      <form class="dk-ai-input">
        <input type="text" placeholder="Escreva sua pergunta..." aria-label="Sua pergunta" autocomplete="off">
        <button type="submit">Enviar</button>
      </form>
    `;

    document.body.appendChild(button);
    document.body.appendChild(panel);

    const body = panel.querySelector(".dk-ai-body");
    const chips = panel.querySelector(".dk-ai-chips");
    const form = panel.querySelector("form");
    const input = panel.querySelector("input");

    const addMessage = (text, who, actions) => {
      const message = document.createElement("div");
      message.className = "dk-ai-msg " + who;
      message.textContent = text;
      body.appendChild(message);

      if (actions && actions.length) {
        const wrap = document.createElement("div");
        wrap.className = "dk-ai-actions";
        actions.forEach(([label, url]) => {
          if (!url) return;
          const link = document.createElement("a");
          link.href = url;
          link.textContent = label;
          if (/^https?:/.test(url)) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
          }
          wrap.appendChild(link);
        });
        body.appendChild(wrap);
      }

      body.scrollTop = body.scrollHeight;
    };

    const ask = (question) => {
      addMessage(question, "user");
      const response = answer(question);
      window.setTimeout(() => addMessage(response.text, "bot", response.actions), 350);
    };

    ["Cardápio", "Pedir no iFood", "Horários", "Endereço", "Reservas"].forEach((label) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.textContent = label;
      chip.addEventListener("click", () => ask(label));
      chips.appendChild(chip);
    });

    let greeted = false;

    button.addEventListener("click", () => {
      panel.classList.toggle("open");
      if (panel.classList.contains("open")) {
        if (!greeted) {
          greeted = true;
          addMessage(
            "Olá! Sou a assistente virtual do DAKKAI 🍣 Posso ajudar com cardápio, pedidos, horários, endereço e reservas.",
            "bot"
          );
        }
        input.focus();
      }
    });

    panel.querySelector(".dk-ai-head button").addEventListener("click", () => {
      panel.classList.remove("open");
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const question = input.value.trim();
      if (!question) return;
      input.value = "";
      ask(question);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build, { once: true });
  } else {
    build();
  }
})();
