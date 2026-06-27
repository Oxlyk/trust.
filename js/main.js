const navHamburger = document.querySelector('.nav-hamburger');
const navLinks = document.querySelector('.nav-links');

if (navHamburger && navLinks) {
  navHamburger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-open');
  });
}

const sizeButtons = document.querySelectorAll('.size-btn');
if (sizeButtons.length) {
  sizeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      sizeButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
}

const filterPills = document.querySelectorAll('.filter-pill');
const shopCards = document.querySelectorAll('.shop-grid .drop-card');
if (filterPills.length && shopCards.length) {
  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((item) => item.classList.remove('active'));
      pill.classList.add('active');

      const selectedFilter = pill.dataset.filter;
      shopCards.forEach((card) => {
        const matches = selectedFilter === 'all' || card.dataset.color === selectedFilter;
        card.style.display = matches ? 'block' : 'none';
      });
    });
  });
}

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minsEl = document.getElementById('mins');
const secsEl = document.getElementById('secs');
if (daysEl && hoursEl && minsEl && secsEl) {
  const targetDate = new Date('2026-07-15T00:00:00').getTime();

  const updateCountdown = () => {
    const now = Date.now();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.innerText = 'Drop is live!';
      hoursEl.innerText = 'Drop is live!';
      minsEl.innerText = 'Drop is live!';
      secsEl.innerText = 'Drop is live!';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((distance / (1000 * 60)) % 60);
    const secs = Math.floor((distance / 1000) % 60);

    daysEl.innerText = String(days).padStart(2, '0');
    hoursEl.innerText = String(hours).padStart(2, '0');
    minsEl.innerText = String(mins).padStart(2, '0');
    secsEl.innerText = String(secs).padStart(2, '0');
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const setupEmailForm = ({ inputId, buttonId, confirmId, confirmMessage }) => {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);
  const confirmEl = confirmId ? document.getElementById(confirmId) : null;

  if (!input || !button) {
    return;
  }

  button.addEventListener('click', () => {
    if (emailRegex.test(input.value.trim())) {
      button.innerText = "You're on the list.";
      button.disabled = true;
      if (confirmEl && confirmMessage) {
        confirmEl.innerText = confirmMessage;
      }
      return;
    }

    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 500);
  });
};

setupEmailForm({
  inputId: 'email-input',
  buttonId: 'email-submit'
});

setupEmailForm({
  inputId: 'drops-email-input',
  buttonId: 'drops-submit',
  confirmId: 'drops-confirm',
  confirmMessage: "You're on the list. We'll reach out before the drop."
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') {
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});
