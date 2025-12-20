/**
 * edit_lesson.js - Edit Lesson page JavaScript
 * REAL implementation with API integration
 */

// API Base URLs
const API_BASE_URL = "/backend/api";
const CATEGORIES_API = `${API_BASE_URL}/categories/all.php`;
const GET_LESSON_API = `${API_BASE_URL}/lessons/get_single.php`;
const UPDATE_LESSON_API = `${API_BASE_URL}/lessons/update.php`;
const DELETE_LESSON_API = `${API_BASE_URL}/lessons/delete.php`;

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Edit Lesson page loaded");

  // First check authentication, then load data
  checkAuthAndLoadPage();
});

// Function to check authentication and load page
async function checkAuthAndLoadPage() {
  try {
    // First check if user is authenticated
    const authResponse = await fetch("/backend/api/auth/check.php", {
      credentials: "include",
    });

    if (authResponse.ok) {
      // User is authenticated, load page data
      loadPageData();
    } else {
      // Not authenticated, redirect to login
      window.location.href = "/?page=login";
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    window.location.href = "/?page=login";
  }
}

// Function to load page data
async function loadPageData() {
  const lessonId = document.getElementById("lesson_id")
    ? document.getElementById("lesson_id").value
    : 0;

  if (lessonId <= 0) {
    showError("Aucun ID de leçon spécifié");
    return;
  }

  try {
    // Load categories and lesson data in parallel
    await Promise.all([loadCategories(), loadLessonData(lessonId)]);

    // Setup form submission after data is loaded
    setupFormSubmission();

    // Setup other event listeners
    setupEventListeners();
  } catch (error) {
    console.error("Error loading page data:", error);
    showError("Erreur de chargement des données");
  }
}

// Function to load categories from API
async function loadCategories() {
  const categorySelect = document.getElementById("category_id");

  if (!categorySelect) {
    console.error("Category select element not found");
    return;
  }

  try {
    const response = await fetch(CATEGORIES_API, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      populateCategoryDropdown(categorySelect, data.data);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error loading categories:", error);
    categorySelect.innerHTML = '<option value="">Erreur de chargement</option>';
  }
}

// Function to populate category dropdown
function populateCategoryDropdown(selectElement, categoriesData) {
  // Clear existing options
  selectElement.innerHTML =
    '<option value="">Sélectionnez une catégorie</option>';

  // categoriesData is an array of level groups
  categoriesData.forEach((levelGroup) => {
    // Create optgroup
    const optgroup = document.createElement("optgroup");

    // Set label (French display name)
    if (levelGroup.level_slug === "tronc-commun") {
      optgroup.label = "Tronc Commun";
    } else if (levelGroup.level_slug === "1ere-annee-bac") {
      optgroup.label = "1ère Année Bac";
    } else {
      optgroup.label = levelGroup.level_name;
    }

    // Add categories for this level
    levelGroup.categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      optgroup.appendChild(option);
    });

    selectElement.appendChild(optgroup);
  });
}

