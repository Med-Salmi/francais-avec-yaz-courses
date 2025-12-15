/**
 * Categories Component JavaScript
 */
document.addEventListener("DOMContentLoaded", function () {
  // Listen for level changes from level selector
  document.addEventListener("levelChanged", function (e) {
    console.log("Level changed to:", e.detail.level);
    loadCategoriesForLevel(e.detail.level);
  });

  // Load initial categories for default level (Tronc Commun)
  loadCategoriesForLevel("tronc-commun");
});

// Function to load categories based on level
function loadCategoriesForLevel(level) {
  const container = document.getElementById("categories-container");

  // Show loading state
  container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Chargement...</span>
            </div>
            <p class="mt-3">Chargement des catégories pour ${level}...</p>
        </div>
    `;

  // Simulate API delay
  setTimeout(() => {
    const categories = getCategoriesByLevel(level);
    displayCategories(categories);
  }, 500);
}

// Function to get categories based on level
function getCategoriesByLevel(level) {
  const categories = {
    "tronc-commun": [
      {
        id: 1,
        name: "Lecture",
        slug: "lecture",
        description: "Compréhension de textes",
      },
      {
        id: 2,
        name: "Langue",
        slug: "langue",
        description: "Grammaire et vocabulaire",
      },
      {
        id: 3,
        name: "Production Écrite",
        slug: "production-ecrite",
        description: "Rédaction et composition",
      },
      {
        id: 4,
        name: "Production Orale",
        slug: "production-orale",
        description: "Expression et communication",
      },
      {
        id: 5,
        name: "Travaux Encadrés",
        slug: "traveaux-encadres",
        description: "Projets supervisés",
      },
      {
        id: 6,
        name: "Résumés",
        slug: "resumes",
        description: "Synthèse de documents",
      },
    ],
    "1ere-annee-bac": [
      {
        id: 7,
        name: "Étude de Texte",
        slug: "etude-de-texte",
        description: "Analyse littéraire",
      },
      {
        id: 8,
        name: "Langue",
        slug: "langue",
        description: "Grammaire et vocabulaire",
      },
      {
        id: 9,
        name: "Production Écrite",
        slug: "production-ecrite",
        description: "Rédaction et composition",
      },
      {
        id: 10,
        name: "Production Orale",
        slug: "production-orale",
        description: "Expression et communication",
      },
      {
        id: 11,
        name: "Travaux Encadrés",
        slug: "traveaux-encadres",
        description: "Projets supervisés",
      },
      {
        id: 12,
        name: "Résumés",
        slug: "resumes",
        description: "Synthèse de documents",
      },
    ],
  };

  return categories[level] || [];
}

// Function to display categories
function displayCategories(categories) {
  const container = document.getElementById("categories-container");

  if (categories.length === 0) {
    container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    Aucune catégorie disponible pour ce niveau.
                </div>
            </div>
        `;
    return;
  }

  container.innerHTML = "";

  categories.forEach((category) => {
    const categoryClass = getCategoryClass(category.slug);
    const icon = getCategoryIcon(category.slug);

    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4 mb-4";
    col.innerHTML = `
            <div class="card category-card h-100">
                <div class="card-body text-center">
                    <div class="category-icon ${categoryClass}">
                        <i class="${icon} text-white"></i>
                    </div>
                    <h4 class="category-title">${category.name}</h4>
                    <p class="text-muted mb-3">${category.description}</p>
                    <button class="btn btn-primary mt-3" onclick="openCategoryModal(${category.id}, '${category.name}')">
                        <i class="fas fa-book-open me-2"></i>Voir les leçons
                    </button>
                </div>
            </div>
        `;

    container.appendChild(col);
  });
}

// Helper function to get CSS class for category icon
function getCategoryClass(slug) {
  const classes = {
    langue: "langue-bg",
    lecture: "lecture-bg",
    "production-orale": "orale-bg",
    "production-ecrite": "ecrite-bg",
    resumes: "resumes-bg",
    "traveaux-encadres": "users-bg",
    "etude-de-texte": "texte-bg",
  };
  return classes[slug] || "langue-bg";
}

// Helper function to get icon for category
function getCategoryIcon(slug) {
  const icons = {
    langue: "fas fa-language",
    lecture: "fas fa-book-open",
    "production-orale": "fas fa-microphone-alt",
    "production-ecrite": "fas fa-edit",
    resumes: "fas fa-file-contract",
    "traveaux-encadres": "fas fa-users",
    "etude-de-texte": "fas fa-file-alt",
  };
  return icons[slug] || "fas fa-folder";
}

// Function to open category modal (placeholder for now)
function openCategoryModal(categoryId, categoryName) {
  alert(
    `Ouvrir les leçons pour: ${categoryName} (ID: ${categoryId})\n\nCette fonctionnalité sera implémentée avec le composant modals.`
  );
  console.log(`Category clicked: ${categoryName}, ID: ${categoryId}`);
}
