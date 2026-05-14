/* ============================================================
   Rin's Cafe Cinnamon — main.js
   Shared across all pages: cart badge, toast, nav burger
   ============================================================ */

const CART_KEY = 'cinnamon_cart';

/* ── Cart helpers ── */
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(name, price) {
  const cart = getCart();
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ name, price: parseFloat(price), qty: 1 });
  }
  saveCart(cart);
  updateCartBadge();
  showToast('Added to cart~ 🛒✨');
}

function removeFromCart(name) {
  const cart = getCart().filter(i => i.name !== name);
  saveCart(cart);
  updateCartBadge();
}

function updateCartQty(name, delta) {
  const cart = getCart();
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty = Math.max(1, (item.qty || 1) + delta);
  saveCart(cart);
  updateCartBadge();
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function cartTotal() {
  return getCart().reduce((s, i) => s + i.price * (i.qty || 1), 0);
}

function cartCount() {
  return getCart().reduce((s, i) => s + (i.qty || 1), 0);
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = cartCount();
}

/* ── Toast ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ── Confetti (used on thank-you page) ── */
function launchConfetti() {
  const colors = ['#ffb3c6', '#d4b8e0', '#ffd166', '#b5ead7', '#c47d3a', '#5865f2'];
  const container = document.getElementById('confetti-container');
  if (!container) return;

  for (let i = 0; i < 120; i++) {
    const el = document.createElement('div');
    el.classList.add('confetti-piece');
    el.style.cssText = `
      left:${Math.random() * 100}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      width:${6 + Math.random() * 8}px;
      height:${6 + Math.random() * 8}px;
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      animation-delay:${Math.random() * 2}s;
      animation-duration:${2.5 + Math.random() * 2}s;
    `;
    container.appendChild(el);
  }

  setTimeout(() => container.innerHTML = '', 6000);
}

/* ── Mobile nav burger ── */
function initBurger() {
  const burger = document.getElementById('navBurger');
  const navLinks = document.querySelector('.nav-links');
  if (!burger || !navLinks) return;
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-open');
    burger.textContent = navLinks.classList.contains('nav-open') ? '✕' : '☰';
  });
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('nav-open');
      burger.textContent = '☰';
    }
  });
}

/* ── Init on every page ── */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initBurger();
});
