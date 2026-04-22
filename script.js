/* Mini carousel */
const track = document.querySelector('.carousel__track');
const slides = Array.from(track?.children || []);
const nextButton = document.querySelector('.carousel__button--next');
const prevButton = document.querySelector('.carousel__button--prev');
const nav = document.querySelector('.carousel__nav');

let currentIndex = 0;

function updateCarousel(index) {
  if (!track || slides.length === 0) return;

  currentIndex = ((index % slides.length) + slides.length) % slides.length;
  const offset = slides[currentIndex].getBoundingClientRect().width * currentIndex;
  track.style.transform = `translateX(-${offset}px)`;

  const indicators = Array.from(nav?.children || []);
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
  if (!track || slides.length === 0) return;
  buildNav();
  updateCarousel(0);
  window.addEventListener('resize', () => updateCarousel(currentIndex));
}

/* Background logo parallax */
const parallaxLogo = document.querySelector('.parallax-logo');

function setupParallaxLogo() {
  if (!parallaxLogo) return;

  // Keep the logo fixed in the background while content scrolls over it.
  parallaxLogo.style.transform = 'translate3d(-50%, -50%, 0)';
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

setupCarousel();
setupParallaxLogo();
