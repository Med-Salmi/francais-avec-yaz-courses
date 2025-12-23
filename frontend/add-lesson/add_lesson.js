/**
 * add_lesson.js - Add Lesson page JavaScript
 * UPDATED: Now includes HTML preview functionality
 */

// API Base URLs
const API_BASE_URL = "/backend/api";
const CATEGORIES_API = `${API_BASE_URL}/categories/all.php`;
const LESSONS_API = `${API_BASE_URL}/lessons/create.php`;

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Add Lesson page loaded");

  // First check authentication, then load categories
  checkAuthAndLoadPage();

  // Setup sidebar navigation and logout
  setupSidebarNavigation();
});

// Function to check authentication and load page
async function checkAuthAndLoadPage() {
  try {
    // First check if user is authenticated
    const authResponse = await fetch("/backend/api/auth/check.php", {
      credentials: "include",
    });

    if (authResponse.ok) {
      // User is authenticated, load categories
      loadCategories();

      // Setup form submission
      setupFormSubmission();

      // Setup HTML preview functionality
      setupHTMLPreview();
    } else {
      // Not authenticated, redirect to login
      window.location.href = "/?page=login";
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    window.location.href = "/?page=login";
  }
}

// Function to load categories from API
async function loadCategories() {
  const categorySelect = document.getElementById("category_id");

  if (!categorySelect) {
    console.error("Category select element not found");
    showError("Erreur: Élément de catégorie non trouvé");
    return;
  }

  // Show loading state
  categorySelect.innerHTML =
    '<option value="">Chargement des catégories...</option>';

  try {
    const response = await fetch(CATEGORIES_API, {
      credentials: "include", // Important for sessions
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      // Display categories in dropdown
      populateCategoryDropdown(categorySelect, data.data);
    } else {
      // API returned error
      showError("Erreur de chargement des catégories: " + data.message);
      categorySelect.innerHTML =
        '<option value="">Erreur de chargement</option>';
    }
  } catch (error) {
    console.error("Error loading categories:", error);
    showError("Erreur de connexion. Veuillez réessayer.");
    categorySelect.innerHTML = '<option value="">Erreur de connexion</option>';
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

// Function to setup HTML preview functionality
function setupHTMLPreview() {
  const previewBtn = document.getElementById("preview-btn");
  const previewCard = document.getElementById("preview-card");
  const previewContent = document.getElementById("preview-content");
  const contentField = document.getElementById("content");

  if (previewBtn && contentField) {
    previewBtn.addEventListener("click", function () {
      const html = contentField.value.trim();
      if (html) {
        // Show preview with formatted HTML
        previewContent.innerHTML = html;
        previewCard.classList.remove("d-none");

        // Apply additional formatting classes for preview
        previewContent.classList.add("lesson-content-preview");

        // Scroll to preview
        previewCard.scrollIntoView({ behavior: "smooth" });
      } else {
        showError("Veuillez d'abord saisir du contenu HTML.");
        contentField.focus();
      }
    });

    // Close preview when clicking outside (optional)
    document.addEventListener("click", function (event) {
      if (!previewCard.contains(event.target) && event.target !== previewBtn) {
        previewCard.classList.add("d-none");
      }
    });
  }
}

// Function to setup form submission
function setupFormSubmission() {
  const form = document.getElementById("addLessonForm");
  const submitBtn = document.getElementById("submit-btn");
  const resetBtn = document.getElementById("reset-btn");

  if (!form) {
    console.error("Form element not found");
    return;
  }

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
        title: document.getElementById("title").value.trim(),
        category_id: parseInt(document.getElementById("category_id").value),
        content: document.getElementById("content").value.trim(),
        video_url: document.getElementById("video_url").value.trim(),
      };

      // Send request to create lesson API
      const response = await fetch(LESSONS_API, {
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
        showSuccessMessage(
          `Leçon ajoutée avec succès! ID: ${data.data.lesson_id}`
        );

        // Clear form after successful submission (optional)
        // form.reset();

        // Hide preview if visible
        const previewCard = document.getElementById("preview-card");
        if (previewCard) {
          previewCard.classList.add("d-none");
        }

        // Redirect to manage lessons page after 3 seconds
        setTimeout(() => {
          window.location.href = "/?page=manage-lessons&added=1";
        }, 3000);
      } else {
        // Show error message from API
        showError("Erreur: " + data.message);

        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<i class="fas fa-save me-2"></i>Enregistrer la leçon';
      }
    } catch (error) {
      console.error("Error creating lesson:", error);
      showError("Erreur lors de l'enregistrement. Veuillez réessayer.");

      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.innerHTML =
        '<i class="fas fa-save me-2"></i>Enregistrer la leçon';
    }
  });

  // Reset button handler
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      // Hide preview if visible
      const previewCard = document.getElementById("preview-card");
      if (previewCard) {
        previewCard.classList.add("d-none");
      }

      // Clear preview content
      const previewContent = document.getElementById("preview-content");
      if (previewContent) {
        previewContent.innerHTML = "";
      }

      hideAllAlerts();
    });
  }

  // Real-time validation on input
  const formInputs = form.querySelectorAll("input, textarea, select");
  formInputs.forEach((input) => {
    input.addEventListener("input", function () {
      // Remove error styling when user starts typing
      this.classList.remove("is-invalid");

      // Hide error alert
      hideErrorAlert();
    });
  });

  // Enhanced character counter for HTML content
  const contentField = document.getElementById("content");
  if (contentField) {
    // Create character counter (if not exists)
    let counter = document.getElementById("char-counter");
    if (!counter) {
      counter = document.createElement("div");
      counter.className = "form-text text-end";
      counter.id = "char-counter";
      counter.textContent = "0 caractères";

      // Insert after content field
      contentField.parentNode.insertBefore(counter, contentField.nextSibling);
    }

    // Update counter on input
    contentField.addEventListener("input", function () {
      const rawText = this.value;
      const charCount = rawText.length;

      // Count HTML tags (simple regex, may not catch all edge cases)
      const htmlTags = (rawText.match(/<[^>]*>/g) || []).length;

      // Calculate text-only length (without tags)
      const textOnly = rawText.replace(/<[^>]*>/g, "");
      const textOnlyCount = textOnly.length;

      // Update counter display
      counter.innerHTML = `
        <span class="text-primary">${charCount} caractères total</span>
        <span class="text-muted"> | ${textOnlyCount} caractères texte</span>
        <span class="text-success"> | ${htmlTags} balises HTML</span>
      `;

      // Change color based on content length
      if (textOnlyCount < 50) {
        counter.querySelector(".text-primary").style.color = "#dc3545"; // red
      } else if (textOnlyCount < 100) {
        counter.querySelector(".text-primary").style.color = "#ffc107"; // yellow
      } else {
        counter.querySelector(".text-primary").style.color = "#28a745"; // green
      }

      // Warn about too many HTML tags (optional)
      if (htmlTags > 50) {
        counter.innerHTML += `<span class="text-warning"> (Trop de balises HTML!)</span>`;
      }
    });

    // Trigger initial count
    contentField.dispatchEvent(new Event("input"));
  }
}

