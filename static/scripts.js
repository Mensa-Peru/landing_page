document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Slideshow Functionality
let slideIndices = [1, 1];
let slideId = ["slides1", "slides2"];
let timers = [];

// Initialize slideshows
for (let i = 0; i < slideId.length; i++) {
  showSlides(slideIndices[i], i);
  setTimer(i);
}

// Next/previous controls
function plusSlides(n, no) {
  clearTimeout(timers[no]);
  slideIndices[no] += n;
  showSlides(slideIndices[no], no);
  setTimer(no);
}

// Show slides function
function showSlides(n, no) {
  let slidesContainer = document.getElementById(slideId[no]);
  let slides = document.querySelectorAll(`#${slideId[no]} img`);
  let totalSlides = slides.length;

  if (n > totalSlides) { slideIndices[no] = 1; }
  if (n < 1) { slideIndices[no] = totalSlides; }

  // Before starting the transition, make all images visible
  slides.forEach((slide) => {
    //slide.style.visibility = "visible";
    slide.classList.add('active');
  });

  // Apply the transform to slide the images
  let translateX = -(slideIndices[no] - 1) * 100;
  slidesContainer.style.transform = `translateX(${translateX}%)`;

  // Trigger fade out
  slides.forEach((slide, index) => {
    if (index + 1 !== slideIndices[no])
      slide.classList.remove('active');
    //slide.style.visibility = (index + 1 === slideIndices[no]) ? "visible" : "hidden";
  });

  // Event listener for transition end
  function transitionEndHandler() {
    // After the transition, hide all slides except the current one
    // Remove this event listener
    slidesContainer.removeEventListener('transitionend', transitionEndHandler);
  }

  slidesContainer.addEventListener('transitionend', transitionEndHandler);
}

// Automatic slideshow with 5-second interval
function setTimer(no) {
  timers[no] = setTimeout(function () {
    plusSlides(1, no);
  }, 5000);
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

  const menuButton = document.querySelector('.navbar-container .toggle-button');
  const navbarOverlay = document.querySelector('.navbar-container .overlay');
  const navbar = document.querySelector('.navbar-container .navbar');

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
});