// Function to load lesson data from API
async function loadLessonData(lessonId) {
  // Show loading state
  const loadingState = document.getElementById("loading-state");
  const formContainer = document.getElementById("lesson-form-container");
  const lessonInfoContainer = document.getElementById("lesson-info-container");

  if (loadingState) loadingState.classList.remove("d-none");
  if (formContainer) formContainer.classList.add("d-none");
  if (lessonInfoContainer) lessonInfoContainer.classList.add("d-none");

  try {
    const response = await fetch(`${GET_LESSON_API}?id=${lessonId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      // Populate form with lesson data
      populateFormWithLessonData(data.data.lesson);

      // Hide loading, show form
      if (loadingState) loadingState.classList.add("d-none");
      if (formContainer) formContainer.classList.remove("d-none");
      if (lessonInfoContainer) lessonInfoContainer.classList.remove("d-none");
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error loading lesson:", error);

    // Hide loading, show error
    if (loadingState) loadingState.classList.add("d-none");
    document.getElementById("lesson-not-found").classList.remove("d-none");
    showError("Leçon non trouvée ou erreur de chargement");
  }
}

// Function to populate form with lesson data
function populateFormWithLessonData(lesson) {
  if (!lesson) return;

  // Fill form fields
  document.getElementById("title").value = lesson.title || "";
  document.getElementById("content").value = lesson.content || "";
  document.getElementById("video_url").value = lesson.video_url || "";

  // Set category selection
  setTimeout(() => {
    const categorySelect = document.getElementById("category_id");
    if (categorySelect && lesson.category_id) {
      categorySelect.value = lesson.category_id;
    }
  }, 100); // Small delay to ensure categories are loaded

  // Update lesson info display
  updateLessonDisplayInfo(lesson);
}

// Function to update lesson info display
function updateLessonDisplayInfo(lesson) {
  const lessonInfo = document.getElementById("lesson-info");
  if (!lessonInfo) return;

  const createdDate = new Date(lesson.created_at);
  const formattedCreatedDate = createdDate.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  let html = `
    <li class="mb-2">
      <strong>ID:</strong> ${lesson.id}
    </li>
    <li class="mb-2">
      <strong>Date d'ajout:</strong><br>
      ${formattedCreatedDate}
    </li>
  `;

  if (lesson.updated_at && lesson.updated_at !== lesson.created_at) {
    const updatedDate = new Date(lesson.updated_at);
    const formattedUpdatedDate = updatedDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    html += `
      <li>
        <strong>Dernière modification:</strong><br>
        ${formattedUpdatedDate}
      </li>
    `;
  }

  // Add category info
  if (lesson.category_name) {
    html += `
      <li>
        <strong>Catégorie:</strong><br>
        ${escapeHtml(lesson.category_name)}
      </li>
    `;
  }

  lessonInfo.innerHTML = html;
}

// Function to setup form submission
function setupFormSubmission() {
  const form = document.getElementById("editLessonForm");
  const submitBtn = document.getElementById("submit-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const viewLessonBtn = document.getElementById("view-lesson-btn");
  const manageQuizBtn = document.getElementById("manage-quiz-btn");
  const lessonId = document.getElementById("lesson_id").value;

  if (!form) return;

  // Form submission handler
  form.addEventListener("submit", async function (e) {
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
      // Prepare form data
      const formData = {
        id: parseInt(lessonId),
        title: document.getElementById("title").value.trim(),
        category_id: parseInt(document.getElementById("category_id").value),
        content: document.getElementById("content").value.trim(),
        video_url: document.getElementById("video_url").value.trim(),
      };

      // Send update request
      const response = await fetch(UPDATE_LESSON_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Show success message
        showSuccessMessage("Leçon modifiée avec succès!");

        // Update lesson info display with new timestamp
        formData.updated_at = new Date().toISOString();
        formData.category_name =
          document.getElementById("category_id").options[
            document.getElementById("category_id").selectedIndex
          ].text;
        updateLessonDisplayInfo(formData);
      } else {
        // Show error message from API
        showError("Erreur: " + data.message);
      }
    } catch (error) {
      console.error("Error updating lesson:", error);
      showError("Erreur lors de l'enregistrement. Veuillez réessayer.");
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.innerHTML =
        '<i class="fas fa-save me-2"></i>Enregistrer les modifications';
    }
  });

  // Delete button handler
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async function () {
      if (
        !confirm(
          "Êtes-vous sûr de vouloir supprimer cette leçon ? Toutes les questions de quiz associées seront également supprimées. Cette action est irréversible."
        )
      ) {
        return;
      }

      if (
        !confirm(
          "Dernière confirmation : Voulez-vous vraiment supprimer définitivement cette leçon ?"
        )
      ) {
        return;
      }

      try {
        // Show loading on delete button
        deleteBtn.disabled = true;
        deleteBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin me-2"></i>Suppression...';

        // Send delete request
        const response = await fetch(DELETE_LESSON_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id: lessonId }),
        });

        const data = await response.json();

        if (data.success) {
          showSuccessMessage("Leçon supprimée avec succès! Redirection...");

          // Redirect to manage lessons after 2 seconds
          setTimeout(() => {
            window.location.href = "/?page=manage-lessons&deleted=1";
          }, 2000);
        } else {
          showError("Erreur: " + data.message);
          deleteBtn.disabled = false;
          deleteBtn.innerHTML =
            '<i class="fas fa-trash me-2"></i>Supprimer définitivement cette leçon';
        }
      } catch (error) {
        console.error("Error deleting lesson:", error);
        showError("Erreur lors de la suppression. Veuillez réessayer.");
        deleteBtn.disabled = false;
        deleteBtn.innerHTML =
          '<i class="fas fa-trash me-2"></i>Supprimer définitivement cette leçon';
      }
    });
  }

  // View lesson button
  if (viewLessonBtn) {
    viewLessonBtn.addEventListener("click", function () {
      window.open(`/?page=cours&lesson=${lessonId}`, "_blank");
    });
  }

  // Manage quiz button (placeholder for now)
  if (manageQuizBtn) {
    manageQuizBtn.addEventListener("click", function () {
      alert("Gestion du quiz - À implémenter");
      // window.location.href = `/?page=manage-quiz&lesson_id=${lessonId}`;
    });
  }
}

// Function to setup other event listeners
function setupEventListeners() {
  // Setup sidebar navigation
  setupSidebarNavigation();

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

  // Real-time validation on input
  const form = document.getElementById("editLessonForm");
  if (form) {
    const formInputs = form.querySelectorAll("input, textarea, select");
    formInputs.forEach((input) => {
      input.addEventListener("input", function () {
        this.classList.remove("is-invalid");
        hideErrorAlert();
      });
    });
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

// Function to validate form
function validateForm() {
  let isValid = true;

  const title = document.getElementById("title").value.trim();
  const categoryId = document.getElementById("category_id").value;
  const content = document.getElementById("content").value.trim();
  const videoUrl = document.getElementById("video_url").value.trim();

  // Reset all error states
  hideAllAlerts();

  const formInputs = document.querySelectorAll(
    "#editLessonForm input, #editLessonForm textarea, #editLessonForm select"
  );
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

  // Validate video URL
  if (videoUrl && !isValidUrl(videoUrl)) {
    showError("L'URL de la vidéo n'est pas valide");
    document.getElementById("video_url").classList.add("is-invalid");
    isValid = false;
  }

  return isValid;
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

    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => alert.classList.add("d-none"), 5000);
  }
}

// Function to show error message
function showError(message) {
  const alert = document.getElementById("error-message");
  const errorText = document.getElementById("error-text");

  if (alert && errorText) {
    errorText.textContent = message;
    alert.classList.remove("d-none");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// Function to hide error alert
function hideErrorAlert() {
  const alert = document.getElementById("error-message");
  if (alert) alert.classList.add("d-none");
}

// Function to hide all alerts
function hideAllAlerts() {
  const successAlert = document.getElementById("success-message");
  const errorAlert = document.getElementById("error-message");
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
window.logout = logout;
