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

  /* ── Scroll spy ───────────────────────────────────
   * The "active" class starts out hardcoded on Home in the markup; nothing
   * moved it, so Home stayed lit no matter where you were on the page.
   */

  const navLinks = Array.from(document.querySelectorAll('#navMenu a[href^="#"]'));
  const spyTargets = navLinks
    .map(link => ({ link: link, section: document.querySelector(link.getAttribute('href')) }))
    .filter(target => target.section);

  // While a click-triggered smooth scroll is in flight we ignore scroll events,
  // otherwise every section it passes over lights up on the way there.
  let spyLockedUntil = 0;

  function setActiveLink(active) {
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link === active);
    });
  }

  function syncActiveLink() {
    if (!spyTargets.length || Date.now() < spyLockedUntil) return;

    const header = document.querySelector('#header');
    // Header height shifts between its scrolled and unscrolled states, so read
    // it live and add a small buffer to clear the sections' scroll-margin-top.
    const line = window.scrollY + (header ? header.offsetHeight : 0) + 24;
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    // The last section can be shorter than the viewport, so its top may never
    // cross the line. At the bottom of the page it's the current one regardless.
    let current = spyTargets[0];
    if (atBottom) {
      current = spyTargets[spyTargets.length - 1];
    } else {
      spyTargets.forEach(function (target) {
        const top = target.section.getBoundingClientRect().top + window.scrollY;
        if (top <= line) current = target;
      });
    }

    setActiveLink(current.link);
  }

  document.querySelectorAll('#navMenu a').forEach(navMenu => {
    navMenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToggle();
      }
      if (navMenu.getAttribute('href') && navMenu.getAttribute('href').charAt(0) === '#') {
        setActiveLink(navMenu);
        spyLockedUntil = Date.now() + 700;
      }
    });
  });

  window.addEventListener('load', syncActiveLink);
  document.addEventListener('scroll', syncActiveLink, { passive: true });
  window.addEventListener('resize', debounce(syncActiveLink, 100), { passive: true });

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
    // Respect users who prefer reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  /* ── GitHub Projects ─────────────────────────────── */

  const GITHUB_USER = 'Vexelior';
  const PROJECTS_CONTAINER_ID = 'projects-container';
  const PROJECTS_DATA_URL = 'assets/data/projects.json';

  /**
   * Language → vendored Devicon logo (assets/img/lang/*.svg), in the language's
   * official brand colours.
   */
  const langIcons = {
    JavaScript: 'javascript',
    TypeScript: 'typescript',
    HTML: 'html5',
    CSS: 'css3',
    Python: 'python',
    'C#': 'csharp',
    Java: 'java',
    Shell: 'bash',
    Go: 'go',
    Rust: 'rust',
    PHP: 'php',
    Ruby: 'ruby',
    'C++': 'cplusplus',
    C: 'c',
  };

  /**
   * Fallback dot colours for languages with no vendored logo — GitHub's own
   * linguist colours, to match the brand-accurate icons above.
   */
  const langColors = {
    Kotlin: '#A97BFF',
    Swift: '#F05138',
    Dart: '#00B4AB',
    Vue: '#41B883',
    Svelte: '#FF3E00',
    PowerShell: '#012456',
    'Jupyter Notebook': '#DA5B0B',
    SCSS: '#C6538C',
    Lua: '#000080',
    Dockerfile: '#384D54',
    Makefile: '#427819',
    Batchfile: '#C1F12E',
  };

  /**
   * Build a single project-card element from a GitHub repo object.
   * Re-uses the existing .project-card / .project-tags classes.
   */
  function buildProjectCard(repo, delay) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String(delay));

    const header = document.createElement('div');
    header.className = 'project-card-header';
    header.innerHTML = '<i class="bi bi-folder2-open project-icon"></i>';

    const links = document.createElement('div');
    links.className = 'project-links';

    // Private repos ship without a URL — a link would 404 for visitors.
    if (repo.html_url) {
      const ghLink = document.createElement('a');
      ghLink.href = repo.html_url;
      ghLink.target = '_blank';
      ghLink.rel = 'noopener noreferrer';
      ghLink.setAttribute('aria-label', 'View ' + repo.name + ' on GitHub');
      ghLink.innerHTML = '<i class="bi bi-github"></i>';
      links.appendChild(ghLink);
    }

    if (repo.homepage) {
      const liveLink = document.createElement('a');
      liveLink.href = repo.homepage;
      liveLink.target = '_blank';
      liveLink.rel = 'noopener noreferrer';
      liveLink.setAttribute('aria-label', 'View live site');
      liveLink.innerHTML = '<i class="bi bi-box-arrow-up-right"></i>';
      links.appendChild(liveLink);
    }

    header.appendChild(links);
    card.appendChild(header);

    const title = document.createElement('h3');
    title.textContent = formatRepoName(repo.name);
    card.appendChild(title);

    const desc = document.createElement('p');
    desc.textContent = repo.description || 'No description provided.';
    card.appendChild(desc);

    const tags = document.createElement('div');
    tags.className = 'project-tags';

    if (repo.language) {
      const lang = document.createElement('span');
      lang.className = 'project-lang';
      const slug = langIcons[repo.language];

      if (slug) {
        // Brand colours are built for light backgrounds — Rust's mark has no
        // fill at all and renders black, bash's is near-black. The tile keeps
        // every logo legible on the dark card without recolouring it.
        const chip = document.createElement('span');
        chip.className = 'lang-chip';

        const icon = document.createElement('img');
        icon.className = 'lang-icon';
        icon.src = 'assets/img/lang/' + slug + '.svg';
        icon.alt = '';
        icon.width = 13;
        icon.height = 13;
        icon.decoding = 'async';

        chip.appendChild(icon);
        lang.appendChild(chip);
      } else {
        const dot = document.createElement('span');
        dot.className = 'lang-dot';
        dot.style.background = langColors[repo.language] || '#a6947e';
        lang.appendChild(dot);
      }

      lang.appendChild(document.createTextNode(repo.language));
      tags.appendChild(lang);
    }

    (repo.topics || []).slice(0, 5).forEach(function (topic) {
      const t = document.createElement('span');
      t.textContent = topic;
      tags.appendChild(t);
    });

    if (repo.stargazers_count > 0) {
      const star = document.createElement('span');
      star.innerHTML = '<i class="bi bi-star-fill"></i> ' + repo.stargazers_count;
      tags.appendChild(star);
    }

    card.appendChild(tags);
    return card;
  }

  /** Convert "My-Repo-Name" → "My Repo Name" */
  function formatRepoName(name) {
    return name.replace(/[-_]/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  /** Render all project cards into the container */
  function renderProjects(repos) {
    var container = document.getElementById(PROJECTS_CONTAINER_ID);
    if (!container) return;
    container.innerHTML = '';

    if (!repos.length) {
      container.innerHTML =
        '<p class="projects-empty">No public repositories found.</p>';
      return;
    }

    repos.forEach(function (repo, i) {
      if (repo.name.toLowerCase().includes('vexelior.github.io')) {
        return;
      }
      container.appendChild(buildProjectCard(repo, 100 + i * 100));
    });

    if (typeof AOS !== 'undefined') AOS.refreshHard();
  }

  /** Fall back to the public API if the generated data file isn't there yet */
  function fetchPublicRepos() {
    return fetch('https://api.github.com/users/' + GITHUB_USER + '/repos?sort=updated&per_page=30')
      .then(function (res) {
        if (!res.ok) throw new Error('GitHub API responded with ' + res.status);
        return res.json();
      })
      .then(function (data) {
        return data.filter(function (r) { return !r.fork; });
      });
  }

  /**
   * Load projects from the data file built by .github/workflows/update-projects.yml,
   * which includes private repos tagged with the opt-in topic.
   */
  function fetchGitHubProjects() {
    var container = document.getElementById(PROJECTS_CONTAINER_ID);
    if (!container) return;

    fetch(PROJECTS_DATA_URL, { cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('projects.json responded with ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!Array.isArray(data) || !data.length) throw new Error('projects.json is empty');
        return data;
      })
      .catch(fetchPublicRepos)
      .then(function (repos) {
        renderProjects(
          repos.sort(function (a, b) { return new Date(b.pushed_at) - new Date(a.pushed_at); })
        );
      })
      .catch(function (err) {
        console.error('Failed to load GitHub projects:', err);
        container.innerHTML =
          '<p class="projects-error">' +
          '<i class="bi bi-exclamation-triangle"></i> ' +
          'Unable to load projects. Please visit ' +
          '<a href="https://github.com/' + GITHUB_USER + '" target="_blank" rel="noopener noreferrer">my GitHub</a> directly.' +
          '</p>';
      });
  }

  window.addEventListener('load', fetchGitHubProjects);

  /* ── /GitHub Projects ──────────────────────────────── */

  function setFooterYear() {
    var y = document.getElementById('footer-year');
    if (y) y.textContent = new Date().getFullYear();
  }
  window.addEventListener('load', setFooterYear);
  window.addEventListener('load', aosInit);
}());