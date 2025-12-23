// API URLs
const EXAMS_API = "/backend/api/exams/list.php";
const DELETE_EXAM_API = "/backend/api/exams/delete.php";

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Manage Exams page loaded");

  // First check authentication, then load data
  checkAuthAndLoadExams();

  // Setup event listeners
  setupEventListeners();
});

// Function to check authentication and load exams
async function checkAuthAndLoadExams() {
  try {
    // First check if user is authenticated
    const authResponse = await fetch("/backend/api/auth/check.php", {
      credentials: "include",
    });

    if (authResponse.ok) {
      // User is authenticated, load exams
      loadExams();

      // Check for success message in URL
      checkForSuccessMessage();
    } else {
      // Not authenticated, redirect to login
      window.location.href = "/?page=login";
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    window.location.href = "/?page=login";
  }
}

// Function to load exams from API
async function loadExams() {
  const tbody = document.getElementById("exams-tbody");

  // Show loading state
  tbody.innerHTML = `
    <tr>
      <td colspan="6" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-2">Chargement des examens...</p>
      </td>
    </tr>
  `;

  try {
    const response = await fetch(EXAMS_API, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      // Display real exams from API
      displayExams(data.data.exams);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error loading exams:", error);
    showError("Erreur de chargement des examens. Veuillez réessayer.");

    // Show error state
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>
          Erreur de chargement: ${error.message}
        </td>
      </tr>
    `;
  }
}

// Function to display exams in table
function displayExams(exams) {
  const tbody = document.getElementById("exams-tbody");

  if (!exams || exams.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center">
          <div class="text-muted py-4">
            <i class="fas fa-file-alt fa-3x mb-3" style="opacity: 0.3;"></i>
            <h5>Aucun examen trouvé</h5>
            <p>Commencez par ajouter votre premier examen.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  let html = "";

  exams.forEach((exam) => {
    const date = new Date(exam.created_at);
    const formattedDate = date.toLocaleDateString("fr-FR");

    // Determine document status 
    const hasExam = exam.exam_pdf_path;
    const hasCorrectionLangue = exam.correction_langue_path;
    const hasCorrectionProduction = exam.correction_production_path;

    // Count available documents
    const docCount =
      (hasExam ? 1 : 0) +
      (hasCorrectionLangue ? 1 : 0) +
      (hasCorrectionProduction ? 1 : 0);

    let status, statusClass;
    if (docCount === 3) {
      status = "3 documents";
      statusClass = "status-complete";
    } else if (docCount === 2) {
      status = "2 documents";
      statusClass = "status-partial";
    } else if (docCount === 1) {
      status = "1 document";
      statusClass = "status-partial";
    } else {
      status = "Aucun document";
      statusClass = "status-none";
    }

    html += `
      <tr id="exam-row-${exam.id}">
        <td>${exam.id}</td>
        <td>
          <strong>${escapeHtml(exam.title)}</strong>
          ${
            exam.description
              ? `<br><small class="text-muted">${escapeHtml(
                  exam.description.substring(0, 100)
                )}...</small>`
              : ""
          }
        </td>
        <td>${exam.exam_year || "N/A"}</td>
        <td>
          <span class="exam-status ${statusClass}" title="Sujet: ${
      hasExam ? "✓" : "✗"
    }, Correction Langue: ${
      hasCorrectionLangue ? "✓" : "✗"
    }, Correction Production: ${hasCorrectionProduction ? "✓" : "✗"}">
            ${status}
          </span>
        </td>
        <td>${formattedDate}</td>
        <td class="table-actions">
          <a href="/?page=edit-exam&id=${
            exam.id
          }" class="btn btn-sm btn-warning btn-action" title="Modifier">
            <i class="fas fa-edit"></i>
          </a>
          <button class="btn btn-sm btn-danger btn-action" title="Supprimer" onclick="confirmDelete(${
            exam.id
          }, '${escapeHtml(exam.title.replace(/'/g, "\\'"))}')">
            <i class="fas fa-trash"></i>
          </button>
          <a href="/?page=examens&exam=${
            exam.id
          }" target="_blank" class="btn btn-sm btn-info btn-action" title="Voir l'examen">
            <i class="fas fa-eye"></i>
          </a>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// Function to confirm deletion
