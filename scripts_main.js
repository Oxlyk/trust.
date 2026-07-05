(function () {
  const isMobile = window.innerWidth < 768;
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loader-fill');
  const sceneIndicator = document.getElementById('scene-indicator');
  const dots = Array.from(document.querySelectorAll('.dot'));

  function revealApp() {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.75,
      ease: 'power2.out',
      onComplete: () => {
        loader.remove();
        document.body.classList.add('ready');
      }
    });
  }

  function initLoader() {
    gsap.to(loaderFill, { width: '100%', duration: 2, ease: 'power2.inOut' });
  }

  function initDesktop() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const canvas = document.getElementById('c');
    TrustScene.start(canvas).then(() => {
      TrustUI.setupPanelScrollAnimations();
      TrustUI.setupNavbarBlur();

      ScrollTrigger.create({
        trigger: '#scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        onUpdate: (self) => {
          TrustScene.proxy.progress = self.progress;
          updateProgressUI(self.progress);
        }
      });

      bindProgressDots();
      setTimeout(revealApp, 2000);
    });
  }

  function updateProgressUI(progress) {
    const index = Math.min(4, Math.floor(progress * 5));
    sceneIndicator.textContent = String(index + 1).padStart(2, '0') + ' / 05';
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function bindProgressDots() {
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const targetP = i / 4;
        gsap.to(window, {
          scrollTo: { y: maxScroll * targetP, autoKill: false },
          duration: 1,
          ease: 'power2.inOut'
        });
      });
    });
  }

  function initMobile() {
    document.getElementById('c').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('scroll-container').style.display = 'none';
    document.getElementById('progress-nav').style.display = 'none';

    TrustUI.setupMobileFallbackUI();

    setTimeout(revealApp, 2000);
  }

  initLoader();
  if (isMobile) {
    initMobile();
  } else {
    initDesktop();
  }
})();