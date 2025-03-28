// Initialize AOS (Animations on Scroll)
AOS.init({
  easing: "ease-in-out-sine",
  once: true, // ensures the animation happens only once when scrolling
});

// Smooth scroll and transform circle on click
document.getElementById("pulse-circle").addEventListener("click", function () {
  // Change the background color of the projects section immediately
  const projectsSection = document.getElementById("projects");
  projectsSection.style.transition = "background-color 2s ease"; // Smooth background color transition
  projectsSection.style.backgroundColor = "white"; // Change to white
  projectsSection.style.color = "#000"; // Change text color to black for contrast
  const titleChange = document.getElementById("projects-name");
  titleChange.style.color = "#000";
  const ellipse = document.getElementById("ellipse");
  ellipse.style.backgroundColor = "white";

  // Enlarge the pulsing circle by scaling it up
  this.style.transition = "transform 1s ease"; // Smooth scale-up transition
  this.style.transform = "scale(10)"; // Enlarge the circle significantly

  // Scroll to the Projects section after the transition starts
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
    this.style.animation = "grow 2s infinite ease-in-out"; // Restart the pulse animation
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
