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

    this.currentIndex++;

    if (this.currentIndex >= this.totalSlides) {
      this.currentIndex = 0;
    }

    this.showSlide();
    this.loop();
  }

  prevSlide() {
    clearTimeout(this.timer);

    if (!this.currentIndex) {
      this.currentIndex = this.totalSlides;
    }

    this.currentIndex--;

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

function loadPreloadedStyles() {
  document.querySelectorAll('link[rel="preload"][as="style"]').forEach(link => {
    link.rel = 'stylesheet';
  });
}

function isNavbarExpanded() {
  return document.body.dataset.navbarExpanded === 'true';
}

function toggleMenu() {
  document.body.dataset.navbarExpanded = !isNavbarExpanded();
}

window.addEventListener('load', () => {
  loadPreloadedStyles();

  const menuButton = document.querySelector('.navbar .toggle-button');
  const navbarOverlay = document.querySelector('.navbar .overlay');
  const navbar = document.querySelector('.navbar .navbar-content');

  menuButton.addEventListener('click', toggleMenu);
  navbarOverlay.addEventListener('click', toggleMenu);

  navbar.addEventListener('click', (event) => {
    if (isNavbarExpanded() && event.target.closest('.nav-link, .close-button')) {
      document.body.dataset.navbarExpanded = false;
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && isNavbarExpanded()) {
      document.body.dataset.navbarExpanded = false;
    }
  });

  // Initialize slideshow
  document.querySelectorAll('.slider').forEach(elem => new SlideShow(elem));
});
