document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.navbar-collapse');
  const toggle = document.querySelector('.navbar-toggler');

  // Bootstrap handles this when available; this keeps the menu functional offline.
  if (toggle && nav && !window.bootstrap) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('show');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.querySelectorAll('.navbar-collapse .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (nav?.classList.contains('show') && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(nav).hide();
      } else if (nav?.classList.contains('show')) {
        nav.classList.remove('show');
        toggle?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  const header = document.querySelector('.site-header');
  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 28);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  const motionSelectors = [
    '.section-heading', '.academy-about .row', '.offer-grid article', '.programme-card',
    '.industry-card', '.sector-cta .container', '.why-grid article', '.services-cta .container',
    '.client-panels .row', '.academy-section .row', '.final-cta .container', '.site-footer .row',
    '.about-story .row', '.values-grid article', '.product-card', '.product-cta .container',
    '.contact-info', '.quote-form'
  ];
  const motionItems = document.querySelectorAll(motionSelectors.join(','));

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    motionItems.forEach((item) => item.classList.add('motion-item'));
    document.querySelectorAll('.offer-grid, .programme-grid, .industry-grid, .why-grid, .values-grid, .product-grid').forEach((group) => {
      group.classList.add('motion-stagger');
      [...group.children].forEach((child, index) => child.style.setProperty('--motion-index', index));
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('motion-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -45px' });
    motionItems.forEach((item) => observer.observe(item));
  } else {
    motionItems.forEach((item) => item.classList.add('motion-visible'));
  }

  const result = document.querySelector('#pestResult');
  document.querySelectorAll('.pest-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.pest-card').forEach((item) => item.classList.remove('active'));
      card.classList.add('active');
      if (result) result.textContent = `${card.dataset.pest} selected — request an assessment and our team will recommend the right treatment.`;
    });
  });

  const quoteForm = document.querySelector('#quoteForm');
  const productParam = new URLSearchParams(window.location.search).get('product');
  if (quoteForm && productParam) {
    const service = quoteForm.querySelector('[name="service"]');
    const message = quoteForm.querySelector('[name="message"]');
    if (service) service.value = 'Product Information';
    if (message) message.value = `I would like information about ${productParam}.`;
  }
  quoteForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const required = [...quoteForm.querySelectorAll('[required]')];
    required.forEach((field) => field.classList.toggle('is-invalid', !field.checkValidity()));
    const status = quoteForm.querySelector('.form-status');
    if (required.some((field) => !field.checkValidity())) {
      if (status) status.textContent = 'Please complete the required fields before submitting.';
      required.find((field) => !field.checkValidity())?.focus();
      return;
    }
    if (status) status.textContent = 'Thank you — your request has been prepared. Our team will contact you shortly.';
    quoteForm.reset();
  });
});
