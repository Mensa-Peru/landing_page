class SlideShow {
  timer = null;
  currentIndex = 0;
  currentSlide = null;

  constructor(slideSelectorOrElem) {
    if (typeof slideSelectorOrElem === 'string') {
      this.slideElem = document.querySelector(slideSelectorOrElem);
    } else {
      this.slideElem = slideSelectorOrElem;
    }

    this.slides = this.slideElem.querySelectorAll('.slides > *');
    this.totalSlides = this.slides.length;

    this.addControlListener();
    this.loop();
  }

  addControlListener() {
    const sliderNav = this.slideElem.querySelector('.navigation');

    sliderNav.addEventListener('click', (ev) => {
      const navButton = ev.target.closest('.next, .prev');

      if (!navButton) return;

      if (navButton.classList.contains('next')) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    });
  }

  nextSlide() {
    clearTimeout(this.timer);

    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;

    this.showSlide();
    this.loop();
  }

  prevSlide() {
    clearTimeout(this.timer);

    this.currentIndex = (this.currentIndex + this.totalSlides - 1) % this.totalSlides;

    this.showSlide();
    this.loop();
  }

  showSlide() {
    if (this.currentSlide) {
      this.currentSlide.classList.remove('active');
    }

    this.currentSlide = this.slides[this.currentIndex];

    this.currentSlide.classList.add('active');
  }

  // Automatic slideshow with 5-second interval
  loop() {
    this.timer = setTimeout(() => { this.nextSlide() }, 5000);
  }
}

class ThemeManager {
  #isDarkTheme;
  buttonSelector = '.dark-mode-toggle';

  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    this.mediaQuery.addEventListener('change', this.mqSchemeListener.bind(this));
    document.addEventListener('click', this.toggleDarkThemeListener.bind(this));
  }

  static init() {
    const manager = new ThemeManager();

    manager.updateColorScheme();
  }

  isDarkTheme() {
    if (this.#isDarkTheme === undefined) {
      const storedValue = localStorage.getItem('dark-theme');
      this.#isDarkTheme = storedValue ? storedValue === 'true' : this.mediaQuery.matches;
    }

    return this.#isDarkTheme;
  }

  setDarkTheme(value) {
    this.#isDarkTheme = value;
    localStorage.setItem('dark-theme', value);
  }

  toggleButtonIcon(selector, darkTheme) {
    const icons = document.querySelectorAll(`${this.buttonSelector} ${selector}`);

    icons.forEach(icon => icon.classList.toggle('active', darkTheme));
  }

  toggleDarkThemeListener(ev) {
    if (!ev.target.closest(this.buttonSelector)) return;

    ev.preventDefault();

    this.setDarkTheme(!this.isDarkTheme());
    this.updateColorScheme();
  }

  mqSchemeListener(ev) {
    this.setDarkTheme(ev.matches);
    this.updateColorScheme();
  }

  updateColorScheme() {
    const isDarkTheme = this.isDarkTheme();

    document.body.setAttribute('data-dark-theme', isDarkTheme);
    this.toggleButtonIcon('.fa-sun', !isDarkTheme);
    this.toggleButtonIcon('.fa-moon', isDarkTheme);
  }
}

class NavigationManager {
  animationDuration = 0;
  navigationBreakpoint = 1024;

  constructor() {
    this.setNavbarExpanded(false);
    this.loadCSSVariables();
    this.setupListeners();
  }

  setupListeners() {
    const navbar = document.querySelector('.navbar');
    navbar.addEventListener('click', (ev) => {
      const target = ev.target;
      if (target.closest('.toggle-button')) {
        this.toggleNavbar();
      } else if (target.closest('.overlay')) {
        this.toggleNavbar(false);
      } else if (target.closest('.nav-link')) {
        const targetLink = target.getAttribute('href');

        if (!targetLink.startsWith('#') || targetLink === '#') return;

        ev.preventDefault();

        const targetElem = document.querySelector(target.getAttribute('href'));
        const navbarHeight = navbar.offsetHeight;
        const targetTop = targetElem.getBoundingClientRect().top - navbarHeight;
        const scrollY = window.scrollY + targetTop;
        window.scrollTo({ top: scrollY, behavior: 'smooth' });

        if (this.isNavbarExpanded()) {
          this.toggleNavbar(false);
        }
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth < this.navigationBreakpoint || !this.isNavbarExpanded()) return;

      this.setNavbarExpanded(false);
    });
  }

  toggleNavbar(expanded) {
    if (expanded === undefined) expanded = !this.isNavbarExpanded();
    this.setNavbarExpanded(expanded);
    this.animateNavbar();
  }

  setNavbarExpanded(expanded) {
    document.body.dataset.navbarExpanded = expanded;
  }

  isNavbarExpanded() {
    return document.body.dataset.navbarExpanded === "true";
  }

  animateNavbar() {
    document.body.dataset.navbarAnimating = "true";
    setTimeout(() => {
      document.body.dataset.navbarAnimating = "false";
    }, this.animationDuration);
  }

  loadCSSVariables() {
    const rootStyles = getComputedStyle(document.documentElement);
    const animationDuration = rootStyles.getPropertyValue('--nav-transition-duration');
    const breakpoint = rootStyles.getPropertyValue('--nav-breakpoint');

    this.navigationBreakpoint = parseInt(breakpoint) * parseFloat(rootStyles.fontSize);
    this.animationDuration = parseFloat(animationDuration) * 1000;
  }
}

function loadPreloadedStyles() {
  document.querySelectorAll('link[rel="preload"][as="style"]').forEach(link => {
    link.rel = 'stylesheet';
  });
}

window.addEventListener('load', () => {
  loadPreloadedStyles();

  // Initialize slideshow
  document.querySelectorAll('.slider').forEach(elem => new SlideShow(elem));

  new NavigationManager();
});
