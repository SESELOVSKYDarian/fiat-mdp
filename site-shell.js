(function () {
  const SESSION_KEY = "mg_arg_session_user";

  function getActivePage(pathname) {
    const page = (pathname.split("/").pop() || "index.html").toLowerCase();
    if (page === "sorteos.html") return "sorteos";
    if (page === "ruleta.html") return "ruleta";
    return "inicio";
  }

  function readSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      return {
        email: String(parsed.email || "").trim(),
        name: String(parsed.name || "").trim(),
        role: String(parsed.role || "user").trim(),
      };
    } catch (_error) {
      return null;
    }
  }

  function linkClass(active, current) {
    return "site-shell__link" + (active === current ? " is-active" : "");
  }

  function renderShell() {
    const active = getActivePage(window.location.pathname);
    const session = readSession();
    const authHref = session ? "perfil.html" : "login.html";
    const authLabel = session ? "Mi perfil" : "Iniciar sesion";
    const shell = document.createElement("div");
    shell.className = "site-shell";
    shell.innerHTML =
      '<div class="site-shell__inner">' +
      '<a class="site-shell__brand" href="index.html" aria-label="Inicio">' +
      '<img class="site-shell__logo site-shell__logo--copa" src="calogo.png" alt="Logo Copa Argentina" />' +
      '<img class="site-shell__logo site-shell__logo--fiat" src="fiatlogo.png" alt="Logo Fiat" />' +
      "</a>" +
      '<nav class="site-shell__nav" aria-label="Principal">' +
      '<a class="' +
      linkClass(active, "inicio") +
      '" href="index.html">Inicio</a>' +
      '<a class="' +
      linkClass(active, "sorteos") +
      '" href="sorteos.html">Sorteos</a>' +
      '<a class="' +
      linkClass(active, "ruleta") +
      '" href="ruleta.html">Ruleta</a>' +
      "</nav>" +
      '<a class="site-shell__auth" href="' +
      authHref +
      '">' +
      authLabel +
      "</a>" +
      '<button class="site-shell__toggle" type="button" id="siteShellToggle" aria-label="Abrir menu">Menu</button>' +
      "</div>" +
      '<div class="site-shell__mobile" id="siteShellMobile">' +
      '<div class="site-shell__mobile-card">' +
      '<a class="' +
      linkClass(active, "inicio") +
      '" href="index.html">Inicio</a>' +
      '<a class="' +
      linkClass(active, "sorteos") +
      '" href="sorteos.html">Sorteos</a>' +
      '<a class="' +
      linkClass(active, "ruleta") +
      '" href="ruleta.html">Ruleta</a>' +
      '<a class="site-shell__auth" href="' +
      authHref +
      '">' +
      authLabel +
      "</a>" +
      "</div>" +
      "</div>";

    document.body.prepend(shell);
    document.body.classList.add("site-shell-ready");
    const toggle = document.getElementById("siteShellToggle");
    const mobile = document.getElementById("siteShellMobile");
    if (toggle && mobile) {
      toggle.addEventListener("click", function () {
        mobile.classList.toggle("is-open");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderShell);
  } else {
    renderShell();
  }
})();
