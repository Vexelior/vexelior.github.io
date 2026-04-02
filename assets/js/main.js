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

  /** Hardcoded projects that aren't on the GitHub API (e.g. private repos, external apps) */
  var pinnedProjects = [
    {
      title: 'Finent',
      description:
        'A personal budgeting web application built with .NET 9 and ASP.NET Core MVC, following Clean Architecture principles. BudgetTracker helps you manage income and expenses using the 50/30/20 budget rule, visualize pay periods with an interactive payday calendar, and know exactly how much to set aside from each paycheck.',
      liveUrl: 'https://budgetwithfinent.com',
      language: 'C#',
    },
  ];

  /** Build a card from a pinned-project object */
  function buildPinnedCard(project, delay) {
    var card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String(delay));

    var header = document.createElement('div');
    header.className = 'project-card-header';
    header.innerHTML = '<i class="bi bi-folder2-open project-icon"></i>';

    var links = document.createElement('div');
    links.className = 'project-links';

    if (project.repoUrl) {
      var ghLink = document.createElement('a');
      ghLink.href = project.repoUrl;
      ghLink.target = '_blank';
      ghLink.rel = 'noopener noreferrer';
      ghLink.setAttribute('aria-label', 'View ' + project.title + ' on GitHub');
      ghLink.innerHTML = '<i class="bi bi-github"></i>';
      links.appendChild(ghLink);
    }

    if (project.liveUrl) {
      var liveLink = document.createElement('a');
      liveLink.href = project.liveUrl;
      liveLink.target = '_blank';
      liveLink.rel = 'noopener noreferrer';
      liveLink.setAttribute('aria-label', 'View live site');
      liveLink.innerHTML = '<i class="bi bi-box-arrow-up-right"></i>';
      links.appendChild(liveLink);
    }

    header.appendChild(links);
    card.appendChild(header);

    var title = document.createElement('h3');
    title.textContent = project.title;
    card.appendChild(title);

    var desc = document.createElement('p');
    desc.textContent = project.description;
    card.appendChild(desc);

    var tags = document.createElement('div');
    tags.className = 'project-tags';

    if (project.language) {
      var lang = document.createElement('span');
      var color = langColors[project.language] || '#ccc';
      lang.innerHTML =
        '<span class="lang-dot" style="background:' + color + '"></span> ' +
        project.language;
      tags.appendChild(lang);
    }

    (project.tags || []).forEach(function (t) {
      var tag = document.createElement('span');
      tag.textContent = t;
      tags.appendChild(tag);
    });

    card.appendChild(tags);
    return card;
  }

  /** Render all project cards into the container */
  function renderProjects(repos) {
    var container = document.getElementById(PROJECTS_CONTAINER_ID);
    if (!container) return;
    container.innerHTML = '';

    // 1 — Pinned / hardcoded projects first
    pinnedProjects.forEach(function (project, i) {
      container.appendChild(buildPinnedCard(project, 100 + i * 100));
    });

    // 2 — API repos (skip portfolio repo itself)
    var delay = 100 + pinnedProjects.length * 100;
    repos.forEach(function (repo) {
      if (repo.name.toLowerCase().includes('vexelior.github.io')) return;
      container.appendChild(buildProjectCard(repo, delay));
      delay += 100;
    });

    if (!pinnedProjects.length && !repos.length) {
      container.innerHTML =
        '<p class="projects-empty">No public repositories found.</p>';
      return;
    }

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
        // Still show pinned projects even if the API fails
        renderProjects([]);
        var errMsg = document.createElement('p');
        errMsg.className = 'projects-error';
        errMsg.innerHTML =
          '<i class="bi bi-exclamation-triangle"></i> ' +
          'Unable to load remaining projects. Please visit ' +
          '<a href="https://github.com/' + GITHUB_USER + '" target="_blank" rel="noopener noreferrer">my GitHub</a> directly.';
        container.appendChild(errMsg);
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