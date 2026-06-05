// /**
//  * theme.js
//  * Handles dark/light mode persistence across pages.
//  */

// (function () {
//   "use strict";

//   // 1. Grab the checkbox and the saved theme immediately
//   const themeToggle = document.getElementById("theme-toggle");
//   const savedTheme = localStorage.getItem("atm-theme");

//   // 2. Instantly check the box if the user prefers dark mode (prevents white flash)
//   if (themeToggle && savedTheme === "dark") {
//     themeToggle.checked = true;
//   }

//   // 3. Wait for the rest of the page to load, then listen for clicks
//   document.addEventListener("DOMContentLoaded", () => {
//     if (themeToggle) {
//       themeToggle.addEventListener("change", (e) => {
//         // Save the new choice to localStorage
//         if (e.target.checked) {
//           localStorage.setItem("atm-theme", "dark");
//         } else {
//           localStorage.setItem("atm-theme", "light");
//         }
//       });
//     }
//   });
//  const currentPath = window.location.pathname;
//   console.log("Current Path:", currentPath);
  
//   const navLinks = document.querySelectorAll('.nav-link');

//   navLinks.forEach(link => {
//     const linkPath = link.getAttribute('href');
//     let pathName = linkPath.replace(/\//g, '').replace(/\./g, '');
//     if (pathName === "") pathName = "index"; 

//     if ((currentPath === "/" || currentPath.endsWith("/index.html") || currentPath === "/file/") && pathName === "index") {
//       link.classList.add('active');
//     } 
//     else if (pathName !== "index" && currentPath.includes(pathName)) {
//       link.classList.add('active');
//     }
//   });
  
// })();

// (function () {
//   "use strict";

//   const themeToggle = document.getElementById("theme-toggle");
//   const logo = document.querySelector('.site-logo');

//   function applyTheme(theme) {
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//       if (themeToggle) themeToggle.checked = true;
//       if (logo) logo.src = "../images/Layer_dark.png";
//     } else {
//       document.documentElement.classList.remove("dark");
//       if (themeToggle) themeToggle.checked = false;
//       if (logo) logo.src = "../images/Layer_2.svg";
//     }
//   }

//   const savedTheme = localStorage.getItem("atm-theme") || "dark";
//   applyTheme(savedTheme);

//   document.addEventListener("DOMContentLoaded", () => {
//     if (themeToggle) {
//       themeToggle.addEventListener("change", (e) => {
//         const isDark = e.target.checked;
//         const newTheme = isDark ? "dark" : "light";
        
//         localStorage.setItem("atm-theme", newTheme);
        
//         applyTheme(newTheme);
//       });
//     }

//     const currentPath = window.location.pathname;
//     const navLinks = document.querySelectorAll('.nav-link');
//     navLinks.forEach(link => {
//       const linkPath = link.getAttribute('href');
//       if (!linkPath) return;
//       let pathName = linkPath.replace(/\//g, '').replace(/\./g, '');
//       if (pathName === "") pathName = "index"; 
//       if ((currentPath === "/" || currentPath.endsWith("/index.html") || currentPath === "/file/") && pathName === "index") {
//         link.classList.add('active');
//       } else if (pathName !== "index" && currentPath.includes(pathName)) {
//         link.classList.add('active');
//       }
//     });
//   });
// })();

(function () {
  "use strict";

  const themeToggle = document.getElementById("theme-toggle");
  const logos = document.querySelectorAll(".site-logo");

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);

    if (themeToggle) {
      themeToggle.checked = isDark;
    }

    logos.forEach(logo => {
      logo.src = isDark ? logo.dataset.dark : logo.dataset.light;
    });
  }

  const savedTheme = localStorage.getItem("atm-theme");
  const defaultTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(defaultTheme);

  document.addEventListener("DOMContentLoaded", () => {
    if (themeToggle) {
      themeToggle.addEventListener("change", (e) => {
        const isDark = e.target.checked;
        const newTheme = isDark ? "dark" : "light";
        
        localStorage.setItem("atm-theme", newTheme);
        
        applyTheme(newTheme);
      });
    }

    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      if (!linkPath) return;
      let pathName = linkPath.replace(/\//g, '').replace(/\./g, '');
      if (pathName === "") pathName = "index"; 
      if ((currentPath === "/" || currentPath.endsWith("/index.html") || currentPath === "/file/") && pathName === "index") {
        link.classList.add('active');
      } else if (pathName !== "index" && currentPath.includes(pathName)) {
        link.classList.add('active');
      }
    });
  });
})();