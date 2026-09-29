const fs = require('fs');
const showdown = require('showdown');

let md = fs.readFileSync('map-editor-tutorial.md', 'utf8');

// Strip the h1 — it goes in the navbar instead
md = md.replace(/^#\s+[^\n]+\n\n?/, '');

const converter = new showdown.Converter({
  tables: true,
  ghCompatibleHeaderId: true,
  strikethrough: true,
  simpleLineBreaks: false,
  literalMidWordUnderscores: true,
  parseImgDimensions: true,
});

let body = converter.makeHtml(md);

// Bold shortcuts such as **Ctrl+S** or **Shift+Click (hold)** become keycaps.
// Keyboard keys get <kbd>; mouse actions stay bold. Bold text that isn't
// entirely made of shortcut tokens is left alone, and so is the file format
// section, whose bold single letters are field names rather than keys.
// A shortcut that opens a list item (a line of controls) also gets the editor's
// mouse icons, as in its own hints; shortcuts inside sentences don't.
const KEY = String.raw`Ctrl|Cmd|Shift|Alt|Tab|Space|Enter|Backtick|Number Key|WASD|F1[0-2]|F[1-9]|[A-Z0-9]|\x60|-|=`;
const MOUSE = String.raw`Right-Click|Click|Drag|Scroll Wheel|Wheel`;
const TOKEN = `(?:${KEY}|${MOUSE})`;
const SEP = String.raw`\+| / |, `;
const SUFFIX = String.raw`(?: \(hold\)| while clicking| while dragging| during drag)?`;
const shortcutRe = new RegExp(`^${TOKEN}(?:(?:${SEP})${TOKEN})*${SUFFIX}$`);
const MOUSE_ICONS = { 'Click': 'mouse_left', 'Right-Click': 'mouse_right', 'Wheel': 'mouse_wheel', 'Scroll Wheel': 'mouse_wheel' };
const mouseIcon = name => `<img class="img-inline mouse-icon" src="./map-editor-images/${name}.svg" alt="">`;
const keycap = (text, icons) => text.replace(new RegExp(`(${MOUSE})|(${KEY})`, 'g'), (_, mouse, key) => {
  if (mouse) return (icons && MOUSE_ICONS[mouse] ? mouseIcon(MOUSE_ICONS[mouse]) : '') + `<strong>${mouse}</strong>`;
  if (key === 'WASD') return [...key].map(k => `<kbd>${k}</kbd>`).join('');
  return `<kbd>${key}</kbd>`;
});
// Microsoft's 2004 style manual: don't join mouse actions to keys with "+"
// ("Hold down SHIFT and click", not "SHIFT+click"). Keep "+" for key combos only.
const joinMouse = html => html.replace(/(<\/strong>)\+|\+(?=<img class="img-inline mouse-icon"|<strong>)/g,
  (_, end) => `${end || ''}<span class="join"> and </span>`);
const keycaps = html => html.replace(/(<li>\s*)?<strong>([^<]+)<\/strong>/g,
  (whole, li, text) => shortcutRe.test(text) ? `${li || ''}<span class="shortcut">${joinMouse(keycap(text, !!li))}</span>` : whole);
{
  const spec = body.search(/<h2 id="11-/);
  body = spec < 0 ? keycaps(body) : keycaps(body.slice(0, spec)) + body.slice(spec);
}

// CSS selectors can't start with a digit, so prefix bare-numeric IDs
body = body.replace(/(<h[2-4]\s+id=")(\d)/g, '$1section-$2');

// Heading/inline icons repeat their adjacent labels. Do this after Showdown
// creates IDs so existing bookmarks keep working.
const decorativeImage = tag => /\balt=/.test(tag) ? tag : tag.replace('<img', '<img alt=""');
body = body.replace(/<h[2-4]\b[^>]*>[\s\S]*?<\/h[2-4]>/g,
  heading => heading.replace(/<img\b[^>]*>/g, decorativeImage));
body = body.replace(/<img\b[^>]*\bclass=["'][^"']*\bimg-inline\b[^>]*>/g, decorativeImage);

// --- Extract heading IDs + text for the sidebar (before adding classes) ---
const headings = [];
const headingRe = /<h([2-4])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
let m;
while ((m = headingRe.exec(body)) !== null) {
  const level = parseInt(m[1]);
  const id = m[2];
  const html = m[3].replace(/\s*:\s*$/, '').trim();
  const text = html.replace(/<[^>]+>/g, '').trim();
  headings.push({ level, id, text, html });
}

// --- Light post-processing: just add Bootstrap utility classes to bare tags ---
const defaultImgClasses = ['img-fluid', 'rounded', 'shadow-sm', 'd-block', 'my-3'];
const mergeClasses = (attrText, classesToAdd) => {
  const classRe = /\bclass=(["'])(.*?)\1/i;
  const m = attrText.match(classRe);
  if (!m) {
    return ` class="${classesToAdd.join(' ')}"${attrText}`;
  }

  const existing = m[2].trim().split(/\s+/).filter(Boolean);
  const merged = [...new Set([...existing, ...classesToAdd])];
  return attrText.replace(classRe, `class="${merged.join(' ')}"`);
};

// Reserve the image's aspect ratio before it loads, including screenshots
// whose Markdown only specifies a height. Assets here are PNGs and GIFs.
const reserveImageSize = attrs => {
  const src = attrs.match(/\bsrc=["']([^"']+)["']/)?.[1];
  if (!src || !/^\.\/map-editor-images\/[^/]+\.(png|gif|svg)$/i.test(src)) return attrs;
  const bytes = fs.readFileSync(src);
  if (src.endsWith('.svg')) {
    // The game's icons declare width and height on the root element.
    const root = bytes.toString('utf8').match(/<svg\b[^>]*>/)[0];
    const w = Number(root.match(/\bwidth="([\d.]+)"/)?.[1]);
    const h = Number(root.match(/\bheight="([\d.]+)"/)?.[1]);
    if (!w || !h) throw new Error(`SVG without width/height: ${src}`);
    if (!/\bwidth=/.test(attrs)) attrs += ` width="${Math.round(w)}"`;
    if (!/\bheight=/.test(attrs)) attrs += ` height="${Math.round(h)}"`;
    return attrs;
  }
  const png = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const gif = /^GIF8[79]a$/.test(bytes.toString('ascii', 0, 6));
  if (!png && !gif) throw new Error(`Unsupported image: ${src}`);
  const width = png ? bytes.readUInt32BE(16) : bytes.readUInt16LE(6);
  const height = png ? bytes.readUInt32BE(20) : bytes.readUInt16LE(8);
  const declaredWidth = Number(attrs.match(/\bwidth=["'](\d+)["']/)?.[1]);
  const declaredHeight = Number(attrs.match(/\bheight=["'](\d+)["']/)?.[1]);
  if (!declaredWidth) attrs += ` width="${declaredHeight ? Math.round(width * declaredHeight / height) : width}"`;
  if (!declaredHeight) attrs += ` height="${declaredWidth ? Math.round(height * declaredWidth / width) : height}"`;
  return attrs;
};

body = body
  .replace(/<table(?=[>\s])/g,  '<table class="table table-striped table-bordered"')
  .replace(/<img\b([^>]*)>/g,   (_, attrs) => {
    attrs = reserveImageSize(attrs.replace(/\s*\/\s*$/, ''));
    const isInline = /\bclass=(["'])[^"']*\bimg-inline\b/i.test(attrs);
    return `<img${isInline ? attrs : mergeClasses(attrs, defaultImgClasses)}>`;
  })
  .replace(/<blockquote>/g,     '<blockquote class="blockquote border-start border-3 ps-3 py-1 my-3">')
  .replace(/<blockquote class="blockquote border-start border-3 ps-3 py-1 my-3">/, '<blockquote class="blockquote border-start border-3 ps-3 py-1 my-3 video-callout">')
  .replace(/<pre>/g,            '<pre class="rounded p-3 border">')
  .replace(/<hr\s*\/?>/g,       '<hr class="my-5 opacity-0">')
  .replace(/<h2 /g,             '<h2 tabindex="-1" class="mt-5 mb-3 pb-2 border-bottom" ')
  .replace(/<h3 /g,             '<h3 tabindex="-1" class="mt-4 mb-3" ')
  .replace(/<h4 /g,             '<h4 tabindex="-1" class="mt-3 mb-2 opacity-75" ');

// Message balloons, after the three kinds in Microsoft's style manual.
// In Markdown:  > [!NOTE]  /  > [!WARNING]  /  > [!CAUTION]
const CALLOUTS = { NOTE: ['info', 'Note'], WARNING: ['warning', 'Warning'], CAUTION: ['critical', 'Caution'] };
body = body.replace(/<blockquote class="([^"]*)">\s*<p>\[!(NOTE|WARNING|CAUTION)\]\s*/g, (_, cls, kind) => {
  const [type, label] = CALLOUTS[kind];
  return `<blockquote class="${cls} callout callout-${type}" role="note"><p><span class="callout-label">${label}</span> `;
});

// Headings: put the icon (or, for icon-less h2s, the section number) into a
// glossy tile in front of the title. Runs after the sidebar has been built.
body = body.replace(/(<h([2-4])\b[^>]*>)([\s\S]*?)<\/h\2>/g, (whole, open, level, inner) => {
  const img = inner.match(/<img\b[^>]*>/);
  if (img) {
    const obj = '';
    const text = inner.replace(img[0], '').replace(/\s{2,}/g, ' ').trim();
    return `${open}<span class="h-tile${obj}" aria-hidden="true">${img[0]}</span><span class="h-text">${text}</span></h${level}>`;
  }
  const num = level === '2' && inner.match(/^\s*(\d+)\.\s*([\s\S]*)$/);
  if (num) return `${open}<span class="h-tile h-num" aria-hidden="true">${num[1]}</span><span class="h-text"><span class="visually-hidden">${num[1]}. </span>${num[2].trim()}</span></h2>`;
  return whole;
});


// --- Build sidebar nav links (h2 + h3 + h4) ---
let sidebarHtml = headings
  .filter(h => h.level <= 4)
  .map(h => {
    const cls = h.level === 2 ? 'fw-semibold'
              : h.level === 3 ? 'ms-3 small'
              : 'ms-5 small';
    return `<a class="nav-link py-1 ${cls}" href="#${h.id}">${h.html.replace(/\s*\/>/g, '>')}</a>`;
  }).join('\n');

// The object and trigger-box icons are drawn for the editor's dark UI: colour
// fills and white masses that turn to mush on this pale page. The tutorial uses
// line-art copies drawn like the tool icons instead: plum strokes, no fill.
const LINE_ICON_DIR = 'map-editor-images/line';
const PLUM = '#7d4f76';
const lineIcons = {
  // Object icons: drop every fill, recolour every stroke.
  object: svg => svg
    .replace(/\s*fill-opacity="[^"]*"/g, '')
    .replace(/fill="(?!none")[^"]*"/g, 'fill="none"')
    .replace(/stroke="(?!none")[^"]*"/g, `stroke="${PLUM}"`),
  // Trigger icons: white masses become outlines; black detail becomes plum.
  trigger: svg => svg
    .replace(/<(path|circle|rect|ellipse|polygon)\b([^>]*)>/g, (tag, name, attrs) => {
      if (!/fill="(white|#fff|#ffffff)"/i.test(attrs)) return tag;
      attrs = attrs.replace(/\s*stroke="none"/g, '')
        .replace(/fill="[^"]*"/, `fill="none" stroke="${PLUM}" stroke-width="1.5" vector-effect="non-scaling-stroke"`);
      return `<${name}${attrs}>`;
    })
    .replace(/(fill|stroke)="(black|#000|#000000)"/gi, `$1="${PLUM}"`),
};
fs.mkdirSync(LINE_ICON_DIR, { recursive: true });
const useLineIcons = html => html.replace(/src="\.\/map-editor-images\/((object|trigger)_[^"\/]+\.svg)"/g, (_, file, kind) => {
  const svg = fs.readFileSync(`map-editor-images/${file}`, 'utf8').replace(/<metadata>[\s\S]*?<\/metadata>/, '');
  fs.writeFileSync(`${LINE_ICON_DIR}/${file}`, lineIcons[kind](svg));
  return `src="./${LINE_ICON_DIR}/${file}"`;
});
sidebarHtml = useLineIcons(sidebarHtml);
// Headings: object and trigger icons take the line copies too, on the same
// cyan tile as the tools.
body = body.replace(/<span class="h-tile[^"]*"[^>]*><img\b[^>]*(?:object|trigger)_[^>]*><\/span>/g,
  tile => useLineIcons(tile.replace(' h-tile-obj', '')));

// --- Assemble page ---
const page = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Oeuf Map-Eggitor Tutorial</title>
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="vendor/bootstrap-icons/font/bootstrap-icons.min.css" rel="stylesheet">
  <style>
    :root {
      /* Override Bootstrap: URL fragments must jump immediately on load.
         Only explicit in-page navigation requests smooth scrolling. */
      scroll-behavior: auto;
      --nav-height: 4.5rem;
      --anchor-offset: calc(var(--nav-height) + 1rem);
      --page-bg:       white;
      --chrome:        #c79cba;
      --chrome-light:  #e3c8da;
      --chrome-dark:   #a8789c;
      --plum:          #7d4f76;
      --plum-dark:     #6a3f63;
      --plum-border:   #8a5f80;
      --rule:          #e6d3e1;
      --pane:          #f8f2f9;
      --pink:          #fce4ec;
      --accent:        #56d5eb;
      --accent-light:  #eefbfd;
      --accent-border: #6fb6c6;
      --heading:       #0d2e5f;
      --link:          #0d2e5f;
      --text-color:    #1a1a1a;
      --strong-text-color: rgb(44, 167, 188);
      --font-ui:    Tahoma, Verdana, "Segoe UI", Geneva, sans-serif;
      --font-title: "Trebuchet MS", Tahoma, "Segoe UI", sans-serif;
      --font-mono:  "Lucida Console", Consolas, Monaco, monospace;
      /* Luna gloss: bright top half, a hard midline, a darker lower half. */
      --titlebar: linear-gradient(180deg, #f2dcec 0%, #d9b1cd 8%, #c79cba 45%, #b584a8 55%, #a8789c 100%);
      --gloss-pink: linear-gradient(180deg, #fff 0%, #f6ecf3 48%, #e8d3e2 52%, #f3e6ef 100%);
      --gloss-cyan: linear-gradient(180deg, #fff 0%, #eefbfd 48%, #d2f3f9 52%, #e9f9fc 100%);
      --gloss-plum: linear-gradient(180deg, #c99bbd 0%, #b584a8 48%, #9a6b90 52%, #8e6085 100%);
      --selection:  linear-gradient(180deg, #b584a8, #8e6085);
    }

    body {
      background: var(--page-bg);
      color: var(--text-color);
      font-family: var(--font-ui);
      font-size: .9375rem;
      line-height: 1.6;
    }
    ::selection { background: #d2f3f9; }
    :focus-visible { outline: 2px dotted var(--plum); outline-offset: 2px; }

    /* ── Title bar ── */
    .navbar {
      background: var(--titlebar) !important;
      border-bottom: 1px solid var(--plum);
      box-shadow: 0 2px 4px rgba(60, 30, 55, .2) !important;
      padding-top: .6rem; padding-bottom: .6rem;
    }
    .skip-link { z-index: 1040; }
    .navbar > .container-fluid { flex-wrap: nowrap; gap: 1rem; }
    .navbar-actions { flex-shrink: 0; }
    .navbar-brand {
      font: 700 clamp(1rem, 2.4vw, 1.45rem)/1.25 var(--font-title);
      color: #fff;
      white-space: normal;
      overflow-wrap: anywhere;
      min-width: 0;
      flex: 1;
      margin: 0;
      padding: 0;
      text-shadow: 1px 1px 0 var(--plum-dark), 0 0 6px rgba(90, 40, 80, .5);
    }
    .navbar-brand a { color: inherit; text-decoration: none; display: inline-flex; align-items: center; gap: .6rem; }
    /* The brand mark: the Oeuf egg, with a soft plum drop shadow. */
    .navbar-brand a::before {
      content: "";
      flex: none;
      width: 1.75rem; height: 2.2rem;
      background: url("./map-editor-images/logo_egg.png") center / contain no-repeat;
      filter: drop-shadow(1px 2px 2px rgba(60, 30, 55, .35));
    }
    .navbar-brand:hover, .navbar-brand a:hover { color: #fff; }

    /* XP push buttons */
    .navbar .btn {
      font: 12px/1.4 var(--font-ui);
      color: #3a2236;
      padding: .3rem .8rem;
      border: 1px solid var(--plum-dark);
      border-radius: 3px;
      background: linear-gradient(180deg, #fff 0%, #f7eef4 50%, #ead7e4 100%);
      box-shadow: inset 0 -2px 0 #dcbcd3;
    }
    .navbar .btn:hover { color: #3a2236; border-color: var(--plum-dark); background: linear-gradient(180deg, #fff 0%, #eefbfd 50%, #d2f3f9 100%); box-shadow: inset 0 -2px 0 #9fe6f3; }
    .navbar .btn:active { background: #ead7e4; box-shadow: inset 0 2px 2px rgba(60, 30, 55, .25); }
    .navbar .btn .bi-youtube { color: #c4302b; }

    /* ── Task-pane sidebar ── */
    aside.col-lg-3 {
      background: linear-gradient(180deg, #eadcf0, #d9c6e3);
      border-right: 1px solid #c7aed4;
    }
    @media (min-width: 992px) {
      .sidebar {
        position: sticky;
        top: var(--anchor-offset);
        height: calc(100vh - var(--anchor-offset) - .5rem);
        height: calc(100dvh - var(--anchor-offset) - .5rem);
        overflow-y: auto;
        overscroll-behavior: contain;
        scrollbar-width: thin;
        scrollbar-color: var(--chrome) transparent;
        padding: 1rem .25rem 1rem 0 !important;
      }
    }
    .sidebar > h6 {
      margin: 0 !important;
      padding: .4rem .75rem;
      font: 700 12px var(--font-ui) !important;
      text-transform: none !important;
      color: var(--plum-dark) !important;
      background: linear-gradient(90deg, #fff 0%, #f0dfeb 100%);
      border-radius: 5px 5px 0 0;
      border-bottom: 1px solid #e0cbe0;
    }
    #sidebar-nav {
      background: var(--pane);
      padding: .35rem 0;
      box-shadow: 0 1px 3px rgba(90, 60, 100, .25);
    }
    #sidebar-nav .nav-link, #toc-nav .nav-link {
      color: var(--link);
      font-size: 12.5px;
      line-height: 1.45;
      padding: .2rem .75rem !important;
      border-radius: 0;
      transition: background .15s, color .15s;
    }
    #sidebar-nav .nav-link.ms-3, #toc-nav .nav-link.ms-3 { margin-left: 0 !important; padding-left: 1.4rem !important; }
    #sidebar-nav .nav-link.ms-5, #toc-nav .nav-link.ms-5 { margin-left: 0 !important; padding-left: 2.2rem !important; }
    #sidebar-nav .nav-link.fw-semibold, #toc-nav .nav-link.fw-semibold { font-weight: 700 !important; margin-top: .15rem; }
    #sidebar-nav .nav-link.active, #toc-nav .nav-link.active {
      background: var(--selection);
      color: #fff;
      text-shadow: 0 1px 0 rgba(60, 30, 55, .4);
    }
    #sidebar-nav .nav-link:hover:not(.active), #toc-nav .nav-link:hover:not(.active) {
      background: #dff7fc;
      color: var(--heading);
    }
    #sidebar-nav .nav-link img,
    #tocOffcanvas .nav-link img {
      display: inline-block !important;
      width: auto;
      height: 1.4em !important;
      max-height: 1.4em !important;
      margin-right: .3em;
      vertical-align: -0.4em;
      object-fit: contain;
      box-shadow: none !important;
      border-radius: 0 !important;
      padding: 0 !important;
      background: transparent !important;
    }
    #sidebar-nav .nav-link.active img, #toc-nav .nav-link.active img {
      background: #fff !important;
      border-radius: 3px !important;
    }

    /* ── Offcanvas (mobile contents) ── */
    .offcanvas { --bs-offcanvas-width: 280px; background: linear-gradient(180deg, #eadcf0, #d9c6e3); }
    .offcanvas-header { background: var(--titlebar); border-bottom: 1px solid var(--plum); padding: .6rem 1rem; }
    .offcanvas-title { font: 700 1.1rem var(--font-title); color: #fff; text-shadow: 1px 1px 0 var(--plum-dark); }
    .offcanvas-header .btn-close { background-color: #e0503a; border: 1px solid #fff; border-radius: 3px; opacity: 1; filter: invert(0); --bs-btn-close-bg: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23fff'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e"); }
    .offcanvas-body { overscroll-behavior: contain; }
    #toc-nav { background: var(--pane); padding: .35rem 0; box-shadow: 0 1px 3px rgba(90, 60, 100, .25); }

    /* ── Content ── */
    main { min-width: 0; overflow-wrap: anywhere; }
    /* Keep reading lines to about 75 characters; screenshots, tables and code may run wider. */
    main > :not(p:has(> img.img-fluid)):not(table):not(pre) { max-width: 75ch; }
    main a { color: var(--link); }
    main a:hover { color: var(--plum); }
    main strong { color: var(--strong-text-color); }
    main ul { list-style: square; }
    main li::marker { color: var(--chrome-dark); }

    main h2, main h3, main h4 { display: flex; align-items: center; gap: .7rem; }
    main h2 {
      margin-top: 2.5rem !important;
      padding: 4px 12px 4px 4px !important;
      border: none !important;
      border-radius: 6px;
      background: linear-gradient(90deg, var(--chrome) 0%, #d6b3cb 60%, rgba(255, 255, 255, 0) 100%);
      font: 700 1.5rem/1.2 var(--font-title);
      color: #fff;
      text-shadow: 1px 1px 0 var(--plum);
    }
    main h3 {
      padding-bottom: .4rem;
      border-bottom: 1px solid var(--rule);
      font: 700 1.2rem/1.25 var(--font-title);
      color: var(--heading);
    }
    main h4, main h4.opacity-75 {
      font: 700 1.02rem/1.25 var(--font-title);
      color: var(--plum-dark);
      opacity: 1 !important;
    }

    /* Glossy icon tiles in front of headings (convert.js moves the icon, or
       the h2 section number, into .h-tile). */
    .h-tile {
      flex: none;
      display: inline-flex; align-items: center; justify-content: center;
      width: 40px; height: 40px;
      border-radius: 6px;
      background: var(--gloss-pink);
      border: 1px solid var(--plum-border);
      box-shadow: inset 0 1px 0 #fff, 1px 1px 3px rgba(60, 30, 55, .35);
      font: 700 1.25rem var(--font-title);
      color: var(--plum);
      text-shadow: none;
    }
    main h3 .h-tile, main h4 .h-tile {
      width: 36px; height: 36px;
      border-radius: 5px;
      background: var(--gloss-cyan);
      border-color: var(--accent-border);
      box-shadow: inset 0 1px 0 #fff, 1px 1px 2px rgba(20, 60, 80, .3);
    }
    main .h-tile img, main .h-tile img.img-fluid {
      display: block !important;
      width: 28px !important; height: 28px !important;
      margin: 0 !important; padding: 0 !important;
      max-height: none;
      object-fit: contain;
      border: none !important; border-radius: 0 !important;
      background: transparent !important; box-shadow: none !important;
    }
    main .h-tile img[src$=".png"] { width: 22px !important; height: 22px !important; image-rendering: pixelated; }

    /* Keycaps: XP keyboard keys, tinted like the title bar. */
    main .shortcut { white-space: nowrap; }
    main kbd {
      display: inline-block;
      min-width: 1.7em;
      padding: 0 .45em;
      margin: 0 .05em;
      font: 700 .8em/1.6 var(--font-ui);
      text-align: center;
      color: #4a2c46;
      background: linear-gradient(180deg, #fff, #f1e4ee);
      border: 1px solid #b894ae;
      border-radius: 3px;
      box-shadow: inset 0 -2px 0 #dcbcd3, 1px 1px 0 rgba(0, 0, 0, .08);
      vertical-align: .08em;
    }
    /* Mouse actions stay words, joined to keys with "and" rather than "+". */
    main .shortcut .join { color: #6a5a68; font-size: .92em; }
    /* The editor's mouse icons, recoloured for a light page, on lines of controls. */
    main img.mouse-icon {
      display: inline !important;
      width: auto !important;
      height: 1.15em !important;
      margin: 0 .2em 0 0 !important;
      vertical-align: -0.18em;
      box-shadow: none !important;
      border-radius: 0 !important;
    }

    main code {
      font: .85em var(--font-mono);
      background: var(--accent-light);
      border: 1px solid #9fd9e5;
      border-radius: 2px;
      padding: .05rem .3rem;
      color: var(--heading);
    }
    main pre {
      background: var(--accent-light) !important;
      border: 1px solid #9fd9e5 !important;
      border-radius: 0 !important;
      box-shadow: inset 1px 1px 2px rgba(20, 60, 80, .15);
    }
    main pre code { border: none; padding: 0; background: transparent; }

    main blockquote { border-color: var(--chrome) !important; }
    main blockquote strong { color: var(--heading); }
    /* Message balloons: information, warning and critical, as in XP-era help. */
    main blockquote.video-callout, main blockquote.callout {
      display: flex;
      align-items: flex-start;
      gap: .7rem;
      width: fit-content;
      max-width: 100%;
      background: #fff8fb;
      border: 1px solid #e3a9c4 !important;
      border-radius: 6px;
      box-shadow: 2px 2px 0 #f3d6e4;
      padding: .7rem 1rem !important;
      margin: 1rem 0;
      font-size: 1rem;
    }
    main blockquote.callout { width: auto; font-size: inherit; }
    main blockquote.video-callout::before, main blockquote.callout::before {
      content: "i";
      flex: none;
      width: 22px; height: 22px;
      margin-top: .05rem;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 30%, #fff, #9fe6f3 40%, #2fb3cc);
      border: 1px solid #1f8ea4;
      color: #fff;
      font: italic 700 14px/20px Georgia, serif;
      text-align: center;
      text-shadow: 0 1px 0 #1f8ea4;
    }
    main blockquote.callout-warning { background: #fffbea; border-color: #e2c45a !important; box-shadow: 2px 2px 0 #f5e6ad; }
    main blockquote.callout-warning::before {
      content: "!";
      width: 24px; height: 22px;
      border: none; border-radius: 0;
      clip-path: polygon(50% 0, 100% 100%, 0 100%);
      background: linear-gradient(180deg, #fff3a6, #f5c518 60%, #d9a400);
      color: #3a2a00;
      font: normal 700 14px/27px Tahoma, sans-serif;
      text-shadow: none;
    }
    main blockquote.callout-critical { background: #fff4f2; border-color: #e3a39a !important; box-shadow: 2px 2px 0 #f6d5cf; }
    main blockquote.callout-critical::before {
      content: "\\00d7";
      background: radial-gradient(circle at 35% 30%, #ffb3a8, #e0503a 45%, #b3261e);
      border-color: #8e1d17;
      font: normal 700 17px/19px Tahoma, sans-serif;
      text-shadow: 0 1px 0 #8e1d17;
    }
    main .callout-label { font: 700 1em var(--font-title); color: var(--heading); margin-right: .3em; }
    main blockquote.video-callout p, main blockquote.callout p { margin: 0; flex: 1; min-width: 0; overflow-wrap: normal; }
    main blockquote.video-callout a, main blockquote.callout a { color: var(--heading); }
    main hr { border-color: var(--rule); }

    /* Screenshots: a white mat with a hairline and a hard offset shadow. */
    main img { max-height: 380px; object-fit: contain; object-position: left; }
    main img.img-fluid {
      background: #fff;
      padding: 3px;
      border: 1px solid #b894ae;
      border-radius: 0 !important;
      box-shadow: 3px 3px 0 #ead7e4 !important;
    }
    main img.img-inline {
      display: inline !important;
      margin: 0 !important;
      width: auto !important;
      max-height: 1.2em;
      vertical-align: -0.12em;
      box-shadow: none !important;
      border-radius: 0 !important;
      padding: 0 !important;
      background: transparent !important;
    }

    main .table { --bs-table-striped-bg: #fbf5f9; border-color: var(--rule); }
    main .table thead th { background: var(--gloss-pink); color: var(--plum-dark); font-family: var(--font-title); }

    /* ── Back-to-top: a round glossy button ── */
    .btn-top {
      position: fixed; bottom: 2rem; right: 2rem; z-index: 1030;
      opacity: 0; visibility: hidden; transition: opacity .3s; pointer-events: none;
      width: 2.75rem; height: 2.75rem;
      background: radial-gradient(circle at 50% 25%, #fff 0%, #bff2fb 30%, var(--accent) 65%, #2fb3cc 100%);
      border: 1px solid #1f8ea4;
      color: var(--heading);
      box-shadow: 1px 2px 4px rgba(20, 60, 80, .35) !important;
    }
    .btn-top:hover { background: radial-gradient(circle at 50% 25%, #fff 0%, #f0dfeb 30%, var(--chrome) 65%, var(--plum) 100%); border-color: var(--plum-dark); color: var(--plum-dark); }
    .btn-top.show  { opacity: 1; visibility: visible; pointer-events: auto; }
    @media (prefers-reduced-motion: reduce) {
      .btn-top, #sidebar-nav .nav-link, #toc-nav .nav-link { transition: none; }
    }

    /* ── Status-bar footer ── */
    footer {
      background: linear-gradient(180deg, var(--chrome), var(--chrome-dark));
      border-top: 1px solid var(--plum);
      font-family: var(--font-title);
      margin-top: 0 !important;
    }
    footer p:first-child { font-size: 1.2rem; font-weight: 700; text-shadow: 1px 1px 0 var(--plum-dark); }
    footer p.small { font-family: var(--font-ui); opacity: 1 !important; }
    footer a { color: #fff !important; }
    footer a:hover { color: #dff7fc !important; }

    /* Targets of anchor links: keep them below the fixed navbar */
    main[id], main [id] {
      scroll-margin-top: var(--anchor-offset);
    }
  </style>
</head>
<body>

  <a class="skip-link visually-hidden-focusable position-absolute top-0 start-0 p-2 bg-white" href="#main-content">Skip to content</a>
  <header class="navbar sticky-top shadow-sm">
    <div class="container-fluid px-3">
      <h1 class="navbar-brand"><a href="https://store.steampowered.com/app/3831080/Oeuf/" target="_blank" rel="noopener">
        OEUF MAP-EGGITOR TUTORIAL
      </a></h1>
      <div class="navbar-actions d-flex gap-2">
        <a href="https://youtu.be/brkR8vVeSMg" class="btn btn-sm btn-outline-light d-none d-md-inline-flex align-items-center gap-1" target="_blank" rel="noopener">
          <i class="bi bi-youtube"></i> Video Tutorial
        </a>
        <button class="btn btn-sm btn-outline-light d-lg-none" type="button"
                data-bs-toggle="offcanvas" data-bs-target="#tocOffcanvas" aria-controls="tocOffcanvas" aria-label="Table of contents">
          <i class="bi bi-list"></i>
        </button>
      </div>
    </div>
  </header>

  <div class="offcanvas offcanvas-start" tabindex="-1" id="tocOffcanvas" aria-labelledby="tocLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="tocLabel">Contents</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <nav id="toc-nav" aria-label="Mobile table of contents" class="nav flex-column">${sidebarHtml}</nav>
    </div>
  </div>

  <div class="container-fluid">
    <div class="row">
      <aside class="col-lg-3 d-none d-lg-block">
        <div class="sidebar py-4 pe-3">
          <h6 class="text-uppercase text-body-secondary mb-3 fw-bold small">Contents</h6>
          <nav id="sidebar-nav" aria-label="Table of contents" class="nav flex-column">${sidebarHtml}</nav>
        </div>
      </aside>
      <main id="main-content" tabindex="-1" class="col-lg-9 py-4 px-4 px-lg-5">${body}</main>
    </div>
  </div>

  <footer class="text-light py-4 mt-5">
    <div class="container text-center">
      <p class="mb-1">
        <a href="https://store.steampowered.com/app/3831080/Oeuf/" class="text-decoration-none" target="_blank" rel="noopener">
          OEUF Map-Eggitor Tutorial
        </a>
      </p>
      <p class="small mb-0 opacity-75">
        Feedback &amp; bug reports: <a href="mailto:analytic@gmail.com">analytic@gmail.com</a> or <a href="https://github.com/increpare/oeuf-documentation/issues">GitHub</a>
      </p>
    </div>
  </footer>

  <button type="button" class="btn btn-top rounded-circle shadow" aria-label="Back to top" id="btnTop" disabled>
    <i class="bi bi-arrow-up"></i>
  </button>

  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script>
${fs.readFileSync('navigation.js', 'utf8')}
  </script>
</body>
</html>`;

fs.writeFileSync('map-editor-tutorial.html', page, 'utf8');
console.log('Done! map-editor-tutorial.md -> map-editor-tutorial.html');
