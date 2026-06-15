/* ═══════════════════════════════════════════════════════════
   PORTFOLIO SCRIPT — GIHAN BENARAGAMA (Redesign)
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initTyping();
  initScrollReveal();
  initActiveNav();
  initAnimations();
  initContactForm();
});

/* ═══════════════════════════════════════════════════════════
   1. CUSTOM CURSOR
   ═══════════════════════════════════════════════════════════ */
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let dotX = 0, dotY = 0, ringX = 0, ringY = 0;
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  }, { passive: true });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Expand ring on interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea, .project-item, .skill-group');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}

/* ═══════════════════════════════════════════════════════════
   2. NAV — sticky + mobile drawer
   ═══════════════════════════════════════════════════════════ */
function initNav() {
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  if (burger && drawer) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      drawer.classList.toggle('open');
      document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   3. TYPING EFFECT
   ═══════════════════════════════════════════════════════════ */
function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Full-Stack Web Developer',
    'MERN Stack Specialist',
    'Automation QA Enthusiast',
    'Software Engineering Undergraduate',
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const phrase = phrases[phraseIdx];
    el.textContent = deleting
      ? phrase.slice(0, charIdx - 1)
      : phrase.slice(0, charIdx + 1);

    deleting ? charIdx-- : charIdx++;

    let delay = deleting ? 35 : 70;

    if (!deleting && charIdx > phrase.length) {
      delay = 2000;
      deleting = true;
    } else if (deleting && charIdx < 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      charIdx = 0;
      delay = 380;
    }

    setTimeout(tick, delay);
  }

  setTimeout(tick, 800);
}

/* ═══════════════════════════════════════════════════════════
   4. SCROLL REVEAL — IntersectionObserver with direction variants
   ═══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  // Elements that slide up (default)
  const upSelectors = [
    '.section-label', '.section-h2',
    '.about-lead', '.about-text', '.about-facts',
    '.skill-group', '.project-item', '.tl-item',
  ];

  // Elements that slide in from the left
  const leftSelectors = ['.about-heading-col', '.contact-left'];

  // Elements that slide in from the right
  const rightSelectors = ['.about-body-col', '.contact-right'];

  // Elements that scale in
  const scaleSelectors = ['.hero-stat-card', '.ticker-wrap'];

  function tag(selectors, extraClass) {
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, i) => {
        el.classList.add('reveal-item');
        if (extraClass) el.classList.add(extraClass);
        // Grid stagger — override transition-delay for staggered siblings
        if (['skill-group', 'project-item', 'tl-item'].some(c => el.classList.contains(c))) {
          el.style.transitionDelay = `${(i % 6) * 0.09}s`;
        }
      });
    });
  }

  tag(upSelectors, null);
  tag(leftSelectors, 'from-left');
  tag(rightSelectors, 'from-right');
  tag(scaleSelectors, 'scale-in');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal-item').forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════
   5. CONTACT FORM
   ═══════════════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('f-name')?.value.trim();
    const email = document.getElementById('f-email')?.value.trim();
    const subject = document.getElementById('f-subject')?.value.trim();
    const message = document.getElementById('f-message')?.value.trim();

    if (!name || !email || !message) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    const btn = form.querySelector('.cform-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.textContent = 'Send Message';
      btn.disabled = false;
      showStatus(`Message sent, ${name}! I'll be in touch soon.`, 'success');
    }, 1400);
  });

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className = `form-status ${type}`;
    setTimeout(() => { status.className = 'form-status'; }, 7000);
  }
}

/* ═══════════════════════════════════════════════════════════
   6. ACTIVE NAV — highlight current section link
   ═══════════════════════════════════════════════════════════ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));
}

/* ═══════════════════════════════════════════════════════════
   7. EXTRA ANIMATIONS — parallax tilt + page-load class
   ═══════════════════════════════════════════════════════════ */
function initAnimations() {
  // Hero image — subtle mouse parallax tilt
  const frame = document.querySelector('.hero-img-frame');
  const heroCol = document.querySelector('.hero-image-col');

  if (frame && heroCol) {
    heroCol.addEventListener('mousemove', e => {
      const rect = heroCol.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;
      frame.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg)`;
    }, { passive: true });

    heroCol.addEventListener('mouseleave', () => {
      frame.style.transform = '';
    });
  }

  // Skill tags — staggered fade on hover inside group
  document.querySelectorAll('.skill-group').forEach(group => {
    const tags = group.querySelectorAll('.skill-tags span');
    group.addEventListener('mouseenter', () => {
      tags.forEach((tag, i) => {
        tag.style.transition = `all 0.2s ease ${i * 0.04}s`;
        tag.style.color = 'var(--paper)';
        tag.style.borderColor = 'var(--border-2)';
      });
    });
    group.addEventListener('mouseleave', () => {
      tags.forEach(tag => {
        tag.style.color = '';
        tag.style.borderColor = '';
      });
    });
  });

  // Project image — reveal overlay on hover
  document.querySelectorAll('.project-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      const frame = item.querySelector('.project-img-frame');
      if (frame) frame.style.transform = 'scale(1.02)';
    });
    item.addEventListener('mouseleave', () => {
      const frame = item.querySelector('.project-img-frame');
      if (frame) frame.style.transform = '';
    });
  });
}