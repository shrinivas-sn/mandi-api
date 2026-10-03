#!/usr/bin/env node
// Checks what a site actually ships to crawlers, for any stack.
//   Build:  node scripts/verify-seo.mjs --dist dist
//   Live:   node scripts/verify-seo.mjs --live https://www.example.com
// Errors exit 1 (add --report-only to never fail). Warnings never fail.

import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

const TITLE_MAX = 60;
const DESCRIPTION_MIN = 50;
const DESCRIPTION_MAX = 160;
const IMAGE_KB = 300;
const ONE_PER_PAGE = ['og:title', 'og:description', 'og:type', 'og:url', 'og:image', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
const ATTRS = String.raw`((?:[^>"']|"[^"]*"|'[^']*')*)`;
const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decode(text) {
  return text.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (entity, code) => {
    if (code[0] !== '#') return NAMED[code.toLowerCase()] ?? entity;
    const point = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
    return point <= 0x10ffff ? String.fromCodePoint(point) : entity;
  });
}

function decodePath(text) {
  try {
    return decodeURIComponent(text);
  } catch {
    return text;
  }
}

function attributes(source) {
  const out = {};
  for (const [, name, double, single, bare] of source.matchAll(/([^\s"'=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    out[name.toLowerCase()] = decode(double ?? single ?? bare ?? '');
  }
  return out;
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b${ATTRS}>`, 'gi'))].map((match) => attributes(match[1]));
}

function normalize(link) {
  try {
    const url = new URL(link);
    const path = url.pathname.replace(/\/index\.html?$/i, '/').replace(/(.)\/+$/, '$1');
    return `${url.protocol}//${url.host.toLowerCase()}${path}${url.search}`;
  } catch {
    return link;
  }
}

export function parsePage(html) {
  const jsonLd = [];
  const markup = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(new RegExp(`<script\\b${ATTRS}>([\\s\\S]*?)</script\\s*>`, 'gi'), (_, attrs, body) => {
      if ((attributes(attrs).type || '').toLowerCase() === 'application/ld+json') jsonLd.push(body);
      return '';
    })
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, '');
  const head = markup.match(/<head\b[^>]*>([\s\S]*?)<\/head\s*>/i);
  const headHtml = head ? head[1] : markup;
  const bodyHtml = head ? markup.slice(head.index + head[0].length) : markup;
  const metas = tags(headHtml, 'meta');
  const anchors = tags(bodyHtml, 'a');
  return {
    lang: (tags(markup, 'html')[0] || {}).lang || '',
    // Head only: an inline SVG's <title> in the body is not a page title.
    titles: [...headHtml.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/gi)].map((match) => decode(match[1]).trim()),
    meta: (key) => metas.filter((meta) => (meta.property ?? meta.name ?? '').toLowerCase() === key).map((meta) => (meta.content ?? '').trim()),
    canonicals: tags(headHtml, 'link')
      .filter((link) => (link.rel || '').toLowerCase().split(/\s+/).includes('canonical'))
      .map((link) => (link.href ?? '').trim()),
    jsonLd,
    h1Count: tags(bodyHtml, 'h1').length,
    hrefs: anchors.map((anchor) => anchor.href).filter((href) => href !== undefined),
    ids: new Set([...tags(markup, '[a-z][a-z0-9-]*').map((tag) => tag.id), ...anchors.map((anchor) => anchor.name)].filter(Boolean)),
    images: tags(bodyHtml, 'img').map((image) => image.src).filter(Boolean),
  };
}