async function confirmDelete(examId, examTitle) {
  const confirmed = confirm(
    `Êtes-vous sûr de vouloir supprimer l'examen "${examTitle}" ?\n\n` +
      "Cette action est irréversible. Les fichiers PDF associés seront également supprimés."
  );

  if (!confirmed) return;

  try {
    // Show loading
    const row = document.getElementById(`exam-row-${examId}`);
    if (row) {
      const originalHTML = row.innerHTML;
      row.innerHTML = `
        <td colspan="6" class="text-center">
          <div class="spinner-border spinner-border-sm text-danger" role="status">
            <span class="visually-hidden">Suppression en cours...</span>
          </div>
          <span class="ms-2">Suppression en cours...</span>
        </td>
      `;
    }

    // Send delete request
    const response = await fetch(DELETE_EXAM_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id: examId }),
    });

    const data = await response.json();

    if (data.success) {
      // Show success message
      showSuccessMessage("Examen supprimé avec succès!");

      // Remove row from table
      if (row) {
        row.remove();
      }

      // Reload exams after 1 second
      setTimeout(() => {
        loadExams();
      }, 1000);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error deleting exam:", error);
    showError("Erreur lors de la suppression: " + error.message);

    // Restore row if exists
    if (row) {
      loadExams(); // Reload entire table
    }
  }
}

// Function to check for success message in URL
function checkForSuccessMessage() {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get("deleted") === "1") {
    showSuccessMessage("Examen supprimé avec succès!");
    cleanURL();
  } else if (urlParams.get("added") === "1") {
    showSuccessMessage("Examen ajouté avec succès!");
    cleanURL();
  } else if (urlParams.get("updated") === "1") {
    showSuccessMessage("Examen modifié avec succès!");
    cleanURL();
  }
}

// Function to clean URL (remove success parameters)
function cleanURL() {
  const newUrl = window.location.pathname;
  window.history.replaceState({}, document.title, newUrl);
}

// Function to show success message
function showSuccessMessage(message) {
  const alert = document.getElementById("success-message");
  const messageText = document.getElementById("message-text");

  if (alert && messageText) {
    messageText.textContent = message;
    alert.classList.remove("d-none");

    // Auto-hide after 5 seconds
    setTimeout(() => {
      alert.classList.add("d-none");
    }, 5000);
  }
}

// Function to show error message
function showError(message) {
  // Create error alert if it doesn't exist
  let errorAlert = document.getElementById("error-message");
  let errorText = document.getElementById("error-text");

  if (!errorAlert) {
    // Create error alert
    const successAlert = document.getElementById("success-message");
    errorAlert = successAlert.cloneNode(true);
    errorAlert.id = "error-message";
    errorAlert.classList.remove("alert-success");
    errorAlert.classList.add("alert-danger");

    const errorIcon = errorAlert.querySelector(".fa-check-circle");
    if (errorIcon) {
      errorIcon.classList.remove("fa-check-circle");
      errorIcon.classList.add("fa-exclamation-triangle");
    }

    errorText = errorAlert.querySelector("#message-text");
    if (errorText) {
      errorText.id = "error-text";
    }

    successAlert.parentNode.insertBefore(errorAlert, successAlert.nextSibling);
  }

  if (errorText) {
    errorText.textContent = message;
    errorAlert.classList.remove("d-none");

    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorAlert.classList.add("d-none");
    }, 5000);
  }
}

// Function to setup event listeners
function setupEventListeners() {
  // Close button for success message
  const closeBtn = document.querySelector("#success-message .btn-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      document.getElementById("success-message").classList.add("d-none");
    });
  }

  // Setup sidebar navigation
  setupSidebarNavigation();
}

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
  const currentPage = urlParams.get("page") || "dashboard";

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

// Helper function to escape HTML
function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Make functions available globally
window.confirmDelete = confirmDelete;
window.logout = logout;
