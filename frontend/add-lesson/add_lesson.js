/**
 * add_lesson.js - Add Lesson page JavaScript
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Add Lesson page loaded");

  // Get form and elements
  const addLessonForm = document.getElementById("addLessonForm");
  const successAlert = document.getElementById("success-message");
  const successText = document.getElementById("message-text");
  const errorAlert = document.getElementById("error-message");
  const errorText = document.getElementById("error-text");
  const resetBtn = document.getElementById("reset-btn");
  const submitBtn = document.getElementById("submit-btn");

  // Form submission handler
  if (addLessonForm) {
    addLessonForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validate form
      if (!validateForm()) {
        return false;
      }

      // Disable submit button to prevent double submission
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin me-2"></i>Enregistrement...';

      // Simulate API call (will be replaced with backend)
      setTimeout(() => {
        // For demo - simulate successful submission
        const formData = getFormData();
        console.log("Form data:", formData);

        // Show success message
        showSuccessMessage(
          "Leçon ajoutée avec succès! Vous allez être redirigé..."
        );

        // Reset form
        addLessonForm.reset();

        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<i class="fas fa-save me-2"></i>Enregistrer la leçon';

        // Redirect to manage lessons after 2 seconds
        setTimeout(() => {
          window.location.href = "/?page=manage-lessons&added=1";
        }, 2000);
      }, 1500);

      return false;
    });
  }

  // Reset button handler
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (
        confirm(
          "Êtes-vous sûr de vouloir effacer tous les champs du formulaire ?"
        )
      ) {
        addLessonForm.reset();
        hideAllAlerts();
        console.log("Form reset");
      }
    });
  }

  // Real-time validation on input
  const formInputs = addLessonForm.querySelectorAll("input, textarea, select");
  formInputs.forEach((input) => {
    input.addEventListener("input", function () {
      // Remove error styling when user starts typing
      this.classList.remove("is-invalid");

      // Hide error alert
      hideErrorAlert();
    });
  });

  // Function to validate form
  function validateForm() {
    let isValid = true;

    // Get form elements
    const title = document.getElementById("title").value.trim();
    const categoryId = document.getElementById("category_id").value;
    const content = document.getElementById("content").value.trim();
    const videoUrl = document.getElementById("video_url").value.trim();

    // Reset all error states
    hideAllAlerts();
    formInputs.forEach((input) => input.classList.remove("is-invalid"));

    // Validate title
    if (!title) {
      showError("Le titre est obligatoire");
      document.getElementById("title").classList.add("is-invalid");
      isValid = false;
    } else if (title.length < 5) {
      showError("Le titre doit contenir au moins 5 caractères");
      document.getElementById("title").classList.add("is-invalid");
      isValid = false;
    }

    // Validate category
    if (!categoryId) {
      showError("La catégorie est obligatoire");
      document.getElementById("category_id").classList.add("is-invalid");
      isValid = false;
    }

    // Validate content
    if (!content) {
      showError("Le contenu est obligatoire");
      document.getElementById("content").classList.add("is-invalid");
      isValid = false;
    } else if (content.length < 50) {
      showError("Le contenu doit contenir au moins 50 caractères");
      document.getElementById("content").classList.add("is-invalid");
      isValid = false;
    }

    // Validate video URL format if provided
    if (videoUrl && !isValidUrl(videoUrl)) {
      showError("L'URL de la vidéo n'est pas valide");
      document.getElementById("video_url").classList.add("is-invalid");
      isValid = false;
    }

    return isValid;
  }

  // Function to get form data
  function getFormData() {
    return {
      title: document.getElementById("title").value.trim(),
      category_id: document.getElementById("category_id").value,
      content: document.getElementById("content").value.trim(),
      video_url: document.getElementById("video_url").value.trim(),
    };
  }

  // Function to show success message
  function showSuccessMessage(message) {
    if (successAlert && successText) {
      successText.textContent = message;
      successAlert.classList.remove("d-none");

      // Scroll to top to show message
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Auto-hide after 5 seconds
      setTimeout(() => {
        successAlert.classList.add("d-none");
      }, 5000);
    }
  }

  // Function to show error message
  function showError(message) {
    if (errorAlert && errorText) {
      errorText.textContent = message;
      errorAlert.classList.remove("d-none");

      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Function to hide error alert
  function hideErrorAlert() {
    if (errorAlert) {
      errorAlert.classList.add("d-none");
    }
  }

  // Function to hide all alerts
  function hideAllAlerts() {
    if (successAlert) successAlert.classList.add("d-none");
    if (errorAlert) errorAlert.classList.add("d-none");
  }

  // Function to validate URL
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Form validation on blur
  const requiredFields = ["title", "category_id", "content"];
  requiredFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("blur", function () {
        if (!this.value.trim() && this.type !== "select-one") {
          this.classList.add("is-invalid");
        } else {
          this.classList.remove("is-invalid");
        }
      });
    }
  });

  // Add character counter for content
  const contentField = document.getElementById("content");
  if (contentField) {
    // Create character counter
    const counter = document.createElement("div");
    counter.className = "form-text text-end";
    counter.id = "char-counter";
    counter.textContent = "0 caractères";

    // Insert after content field
    contentField.parentNode.insertBefore(counter, contentField.nextSibling);

    // Update counter on input
    contentField.addEventListener("input", function () {
      const charCount = this.value.length;
      counter.textContent = `${charCount} caractères`;

      // Change color based on count
      if (charCount < 50) {
        counter.style.color = "#dc3545";
      } else if (charCount < 100) {
        counter.style.color = "#ffc107";
      } else {
        counter.style.color = "#28a745";
      }
    });

    // Trigger initial count
    contentField.dispatchEvent(new Event("input"));
  }
});
