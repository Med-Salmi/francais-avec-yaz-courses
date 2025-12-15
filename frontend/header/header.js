// Header Component JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenuClose = document.getElementById("mobileMenuClose");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  const desktopNavLinks = document.querySelectorAll(".nav-link");

  // Open mobile menu
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      openMobileMenu();
    });
  }

  // Close mobile menu
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", function () {
      closeMobileMenu();
    });
  }

  // Close menu when clicking overlay
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener("click", function () {
      closeMobileMenu();
    });
  }

  // Close menu when clicking a mobile link
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", function () {
      closeMobileMenu();
      updateActiveMobileLink(this);
    });
  });

  // Update desktop active link on click
  desktopNavLinks.forEach((link) => {
    link.addEventListener("click", function () {
      updateActiveDesktopLink(this);
    });
  });

  // Close menu with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
      closeMobileMenu();
    }
  });

  // Functions
  function openMobileMenu() {
    mobileMenu.classList.add("active");
    mobileMenuOverlay.classList.add("active");
    document.body.classList.add("menu-open");
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove("active");
    mobileMenuOverlay.classList.remove("active");
    document.body.classList.remove("menu-open");
  }

  function updateActiveMobileLink(clickedLink) {
    mobileNavLinks.forEach((link) => link.classList.remove("active"));
    clickedLink.classList.add("active");
  }

  function updateActiveDesktopLink(clickedLink) {
    desktopNavLinks.forEach((link) => link.classList.remove("active"));
    clickedLink.classList.add("active");
  }

  // Initialize active links based on current page
  function initializeActiveLinks() {
    const currentPage = window.location.pathname.split("/").pop();

    // Update desktop links
    desktopNavLinks.forEach((link) => {
      link.classList.remove("active");
      const linkHref = link.getAttribute("href");
      if (
        linkHref === currentPage ||
        (currentPage === "" && linkHref === "index.php") ||
        (currentPage === "index.php" && linkHref === "index.php")
      ) {
        link.classList.add("active");
      }
    });

    // Update mobile links
    mobileNavLinks.forEach((link) => {
      link.classList.remove("active");
      const linkHref = link.getAttribute("href");
      if (
        linkHref === currentPage ||
        (currentPage === "" && linkHref === "index.php") ||
        (currentPage === "index.php" && linkHref === "index.php")
      ) {
        link.classList.add("active");
      }
    });
  }
});
