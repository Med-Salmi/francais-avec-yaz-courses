document.addEventListener("DOMContentLoaded", function () {
  // Listen for level changes from level selector
  document.addEventListener("levelChanged", function (e) {
    console.log("Level changed to:", e.detail.level);
    loadCategoriesForLevel(e.detail.level);
  });

  // Load initial categories for default level (Tronc Commun)
  loadCategoriesForLevel("tronc-commun");
});

async function loadCategoriesForLevel(level) {
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

  try {
    // Call the REAL API
    const response = await fetch(
      `/backend/api/categories/get.php?level=${level}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data && data.data.categories) {
      // Use REAL categories from API
      displayCategories(data.data.categories, level);
    } else {
      // Show error message to user
      container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Aucune catégorie disponible pour "${level}".
                </div>
            </div>
        `;
    }
  } catch (error) {
    // Show error message to user
    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="alert alert-danger">
                <i class="fas fa-times-circle me-2"></i>
                Erreur de chargement des catégories.
                <br><small>Veuillez réessayer ou contacter l'administrateur.</small>
            </div>
        </div>
    `;
    console.error("Error loading categories:", error);
  }
}

// Helper function to extract categories from API response
function extractCategoriesFromApi(apiData, levelSlug) {
  // Case 1: API returns an array of categories directly
  if (Array.isArray(apiData) && apiData.length > 0 && apiData[0].id) {
    // Filter by level if level information is in categories
    return apiData.filter((cat) => {
      const catLevel =
        cat.level_slug ||
        (cat.level_name
          ? cat.level_name.toLowerCase().replace(/\s+/g, "-")
          : "");
      return catLevel.includes(levelSlug);
    });
  }

  // Case 2: API returns grouped data by level (my earlier assumption)
  if (Array.isArray(apiData) && apiData.length > 0 && apiData[0].categories) {
    const levelGroup = apiData.find((group) => {
      const groupLevel =
        group.level_slug ||
        (group.level_name
          ? group.level_name.toLowerCase().replace(/\s+/g, "-")
          : "");
      return groupLevel && groupLevel.includes(levelSlug);
    });
    return levelGroup ? levelGroup.categories : [];
  }

  // Case 3: Unknown structure, return empty
  console.warn("Unknown API structure:", apiData);
  return [];
}

// Function to get mock categories based on level (fallback)
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
function displayCategories(categories, level) {
  const container = document.getElementById("categories-container");

  if (!categories || categories.length === 0) {
    container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Aucune catégorie disponible pour "${level}".<br>
                    <small>Vérifiez votre connexion ou contactez l'administrateur.</small>
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
                    <button class="btn btn-primary mt-3 view-lessons-btn" 
                            data-category-id="${category.id}" 
                            data-category-name="${category.name}">
                        <i class="fas fa-book-open me-2"></i>Voir les leçons
                    </button>
                </div>
            </div>
        `;

    container.appendChild(col);
  });

  // Add event listeners to all "Voir les leçons" buttons
  container.querySelectorAll(".view-lessons-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const categoryId = this.getAttribute("data-category-id");
      const categoryName = this.getAttribute("data-category-name");
      openLessonsModal(categoryId, categoryName);
    });
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

// Function to open lessons modal
function openLessonsModal(categoryId, categoryName) {
  // Dispatch custom event that the lessons-list modal will listen for
  const event = new CustomEvent("openLessonsModal", {
    detail: {
      categoryId: categoryId,
      categoryName: categoryName,
    },
  });
  document.dispatchEvent(event);
}
