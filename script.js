/* ===========================
   LUXE GLOW — WORLD-CLASS JS
   =========================== */

'use strict';

// ===== LOADER =====
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  const text = document.getElementById('loaderText');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 20;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        startRevealObserver();
        animateCounters();
      }, 400);
    }
    fill.style.width = progress + '%';
    if (progress > 60) text.textContent = 'ALMOST READY...';
    if (progress > 90) text.textContent = 'WELCOME TO LUXE GLOW';
  }, 80);
});

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
const canUseCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

if (canUseCustomCursor && cursor && follower) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .product-card, .tab').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '12px';
      cursor.style.height = '12px';
      follower.style.width = '50px';
      follower.style.height = '50px';
      follower.style.borderColor = 'rgba(212,175,55,0.45)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '8px';
      cursor.style.height = '8px';
      follower.style.width = '36px';
      follower.style.height = '36px';
      follower.style.borderColor = 'rgba(212,175,55,0.6)';
    });
  });
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  // Scroll top button
  const scrollBtn = document.getElementById('scrollTop');
  if (window.scrollY > 400) {
    scrollBtn.classList.add('visible');
  } else {
    scrollBtn.classList.remove('visible');
  }
});

document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== MOBILE MENU =====
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  menuBtn.setAttribute('aria-expanded', String(menuOpen));
  const spans = menuBtn.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    const spans = menuBtn.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ===== REVEAL ON SCROLL =====
function startRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-num, .counter').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, 25);
  });
}

// Re-trigger counters when about section is visible
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.counter').forEach(el => {
        const target = parseInt(el.dataset.count);
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = Math.floor(current);
        }, 25);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const aboutSection = document.querySelector('.about');
if (aboutSection) counterObserver.observe(aboutSection);

// ===== PRODUCT FILTER TABS =====
const tabs = document.querySelectorAll('.tab');
const productCards = document.querySelectorAll('.product-card');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;

    productCards.forEach(card => {
      const category = card.dataset.category;
      if (filter === 'all' || category === filter) {
        card.classList.remove('hide');
        card.classList.add('show');
      } else {
        card.classList.add('hide');
        card.classList.remove('show');
      }
    });
  });
});

// ===== WISHLIST =====
const wishlisted = new Set();
document.querySelectorAll('.wishlist-icon').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.id;
    if (wishlisted.has(id)) {
      wishlisted.delete(id);
      btn.classList.remove('active');
      showToast('💔 Removed from wishlist');
    } else {
      wishlisted.add(id);
      btn.classList.add('active');
      showToast('❤️ Added to wishlist!');
    }
  });
});

// ===== CART =====
let cart = [];
let cartTotal = 0;

function addToCart(name, price) {
  cart.push({ name, price, id: Date.now() });
  cartTotal += price;
  updateCartUI();
  showToast(`✦ ${name} added to cart!`);
  // Bounce cart icon
  const count = document.getElementById('cartCount');
  count.classList.add('pop');
  setTimeout(() => count.classList.remove('pop'), 300);
  openCart();
}

function removeFromCart(id) {
  const item = cart.find(c => c.id === id);
  if (item) {
    cartTotal -= item.price;
    cart = cart.filter(c => c.id !== id);
    updateCartUI();
  }
}

function updateCartUI() {
  const cartItemsEl = document.getElementById('cartItems');
  const cartCountEl = document.getElementById('cartCount');
  const cartEmptyEl = document.getElementById('cartEmpty');
  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl = document.getElementById('cartTotal');

  cartCountEl.textContent = cart.length;
  subtotalEl.textContent = '₹' + cartTotal.toLocaleString('en-IN');
  totalEl.textContent = cart.length > 0 ? '₹' + (cartTotal + 199).toLocaleString('en-IN') : '₹0';

  if (cart.length === 0) {
    cartEmptyEl.style.display = 'flex';
    cartItemsEl.innerHTML = '';
    return;
  }
  cartEmptyEl.style.display = 'none';
  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join('');
}

const cartToggle = document.getElementById('cartToggle');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('show');
  document.body.style.overflow = '';
}
cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// ===== AI ADVISOR =====
let selectedSkin = '';
let selectedConcern = '';

