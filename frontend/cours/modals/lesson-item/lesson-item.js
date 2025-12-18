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

  // Listen for custom event to open lesson modal
  document.addEventListener("openLessonModal", function (event) {
    const { lessonId, lessonTitle } = event.detail;
    openLessonModal(lessonId, lessonTitle);
  });

  // Function to open lesson modal
  function openLessonModal(lessonId, lessonTitle) {
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
    setTimeout(() => {
      loadLessonDetails(lessonId, lessonTitle);
    }, 500);
  }

  // Function to load lesson details
  function loadLessonDetails(lessonId, lessonTitle) {
    // Get hardcoded lesson data
    const lessonData = getMockLessonData(lessonId, lessonTitle);

    // Render lesson content
    renderLessonContent(lessonData);
  }

  // Function to get mock lesson data (temporary - keeping sample content)
  function getMockLessonData(lessonId, lessonTitle) {
    // Hardcoded lesson data with YouTube videos
    const mockLessons = {
      // Grammar lessons (201-203)
      201: {
        id: 201,
        title: "Grammaire française - Les bases",
        content: `
                    <h4>Introduction à la grammaire française</h4>
                    <p>La grammaire française est l'ensemble des règles qui régissent la langue française. Ces règles permettent de construire des phrases correctes et compréhensibles.</p>
                    
                    <h5>1. Les articles</h5>
                    <p>Il existe trois types d'articles en français :</p>
                    <ul>
                        <li><strong>Articles définis</strong> : le, la, les (the)</li>
                        <li><strong>Articles indéfinis</strong> : un, une, des (a, an, some)</li>
                        <li><strong>Articles partitifs</strong> : du, de la, des (some, any)</li>
                    </ul>
                    
                    <h5>2. Les noms</h5>
                    <p>Les noms en français ont un genre (masculin ou féminin) et un nombre (singulier ou pluriel).</p>
                    
                    <h5>Exercices pratiques</h5>
                    <p>Complétez les phrases avec l'article approprié :</p>
                    <ol>
                        <li>Je mange ___ pomme. (une)</li>
                        <li>Il lit ___ livre. (le)</li>
                        <li>Nous buvons ___ eau. (de l')</li>
                    </ol>
                    
                    <h5>Objectifs d'apprentissage</h5>
                    <ul>
                        <li>Identifier les différents types d'articles</li>
                        <li>Comprendre le genre et le nombre des noms</li>
                        <li>Appliquer les règles d'accord</li>
                        <li>Construire des phrases simples</li>
                    </ul>
                `,
        videoUrl: "https://www.youtube.com/embed/F6lB8Zq9nus", // French grammar video
      },
      202: {
        id: 202,
        title: "Conjugaison des verbes au présent",
        content: `
                    <h4>Le présent de l'indicatif</h4>
                    <p>Le présent de l'indicatif exprime une action qui se déroule au moment où l'on parle.</p>
                    
                    <h5>1. Verbes du 1er groupe (en -er)</h5>
                    <p>Exemple avec "parler" :</p>
                    <ul>
                        <li>Je parl<strong>e</strong></li>
                        <li>Tu parl<strong>es</strong></li>
                        <li>Il/Elle parl<strong>e</strong></li>
                        <li>Nous parl<strong>ons</strong></li>
                        <li>Vous parl<strong>ez</strong></li>
                        <li>Ils/Elles parl<strong>ent</strong></li>
                    </ul>
                    
                    <h5>2. Verbes du 2ème groupe (en -ir)</h5>
                    <p>Exemple avec "finir" :</p>
                    <ul>
                        <li>Je finis</li>
                        <li>Tu finis</li>
                        <li>Il/Elle finit</li>
                        <li>Nous finissons</li>
                        <li>Vous finissez</li>
                        <li>Ils/Elles finissent</li>
                    </ul>
                    
                    <h5>3. Verbes du 3ème groupe (irréguliers)</h5>
                    <p>Exemple avec "être" :</p>
                    <ul>
                        <li>Je suis</li>
                        <li>Tu es</li>
                        <li>Il/Elle est</li>
                        <li>Nous sommes</li>
                        <li>Vous êtes</li>
                        <li>Ils/Elles sont</li>
                    </ul>
                    
                    <h5>Exercices</h5>
                    <p>Conjuguez les verbes suivants au présent :</p>
                    <ol>
                        <li>Je (manger) ___ une pomme.</li>
                        <li>Tu (finir) ___ tes devoirs.</li>
                        <li>Il (être) ___ content.</li>
                    </ol>
                `,
        videoUrl: "https://www.youtube.com/embed/EkF4JD2rO6Q", // French conjugation video
      },
      203: {
        id: 203,
        title: "Les accords grammaticaux",
        content: `
                    <h4>Les règles d'accord en français</h4>
                    <p>Les accords sont essentiels pour écrire correctement en français. Ils concernent le genre, le nombre, et les participes passés.</p>
                    
                    <h5>1. Accord en genre</h5>
                    <p>L'adjectif s'accorde en genre avec le nom qu'il qualifie :</p>
                    <ul>
                        <li>Un livre <strong>intéressant</strong></li>
                        <li>Une histoire <strong>intéressante</strong></li>
                    </ul>
                    
                    <h5>2. Accord en nombre</h5>
                    <p>L'adjectif s'accorde en nombre avec le nom :</p>
                    <ul>
                        <li>Un livre <strong>intéressant</strong></li>
                        <li>Des livres <strong>intéressants</strong></li>
                    </ul>
                    
                    <h5>3. Accord du participe passé</h5>
                    <p>Avec l'auxiliaire "être", le participe passé s'accorde avec le sujet :</p>
                    <ul>
                        <li>Elle est <strong>partie</strong></li>
                        <li>Ils sont <strong>partis</strong></li>
                    </ul>
                    
                    <p>Avec l'auxiliaire "avoir", le participe passé s'accorde avec le COD placé avant :</p>
                    <ul>
                        <li>Les livres que j'ai <strong>lus</strong></li>
                        <li>La pomme que j'ai <strong>mangée</strong></li>
                    </ul>
                `,
        videoUrl: "https://www.youtube.com/embed/2k1Zt_4jh5U", // French agreements video
      },
      // Default lesson structure (keeping sample content as placeholder)
      default: {
        id: lessonId,
        title: lessonTitle || "Leçon sans titre",
        content: `
                    <h4>Contenu de la leçon</h4>
                    <p>Cette leçon couvre les concepts fondamentaux du sujet.</p>
                    <p>Vous trouverez ci-dessous les informations principales à retenir :</p>
                    <ul>
                        <li>Point important 1</li>
                        <li>Point important 2</li>
                        <li>Point important 3</li>
                    </ul>
                    <p>Ces points seront remplacés par le contenu réel entré par l'administrateur dans la section d'administration.</p>
                `,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Default video
      },
    };

    // Return specific lesson or default
    return mockLessons[lessonId] || mockLessons.default;
  }

  // Function to render lesson content
  function renderLessonContent(lessonData) {
    // Clone the template
    const contentClone = template.cloneNode(true);
    contentClone.style.display = "block";

    // Populate lesson content (NO TITLE - only content section)
    contentClone.querySelector(".lesson-content").innerHTML =
      lessonData.content;

    // Set YouTube video URL
    const iframe = contentClone.querySelector("iframe");
    iframe.src = lessonData.videoUrl;

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

    console.log("Selected answer:", { questionId, option, currentQuizAnswers });
  }

  // Function to submit quiz
  function submitQuiz() {
    if (quizSubmitted) return;

    console.log("Submitting quiz...", currentQuizAnswers);

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
    console.log("Quiz submitted. Score:", score, "/", totalQuestions);
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
    });

  // Initialize quiz on page load (for testing)
  console.log("Lesson item JS loaded - Quiz functionality ready");
});
