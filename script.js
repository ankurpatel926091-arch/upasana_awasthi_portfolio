/* ==========================================================================
   Upasana Awasthi - Interactive Portfolio Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('nav');
  const navItems = document.querySelectorAll('.nav-item');

  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      mobileToggle.classList.toggle('active');
    });

    // Close menu on link click
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        nav.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // 2. Active Navigation Highlight on Scroll
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
});

// 3. Copy Contact Info with Toast Notification
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

// 4. Toast Popup Notification
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

// 5. Contact Form Handler (Direct Mailto with feedback)
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
