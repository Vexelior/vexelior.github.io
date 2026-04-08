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

  /** Language → colour map (GitHub-style dot colours) */
  const langColors = {
    JavaScript: '#f1e05a',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Python: '#3572A5',
    'C#': '#178600',
    TypeScript: '#3178c6',
    Java: '#b07219',
    Shell: '#89e051',
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

    const ghLink = document.createElement('a');
    ghLink.href = repo.html_url;
    ghLink.target = '_blank';
    ghLink.rel = 'noopener noreferrer';
    ghLink.setAttribute('aria-label', 'View ' + repo.name + ' on GitHub');
    ghLink.innerHTML = '<i class="bi bi-github"></i>';
    links.appendChild(ghLink);

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
      const color = langColors[repo.language] || '#ccc';
      lang.innerHTML =
        '<span class="lang-dot" style="background:' + color + '"></span> ' +
        repo.language;
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

  /** Fetch public repos from the GitHub API */
  function fetchGitHubProjects() {
    var container = document.getElementById(PROJECTS_CONTAINER_ID);
    if (!container) return;

    fetch('https://api.github.com/users/' + GITHUB_USER + '/repos?sort=updated&per_page=30')
      .then(function (res) {
        if (!res.ok) throw new Error('GitHub API responded with ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var repos = data
          .filter(function (r) { return !r.fork; })
          .sort(function (a, b) { return new Date(b.pushed_at) - new Date(a.pushed_at); });
        renderProjects(repos);
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