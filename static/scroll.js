// Slideshow Functionality
let slideIndices = [1,1,1,1]; // Individual slide indices for each section
let slideId = ["slides1", "slides2", "slides3", "slides4"]; // IDs for each slides container
let timers = [];

// Initialize slideshows
for (let i = 0; i < slideIndices.length; i++) {
  showSlides(1, i);
  setTimer(i);
}

// Next/previous controls
function plusSlides(n, no) {
  clearTimeout(timers[no]);
  showSlides(slideIndices[no] += n, no);
  setTimer(no);
}

// Display slides
function showSlides(n, no) {
  let slides = document.querySelectorAll(`#${slideId[no]} img`);
  if (n > slides.length) {slideIndices[no] = 1}
  if (n < 1) {slideIndices[no] = slides.length}
  slides.forEach((slide, index) => {
    slide.style.display = (index + 1 === slideIndices[no]) ? "block" : "none";
  });
}

// Automatic slideshow with 5-second interval
function setTimer(no) {
  timers[no] = setTimeout(function() {
    plusSlides(1, no);
  }, 5000);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
});
