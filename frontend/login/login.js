/**
 * login.js - Login page JavaScript (Simplified)
 */

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const errorAlert = document.getElementById("login-error");
  const errorMessage = document.getElementById("error-message");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      // Quick validation
      if (!username || !password) {
        showError("Veuillez remplir tous les champs");
        return false;
      }

      // Check credentials (demo only)
      if (username === "admin" && password === "french123") {
        // Success - redirect immediately
        window.location.href = "/?page=dashboard";
      } else {
        // Failure - show error
        showError("Nom d'utilisateur ou mot de passe incorrect.");
      }

      return false;
    });
  }

  function showError(message) {
    if (errorAlert && errorMessage) {
      errorMessage.textContent = message;
      errorAlert.classList.remove("d-none");

      // Hide error when user starts typing again
      const inputs = document.querySelectorAll("#username, #password");
      inputs.forEach((input) => {
        input.addEventListener("input", () => {
          errorAlert.classList.add("d-none");
        });
      });
    }
  }
});
