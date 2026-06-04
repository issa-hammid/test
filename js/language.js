/**
 * language.js
 * Handles language switching (EN/AR), RTL direction, and localStorage.
 */

// 1. RUN IMMEDIATELY: Check storage and set language before the page renders
(function applyLanguageOnLoad() {
  const savedLang = localStorage.getItem("atm-lang") || "en";
  document.documentElement.setAttribute("lang", savedLang);
  document.documentElement.setAttribute("dir", savedLang === "ar" ? "rtl" : "ltr");
})();

// 2. RUN AFTER DOM LOADS: Attach the click listener to the header button
document.addEventListener("DOMContentLoaded", () => {
  const langToggleBtn = document.getElementById("lang-toggle");
  if (!langToggleBtn) return;

  // Initialize button text (If English, show 'AR' button. If Arabic, show 'EN' button)
  const initialLang = document.documentElement.getAttribute("lang");
  langToggleBtn.textContent = initialLang === "en" ? "AR" : "EN";

  // Handle the click event
  langToggleBtn.addEventListener("click", () => {
    const currentLang = document.documentElement.getAttribute("lang");
    const newLang = currentLang === "en" ? "ar" : "en";
    
    // Save to local storage
    localStorage.setItem("atm-lang", newLang);
    
    // Update HTML attributes (This instantly flips the layout if using Tailwind RTL)
    document.documentElement.setAttribute("lang", newLang);
    document.documentElement.setAttribute("dir", newLang === "ar" ? "rtl" : "ltr");
    
    // Update button text
    langToggleBtn.textContent = newLang === "en" ? "AR" : "EN";

    // Optional: If you are using a translation framework or simple text replacement, 
    // you would trigger your text-swapping function right here.
    // Example: translatePage(newLang);
  });
});