(function () {
  var KEY = "rcm-settings";
  var DEFAULTS = {
    font: "medium", dark: false, contrast: false, keyboard: false, reader: false,
    email: true, push: false, frequency: "immediate", lang: "pt-BR", accent: "azul"
  };

  function load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch (e) { return Object.assign({}, DEFAULTS); }
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  /* Escreve as preferências como data-attributes no <html> (o CSS lê daí) */
  function apply(s) {
    var r = document.documentElement;
    r.dataset.font = s.font;       r.dataset.dark = s.dark;
    r.dataset.contrast = s.contrast; r.dataset.keyboard = s.keyboard;
    r.dataset.reader = s.reader;   r.dataset.accent = s.accent;
    r.lang = s.lang;
  }

  var state = load();
  /* Primeira visita: segue o modo escuro do sistema */
  if (!localStorage.getItem(KEY) && window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) {
    state.dark = true;
  }
  apply(state); // roda já no <head>: evita "piscar" ao carregar

  document.addEventListener("DOMContentLoaded", function () {
    var toast = document.getElementById("toast"), msg = document.getElementById("toast-msg"), timer;
    function notify(text) {
      if (!toast) return;
      (msg || toast).textContent = text;
      toast.classList.add("show");
      clearTimeout(timer); timer = setTimeout(function () { toast.classList.remove("show"); }, 2400);
    }

    /* ---------- Configurações ---------- */
    var controls = document.querySelectorAll("[data-setting]");
    function paint(el) {
      var k = el.dataset.setting;
      if (el.type === "checkbox") el.checked = !!state[k];
      else if (el.type === "radio") el.checked = el.value === String(state[k]);
      else el.value = state[k];
    }
    controls.forEach(function (el) {
      paint(el);
      el.addEventListener("change", function () {
        var k = el.dataset.setting, v = el.type === "checkbox" ? el.checked : el.value;

        if (k === "push" && v) { // push precisa de permissão do navegador
          if (!("Notification" in window)) { el.checked = false; return notify("Este navegador não oferece notificações push."); }
          Notification.requestPermission().then(function (p) {
            state.push = p === "granted"; el.checked = state.push; save(state);
            notify(state.push ? "Notificações push ativadas." : "Permissão negada. Libere nas configurações do navegador.");
          });
          return;
        }
        state[k] = v; save(state); apply(state);
        notify(k === "lang" ? "Idioma atualizado." : "Preferência atualizada.");
      });
    });
    var reset = document.getElementById("reset");
    if (reset) reset.addEventListener("click", function () {
      state = Object.assign({}, DEFAULTS); save(state); apply(state);
      controls.forEach(paint); notify("Configurações restauradas com os valores recomendados.");
    });

    /* ---------- Ajuda: accordion ---------- */
    var items = document.querySelectorAll(".faq-item");
    items.forEach(function (item) {
      var btn = item.querySelector(".faq-q"), panel = item.querySelector(".faq-a");
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open)); panel.hidden = open;
      });
    });

    /* ---------- Ajuda: busca ---------- */
    var q = document.getElementById("help-search"), none = document.getElementById("faq-empty");
    if (q) q.addEventListener("input", function () {
      var term = q.value.trim().toLowerCase(), shown = 0;
      items.forEach(function (item) {
        var hit = !term || item.textContent.toLowerCase().indexOf(term) > -1;
        item.hidden = !hit; if (hit) shown++;
      });
      if (none) none.hidden = shown > 0;
    });

    /* ---------- Ajuda: formulário (Netlify Forms) ---------- */
    var form = document.getElementById("contact-form"), status = document.getElementById("form-status");
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true; status.textContent = "Enviando…";
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (r) {
        if (!r.ok) throw new Error();
        form.reset(); status.textContent = "";
        notify("Mensagem enviada. Respondemos em até 2 dias úteis.");
      }).catch(function () {
        status.textContent = "Não foi possível enviar a mensagem. Tente novamente ou utilize o WhatsApp.";
      }).finally(function () { btn.disabled = false; });
    });
  });
})();
