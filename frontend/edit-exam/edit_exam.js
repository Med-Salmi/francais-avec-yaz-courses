/**
 * edit_exam.js - Edit Exam page JavaScript
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Edit Exam page loaded");

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
  const currentExamFileContainer = document.getElementById(
    "current-exam-file-container"
  );
  const currentCorrectionFileContainer = document.getElementById(
    "current-correction-file-container"
  );

  // File upload elements
  const examUploadArea = document.getElementById("exam-upload-area");
  const correctionUploadArea = document.getElementById(
    "correction-upload-area"
  );
  const examFileInput = document.getElementById("exam_pdf");
  const correctionFileInput = document.getElementById("correction_pdf");
  const examFileName = document.getElementById("exam_file_name");
  const correctionFileName = document.getElementById("correction_file_name");

  // Simulated exam data (will be replaced with backend API)
  const simulatedExam = {
    id: 123,
    title: "Contrôle Continu - Semestre 1",
    description: "Examen de français pour le premier semestre",
    exam_year: 2024,
    exam_pdf_path: "uploads/exams/exam_123456789.pdf",
    correction_pdf_path: "uploads/exams/correction_123456789.pdf",
    level_slug: "1ere-annee-bac",
    created_at: "2024-01-15 10:30:00",
    updated_at: "2024-01-20 14:45:00",
  };

  // Initialize the page
  initPage();

  // Function to initialize the page
  function initPage() {
    // Get exam ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const examId = urlParams.get("id") || simulatedExam.id;

    // Simulate loading data from backend
    setTimeout(() => {
      loadExamData(examId);
    }, 1000);
  }

  // Function to load exam data
  function loadExamData(examId) {
    // In real implementation, this would be a fetch() call to backend
    // For now, we'll use simulated data
    const exam = simulatedExam;

    if (exam) {
      displayExamData(exam);
      hideLoadingState();
      showForm();
    } else {
      hideLoadingState();
      showNotFound();
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
        exam.updated_at !== exam.created_at
          ? `
      <li>
        <strong>Dernière modification:</strong><br>
        ${updatedDate}
      </li>
      `
          : ""
      }
    `;

    // Display current files
    displayCurrentFiles(exam);
  }

  // Function to display current files
  function displayCurrentFiles(exam) {
    // Exam file
    if (exam.exam_pdf_path) {
      const filename = exam.exam_pdf_path.split("/").pop();
      currentExamFileContainer.innerHTML = `
        <div class="current-file">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <i class="fas fa-file-pdf text-danger me-2"></i>
              <strong>${filename}</strong>
              <br>
              <small>
                <a href="#" class="text-decoration-none view-file-link" data-filename="${filename}">
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

    // Correction file
    if (exam.correction_pdf_path) {
      const filename = exam.correction_pdf_path.split("/").pop();
      currentCorrectionFileContainer.innerHTML = `
        <div class="current-file">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <i class="fas fa-file-pdf text-success me-2"></i>
              <strong>${filename}</strong>
              <br>
              <small>
                <a href="#" class="text-decoration-none view-file-link" data-filename="${filename}">
                  <i class="fas fa-eye me-1"></i>Voir le fichier
                </a>
              </small>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="delete_correction_pdf" name="delete_correction_pdf" value="1">
              <label class="form-check-label delete-checkbox" for="delete_correction_pdf">
                Supprimer
              </label>
            </div>
          </div>
        </div>
      `;
    } else {
      currentCorrectionFileContainer.innerHTML = `
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          Aucune correction n'est actuellement associée à cet examen.
        </div>
      `;
    }

    // Add event listeners to delete checkboxes
    document
      .querySelectorAll('input[type="checkbox"][name^="delete_"]')
      .forEach((checkbox) => {
        checkbox.addEventListener("change", handleDeleteCheckbox);
      });

    // Add event listeners to view file links
    document.querySelectorAll(".view-file-link").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const filename = this.getAttribute("data-filename");
        alert(
          `Environnement réel: le fichier "${filename}" s'ouvrirait ici.\n\nPour la démo frontend, nous simulons l'action.`
        );
      });
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

  // Initialize file upload areas
  initFileUploadArea(examUploadArea, examFileInput, examFileName, "exam");
  initFileUploadArea(
    correctionUploadArea,
    correctionFileInput,
    correctionFileName,
    "correction"
  );

  // Form submission handler
  if (editExamForm) {
    editExamForm.addEventListener("submit", function (e) {
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
        // Get form data
        const formData = getFormData();
        console.log("Form data for update:", formData);

        // Show success message
        showSuccessMessage(
          "Examen modifié avec succès! Les modifications ont été enregistrées."
        );

        // Update displayed data with new values
        updateDisplayedData(formData);

        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<i class="fas fa-save me-2"></i>Enregistrer les modifications';
      }, 1500);

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
        loadExamData(simulatedExam.id);
        hideAllAlerts();
        console.log("Form reset to original data");
      }
    });
  }

  // Delete button handler
  if (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      if (
        confirm(
          "Êtes-vous sûr de vouloir supprimer cet examen ? Cette action est irréversible.\n\nTous les fichiers associés seront également supprimés."
        )
      ) {
        // Disable button and show loading
        deleteBtn.disabled = true;
        deleteBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin me-2"></i>Suppression...';

        // Simulate deletion
        setTimeout(() => {
          showSuccessMessage(
            "Examen supprimé avec succès ! Redirection en cours..."
          );

          // Redirect to manage exams after 2 seconds
          setTimeout(() => {
            window.location.href = "/?page=manage-exams&deleted=1";
          }, 2000);
        }, 1500);
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

      // Validate file size (2MB max for edit)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        showError("Le fichier est trop volumineux. Maximum 2MB.");
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

  // Function to validate form
  function validateForm() {
    let isValid = true;

    // Get form elements
    const title = document.getElementById("title").value.trim();
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

    // Validate files (2MB max for edit)
    const maxSize = 2 * 1024 * 1024;

    if (examFile && examFile.size > maxSize) {
      showError("Le fichier sujet est trop volumineux (max 2MB).");
      examUploadArea.classList.add("is-invalid");
      isValid = false;
    }

    if (correctionFile && correctionFile.size > maxSize) {
      showError("Le fichier correction est trop volumineux (max 2MB).");
      correctionUploadArea.classList.add("is-invalid");
      isValid = false;
    }

    return isValid;
  }

  // Function to get form data
  function getFormData() {
    const deleteExamPdf = document.getElementById("delete_exam_pdf")
      ? document.getElementById("delete_exam_pdf").checked
      : false;
    const deleteCorrectionPdf = document.getElementById("delete_correction_pdf")
      ? document.getElementById("delete_correction_pdf").checked
      : false;

    const formData = {
      exam_id: document.getElementById("exam_id").value,
      title: document.getElementById("title").value.trim(),
      description: document.getElementById("description").value.trim(),
      exam_year: document.getElementById("exam_year").value,
      delete_exam_pdf: deleteExamPdf,
      delete_correction_pdf: deleteCorrectionPdf,
      exam_file: examFileInput.files[0] ? examFileInput.files[0].name : null,
      correction_file: correctionFileInput.files[0]
        ? correctionFileInput.files[0].name
        : null,
    };

    return formData;
  }

  // Function to update displayed data after successful edit
  function updateDisplayedData(formData) {
    // Update the simulated exam with new data
    simulatedExam.title = formData.title;
    simulatedExam.description = formData.description;
    simulatedExam.exam_year = formData.exam_year;
    simulatedExam.updated_at = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Handle file deletions
    if (formData.delete_exam_pdf) {
      simulatedExam.exam_pdf_path = null;
    }
    if (formData.delete_correction_pdf) {
      simulatedExam.correction_pdf_path = null;
    }

    // Handle new file uploads (simulated)
    if (formData.exam_file) {
      simulatedExam.exam_pdf_path = `uploads/exams/${formData.exam_file}`;
    }
    if (formData.correction_file) {
      simulatedExam.correction_pdf_path = `uploads/exams/${formData.correction_file}`;
    }

    // Update the display
    displayExamData(simulatedExam);

    // Reset file inputs
    examFileInput.value = "";
    correctionFileInput.value = "";
    examFileName.innerHTML = "Aucun nouveau fichier sélectionné";
    correctionFileName.innerHTML = "Aucun nouveau fichier sélectionné";
    examUploadArea.classList.remove("file-upload-success");
    correctionUploadArea.classList.remove("file-upload-success");
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
});
