document.getElementById("togglePwd").addEventListener("click", function () {
  const input = document.getElementById("password");
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  this.setAttribute(
    "aria-label",
    isHidden ? "Masquer le mot de passe" : "Afficher le mot de passe"
  );
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const statut = document.getElementById("statut").value;
  const login = document.getElementById("login").value.trim();
  const password = document.getElementById("password").value;

  if (!statut || !login || !password) {
    return;
  }

  sessionStorage.setItem(
    "pharmapilote_user",
    JSON.stringify({ statut: statut, login: login })
  );

  window.location.href = "/dashboard";
});
