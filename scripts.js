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

// ── Glitch Hero Effect ────────────────────────────────
// Surveillance / data-corruption aesthetic for the hero section.
// Canvas-based: pre-baked noise frames + occasional glitch bands + rare artifact bursts.
// Fully self-contained — no dependencies, no external assets.
(function () {
  "use strict";

  // Bail if user prefers reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var heroSection = document.querySelector(".hero-section");
  if (!heroSection) return; // only runs on index.html

  // Create and append the canvas
  var canvas = document.createElement("canvas");
  canvas.className = "glitch-canvas";
  canvas.setAttribute("aria-hidden", "true");
  heroSection.appendChild(canvas);

  var ctx = canvas.getContext("2d");

  // ── State ─────────────────────────────────────────────
  var W = 0, H = 0;
  var noiseFrames = [];   // pre-baked offscreen canvases
  var activeFrame = 0;
  var animId = null;
  var resizeTimer = null;

  var lastRenderTime = 0;
  var lastNoiseAdvance = 0;
  var lastGlitchTime = 0;
  var nextGlitchIn  = 3500 + Math.random() * 5500; // 3.5–9s between bands
  var lastBurstTime = 0;
  var nextBurstIn   = 12000 + Math.random() * 10000; // 12–22s between bursts
  var burstUntil    = 0;   // timestamp when current burst ends

  // ── Constants ─────────────────────────────────────────
  var RENDER_MS   = 1000 / 30; // cap render loop at 30fps
  var NOISE_MS    = 1000 / 8;  // advance noise frame at 8fps
  var NUM_FRAMES  = 8;         // pre-baked noise frames to cycle
  var NOISE_SCALE = 4;         // render noise at ¼ size → pixelated upscale

  // ── Noise generation ──────────────────────────────────
  function generateNoiseFrames() {
    noiseFrames = [];
    var sw = Math.ceil(W / NOISE_SCALE);
    var sh = Math.ceil(H / NOISE_SCALE);

    for (var f = 0; f < NUM_FRAMES; f++) {
      var nc  = document.createElement("canvas");
      nc.width  = sw;
      nc.height = sh;
      var nc_ctx  = nc.getContext("2d");
      var imgData = nc_ctx.createImageData(sw, sh);
      var d = imgData.data;

      // Sparse green pixels — ~1.8% of low-res pixels
      var count = Math.floor(sw * sh * 0.018);
      for (var i = 0; i < count; i++) {
        var px  = Math.floor(Math.random() * sw);
        var py  = Math.floor(Math.random() * sh);
        var idx = (py * sw + px) * 4;
        d[idx]     = 0;                                    // R
        d[idx + 1] = 22 + Math.floor(Math.random() * 100); // G — dim to mid green
        d[idx + 2] = Math.floor(Math.random() * 9);        // B
        d[idx + 3] = 30 + Math.floor(Math.random() * 90);  // A — varied opacity
      }

      nc_ctx.putImageData(imgData, 0, 0);
      noiseFrames.push(nc);
    }
  }

  // ── Canvas resize ─────────────────────────────────────
  function resize() {
    W = heroSection.offsetWidth;
    H = heroSection.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
    generateNoiseFrames();
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 250);
  }

  // ── Draw current noise frame (upscaled, pixelated) ────
  function drawNoise() {
    if (!noiseFrames.length) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(noiseFrames[activeFrame], 0, 0, W, H);
  }

  // ── Draw glitch artifacts ─────────────────────────────
  // intensity: false = subtle background bands, true = burst mode
  function drawArtifacts(intense) {
    var count = intense
      ? 3 + Math.floor(Math.random() * 5)
      : 1 + Math.floor(Math.random() * 3);

    for (var i = 0; i < count; i++) {
      var y     = Math.floor(Math.random() * H * 0.80); // keep to upper 80%
      var alpha = (intense ? 0.055 : 0.025) + Math.random() * 0.065;
      var green = 45 + Math.floor(Math.random() * 135);
      var rb    = Math.floor(Math.random() * 11);

      ctx.fillStyle = "rgba(0," + green + "," + rb + "," + alpha + ")";

      if (Math.random() < 0.62) {
        // Horizontal band — full-width or partial
        var bw = Math.random() < 0.32
          ? Math.floor(W * (0.25 + Math.random() * 0.55))
          : W;
        var bx = bw < W ? Math.floor(Math.random() * (W - bw)) : 0;
        var bh = 1; // 1px — clean, surgical
        ctx.fillRect(bx, y, bw, bh);
      } else {
        // Pixel-cluster artifact
        var cx = Math.floor(Math.random() * W);
        var cw = 1 + Math.floor(Math.random() * (intense ? 12 : 5));
        var ch = 1 + Math.floor(Math.random() * 3);
        ctx.fillRect(cx, y, cw, ch);
      }
    }

    // Rare vertical fragment — like a column of corrupted data
    if (Math.random() < (intense ? 0.22 : 0.06)) {
      var vx = Math.floor(Math.random() * W);
      var vw = 1 + Math.floor(Math.random() * 2);
      var vh = 6 + Math.floor(Math.random() * 30);
      var vy = Math.floor(Math.random() * H * 0.65);
      ctx.fillStyle = "rgba(0," + (40 + Math.floor(Math.random() * 80)) + ",0,"
        + (0.035 + Math.random() * 0.065) + ")";
      ctx.fillRect(vx, vy, vw, vh);
    }
  }

  // ── Main render loop ──────────────────────────────────
  function render(ts) {
    animId = requestAnimationFrame(render);

    // Hard cap at 30fps
    if (ts - lastRenderTime < RENDER_MS) return;
    lastRenderTime = ts;

    ctx.clearRect(0, 0, W, H);

    // Advance noise frame at 8fps
    if (ts - lastNoiseAdvance > NOISE_MS) {
      activeFrame = (activeFrame + 1) % NUM_FRAMES;
      lastNoiseAdvance = ts;
    }

    drawNoise();

    // Background glitch bands — every 3.5–9s
    if (ts - lastGlitchTime > nextGlitchIn) {
      drawArtifacts(false);
      lastGlitchTime = ts;
      nextGlitchIn = 3500 + Math.random() * 5500;
    }

    // Artifact burst — every 12–22s; lasts 180–560ms
    if (ts - lastBurstTime > nextBurstIn) {
      burstUntil    = ts + 180 + Math.random() * 380;
      lastBurstTime = ts;
      nextBurstIn   = 12000 + Math.random() * 10000;
    }

    // During burst: draw intense artifacts on ~60% of frames
    if (ts < burstUntil && Math.random() < 0.60) {
      drawArtifacts(true);
    }
  }

  // ── Init ──────────────────────────────────────────────
  window.addEventListener("resize", onResize);
  resize();
  animId = requestAnimationFrame(render);
})();
