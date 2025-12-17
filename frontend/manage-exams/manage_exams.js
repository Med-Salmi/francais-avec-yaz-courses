/**
 * manage_exams.js - Manage Exams page JavaScript
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Manage Exams page loaded");

  // Load exams data
  loadExams();

  // Check for success message in URL
  checkForSuccessMessage();

  // Setup event listeners
  setupEventListeners();
});

// Function to load exams
function loadExams() {
  const tbody = document.getElementById("exams-tbody");

  // For now, simulate loading with sample data
  // Backend will provide real data later

  setTimeout(() => {
    // Sample data (will be replaced with API call)
    const exams = [
      {
        id: 1,
        title: "Examen de Français - Session Normale",
        description: "Examen complet de français pour la 1ère Année Bac",
        exam_year: 2025,
        exam_pdf_path: "/uploads/exams/exam1.pdf",
        correction_pdf_path: "/uploads/exams/correction1.pdf",
        created_at: "2025-01-15",
      },
      {
        id: 2,
        title: "Examen de Français - Session de Rattrapage",
        description: "Examen de rattrapage avec questions sur la littérature",
        exam_year: 2024,
        exam_pdf_path: "/uploads/exams/exam2.pdf",
        correction_pdf_path: null,
        created_at: "2024-06-20",
      },
      {
        id: 3,
        title: "Contrôle Continu - Semestre 1",
        description: "Contrôle continu portant sur les figures de style",
        exam_year: 2025,
        exam_pdf_path: null,
        correction_pdf_path: "/uploads/exams/correction3.pdf",
        created_at: "2025-11-10",
      },
      {
        id: 4,
        title: "Examen Blanc - Préparation Bac",
        description: "Examen blanc complet pour la préparation au baccalauréat",
        exam_year: 2023,
        exam_pdf_path: null,
        correction_pdf_path: null,
        created_at: "2023-12-05",
      },
    ];

    displayExams(exams);
  }, 800);
}

// Function to display exams in table
function displayExams(exams) {
  const tbody = document.getElementById("exams-tbody");

  if (exams.length === 0) {
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

    // Determine status
    const hasExam = exam.exam_pdf_path;
    const hasCorrection = exam.correction_pdf_path;

    let status, statusClass;
    if (hasExam && hasCorrection) {
      status = "Sujet + Correction";
      statusClass = "status-complete";
    } else if (hasExam) {
      status = "Sujet seulement";
      statusClass = "status-partial";
    } else if (hasCorrection) {
      status = "Correction seulement";
      statusClass = "status-partial";
    } else {
      status = "Aucun document";
      statusClass = "status-none";
    }

    html += `
            <tr>
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
                    <span class="exam-status ${statusClass}">${status}</span>
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
                    })">
                        <i class="fas fa-trash"></i>
                    </button>
                    <!-- UPDATED VIEW BUTTON: Direct link to examens page with exam ID -->
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
function confirmDelete(examId) {
  if (
    confirm(
      "Êtes-vous sûr de vouloir supprimer cet examen ? Cette action est irréversible."
    )
  ) {
    // For demo purposes - just show success message
    // Backend will handle actual deletion

    showSuccessMessage("Examen supprimé avec succès!");

    // Reload exams after deletion
    setTimeout(() => {
      loadExams();
    }, 500);

    console.log("Deleting exam:", examId);

    // Backend implementation will be:
    // window.location.href = '/delete-exam?id=' + examId;
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

// Function to setup event listeners
function setupEventListeners() {
  // Close button for success message
  const closeBtn = document.querySelector("#success-message .btn-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      document.getElementById("success-message").classList.add("d-none");
    });
  }
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
