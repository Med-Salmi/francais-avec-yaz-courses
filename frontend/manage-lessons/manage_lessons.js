/**
 * manage-lessons.js - Manage Lessons page JavaScript
 * UPDATED: Now uses real API data with authentication
 */

// API Base URL
const API_BASE_URL = "/backend/api/lessons";

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Manage Lessons page loaded");

  // First check authentication, then load data
  checkAuthAndLoadLessons();

  // Setup sidebar navigation and logout
  setupSidebarNavigation();
});

// Function to check authentication and load lessons
async function checkAuthAndLoadLessons() {
  try {
    // First check if user is authenticated
    const authResponse = await fetch("/backend/api/auth/check.php", {
      credentials: "include",
    });

    if (authResponse.ok) {
      // User is authenticated, load lessons
      loadLessons();

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

// Function to load lessons from API
async function loadLessons() {
  const tbody = document.getElementById("lessons-tbody");

  // Show loading state
  tbody.innerHTML = `
    <tr>
      <td colspan="6" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-2">Chargement des leçons...</p>
      </td>
    </tr>
  `;

  try {
    // Fetch lessons from API
    const response = await fetch(`${API_BASE_URL}/list.php`, {
      credentials: "include", // Important for sessions
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      // Display lessons from API
      displayLessons(data.data.lessons);
    } else {
      // API returned error
      showError("Erreur: " + data.message);
    }
  } catch (error) {
    console.error("Error loading lessons:", error);
    showError("Erreur de chargement. Veuillez réessayer.");
  }
}

// Function to display lessons in table
function displayLessons(lessons) {
  const tbody = document.getElementById("lessons-tbody");

  if (!lessons || lessons.length === 0) {
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
    // Use the date from API (already formatted as Y-m-d)
    const date = new Date(lesson.created_at + "T00:00:00"); // Add time for proper parsing
    const formattedDate = date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    html += `
      <tr>
        <td>${lesson.id}</td>
        <td><strong>${escapeHtml(lesson.title)}</strong></td>
        <td>${escapeHtml(lesson.category_name)}</td>
        <td>${formattedDate}</td>
        <td>
          ${
            lesson.video_url && lesson.video_url.trim() !== ""
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
          }, '${escapeHtml(lesson.title.replace(/'/g, "\\'"))}')">
            <i class="fas fa-trash"></i>
          </button>
          <a href="/?page=cours&lesson=${
            lesson.id
          }" target="_blank" class="btn btn-sm btn-info btn-action" title="Voir la leçon">
            <i class="fas fa-eye"></i>
          </a>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// Function to confirm deletion
async function confirmDelete(lessonId, lessonTitle) {
  const confirmed = confirm(
    `Êtes-vous sûr de vouloir supprimer la leçon "${lessonTitle}" ?\n\n` +
      "Toutes les questions de quiz associées seront également supprimées.\n" +
      "Cette action est irréversible."
  );

  if (confirmed) {
    try {
      // Show loading for deletion
      showSuccessMessage("Suppression en cours...");

      // Send delete request to API
      const response = await fetch(`${API_BASE_URL}/delete.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sessions
        body: JSON.stringify({ id: lessonId }),
      });

      const data = await response.json();

      if (data.success) {
        // Show success message
        showSuccessMessage("Leçon supprimée avec succès!");

        // Reload lessons after deletion
        setTimeout(() => {
          loadLessons();
        }, 1000);
      } else {
        // Show error message from API
        showError("Erreur: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
      showError("Erreur lors de la suppression. Veuillez réessayer.");
    }
  }
}

// Function to setup sidebar navigation
function setupSidebarNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");

  // Highlight current page
  highlightCurrentPage();

  // Add click handlers
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // If it's a logout link, handle differently
      if (this.classList.contains("text-danger")) {
        e.preventDefault();
        logout();
        return false;
      }

      // For other links, let them navigate normally
      console.log("Navigating to:", this.getAttribute("href"));
    });
  });
}

// Function to highlight current page in sidebar
function highlightCurrentPage() {
  const navLinks = document.querySelectorAll(".nav-link");

  // Remove active class from all
  navLinks.forEach((link) => link.classList.remove("active"));

  // Check current page
  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = urlParams.get("page") || "dashboard";

  // Find and activate the correct link
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.includes(`page=${currentPage}`)) {
      link.classList.add("active");
    }
  });

  // If no match found, activate manage-lessons by default
  if (currentPage === "manage-lessons") {
    const manageLessonsLink = document.querySelector(
      'a[href="/?page=manage-lessons"]'
    );
    if (manageLessonsLink) {
      manageLessonsLink.classList.add("active");
    }
  }
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
    alert.classList.remove("alert-danger");
    alert.classList.add("alert-success");

    // Auto-hide after 5 seconds
    setTimeout(() => {
      alert.classList.add("d-none");
    }, 5000);
  }
}

// Function to show error message
function showError(message) {
  const alert = document.getElementById("success-message");
  const messageText = document.getElementById("message-text");

  if (alert && messageText) {
    messageText.textContent = message;
    alert.classList.remove("d-none");
    alert.classList.remove("alert-success");
    alert.classList.add("alert-danger");
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
