(() => {
  "use strict";

  const cfg = window.DAKKAI_SUPABASE;
  if (!cfg || !window.supabase) {
    document.body.innerHTML = "<p style='padding:30px;color:white'>Falha ao carregar a configuração do sistema.</p>";
    return;
  }

  const db = window.supabase.createClient(cfg.url, cfg.publishableKey);
  const $ = (id) => document.getElementById(id);
  const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const statusLabels = {
    new: "Novo pedido", confirmed: "Confirmado", preparing: "Em preparação",
    ready: "Pronto", out_for_delivery: "Saiu para entrega",
    completed: "Finalizado", cancelled: "Cancelado"
  };
  const sourceLabels = { site: "Site", ifood: "iFood", whatsapp: "WhatsApp", counter: "Balcão", phone: "Telefone", app: "App" };

  let allOrders = [];
  let soundEnabled = true;
  let toastTimer;
  let realtimeChannel;

  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[char]);

  function showToast(title, message, icon = "✓") {
    clearTimeout(toastTimer);
    $("toastTitle").textContent = title;
    $("toastMessage").textContent = message;
    $("toastIcon").textContent = icon;
    $("toast").classList.add("show");
    toastTimer = setTimeout(() => $("toast").classList.remove("show"), 3600);
  }

  function playNewOrderSound() {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(760, ctx.currentTime);
      oscillator.frequency.setValueAtTime(980, ctx.currentTime + 0.11);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.32);
      oscillator.connect(gain); gain.connect(ctx.destination);
      oscillator.start(); oscillator.stop(ctx.currentTime + 0.33);
    } catch (_) {}
  }

  function relativeTime(date) {
    const minutes = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
    if (minutes < 1) return "Agora";
    if (minutes < 60) return `Há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Há ${hours} h`;
    return new Date(date).toLocaleDateString("pt-BR");
  }

  function orderCode(order) {
    const prefix = order.source === "ifood" ? "IF" : "DK";
    return `#${prefix}-${String(order.order_number || 0).padStart(4, "0")}`;
  }

  function addressLabel(order) {
    if (order.type === "pickup") return "Retirada no local";
    if (order.type === "dine_in") return "Atendimento presencial";
    const address = order.delivery_address || {};
    return address.neighborhood || address.district || "Entrega";
  }

  function statusOptions(current) {
    return Object.entries(statusLabels).map(([value, label]) =>
      `<option value="${value}" ${value === current ? "selected" : ""}>${label}</option>`
    ).join("");
  }

  function renderMetrics() {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const today = allOrders.filter((order) => new Date(order.placed_at) >= start);
    const valid = today.filter((order) => order.status !== "cancelled");
    const revenue = valid.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const preparing = allOrders.filter((order) => order.status === "preparing").length;
    const delivery = allOrders.filter((order) => order.status === "out_for_delivery").length;
    const ready = allOrders.filter((order) => order.status === "ready").length;
    const ticket = valid.length ? revenue / valid.length : 0;

    $("metricOrders").textContent = today.length;
    $("metricRevenue").textContent = money.format(revenue);
    $("metricPreparing").textContent = preparing;
    $("metricDelivery").textContent = delivery;
    $("metricTicket").textContent = `Ticket médio ${money.format(ticket)}`;
    $("metricOrdersCaption").textContent = today.length ? `${valid.length} pedidos válidos` : "Nenhum pedido hoje";
    $("metricKitchenCaption").textContent = preparing > 4 ? "Atenção ao ritmo da cozinha" : "Cozinha sob controle";
    $("metricReadyCaption").textContent = `${ready} pedido${ready === 1 ? "" : "s"} pronto${ready === 1 ? "" : "s"}`;
    $("sidebarOrdersBadge").textContent = allOrders.filter((o) => ["new","confirmed"].includes(o.status)).length;
    $("notificationDot").classList.toggle("show", allOrders.some((o) => o.status === "new"));

    updateAI(today, revenue, ticket, preparing, ready);
  }

  function updateAI(today, revenue, ticket, preparing, ready) {
    if (!today.length) {
      $("aiTitle").textContent = "Operação aguardando pedidos";
      $("aiSummary").textContent = "O painel está conectado. Quando os pedidos entrarem, a inteligência operacional destacará volume, atrasos, ticket médio e oportunidades.";
      return;
    }
    $("aiTitle").textContent = preparing > 4 ? "Atenção à fila da cozinha" : "Operação dentro do ritmo";
    $("aiSummary").textContent =
      `Hoje foram recebidos ${today.length} pedidos, com ${money.format(revenue)} em vendas e ticket médio de ${money.format(ticket)}. ` +
      `${preparing} estão em preparação e ${ready} aguardam expedição.`;
  }

  function filteredOrders() {
    const status = $("statusFilter").value;
    const query = $("globalSearch").value.trim().toLowerCase();
    return allOrders.filter((order) => {
      const matchesStatus = status === "all" || order.status === status;
      const haystack = [
        order.order_number, order.customer_name, order.customer_phone,
        sourceLabels[order.source], order.payment_method
      ].join(" ").toLowerCase();
      return matchesStatus && (!query || haystack.includes(query));
    });
  }

  function renderOrders() {
    const orders = filteredOrders();
    if (!orders.length) {
      $("ordersList").innerHTML = `<div class="empty-state"><span>◇</span><p>Nenhum pedido encontrado.</p></div>`;
      return;
    }
    $("ordersList").innerHTML = orders.slice(0, 40).map((order) => `
      <div class="order-row" data-order-id="${order.id}">
        <div class="order-code"><strong>${orderCode(order)}</strong><span>${relativeTime(order.placed_at)}</span></div>
        <div class="customer-cell"><strong>${safe(order.customer_name || "Cliente")}</strong><span>${safe(addressLabel(order))}</span></div>
        <div><span class="source-tag">${safe(sourceLabels[order.source] || order.source || "Sistema")}</span></div>
        <div class="value-cell"><strong>${money.format(Number(order.total || 0))}</strong><span>${safe(order.payment_method || "Pendente")}</span></div>
        <select class="status-select" data-id="${order.id}" data-previous="${order.status}" aria-label="Status do pedido ${orderCode(order)}">
          ${statusOptions(order.status)}
        </select>
        <button class="details-button" type="button" title="Detalhes" data-details="${order.id}">›</button>
      </div>
    `).join("");

    document.querySelectorAll(".status-select").forEach((select) => select.addEventListener("change", updateStatus));
    document.querySelectorAll("[data-details]").forEach((button) => button.addEventListener("click", () => {
      const order = allOrders.find((item) => item.id === button.dataset.details);
      showToast(orderCode(order), `${order.customer_name || "Cliente"} · ${money.format(Number(order.total || 0))}`, "▤");
    }));
  }

  function renderKitchen() {
    const groups = {
      received: allOrders.filter((o) => ["new", "confirmed"].includes(o.status)).slice(0, 5),
      preparing: allOrders.filter((o) => o.status === "preparing").slice(0, 5),
      ready: allOrders.filter((o) => o.status === "ready").slice(0, 5)
    };
    $("countReceived").textContent = groups.received.length;
    $("countPreparing").textContent = groups.preparing.length;
    $("countReady").textContent = groups.ready.length;

    const draw = (id, orders, emptyText) => {
      $(id).innerHTML = orders.length ? orders.map((order) => `
        <div class="kitchen-card"><strong>${orderCode(order)} · ${safe(sourceLabels[order.source] || "Sistema")}</strong>
        <span>${safe(order.customer_name || "Cliente")} · ${relativeTime(order.placed_at)}</span></div>
      `).join("") : `<div class="kitchen-empty">${emptyText}</div>`;
    };
    draw("kitchenReceived", groups.received, "Nenhum pedido aguardando");
    draw("kitchenPreparing", groups.preparing, "Nada em preparação");
    draw("kitchenReady", groups.ready, "Nenhum pedido pronto");
  }

  async function loadOrders(showFeedback = false) {
    if (showFeedback) showToast("Atualizando", "Buscando os dados mais recentes...", "↻");
    const { data, error } = await db
      .from("orders")
      .select("id,order_number,customer_name,customer_phone,type,status,payment_method,total,source,placed_at,delivery_address,notes")
      .order("placed_at", { ascending: false })
      .limit(100);

    if (error) {
      $("ordersList").innerHTML = `<div class="empty-state"><span>!</span><p>${safe(error.message)}</p></div>`;
      showToast("Falha de conexão", error.message, "!");
      return;
    }
    allOrders = data || [];
    renderMetrics(); renderOrders(); renderKitchen();
  }

  async function updateStatus(event) {
    const select = event.currentTarget;
    const previous = select.dataset.previous;
    select.disabled = true;
    const { error } = await db.from("orders").update({ status: select.value }).eq("id", select.dataset.id);
    select.disabled = false;
    if (error) {
      select.value = previous;
      showToast("Não foi possível atualizar", error.message, "!");
      return;
    }
    select.dataset.previous = select.value;
    const order = allOrders.find((item) => item.id === select.dataset.id);
    if (order) order.status = select.value;
    renderMetrics(); renderKitchen();
    showToast("Status atualizado", `${order ? orderCode(order) : "Pedido"} agora está como ${statusLabels[select.value]}.`);
  }

  async function requireSession() {
    const { data: { session }, error } = await db.auth.getSession();
    if (error || !session) {
      location.replace("./index.html");
      return null;
    }
    const email = session.user.email || "Administrador";
    const fullName = session.user.user_metadata?.full_name || "Natan Alves";
    $("profileName").textContent = fullName;
    $("profileEmail").textContent = email;
    $("profileAvatar").textContent = fullName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
    $("greetingName").textContent = `${fullName.split(" ")[0]}.`;
    return session;
  }

  function bindInterface() {
    $("sidebarCollapse").addEventListener("click", () => document.body.classList.toggle("sidebar-collapsed"));
    $("mobileMenu").addEventListener("click", () => {
      $("sidebar").classList.add("open"); $("sidebarOverlay").classList.add("show");
    });
    $("sidebarOverlay").addEventListener("click", closeMobileSidebar);
    $("refreshButton").addEventListener("click", () => loadOrders(true));
    $("statusFilter").addEventListener("change", renderOrders);
    $("globalSearch").addEventListener("input", renderOrders);
    $("soundButton").addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      $("soundButton").textContent = soundEnabled ? "◉" : "○";
      showToast("Som de pedidos", soundEnabled ? "Alertas sonoros ativados." : "Alertas sonoros desativados.", soundEnabled ? "♪" : "×");
    });
    $("notificationButton").addEventListener("click", () => {
      const count = allOrders.filter((o) => o.status === "new").length;
      showToast("Central de alertas", count ? `${count} pedido${count === 1 ? "" : "s"} aguardando confirmação.` : "Nenhum novo pedido aguardando.", "♢");
    });
    $("newOrderButton").addEventListener("click", openOrderModal);
    $("closeModalButton").addEventListener("click", closeOrderModal);
    $("closeModalFooter").addEventListener("click", closeOrderModal);
    $("orderModal").addEventListener("click", (event) => { if (event.target === $("orderModal")) closeOrderModal(); });
    $("logoutButton").addEventListener("click", async () => {
      await db.auth.signOut(); location.replace("./index.html");
    });
    document.querySelectorAll("[data-module]").forEach((button) => button.addEventListener("click", () => {
      document.querySelectorAll("[data-module]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      closeMobileSidebar();
      if (button.dataset.module !== "dashboard") {
        showToast("Módulo em preparação", `A área ${button.querySelector(".nav-label")?.textContent || ""} será construída na próxima etapa.`, "⚙");
      }
    }));
    document.querySelectorAll("[data-quick]").forEach((button) => button.addEventListener("click", () => {
      if (button.dataset.quick === "new-order") openOrderModal();
      else showToast("Acesso rápido", "Este módulo será conectado na sequência do projeto.", "⚡");
    }));
    document.querySelectorAll("[data-ai]").forEach((button) => button.addEventListener("click", () => {
      showToast("Inteligência Dakkai", $("aiSummary").textContent, "IA");
    }));
    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); $("globalSearch").focus();
      }
      if (event.key === "Escape") closeOrderModal();
    });
  }

  function closeMobileSidebar() {
    $("sidebar").classList.remove("open"); $("sidebarOverlay").classList.remove("show");
  }
  function openOrderModal() { $("orderModal").classList.add("show"); }
  function closeOrderModal() { $("orderModal").classList.remove("show"); }

  function subscribeRealtime() {
    realtimeChannel = db.channel("dakkai-central-operacional")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        if (payload.eventType === "INSERT") {
          playNewOrderSound();
          showToast("Novo pedido recebido", "Um novo pedido entrou na Central Dakkai.", "!");
        }
        loadOrders();
      }).subscribe((status) => {
        if (status === "SUBSCRIBED") showToast("Central conectada", "Pedidos em tempo real ativados.", "✓");
      });
  }

  function setDateLabel() {
    $("todayLabel").textContent = new Date().toLocaleDateString("pt-BR", {
      weekday: "long", day: "2-digit", month: "long"
    }).toUpperCase();
  }

  (async function init() {
    bindInterface(); setDateLabel();
    if (!await requireSession()) return;
    await loadOrders();
    subscribeRealtime();
  })();

  window.addEventListener("beforeunload", () => {
    if (realtimeChannel) db.removeChannel(realtimeChannel);
  });
})();