const recommendations = {
  dry: {
    glow: { name: 'Rose Gold Glow Serum', desc: 'Intensely hydrating serum with rose extract and hyaluronic acid for dry, glowing skin.', price: '₹3,499' },
    'anti-aging': { name: 'Pearl Anti-Age Elixir', desc: 'Collagen-boosting formula with pearl extract for plump, youthful dry skin.', price: '₹4,999' },
    acne: { name: 'Gentle Clear Toner', desc: 'Mild salicylic formula that clears blemishes without over-drying.', price: '₹1,299' },
    hydration: { name: 'Aqua Deep Moisture Cream', desc: 'Barrier-repair cream with ceramides for deeply nourished dry skin.', price: '₹2,499' },
  },
  oily: {
    glow: { name: 'Oil-Free Luminous Serum', desc: 'Lightweight serum with niacinamide for a radiant, oil-controlled glow.', price: '₹2,299' },
    'anti-aging': { name: 'Matte Retinol Fluid', desc: 'Oil-free retinol treatment that fights aging without adding shine.', price: '₹3,799' },
    acne: { name: 'Purify & Clear Gel', desc: 'Zinc and tea tree formula that targets breakouts and minimizes pores.', price: '₹1,599' },
    hydration: { name: 'Gel Burst Hydrator', desc: 'Water-gel moisturizer that hydrates intensely without any greasy feel.', price: '₹1,899' },
  },
  combination: {
    glow: { name: 'Balance & Glow Essence', desc: 'Dual-zone formula that hydrates dry areas and controls shine — perfectly balanced.', price: '₹2,799' },
    'anti-aging': { name: 'Youth Restore Complex', desc: 'Balancing anti-aging treatment for combination skin types.', price: '₹4,299' },
    acne: { name: 'Zone Control Serum', desc: 'Targets T-zone oiliness while keeping cheeks comfortably moisturized.', price: '₹2,099' },
    hydration: { name: 'Smart Moisture Lotion', desc: 'Adaptive hydration that responds to your skin\'s changing needs throughout the day.', price: '₹2,299' },
  },
  sensitive: {
    glow: { name: 'Calm & Radiance Drops', desc: 'Ultra-gentle brightening serum with centella asiatica for sensitive glowing skin.', price: '₹3,199' },
    'anti-aging': { name: 'Soothing Peptide Cream', desc: 'Peptide-rich formula gentle enough for reactive sensitive skin.', price: '₹3,899' },
    acne: { name: 'Redness Relief Balm', desc: 'Non-irritating, fragrance-free formula that calms and clears sensitive skin.', price: '₹1,799' },
    hydration: { name: 'Barrier Soothe Cream', desc: 'Oat and aloe formula that rebuilds and protects the sensitive skin barrier.', price: '₹2,699' },
  }
};

function selectSkin(btn) {
  document.querySelectorAll('#aiStep1 .ai-opt').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedSkin = btn.dataset.val;
  setTimeout(() => {
    document.getElementById('aiStep1').classList.add('hidden');
    document.getElementById('aiStep2').classList.remove('hidden');
  }, 400);
}

function selectConcern(btn) {
  document.querySelectorAll('#aiStep2 .ai-opt').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedConcern = btn.dataset.val;
  setTimeout(() => {
    const rec = recommendations[selectedSkin]?.[selectedConcern];
    if (rec) {
      document.getElementById('aiProductName').textContent = rec.name;
      document.getElementById('aiProductDesc').textContent = rec.desc;
      document.getElementById('aiProductPrice').textContent = rec.price;
      const price = parseInt(rec.price.replace(/[₹,]/g, ''));
      document.getElementById('aiAddBtn').onclick = () => {
        addToCart(rec.name, price);
        showToast('✦ AI Recommendation added to cart!');
      };
    }
    document.getElementById('aiStep2').classList.add('hidden');
    document.getElementById('aiResult').classList.remove('hidden');
  }, 400);
}

// Reset AI advisor
document.getElementById('aiAddBtn')?.addEventListener('click', () => {
  setTimeout(() => {
    document.getElementById('aiResult').classList.add('hidden');
    document.getElementById('aiStep1').classList.remove('hidden');
    document.querySelectorAll('.ai-opt').forEach(b => b.classList.remove('selected'));
    selectedSkin = ''; selectedConcern = '';
  }, 1500);
});

// ===== TESTIMONIAL AUTO-SCROLL =====
const track = document.getElementById('testimonialsTrack');
const dotsContainer = document.getElementById('tDots');
const tCards = document.querySelectorAll('.tcard');
let currentSlide = 0;
let autoSlide;

tCards.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'tdot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function goToSlide(index) {
  currentSlide = index;
  const cardWidth = tCards[0]?.offsetWidth + 24;
  track.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
  document.querySelectorAll('.tdot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % tCards.length;
  goToSlide(currentSlide);
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  autoSlide = setInterval(nextSlide, 6500);
  track.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.addEventListener('mouseleave', () => { autoSlide = setInterval(nextSlide, 6500); });
}

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  const span = btn.querySelector('span');
  span.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    span.textContent = '✓ Message Sent!';
    showToast('✦ Your message has been sent! We\'ll be in touch soon.');
    e.target.reset();
    setTimeout(() => {
      span.textContent = 'Send Message';
      btn.disabled = false;
    }, 3000);
  }, 1500);
});

// ===== TOAST =====
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ===== SMOOTH NAV ACTIVE STATE =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });
  navAnchors.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === '#' + current) {
      a.style.color = '#d4af37';
    }
  });
});

// ===== PARTICLES (Hero Background) =====
function createParticles() {
  const container = document.getElementById('particles');
  const smallScreen = window.matchMedia('(max-width: 768px)').matches;
  if (!container || reduceMotion || smallScreen) return;
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute;
      width:${Math.random() * 3 + 1}px;
      height:${Math.random() * 3 + 1}px;
      background:rgba(212,175,55,${Math.random() * 0.16 + 0.06});
      border-radius:50%;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      animation:particleFloat ${Math.random() * 12 + 14}s ease-in-out infinite;
      animation-delay:${Math.random() * 4}s;
    `;
    container.appendChild(p);
  }
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      0%,100%{transform:translate(0,0);opacity:0.2}
      50%{transform:translate(${Math.random()*14-7}px,${Math.random()*14-7}px);opacity:0.42}
    }
  `;
  document.head.appendChild(style);
}
createParticles();

// ===== NEWSLETTER =====
document.querySelector('.newsletter button')?.addEventListener('click', () => {
  const input = document.querySelector('.newsletter input');
  if (input.value && input.value.includes('@')) {
    showToast('✦ You\'re subscribed! Welcome to Luxe Glow.');
    input.value = '';
  } else {
    showToast('⚠ Please enter a valid email.');
  }
});

// ===== KEYBOARD ACCESSIBILITY =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCart();
    if (menuOpen) {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }
});
