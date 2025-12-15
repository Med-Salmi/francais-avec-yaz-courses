/**
 * Exams Grid Component JavaScript
 */
document.addEventListener("DOMContentLoaded", function () {
  // Listen for year filter changes
  document.addEventListener("yearFilterChanged", function (e) {
    console.log("Year filter changed:", e.detail.year);
    loadExams(e.detail.year);
  });

  // Load initial exams
  loadExams(null);
});

// Function to load exams
function loadExams(yearFilter) {
  const container = document.getElementById("exams-container");
  const badge = document.getElementById("exams-count-badge");

  // Show loading
  container.innerHTML = `
        <div class="col-12">
            <div class="loading-spinner">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Chargement...</span>
                </div>
                <p class="mt-3">Chargement des examens...</p>
            </div>
        </div>
    `;

  // Simulate API delay
  setTimeout(() => {
    const exams = getSampleExams(yearFilter);
    displayExams(exams);
    badge.textContent = exams.length;
  }, 800);
}

// Function to get sample exams (filtered by year if provided)
function getSampleExams(yearFilter) {
  const allExams = [
    {
      id: 1,
      title: "Examen de Français - Session Normale",
      description:
        "Examen complet de français pour la 1ère Année Bac. Compréhension de texte, grammaire, et rédaction.",
      exam_year: 2025,
      exam_pdf_path: "#",
      correction_pdf_path: "#",
      created_at: "2025-01-15",
    },
    {
      id: 2,
      title: "Examen de Français - Session de Rattrapage",
      description:
        "Examen de rattrapage avec questions sur la littérature française moderne.",
      exam_year: 2024,
      exam_pdf_path: "#",
      correction_pdf_path: "#",
      created_at: "2024-06-20",
    },
    {
      id: 3,
      title: "Contrôle Continu - Semestre 1",
      description:
        "Contrôle continu portant sur les figures de style et la poésie.",
      exam_year: 2025,
      exam_pdf_path: "#",
      correction_pdf_path: null,
      created_at: "2025-11-10",
    },
    {
      id: 4,
      title: "Examen Blanc - Préparation Bac",
      description: "Examen blanc complet pour la préparation au baccalauréat.",
      exam_year: 2023,
      exam_pdf_path: "#",
      correction_pdf_path: "#",
      created_at: "2023-12-05",
    },
    {
      id: 5,
      title: "Test de Grammaire Avancée",
      description: "Test approfondi sur les temps verbaux et la conjugaison.",
      exam_year: 2025,
      exam_pdf_path: "#",
      correction_pdf_path: "#",
      created_at: "2025-03-22",
    },
    {
      id: 6,
      title: "Examen de Littérature",
      description:
        "Analyse de texte littéraire et questions de culture générale.",
      exam_year: 2022,
      exam_pdf_path: "#",
      correction_pdf_path: null,
      created_at: "2022-05-18",
    },
  ];

  if (!yearFilter) {
    return allExams;
  }

  // Filter by year
  return allExams.filter((exam) => exam.exam_year === yearFilter);
}

// Function to display exams
function displayExams(exams) {
  const container = document.getElementById("exams-container");

  if (exams.length === 0) {
    container.innerHTML = `
            <div class="col-12">
                <div class="no-results">
                    <div class="no-results-icon">
                        <i class="fas fa-file-search"></i>
                    </div>
                    <h4>Aucun examen trouvé</h4>
                    <p class="text-muted">
                        Aucun examen disponible pour les critères sélectionnés.
                    </p>
                </div>
            </div>
        `;
    return;
  }

  container.innerHTML = "";

  exams.forEach((exam) => {
    const col = document.createElement("div");
    col.className = "col-lg-6 mb-4";

    // Determine what buttons to show
    const examButton = exam.exam_pdf_path
      ? `<a href="${exam.exam_pdf_path}" class="btn-download btn-download-exam" download>
           <i class="fas fa-file-pdf me-2"></i>Télécharger le sujet
         </a>`
      : '<span class="text-muted p-3 d-inline-block">Sujet non disponible</span>';

    const correctionButton = exam.correction_pdf_path
      ? `<a href="${exam.correction_pdf_path}" class="btn-download btn-download-correction" download>
           <i class="fas fa-check-circle me-2"></i>Télécharger la correction
         </a>`
      : '<span class="text-muted p-3 d-inline-block">Correction non disponible</span>';

    col.innerHTML = `
            <div class="exam-card">
                <div class="exam-header">
                    <h4 class="exam-title">${exam.title}</h4>
                    <div class="d-flex flex-wrap">
                        <span class="exam-badge level">
                            <i class="fas fa-university me-1"></i>
                            1ère Année Bac
                        </span>
                        <span class="exam-badge year">
                            <i class="fas fa-calendar me-1"></i>
                            ${exam.exam_year || "N/A"}
                        </span>
                    </div>
                </div>
                <div class="exam-body">
                    <p class="exam-description">${exam.description}</p>
                    <div class="exam-actions">
                        ${examButton}
                        ${correctionButton}
                    </div>
                    <div class="mt-3 text-end">
                        <small class="text-muted">
                            <i class="far fa-clock me-1"></i>
                            Ajouté le ${new Date(
                              exam.created_at
                            ).toLocaleDateString("fr-FR")}
                        </small>
                    </div>
                </div>
            </div>
        `;
    container.appendChild(col);
  });
}
