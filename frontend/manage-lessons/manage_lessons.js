/**
 * manage-lessons.js - Manage Lessons page JavaScript
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Manage Lessons page loaded");

  // Load lessons data
  loadLessons();

  // Check for success message in URL
  checkForSuccessMessage();

  // Setup event listeners
  setupEventListeners();
});

// Function to load lessons
function loadLessons() {
  const tbody = document.getElementById("lessons-tbody");

  // For now, simulate loading with sample data
  // Backend will provide real data later

  setTimeout(() => {
    // Sample data (will be replaced with API call)
    const lessons = [
      {
        id: 1,
        title: "Introduction à la Grammaire Française",
        category_name: "Grammaire",
        category_id: 1,
        created_at: "2025-01-15",
        video_url: "https://example.com/video1",
      },
      {
        id: 2,
        title: "Les Temps Verbaux",
        category_name: "Conjugaison",
        category_id: 2,
        created_at: "2025-01-10",
        video_url: null,
      },
      {
        id: 3,
        title: "La Poésie du XIXe Siècle",
        category_name: "Littérature",
        category_id: 3,
        created_at: "2025-01-05",
        video_url: "https://example.com/video3",
      },
      {
        id: 4,
        title: "Compréhension de Texte",
        category_name: "Lecture",
        category_id: 4,
        created_at: "2024-12-20",
        video_url: null,
      },
    ];

    displayLessons(lessons);
  }, 800);
}

// Function to display lessons in table
function displayLessons(lessons) {
  const tbody = document.getElementById("lessons-tbody");

  if (lessons.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="text-muted py-4">
                        <i class="fas fa-book fa-3x mb-3" style="opacity: 0.3;"></i>
                        <h5>Aucune leçon trouvée</h5>
                        <p>Commencez par ajouter votre première leçon.</p>
                    </div>
                </td>
            </tr>
        `;
    return;
  }

  let html = "";

  lessons.forEach((lesson) => {
    const date = new Date(lesson.created_at);
    const formattedDate = date.toLocaleDateString("fr-FR");

    html += `
            <tr>
                <td>${lesson.id}</td>
                <td><strong>${escapeHtml(lesson.title)}</strong></td>
                <td>${escapeHtml(lesson.category_name)}</td>
                <td>${formattedDate}</td>
                <td>
                    ${
                      lesson.video_url
                        ? '<span class="badge bg-success"><i class="fas fa-video"></i> Oui</span>'
                        : '<span class="badge bg-secondary"><i class="fas fa-times"></i> Non</span>'
                    }
                </td>
                <td class="table-actions">
                    <a href="/?page=edit-lesson&id=${
                      lesson.id
                    }" class="btn btn-sm btn-warning btn-action" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </a>
                    <button class="btn btn-sm btn-danger btn-action" title="Supprimer" onclick="confirmDelete(${
                      lesson.id
                    })">
                        <i class="fas fa-trash"></i>
                    </button>
                    <!-- FIXED VIEW BUTTON: Direct link to cours page -->
                    <a href="/?page=cours&lesson=${lesson.id}" target="_blank" class="btn btn-sm btn-info btn-action" title="Voir la leçon">
                        <i class="fas fa-eye"></i>
                    </a>
                </td>
            </tr>
        `;
  });

  tbody.innerHTML = html;
}

// Function to confirm deletion
function confirmDelete(lessonId) {
  if (
    confirm(
      "Êtes-vous sûr de vouloir supprimer cette leçon ? Toutes les questions de quiz associées seront également supprimées. Cette action est irréversible."
    )
  ) {
    // For demo purposes - just show success message
    // Backend will handle actual deletion

    showSuccessMessage("Leçon supprimée avec succès!");

    // Reload lessons after deletion
    setTimeout(() => {
      loadLessons();
    }, 500);

    console.log("Deleting lesson:", lessonId);

    // Backend implementation will be:
    // window.location.href = '/delete-lesson?id=' + lessonId;
  }
}

// Function to check for success message in URL
function checkForSuccessMessage() {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get("deleted") === "1") {
    showSuccessMessage("Leçon supprimée avec succès!");

    // Clean URL
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }
  
  if (urlParams.get("added") === "1") {
    showSuccessMessage("Leçon ajoutée avec succès!");

    // Clean URL
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }
  
  if (urlParams.get("updated") === "1") {
    showSuccessMessage("Leçon modifiée avec succès!");

    // Clean URL
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }
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