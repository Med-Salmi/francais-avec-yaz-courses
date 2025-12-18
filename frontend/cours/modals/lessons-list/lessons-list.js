// Lessons List Modal Component JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Bootstrap modal
  const lessonsModalElement = document.getElementById("lessonsModal");
  if (!lessonsModalElement) {
    console.error("ERROR: lessonsModal element not found!");
    return;
  }

  const lessonsModal = new bootstrap.Modal(lessonsModalElement);
  console.log("DEBUG: Bootstrap modal initialized");

  // Listen for custom event to open lessons modal
  document.addEventListener("openLessonsModal", function (event) {
    console.log("DEBUG: Received openLessonsModal event:", event.detail);
    const { categoryId, categoryName } = event.detail;
    openLessonsModal(categoryId, categoryName);
  });

  // Function to open lessons modal
  function openLessonsModal(categoryId, categoryName) {
    console.log(
      "DEBUG: Opening modal for category:",
      categoryName,
      "ID:",
      categoryId
    );

    // Update modal title with category name
    document.getElementById("modalCategoryName").textContent = categoryName;

    // Show the modal
    lessonsModal.show();
    console.log("DEBUG: Modal should be visible now");

    // Load lessons for the category
    loadLessonsForCategory(categoryId, categoryName);
  }

  // Function to load lessons for a category
  function loadLessonsForCategory(categoryId, categoryName) {
    const container = document.getElementById("lessonsListContainer");
    if (!container) {
      console.error("ERROR: lessonsListContainer not found");
      return;
    }

    // Show loading spinner
    container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Chargement...</span>
                </div>
                <p class="mt-3">Chargement des leçons pour "${categoryName}"...</p>
            </div>
        `;

    // Simulate API delay
    setTimeout(() => {
      // Get hardcoded lessons based on category
      const lessons = getMockLessonsByCategory(categoryId, categoryName);
      renderLessons(lessons);
    }, 500);
  }

  // Function to get mock lessons (hardcoded for all categories)
  function getMockLessonsByCategory(categoryId, categoryName) {
    console.log("DEBUG: Getting mock lessons for category ID:", categoryId);

    // Convert categoryId to number for comparison
    const catId = parseInt(categoryId);

    // Hardcoded lessons for ALL categories
    const allMockLessons = {
      // Category ID 1: Lecture
      1: [
        { id: 101, title: "Compréhension de texte narratif" },
        { id: 102, title: "Lecture analytique de poésie" },
      ],
      // Category ID 2: Langue (Tronc Commun)
      2: [
        { id: 201, title: "Grammaire française - Les bases" },
        { id: 202, title: "Conjugaison des verbes au présent" },
        { id: 203, title: "Les accords grammaticaux" },
      ],
      // Category ID 3: Production Écrite
      3: [{ id: 301, title: "Rédaction de paragraphes" }],
      // Category ID 4: Production Orale
      4: [{ id: 401, title: "Expression orale - Introduction" }],
      // Category ID 5: Travaux Encadrés
      5: [{ id: 501, title: "Méthodologie de recherche" }],
      // Category ID 6: Résumés
      6: [{ id: 601, title: "Techniques de résumé" }],
    };

    // Return lessons for this specific category ID
    if (allMockLessons[catId]) {
      console.log("DEBUG: Found", allMockLessons[catId].length, "lessons");
      return allMockLessons[catId];
    }

    // Default lessons if category ID not found
    console.log("DEBUG: Using default lessons");
    return [
      { id: 999, title: `Introduction à ${categoryName}` },
      { id: 998, title: "Exercices pratiques" },
    ];
  }

  // Function to render lessons list
  function renderLessons(lessons) {
    const container = document.getElementById("lessonsListContainer");
    const template = document.querySelector(".lesson-item-template");

    if (!template) {
      console.error("ERROR: lesson-item-template not found");
      return;
    }

    // Clear container
    container.innerHTML = "";

    if (!lessons || lessons.length === 0) {
      container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        Aucune leçon disponible pour cette catégorie.
                    </div>
                </div>
            `;
      return;
    }

    // Render each lesson
    lessons.forEach(function (lesson) {
      const lessonCard = template.cloneNode(true);
      lessonCard.classList.remove("lesson-item-template");
      lessonCard.classList.add("lesson-item");
      lessonCard.style.display = "block";

      // Set ONLY the title
      lessonCard.querySelector(".lesson-title").textContent =
        lesson.title || "Sans titre";

      // Add click event to view lesson button
      const viewButton = lessonCard.querySelector(".view-lesson-btn");
      viewButton.addEventListener("click", function () {
        console.log("DEBUG: View lesson clicked:", lesson.id);

        // Dispatch event to open lesson detail modal
        const event = new CustomEvent("openLessonModal", {
          detail: {
            lessonId: lesson.id,
            lessonTitle: lesson.title,
          },
        });
        document.dispatchEvent(event);

        // Close the lessons modal when opening a lesson
        lessonsModal.hide();
      });

      container.appendChild(lessonCard);
    });

    console.log("DEBUG: Rendered", lessons.length, "lessons");
  }

  // Cleanup on modal hide
  document
    .getElementById("lessonsModal")
    .addEventListener("hidden.bs.modal", function () {
      const container = document.getElementById("lessonsListContainer");
      container.innerHTML = "";
      document.getElementById("modalCategoryName").textContent = "";
    });
});
