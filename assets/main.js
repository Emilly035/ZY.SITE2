(function () {
  var cfg = window.ZYVORA || {};

  function waLink(text) {
    return "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(text);
  }

  function formatPhone(digits) {
    var d = digits.replace(/^55/, "");
    return "(" + d.slice(0, 2) + ") " + d.slice(2, -4) + "-" + d.slice(-4);
  }

  // Todo elemento com data-wa vira link para o WhatsApp com a mensagem pronta.
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.href = waLink(el.getAttribute("data-wa"));
    el.target = "_blank";
    el.rel = "noopener";
  });

  var waDisplay = document.getElementById("wa-display");
  if (waDisplay && cfg.whatsapp) waDisplay.textContent = formatPhone(cfg.whatsapp);

  var legal = document.getElementById("legal-line");
  if (legal) {
    var parts = [];
    if (cfg.legalName) parts.push(cfg.legalName);
    if (cfg.cnpj) parts.push("CNPJ " + cfg.cnpj);
    if (cfg.email) parts.push(cfg.email);
    legal.textContent = parts.join(" · ");
  }

  // ---------- Cardápio de demonstração ----------
  var MENU = {
    burgers: [
      { id: "xb", name: "X-Burger", desc: "Pão brioche, blend 150 g, queijo e molho da casa", price: 24 },
      { id: "xbc", name: "X-Bacon", desc: "Blend 150 g, cheddar, bacon crocante e cebola caramelizada", price: 29 },
      { id: "xt", name: "X-Tudo", desc: "Dois blends, ovo, presunto, bacon, salada e queijo", price: 36 },
      { id: "bt", name: "Batata média", desc: "Batata frita crocante com sal e páprica", price: 14 },
    ],
    pizzas: [
      { id: "pc", name: "Calabresa (grande)", desc: "Calabresa, cebola, azeitona e orégano", price: 52 },
      { id: "pm", name: "Mussarela (grande)", desc: "Mussarela, tomate e orégano", price: 48 },
      { id: "pf", name: "Frango c/ catupiry (grande)", desc: "Frango desfiado e catupiry original", price: 58 },
    ],
    bebidas: [
      { id: "rl", name: "Refri lata", desc: "350 ml, vários sabores", price: 6 },
      { id: "r2", name: "Refri 2 L", desc: "Para dividir", price: 14 },
      { id: "sn", name: "Suco natural", desc: "Laranja ou maracujá, 500 ml", price: 10 },
    ],
  };
  var ALL = {};
  Object.keys(MENU).forEach(function (k) {
    MENU[k].forEach(function (item) { ALL[item.id] = item; });
  });

  var cart = {};
  var list = document.getElementById("menu-list");
  var countEl = document.getElementById("cart-count");
  var totalEl = document.getElementById("cart-total");
  var checkout = document.getElementById("checkout");

  function brl(v) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function renderList(cat) {
    list.innerHTML = "";
    MENU[cat].forEach(function (item) {
      var qty = cart[item.id] || 0;
      var li = document.createElement("li");
      li.className = "item";
      li.innerHTML =
        '<div class="item__info"><strong></strong><small></small><span class="item__price"></span></div>' +
        '<div class="qty">' +
        '<button type="button" data-act="dec" aria-label="Remover ' + item.name + '">−</button>' +
        '<output aria-live="polite">' + qty + "</output>" +
        '<button type="button" data-act="inc" aria-label="Adicionar ' + item.name + '">+</button>' +
        "</div>";
      li.querySelector("strong").textContent = item.name;
      li.querySelector("small").textContent = item.desc;
      li.querySelector(".item__price").textContent = brl(item.price);
      li.querySelector('[data-act="dec"]').disabled = qty === 0;
      li.addEventListener("click", function (e) {
        var act = e.target.getAttribute && e.target.getAttribute("data-act");
        if (!act) return;
        cart[item.id] = Math.max(0, (cart[item.id] || 0) + (act === "inc" ? 1 : -1));
        if (!cart[item.id]) delete cart[item.id];
        renderList(cat);
        renderCart();
      });
      list.appendChild(li);
    });
  }

  function cartTotals() {
    var n = 0, total = 0;
    Object.keys(cart).forEach(function (id) {
      n += cart[id];
      total += cart[id] * ALL[id].price;
    });
    return { n: n, total: total };
  }

  function renderCart() {
    var t = cartTotals();
    countEl.textContent = t.n === 0 ? "Nenhum item" : t.n + (t.n === 1 ? " item" : " itens");
    totalEl.textContent = brl(t.total);
    checkout.disabled = t.n === 0;
  }

  if (list) {
    var tabs = document.querySelectorAll(".menu__tabs [role=tab]");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.setAttribute("aria-selected", String(t === tab)); });
        renderList(tab.getAttribute("data-cat"));
      });
    });
    renderList("burgers");
    renderCart();

    var modal = document.getElementById("order-modal");
    var preview = document.getElementById("order-preview");
    var lastFocus = null;

    function closeModal() {
      modal.hidden = true;
      if (lastFocus) lastFocus.focus();
    }

    checkout.addEventListener("click", function () {
      var t = cartTotals();
      var lines = ["🧾 *Novo pedido · Burger do Bairro*", ""];
      Object.keys(cart).forEach(function (id) {
        lines.push(cart[id] + "× " + ALL[id].name + " — " + brl(cart[id] * ALL[id].price));
      });
      lines.push("", "Taxa de entrega: " + brl(5), "*Total: " + brl(t.total + 5) + "*", "", "Pagamento: Pix", "Entrega: Rua Exemplo, 123");
      preview.textContent = lines.join("\n");
      lastFocus = document.activeElement;
      modal.hidden = false;
      document.getElementById("modal-close").focus();
    });
    document.getElementById("modal-close").addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) closeModal(); });
  }

  // ---------- Formulário → WhatsApp ----------
  var form = document.getElementById("lead-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = document.getElementById("form-error");
      if (!form.checkValidity()) {
        err.hidden = false;
        var bad = form.querySelector(":invalid");
        if (bad) bad.focus();
        return;
      }
      err.hidden = true;
      var d = new FormData(form);
      var msg =
        "Olá, Zyvora! Vim pelo site.\n\n" +
        "Nome: " + d.get("nome").trim() + "\n" +
        "Lanchonete: " + d.get("lanchonete").trim() + "\n" +
        "Cidade: " + d.get("cidade").trim() + "\n" +
        "Recebo pedidos hoje: " + d.get("hoje") + "\n" +
        "Tenho interesse em: " + d.get("interesse");
      window.open(waLink(msg), "_blank", "noopener");
    });
  }
})();