export function checkPage(html, { url, home }) {
  const page = parsePage(html);
  const errors = [];
  const warnings = [];
  const notes = [];
  let duplicated = false;
  const single = (label, values) => {
    if (values.length > 1) {
      errors.push(`${values.length} ${label} (expected 1)`);
      duplicated = true;
    }
    return values[0];
  };

  const title = single('<title> tags', page.titles);
  if (!title) errors.push('no title');
  else if (title.length > TITLE_MAX) warnings.push(`title is ${title.length} characters; Google shows about ${TITLE_MAX}`);

  const description = single('meta descriptions', page.meta('description'));
  if (!description) errors.push('no meta description');
  else if (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX) {
    warnings.push(`description is ${description.length} characters; aim for ${DESCRIPTION_MIN}-${DESCRIPTION_MAX}`);
  }

  const canonical = single('canonical tags', page.canonicals);
  if (!canonical) errors.push('no canonical tag');
  else if (normalize(canonical) !== normalize(url)) errors.push(`canonical points to ${canonical}, not to this page`);

  for (const key of ONE_PER_PAGE) single(`${key} tags`, page.meta(key));
  if (duplicated) notes.push('Duplicate tags usually mean the HTML shell carries page tags that the head manager never replaces.');

  const ogUrl = page.meta('og:url')[0];
  if (ogUrl && canonical && normalize(ogUrl) !== normalize(canonical)) errors.push(`og:url (${ogUrl}) differs from the canonical`);

  for (const key of ['og:image', 'twitter:image']) {
    const image = page.meta(key)[0];
    if (image && !/^https?:\/\//i.test(image)) errors.push(`${key} must be an absolute URL, got ${image}`);
  }
  if (!page.meta('og:image')[0]) warnings.push('no og:image, so link previews show no picture');

  const robots = [...page.meta('robots'), ...page.meta('googlebot')].join(',').toLowerCase();
  if (/\bnoindex\b/.test(robots)) errors.push('marked noindex but listed in the sitemap');

  page.jsonLd.forEach((block, index) => {
    try {
      JSON.parse(block);
    } catch (err) {
      errors.push(`JSON-LD block ${index + 1} is not valid JSON (${err.message})`);
    }
  });
  if (home && page.jsonLd.length === 0) warnings.push('no JSON-LD on the home page (WebSite, Person or Organization)');

  if (page.h1Count !== 1) warnings.push(`${page.h1Count} <h1> elements (expected 1)`);
  if (!page.lang) warnings.push('no lang attribute on <html>');

  const root = normalize(new URL('/', url).href);
  const links = page.hrefs.map((href) => URL.canParse(href, url) && new URL(href, url)).filter(Boolean);
  if (!home && !links.some((link) => normalize(link.href) === root)) warnings.push('no link back to the home page');

  const missing = [...new Set(page.hrefs
    .filter((href) => href.startsWith('#') && href.length > 1)
    .map((href) => decodePath(href.slice(1)))
    .filter((id) => !page.ids.has(id)))];
  if (missing.length) warnings.push(`in-page links to anchors that do not exist here: ${missing.slice(0, 5).map((id) => `#${id}`).join(', ')}`);

  return { url, errors, warnings, notes, title, description, images: page.images };
}

function parseRobots(text) {
  const sitemaps = [];
  let agents = [];
  let inRules = false;
  let blocksAll = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const field = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    if (field === 'sitemap') sitemaps.push(value);
    else if (field === 'user-agent') {
      if (inRules) agents = [];
      inRules = false;
      agents.push(value);
    } else if (field === 'allow' || field === 'disallow') {
      inRules = true;
      if (field === 'disallow' && value === '/' && agents.includes('*')) blocksAll = true;
    }
  }
  return { sitemaps, blocksAll };
}

function parseSitemap(xml) {
  const isIndex = /<sitemapindex\b/i.test(xml);
  const field = (block, name) => decode((block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`, 'i')) || [])[1]?.trim() ?? '');
  const entries = [...xml.matchAll(new RegExp(`<${isIndex ? 'sitemap' : 'url'}\\b[^>]*>([\\s\\S]*?)</${isIndex ? 'sitemap' : 'url'}>`, 'gi'))]
    .map((match) => ({ loc: field(match[1], 'loc'), lastmod: field(match[1], 'lastmod') }))
    .filter((entry) => entry.loc);
  return { isIndex, entries };
}

async function readSitemaps(get, roots) {
  const entries = [];
  const queue = [...roots];
  let found = 0;
  while (queue.length) {
    const res = await get(queue.shift());
    if (res.status !== 200) continue;
    found += 1;
    const sitemap = parseSitemap(res.text);
    if (sitemap.isIndex) queue.push(...sitemap.entries.map((entry) => entry.loc));
    else entries.push(...sitemap.entries);
  }
  return { entries, found };
}

async function audit({ target, origin, get, probe404, imageSize, imageKb }) {
  const site = { errors: [], warnings: [] };

  const robots = await get(`${origin}/robots.txt`);
  let roots = [];
  if (robots.status === 200) {
    const parsed = parseRobots(robots.text);
    if (parsed.blocksAll) site.errors.push('robots.txt blocks the whole site (Disallow: / for every crawler)');
    if (parsed.sitemaps.length) roots = parsed.sitemaps;
    else site.warnings.push('robots.txt does not name a sitemap');
  } else {
    site.warnings.push('no robots.txt');
  }

  const tried = roots.length ? roots : [`${origin}/sitemap.xml`];
  let sitemaps = await readSitemaps(get, tried);
  if (!roots.length && !sitemaps.found) {
    tried.push(`${origin}/sitemap-index.xml`);
    sitemaps = await readSitemaps(get, tried.slice(-1));
  }
  const { entries } = sitemaps;
  if (!sitemaps.found) site.errors.push(`no sitemap found (looked for ${tried.map((url) => new URL(url).pathname).join(', ')})`);
  else if (entries.length === 0) site.errors.push('the sitemap lists no URLs');

  const undated = entries.filter((entry) => !entry.lastmod).length;
  if (undated) site.warnings.push(`${undated} of ${entries.length} sitemap URLs have no <lastmod>`);

  const pages = [];
  const seen = new Set();
  for (const { loc } of entries) {
    if (seen.has(normalize(loc))) continue;
    seen.add(normalize(loc));
    const issue = (message) => pages.push({ url: loc, errors: [message], warnings: [], notes: [] });
    if (!URL.canParse(loc)) {
      issue('sitemap entry is not an absolute URL');
      continue;
    }
    const res = await get(loc);
    if (res.status >= 300 && res.status < 400) issue(`redirects to ${res.location}; list the final URL in the sitemap`);
    else if (res.status === 404) issue('listed in the sitemap but not found (404)');
    else if (res.status !== 200) issue(`returns status ${res.status || res.error}`);
    else pages.push(checkPage(res.text, { url: loc, home: new URL(loc).pathname === '/' }));
  }

  const missing404 = await probe404();
  if (missing404) site.errors.push(missing404);

  for (const field of ['title', 'description']) {
    const byValue = new Map();
    for (const page of pages) if (page[field]) byValue.set(page[field], [...(byValue.get(page[field]) || []), page.url]);
    for (const [value, urls] of byValue) {
      if (urls.length > 1) site.warnings.push(`same ${field} on ${urls.length} pages: "${value}" (${urls.join(', ')})`);
    }
  }

  if (imageSize) {
    const reported = new Set();
    for (const page of pages) {
      for (const src of page.images || []) {
        if (!URL.canParse(src, page.url)) continue;
        const image = new URL(src, page.url);
        if (image.origin !== new URL(page.url).origin || reported.has(image.pathname)) continue;
        reported.add(image.pathname);
        const bytes = imageSize(image.pathname);
        if (bytes > imageKb * 1024) site.warnings.push(`${image.pathname} is ${(bytes / 1024).toFixed(0)} KB (budget ${imageKb} KB)`);
      }
    }
  }

  return { target, site, pages };
}

function fileFor(root, pathname) {
  const clean = decodePath(pathname);
  const candidates = clean.endsWith('/')
    ? [join(root, clean, 'index.html')]
    : [join(root, clean), join(root, clean, 'index.html'), join(root, `${clean}.html`)];
  return candidates.find((file) => (file === root || file.startsWith(root + sep)) && existsSync(file) && statSync(file).isFile());
}

export function runBuild({ dist, imageKb = IMAGE_KB }) {
  const root = resolve(dist);
  // Sitemap URLs carry the production domain; files are found by path alone.
  const get = async (url) => {
    const file = fileFor(root, new URL(url).pathname);
    return file ? { status: 200, text: readFileSync(file, 'utf8') } : { status: 404, text: '' };
  };
  return audit({
    target: `build ${dist}`,
    origin: 'http://build.local',
    get,
    probe404: async () => (existsSync(join(root, '404.html')) ? null : 'no 404.html in the build, so unknown URLs cannot return a real 404'),
    imageSize: (pathname) => {
      const file = fileFor(root, pathname);
      return file ? statSync(file).size : 0;
    },
    imageKb,
  });
}

function liveGetter(fetchImpl) {
  return async (url) => {
    try {
      const res = await fetchImpl(url, { redirect: 'manual', headers: { 'user-agent': 'Mozilla/5.0 (compatible; verify-seo)' } });
      return { status: res.status, text: res.status === 200 ? await res.text() : '', location: res.headers.get('location') || '' };
    } catch (err) {
      return { status: 0, text: '', location: '', error: err.message };
    }
  };
}

export async function hostChecks(site, fetchImpl = fetch) {
  const url = new URL(site);
  if (url.hostname === 'localhost' || !url.hostname.includes('.') || /^[\d.]+$/.test(url.hostname)) return [];
  const get = liveGetter(fetchImpl);
  const warnings = [];
  if (url.protocol === 'https:') {
    const plain = await get(`http://${url.host}/`);
    if (!(plain.status >= 300 && plain.status < 400 && plain.location.startsWith('https://'))) {
      warnings.push(`http://${url.host}/ does not redirect to https (status ${plain.status})`);
    }
  }
  const other = url.hostname.startsWith('www.') ? url.hostname.slice(4) : `www.${url.hostname}`;
  const alt = await get(`${url.protocol}//${other}/`);
  if (alt.status === 200) warnings.push(`${other} serves the site instead of redirecting to ${url.hostname}`);
  return warnings;
}

export async function runLive({ site, fetchImpl = fetch }) {
  const origin = new URL(site).origin;
  const get = liveGetter(fetchImpl);
  const result = await audit({
    target: `live ${origin}`,
    origin,
    get,
    probe404: async () => {
      const res = await get(`${origin}/__verify-seo-${Date.now().toString(36)}`);
      if (res.status === 404 || res.status === 410) return null;
      const redirect = res.location ? ` (redirect to ${res.location})` : '';
      return `an unknown URL returned ${res.status}${redirect} instead of 404, so Google sees soft 404s`;
    },
  });
  result.site.warnings.push(...(await hostChecks(site, fetchImpl)));
  return result;
}

export function format(result) {
  const lines = [`verify-seo: ${result.target}, ${result.pages.length} pages from the sitemap`];
  const block = (label, { errors, warnings, notes = [] }) => {
    if (!errors.length && !warnings.length) return;
    lines.push('', label);
    for (const message of errors) lines.push(`  error  ${message}`);
    for (const message of warnings) lines.push(`  warn   ${message}`);
    for (const message of notes) lines.push(`  note   ${message}`);
  };
  block('Site', result.site);
  for (const page of result.pages) block(page.url, page);
  const all = [result.site, ...result.pages];
  const errors = all.reduce((sum, item) => sum + item.errors.length, 0);
  const warnings = all.reduce((sum, item) => sum + item.warnings.length, 0);
  lines.push('', `${errors} ${errors === 1 ? 'error' : 'errors'}, ${warnings} ${warnings === 1 ? 'warning' : 'warnings'}.`);
  return { text: lines.join('\n'), errors, warnings };
}

const USAGE = 'Usage: verify-seo --dist <dir> | --live <url> [--report-only] [--image-kb 300]';

export async function main(argv = process.argv.slice(2)) {
  let values;
  try {
    ({ values } = parseArgs({
      args: argv,
      options: {
        dist: { type: 'string' },
        live: { type: 'string' },
        'report-only': { type: 'boolean', default: false },
        'image-kb': { type: 'string' },
      },
    }));
  } catch (err) {
    console.error(`${err.message}\n${USAGE}`);
    return 2;
  }
  if (Boolean(values.dist) === Boolean(values.live)) {
    console.error(USAGE);
    return 2;
  }
  const result = values.dist
    ? await runBuild({ dist: values.dist, imageKb: Number(values['image-kb'] ?? IMAGE_KB) })
    : await runLive({ site: values.live });
  const report = format(result);
  console.log(report.text);
  if (report.errors && !values['report-only']) {
    console.log('Failing on the errors above. Pass --report-only to report without failing.');
    return 1;
  }
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = await main();
}
