/**
 * edit_lesson.js - Edit Lesson page JavaScript
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Edit Lesson page loaded");

  // Get elements
  const editLessonForm = document.getElementById("editLessonForm");
  const successAlert = document.getElementById("success-message");
  const successText = document.getElementById("message-text");
  const errorAlert = document.getElementById("error-message");
  const errorText = document.getElementById("error-text");
  const submitBtn = document.getElementById("submit-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const lessonId = document.getElementById("lesson_id")
    ? document.getElementById("lesson_id").value
    : 0;

  // Form submission handler
  if (editLessonForm) {
    editLessonForm.addEventListener("submit", function (e) {
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
        // For demo - simulate successful update
        const formData = getFormData();
        console.log("Update form data:", formData);

        // Show success message
        showSuccessMessage("Leçon modifiée avec succès!");

        // Update lesson info in the display
        updateLessonInfo(formData);

        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<i class="fas fa-save me-2"></i>Enregistrer les modifications';
      }, 1500);

      return false;
    });
  }

  // Delete button handler
  if (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      if (
        confirm(
          "Êtes-vous ABSOLUMENT sûr de vouloir supprimer cette leçon ? Toutes les questions de quiz associées seront également supprimées. Cette action est irréversible."
        )
      ) {
        if (
          confirm(
            "Dernière confirmation : Voulez-vous vraiment supprimer définitivement cette leçon ?"
          )
        ) {
          // Simulate deletion (will be replaced with backend)
          console.log("Deleting lesson:", lessonId);

          // Show loading on delete button
          deleteBtn.disabled = true;
          deleteBtn.innerHTML =
            '<i class="fas fa-spinner fa-spin me-2"></i>Suppression...';

          setTimeout(() => {
            // Simulate successful deletion
            showSuccessMessage("Leçon supprimée avec succès! Redirection...");

            // Redirect to manage lessons after 2 seconds
            setTimeout(() => {
              window.location.href = "/?page=manage-lessons&deleted=1";
            }, 2000);
          }, 1500);
        }
      }
    });
  }

  // Real-time validation on input
  const formInputs = editLessonForm.querySelectorAll("input, textarea, select");
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
    const categoryId = document.getElementById("category_id").value;
    const categoryText =
      document.getElementById("category_id").options[
        document.getElementById("category_id").selectedIndex
      ].text;

    return {
      lesson_id: lessonId,
      title: document.getElementById("title").value.trim(),
      category_id: categoryId,
      category_name: categoryText,
      content: document.getElementById("content").value.trim(),
      video_url: document.getElementById("video_url").value.trim(),
      updated_at: new Date().toISOString(),
    };
  }

  // Function to update lesson info display
  function updateLessonInfo(formData) {
    const lessonInfo = document.getElementById("lesson-info");
    if (lessonInfo) {
      // Update category name in info
      const items = lessonInfo.querySelectorAll("li");
      if (items.length >= 4) {
        // Update category (4th item)
        items[3].innerHTML = `Catégorie actuelle: ${formData.category_name}`;

        // Update last modified date
        const now = new Date(formData.updated_at);
        const formattedDate = now.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        items[2].innerHTML = `Dernière modification: ${formattedDate}`;
      }
    }
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

  // Add character counter for content
  const contentField = document.getElementById("content");
  if (contentField) {
    // Create character counter
    const counter = document.createElement("div");
    counter.className = "form-text text-end";
    counter.id = "char-counter";
    counter.textContent = contentField.value.length + " caractères";

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

  // Check for success messages from URL
  checkUrlMessages();

  // Function to check for messages in URL
  function checkUrlMessages() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("updated") === "1") {
      showSuccessMessage("Leçon modifiée avec succès!");
      cleanURL();
    }
  }

  // Function to clean URL (remove message parameters)
  function cleanURL() {
    const url = new URL(window.location);
    url.searchParams.delete("updated");
    window.history.replaceState({}, document.title, url.toString());
  }
});
