// Global variables
let currentYear = null;
let availableYears = []; // Will be populated from API

document.addEventListener("DOMContentLoaded", function () {
  // Listen for years update from exams grid
  document.addEventListener("updateYearFilters", function (e) {
    console.log("Updating year filters with:", e.detail.years);
    availableYears = e.detail.years;
    loadYearFilters(availableYears);
  });

  // Clear filters button
  document
    .getElementById("clear-filters")
    .addEventListener("click", function () {
      clearYearFilter();
    });

  // Initialize with empty array (will be updated after API call)
  loadYearFilters([]);
});

// Function to load year filters
function loadYearFilters(years) {
  const container = document.getElementById("year-filters");

  if (!years || years.length === 0) {
    container.innerHTML =
      '<span class="text-muted">Chargement des années...</span>';
    return;
  }

  let html = '<div class="d-flex flex-wrap">';

  // "All years" button
  html += `<button class="btn filter-btn ${
    !currentYear ? "active" : ""
  }" onclick="setYearFilter(null)">
        <i class="fas fa-calendar-alt me-2"></i>Toutes les années
    </button>`;

  // Year buttons (sorted descending)
  years.sort((a, b) => b - a); // Most recent first
  years.forEach((year) => {
    html += `<button class="btn filter-btn ${
      currentYear === year ? "active" : ""
    }" onclick="setYearFilter(${year})">
            <i class="fas fa-calendar me-2"></i>${year}
        </button>`;
  });

  html += "</div>";
  container.innerHTML = html;

  // Update results count
  updateResultsCount();
}

// Function to set year filter
function setYearFilter(year) {
  currentYear = year;

  // Update active button
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Find and activate the clicked button
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    if (year === null && btn.textContent.includes("Toutes")) {
      btn.classList.add("active");
    } else if (year !== null) {
      const btnYear = btn.textContent.match(/\d{4}/); // Extract year from button text
      if (btnYear && parseInt(btnYear[0]) === year) {
        btn.classList.add("active");
      }
    }
  });

  // Update results count
  updateResultsCount();

  console.log("Year filter set to:", year);

  // Dispatch event to notify exams grid
  const event = new CustomEvent("yearFilterChanged", {
    detail: { year: year },
  });
  document.dispatchEvent(event);
}

// Function to clear year filter
function clearYearFilter() {
  setYearFilter(null);
}

// Function to update results count
function updateResultsCount() {
  const resultsElement = document.getElementById("results-count");

  if (availableYears.length === 0) {
    resultsElement.textContent = "Chargement des données...";
    return;
  }

  let message = "";

  if (currentYear) {
    message = `Examens de ${currentYear}`;
  } else {
    const yearRange =
      availableYears.length > 0
        ? `${Math.min(...availableYears)}-${Math.max(...availableYears)}`
        : "N/A";
    message = `Examens disponibles (${yearRange})`;
  }

  resultsElement.textContent = message;
}
