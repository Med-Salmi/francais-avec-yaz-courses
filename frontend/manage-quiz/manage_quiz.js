// API Base URLs
const API_BASE_URL = "/backend/api";
const LESSONS_API = `${API_BASE_URL}/lessons/get_single.php`;
const QUIZ_API = `${API_BASE_URL}/quiz`;

// Global variables
let currentLessonId = 0;
let currentLessonData = null;
let currentQuestions = [];
let isEditing = false;
let editingQuestionId = 0;

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Manage Quiz page loaded");

  // Get lesson ID from URL or hidden field
  currentLessonId = document.getElementById("lesson-id")
    ? parseInt(document.getElementById("lesson-id").textContent)
    : 0;

  if (currentLessonId <= 0) {
    showError("Aucun ID de leçon spécifié");
    return;
  }

  // Initialize page
  initPage();
});

// Initialize page
async function initPage() {
  try {
    // First check authentication
    await checkAuth();

    // Load lesson data and questions
    await Promise.all([loadLessonData(), loadQuizQuestions()]);

    // Setup event listeners
    setupEventListeners();

    // Hide loading, show content
    document.getElementById("loading-state").classList.add("d-none");
    document.getElementById("content-container").classList.remove("d-none");
  } catch (error) {
    console.error("Error initializing page:", error);
    showError("Erreur de chargement des données");
  }
}

// Check authentication
async function checkAuth() {
  try {
    const response = await fetch("/backend/api/auth/check.php", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Not authenticated");
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    window.location.href = "/?page=login";
  }
}

// Load lesson data
async function loadLessonData() {
  try {
    const response = await fetch(`${LESSONS_API}?id=${currentLessonId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data.lesson) {
      currentLessonData = data.data.lesson;
      updateLessonInfo();
    } else {
      throw new Error(data.message || "Failed to load lesson");
    }
  } catch (error) {
    console.error("Error loading lesson:", error);
    document.getElementById("lesson-not-found").classList.remove("d-none");
    document.getElementById("content-container").classList.add("d-none");
    throw error;
  }
}

// Update lesson info display
function updateLessonInfo() {
  if (!currentLessonData) return;

  document.getElementById("lesson-title").textContent = escapeHtml(
    currentLessonData.title
  );
  document.getElementById("lesson-id").textContent = currentLessonData.id;
}

// Load quiz questions
async function loadQuizQuestions() {
  try {
    const response = await fetch(
      `${QUIZ_API}/get.php?lesson_id=${currentLessonId}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      currentQuestions = data.data.questions || [];
      displayQuestions();
    } else {
      throw new Error(data.message || "Failed to load questions");
    }
  } catch (error) {
    console.error("Error loading quiz questions:", error);
    showError("Erreur de chargement des questions");
    currentQuestions = [];
    displayQuestions();
  }
}

// Display questions in the list
function displayQuestions() {
  const questionsList = document.getElementById("questions-list");
  const questionsCount = document.getElementById("questions-count");
  const noQuestionsMessage = document.getElementById("no-questions-message");

  // Update count
  questionsCount.textContent = currentQuestions.length;

  // Show/hide no questions message
  if (currentQuestions.length === 0) {
    noQuestionsMessage.classList.remove("d-none");
    questionsList.innerHTML = "";
    return;
  } else {
    noQuestionsMessage.classList.add("d-none");
  }

  // Build questions HTML
  let html = "";
  currentQuestions.forEach((question, index) => {
    html += createQuestionCard(question, index + 1);
  });

  questionsList.innerHTML = html;

  // Add event listeners to action buttons
  document.querySelectorAll(".edit-question-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const questionId = parseInt(this.dataset.questionId);
      openEditForm(questionId);
    });
  });

  document.querySelectorAll(".delete-question-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const questionId = parseInt(this.dataset.questionId);
      deleteQuestion(questionId);
    });
  });
}

