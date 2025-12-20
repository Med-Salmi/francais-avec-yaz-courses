/**
 * login.js - Login page JavaScript with real backend authentication
 */

document.addEventListener("DOMContentLoaded", function () {
  // RESET FORM STATE ON PAGE LOAD
  resetLoginForm();

  // Also reset when page is shown (for browser back button)
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      // Page was loaded from cache
      resetLoginForm();
    }
  });

  const loginForm = document.getElementById("loginForm");
  const errorAlert = document.getElementById("login-error");
  const errorMessage = document.getElementById("error-message");
  const submitButton = loginForm?.querySelector('button[type="submit"]');

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Get form values
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      // Quick validation
      if (!username || !password) {
        showError("Veuillez remplir tous les champs");
        return false;
      }

      // Disable button and show loading
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML =
          '<i class="fas fa-spinner fa-spin me-2"></i>Connexion...';
      }

      try {
        // Call backend API
        const response = await fetch("/backend/api/auth/login.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Login successful - REDIRECT IMMEDIATELY
          if (data.data && data.data.redirect) {
            window.location.href = data.data.redirect;
          } else {
            window.location.href = "/?page=dashboard";
          }
        } else {
          // Login failed - show error and reset button
          showError(data.message || "Erreur de connexion");
          resetSubmitButton();
        }
      } catch (error) {
        console.error("Login error:", error);
        showError("Erreur de connexion au serveur. Veuillez réessayer.");
        resetSubmitButton();
      }

      return false;
    });
  }

  // Helper functions
  function showError(message) {
    if (errorAlert && errorMessage) {
      errorMessage.textContent = message;
      errorAlert.classList.remove("d-none");
      errorAlert.classList.remove("alert-success");
      errorAlert.classList.add("alert-danger");

      // Hide error when user starts typing
      const inputs = document.querySelectorAll("#username, #password");
      inputs.forEach((input) => {
        input.addEventListener("input", () => {
          errorAlert.classList.add("d-none");
        });
      });
    }
  }

  function resetSubmitButton() {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML =
        '<i class="fas fa-sign-in-alt me-2"></i>Se connecter';
    }
  }

  function resetLoginForm() {
    // Reset submit button
    const submitBtn = document.querySelector(
      '#loginForm button[type="submit"]'
    );
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML =
        '<i class="fas fa-sign-in-alt me-2"></i>Se connecter';
    }

    // Hide any error messages
    const errorAlert = document.getElementById("login-error");
    if (errorAlert) {
      errorAlert.classList.add("d-none");
    }

    // Clear form fields
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    if (usernameInput) usernameInput.value = "";
    if (passwordInput) passwordInput.value = "";
  }
});
