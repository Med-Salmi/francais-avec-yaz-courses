/**
 * Filters Component JavaScript
 */

// Global variables
let currentYear = null;
const sampleYears = [2025, 2024, 2023, 2022, 2021];

document.addEventListener("DOMContentLoaded", function () {
  // Initialize
  loadYearFilters(sampleYears);

  // Clear filters button
  document
    .getElementById("clear-filters")
    .addEventListener("click", function () {
      clearYearFilter();
    });
});

// Function to load year filters
function loadYearFilters(years) {
  const container = document.getElementById("year-filters");

  if (years.length === 0) {
    container.innerHTML =
      '<span class="text-muted">Aucune donnée disponible</span>';
    return;
  }

  let html = '<div class="d-flex flex-wrap">';

  // "All years" button
  html += `<button class="btn filter-btn ${
    !currentYear ? "active" : ""
  }" onclick="setYearFilter(null)">
        <i class="fas fa-calendar-alt me-2"></i>Toutes les années
    </button>`;

  // Year buttons
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
  updateResultsCount(years.length);
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
    const btnYear = btn.textContent.match(/\d{4}/); // Extract year from button text
    if (
      (year === null && btn.textContent.includes("Toutes")) ||
      (btnYear && parseInt(btnYear[0]) === year)
    ) {
      btn.classList.add("active");
    }
  });

  // Update results count
  const totalExams = 12; // Sample total
  updateResultsCount(totalExams);

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
function updateResultsCount(count) {
  const resultsElement = document.getElementById("results-count");
  let message = `${count} examen${count !== 1 ? "s" : ""} disponible${
    count !== 1 ? "s" : ""
  }`;

  if (currentYear) {
    message += ` pour ${currentYear}`;
  }

  resultsElement.textContent = message;
}
