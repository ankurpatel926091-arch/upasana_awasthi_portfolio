/* ==========================================================================
   Upasana Awasthi - Framer Motion & Interactive Script
   Spring Physics, Staggered Reveals, 3D Tilt & Micro-Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Framer Motion Scroll & Entry Engine
  initMotionAnimations();

  // 2. 3D Interactive Card Tilt (Framer Motion style)
  initMotionCardTilt();

  // 3. Mobile Navigation Drawer
  initMobileNav();

  // 4. Active Navigation Link on Scroll
  initScrollSpy();
});

/* ==========================================================================
   Framer Motion Engine (with Fallback for Offline / CDN failure)
   ========================================================================== */
function initMotionAnimations() {
  const hasMotionCDN = typeof window.Motion !== 'undefined';

  // A. Staggered Hero Section Entry
  const heroItems = document.querySelectorAll('[data-motion-group="stagger-up"] [data-motion-item]');
  if (heroItems.length > 0) {
    if (hasMotionCDN && window.Motion.animate) {
      window.Motion.animate(
        heroItems,
        { opacity: [0, 1], y: [30, 0] },
        { delay: window.Motion.stagger(0.12), duration: 0.7, easing: [0.16, 1, 0.3, 1] }
      );
    } else {
      heroItems.forEach((item, index) => {
        item.classList.add('motion-init');
        setTimeout(() => {
          item.classList.add('motion-visible');
        }, 120 + index * 120);
      });
    }
  }

  // B. Hero Profile Card Scale-In
  const profileCard = document.querySelector('[data-motion="scale-in"]');
  if (profileCard) {
    if (hasMotionCDN && window.Motion.animate) {
      window.Motion.animate(
        profileCard,
        { opacity: [0, 1], scale: [0.92, 1] },
        { delay: 0.25, duration: 0.8, easing: [0.34, 1.56, 0.64, 1] }
      );
    } else {
      profileCard.classList.add('motion-scale');
      setTimeout(() => {
        profileCard.classList.add('motion-visible');
      }, 250);
    }
  }

  // C. Scroll-triggered Animations (Framer Motion inView equivalent)
  const scrollElements = [
    { selector: '[data-motion="reveal-title"]', effect: 'fade-up' },
    { selector: '[data-motion="slide-right"]', effect: 'slide-right' },
    { selector: '[data-motion="slide-left"]', effect: 'slide-left' },
    { selector: '[data-motion="fade-up"]', effect: 'fade-up' },
    { selector: '[data-motion="card-lift"]', effect: 'fade-up' },
    { selector: '[data-motion-card]', effect: 'stagger-card' }
  ];

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;

          if (hasMotionCDN && window.Motion.animate) {
            const effect = target.dataset.motion || 'fade-up';
            if (effect === 'slide-right') {
              window.Motion.animate(target, { opacity: [0, 1], x: [-35, 0] }, { duration: 0.65, easing: [0.16, 1, 0.3, 1] });
            } else if (effect === 'slide-left') {
              window.Motion.animate(target, { opacity: [0, 1], x: [35, 0] }, { duration: 0.65, easing: [0.16, 1, 0.3, 1] });
            } else {
              window.Motion.animate(target, { opacity: [0, 1], y: [28, 0] }, { duration: 0.65, easing: [0.16, 1, 0.3, 1] });
            }
          } else {
            target.classList.add('motion-visible');
          }

          obs.unobserve(target);
        }
      });
    }, observerOptions);

    // Register all observe targets
    document.querySelectorAll('[data-motion="reveal-title"], [data-motion="slide-right"], [data-motion="slide-left"], [data-motion="fade-up"], [data-motion="card-lift"], [data-motion-card]').forEach((el, index) => {
      if (el.dataset.motion === 'slide-right') {
        el.classList.add('motion-slide-right');
      } else if (el.dataset.motion === 'slide-left') {
        el.classList.add('motion-slide-left');
      } else {
        el.classList.add('motion-init');
      }
      observer.observe(el);
    });

  } else {
    // If IntersectionObserver is not supported, reveal immediately
    document.querySelectorAll('.motion-init, .motion-slide-right, .motion-slide-left').forEach(el => {
      el.classList.add('motion-visible');
    });
  }
}

/* ==========================================================================
   3D Spring Mouse Tilt (Framer Motion Interactive Perspective)
   ========================================================================== */
function initMotionCardTilt() {
  const card = document.querySelector('[data-motion="tilt-card"]');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
}

/* ==========================================================================
   Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('nav');
  const navItems = document.querySelectorAll('.nav-item');

  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      mobileToggle.classList.toggle('active');
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        nav.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   Active Navigation Link on Scroll
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav a[href*="${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });
}

/* ==========================================================================
   Clipboard Copy Helper with Toast Notification
   ========================================================================== */
function copyContact(text, message) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(message || 'Copied to clipboard!');
    }).catch(() => {
      fallbackCopy(text, message);
    });
  } else {
    fallbackCopy(text, message);
  }
}

function fallbackCopy(text, message) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  tempInput.style.position = 'fixed';
  tempInput.style.left = '-9999px';
  document.body.appendChild(tempInput);
  tempInput.focus();
  tempInput.select();

  try {
    document.execCommand('copy');
    showToast(message || 'Copied to clipboard!');
  } catch (err) {
    showToast('Failed to copy, please copy manually.');
  }
  document.body.removeChild(tempInput);
}

/* ==========================================================================
   Toast Popup Notification
   ========================================================================== */
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* ==========================================================================
   Contact Form Handler (Direct Mailto with feedback)
   ========================================================================== */
function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showToast('Please fill all required fields.');
    return;
  }

  const emailTo = 'upasanaa948@gmail.com';
  const mailSubject = encodeURIComponent(`[Portfolio Contact] ${subject} - from ${name}`);
  const mailBody = encodeURIComponent(
    `Hi Upasana,\n\nName: ${name}\nContact: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\nSent from your portfolio website.`
  );

  showToast('Opening your email client...');

  setTimeout(() => {
    window.location.href = `mailto:${emailTo}?subject=${mailSubject}&body=${mailBody}`;
  }, 600);

  event.target.reset();
}
