(function () {
  function setupPanelScrollAnimations() {
    const panelTweens = [
      ['panel-1', 0.02, 0.18],
      ['panel-2', 0.22, 0.38],
      ['panel-3', 0.42, 0.58],
      ['panel-4', 0.62, 0.78]
    ];

    function panelTween(id, inP, outP) {
      const el = document.getElementById(id);
      gsap.set(el, { opacity: 0, y: 16 });

      ScrollTrigger.create({
        trigger: '#scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          let o = 0;
          let y = 16;

          const inEnd = inP + 0.04;
          const outStart = outP - 0.04;

          if (p >= inP && p <= inEnd) {
            const t = (p - inP) / (inEnd - inP);
            o = t;
            y = 16 * (1 - t);
          } else if (p > inEnd && p < outStart) {
            o = 1;
            y = 0;
          } else if (p >= outStart && p <= outP) {
            const t = (p - outStart) / (outP - outStart);
            o = 1 - t;
            y = 16 * t;
          }

          gsap.set(el, { opacity: o, y });
        }
      });
    }

    panelTweens.forEach(([id, a, b]) => panelTween(id, a, b));

    const panel5 = document.getElementById('panel-5');
    gsap.set(panel5, { opacity: 0, y: 16, xPercent: -50 });
    ScrollTrigger.create({
      trigger: '#scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        const start = 0.82;
        const end = 0.9;
        let o = 0;
        let y = 16;

        if (p >= start) {
          const t = Math.min((p - start) / (end - start), 1);
          o = t;
          y = 16 * (1 - t);
        }

        gsap.set(panel5, { opacity: o, y, xPercent: -50 });
      }
    });
  }

  function setupNavbarBlur() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  function setupMobileFallbackUI() {
    const mobile = document.getElementById('mobile-fallback');
    const navbar = document.getElementById('navbar');
    const sceneIndicator = document.getElementById('scene-indicator');

    mobile.style.display = 'block';
    navbar.style.opacity = '1';
    navbar.style.visibility = 'visible';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('in');
      });
    }, { threshold: 0.2 });

    const sections = Array.from(document.querySelectorAll('.m-section'));
    sections.forEach((sec) => observer.observe(sec));

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);

      let idx = 0;
      const center = window.scrollY + window.innerHeight * 0.45;
      sections.forEach((s, i) => {
        const top = s.offsetTop;
        const bottom = top + s.offsetHeight;
        if (center >= top && center < bottom) idx = i;
      });

      sceneIndicator.textContent = String(idx + 1).padStart(2, '0') + ' / 05';
    }, { passive: true });
  }

  window.TrustUI = {
    setupPanelScrollAnimations,
    setupNavbarBlur,
    setupMobileFallbackUI
  };
})();