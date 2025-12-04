(function () {
  "use strict";
  const toggleScrolled = function () {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  };

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  const select = (selector, all = false) => {
    if (!selector) return null;
    return all ? Array.from(document.querySelectorAll(selector)) : document.querySelector(selector);
  };

  const on = (event, selector, handler, all = false) => {
    const el = select(selector, all);
    if (!el) return;
    if (all) el.forEach(node => node.addEventListener(event, handler));
    else el.addEventListener(event, handler);
  };

  const onScroll = (el, handler) => {
    if (!el) return;
    el.addEventListener('scroll', handler);
  };

  const debounce = (fn, wait = 20) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  const header = select('#header');
  if (!header) {
    document.removeEventListener('scroll', toggleScrolled);
    window.removeEventListener('load', toggleScrolled);
  } else {
    window.addEventListener('load', toggleScrolled, { passive: true });
    document.addEventListener('scroll', toggleScrolled, { passive: true });
  }
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToggle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToggle);
  }

  document.querySelectorAll('#navMenu a').forEach(navMenu => {
    navMenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToggle();
      }
    });

  });

  document.querySelectorAll('.navMenu .toggle-dropdown').forEach(navMenu => {
    navMenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  function setFooterYear() {
    var y = document.getElementById('footer-year');
    if (y) y.textContent = new Date().getFullYear();
  }
  window.addEventListener('load', setFooterYear);
  (function () { var y = document.getElementById('footer-year'); if (y) y.textContent = new Date().getFullYear(); })();
  window.addEventListener('load', aosInit);
}());