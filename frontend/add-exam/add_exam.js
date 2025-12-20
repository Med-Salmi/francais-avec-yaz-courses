/**
 * add_exam.js - Add Exam page JavaScript
 * UPDATED: Now uses real API calls
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Add Exam page loaded");

  // First check authentication
  checkAuth();

  // Get form and elements
  const addExamForm = document.getElementById("addExamForm");
  const successAlert = document.getElementById("success-message");
  const successText = document.getElementById("message-text");
  const errorAlert = document.getElementById("error-message");
  const errorText = document.getElementById("error-text");
  const resetBtn = document.getElementById("reset-btn");
  const submitBtn = document.getElementById("submit-btn");
  const examUploadArea = document.getElementById("exam-upload-area");
  const correctionUploadArea = document.getElementById(
    "correction-upload-area"
  );
  const examFileInput = document.getElementById("exam_pdf");
  const correctionFileInput = document.getElementById("correction_pdf");
  const examFileName = document.getElementById("exam_file_name");
  const correctionFileName = document.getElementById("correction_file_name");

  // Initialize file upload areas
  initFileUploadArea(examUploadArea, examFileInput, examFileName, "exam");
  initFileUploadArea(
    correctionUploadArea,
    correctionFileInput,
    correctionFileName,
    "correction"
  );

  // Form submission handler
  if (addExamForm) {
    addExamForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Validate form
      if (!validateForm()) {
        return false;
      }

      // Check if user wants to proceed without files
      const examFile = examFileInput.files[0];
      const correctionFile = correctionFileInput.files[0];

      if (!examFile && !correctionFile) {
        if (
          !confirm(
            "Aucun fichier PDF n'a été sélectionné. Voulez-vous continuer sans fichier ?"
          )
        ) {
          return false;
        }
      }

      // Disable submit button to prevent double submission
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin me-2"></i>Enregistrement...';

      try {
        // Create FormData object
        const formData = new FormData();

        // Add text fields
        formData.append("title", document.getElementById("title").value.trim());
        formData.append(
          "description",
          document.getElementById("description").value.trim()
        );

        const examYear = document.getElementById("exam_year").value;
        if (examYear) {
          formData.append("exam_year", examYear);
        }

        // Add files if they exist
        if (examFile) {
          formData.append("exam_pdf", examFile);
        }
        if (correctionFile) {
          formData.append("correction_pdf", correctionFile);
        }

        // Send request to backend API
        const response = await fetch("/backend/api/exams/create.php", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const result = await response.json();

        if (result.success) {
          showSuccessMessage(
            "Examen ajouté avec succès! Vous allez être redirigé..."
          );

          // Reset form
          addExamForm.reset();
          resetFileDisplays();

          // Reset year field to current year
          document.getElementById("exam_year").value = new Date().getFullYear();

          // Redirect to manage exams after 2 seconds
          setTimeout(() => {
            window.location.href = "/?page=manage-exams&added=1";
          }, 2000);
        } else {
          throw new Error(result.message || "Erreur lors de la création");
        }
      } catch (error) {
        console.error("Error creating exam:", error);
        showError(error.message || "Erreur lors de l'enregistrement");
      } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<i class="fas fa-save me-2"></i>Enregistrer l\'examen';
      }

      return false;
    });
  }

  // Reset button handler
  if (resetBtn) {
    resetBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (
        confirm(
          "Êtes-vous sûr de vouloir effacer tous les champs du formulaire ?"
        )
      ) {
        addExamForm.reset();
        resetFileDisplays();
        hideAllAlerts();
        // Reset year field to current year
        document.getElementById("exam_year").value = new Date().getFullYear();
        console.log("Form reset");
      }
    });
  }

  // Real-time validation on input
  const formInputs = addExamForm.querySelectorAll("input, textarea, select");
  formInputs.forEach((input) => {
    input.addEventListener("input", function () {
      // Remove error styling when user starts typing
      this.classList.remove("is-invalid");

      // Hide error alert
      hideErrorAlert();
    });
  });

  // Function to initialize file upload area
  function initFileUploadArea(area, input, display, type) {
    // Click handler
    area.addEventListener("click", function () {
      input.click();
    });

    // Input change handler
    input.addEventListener("change", function () {
      updateFileDisplay(input, display, type);
    });

    // Drag and drop handlers
    area.addEventListener("dragover", function (e) {
      e.preventDefault();
      this.classList.add("dragover");
    });

    area.addEventListener("dragleave", function (e) {
      e.preventDefault();
      this.classList.remove("dragover");
    });

    area.addEventListener("drop", function (e) {
      e.preventDefault();
      this.classList.remove("dragover");

      if (e.dataTransfer.files.length > 0) {
        input.files = e.dataTransfer.files;
        updateFileDisplay(input, display, type);
      }
    });
  }

  // Function to update file display
  function updateFileDisplay(input, display, type) {
    if (input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      if (file.type !== "application/pdf") {
        showError("Seuls les fichiers PDF sont autorisés.");
        input.value = "";
        display.innerHTML = "Aucun fichier sélectionné";
        display.parentElement.classList.remove("file-upload-success");
        return;
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        showError("Le fichier est trop volumineux. Maximum 10MB.");
        input.value = "";
        display.innerHTML = "Aucun fichier sélectionné";
        display.parentElement.classList.remove("file-upload-success");
        return;
      }

      // Update display
      display.innerHTML = `
        <i class="fas fa-file-pdf text-danger me-1"></i>
        <strong>${file.name}</strong>
        <br>
        <small>${formatFileSize(file.size)}</small>
      `;

      // Highlight area
      display.parentElement.classList.add("file-upload-success");

      // Hide any previous errors
      hideErrorAlert();
    } else {
      display.innerHTML = "Aucun fichier sélectionné";
      display.parentElement.classList.remove("file-upload-success");
    }
  }

  // Function to reset file displays
  function resetFileDisplays() {
    examFileName.innerHTML = "Aucun fichier sélectionné";
    correctionFileName.innerHTML = "Aucun fichier sélectionné";
    examUploadArea.classList.remove("file-upload-success");
    correctionUploadArea.classList.remove("file-upload-success");
  }

  // Function to validate form
  function validateForm() {
    let isValid = true;

    // Get form elements
    const title = document.getElementById("title").value.trim();
    const examYear = document.getElementById("exam_year").value.trim();
    const examFile = examFileInput.files[0];
    const correctionFile = correctionFileInput.files[0];

    // Reset all error states
    hideAllAlerts();
    formInputs.forEach((input) => input.classList.remove("is-invalid"));

    // Validate title
    if (!title) {
      showError("Le titre est obligatoire.");
      document.getElementById("title").classList.add("is-invalid");
      isValid = false;
    } else if (title.length < 5) {
      showError("Le titre doit contenir au moins 5 caractères.");
      document.getElementById("title").classList.add("is-invalid");
      isValid = false;
    }

    // Validate year (optional but if provided, must be valid)
    if (examYear) {
      const yearNum = parseInt(examYear);
      const currentYear = new Date().getFullYear();

      if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2035) {
        showError("L'année doit être comprise entre 2000 et 2035.");
        document.getElementById("exam_year").classList.add("is-invalid");
        isValid = false;
      }
    }

    // Validate files
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (examFile && examFile.size > maxSize) {
      showError("Le fichier sujet est trop volumineux (max 10MB).");
      examUploadArea.classList.add("is-invalid");
      isValid = false;
    }

    if (correctionFile && correctionFile.size > maxSize) {
      showError("Le fichier correction est trop volumineux (max 10MB).");
      correctionUploadArea.classList.add("is-invalid");
      isValid = false;
    }

    return isValid;
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

  // Function to format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Add character counter for description
  const descriptionField = document.getElementById("description");
  if (descriptionField) {
    // Create character counter
    const counter = document.createElement("div");
    counter.className = "form-text text-end";
    counter.id = "desc-char-counter";
    counter.textContent = "0 caractères";

    // Insert after description field
    descriptionField.parentNode.insertBefore(
      counter,
      descriptionField.nextSibling
    );

    // Update counter on input
    descriptionField.addEventListener("input", function () {
      const charCount = this.value.length;
      counter.textContent = `${charCount} caractères`;

      // Change color based on count
      if (charCount > 500) {
        counter.style.color = "#ffc107";
      } else {
        counter.style.color = "#6c757d";
      }
    });

    // Trigger initial count
    descriptionField.dispatchEvent(new Event("input"));
  }

  // Add visual feedback for drag over
  const uploadAreas = document.querySelectorAll(".file-upload-area");
  uploadAreas.forEach((area) => {
    area.addEventListener("dragover", function () {
      this.style.borderColor = "#4361ee";
      this.style.backgroundColor = "#f0f4ff";
    });

    area.addEventListener("dragleave", function () {
      this.style.borderColor = "";
      this.style.backgroundColor = "";
    });

    area.addEventListener("drop", function () {
      this.style.borderColor = "";
      this.style.backgroundColor = "";
    });
  });

  // Form validation on blur for required fields
  const titleField = document.getElementById("title");
  if (titleField) {
    titleField.addEventListener("blur", function () {
      if (!this.value.trim()) {
        this.classList.add("is-invalid");
      } else {
        this.classList.remove("is-invalid");
      }
    });
  }

  // Year field validation on blur
  const yearField = document.getElementById("exam_year");
  if (yearField) {
    yearField.addEventListener("blur", function () {
      const value = this.value.trim();
      if (value) {
        const yearNum = parseInt(value);
        if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2035) {
          this.classList.add("is-invalid");
        } else {
          this.classList.remove("is-invalid");
        }
      }
    });
  }
});

// Function to check authentication
async function checkAuth() {
  try {
    const response = await fetch("/backend/api/auth/check.php", {
      credentials: "include",
    });

    if (!response.ok) {
      // Not authenticated, redirect to login
      window.location.href = "/?page=login";
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    window.location.href = "/?page=login";
  }
}
