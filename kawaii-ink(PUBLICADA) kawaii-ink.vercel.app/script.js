/**
 * script.js – Kawaii Ink
 * Comportamientos interactivos: año dinámico, navbar scroll,
 * scroll reveal con IntersectionObserver, placeholder de imágenes,
 * tilt en gallery cards y efecto ripple en botones.
 */

/* ============================================================
   1. AÑO DINÁMICO EN FOOTER
   ============================================================ */
const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   2. NAVBAR – Efecto al hacer scroll (shrink + shadow intenso)
   ============================================================ */
const header = document.querySelector('header');

const handleNavbarScroll = () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleNavbarScroll, { passive: true });

/* ============================================================
   3. SCROLL REVEAL – IntersectionObserver
   Añade la clase .reveal (y variantes) a los elementos
   que se deben animar al entrar en pantalla.
   ============================================================ */
const revealElements = [
  /* Hero */
  { selector: '#hero .badge',      classes: ['reveal'] },
  { selector: '#hero h1',          classes: ['reveal'] },
  { selector: '#hero p.max-w-md',  classes: ['reveal'] },
  { selector: '#hero .flex.flex-col',  classes: ['reveal'] },

  /* Gallery */
  { selector: '#galeria .text-center', classes: ['reveal'] },
  { selector: '#galeria article',      classes: ['reveal'] },

  /* Higiene */
  { selector: '#higiene .text-center', classes: ['reveal'] },
  { selector: '#higiene .care-card',   classes: ['reveal'] },
  { selector: '#higiene .mt-10',       classes: ['reveal'] },
];

// Add reveal classes to DOM
revealElements.forEach(({ selector, classes }) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    classes.forEach(c => el.classList.add(c));
    // Stagger delay for sibling items
    if (i > 0) el.style.transitionDelay = `${i * 0.12}s`;
  });
});

// Observer
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire once
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ============================================================
   4. GALLERY IMAGE PLACEHOLDER
   Sustituye imágenes rotas por un placeholder estilizado
   que mantiene la estética Kawaii Ink.
   ============================================================ */
const PLACEHOLDER_LABELS = [
  { emoji: '🌸', label: 'Floral Kawaii' },
  { emoji: '🎌', label: 'Anime Ink' },
  { emoji: '💫', label: 'Neo Geo' },
  { emoji: '🎨', label: 'Graffiti Ink' },
];

document.querySelectorAll('.gallery-card img').forEach((img, idx) => {
  const data = PLACEHOLDER_LABELS[idx] || { emoji: '🖋️', label: 'Kawaii Ink' };

  img.addEventListener('error', () => {
    const wrapper = img.closest('.rounded-\\[3rem\\]') || img.parentElement;

    // Build placeholder div
    const ph = document.createElement('div');
    ph.className = 'gallery-placeholder';
    ph.style.cssText = `
      min-height: 288px;
      background: linear-gradient(135deg, #1a1028 0%, #0f0f1a 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 2rem;
      position: relative;
      overflow: hidden;
    `;

    // Decorative gradient blob inside placeholder
    const blobEl = document.createElement('div');
    blobEl.style.cssText = `
      position: absolute;
      width: 200px; height: 200px;
      background: radial-gradient(circle, rgba(255,42,133,0.15), transparent 70%);
      border-radius: 50%;
      top: -50px; right: -50px;
      pointer-events: none;
    `;

    const emojiEl = document.createElement('span');
    emojiEl.textContent = data.emoji;
    emojiEl.style.cssText = 'font-size: 3.5rem; line-height: 1;';

    const labelEl = document.createElement('span');
    labelEl.textContent = data.label;
    labelEl.style.cssText = `
      font-family: 'Rubik Bubbles', cursive;
      font-size: 1.1rem;
      background: linear-gradient(90deg, #FF2A85, #8A2BE2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    `;

    const subEl = document.createElement('span');
    subEl.textContent = 'Portafolio próximamente';
    subEl.style.cssText = `
      font-family: 'Nunito', sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      color: rgba(255,255,255,0.3);
      letter-spacing: 0.1em;
      text-transform: uppercase;
    `;

    ph.appendChild(blobEl);
    ph.appendChild(emojiEl);
    ph.appendChild(labelEl);
    ph.appendChild(subEl);

    img.replaceWith(ph);
  });
});

/* ============================================================
   5. EFECTO RIPPLE en botones CTA
   ============================================================ */
function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  const rect = button.getBoundingClientRect();

  circle.style.cssText = `
    width: ${diameter}px;
    height: ${diameter}px;
    left: ${event.clientX - rect.left - radius}px;
    top:  ${event.clientY - rect.top  - radius}px;
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    transform: scale(0);
    animation: ripple-anim 0.6s linear;
    pointer-events: none;
  `;

  // Inject @keyframes once
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes ripple-anim {
        to { transform: scale(4); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.appendChild(circle);

  circle.addEventListener('animationend', () => circle.remove());
}

document.querySelectorAll('.btn-neon, a[href="#galeria"], a[href="#contacto"]').forEach(btn => {
  btn.addEventListener('click', createRipple);
});

/* ============================================================
   6. TILT SUAVE en Gallery Cards (desktop only)
   ============================================================ */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
      card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateY(0)';
    });
  });
}

/* ============================================================
   7. SMOOTH SCROLL para links internos con offset de navbar
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 90; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   8. PARTÍCULAS KAWAII en Hero (ligero canvas effect)
   ============================================================ */
(function initParticles() {
  const section = document.getElementById('hero');
  if (!section) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.35;
  `;
  section.style.position = 'relative';
  section.insertBefore(canvas, section.firstChild);

  const ctx = canvas.getContext('2d');
  const particles = [];
  const EMOJIS = ['✦', '⬡', '◈', '✧', '◆'];
  const COUNT  = window.innerWidth < 640 ? 18 : 30;

  function resize() {
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      vx:   (Math.random() - 0.5) * 0.4,
      vy:   -Math.random() * 0.5 - 0.2,
      size: Math.random() * 10 + 6,
      color: Math.random() > 0.5 ? '#FF2A85' : '#8A2BE2',
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      alpha: Math.random() * 0.5 + 0.2,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.font        = `${p.size}px sans-serif`;
      ctx.fillText(p.emoji, p.x, p.y);
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      p.alpha += Math.sin(Date.now() / 1500 + p.x) * 0.002;

      if (p.y < -20)              p.y = canvas.height + 20;
      if (p.x < -20)              p.x = canvas.width  + 20;
      if (p.x > canvas.width + 20) p.x = -20;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

console.log('%c🌸 Kawaii Ink – Studio', 'font-family: Rubik Bubbles; font-size: 1.2rem; color: #FF2A85;');
console.log('%cHecho con 💖 y mucha tinta', 'font-family: Nunito; font-size: 0.9rem; color: #8A2BE2;');
