/**
 * edit_exam.js - Edit Exam page JavaScript
 * UPDATED: Now handles 3 file uploads instead of 2
 */

// API URLs
const GET_EXAM_API = "/backend/api/exams/get_single.php";
const UPDATE_EXAM_API = "/backend/api/exams/update.php";
const DELETE_EXAM_API = "/backend/api/exams/delete.php";

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Edit Exam page loaded");

  // Get exam ID from hidden div
  const examDataDiv = document.getElementById("exam-data");
  const examId = examDataDiv ? parseInt(examDataDiv.dataset.examId) : 0;

  if (!examId || examId <= 0) {
    showError("ID d'examen invalide.");
    showNotFound();
    return;
  }

  // Get elements
  const loadingState = document.getElementById("loading-state");
  const formContainer = document.getElementById("exam-form-container");
  const examNotFound = document.getElementById("exam-not-found");
  const editExamForm = document.getElementById("editExamForm");
  const successAlert = document.getElementById("success-message");
  const successText = document.getElementById("message-text");
  const errorAlert = document.getElementById("error-message");
  const errorText = document.getElementById("error-text");
  const resetBtn = document.getElementById("reset-btn");
  const submitBtn = document.getElementById("submit-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const examIdElement = document.getElementById("exam-id");
  const examInfoElement = document.getElementById("exam-info");

  // Current file containers (UPDATED: 3 instead of 2)
  const currentExamFileContainer = document.getElementById(
    "current-exam-file-container"
  );
  const currentCorrectionLangueFileContainer = document.getElementById(
    "current-correction-langue-file-container"
  );
  const currentCorrectionProductionFileContainer = document.getElementById(
    "current-correction-production-file-container"
  );

  // File upload elements (UPDATED: 3 instead of 2)
  const examUploadArea = document.getElementById("exam-upload-area");
  const correctionLangueUploadArea = document.getElementById(
    "correction-langue-upload-area"
  );
  const correctionProductionUploadArea = document.getElementById(
    "correction-production-upload-area"
  );
  const examFileInput = document.getElementById("exam_pdf");
  const correctionLangueFileInput = document.getElementById(
    "correction_langue_pdf"
  );
  const correctionProductionFileInput = document.getElementById(
    "correction_production_pdf"
  );
  const examFileName = document.getElementById("exam_file_name");
  const correctionLangueFileName = document.getElementById(
    "correction_langue_file_name"
  );
  const correctionProductionFileName = document.getElementById(
    "correction_production_file_name"
  );

  // Initialize the page
  initPage();

  // Function to initialize the page
  async function initPage() {
    // First check authentication
    await checkAuth();

    // Load exam data from backend
    await loadExamData(examId);
  }

  // Function to load exam data from API
  async function loadExamData(examId) {
    try {
      const response = await fetch(`${GET_EXAM_API}?id=${examId}`, {
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        displayExamData(result.data.exam);
        hideLoadingState();
        showForm();
      } else {
        throw new Error(result.message || "Examen non trouvé");
      }
    } catch (error) {
      console.error("Error loading exam:", error);
      hideLoadingState();
      showNotFound();
      showError("Erreur de chargement: " + error.message);
    }
  }

  // Function to display exam data
  function displayExamData(exam) {
    // Update exam ID in header
    examIdElement.textContent = `#${exam.id}`;

    // Set form values
    document.getElementById("exam_id").value = exam.id;
    document.getElementById("title").value = exam.title;
    document.getElementById("description").value = exam.description || "";
    document.getElementById("exam_year").value = exam.exam_year || "";

    // Update exam info card
    const createdDate = formatDate(exam.created_at);
    const updatedDate = formatDate(exam.updated_at);

    examInfoElement.innerHTML = `
      <li class="mb-2">
        <strong>ID:</strong> ${exam.id}
      </li>
      <li class="mb-2">
        <strong>Niveau:</strong> 1ère Année Bac
      </li>
      <li class="mb-2">
        <strong>Date d'ajout:</strong><br>
        ${createdDate}
      </li>
      ${
        exam.updated_at && exam.updated_at !== exam.created_at
          ? `
      <li>
        <strong>Dernière modification:</strong><br>
        ${updatedDate}
      </li>
      `
          : ""
      }
    `;

    // Display current files (UPDATED: 3 files instead of 2)
    displayCurrentFiles(exam);
  }

  // Function to display current files (UPDATED: 3 files instead of 2)
  function displayCurrentFiles(exam) {
    // Exam file
    if (exam.exam_pdf_path) {
      const filename = exam.exam_pdf_path.split("/").pop();
      const fileUrl = exam.exam_pdf_url || exam.exam_pdf_path;
      currentExamFileContainer.innerHTML = `
        <div class="current-file">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <i class="fas fa-file-pdf text-primary me-2"></i>
              <strong>${filename}</strong>
              <br>
              <small>
                <a href="${fileUrl}" target="_blank" class="text-decoration-none view-file-link">
                  <i class="fas fa-eye me-1"></i>Voir le fichier
                </a>
              </small>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="delete_exam_pdf" name="delete_exam_pdf" value="1">
              <label class="form-check-label delete-checkbox" for="delete_exam_pdf">
                Supprimer
              </label>
            </div>
          </div>
        </div>
      `;
    } else {
      currentExamFileContainer.innerHTML = `
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          Aucun sujet n'est actuellement associé à cet examen.
        </div>
      `;
    }

    // Correction langue file (UPDATED: new file type)
    if (exam.correction_langue_path) {
      const filename = exam.correction_langue_path.split("/").pop();
      const fileUrl = exam.correction_langue_url || exam.correction_langue_path;
      currentCorrectionLangueFileContainer.innerHTML = `
        <div class="current-file">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <i class="fas fa-language text-success me-2"></i>
              <strong>${filename}</strong>
              <br>
              <small>
                <a href="${fileUrl}" target="_blank" class="text-decoration-none view-file-link">
                  <i class="fas fa-eye me-1"></i>Voir le fichier
                </a>
              </small>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="delete_correction_langue_pdf" name="delete_correction_langue_pdf" value="1">
              <label class="form-check-label delete-checkbox" for="delete_correction_langue_pdf">
                Supprimer
              </label>
            </div>
          </div>
        </div>
      `;
    } else {
      currentCorrectionLangueFileContainer.innerHTML = `
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          Aucune correction langue n'est actuellement associée à cet examen.
        </div>
      `;
    }

    // Correction production file (UPDATED: new file type)
    if (exam.correction_production_path) {
      const filename = exam.correction_production_path.split("/").pop();
      const fileUrl =
        exam.correction_production_url || exam.correction_production_path;
      currentCorrectionProductionFileContainer.innerHTML = `
        <div class="current-file">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <i class="fas fa-edit text-warning me-2"></i>
              <strong>${filename}</strong>
              <br>
              <small>
                <a href="${fileUrl}" target="_blank" class="text-decoration-none view-file-link">
                  <i class="fas fa-eye me-1"></i>Voir le fichier
                </a>
              </small>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="delete_correction_production_pdf" name="delete_correction_production_pdf" value="1">
              <label class="form-check-label delete-checkbox" for="delete_correction_production_pdf">
                Supprimer
              </label>
            </div>
          </div>
        </div>
      `;
    } else {
      currentCorrectionProductionFileContainer.innerHTML = `
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          Aucune correction production n'est actuellement associée à cet examen.
        </div>
      `;
    }

    // Add event listeners to delete checkboxes
    document
      .querySelectorAll('input[type="checkbox"][name^="delete_"]')
      .forEach((checkbox) => {
        checkbox.addEventListener("change", handleDeleteCheckbox);
      });
  }

  // Function to handle delete checkbox changes
  function handleDeleteCheckbox(e) {
    const checkbox = e.target;
    const fileName = checkbox
      .closest(".current-file")
      .querySelector("strong").textContent;

    if (checkbox.checked) {
      if (!confirm(`Êtes-vous sûr de vouloir supprimer "${fileName}" ?`)) {
        checkbox.checked = false;
      } else {
        // Highlight the file being deleted
        checkbox.closest(".current-file").style.opacity = "0.7";
        checkbox.closest(".current-file").style.borderColor = "#dc3545";
      }
    } else {
      // Remove highlight
      checkbox.closest(".current-file").style.opacity = "";
      checkbox.closest(".current-file").style.borderColor = "";
    }
  }

  // Initialize file upload areas (UPDATED: 3 instead of 2)
  initFileUploadArea(examUploadArea, examFileInput, examFileName, "exam");
  initFileUploadArea(
    correctionLangueUploadArea,
    correctionLangueFileInput,
    correctionLangueFileName,
    "correction_langue"
  );
  initFileUploadArea(
    correctionProductionUploadArea,
    correctionProductionFileInput,
    correctionProductionFileName,
    "correction_production"
  );

  // Form submission handler
  if (editExamForm) {
    editExamForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Validate form
      if (!validateForm()) {
        return false;
      }

      // Disable submit button to prevent double submission
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin me-2"></i>Enregistrement...';

      try {
        // Create FormData object
        const formData = new FormData();

        // Add text fields
        formData.append("id", document.getElementById("exam_id").value);
        formData.append("title", document.getElementById("title").value.trim());
        formData.append(
          "description",
          document.getElementById("description").value.trim()
        );

        const examYear = document.getElementById("exam_year").value;
        if (examYear) {
          formData.append("exam_year", examYear);
        }

        // Add delete flags (UPDATED: 3 instead of 2)
        const deleteExamPdf = document.getElementById("delete_exam_pdf");
        if (deleteExamPdf && deleteExamPdf.checked) {
          formData.append("delete_exam_pdf", "1");
        }

        const deleteCorrectionLanguePdf = document.getElementById(
          "delete_correction_langue_pdf"
        );
        if (deleteCorrectionLanguePdf && deleteCorrectionLanguePdf.checked) {
          formData.append("delete_correction_langue_pdf", "1");
        }

        const deleteCorrectionProductionPdf = document.getElementById(
          "delete_correction_production_pdf"
        );
        if (
          deleteCorrectionProductionPdf &&
          deleteCorrectionProductionPdf.checked
        ) {
          formData.append("delete_correction_production_pdf", "1");
        }

        // Add files if they exist (UPDATED: 3 instead of 2)
        if (examFileInput.files[0]) {
          formData.append("exam_pdf", examFileInput.files[0]);
        }
        if (correctionLangueFileInput.files[0]) {
          formData.append(
            "correction_langue_pdf",
            correctionLangueFileInput.files[0]
          );
        }
        if (correctionProductionFileInput.files[0]) {
          formData.append(
            "correction_production_pdf",
            correctionProductionFileInput.files[0]
          );
        }

        // Send update request to backend API
        const response = await fetch(UPDATE_EXAM_API, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const result = await response.json();

        if (result.success) {
          showSuccessMessage(
            "Examen modifié avec succès! Les modifications ont été enregistrées."
          );

          // Update displayed data with new values
          displayExamData(result.data.exam);

          // Reset file inputs (UPDATED: 3 instead of 2)
          examFileInput.value = "";
          correctionLangueFileInput.value = "";
          correctionProductionFileInput.value = "";
          examFileName.innerHTML = "Aucun nouveau fichier sélectionné";
          correctionLangueFileName.innerHTML =
            "Aucun nouveau fichier sélectionné";
          correctionProductionFileName.innerHTML =
            "Aucun nouveau fichier sélectionné";
          examUploadArea.classList.remove("file-upload-success");
          correctionLangueUploadArea.classList.remove("file-upload-success");
          correctionProductionUploadArea.classList.remove(
            "file-upload-success"
          );

          // Reset delete checkboxes
          document
            .querySelectorAll('input[type="checkbox"][name^="delete_"]')
            .forEach((checkbox) => {
              checkbox.checked = false;
              checkbox.closest(".current-file").style.opacity = "";
              checkbox.closest(".current-file").style.borderColor = "";
            });
        } else {
          throw new Error(result.message || "Erreur lors de la mise à jour");
        }
      } catch (error) {
        console.error("Error updating exam:", error);
        showError(error.message || "Erreur lors de l'enregistrement");
      } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<i class="fas fa-save me-2"></i>Enregistrer les modifications';
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
          "Êtes-vous sûr de vouloir annuler les modifications ? Tous les changements seront perdus."
        )
      ) {
        // Reload the form with original data
        loadExamData(examId);
        hideAllAlerts();
        console.log("Form reset to original data");
      }
    });
  }

  // Delete button handler
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async function () {
      const examTitle = document.getElementById("title").value;

      if (
        confirm(
          `Êtes-vous sûr de vouloir supprimer l'examen "${examTitle}" ?\n\nCette action est irréversible. Tous les fichiers associés seront également supprimés.`
        )
      ) {
        // Disable button and show loading
        deleteBtn.disabled = true;
        deleteBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin me-2"></i>Suppression...';

        try {
          // Send delete request
          const response = await fetch(DELETE_EXAM_API, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ id: examId }),
          });

          const result = await response.json();

          if (result.success) {
            showSuccessMessage(
              "Examen supprimé avec succès ! Redirection en cours..."
            );

            // Redirect to manage exams after 2 seconds
            setTimeout(() => {
              window.location.href = "/?page=manage-exams&deleted=1";
            }, 2000);
          } else {
            throw new Error(result.message || "Erreur lors de la suppression");
          }
        } catch (error) {
          console.error("Error deleting exam:", error);
          showError("Erreur lors de la suppression: " + error.message);
          deleteBtn.disabled = false;
          deleteBtn.innerHTML = '<i class="fas fa-trash me-2"></i>Supprimer';
        }
      }
    });
  }

  // Real-time validation on input
  const formInputs = editExamForm.querySelectorAll("input, textarea, select");
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
        display.innerHTML = "Aucun nouveau fichier sélectionné";
        display.parentElement.classList.remove("file-upload-success");
        return;
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        showError("Le fichier est trop volumineux. Maximum 10MB.");
        input.value = "";
        display.innerHTML = "Aucun nouveau fichier sélectionné";
        display.parentElement.classList.remove("file-upload-success");
        return;
      }

      // Update display
      display.innerHTML = `
        <i class="fas fa-file-pdf text-primary me-1"></i>
        <strong>${file.name}</strong>
        <br>
        <small>${formatFileSize(file.size)}</small>
      `;

      // Highlight area
      display.parentElement.classList.add("file-upload-success");

      // Hide any previous errors
      hideErrorAlert();
    } else {
      display.innerHTML = "Aucun nouveau fichier sélectionné";
      display.parentElement.classList.remove("file-upload-success");
    }
  }

  // Function to validate form (UPDATED: 3 files instead of 2)
  function validateForm() {
    let isValid = true;

    // Get form elements
    const title = document.getElementById("title").value.trim();
    const examYear = document.getElementById("exam_year").value.trim();
    const examFile = examFileInput.files[0];
    const correctionLangueFile = correctionLangueFileInput.files[0];
    const correctionProductionFile = correctionProductionFileInput.files[0];

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
      if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2035) {
        showError("L'année doit être comprise entre 2000 et 2035.");
        document.getElementById("exam_year").classList.add("is-invalid");
        isValid = false;
      }
    }

    // Validate files (10MB max)
    const maxSize = 10 * 1024 * 1024;

    if (examFile && examFile.size > maxSize) {
      showError("Le fichier sujet est trop volumineux (max 10MB).");
      examUploadArea.classList.add("is-invalid");
      isValid = false;
    }

    if (correctionLangueFile && correctionLangueFile.size > maxSize) {
      showError("Le fichier correction langue est trop volumineux (max 10MB).");
      correctionLangueUploadArea.classList.add("is-invalid");
      isValid = false;
    }

    if (correctionProductionFile && correctionProductionFile.size > maxSize) {
      showError(
        "Le fichier correction production est trop volumineux (max 10MB)."
      );
      correctionProductionUploadArea.classList.add("is-invalid");
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

  // Function to hide loading state
  function hideLoadingState() {
    if (loadingState) {
      loadingState.style.display = "none";
    }
  }

  // Function to show form
  function showForm() {
    if (formContainer) {
      formContainer.classList.remove("d-none");
    }
  }

  // Function to show not found message
  function showNotFound() {
    if (examNotFound) {
      examNotFound.classList.remove("d-none");
    }
  }

  // Function to format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Function to format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

    // Trigger initial count when form loads
    setTimeout(() => {
      descriptionField.dispatchEvent(new Event("input"));
    }, 100);
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
  // Setup sidebar navigation
  setupSidebarNavigation();
});

// Function to setup sidebar navigation
function setupSidebarNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");

  // Highlight current page
  highlightCurrentPage();

  // Add click handlers
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (this.classList.contains("text-danger")) {
        e.preventDefault();
        logout();
        return false;
      }
    });
  });
}

// Function to highlight current page
function highlightCurrentPage() {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => link.classList.remove("active"));

  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = urlParams.get("page") || "edit-exam";

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.includes(`page=${currentPage}`)) {
      link.classList.add("active");
    }
  });
}

// Function to handle logout
async function logout() {
  if (!confirm("Êtes-vous sûr de vouloir vous déconnecter?")) {
    return;
  }

  try {
    const response = await fetch("/backend/api/auth/logout.php", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      window.location.href = "/?page=login";
    } else {
      alert("Erreur lors de la déconnexion. Veuillez réessayer.");
    }
  } catch (error) {
    console.error("Logout error:", error);
    alert("Erreur de connexion. Veuillez réessayer.");
  }
}

// Make logout function available globally
window.logout = logout;

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
