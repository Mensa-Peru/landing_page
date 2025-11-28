export default class {
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