// Create HTML for a question card
function createQuestionCard(question, number) {
  const optionLetters = ["A", "B", "C", "D"];
  const options = [
    question.option_a,
    question.option_b,
    question.option_c,
    question.option_d,
  ];
  const correctAnswer = question.correct_answer.toLowerCase();
  const correctIndex = ["a", "b", "c", "d"].indexOf(correctAnswer);

  let optionsHtml = "";
  options.forEach((option, index) => {
    if (!option && index >= 2) return; // Skip empty options C and D

    const isCorrect = index === correctIndex;
    const optionLetter = optionLetters[index];
    const optionKey = ["a", "b", "c", "d"][index];

    optionsHtml += `
      <div class="d-flex align-items-center mb-2 ${
        isCorrect ? "correct-option" : ""
      }">
        <span class="option-letter">${optionLetter}</span>
        <span class="option-text">
          ${escapeHtml(option)}
          ${
            isCorrect
              ? '<span class="correct-badge badge bg-success">Correct</span>'
              : ""
          }
        </span>
      </div>
    `;
  });

  return `
    <div class="question-card" id="question-${question.id}">
      <div class="question-header">
        <div class="d-flex justify-content-between align-items-start">
          <h5 class="mb-0">Question #${number}</h5>
          <div class="btn-group">
            <button class="btn btn-sm btn-warning edit-question-btn" data-question-id="${
              question.id
            }">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger delete-question-btn" data-question-id="${
              question.id
            }">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <p class="mb-0 mt-2"><strong>${escapeHtml(
          question.question
        )}</strong></p>
      </div>
      
      <div class="question-options">
        ${optionsHtml}
      </div>
      
      ${
        question.explanation
          ? `
        <div class="explanation-box">
          <strong><i class="fas fa-lightbulb me-2"></i>Explication:</strong>
          <p class="mb-0 mt-1">${escapeHtml(question.explanation)}</p>
        </div>
      `
          : ""
      }
    </div>
  `;
}

// Setup event listeners
function setupEventListeners() {
  // Add question form
  const addForm = document.getElementById("add-question-form");
  if (addForm) {
    addForm.addEventListener("submit", handleAddQuestion);
  }

  // Reset form button
  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetForm);
  }

  // Refresh button
  const refreshBtn = document.getElementById("refresh-btn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", refreshData);
  }

  // Character counter for question textarea
  const questionField = document.getElementById("question");
  if (questionField) {
    const charCounter = document.getElementById("question-char-count");
    questionField.addEventListener("input", function () {
      const charCount = this.value.length;
      charCounter.textContent = charCount;

      // Color coding
      charCounter.className = "char-counter";
      if (charCount < 10) {
        charCounter.classList.add("error");
      } else if (charCount < 20) {
        charCounter.classList.add("warning");
      } else {
        charCounter.classList.add("success");
      }
    });
    // Trigger initial count
    questionField.dispatchEvent(new Event("input"));
  }

  // Real-time validation
  const formInputs = addForm.querySelectorAll("input, textarea, select");
  formInputs.forEach((input) => {
    input.addEventListener("input", function () {
      this.classList.remove("is-invalid");
      hideErrorAlert();
    });
  });
}

