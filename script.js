// script.js
const viewer = document.getElementById('viewer');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const autoplayToggle = document.getElementById('autoplayToggle');
const intervalInput = document.getElementById('intervalInput');
const status = document.getElementById('status');

let images = [];
let shuffled = [];
let currentIndex = 0;
let autoplayTimer = null;

async function loadImages() {
  try {
    const res = await fetch('images.json', {cache: "no-store"});
    if (!res.ok) throw new Error('無法讀取 images.json');
    images = await res.json();
    if (!Array.isArray(images) || images.length === 0) {
      status.textContent = '目前沒有圖片，請檢查 images.json 或 images 資料夾。';
      nextBtn.disabled = prevBtn.disabled = true;
      return;
    }
    shuffleImages();
    showImage(0);
    status.textContent = `已載入 ${images.length} 張圖片，已隨機排序。`;
  } catch (err) {
    status.textContent = `載入錯誤：${err.message}`;
    nextBtn.disabled = prevBtn.disabled = true;
  }
}

function shuffleArray(arr) {
  // Fisher–Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function shuffleImages() {
  shuffled = images.slice();
  shuffleArray(shuffled);
  currentIndex = 0;
  preloadAll(shuffled);
}

function preloadAll(list) {
  list.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

function showImage(index) {
  const src = shuffled[index];
  if (!src) return;
  viewer.style.opacity = 0;
  setTimeout(() => {
    viewer.src = src;
    viewer.style.opacity = 1;
  }, 250);
}

function nextImage() {
  currentIndex = (currentIndex + 1) % shuffled.length;
  showImage(currentIndex);
}

function prevImage() {
  currentIndex = (currentIndex - 1 + shuffled.length) % shuffled.length;
  showImage(currentIndex);
}

function startAutoplay() {
  stopAutoplay();
  const sec = Math.max(1, parseInt(intervalInput.value || 3, 10));
  autoplayTimer = setInterval(nextImage, sec * 1000);
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}

nextBtn.addEventListener('click', () => {
  nextImage();
  if (autoplayToggle.checked) { startAutoplay(); }
});
prevBtn.addEventListener('click', () => {
  prevImage();
  if (autoplayToggle.checked) { startAutoplay(); }
});

autoplayToggle.addEventListener('change', () => {
  if (autoplayToggle.checked) startAutoplay();
  else stopAutoplay();
});

intervalInput.addEventListener('change', () => {
  if (autoplayToggle.checked) startAutoplay();
});

// 初始載入
loadImages();
