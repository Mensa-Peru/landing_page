import SlideShow from "./slide_show.js";
import ThemeManager from "./theme_manager.js";
import NavigationManager from "./navigation_manager.js";

function loadPreloadedStyles() {
  document.querySelectorAll('link[rel="preload"][as="style"]').forEach(link => {
    link.rel = "stylesheet";
  });
}

window.addEventListener("load", () => {
  ThemeManager.init();
  loadPreloadedStyles();

  // Initialize slideshow
  document.querySelectorAll(".slider").forEach(elem => new SlideShow(elem));

  new NavigationManager();
});