// Handle add question form submission
async function handleAddQuestion(event) {
  event.preventDefault();

  // Validate form
  if (!validateAddForm()) {
    return false;
  }

  const submitBtn = document.getElementById("submit-btn");
  const originalText = submitBtn.innerHTML;

  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin me-2"></i>Ajout en cours...';

  try {
    // Prepare form data
    const formData = {
      lesson_id: currentLessonId,
      question: document.getElementById("question").value.trim(),
      option_a: document.getElementById("option_a").value.trim(),
      option_b: document.getElementById("option_b").value.trim(),
      option_c: document.getElementById("option_c").value.trim(),
      option_d: document.getElementById("option_d").value.trim(),
      correct_answer: document.getElementById("correct_answer").value,
      explanation: document.getElementById("explanation").value.trim(),
    };

    // Send request
    const response = await fetch(`${QUIZ_API}/create.php`, {
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
      showSuccessMessage("Question ajoutée avec succès!");

      // Reset form
      resetForm();

      // Reload questions
      await loadQuizQuestions();
    } else {
      // Show error message
      showError("Erreur: " + data.message);
    }
  } catch (error) {
    console.error("Error adding question:", error);
    showError("Erreur lors de l'ajout. Veuillez réessayer.");
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

// Validate add question form
function validateAddForm() {
  let isValid = true;

  // Get form elements
  const question = document.getElementById("question").value.trim();
  const optionA = document.getElementById("option_a").value.trim();
  const optionB = document.getElementById("option_b").value.trim();
  const optionC = document.getElementById("option_c").value.trim();
  const optionD = document.getElementById("option_d").value.trim();
  const correctAnswer = document.getElementById("correct_answer").value;

  // Reset all error states
  hideAllAlerts();
  const formInputs = document.querySelectorAll(
    "#add-question-form input, #add-question-form textarea, #add-question-form select"
  );
  formInputs.forEach((input) => input.classList.remove("is-invalid"));

  // Validate question
  if (!question) {
    showError("La question est obligatoire");
    document.getElementById("question").classList.add("is-invalid");
    isValid = false;
  } else if (question.length < 5) {
    showError("La question doit contenir au moins 5 caractères");
    document.getElementById("question").classList.add("is-invalid");
    isValid = false;
  }

  // Validate option A
  if (!optionA) {
    showError("L'option A est obligatoire");
    document.getElementById("option_a").classList.add("is-invalid");
    isValid = false;
  }

  // Validate option B
  if (!optionB) {
    showError("L'option B est obligatoire");
    document.getElementById("option_b").classList.add("is-invalid");
    isValid = false;
  }

  // Validate correct answer
  if (!correctAnswer) {
    showError("La réponse correcte est obligatoire");
    document.getElementById("correct_answer").classList.add("is-invalid");
    isValid = false;
  }

  // Validate that if correct answer is C or D, the option must not be empty
  if (correctAnswer === "c" && !optionC) {
    showError("L'option C est obligatoire lorsque C est la réponse correcte");
    document.getElementById("option_c").classList.add("is-invalid");
    isValid = false;
  }

  if (correctAnswer === "d" && !optionD) {
    showError("L'option D est obligatoire lorsque D est la réponse correcte");
    document.getElementById("option_d").classList.add("is-invalid");
    isValid = false;
  }

  return isValid;
}

// Reset form
function resetForm() {
  document.getElementById("add-question-form").reset();
  hideAllAlerts();

  // Reset character counter
  const questionField = document.getElementById("question");
  if (questionField) {
    questionField.dispatchEvent(new Event("input"));
  }
}

// Refresh data
async function refreshData() {
  const refreshBtn = document.getElementById("refresh-btn");
  const originalText = refreshBtn.innerHTML;

  // Show loading on refresh button
  refreshBtn.disabled = true;
  refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>';

  try {
    await loadQuizQuestions();
    showSuccessMessage("Liste actualisée");
  } catch (error) {
    console.error("Error refreshing data:", error);
    showError("Erreur lors de l'actualisation");
  } finally {
    // Restore refresh button
    refreshBtn.disabled = false;
    refreshBtn.innerHTML = originalText;
  }
}

// Open edit form for a question
function openEditForm(questionId) {
  const question = currentQuestions.find((q) => q.id === questionId);
  if (!question) return;

  editingQuestionId = questionId;
  isEditing = true;

  // Create edit form overlay
  const overlay = document.createElement("div");
  overlay.className = "edit-overlay";
  overlay.innerHTML = `
    <div class="edit-form-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4><i class="fas fa-edit me-2"></i>Modifier la question</h4>
        <button type="button" class="btn-close" id="close-edit-form"></button>
      </div>
      
      <form id="edit-question-form">
        <input type="hidden" id="edit-question-id" value="${question.id}">
        <input type="hidden" id="edit-lesson-id" value="${currentLessonId}">
        
        <div class="mb-3">
          <label for="edit-question" class="form-label">
            Question <span class="text-danger">*</span>
          </label>
          <textarea class="form-control" id="edit-question" name="question" rows="3" required>${escapeHtml(
            question.question
          )}</textarea>
        </div>
        
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="edit-option_a" class="form-label">
              Option A <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" id="edit-option_a" value="${escapeHtml(
              question.option_a
            )}" required>
          </div>
          
          <div class="col-md-6 mb-3">
            <label for="edit-option_b" class="form-label">
              Option B <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" id="edit-option_b" value="${escapeHtml(
              question.option_b
            )}" required>
          </div>
          
          <div class="col-md-6 mb-3">
            <label for="edit-option_c" class="form-label">
              Option C
            </label>
            <input type="text" class="form-control" id="edit-option_c" value="${escapeHtml(
              question.option_c || ""
            )}">
          </div>
          
          <div class="col-md-6 mb-3">
            <label for="edit-option_d" class="form-label">
              Option D
            </label>
            <input type="text" class="form-control" id="edit-option_d" value="${escapeHtml(
              question.option_d || ""
            )}">
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="edit-correct_answer" class="form-label">
              Réponse correcte <span class="text-danger">*</span>
            </label>
            <select class="form-select" id="edit-correct_answer" required>
              <option value="a" ${
                question.correct_answer === "a" ? "selected" : ""
              }>Option A</option>
              <option value="b" ${
                question.correct_answer === "b" ? "selected" : ""
              }>Option B</option>
              <option value="c" ${
                question.correct_answer === "c" ? "selected" : ""
              }>Option C</option>
              <option value="d" ${
                question.correct_answer === "d" ? "selected" : ""
              }>Option D</option>
            </select>
          </div>
          
          <div class="col-md-6 mb-3">
            <label for="edit-explanation" class="form-label">
              Explication (optionnelle)
            </label>
            <textarea class="form-control" id="edit-explanation" rows="2">${escapeHtml(
              question.explanation || ""
            )}</textarea>
          </div>
        </div>
        
        <div class="d-flex justify-content-between mt-4">
          <button type="button" class="btn btn-secondary" id="cancel-edit">
            <i class="fas fa-times me-2"></i>Annuler
          </button>
          <button type="submit" class="btn btn-primary" id="save-edit">
            <i class="fas fa-save me-2"></i>Enregistrer
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  // Add event listeners for edit form
  document
    .getElementById("close-edit-form")
    .addEventListener("click", closeEditForm);
  document
    .getElementById("cancel-edit")
    .addEventListener("click", closeEditForm);
  document
    .getElementById("edit-question-form")
    .addEventListener("submit", handleEditQuestion);
}

// Handle edit question submission
async function handleEditQuestion(event) {
  event.preventDefault();

  const saveBtn = document.getElementById("save-edit");
  const originalText = saveBtn.innerHTML;

  // Disable save button
  saveBtn.disabled = true;
  saveBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin me-2"></i>Enregistrement...';

  try {
    // Prepare form data
    const formData = {
      id: editingQuestionId,
      lesson_id: currentLessonId,
      question: document.getElementById("edit-question").value.trim(),
      option_a: document.getElementById("edit-option_a").value.trim(),
      option_b: document.getElementById("edit-option_b").value.trim(),
      option_c: document.getElementById("edit-option_c").value.trim(),
      option_d: document.getElementById("edit-option_d").value.trim(),
      correct_answer: document.getElementById("edit-correct_answer").value,
      explanation: document.getElementById("edit-explanation").value.trim(),
    };

    // Validate data
    if (
      !formData.question ||
      !formData.option_a ||
      !formData.option_b ||
      !formData.correct_answer
    ) {
      throw new Error("Tous les champs obligatoires doivent être remplis");
    }

    // Send update request
    const response = await fetch(`${QUIZ_API}/update.php`, {
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
      showSuccessMessage("Question modifiée avec succès!");

      // Close edit form
      closeEditForm();

      // Reload questions
      await loadQuizQuestions();
    } else {
      throw new Error(data.message || "Erreur lors de la modification");
    }
  } catch (error) {
    console.error("Error editing question:", error);
    showError("Erreur: " + error.message);
  } finally {
    // Re-enable save button
    saveBtn.disabled = false;
    saveBtn.innerHTML = originalText;
  }
}

// Close edit form
function closeEditForm() {
  const overlay = document.querySelector(".edit-overlay");
  if (overlay) {
    overlay.remove();
  }
  isEditing = false;
  editingQuestionId = 0;
}

// Delete a question
async function deleteQuestion(questionId) {
  if (
    !confirm(
      "Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible."
    )
  ) {
    return;
  }

  if (
    !confirm(
      "Dernière confirmation : Voulez-vous vraiment supprimer cette question ?"
    )
  ) {
    return;
  }

  try {
    const response = await fetch(`${QUIZ_API}/delete.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id: questionId }),
    });

    const data = await response.json();

    if (data.success) {
      // Show success message
      showSuccessMessage("Question supprimée avec succès!");

      // Remove question from local array
      currentQuestions = currentQuestions.filter((q) => q.id !== questionId);

      // Update display
      displayQuestions();
    } else {
      throw new Error(data.message || "Erreur lors de la suppression");
    }
  } catch (error) {
    console.error("Error deleting question:", error);
    showError("Erreur: " + error.message);
  }
}

// Helper functions for messages
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

function showError(message) {
  const alert = document.getElementById("error-message");
  const errorText = document.getElementById("error-text");

  if (alert && errorText) {
    errorText.textContent = message;
    alert.classList.remove("d-none");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function hideErrorAlert() {
  const alert = document.getElementById("error-message");
  if (alert) {
    alert.classList.add("d-none");
  }
}

function hideAllAlerts() {
  const successAlert = document.getElementById("success-message");
  const errorAlert = document.getElementById("error-message");
  if (successAlert) successAlert.classList.add("d-none");
  if (errorAlert) errorAlert.classList.add("d-none");
}

// Helper function to escape HTML
function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Setup sidebar navigation (same as other pages)
function setupSidebarNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");

  // Highlight current page
  navLinks.forEach((link) => link.classList.remove("active"));

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

// Logout function
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
