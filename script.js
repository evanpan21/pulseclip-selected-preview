const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupReveal() {
  const items = document.querySelectorAll('.reveal');
  if (isReducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  items.forEach((item) => observer.observe(item));
}

function setupFaq() {
  document.querySelectorAll('.faq-item button').forEach((button) => {
    button.addEventListener('click', () => {
      const answer = document.getElementById(button.getAttribute('aria-controls'));
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      answer.hidden = expanded;
    });
  });
}

function setupWaitlistForm(form) {
  const input = form.querySelector('input[type="email"]');
  const status = form.querySelector('.form-status');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = input.value.trim().toLowerCase();
    input.value = email;
    status.dataset.state = '';

    if (!email || !input.checkValidity()) {
      status.textContent = 'Enter a valid email address.';
      status.dataset.state = 'error';
      input.focus();
      return;
    }

    const endpoint = form.dataset.endpoint?.trim();
    if (!endpoint) {
      status.textContent = 'This preview is not collecting emails yet.';
      status.dataset.state = 'error';
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    const previousLabel = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending…';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'pulseclip-wix' }),
      });
      if (!response.ok) throw new Error('Request failed');
      status.textContent = 'You are on the PulseClip list.';
      status.dataset.state = 'success';
      form.reset();
    } catch {
      status.textContent = 'Something went wrong. Please try again.';
      status.dataset.state = 'error';
    } finally {
      button.disabled = false;
      button.textContent = previousLabel;
    }
  });
}

function setupGallery() {
  const track = document.querySelector('[data-gallery-track]');
  if (!track) return;
  const move = (direction) => track.scrollBy({ left: direction * Math.max(track.clientWidth * 0.82, 320), behavior: isReducedMotion ? 'auto' : 'smooth' });
  document.querySelector('[data-gallery-prev]')?.addEventListener('click', () => move(-1));
  document.querySelector('[data-gallery-next]')?.addEventListener('click', () => move(1));
}

setupReveal();
setupFaq();
setupGallery();
document.querySelectorAll('.waitlist-form').forEach(setupWaitlistForm);
