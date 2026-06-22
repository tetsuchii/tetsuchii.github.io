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

// ── Topographic Ripple Hero ───────────────────────────
// Organic contour lines radiate from the blob as a source,
// deformed by superimposed sine-wave noise. No external libs.
(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var hero = document.querySelector(".hero-section");
  if (!hero) return;

  // ── Canvas setup ─────────────────────────────────────
  var canvas = document.createElement("canvas");
  canvas.className = "topo-canvas";
  canvas.setAttribute("aria-hidden", "true");
  hero.appendChild(canvas);
  var ctx = canvas.getContext("2d");

  // ── State ─────────────────────────────────────────────
  var W, H;
  var baseCX, baseCY; // resting center of the blob, updated at resize
  var cx, cy;         // actual center each frame, with float applied
  var t = 0;
  var lastFrame = 0;
  var resizeTimer;
  var animId;

  var FRAME_MS = 1000 / 24; // 24 fps cap — motion is very slow
  var NUM_RINGS = 16;        // concentric contour levels
  var RING_PTS  = 160;       // path points per ring (smooth curves)

  // blobMotion period is 2 s (alternate infinite).
  // t increments 0.006 / frame × 24 fps = 0.144 t-units / second.
  // 2 s = 0.288 t-units → angular frequency 2π / 0.288 ≈ 21.8 rad per t-unit.
  var BLOB_FREQ = 21.8;
  var FLOAT_AMP = 16; // px — how far the ring centre travels up/down

  // ── Locate blob resting center relative to hero ──────
  function findCenter() {
    var blob = document.getElementById("circle");
    if (blob) {
      var hr = hero.getBoundingClientRect();
      var br = blob.getBoundingClientRect();
      baseCX = br.left + br.width  * 0.5 - hr.left;
      baseCY = br.top  + br.height * 0.5 - hr.top;
    } else {
      baseCX = W * 0.5;
      baseCY = H * 0.63;
    }
  }

  // ── Resize handler ───────────────────────────────────
  function resize() {
    W = hero.offsetWidth;
    H = hero.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
    findCenter();
  }

  // ── Noise field ──────────────────────────────────────
  // Superimposed sine waves approximate organic 2-D noise.
  // Different frequencies at each ring → no two rings look alike.
  // Time parameter t makes the field slowly drift.
  function noise(angle, radius, time) {
    var a = angle;
    var r = radius * 0.0025; // normalise so larger radii aren't over-deformed
    return (
      Math.sin(a * 2.0 + r * 1.4 + time * 0.13) * 0.32 +
      Math.sin(a * 3.3 - r * 2.0 + time * 0.08) * 0.23 +
      Math.sin(a * 1.1 + r * 3.3 - time * 0.10) * 0.19 +
      Math.sin(a * 4.8 + r * 0.9 + time * 0.16) * 0.14 +
      Math.sin(a * 6.1 - r * 1.6 - time * 0.06) * 0.08 +
      Math.sin(a * 0.7 + r * 4.5 + time * 0.05) * 0.04
    );
    // Peaks at ±1.0, typical range ±0.45
  }

  // ── Draw all contours ────────────────────────────────
  function drawContours() {
    // Furthest ring just clears the most distant corner from cx/cy
    var maxR = Math.sqrt(
      Math.max(cx, W - cx) * Math.max(cx, W - cx) +
      Math.max(cy, H - cy) * Math.max(cy, H - cy)
    ) * 1.08;
    var minR = 22; // start just outside the blob (blob ≈ 44–66 px diameter)

    ctx.lineWidth = 1.0;

    for (var i = 0; i < NUM_RINGS; i++) {
      var p = i / (NUM_RINGS - 1); // 0 → 1

      // Non-linear spacing: rings are denser near the source,
      // spread out toward the edges — mirrors natural topography.
      var sp    = Math.pow(p, 0.68);
      var baseR = minR + sp * (maxR - minR);

      // Opacity falls with distance — innermost rings most visible.
      var fade  = Math.pow(1 - p, 1.6);
      if (fade < 0.006) continue;

      ctx.beginPath();

      for (var j = 0; j <= RING_PTS; j++) {
        var angle = (j / RING_PTS) * Math.PI * 2;

        // Noise-driven deformation: ±20 % of base radius
        var n = noise(angle, baseR, t);
        var r = baseR * (1 + n * 0.20);
        if (r < 1) r = 1;

        // Subtle elliptical bias (mirrors the morphing blob's rough aspect)
        var x = cx + Math.cos(angle) * r * 1.07;
        var y = cy + Math.sin(angle) * r * 0.94;

        if (j === 0) ctx.moveTo(x, y);
        else         ctx.lineTo(x, y);
      }

      ctx.closePath();

      // Palette: --border-ui #527a58 = rgb(82, 122, 88)
      var alpha = (fade * 0.55).toFixed(3);
      ctx.strokeStyle = "rgba(82,122,88," + alpha + ")";
      ctx.stroke();
    }
  }

  // ── Render loop ──────────────────────────────────────
  function render(ts) {
    animId = requestAnimationFrame(render);
    if (ts - lastFrame < FRAME_MS) return;
    lastFrame = ts;

    // Extremely slow drift — feels geological, not animated
    t += 0.006;

    // Float the ring centre with the same period as blobMotion (2 s).
    // A slight horizontal drift on a different frequency adds organic feel.
    cx = baseCX + 3  * Math.sin(BLOB_FREQ * t * 0.71);
    cy = baseCY + FLOAT_AMP * Math.sin(BLOB_FREQ * t);

    ctx.clearRect(0, 0, W, H);
    drawContours();
  }

  // ── Init ─────────────────────────────────────────────
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 250);
  });

  // Defer first paint slightly so the DOM has laid out
  // and getBoundingClientRect returns the correct blob position.
  setTimeout(function () {
    resize();
    animId = requestAnimationFrame(render);
  }, 80);
})();
