/* ============================================================
   main.js
   - Header scroll effect
   - Mobile burger menu
   - Scroll reveal
   - Services sticky image swap
   - Reviews slider
============================================================ */

/* ---- HEADER SCROLL ---- */
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ---- BURGER MENU ---- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
});
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
  });
});

/* ---- SCROLL REVEAL ---- */
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings within same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('[data-reveal]'));
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 0.12}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ---- SERVICES: STICKY IMAGE SWAP ---- */
const serviceImg = document.getElementById('serviceImg');
const serviceItems = document.querySelectorAll('.service-item[data-img]');

if (serviceImg && serviceItems.length) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const newSrc = entry.target.getAttribute('data-img');
        if (serviceImg.src !== newSrc) {
          serviceImg.style.opacity = '0';
          serviceImg.style.transform = 'scale(1.04)';
          setTimeout(() => {
            serviceImg.src = newSrc;
            serviceImg.style.opacity = '1';
            serviceImg.style.transform = 'scale(1)';
          }, 350);
        }
      }
    });
  }, { threshold: 0.5 });
  serviceItems.forEach(item => imgObserver.observe(item));
}

/* ---- REVIEWS SLIDER ---- */
const track = document.getElementById('reviewsTrack');
const cards = document.querySelectorAll('.review-card');
const prevBtn = document.getElementById('revPrev');
const nextBtn = document.getElementById('revNext');
const dotsContainer = document.getElementById('revDots');

let currentPage = 0;
let visibleCount = 5;

function getVisibleCount() {
  const w = window.innerWidth;
  if (w <= 640) return 3;
  if (w <= 1024) return 4;
  return 5;
}

function getPageCount() {
  return Math.ceil(cards.length / visibleCount);
}

function getCardWidth() {
  if (!cards.length) return 0;
  return cards[0].getBoundingClientRect().width;
}

function getGap() {
  const w = window.innerWidth;
  return w <= 640 ? 12 : 20;
}

function buildDots() {
  dotsContainer.innerHTML = '';
  const pages = getPageCount();
  for (let i = 0; i < pages; i++) {
    const dot = document.createElement('button');
    dot.className = 'rev-dot' + (i === currentPage ? ' active' : '');
    dot.setAttribute('aria-label', `Страница ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }
}

function updateDots() {
  document.querySelectorAll('.rev-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentPage);
  });
}

function goTo(page) {
  const pages = getPageCount();
  currentPage = Math.max(0, Math.min(page, pages - 1));
  const offset = currentPage * visibleCount * (getCardWidth() + getGap());
  track.style.transform = `translateX(-${offset}px)`;
  updateDots();
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage >= pages - 1;
}

function init() {
  visibleCount = getVisibleCount();
  currentPage = Math.min(currentPage, getPageCount() - 1);
  buildDots();
  goTo(currentPage);
}

prevBtn.addEventListener('click', () => goTo(currentPage - 1));
nextBtn.addEventListener('click', () => goTo(currentPage + 1));

// Touch / swipe support
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goTo(currentPage + (diff > 0 ? 1 : -1));
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(init, 180);
});

init();
