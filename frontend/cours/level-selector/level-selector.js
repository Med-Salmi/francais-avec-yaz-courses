// Global variable to track current level
let currentLevel = "tronc-commun"; // Default value

document.addEventListener("DOMContentLoaded", function () {
  const levelButtons = document.querySelectorAll(".level-btn");

  // Set initial active state
  const initialActiveButton = document.querySelector(".level-btn.active");
  if (initialActiveButton) {
    currentLevel = initialActiveButton.getAttribute("data-level");
  }

  levelButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      levelButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Update the global currentLevel
      currentLevel = this.getAttribute("data-level");

      console.log("Selected level:", currentLevel);

      // Dispatch event with the new level
      const event = new CustomEvent("levelChanged", {
        detail: { level: currentLevel },
      });
      document.dispatchEvent(event);
    });
  });
});

// Make currentLevel accessible globally
window.getCurrentLevel = function () {
  return currentLevel;
};
