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
  const hamburger = document.getElementById("hamburger-btn");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links li a");

  hamburger.addEventListener("click", function () {
    const isExpanded = navLinks.classList.contains("active");
    navLinks.classList.toggle("active");
    this.classList.toggle("active");
    this.setAttribute("aria-expanded", String(!isExpanded));
    this.innerHTML = this.innerHTML === "☰" ? "✖" : "☰";
  });

  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.innerHTML = "☰";
    });
  });

  // Close menu on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.innerHTML = "☰";
      hamburger.focus();
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // The rotating "N" in the hero heading — keyboard + ARIA
  const letterN = document.querySelector(".rotate");
  if (letterN) {
    letterN.setAttribute("role", "button");
    letterN.setAttribute("tabindex", "0");
    letterN.setAttribute("aria-pressed", "false");
    letterN.setAttribute("aria-label", "Animate letter N");

    function toggleRotate() {
      const isActive = letterN.classList.toggle("active");
      letterN.setAttribute("aria-pressed", String(isActive));
    }

    letterN.addEventListener("click", toggleRotate);
    letterN.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleRotate();
      }
    });
  }
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
  lbImg.alt = "";

  const closeBtn = document.createElement("button");
  closeBtn.id = "lb-close";
  closeBtn.setAttribute("aria-label", "Close image preview");
  closeBtn.textContent = "✕";

  overlay.appendChild(lbImg);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  let clearSrcTimer;
  let triggerElement = null; // element that opened the lightbox

  function openLightbox(src, alt, trigger) {
    clearTimeout(clearSrcTimer);
    triggerElement = trigger || document.activeElement;
    lbImg.src = src;
    lbImg.alt = alt || "";
    overlay.setAttribute("aria-label", alt ? "Image preview: " + alt : "Image preview");
    overlay.classList.add("lb-open");
    document.body.style.overflow = "hidden";
    // Move focus to close button
    closeBtn.focus();
  }

  function closeLightbox() {
    overlay.classList.remove("lb-open");
    document.body.style.overflow = "";
    clearSrcTimer = setTimeout(function () {
      lbImg.src = "";
    }, 200);
    // Restore focus to the element that opened the lightbox
    if (triggerElement && typeof triggerElement.focus === "function") {
      triggerElement.focus();
    }
    triggerElement = null;
  }

  // Trap focus inside lightbox when open — only close button is focusable
  overlay.addEventListener("keydown", function (e) {
    if (!overlay.classList.contains("lb-open")) return;
    if (e.key === "Tab") {
      e.preventDefault();
      closeBtn.focus();
    }
    if (e.key === "Escape") {
      closeLightbox();
    }
  });

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeLightbox();
  });

  closeBtn.addEventListener("click", closeLightbox);

  // Make lightbox-eligible images keyboard accessible
  function isEligible(img) {
    if (img.classList.contains("index-img")) return false;
    if (img.classList.contains("about-image")) return false;
    if (img.closest("nav")) return false;
    if (img.id === "lb-img") return false;
    return true;
  }

  document.querySelectorAll("img").forEach(function (img) {
    if (!isEligible(img)) return;
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    if (!img.getAttribute("aria-label")) {
      img.setAttribute("aria-label", img.alt ? "Open image: " + img.alt : "Open image");
    }
    img.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(img.src, img.alt, img);
      }
    });
  });

  // Intercept image clicks in capture phase — fires before inline onclick handlers
  document.addEventListener(
    "click",
    function (e) {
      const img = e.target;
      if (img.tagName !== "IMG") return;
      if (!isEligible(img)) return;
      e.stopPropagation();
      openLightbox(img.src, img.alt, img);
    },
    true
  );

  // Make onclick divs (e.g. bkk circle-images) keyboard accessible
  document.querySelectorAll('[role="link"][tabindex]').forEach(function (el) {
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter") el.click();
    });
  });
});
