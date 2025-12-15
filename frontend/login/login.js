/**
 * login.js - Login page JavaScript
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get form and elements
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  // Form submission handler
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      // Basic client-side validation
      if (!validateForm()) {
        e.preventDefault();
        return false;
      }

      // If validation passes, form will submit to backend
      console.log("Login form submitted - backend will handle authentication");
    });
  }

  // Real-time validation
  if (usernameInput) {
    usernameInput.addEventListener("blur", validateUsername);
  }

  if (passwordInput) {
    passwordInput.addEventListener("blur", validatePassword);
  }

  // Validation functions
  function validateForm() {
    let isValid = true;

    // Validate username
    if (!validateUsername()) {
      isValid = false;
    }

    // Validate password
    if (!validatePassword()) {
      isValid = false;
    }

    return isValid;
  }

  function validateUsername() {
    const username = usernameInput.value.trim();
    const feedback =
      document.getElementById("username-feedback") ||
      createFeedback("username");

    if (!username) {
      showError(usernameInput, feedback, "Le nom d'utilisateur est requis");
      return false;
    }

    if (username.length < 3) {
      showError(
        usernameInput,
        feedback,
        "Le nom d'utilisateur doit contenir au moins 3 caractères"
      );
      return false;
    }

    showSuccess(usernameInput, feedback);
    return true;
  }

  function validatePassword() {
    const password = passwordInput.value.trim();
    const feedback =
      document.getElementById("password-feedback") ||
      createFeedback("password");

    if (!password) {
      showError(passwordInput, feedback, "Le mot de passe est requis");
      return false;
    }

    if (password.length < 6) {
      showError(
        passwordInput,
        feedback,
        "Le mot de passe doit contenir au moins 6 caractères"
      );
      return false;
    }

    showSuccess(passwordInput, feedback);
    return true;
  }

  // Helper functions
  function createFeedback(fieldId) {
    const div = document.createElement("div");
    div.id = fieldId + "-feedback";
    div.className = "invalid-feedback";

    const input = document.getElementById(fieldId);
    const parent = input.parentNode;
    parent.appendChild(div);

    return div;
  }

  function showError(input, feedback, message) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    feedback.textContent = message;
    feedback.style.display = "block";
  }

  function showSuccess(input, feedback) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    feedback.style.display = "none";
  }

  // Add Bootstrap validation classes on input
  function setupInputValidation(input) {
    input.addEventListener("input", function () {
      if (this.value.trim()) {
        this.classList.remove("is-invalid");
        this.classList.add("is-valid");
      } else {
        this.classList.remove("is-valid");
      }
    });
  }

  // Setup validation for both inputs
  if (usernameInput) setupInputValidation(usernameInput);
  if (passwordInput) setupInputValidation(passwordInput);
});
