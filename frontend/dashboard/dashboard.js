/**
 * dashboard.js - Dashboard component JavaScript
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Dashboard component loaded");

  // Load dashboard stats (simulated for now - backend will handle real data)
  loadDashboardStats();

  // Add active class to current nav link
  highlightCurrentPage();

  // Add click handlers for sidebar navigation
  setupSidebarNavigation();
});

// Function to load dashboard stats
function loadDashboardStats() {
  // For now, simulate loading with placeholder data
  // Backend will provide real data later

  setTimeout(() => {
    // Simulate API response
    const stats = {
      troncCommun: 12, // Example data
      bac: 8, // Example data
      exams: 6, // Example data
    };

    // Update DOM with stats
    document.getElementById("tronc-commun-count").textContent =
      stats.troncCommun;
    document.getElementById("bac-count").textContent = stats.bac;
    document.getElementById("exams-count").textContent = stats.exams;

    console.log("Dashboard stats loaded:", stats);
  }, 500);
}

// Function to highlight current page in sidebar
function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
}

// Function to setup sidebar navigation
function setupSidebarNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // If it's a logout link, handle differently
      if (this.classList.contains("text-danger")) {
        if (!confirm("Êtes-vous sûr de vouloir vous déconnecter?")) {
          e.preventDefault();
        }
      }

      // Remove active class from all links
      navLinks.forEach((l) => l.classList.remove("active"));

      // Add active class to clicked link
      this.classList.add("active");

      console.log("Navigating to:", this.getAttribute("href"));
    });
  });
}

// Function to update welcome message (will be used when auth is implemented)
function updateWelcomeMessage(username) {
  const welcomeElement = document.querySelector(".sidebar-header .text-muted");
  if (welcomeElement && username) {
    welcomeElement.textContent = `Bienvenue, ${username}`;
  }
}
