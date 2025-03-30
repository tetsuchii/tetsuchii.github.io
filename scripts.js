// Initialize AOS (Animations on Scroll)
AOS.init({
  easing: "ease-in-out-sine",
  once: true, // ensures the animation happens only once when scrolling
});

const projects = document.getElementById("projects");

// Smooth scroll and transform circle on click
document.getElementById("circle").addEventListener("click", function () {
  // Change the background color of the projects section immediately
  // Scroll to the Projects section after the transition starts
  projects.removeAttribute("data-aos");

  setTimeout(() => {
    document.getElementById("projects").scrollIntoView({
      behavior: "smooth",
    });
  }, 500); // Delay scrolling to let the circle scale up first

  // Reset animation after the circle has been scaled up
  setTimeout(() => {
    // Reset the pulsing circle's size and animation
    this.style.transition = "transform 0.5s ease"; // Ensure smooth transition back to normal
    this.style.transform = "scale(1)"; // Reset scale back to normal
    this.style.animation = "pulse 2s infinite ease-in-out"; // Restart the pulse animation
  }, 1500); // Delay before the circle returns to normal size
});

function equalizeCardHeights() {
  const cards = document.querySelectorAll(".project");
  let maxHeight = 0;

  // Reset heights before calculating
  cards.forEach((card) => {
    card.style.height = "auto"; // Reset height to auto for recalculation
  });

  // Find the tallest card
  cards.forEach((card) => {
    const cardHeight = card.offsetHeight;
    if (cardHeight > maxHeight) {
      maxHeight = cardHeight;
    }
  });

  // Set all cards to the same height as the tallest
  cards.forEach((card) => {
    card.style.height = maxHeight + "px";
  });
}

// Run function when page loads and on window resize
window.onload = equalizeCardHeights;
window.onresize = equalizeCardHeights;

document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger-btn"); // Using the same button
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links li a");

  // Toggle menu and change icon on hamburger click
  hamburger.addEventListener("click", function () {
    navLinks.classList.toggle("active");
    this.classList.toggle("active");

    // Toggle between ☰ (hamburger) and ✖ (X)
    this.innerHTML = this.innerHTML === "☰" ? "✖" : "☰";
  });

  // Close menu when a nav item is clicked
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");
      hamburger.innerHTML = "☰"; // Reset icon to hamburger
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const letterN = document.querySelector(".rotate");

  letterN.addEventListener("click", function () {
    letterN.classList.toggle("active");
  });
});
