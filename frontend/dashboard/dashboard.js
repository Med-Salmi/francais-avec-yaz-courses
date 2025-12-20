/**
 * dashboard.js - Dashboard component JavaScript with real data
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Dashboard component loaded");

  // Check authentication first
  checkAuthAndLoadStats();

  // Add active class to current nav link
  highlightCurrentPage();

  // Add click handlers for sidebar navigation
  setupSidebarNavigation();
});

// Function to check authentication and load stats
async function checkAuthAndLoadStats() {
  try {
    // First check if user is authenticated
    const authResponse = await fetch("/backend/api/auth/check.php", {
      credentials: "include",
    });

    if (authResponse.ok) {
      // User is authenticated, load stats
      loadDashboardStats();
    } else {
      // Not authenticated, redirect to login
      window.location.href = "/?page=login";
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    window.location.href = "/?page=login";
  }
}

// Function to load dashboard stats from REAL API
async function loadDashboardStats() {
  // Show loading state
  document.getElementById("tronc-commun-count").textContent = "...";
  document.getElementById("bac-count").textContent = "...";
  document.getElementById("exams-count").textContent = "...";

  try {
    // Call REAL API
    const response = await fetch("/backend/api/dashboard/stats.php", {
      credentials: "include", // Important for sessions
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data && data.data.stats) {
      // Update DOM with REAL stats
      document.getElementById("tronc-commun-count").textContent =
        data.data.stats.tronc_commun;
      document.getElementById("bac-count").textContent = data.data.stats.bac;
      document.getElementById("exams-count").textContent =
        data.data.stats.exams;

      console.log("Dashboard stats loaded:", data.data.stats);
    } else {
      throw new Error(data.message || "Invalid API response");
    }
  } catch (error) {
    console.error("Error loading dashboard stats:", error);

    // Show error in stats
    document.getElementById("tronc-commun-count").textContent = "Erreur";
    document.getElementById("bac-count").textContent = "Erreur";
    document.getElementById("exams-count").textContent = "Erreur";

    // Show error message
    alert("Impossible de charger les statistiques. Veuillez réessayer.");
  }
}

// Function to highlight current page in sidebar
function highlightCurrentPage() {
  const navLinks = document.querySelectorAll(".nav-link");

  // Remove active class from all
  navLinks.forEach((link) => link.classList.remove("active"));

  // Check current page
  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = urlParams.get("page") || "dashboard";

  // Find and activate the correct link
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.includes(`page=${currentPage}`)) {
      link.classList.add("active");
    }
  });

  // If no match found, activate dashboard by default
  if (currentPage === "dashboard") {
    const dashboardLink = document.querySelector('a[href="/?page=dashboard"]');
    if (dashboardLink) {
      dashboardLink.classList.add("active");
    }
  }
}

// Function to setup sidebar navigation
function setupSidebarNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // If it's a logout link, handle differently
      if (this.classList.contains("text-danger")) {
        e.preventDefault();
        logout();
        return false;
      }

      // For other links, let them navigate normally
      console.log("Navigating to:", this.getAttribute("href"));
    });
  });
}

// Function to handle logout
async function logout() {
  if (!confirm("Êtes-vous sûr de vouloir vous déconnecter?")) {
    return;
  }

  try {
    const response = await fetch("/backend/api/auth/logout.php", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      window.location.href = "/?page=login";
    } else {
      alert("Erreur lors de la déconnexion. Veuillez réessayer.");
    }
  } catch (error) {
    console.error("Logout error:", error);
    alert("Erreur de connexion. Veuillez réessayer.");
  }
}

// Function to update welcome message (will be used when auth is implemented)
function updateWelcomeMessage(username) {
  const welcomeElement = document.querySelector(".sidebar-header .text-muted");
  if (welcomeElement && username) {
    welcomeElement.textContent = `Bienvenue, ${username}`;
  }
}
