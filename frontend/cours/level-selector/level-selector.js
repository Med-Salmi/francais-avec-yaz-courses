// level-selector Component JavaScript
document.addEventListener("DOMContentLoaded", function () {
  const levelButtons = document.querySelectorAll(".level-btn");

  levelButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      levelButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Get the selected level
      const selectedLevel = this.getAttribute("data-level");

      // You can dispatch an event or call a function to update other components
      console.log("Selected level:", selectedLevel);

      // Example: Dispatch a custom event that other components can listen to
      const event = new CustomEvent("levelChanged", {
        detail: { level: selectedLevel },
      });
      document.dispatchEvent(event);
    });
  });
});
