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
