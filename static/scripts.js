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

class ColorSchemeButton {
  #isDarkTheme;
  buttonSelector = '.dark-mode-toggle';

  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    this.updateColorScheme();

    this.mediaQuery.addEventListener('change', this.mqSchemeListener.bind(this));
    document.addEventListener('click', this.toggleDarkThemeListener.bind(this));
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
    document.body.setAttribute('data-dark-theme', this.isDarkTheme());
    this.toggleButtonIcon('.fa-sun', !this.isDarkTheme());
    this.toggleButtonIcon('.fa-moon', this.isDarkTheme());
  }
}

function loadPreloadedStyles() {
  document.querySelectorAll('link[rel="preload"][as="style"]').forEach(link => {
    link.rel = 'stylesheet';
  });
}

function isNavbarExpanded() {
  return document.body.dataset.navbarExpanded === 'true';
}

function toggleMenu(expand) {
  if (expand === undefined) {
    expand = !isNavbarExpanded();
  }

  document.body.dataset.navbarExpanded = expand;
}

document.addEventListener('click', (ev) => {
  const target = ev.target.closest('a[href^="#"]');

  if (!target) return;

  ev.preventDefault();

  const targetElem = document.querySelector(target.getAttribute('href'));
  const navbarHeight = document.querySelector('.navbar').offsetHeight;
  const targetTop = targetElem.getBoundingClientRect().top - navbarHeight;
  const scrollY = window.scrollY + targetTop;

  window.scrollTo({ top: scrollY, behavior: 'smooth' });
});

window.addEventListener('load', () => {
  loadPreloadedStyles();

  const navbar = document.querySelector('.navbar');

  navbar.addEventListener('click', (ev) => {
    const target = ev.target;

    if (target.closest('.toggle-button, .overlay')) {
      toggleMenu();
    } else if (isNavbarExpanded() && target.closest('.nav-link')) {
      toggleMenu(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth < 1024 || !isNavbarExpanded()) return;

    toggleMenu(false);
  });

  // Initialize slideshow
  document.querySelectorAll('.slider').forEach(elem => new SlideShow(elem));

  new ColorSchemeButton();
});
