// Lesson Item Modal Component JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Bootstrap modal
  const lessonModal = new bootstrap.Modal(
    document.getElementById("lessonModal")
  );
  const lessonContentContainer = document.getElementById(
    "lessonContentContainer"
  );
  const template = document.getElementById("lessonContentTemplate");

  // Quiz state variables
  let currentQuizAnswers = {};
  let quizSubmitted = false;
  let currentLessonId = null;

  // Listen for custom event to open lesson modal
  document.addEventListener("openLessonModal", function (event) {
    const { lessonId, lessonTitle } = event.detail;
    openLessonModal(lessonId, lessonTitle);
  });

  // Function to open lesson modal
  function openLessonModal(lessonId, lessonTitle) {
    // Store current lesson ID for quiz
    currentLessonId = lessonId;

    // Update modal title in blue header
    document.getElementById("lessonModalTitle").textContent =
      lessonTitle || "Leçon";

    // Reset content to loading state
    lessonContentContainer.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Chargement de la leçon...</span>
                </div>
                <p class="mt-3">Chargement du contenu de la leçon...</p>
            </div>
        `;

    // Show the modal
    lessonModal.show();

    // Load lesson details
    loadLessonDetails(lessonId, lessonTitle);
  }

  // Function to load lesson details from REAL API
  async function loadLessonDetails(lessonId, lessonTitle) {
    try {
      // Call REAL API
      const response = await fetch(
        `/backend/api/lessons/get_single.php?id=${lessonId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data && data.data.lesson) {
        // Use REAL lesson data from API
        renderLessonContent(data.data.lesson);
      } else {
        // If API fails, show error
        showLessonError("Impossible de charger cette leçon.");
      }
    } catch (error) {
      console.error("Error loading lesson:", error);
      showLessonError("Erreur de connexion au serveur.");
    }
  }

  // Function to show error message
  function showLessonError(message) {
    lessonContentContainer.innerHTML = `
      <div class="text-center py-5">
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>
          ${message}
          <br><small>Veuillez réessayer ou contacter l'administrateur.</small>
        </div>
      </div>
    `;
  }

  // Function to render lesson content
  function renderLessonContent(lessonData) {
    // Clone the template
    const contentClone = template.cloneNode(true);
    contentClone.style.display = "block";

    // Populate lesson content (NO TITLE - only content section)
    // Use the content from database, fallback to placeholder if empty
    const lessonContent =
      lessonData.content && lessonData.content.trim() !== ""
        ? lessonData.content
        : `<p>Contenu de la leçon non disponible pour le moment.</p>`;

    contentClone.querySelector(".lesson-content").innerHTML = lessonContent;

    // Set YouTube video URL if exists
    const iframe = contentClone.querySelector("iframe");
    if (lessonData.video_url && lessonData.video_url.trim() !== "") {
      iframe.src = lessonData.video_url;
    } else {
      // Hide video section if no video URL
      contentClone.querySelector(".lesson-video-section").style.display =
        "none";
    }

    // Update the main container
    lessonContentContainer.innerHTML = "";
    lessonContentContainer.appendChild(contentClone);

    // Initialize quiz for this lesson
    initializeQuizForLesson(lessonData.id);

    console.log("Lesson content rendered:", lessonData.title);
  }

  // ==================== QUIZ FUNCTIONALITY ====================

  // Initialize quiz for a specific lesson
  function initializeQuizForLesson(lessonId) {
    console.log("Initializing quiz for lesson:", lessonId);

    // Reset quiz state
    resetQuiz();

    // Show quiz section (it's always visible in our updated HTML)
    const quizSection = document.getElementById("quizSection");
    if (quizSection) {
      console.log("Quiz section found, setting up event listeners");

      // Set up click event listeners for quiz options
      setupQuizEventListeners();

      // Set up submit button
      const submitBtn = document.getElementById("submitQuiz");
      if (submitBtn) {
        submitBtn.addEventListener("click", submitQuiz);
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<i class="fas fa-paper-plane me-2"></i>Soumettre le Quiz';
        submitBtn.style.display = "block";
      }
    } else {
      console.error("Quiz section not found in DOM");
    }
  }

  // Reset quiz state
  function resetQuiz() {
    currentQuizAnswers = {};
    quizSubmitted = false;

    // Reset all quiz options
    document.querySelectorAll(".quiz-option").forEach((option) => {
      option.classList.remove("selected", "correct", "incorrect");
    });

    // Hide all explanations
    document.querySelectorAll(".explanation").forEach((expl) => {
      expl.style.display = "none";
    });

    // Reset submit button
    const submitBtn = document.getElementById("submitQuiz");
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML =
        '<i class="fas fa-paper-plane me-2"></i>Soumettre le Quiz';
      submitBtn.style.display = "block";
    }

    // Hide quiz results
    const quizResult = document.getElementById("quizResult");
    if (quizResult) {
      quizResult.style.display = "none";
    }
  }

  // Set up event listeners for quiz options
  function setupQuizEventListeners() {
    // Remove any existing listeners first
    document.querySelectorAll(".quiz-option").forEach((option) => {
      option.replaceWith(option.cloneNode(true));
    });

    // Add click listeners to quiz options
    document.querySelectorAll(".quiz-option").forEach((option) => {
      option.addEventListener("click", function () {
        if (quizSubmitted) return;

        const questionId = this.getAttribute("data-question");
        const optionValue = this.getAttribute("data-option");

        selectAnswer(questionId, optionValue);
      });
    });
  }

  // Function to select answer
  function selectAnswer(questionId, option) {
    if (quizSubmitted) return;

    // Remove selected class from all options for this question
    const options = document.querySelectorAll(
      `[data-question="${questionId}"]`
    );
    options.forEach((opt) => opt.classList.remove("selected"));

    // Add selected class to clicked option
    const selectedOption = document.querySelector(
      `[data-question="${questionId}"][data-option="${option}"]`
    );
    if (selectedOption) {
      selectedOption.classList.add("selected");
    }

    // Store answer
    currentQuizAnswers[questionId] = option;
  }

  // Function to submit quiz
  function submitQuiz() {
    if (quizSubmitted) return;

    // Correct answers for mock questions (from our HTML)
    const correctAnswers = {
      1: "c", // Paris
      2: "b", // Manger
      3: "a", // vais
    };

    let score = 0;
    const totalQuestions = Object.keys(correctAnswers).length;

    // Check answers
    for (let questionId in correctAnswers) {
      const userAnswer = currentQuizAnswers[questionId];
      const correctAnswer = correctAnswers[questionId];
      const explanationDiv = document.getElementById(
        `explanation-${questionId}`
      );

      // Highlight correct/incorrect answers
      const options = document.querySelectorAll(
        `[data-question="${questionId}"]`
      );
      options.forEach((opt) => {
        opt.classList.remove("correct", "incorrect");
        if (opt.dataset.option === correctAnswer) {
          opt.classList.add("correct");
        } else if (
          opt.dataset.option === userAnswer &&
          userAnswer !== correctAnswer
        ) {
          opt.classList.add("incorrect");
        }
      });

      // Show explanation
      if (explanationDiv) {
        explanationDiv.style.display = "block";
      }

      // Calculate score
      if (userAnswer === correctAnswer) {
        score++;
      }
    }

    // Display result
    const percentage = Math.round((score / totalQuestions) * 100);
    let resultClass = "alert-success";
    let message = "Excellent travail!";

    if (percentage < 50) {
      resultClass = "alert-danger";
      message = "Essayez encore!";
    } else if (percentage < 75) {
      resultClass = "alert-warning";
      message = "Bon travail!";
    }

    const quizResult = document.getElementById("quizResult");
    if (quizResult) {
      quizResult.innerHTML = `
        <div class="alert ${resultClass}">
          <h5><i class="fas fa-chart-bar me-2"></i>Résultat du Quiz</h5>
          <p>Score: <strong>${score}/${totalQuestions}</strong> (${percentage}%)</p>
          <p class="mb-0">${message}</p>
        </div>
      `;
      quizResult.style.display = "block";
    }

    // Disable submit button
    const submitBtn = document.getElementById("submitQuiz");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Quiz Terminé';
    }

    quizSubmitted = true;
  }

  // ==================== END QUIZ FUNCTIONALITY ====================

  // Cleanup on modal hide
  document
    .getElementById("lessonModal")
    .addEventListener("hidden.bs.modal", function () {
      lessonContentContainer.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Chargement de la leçon...</span>
                </div>
                <p class="mt-3">Chargement du contenu de la leçon...</p>
            </div>
        `;
      document.getElementById("lessonModalTitle").textContent =
        "Chargement de la leçon...";

      // Reset quiz when modal closes
      resetQuiz();
      currentLessonId = null;
    });

  console.log("Lesson item JS loaded - Real data enabled");
});
