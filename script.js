/* ============================================================
   PORTFOLIO SCRIPT — GIHAN BENARAGAMA
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTyping();
  initScrollReveal();
  initContactForm();
  initProjectModal();
});

/* ============================================================
   1. NAVIGATION — sticky scroll + mobile toggle
   ============================================================ */
function initNav() {
  const header = document.querySelector('header');
  const toggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Mobile hamburger toggle
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        toggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }
}

/* ============================================================
   2. TYPING EFFECT — subtitle carousel
   ============================================================ */
function initTyping() {
  const el = document.querySelector('.typing-text');
  if (!el) return;

  const words = JSON.parse(el.getAttribute('data-words') || '[]');
  if (!words.length) return;

  let wordIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const word = words[wordIdx];
    el.textContent = deleting
      ? word.slice(0, charIdx - 1)
      : word.slice(0, charIdx + 1);

    deleting ? charIdx-- : charIdx++;

    let delay = deleting ? 38 : 75;

    if (!deleting && charIdx > word.length) {
      delay = 2000;        // Pause at full word
      deleting = true;
    } else if (deleting && charIdx < 0) {
      deleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      charIdx = 0;
      delay = 400;         // Pause before next word
    }

    setTimeout(tick, delay);
  }

  setTimeout(tick, 800);
}

/* ============================================================
   3. SCROLL REVEAL — IntersectionObserver for staggered reveals
   ============================================================ */
function initScrollReveal() {
  // Add reveal classes programmatically to key elements
  const selectors = [
    { query: '.section-header', cls: 'reveal' },
    { query: '.hero-content', cls: 'reveal' },
    { query: '.hero-visual', cls: 'reveal delay-2' },
    { query: '.about-bio', cls: 'reveal' },
    { query: '.about-info', cls: 'reveal delay-2' },
    { query: '.skills-category-card', cls: 'reveal' },
    { query: '.project-card', cls: 'reveal' },
    { query: '.timeline-item', cls: 'reveal' },
    { query: '.contact-info', cls: 'reveal' },
    { query: '.contact-form-wrap', cls: 'reveal delay-2' },
  ];

  selectors.forEach(({ query, cls }) => {
    document.querySelectorAll(query).forEach((el, i) => {
      // Apply delay for grid children (skills, projects, timeline items)
      const isGrid = ['skills-category-card', 'project-card', 'timeline-item'].some(c => el.classList.contains(c));
      const delayClass = isGrid ? `delay-${Math.min(i % 4 + 1, 6)}` : '';

      cls.split(' ').forEach(c => el.classList.add(c));
      if (delayClass) el.classList.add(delayClass);
    });
  });

  // Observe and reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-left').forEach(el => observer.observe(el));
}

/* ============================================================
   4. CONTACT FORM — validation + success feedback
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertBox = document.getElementById('form-status');
  if (!form || !alertBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('f-name')?.value.trim();
    const email   = document.getElementById('f-email')?.value.trim();
    const subject = document.getElementById('f-subject')?.value.trim();
    const message = document.getElementById('f-message')?.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showAlert('Please fill in all required fields.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showAlert('Please enter a valid email address.', 'error');
      return;
    }

    const btn = form.querySelector('.form-submit-btn');
    const btnText = btn.querySelector('span');
    btnText.textContent = 'Sending…';
    btn.disabled = true;

    // Simulate async send
    setTimeout(() => {
      form.reset();
      btnText.textContent = 'Send Message';
      btn.disabled = false;
      showAlert(`Thank you, ${name}! Your message has been received. I'll be in touch shortly.`, 'success');
    }, 1400);
  });

  function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert-box ${type}`;
    alertBox.style.display = 'block';
    setTimeout(() => {
      alertBox.style.display = 'none';
    }, 6000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

/* ============================================================
   5. PROJECT DETAILS MODAL — Dynamic detail popups
   ============================================================ */
function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalBody = modal?.querySelector('.modal-body');
  const closeBtn = modal?.querySelector('.modal-close');
  const detailsBtns = document.querySelectorAll('.project-details-btn');

  if (!modal || !modalBody || !closeBtn) return;

  // Open modal
  detailsBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.project-card');
      if (!card) return;

      const imgSrc = card.querySelector('.project-thumbnail img')?.getAttribute('src') || '';
      const imgAlt = card.querySelector('.project-thumbnail img')?.getAttribute('alt') || 'Project screenshot';
      const headerHtml = card.querySelector('.project-header')?.innerHTML || '';
      const titleText = card.querySelector('.project-title')?.textContent || '';
      const introText = card.querySelector('.project-intro-text')?.textContent || '';
      const bulletsHtml = card.querySelector('.project-bullets')?.innerHTML || '';
      const tagsHtml = card.querySelector('.project-tags')?.innerHTML || '';
      
      // Select project links (we filter out class/styling to keep modal standard)
      const linksHtml = card.querySelector('.project-links')?.innerHTML || '';

      // Set content
      modalBody.innerHTML = `
        <div class="modal-project-content">
          <div class="modal-project-img-wrap" style="height: 250px; border-radius: 12px; overflow: hidden; margin-bottom: 1.5rem; border: 1px solid var(--border);">
            <img src="${imgSrc}" alt="${imgAlt}" style="width: 100%; height: 100%; object-fit: cover; object-position: top center;">
          </div>
          <div class="project-header" style="margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
            ${headerHtml}
          </div>
          <h3 class="project-title" style="margin-bottom: 1rem; color: #fff; font-family: var(--font-heading); font-size: 1.6rem; font-weight: 700;">${titleText}</h3>
          <p class="project-intro-text" style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.95rem; line-height: 1.7;">${introText}</p>
          
          <h4 style="color: #fff; font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem; font-family: var(--font-heading);">Key Features & Contributions</h4>
          <ul class="project-bullets">
            ${bulletsHtml}
          </ul>
          
          <div class="project-tags" style="margin-top: 1.5rem; margin-bottom: 1.5rem;">
            ${tagsHtml}
          </div>
          
          ${linksHtml ? `
            <div class="project-links" style="margin-top: 1.5rem; padding-top: 1rem;">
              ${linksHtml}
            </div>
          ` : ''}
        </div>
      `;

      // Open Modal
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    });
  });

  // Close modal functions
  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  closeBtn.addEventListener('click', closeModal);

  // Close when clicking overlay backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
