document.addEventListener("DOMContentLoaded", function () {
  const profileContainer = document.getElementById("profile-animation");

  if (!profileContainer) return;

  // Create Intersection Observer for scroll detection
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add animated class when element is in viewport
          profileContainer.classList.add("animated");

          // Optional: Remove observer after animation triggers
          observer.unobserve(entry.target);

          console.log("Profile animation triggered!");
        }
      });
    },
    {
      threshold: 0.5, // Trigger when 50% of element is visible
      rootMargin: "0px 0px -100px 0px", // Trigger slightly before center
    }
  );

  // Start observing the profile container
  observer.observe(profileContainer);

  // Optional: Add click to manually trigger animation
  profileContainer.addEventListener("click", function () {
    this.classList.toggle("animated");
  });

  // Optional: Reset animation when scrolling back up
  window.addEventListener("scroll", function () {
    const rect = profileContainer.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;

    if (!isInViewport && profileContainer.classList.contains("animated")) {
      // Reset animation when scrolled out of view
      profileContainer.classList.remove("animated");
      observer.observe(profileContainer); // Re-observe
    }
  });
});
