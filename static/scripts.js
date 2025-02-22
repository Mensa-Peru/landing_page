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
  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const mqScheme = this.mediaQuery.matches ? 'dark' : 'light';
    this.mediaQuery.addEventListener('change', this.mqSchemeChange.bind(this));
    this.colorScheme = localStorage.getItem('color-scheme') ?? mqScheme;

    this.buttonElements = document.querySelectorAll('.theme-toggle');
    this.buttonElements.forEach(button => {
      button.addEventListener('click', this.buttonToggle.bind(this));
    });

    this.updateColorScheme();
  }

  buttonToggle() {
    this.colorScheme = this.colorScheme === 'dark' ? 'light' : 'dark';
    this.updateColorScheme();
  }

  mqSchemeChange() {
    this.colorScheme = this.mediaQuery.matches ? 'dark' : 'light';
    this.updateColorScheme();
  }

  updateColorScheme() {
    localStorage.setItem('color-scheme', this.colorScheme);
    document.documentElement.setAttribute('data-color-scheme', this.colorScheme);
    this.updateColorSchemeButtons();
  }

  updateColorSchemeButtons() {
    this.buttonElements.forEach(button => {
      button.classList.remove('dark-mode-button', 'light-mode-button');
      button.classList.add(`${this.colorScheme}-mode-button`);
    });
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
    } else if (isNavbarExpanded() && target.closest('.nav-link, .close-button')) {
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
