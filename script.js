/* global requestAnimationFrame */

const starCanvas = document.getElementById('starfield');
const ctx = starCanvas.getContext('2d');
const stars = [];
const STAR_COUNT = 220;

function resizeCanvas() {
  starCanvas.width = window.innerWidth * window.devicePixelRatio;
  starCanvas.height = window.innerHeight * window.devicePixelRatio;
  starCanvas.style.width = `${window.innerWidth}px`;
  starCanvas.style.height = `${window.innerHeight}px`;

  // Reset any previous transforms so scaling does not compound
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

function createStars() {
  stars.length = 0;
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.4 + 0.2,
      speed: Math.random() * 0.05 + 0.01,
      twinkle: Math.random() * 0.6 + 0.4,
    });
  }
}

function drawStars(frame) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  stars.forEach((star, index) => {
    const twinkle = Math.sin((frame + index * 7) / 30) * 0.25 + 0.75;
    const alpha = Math.min(1, Math.max(0.3, star.twinkle * twinkle));

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fill();

    star.y += star.speed;
    if (star.y > window.innerHeight + 10) {
      star.y = -10;
      star.x = Math.random() * window.innerWidth;
    }
  });

  requestAnimationFrame(drawStars);
}

function initStarfield() {
  resizeCanvas();
  createStars();
  requestAnimationFrame(drawStars);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  createStars();
});

/* Mini carousel */
const track = document.querySelector('.carousel__track');
const slides = Array.from(track?.children || []);
const nextButton = document.querySelector('.carousel__button--next');
const prevButton = document.querySelector('.carousel__button--prev');
const nav = document.querySelector('.carousel__nav');

let currentIndex = 0;

function updateCarousel(index) {
  if (!track) return;

  currentIndex = Math.max(0, Math.min(index, slides.length - 1));
  const offset = slides[currentIndex].getBoundingClientRect().width * currentIndex;
  track.style.transform = `translateX(-${offset}px)`;

  const indicators = Array.from(nav.children);
  indicators.forEach((dot, i) => {
    dot.classList.toggle('is-selected', i === currentIndex);
  });
}

function buildNav() {
  if (!nav) return;
  nav.innerHTML = '';
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'carousel__indicator';
    dot.setAttribute('aria-label', `Slide ${index + 1}`);
    dot.addEventListener('click', () => updateCarousel(index));
    nav.appendChild(dot);
  });
}

if (nextButton) {
  nextButton.addEventListener('click', () => updateCarousel(currentIndex + 1));
}

if (prevButton) {
  prevButton.addEventListener('click', () => updateCarousel(currentIndex - 1));
}

function setupCarousel() {
  buildNav();
  updateCarousel(0);
  window.addEventListener('resize', () => updateCarousel(currentIndex));
}

/* Mobile nav toggle */
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('open');
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (siteNav.classList.contains('open')) {
        siteNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* Scroll reveal */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.fade-in').forEach((element) => observer.observe(element));

/* Simple contact form (mailto) */
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');

if (contactForm && contactStatus) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = data.get('name')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const message = data.get('message')?.toString().trim();

    if (!name || !email || !message) {
      contactStatus.textContent = 'Please fill in all fields.';
      return;
    }

    contactStatus.textContent = 'Preparing your message…';

    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    const subject = encodeURIComponent('Booking inquiry from website');

    window.location.href = `mailto:booking@thelucayeagerband.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      contactStatus.textContent = 'If your mail client did not open, you can reach out at booking@thelucayeagerband.com';
    }, 1400);
  });
}

initStarfield();
setupCarousel();
