const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'map-editor-tutorial.html'), 'utf8');
const document = new JSDOM(html).window.document;

test('prose colons keep a non-breaking space before them', () => {
  assert.match(html, /depth\u00A0:/);
  assert.match(html, /click here\u00A0:/);
  assert.match(html, /https:\/\/youtu\.be\/brkR8vVeSMg/);
  for (const node of document.querySelectorAll('main code, main pre')) {
    assert.equal(node.textContent.includes('\u00A0:'), false, node.textContent);
  }
});

test('generated HTML contains the current navigation code', () => {
  assert.equal(document.querySelector('script:not([src])').textContent.trim(),
    fs.readFileSync(path.join(root, 'navigation.js'), 'utf8').trim());
});

test('IDs are unique and every local fragment and TOC entry resolves', () => {
  const ids = [...document.querySelectorAll('[id]')].map(node => node.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const link of document.querySelectorAll('a[href^="#"]')) {
    assert.ok(document.getElementById(decodeURIComponent(link.hash.slice(1))), link.outerHTML);
  }
  const headings = [...document.querySelectorAll('main h2[id], main h3[id], main h4[id]')];
  for (const selector of ['#sidebar-nav', '#toc-nav']) {
    assert.deepEqual([...document.querySelectorAll(selector + ' a')].map(a => decodeURIComponent(a.hash.slice(1))), headings.map(h => h.id));
  }
  assert.equal(document.querySelectorAll('h1').length, 1);
});

test('local scripts, styles, images and CSS font references exist', () => {
  for (const element of document.querySelectorAll('[src], link[href]')) {
    const url = element.getAttribute('src') || element.getAttribute('href');
    assert.ok(fs.existsSync(path.resolve(root, url)), url);
    if (url.endsWith('.css')) {
      const css = fs.readFileSync(path.resolve(root, url), 'utf8');
      for (const match of css.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)) {
        if (match[1].startsWith('data:')) continue;
        assert.ok(fs.existsSync(path.resolve(root, path.dirname(url), match[1].split('?')[0])), match[1]);
      }
    }
  }
});

test('content images reserve space and heading icons have empty alternative text', () => {
  for (const img of document.querySelectorAll('main img')) {
    assert.ok(Number(img.getAttribute('width')) > 0, img.outerHTML);
    assert.ok(Number(img.getAttribute('height')) > 0, img.outerHTML);
    assert.ok(img.hasAttribute('alt'), img.outerHTML);
  }
  for (const img of document.querySelectorAll('h2 img, h3 img, h4 img, nav img')) {
    assert.equal(img.getAttribute('alt'), '');
  }
});

// jsdom does not render layout. Supply explicit geometry to exercise the
// generated script's decisions; these tests do not replace browser visual QA.
function setup(t, options = {}) {
  const dom = new JSDOM(html, { url: options.url ?? 'https://example.test/tutorial.html', runScripts: 'outside-only' });
  t.after(() => dom.window.close());
  const w = dom.window;
  const d = w.document;
  const headings = [...d.querySelectorAll('main h2[id], main h3[id], main h4[id]')];
  const sidebar = d.querySelector('.sidebar');
  const oc = d.getElementById('tocOffcanvas');
  const mobileBody = oc.querySelector('.offcanvas-body');
  const btn = d.getElementById('btnTop');
  const frames = [];
  const pageScrolls = [];
  const elementScrolls = [];
  const media = { matches: options.desktop ?? true, addEventListener: (_, fn) => { media.change = fn; } };
  w.matchMedia = query => query === '(prefers-reduced-motion: reduce)'
    ? { matches: options.reducedMotion ?? false } : media;
  w.requestAnimationFrame = fn => frames.push(fn);
  w.scrollY = options.scrollY ?? 0;
  w.innerHeight = 800;
  Object.defineProperty(d.documentElement, 'scrollHeight', { value: headings.length * 1000 + 1000 });
  let navbarHeight = 64;
  let hover = false;
  d.querySelector('.navbar').getBoundingClientRect = () => ({ top: 0, bottom: navbarHeight, height: navbarHeight });
  const getComputedStyle = w.getComputedStyle.bind(w);
  w.getComputedStyle = element => {
    const style = getComputedStyle(element);
    if (element === headings[0]) style.scrollMarginTop = (navbarHeight + 16) + 'px';
    return style;
  };
  let observedResize;
  w.ResizeObserver = class {
    constructor(callback) { observedResize = callback; }
    observe() {}
  };
  headings.forEach((heading, index) => {
    heading.getBoundingClientRect = () => ({ top: 200 + index * 1000 - w.scrollY });
  });
  for (const container of [sidebar, mobileBody]) {
    Object.defineProperty(container, 'clientHeight', { value: 400 });
    container.getBoundingClientRect = () => ({ top: 80, bottom: 480 });
    container.querySelectorAll('a').forEach((link, index) => {
      link.getBoundingClientRect = () => ({ top: 88 + index * 40 - container.scrollTop, bottom: 120 + index * 40 - container.scrollTop });
    });
  }
  sidebar.matches = selector => selector === ':hover' && hover;
  w.HTMLElement.prototype.scrollIntoView = function (options) { elementScrolls.push({ element: this, options }); };
  w.scrollTo = options => pageScrolls.push(options);
  let hideCount = 0;
  w.bootstrap = { Offcanvas: { getInstance: () => ({ hide: () => { hideCount++; } }) } };
  w.eval(d.querySelector('script:not([src])').textContent);
  return {
    w, d, headings, sidebar, oc, mobileBody, btn, media, pageScrolls, elementScrolls,
    flush() { while (frames.length) frames.shift()(); },
    scroll(y) { w.scrollY = y; w.dispatchEvent(new w.Event('scroll')); this.flush(); },
    active() { return decodeURIComponent(d.querySelector('#sidebar-nav [aria-current="location"]').hash.slice(1)); },
    resizeHeader(height) { navbarHeight = height; observedResize(); },
    hover(value) { hover = value; },
    hideCount() { return hideCount; },
    click(link, extra = {}) {
      const event = new w.MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...extra });
      link.dispatchEvent(event);
      return event;
    }
  };
}

