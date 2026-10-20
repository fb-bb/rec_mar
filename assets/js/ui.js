/* =========================================================
   Recife Contra a Maré – lógica de Configurações e Ajuda
   Inclua este arquivo no <head> de TODAS as páginas (com defer
   NÃO) para que as preferências sejam aplicadas em todo o site.
   ========================================================= */
(function () {
  var KEY = "rcm-settings";
  var DEFAULTS = {
    font: "medium", dark: false, contrast: false, keyboard: false, reader: false,
    email: true, push: false, frequency: "immediate", lang: "pt-BR", accent: "azul"
  };

  /* ---------- Armazenamento ---------- */
  function load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch (e) { return Object.assign({}, DEFAULTS); }
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  /* ---------- Aplica as preferências no <html> ---------- */
  function apply(s) {
    var r = document.documentElement;
    r.dataset.font = s.font;
    r.dataset.dark = s.dark;
    r.dataset.contrast = s.contrast;
    r.dataset.keyboard = s.keyboard;
    r.dataset.reader = s.reader;
    r.dataset.accent = s.accent;
    r.lang = s.lang;
  }
  var state = load();
  apply(state); // roda imediatamente, evitando "piscar" ao carregar

  /* Primeira visita: respeita o modo escuro do sistema */
  if (!localStorage.getItem(KEY) && window.matchMedia &&
      matchMedia("(prefers-color-scheme: dark)").matches) {
    state.dark = true; apply(state);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var toast = document.getElementById("toast");
    var timer;
    function notify(msg) {
      if (!toast) return;
      toast.textContent = msg; toast.classList.add("show");
      clearTimeout(timer); timer = setTimeout(function () { toast.classList.remove("show"); }, 2200);
    }

    /* ---------- Página de Configurações ---------- */
    var controls = document.querySelectorAll("[data-setting]");
    controls.forEach(function (el) {
      var k = el.dataset.setting;
      // Estado inicial dos controles
      if (el.type === "checkbox") el.checked = !!state[k];
      else if (el.type === "radio") el.checked = el.value === String(state[k]);
      else el.value = state[k];

      el.addEventListener("change", function () {
        var v = el.type === "checkbox" ? el.checked : el.value;

        // Push exige permissão do navegador
        if (k === "push" && v) {
          if (!("Notification" in window)) { el.checked = false; return notify("Seu navegador não oferece notificações push."); }
          Notification.requestPermission().then(function (p) {
            if (p !== "granted") { el.checked = false; state.push = false; save(state); return notify("Permissão negada. Ative nas configurações do navegador."); }
            state.push = true; save(state); notify("Notificações push ativadas.");
          });
          return;
        }
        state[k] = v; save(state); apply(state);
        notify(k === "lang" ? "Idioma salvo. Traduza os textos com o seu sistema de i18n." : "Preferência salva.");
      });
    });

    var reset = document.getElementById("reset");
    if (reset) reset.addEventListener("click", function () {
      state = Object.assign({}, DEFAULTS); save(state); apply(state);
      controls.forEach(function (el) {
        var k = el.dataset.setting;
        if (el.type === "checkbox") el.checked = !!state[k];
        else if (el.type === "radio") el.checked = el.value === String(state[k]);
        else el.value = state[k];
      });
      notify("Configurações restauradas.");
    });

    /* ---------- Página de Ajuda: accordion ---------- */
    var items = document.querySelectorAll(".faq-item");
    items.forEach(function (item) {
      var btn = item.querySelector(".faq-q"), panel = item.querySelector(".faq-a");
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        panel.hidden = open;
      });
    });

    /* ---------- Página de Ajuda: busca ---------- */
    var q = document.getElementById("help-search"), none = document.getElementById("faq-empty");
    if (q) q.addEventListener("input", function () {
      var term = q.value.trim().toLowerCase(), shown = 0;
      items.forEach(function (item) {
        var hit = !term || item.textContent.toLowerCase().indexOf(term) > -1;
        item.hidden = !hit; if (hit) shown++;
      });
      if (none) none.hidden = shown > 0;
    });

    /* ---------- Página de Ajuda: formulário ---------- */
    var form = document.getElementById("contact-form"), status = document.getElementById("form-status");
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true; status.textContent = "Enviando…";
      /* Netlify Forms: já funciona no seu site. Para outro backend,
         troque a URL e o formato do envio abaixo. */
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (r) {
        if (!r.ok) throw new Error();
        form.reset(); status.textContent = "Mensagem enviada. Respondemos em até 2 dias úteis.";
      }).catch(function () {
        status.textContent = "Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.";
      }).finally(function () { btn.disabled = false; });
    });
  });
})();