// Function to validate form (UPDATED for HTML content)
function validateForm() {
  let isValid = true;

  // Get form elements
  const title = document.getElementById("title").value.trim();
  const categoryId = document.getElementById("category_id").value;
  const content = document.getElementById("content").value.trim();
  const videoUrl = document.getElementById("video_url").value.trim();

  // Reset all error states
  hideAllAlerts();

  const formInputs = document.querySelectorAll(
    "#addLessonForm input, #addLessonForm textarea, #addLessonForm select"
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

  // Validate content (text without HTML tags should be at least 50 chars)
  if (!content) {
    showError("Le contenu est obligatoire");
    document.getElementById("content").classList.add("is-invalid");
    isValid = false;
  } else {
    // Remove HTML tags to check actual text length
    const textOnly = content.replace(/<[^>]*>/g, "");
    if (textOnly.length < 50) {
      showError(
        "Le contenu doit contenir au moins 50 caractères de texte (sans compter les balises HTML)"
      );
      document.getElementById("content").classList.add("is-invalid");
      isValid = false;
    }

    // Basic HTML validation (optional warning only)
    const unbalancedTags = checkUnbalancedHTMLTags(content);
    if (unbalancedTags > 0) {
      showError(
        `Attention: ${unbalancedTags} balise(s) HTML non fermée(s). Vérifiez votre code HTML.`
      );
      // Don't fail validation for this, just warn
    }
  }

  // Validate video URL format if provided
  if (videoUrl && !isValidUrl(videoUrl)) {
    showError("L'URL de la vidéo n'est pas valide");
    document.getElementById("video_url").classList.add("is-invalid");
    isValid = false;
  }

  return isValid;
}

// Helper function to check for unbalanced HTML tags (warning only)
function checkUnbalancedHTMLTags(html) {
  const tagRegex = /<\/?([a-z][a-z0-9]*)[^>]*>/gi;
  const tags = html.match(tagRegex) || [];

  const stack = [];
  let unbalancedCount = 0;

  tags.forEach((tag) => {
    const isClosing = tag.startsWith("</");
    const tagName = tag
      .replace(/<\/?([a-z][a-z0-9]*)[^>]*>/i, "$1")
      .toLowerCase();

    if (!isClosing) {
      // Opening tag
      stack.push(tagName);
    } else {
      // Closing tag
      const lastTag = stack.pop();
      if (lastTag !== tagName) {
        unbalancedCount++;
      }
    }
  });

  // Add remaining unclosed tags
  unbalancedCount += stack.length;

  return unbalancedCount;
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

  // If no match found, activate add-lesson if we're on it
  if (currentPage === "add-lesson") {
    const addLessonLink = document.querySelector('a[href="/?page=add-lesson"]');
    if (addLessonLink) {
      addLessonLink.classList.add("active");
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

// Function to show success message
function showSuccessMessage(message) {
  const alert = document.getElementById("success-message");
  const messageText = document.getElementById("message-text");

  if (alert && messageText) {
    messageText.textContent = message;
    alert.classList.remove("d-none");
    alert.classList.remove("alert-danger");
    alert.classList.add("alert-success");

    // Scroll to top to show message
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Auto-hide after 5 seconds
    setTimeout(() => {
      alert.classList.add("d-none");
    }, 5000);
  }
}

// Function to show error message
function showError(message) {
  const alert = document.getElementById("error-message");
  const errorText = document.getElementById("error-text");

  if (alert && errorText) {
    errorText.textContent = message;
    alert.classList.remove("d-none");

    // Scroll to top to show error
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// Function to hide error alert
function hideErrorAlert() {
  const alert = document.getElementById("error-message");
  if (alert) {
    alert.classList.add("d-none");
  }
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

// Make functions available globally
window.logout = logout;
