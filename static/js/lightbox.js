const items = document.querySelectorAll('.portfolio-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDescription = document.getElementById('lightboxDescription');

let currentIndex = 0;

function open(index) {
  currentIndex = index;
  update();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function close() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function update() {
  const el = items[currentIndex];
  const img = el.querySelector('img');
  lightboxImage.src = img.src;
  lightboxCounter.textContent = `${currentIndex + 1} / ${items.length}`;
  lightboxTitle.textContent = img.alt;
  lightboxDescription.textContent = ""; // Optional: customize per image
}

function next() {
  currentIndex = (currentIndex + 1) % items.length;
  update();
}

function prev() {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  update();
}

items.forEach((el, idx) => el.addEventListener('click', () => open(idx)));
lightboxClose.addEventListener('click', close);
lightboxNext.addEventListener('click', next);
lightboxPrev.addEventListener('click', prev);

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
});
