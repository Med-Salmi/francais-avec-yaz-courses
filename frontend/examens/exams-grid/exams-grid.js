document.addEventListener("DOMContentLoaded", function () {
  // Listen for year filter changes
  document.addEventListener("yearFilterChanged", function (e) {
    console.log("Year filter changed:", e.detail.year);
    loadExams(e.detail.year);
  });

  // Load initial exams
  loadExams(null);
});

// Function to load exams from REAL API
async function loadExams(yearFilter) {
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

  try {
    // Build API URL with filters
    let apiUrl = "/backend/api/exams/get.php?level=1ere-annee-bac";

    if (yearFilter) {
      apiUrl += `&year=${yearFilter}`;
    }

    console.log("Fetching exams from:", apiUrl);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data) {
      // Use REAL exams from API
      displayExams(data.data.exams);
      badge.textContent = data.data.count;

      // Update filter component with real years
      if (data.data.filters && data.data.filters.years) {
        updateFilterYears(data.data.filters.years);
      }
    } else {
      throw new Error(data.message || "Invalid API response");
    }
  } catch (error) {
    console.error("Error loading exams:", error);

    // Show error message
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>
          Erreur de chargement des examens.
          <br><small>${error.message}</small>
        </div>
      </div>
    `;

    badge.textContent = "0";
  }
}

// Function to update filter component with real years
function updateFilterYears(realYears) {
  // Dispatch event to filter component with real years
  const event = new CustomEvent("updateYearFilters", {
    detail: { years: realYears },
  });
  document.dispatchEvent(event);
}

// Function to display exams
function displayExams(exams) {
  const container = document.getElementById("exams-container");

  if (!exams || exams.length === 0) {
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

    // Format description (fallback if empty)
    const description =
      exam.description && exam.description.trim() !== ""
        ? exam.description
        : "Examen de français pour la 1ère Année Bac.";

    // Create download buttons based on available files
    const examButton = exam.exam_pdf_path
      ? `<a href="${exam.exam_pdf_path}" class="btn-download btn-download-exam" target="_blank">
           <i class="fas fa-file-pdf me-2"></i>Télécharger le sujet
         </a>`
      : '<span class="text-muted p-3 d-inline-block">Sujet non disponible</span>';

    const correctionLangueButton = exam.correction_langue_path
      ? `<a href="${exam.correction_langue_path}" class="btn-download btn-download-correction-langue" target="_blank">
           <i class="fas fa-language me-2"></i>Correction Langue
         </a>`
      : '<span class="text-muted p-3 d-inline-block">Correction Langue non disponible</span>';

    const correctionProductionButton = exam.correction_production_path
      ? `<a href="${exam.correction_production_path}" class="btn-download btn-download-correction-production" target="_blank">
           <i class="fas fa-edit me-2"></i>Correction Production
         </a>`
      : '<span class="text-muted p-3 d-inline-block">Correction Production non disponible</span>';

    // Format date
    const createdDate = exam.created_at
      ? new Date(exam.created_at).toLocaleDateString("fr-FR")
      : "Date inconnue";

    col.innerHTML = `
            <div class="exam-card">
                <div class="exam-header">
                    <h4 class="exam-title">${
                      exam.title || "Examen sans titre"
                    }</h4>
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
                    <p class="exam-description">${description}</p>
                    <div class="exam-actions">
                        <div class="download-group">
                            ${examButton}
                        </div>
                        <div class="corrections-group mt-2">
                            <div class="d-flex flex-wrap gap-2">
                                ${correctionLangueButton}
                                ${correctionProductionButton}
                            </div>
                        </div>
                    </div>
                    <div class="mt-3 text-end">
                        <small class="text-muted">
                            <i class="far fa-clock me-1"></i>
                            Ajouté le ${createdDate}
                        </small>
                    </div>
                </div>
            </div>
        `;
    container.appendChild(col);
  });
}
