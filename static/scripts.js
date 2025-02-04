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
  let slides = document.querySelectorAll(`#${slideId[no]} img`);
  if (n > slides.length) { slideIndices[no] = 1; }
  if (n < 1) { slideIndices[no] = slides.length; }
  // Calculate the translateX value
  let translateX = -(slideIndices[no] - 1) * 100;
  document.querySelector(`#${slideId[no]}`).style.transform = `translateX(${translateX}%)`;
}

// Automatic slideshow with 5-second interval
function setTimer(no) {
  timers[no] = setTimeout(function () {
    plusSlides(1, no);
  }, 5000);
}
