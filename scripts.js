/* ═══════════════════════════════════════════════════════════════
   AKASH PORTFOLIO — script.js
   Link this file at bottom of index.html as: <script src="script.js"></script>
   ═══════════════════════════════════════════════════════════════ */


/* ══════════════════════════════════════════════
   1. CUSTOM CURSOR
   ══════════════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');

// Track mouse position
let mx = 0, my = 0;   // mouse X / Y
let rx = 0, ry = 0;   // ring X / Y (lags behind)

document.addEventListener('mousemove', function(e) {
  mx = e.clientX;
  my = e.clientY;
  // Move the dot cursor instantly
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

// Animate ring with smooth lag
function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Expand cursor on hover over interactive elements
document.querySelectorAll('a, button, .tilt-card').forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    cursor.style.width  = '20px';
    cursor.style.height = '20px';
    ring.style.width    = '60px';
    ring.style.height   = '60px';
  });
  el.addEventListener('mouseleave', function() {
    cursor.style.width  = '12px';
    cursor.style.height = '12px';
    ring.style.width    = '40px';
    ring.style.height   = '40px';
  });
});


/* ══════════════════════════════════════════════
   2. PARTICLE CANVAS BACKGROUND
   ══════════════════════════════════════════════ */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

// Resize canvas to fill window
function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Create 80 particles
const particles = Array.from({ length: 80 }, function() {
  return {
    x:     Math.random() * canvas.width,
    y:     Math.random() * canvas.height,
    vx:    (Math.random() - 0.5) * 0.3,
    vy:    (Math.random() - 0.5) * 0.3,
    size:  Math.random() * 1.5 + 0.3,
    alpha: Math.random() * 0.4 + 0.1,
    pulse: Math.random() * Math.PI * 2,
  };
});

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(function(p, i) {
    // Move particle
    p.x     += p.vx;
    p.y     += p.vy;
    p.pulse += 0.01;

    // Wrap around edges
    if (p.x < 0)            p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0)            p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    // Draw pulsing dot
    const a = p.alpha * (0.6 + Math.sin(p.pulse) * 0.4);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(99,179,237,' + a + ')';
    ctx.fill();

    // Draw faint connecting lines to nearby particles
    particles.slice(i + 1, i + 5).forEach(function(p2) {
      const dx   = p.x - p2.x;
      const dy   = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = 'rgba(99,179,237,' + (0.04 * (1 - dist / 120)) + ')';
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    });
  });

  // Soft glow that follows the cursor
  const g = ctx.createRadialGradient(mx, my, 0, mx, my, 300);
  g.addColorStop(0, 'rgba(99,179,237,0.04)');
  g.addColorStop(1, 'rgba(99,179,237,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(drawParticles);
}
drawParticles();


/* ══════════════════════════════════════════════
   3. NAVBAR — SCROLL EFFECT
   ══════════════════════════════════════════════ */
window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


/* ══════════════════════════════════════════════
   4. SCROLL REVEAL ANIMATION
   ══════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

// Observe every element with class "reveal"
document.querySelectorAll('.reveal').forEach(function(el) {
  revealObserver.observe(el);
});


/* ══════════════════════════════════════════════
   5. 3D TILT EFFECT ON CARDS
   ══════════════════════════════════════════════ */
document.querySelectorAll('.tilt-card').forEach(function(card) {

  card.addEventListener('mousemove', function(e) {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;  // card center X
    const cy   = rect.top  + rect.height / 2;  // card center Y
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    card.style.transform =
      'perspective(800px) rotateX(' + (-dy * 8) + 'deg) rotateY(' + (dx * 8) + 'deg) translateZ(10px)';
  });

  card.addEventListener('mouseleave', function() {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
  });

});


/* ══════════════════════════════════════════════
   6. HERO CARD — GLOBAL MOUSE TILT
   (Card tilts based on cursor position anywhere on page)
   ══════════════════════════════════════════════ */
const heroCard = document.getElementById('heroCard');

if (heroCard) {
  document.addEventListener('mousemove', function(e) {
    const rect = heroCard.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / window.innerWidth;
    const dy   = (e.clientY - cy) / window.innerHeight;
    heroCard.style.transform =
      'perspective(800px) rotateX(' + (-dy * 15) + 'deg) rotateY(' + (dx * 15) + 'deg)';
  });
}


/* ══════════════════════════════════════════════
   7. TYPING EFFECT — Hero Role Text
   ══════════════════════════════════════════════ */
const roles = [
  'Web Developer',
  'Problem Solver',
  'BCA Graduate',
  'Full Stack Learner'
];

let roleIndex   = 0;   // which role string we're on
let charIndex   = 0;   // how many chars typed so far
let isDeleting  = false;

// Target the first <span> inside .hero-role
const roleEl = document.querySelector('.hero-role span');

function typeRole() {
  if (!roleEl) return;

  const target = roles[roleIndex];

  if (!isDeleting) {
    // Type forward
    charIndex++;
    roleEl.textContent = target.slice(0, charIndex);

    if (charIndex === target.length) {
      // Pause before deleting
      isDeleting = true;
      setTimeout(typeRole, 1800);
      return;
    }
  } else {
    // Delete backward
    charIndex--;
    roleEl.textContent = target.slice(0, charIndex);

    if (charIndex === 0) {
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
    }
  }

  // Typing speed: 100ms forward, 60ms deleting
  setTimeout(typeRole, isDeleting ? 60 : 100);
}

// Kick off the typing effect
typeRole();
