/**
 * Builds assets/data/projects.json for the site's Projects section.
 *
 * Runs in CI with a token, so it sees private repos too. Only repos carrying
 * the OPT_IN_TOPIC are published — everything written here becomes public, so
 * a repo must be explicitly tagged to show up. Private repos are emitted
 * without an html_url, since visitors can't open them.
 */

import { mkdir, writeFile } from 'node:fs/promises';

const OPT_IN_TOPIC = 'portfolio';
const OUT_FILE = 'assets/data/projects.json';

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('GITHUB_TOKEN is not set.');
  process.exit(1);
}

async function fetchAllRepos() {
  const repos = [];
  for (let page = 1; ; page++) {
    const res = await fetch(
      'https://api.github.com/user/repos?visibility=all&affiliation=owner&per_page=100&page=' + page,
      {
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    if (!res.ok) {
      throw new Error('GitHub API responded with ' + res.status + ': ' + (await res.text()));
    }

    const batch = await res.json();
    repos.push(...batch);
    if (batch.length < 100) return repos;
  }
}

const all = await fetchAllRepos();

const published = all
  .filter((r) => !r.fork && !r.archived)
  .filter((r) => (r.topics || []).includes(OPT_IN_TOPIC))
  .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
  .map((r) => ({
    name: r.name,
    description: r.description,
    // A private repo's URL 404s for visitors, so omit it and let the card
    // render a "Private" badge instead of a dead GitHub link.
    html_url: r.private ? null : r.html_url,
    homepage: r.homepage,
    language: r.language,
    topics: (r.topics || []).filter((t) => t !== OPT_IN_TOPIC),
    stargazers_count: r.stargazers_count,
    pushed_at: r.pushed_at,
    private: r.private,
  }));

const skipped = all.length - published.length;
console.log(
  `Publishing ${published.length} repo(s) tagged "${OPT_IN_TOPIC}" ` +
    `(${published.filter((r) => r.private).length} private); skipped ${skipped} untagged/fork/archived.`
);

await mkdir('assets/data', { recursive: true });
await writeFile(OUT_FILE, JSON.stringify(published, null, 2) + '\n');
console.log('Wrote ' + OUT_FILE);
