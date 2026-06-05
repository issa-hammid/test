/**
 * animations.js
 * External animation controller for TAKT Construction landing pages.
 * Handles: scroll-triggered reveals, counter animations, nav transparency,
 * draggable carousel, stagger effects, and dynamic element upgrades.
 */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");

  if (btn && menu) {
    // Initialize ARIA
    btn.setAttribute("aria-controls", "mobile-menu");
    btn.setAttribute("aria-expanded", String(!menu.classList.contains("hidden")));

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const isHidden = menu.classList.toggle("hidden");
      // aria-expanded should be true when menu is visible
      btn.setAttribute("aria-expanded", String(!isHidden));
    });

    // Close menu when a link inside it is clicked (good UX on mobile)
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (!menu.classList.contains("hidden")) {
          menu.classList.add("hidden");
          btn.setAttribute("aria-expanded", "false");
        }
      });
    });
  }
});
(function () {
  "use strict";

  /* ─────────────────────────────────────────────
   * 1. INTERSECTION OBSERVER — scroll reveals
   * ───────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target); 
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  function initReveal() {
    document
      .querySelectorAll(".animate-fade-up, .animate-fade-in, .animate-slide-left, .animate-slide-right")
      .forEach((el) => revealObserver.observe(el));
  }

  /* ─────────────────────────────────────────────
   * 2. ANIMATED COUNTERS
   * ───────────────────────────────────────────── */
  function animateCounter(el, target, suffix, duration = 1800) {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

 function initCounters() {
  const container = document.querySelector(".stats-counter");
  if (!container) return;

  const statItems = container.querySelectorAll(".stat-number");

  const data = [
    { target: 12, suffix: "+" },
    { target: 130, suffix: "+" },
    { target: 870, suffix: "+" },
  ];

  const counterObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        statItems.forEach((el, i) => {
          if (data[i]) animateCounter(el, data[i].target, data[i].suffix);
        });
        counterObserver.disconnect();
      }
    },
    { threshold: 0.5 }
  );

  counterObserver.observe(container);
}
  /* ─────────────────────────────────────────────
   * 3. NAVBAR — glass tint on scroll
   * ───────────────────────────────────────────── */
  function initNavScroll() {
    const nav = document.getElementById("main-nav");
    const themeToggle = document.getElementById("theme-toggle");
    if (!nav) return;

    window.lastScrollY = 0;

    function updateNavStyle() {
      const y = window.scrollY;
      const isDark = themeToggle && themeToggle.checked;

      if (y > 60) {
        nav.style.background = isDark ? "rgba(20, 20, 20, 0.95)" : "rgba(255, 255, 255, 0.9)";
        nav.style.boxShadow = isDark ? "0 8px 32px rgba(0,0,0,0.6)" : "0 8px 32px rgba(0,0,0,0.12)";
      } else {
        nav.style.background = "";
        nav.style.boxShadow = "";
      }
      
      if (y > window.lastScrollY + 8 && y > 200) {
        nav.closest("header").style.transform = "translateY(-110%)";
      } else if (y < window.lastScrollY - 8) {
        nav.closest("header").style.transform = "translateY(0)";
      }
      window.lastScrollY = y;
    }

    window.addEventListener("scroll", updateNavStyle);
    themeToggle?.addEventListener("change", updateNavStyle); 

    const header = nav.closest("header");
    if (header) {
      header.style.transition = "transform 0.4s cubic-bezier(0.4,0,0.2,1)";
    }
  }

  /* ─────────────────────────────────────────────
   * 4. DRAGGABLE PROJECT CAROUSEL
   * ───────────────────────────────────────────── */
  function initCarousel() {
    const track = document.querySelector(".flex.flex-nowrap.gap-6.overflow-x-auto");
    if (!track) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    track.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    track.addEventListener("mouseleave", () => (isDown = false));
    track.addEventListener("mouseup", () => (isDown = false));
    track.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.4;
      track.scrollLeft = scrollLeft - walk;
    });

    const scrollAmount = 420;
    document.querySelectorAll(".scroll-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      });
    });
    document.querySelectorAll(".scroll-btn + button").forEach((btn) => {
      btn.addEventListener("click", () => {
        track.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });
    });
  }

  /* ─────────────────────────────────────────────
   * 5. STAGGERED CARD ENTRANCE (SLOWED DOWN)
   * ───────────────────────────────────────────── */
  function initStaggerCards() {
    const grids = document.querySelectorAll(".grid");

    grids.forEach((grid) => {
      const cards = grid.querySelectorAll(".svc-card, .card, .stagger-item");
      if (!cards.length) return;

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              cards.forEach((card, i) => {
                // Increased delay from 150ms to 200ms for a more relaxed wave
                setTimeout(() => {
                  card.style.opacity = "1";
                  card.style.transform = "translateY(0) scale(1)";
                }, i * 200); 
              });
              obs.disconnect(); 
            }
          });
        },
        { threshold: 0.1 }
      );

      cards.forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(40px) scale(1)";
        // Slower 1.2s transition with a smooth deceleration curve
        card.style.transition = "all 1.2s cubic-bezier(0.25, 1, 0.5, 1)"; 
      });

      obs.observe(grid);
    });
  }

  /* ─────────────────────────────────────────────
   * 6. DOM UPGRADES (Premium Reveals)
   * ───────────────────────────────────────────── */
  function upgradePremiumElements() {
    const glass1 = document.querySelector('.story-glass-1');
    const glass2 = document.querySelector('.story-glass-2');
    
    if (glass1) {
      glass1.classList.remove('animate-fade-up');
      glass1.classList.add('animate-slide-left');
    }
    if (glass2) {
      glass2.classList.remove('animate-fade-up');
      glass2.classList.add('animate-slide-left');
    }

    const storyImgWrap = document.querySelector('img[src*="construction-worker"]')?.parentElement;
    if (storyImgWrap) {
      storyImgWrap.classList.remove('animate-fade-in');
      storyImgWrap.classList.add('animate-slide-right');
    }

    const missionCards = document.querySelectorAll('.mission-card');
    if (missionCards.length === 2) {
      missionCards[0].classList.remove('card');
      missionCards[1].classList.remove('card');
      missionCards[0].classList.add('animate-slide-left');
      missionCards[1].classList.add('animate-slide-right');
    }
  }

  /* ─────────────────────────────────────────────
   * 7. INTERACTIVE 3D TILT (SLOWED DOWN)
   * ───────────────────────────────────────────── */
  function initInteractiveTilt() {
    document.querySelectorAll(".badge-amber, .badge-glass, .mission-card, .white-card").forEach((el) => {
      // Increased from 0.4s to 0.8s so the hover feels luxuriously slow and soft
      el.style.transition = "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.8s ease";
      
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        
        const isCard = el.classList.contains('mission-card');
        const intensity = isCard ? 4 : 8; // Slightly reduced intensity so it doesn't bend too far
        
        const rx = ((e.clientY - rect.top) / rect.height - 0.5) * intensity;
        const ry = ((e.clientX - rect.left) / rect.width - 0.5) * -intensity;
        
        el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
        
        if(isCard) {
            el.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.15)";
            el.style.zIndex = "10";
        }
      });
      
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
        if(el.classList.contains('mission-card')) {
            el.style.boxShadow = "";
            el.style.zIndex = "";
        }
      });
    });
  }

  function initRipple() {
    document.querySelectorAll(".svc-card").forEach((card) => {
      card.style.position = "relative";
      card.style.overflow = "hidden";
      card.addEventListener("click", (e) => {
        const ripple = document.createElement("span");
        const size = Math.max(card.offsetWidth, card.offsetHeight);
        const rect = card.getBoundingClientRect();
        ripple.style.cssText = `
          position:absolute; border-radius:50%;
          width:${size}px;height:${size}px;
          left:${e.clientX - rect.left - size / 2}px;
          top:${e.clientY - rect.top - size / 2}px;
          background:rgba(248,191,44,0.25);
          transform:scale(0); animation:ripple-anim 0.55s ease-out forwards; pointer-events:none;
        `;
        card.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const target = document.querySelector(a.getAttribute("href"));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  /* ─────────────────────────────────────────────
   * 8. CSS ADDITIONS
   * ───────────────────────────────────────────── */
  function injectBaseStyles() {
    if (document.getElementById("anim-base-styles")) return;
    const style = document.createElement("style");
    style.id = "anim-base-styles";
    style.textContent = `
      .animate-fade-up {
        opacity: 0;
        transform: translateY(40px);
        transition: opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1),
                    transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);
      }
      .animate-fade-up.is-visible { opacity: 1; transform: translateY(0); }

      .animate-slide-left {
        opacity: 0;
        transform: translateX(-60px);
        transition: opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1),
                    transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);
      }
      .animate-slide-left.is-visible { opacity: 1; transform: translateX(0); }

      .animate-slide-right {
        opacity: 0;
        transform: translateX(60px);
        transition: opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1),
                    transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);
      }
      .animate-slide-right.is-visible { opacity: 1; transform: translateX(0); }

      .animate-fade-in {
        opacity: 0;
        transition: opacity 1.5s ease;
      }
      .animate-fade-in.is-visible { opacity: 1; }

      .delay-100 { transition-delay: 0.1s; }
      .delay-200 { transition-delay: 0.2s; }
      .delay-300 { transition-delay: 0.3s; }
      .delay-400 { transition-delay: 0.4s; }

      @keyframes float { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-12px);} }
      .animate-float { animation: float 4s ease-in-out infinite; }
      #main-nav { transition: background 0.35s ease, box-shadow 0.35s ease; }
      header.opacity-0 { opacity: 0; animation: fadeHeader 0.6s 0.1s ease forwards; }
      @keyframes fadeHeader { to { opacity: 1; } }
      @keyframes ripple-anim { to { transform: scale(2.5); opacity: 0; } }
    `;
    document.head.appendChild(style);
  }
function initBlurCardAnimation() {
  const card = document.querySelector(".animate-fade-blur-card");

  if (!card) return;

  card.style.opacity = "0"; // prevent flash

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        card.classList.add("is-visible");
        observer.disconnect();
      }
    },
    { threshold: 0.4 }
  );

  observer.observe(card);
}

  /* ─────────────────────────────────────────────
   * BOOT
   * ───────────────────────────────────────────── */
  function boot() {
    injectBaseStyles();
    upgradePremiumElements(); 
    
    requestAnimationFrame(() => {
      initReveal();
      initCounters();
      initNavScroll();
      initCarousel();
      initStaggerCards();
      initInteractiveTilt();
      initRipple();
      initSmoothScroll();
      initBlurCardAnimation();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  
})();