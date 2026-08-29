/*
  DAKKAI IA — assistente virtual do site.
  Funciona 100% no navegador, sem cadastros e sem custos.
  Responde sobre cardápio, preços, delivery, horários, endereço,
  reservas e encaminha qualquer outro assunto para o WhatsApp.
*/

(() => {
  "use strict";

  const CONFIG = window.DAKKAI_CONFIG || {};
  const phone = String(CONFIG.whatsapp || "").replace(/\D/g, "");

  const wa = (text) =>
    "https://wa.me/" + phone + "?text=" +
    encodeURIComponent(text || CONFIG.mensagemWhatsApp || "Olá! Vim pelo site do DAKKAI Sushi.");

  const LINKS = {
    cardapio: CONFIG.cardapio || "cardapio.html",
    menudino: CONFIG.menudino || "",
    instagram: CONFIG.instagram || "",
    maps: CONFIG.maps || ""
  };

  const norm = (value) =>
    String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const pick = (options) => options[Math.floor(Math.random() * options.length)];

  const saudacao = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Bom dia";
    if (hora >= 12 && hora < 18) return "Boa tarde";
    return "Boa noite";
  };

  /* Busca itens reais do cardápio (menu.js) para responder sobre pratos e preços */
  const buscarItens = (texto) => {
    const menu = window.DAKKAI_MENU;
    if (!menu || !Array.isArray(menu.categorias)) return [];
    const consulta = norm(texto);
    const achados = [];
    menu.categorias.forEach((categoria) => {
      (categoria.itens || []).forEach((item) => {
        const palavras = norm(item.nome).split(/[^a-z0-9]+/).filter((p) => p.length > 3);
        const relevancia = palavras.reduce((total, p) => total + (consulta.includes(p) ? 1 : 0), 0);
        if (relevancia > 0) achados.push({ item, relevancia });
      });
    });
    return achados.sort((a, b) => b.relevancia - a.relevancia).slice(0, 3).map((x) => x.item);
  };

  const INTENTS = [
    {
      keys: ["cardapio", "menu", "combinado", "temaki", "hot roll", "sashimi", "uramaki", "niguiri", "hossomaki", "opcoes", "comida", "vegano", "vegana"],
      reply: (pergunta) => {
        const itens = buscarItens(pergunta);
        if (itens.length) {
          const linhas = itens.map((i) => i.nome + " (" + i.preco + ")").join(" • ");
          return {
            text: "Boa escolha! 😄 Olha o que temos: " + linhas + ". Quer que eu já deixe o pedido encaminhado?",
            actions: [["Pedir no WhatsApp", wa("Olá! Vi no site e gostaria de pedir: " + itens[0].nome)], ["Ver cardápio completo", LINKS.cardapio]]
          };
        }
        return {
          text: pick([
            "Nosso cardápio completo está aqui no site, com fotos e preços 🍣 Se preferir, também temos o cardápio digital. Qual você quer ver?",
            "Temos combinados, temakis, hot rolls, sashimis e muito mais 🍣 Dá uma olhada no cardápio — tenho certeza de que algo vai te conquistar!"
          ]),
          actions: [["Ver cardápio", LINKS.cardapio], ["Cardápio digital", LINKS.menudino]]
        };
      }
    },
    {
      keys: ["delivery", "entrega", "entregam", "pedir", "pedido", "pedir agora"],
      reply: () => ({
        text: pick([
          "Entregamos sim! 🛵 É só chamar a gente no WhatsApp que a equipe monta seu pedido rapidinho. Se preferir, você também pode montar tudo pelo cardápio digital.",
          "Seu sushi chega quentinho e fresquinho! 😊 Faça o pedido pelo WhatsApp — atendimento direto com a nossa equipe — ou pelo cardápio digital."
        ]),
        actions: [["Pedir no WhatsApp", wa()], ["Cardápio digital", LINKS.menudino]]
      })
    },
    {
      keys: ["horario", "aberto", "abre", "fecha", "funciona", "funcionamento", "hoje"],
      reply: () => {
        const horario = CONFIG.horario || "";
        const pendente = !horario || /atualizacao/.test(norm(horario));
        return {
          text: pendente
            ? "Nossos horários estão sendo ajustados. Mas manda um oi no WhatsApp que a equipe te confirma na hora, combinado? 😊"
            : "Nosso horário de atendimento: " + horario + " 😊",
          actions: [["Confirmar no WhatsApp", wa("Olá! Vocês estão atendendo hoje? Qual o horário?")]]
        };
      }
    },
    {
      keys: ["endereco", "local", "onde", "chegar", "sambaqui", "retirada", "retirar", "fica"],
      reply: () => ({
        text: "Estamos na " + (CONFIG.endereco || "Sambaqui, Florianópolis/SC") + " — pertinho do mar! 🌊 Se quiser retirar seu pedido aqui, é só avisar a equipe.",
        actions: [["Como chegar", LINKS.maps], ["Avisar que vou retirar", wa("Olá! Gostaria de fazer um pedido para retirada.")]]
      })
    },
    {
      keys: ["reserva", "reservar", "mesa"],
      reply: () => ({
        text: "Claro! Reservas são combinadas direto com a nossa equipe pelo WhatsApp — a resposta costuma ser rapidinha 😊 É só dizer o dia, o horário e quantas pessoas.",
        actions: [["Reservar pelo WhatsApp", wa("Olá! Gostaria de fazer uma reserva no DAKKAI Sushi.")]]
      })
    },
    {
      keys: ["trabalhe", "trabalhar", "vaga", "curriculo", "emprego"],
      reply: () => ({
        text: "Que legal que você quer fazer parte do time! 🙌 Envie seu currículo pelo WhatsApp que a equipe recebe na hora. Boa sorte!",
        actions: [["Enviar currículo", wa("Olá! Tenho interesse em trabalhar no DAKKAI Sushi.")]]
      })
    },
    {
      keys: ["preco", "valor", "quanto custa", "quanto", "promocao", "desconto", "custa"],
      reply: (pergunta) => {
        const itens = buscarItens(pergunta);
        if (itens.length) {
          const linhas = itens.map((i) => i.nome + ": " + i.preco).join(" • ");
          return {
            text: "Achei aqui pra você 😊 " + linhas + ". Posso ajudar com mais alguma coisa?",
            actions: [["Pedir no WhatsApp", wa("Olá! Quero pedir: " + itens[0].nome)]]
          };
        }
        return {
          text: "Os preços estão todos no nosso cardápio aqui do site 😊 E se tiver alguma promoção rolando, a equipe te conta pelo WhatsApp!",
          actions: [["Ver cardápio", LINKS.cardapio], ["Perguntar no WhatsApp", wa("Olá! Vocês têm alguma promoção hoje?")]]
        };
      }
    },
    {
      keys: ["pagamento", "pix", "cartao", "dinheiro", "pagar"],
      reply: () => ({
        text: "Aceitamos Pix, cartão e dinheiro 😊 É só combinar com a equipe na hora de fechar o pedido, do jeito que ficar melhor pra você.",
        actions: [["Fazer pedido no WhatsApp", wa()]]
      })
    },
    {
      keys: ["instagram", "insta", "rede social", "fotos"],
      reply: () => ({
        text: "Nossos bastidores, novidades e pratos do dia estão no Instagram: @dakkaisushi.sambaqui 🍣 Vem ver!",
        actions: [["Abrir Instagram", LINKS.instagram]]
      })
    },
    {
      keys: ["obrigado", "obrigada", "valeu", "brigado", "agradec", "otimo", "perfeito"],
      reply: () => ({
        text: pick([
          "Imagina, foi um prazer ajudar! 💛 Se precisar de mais alguma coisa, estou por aqui.",
          "Por nada! 😊 Qualquer coisa é só chamar. Bom apetite!"
        ])
      })
    },
    {
      keys: ["oi", "ola", "bom dia", "boa tarde", "boa noite", "hey", "eai", "tudo bem"],
      reply: () => ({
        text: saudacao() + "! 😊 Eu sou a assistente virtual do DAKKAI. Posso te ajudar com o cardápio, preços, pedidos, horários, endereço e reservas. O que você gostaria?"
      })
    }
  ];

  const fallback = (question) => ({
    text: pick([
      "Essa é uma boa pergunta! 😊 Pra não te passar informação errada, o melhor é falar direto com a nossa equipe — eles respondem rapidinho:",
      "Hmm, essa eu prefiro deixar com a equipe, que sabe tudo! 😊 Pelo WhatsApp você tem a resposta na hora:"
    ]),
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

    return best ? best.reply(input) : fallback(input);
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
      /* pequena pausa variável para a conversa parecer mais natural */
      const pausa = 500 + Math.random() * 500;
      window.setTimeout(() => addMessage(response.text, "bot", response.actions), pausa);
    };

    ["Cardápio", "Pedir agora", "Horários", "Endereço", "Reservas"].forEach((label) => {
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
            saudacao() + "! Que bom te ver por aqui 😊 Eu sou a assistente do DAKKAI 🍣 Posso ajudar com cardápio, preços, pedidos, horários, endereço e reservas. É só perguntar!",
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
