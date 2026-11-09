/* Guía de HTML · interacción: menú, copiar, probar código, progreso. */
(function () {
  "use strict";

  // Almacenamiento local con protección (puede no estar disponible)
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } },
    keys() { try { return Object.keys(localStorage); } catch (e) { return []; } }
  };
  const PREFIX = "guia-html:";
  const TOTAL_EJ = 31; // E00–E30

  // ---------- Menú en móvil ----------
  const toggle = document.querySelector(".menu-toggle");
  const sidebar = document.getElementById("sidebar");
  if (toggle && sidebar) {
    toggle.addEventListener("click", () => {
      const open = sidebar.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && sidebar.classList.contains("is-open")) {
        sidebar.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  // ---------- Copiar código ----------
  document.querySelectorAll(".btn-copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const code = btn.closest("figure.code").querySelector("pre").textContent;
      try {
        await navigator.clipboard.writeText(code);
        btn.textContent = "Copiado";
      } catch (e) {
        btn.textContent = "No se pudo copiar";
      }
      setTimeout(() => { btn.textContent = "Copiar"; }, 1600);
    });
  });

  // ---------- Vista previa en vivo ----------
  function render(iframe, src) { iframe.srcdoc = src; }
  function live(textarea, iframe) {
    let t;
    render(iframe, textarea.value);
    textarea.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => render(iframe, textarea.value), 250);
    });
    // Tab inserta dos espacios; Esc + Tab permite salir con el teclado
    let escaped = false;
    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { escaped = true; return; }
      if (e.key === "Tab" && !e.shiftKey && !escaped) {
        e.preventDefault();
        const s = textarea.selectionStart, en = textarea.selectionEnd;
        textarea.setRangeText("  ", s, en, "end");
        textarea.dispatchEvent(new Event("input"));
      }
      escaped = false;
    });
  }

  const heroSrc = document.getElementById("hero-src");
  const heroOut = document.getElementById("hero-out");
  if (heroSrc && heroOut) live(heroSrc, heroOut);

  const dlg = document.getElementById("try");
  const trySrc = document.getElementById("try-src");
  const tryOut = document.getElementById("try-out");
  let original = "", opener = null;
  if (dlg && trySrc && tryOut) {
    live(trySrc, tryOut);
    document.querySelectorAll(".btn-try").forEach((btn) => {
      btn.addEventListener("click", () => {
        original = btn.closest("figure.code").querySelector("pre").textContent;
        trySrc.value = original;
        opener = btn;
        dlg.showModal();
        render(tryOut, original);
        trySrc.focus();
        trySrc.setSelectionRange(0, 0);
      });
    });
    document.getElementById("try-close").addEventListener("click", () => dlg.close());
    document.getElementById("try-reset").addEventListener("click", () => {
      trySrc.value = original;
      render(tryOut, original);
    });
    dlg.addEventListener("close", () => { if (opener) opener.focus(); });
  }

  // ---------- Progreso de ejercicios y listas ----------
  function updateProgress() {
    const done = store.keys().filter((k) => k.startsWith(PREFIX + "ej:") && store.get(k) === "1").length;
    const p = document.getElementById("progreso");
    if (!p) return;
    p.hidden = false;
    p.innerHTML = `Ejercicios hechos: <strong>${done}</strong> de ${TOTAL_EJ}`;
  }
  document.querySelectorAll("input[data-ej]").forEach((cb) => {
    const key = PREFIX + "ej:" + cb.dataset.ej;
    const h = cb.closest("h4");
    cb.checked = store.get(key) === "1";
    h.classList.toggle("is-done", cb.checked);
    cb.addEventListener("change", () => {
      store.set(key, cb.checked ? "1" : "0");
      h.classList.toggle("is-done", cb.checked);
      updateProgress();
    });
  });
  document.querySelectorAll("input[data-chk]").forEach((cb) => {
    const key = PREFIX + "chk:" + cb.dataset.chk;
    cb.checked = store.get(key) === "1";
    cb.addEventListener("change", () => store.set(key, cb.checked ? "1" : "0"));
  });
  updateProgress();

  // ---------- Índice de la página: resaltar la sección visible ----------
  const tocLinks = Array.from(document.querySelectorAll(".toc a"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    const map = new Map(tocLinks.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          tocLinks.forEach((a) => a.classList.remove("is-active"));
          const a = map.get(en.target.id);
          if (a) a.classList.add("is-active");
        }
      });
    }, { rootMargin: "0px 0px -70% 0px" });
    map.forEach((_, id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
  }
})();