test('page scrolling follows sections without scrolling the document or hidden mobile menu', t => {
  const app = setup(t);
  app.scroll(25200);
  assert.equal(app.active(), app.headings[25].id);
  assert.ok(app.sidebar.scrollTop > 0);
  assert.equal(app.mobileBody.scrollTop, 0);
  assert.deepEqual(app.pageScrolls, []);
  assert.deepEqual(app.elementScrolls, []);
  assert.equal(app.d.querySelectorAll('[aria-current="location"]').length, 2);
});

test('scrolling within one section leaves a manually positioned contents menu alone', t => {
  const app = setup(t);
  app.scroll(25200);
  app.sidebar.scrollTop = 0;
  app.scroll(25300);
  assert.equal(app.sidebar.scrollTop, 0);
});

test('auto-follow yields while the sidebar is hovered or keyboard-focused', t => {
  const app = setup(t);
  app.hover(true);
  app.scroll(25200);
  assert.equal(app.sidebar.scrollTop, 0);
  app.hover(false);
  app.sidebar.querySelector('a').focus();
  app.scroll(26200);
  assert.equal(app.sidebar.scrollTop, 0);
});

test('wrapped/zoomed header height controls both layout offset and active section', t => {
  const app = setup(t);
  app.scroll(10100); // section 10 is 100px below viewport top
  assert.equal(app.active(), app.headings[9].id);
  app.resizeHeader(120);
  assert.equal(app.d.documentElement.style.getPropertyValue('--nav-height'), '120px');
  assert.equal(app.active(), app.headings[10].id);
});

test('last section becomes active at the bottom even when it cannot reach the header', t => {
  const app = setup(t);
  app.headings.at(-1).getBoundingClientRect = () => ({ top: 500 });
  app.scroll(app.d.documentElement.scrollHeight - app.w.innerHeight);
  assert.equal(app.active(), app.headings.at(-1).id);
});

test('back-to-top initializes on restored/deep scroll and is disabled at the top', t => {
  const app = setup(t, { scrollY: 1200 });
  assert.equal(app.btn.disabled, false);
  assert.equal(app.btn.classList.contains('show'), true);
  app.click(app.btn);
  assert.equal(app.pageScrolls[0].top, 0);
  assert.equal(app.d.activeElement, app.d.querySelector('.navbar a'));
  app.scroll(0);
  assert.equal(app.btn.disabled, true);
  assert.equal(app.btn.classList.contains('show'), false);
});

test('opening the mobile menu reveals its active link once without moving the page', t => {
  const app = setup(t, { desktop: false, scrollY: 25200 });
  assert.equal(app.sidebar.scrollTop, 0);
  assert.equal(app.mobileBody.scrollTop, 0);
  app.oc.dispatchEvent(new app.w.Event('shown.bs.offcanvas'));
  assert.ok(app.mobileBody.scrollTop > 0);
  app.mobileBody.scrollTop = 0;
  app.scroll(26200);
  assert.equal(app.mobileBody.scrollTop, 0);
  assert.deepEqual(app.elementScrolls, []);
});

