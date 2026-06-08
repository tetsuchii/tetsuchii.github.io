const circle = document.getElementById("circle");

// Initialize AOS (Animations on Scroll)
AOS.init({
  easing: "ease-in-out-sine",
  once: true, // ensures the animation happens only once when scrolling
});

if (circle) {
  // Smooth scroll and transform circle on click
  document.getElementById("circle").addEventListener("click", function () {
    // Change the background color of the projects section immediately
    // Scroll to the Projects section after the transition starts
    document.getElementById("projects").removeAttribute("data-aos");

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
      this.style.animation =
        "blobMotion 2s infinite ease-in-out alternate, blobShape 3s infinite ease-in-out alternate"; // Restart the pulse animation
    }, 1500); // Delay before the circle returns to normal size
  });
}

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

// ── Lightbox ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  // Build overlay DOM
  const overlay = document.createElement("div");
  overlay.id = "lb-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Image preview");

  const lbImg = document.createElement("img");
  lbImg.id = "lb-img";

  const closeBtn = document.createElement("button");
  closeBtn.id = "lb-close";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.textContent = "✕";

  overlay.appendChild(lbImg);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  let clearSrcTimer;

  function openLightbox(src, alt) {
    clearTimeout(clearSrcTimer);
    lbImg.src = src;
    lbImg.alt = alt || "";
    overlay.classList.add("lb-open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    overlay.classList.remove("lb-open");
    document.body.style.overflow = "";
    // Clear src after fade-out to free memory without a visible flash
    clearSrcTimer = setTimeout(function () {
      lbImg.src = "";
    }, 200);
  }

  // Close when clicking the backdrop (not the image itself)
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeLightbox();
  });

  closeBtn.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("lb-open")) {
      closeLightbox();
    }
  });

  // Intercept image clicks in the capture phase so this runs before any
  // inline onclick="window.location.href=..." handlers on the element.
  // Calling stopPropagation() here prevents those handlers from firing.
  document.addEventListener(
    "click",
    function (e) {
      const img = e.target;
      if (img.tagName !== "IMG") return;

      // Exclusions: home-page card thumbnails and the profile photo
      if (img.classList.contains("index-img")) return;
      if (img.classList.contains("about-image")) return;

      // Skip anything inside the nav
      if (img.closest("nav")) return;

      e.stopPropagation();
      openLightbox(img.src, img.alt);
    },
    true // capture phase
  );
});