test('mobile navigation waits for menu closure, then focuses and preserves fragment history', t => {
  const app = setup(t, { desktop: false });
  const link = app.oc.querySelectorAll('a')[25];
  app.oc.classList.add('show');
  assert.equal(app.click(link).defaultPrevented, true);
  app.flush();
  assert.equal(app.hideCount(), 1);
  assert.equal(app.w.location.hash, '');
  app.oc.classList.remove('show');
  app.oc.dispatchEvent(new app.w.Event('hidden.bs.offcanvas'));
  app.flush();
  assert.equal(app.w.location.hash, link.hash);
  assert.equal(app.w.history.length, 2);
  assert.equal(app.d.activeElement, app.headings[25]);
  // Selecting the existing fragment should re-scroll without a new history entry.
  app.oc.classList.add('show');
  app.click(link);
  app.oc.dispatchEvent(new app.w.Event('hidden.bs.offcanvas'));
  app.flush();
  assert.equal(app.w.history.length, 2);
  assert.equal(app.elementScrolls.at(-1).element, app.headings[25]);
});

test('modified mobile link clicks keep native browser behavior', t => {
  const app = setup(t, { desktop: false });
  app.oc.classList.add('show');
  const link = app.oc.querySelector('a');
  // Avoid jsdom scheduling its own synthetic navigation after our listener.
  link.addEventListener('click', event => event.preventDefault());
  app.click(link, { ctrlKey: true });
  app.click(link, { metaKey: true });
  app.click(link, { button: 1 });
  assert.equal(app.hideCount(), 0);
});

test('switching to desktop dismisses an open mobile menu', t => {
  const app = setup(t, { desktop: false });
  app.media.matches = true;
  app.media.change();
  assert.equal(app.hideCount(), 1);
});

test('opening a deep URL leaves native instant fragment navigation in control', t => {
  const fragment = '#section-73-img-srcmap-editor-imageslayer_item_deletepng--delete';
  const app = setup(t, { url: 'file:///C:/Users/Anwender/Documents/GitHub/oeuf-map-eggitor-tutorial/map-editor-tutorial.html' + fragment });
  assert.ok(app.d.getElementById(fragment.slice(1)));
  app.w.dispatchEvent(new app.w.Event('load'));
  app.w.dispatchEvent(new app.w.Event('pageshow'));
  app.flush();
  assert.equal(app.w.getComputedStyle(app.d.documentElement).scrollBehavior, 'auto');
  assert.equal(app.w.location.hash, fragment);
  assert.deepEqual(app.elementScrolls, []);
  assert.deepEqual(app.pageScrolls, []);
});

test('in-document links explicitly scroll smoothly and retain fragment history', async t => {
  const app = setup(t);
  const link = app.sidebar.querySelectorAll('a')[12];
  assert.equal(app.click(link).defaultPrevented, true);
  assert.equal(app.w.location.hash, link.hash);
  assert.equal(app.w.history.length, 2);
  assert.equal(app.elementScrolls.at(-1).options.behavior, 'smooth');
  assert.equal(app.elementScrolls.at(-1).element, app.headings[12]);
  app.click(link);
  assert.equal(app.w.history.length, 2);
  const back = new Promise(resolve => app.w.addEventListener('popstate', resolve, { once: true }));
  app.w.history.back();
  await back;
  assert.equal(app.w.location.hash, '');
  const forward = new Promise(resolve => app.w.addEventListener('popstate', resolve, { once: true }));
  app.w.history.forward();
  await forward;
  assert.equal(app.w.location.hash, link.hash);
  assert.equal(app.elementScrolls.length, 2); // History does not start another animation.
});

test('in-document scrolling respects reduced motion', t => {
  const app = setup(t, { reducedMotion: true, scrollY: 1200 });
  app.click(app.sidebar.querySelectorAll('a')[12]);
  assert.equal(app.elementScrolls.at(-1).options.behavior, 'instant');
  app.click(app.btn);
  assert.equal(app.pageScrolls.at(-1).behavior, 'instant');
});

test('mobile navigation works with bundled Bootstrap body locking and closing events', async t => {
  const app = setup(t, { desktop: false });
  app.w.eval(fs.readFileSync(path.join(root, 'vendor/bootstrap/js/bootstrap.bundle.min.js'), 'utf8'));
  const instance = app.w.bootstrap.Offcanvas.getOrCreateInstance(app.oc);
  const shown = new Promise(resolve => app.oc.addEventListener('shown.bs.offcanvas', resolve, { once: true }));
  instance.show();
  await shown;
  assert.equal(app.d.body.style.overflow, 'hidden');
  const hidden = new Promise(resolve => app.oc.addEventListener('hidden.bs.offcanvas', resolve, { once: true }));
  const link = app.oc.querySelectorAll('a')[12];
  app.click(link);
  assert.equal(app.w.location.hash, '');
  await hidden;
  app.flush();
  assert.equal(app.d.body.style.overflow, '');
  assert.equal(decodeURIComponent(app.w.location.hash.slice(1)), app.headings[12].id);
  assert.equal(app.d.activeElement, app.headings[12]);
});
