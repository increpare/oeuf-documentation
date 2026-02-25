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

// CSS selectors can't start with a digit, so prefix bare-numeric IDs
body = body.replace(/(<h[2-4]\s+id=")(\d)/g, '$1section-$2');

// --- Extract heading IDs + text for the sidebar (before adding classes) ---
const headings = [];
const headingRe = /<h([2-4])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
let m;
while ((m = headingRe.exec(body)) !== null) {
  const level = parseInt(m[1]);
  const id = m[2];
  let text = m[3].replace(/<[^>]+>/g, '').replace(/\s*:\s*$/, '').trim();
  headings.push({ level, id, text });
}

// --- Expand [[_TOC_]] into a generated table of contents ---
const minLevel = Math.min(...headings.map(h => h.level));
const tocListHtml = headings.map(h => {
  const indent = '  '.repeat(h.level - minLevel);
  return `${indent}<li><a href="#${h.id}">${h.text}</a></li>`;
}).join('\n');


// --- Light post-processing: just add Bootstrap utility classes to bare tags ---

body = body
  .replace(/<table(?=[>\s])/g,  '<table class="table table-striped table-bordered"')
  .replace(/<img(?=\s)/g,       '<img class="img-fluid rounded shadow-sm d-block my-3"')
  .replace(/<blockquote>/g,     '<blockquote class="blockquote border-start border-3 ps-3 py-1 my-3">')
  .replace(/<pre>/g,            '<pre class="rounded p-3 border">')
  .replace(/<hr\s*\/?>/g,       '<hr class="my-5 opacity-0">')
  .replace(/<h2 /g,             '<h2 class="mt-5 mb-3 pb-2 border-bottom" ')
  .replace(/<h3 /g,             '<h3 class="mt-4 mb-3" ')
  .replace(/<h4 /g,             '<h4 class="mt-3 mb-2 opacity-75" ');

// --- Build sidebar nav links (h2 + h3 + h4) ---
const sidebarHtml = headings
  .filter(h => h.level <= 4)
  .map(h => {
    const cls = h.level === 2 ? 'fw-semibold'
              : h.level === 3 ? 'ms-3 small'
              : 'ms-5 small';
    return `<a class="nav-link py-1 ${cls}" href="#${h.id}">${h.text}</a>`;
  }).join('\n');

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
    html { scroll-behavior: smooth; }
    :root {

      --page-bg:       white;
      --surface:       #56d5eb;
      --border:        #f0dfc0;
      --chrome:        #c79cba;
      --selected-icon-color: #94c758;
      --heading:       #0d2e5f;
      --heading-outline-color: black;
      --heading-outline-width: 1px;
      --heading-text-color: #56d5eb;
      --heading-sub:   #0d2e5f;
      --heading-minor: #0d2e5f;
      --link:          #0d2e5f;
      --nav-link-color: #0d2e5f;
      --accent:        #56d5eb;
      --text-color:    black;
      --strong-text-color:rgb(44, 167, 188);
    }

    body { 
      background: var(--page-bg); 
      color: var(--text-color); 
    }

    .entity-icon {
      display: inline-block;
      width: 50px;
      height: 50px;
      background-color: var(--chrome);
      border-radius: 5px;
      padding: 5px;
    }
    /* ── Navbar ── */
    .navbar { background: var(--chrome) !important; }

    /* ── Sidebar ── */
    @media (min-width: 992px) {
      .sidebar {
        position: sticky;
        top: 4.5rem;
        height: calc(100vh - 5rem);
        overflow-y: auto;
        scrollbar-width: thin;
      }
    }
    #sidebar-nav .nav-link {
      color: var(--nav-link-color);
      border-radius: .375rem;
      transition: background .15s, color .15s;
    }
    #sidebar-nav .nav-link.active {
      background: var(--chrome);
      color: #fff;
    }
    #sidebar-nav .nav-link:hover:not(.active) {
      background: var(--surface);
    }

    /* ── Content ── */
    .navbar-brand { 
      color: var(--heading-text-color);
      font-size: 2rem;
      font-weight: bold;
      text-shadow: 1px 1px 0 var(--heading-outline-color), -1px -1px 0 var(--heading-outline-color), 1px -1px 0 var(--heading-outline-color), -1px 1px 0 var(--heading-outline-color);
    }    
    .navbar-brand:hover { 
      color: var(--heading-text-color);
   }

    .navbar  {
      /*drop shadow*/
    }
      
    main h2 { color: var(--heading); border-color: var(--border) !important; }
    main h3 { color: var(--heading-sub); }
    main h4 { color: var(--heading-minor); }
    main a   { color: var(--link); }
    main a:hover { color: var(--heading-text-color); }
    main strong { 
      color: var(--strong-text-color); 
    }
    main code {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: .25rem;
      padding: .1rem .35rem;
      font-size: .875em;
      color: var(--heading);
    }
    main pre {
      background: var(--surface) !important;
      border-color: var(--border) !important;
    }
    main pre code { border: none; padding: 0; background: transparent; }
    main blockquote { border-color: var(--accent) !important; }
    main hr { border-color: var(--border); }

    main img { max-height: 380px; }

    /* ── Offcanvas ── */
    .offcanvas { --bs-offcanvas-width: 280px; }

    /* ── Back-to-top ── */
    .btn-top {
      position: fixed; bottom: 2rem; right: 2rem; z-index: 1030;
      opacity: 0; transition: opacity .3s; pointer-events: none;
      background: var(--accent); border: none; color: #fff;
    }
    .btn-top:hover { background: var(--chrome); color: #fff; }
    .btn-top.show  { opacity: 1; pointer-events: auto; }

    /* ── Footer ── */
    footer { background: var(--chrome); font-size: 1.5rem; font-weight: bold; 
    text-shadow: 1px 1px 0 var(--heading-outline-color), -1px -1px 0 var(--heading-outline-color), 1px -1px 0 var(--heading-outline-color), -1px 1px 0 var(--heading-outline-color);
    }
    footer a { color: var(--accent) !important; }
    footer a:hover { color: #fff !important; }

    
    h2 > img.d-block {
      display: inline !important;
      height: 50px !important;
      box-shadow: none !important;
      border-radius: 5px !important;
      background-color: var(--chrome) !important;
      padding: 5px !important;
      /*image-rendering : pixelated !important; don't pixelate this one*/
    } 
    h3 > img.d-block {
      display: inline !important;
      height: 50px !important;
      box-shadow: none !important;
      border-radius: 5px !important;
      background-color: var(--chrome) !important;
      padding: 5px !important;
      image-rendering : pixelated !important;
    } 
    
    h4 > img.d-block {
      display: inline !important;
      height: 50px !important;
      box-shadow: none !important;
      border-radius: 5px !important;
      background-color: var(--selected-icon-color) !important;
      padding: 5px !important;
      image-rendering : pixelated !important;
    } 

    /* Targets of anchor links: keep them below the fixed navbar */
    main [id] {
      scroll-margin-top: 5rem;   /* match navbar height (e.g. 4.5rem–5rem) */
    }
  </style>
</head>
<body data-bs-spy="scroll" data-bs-target="#sidebar-nav" data-bs-root-margin="0px 0px -40%" tabindex="0">

  <nav class="navbar sticky-top shadow-sm">
    <div class="container-fluid px-3">
      <a class="navbar-brand" href="https://store.steampowered.com/app/3831080/Oeuf/" target="_blank" rel="noopener">
        OEUF MAP-EGGITOR TUTORIAL
      </a>
      <div class="d-flex gap-2">
        <a href="https://youtu.be/BCKunr3oAbc" class="btn btn-sm btn-outline-light d-none d-md-inline-flex align-items-center gap-1" target="_blank" rel="noopener">
          <i class="bi bi-youtube"></i> Video Tutorial
        </a>
        <button class="btn btn-sm btn-outline-light d-lg-none" type="button"
                data-bs-toggle="offcanvas" data-bs-target="#tocOffcanvas" aria-label="Table of contents">
          <i class="bi bi-list"></i>
        </button>
      </div>
    </div>
  </nav>

  <div class="offcanvas offcanvas-start" tabindex="-1" id="tocOffcanvas" aria-labelledby="tocLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="tocLabel">Contents</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <nav class="nav flex-column">${sidebarHtml}</nav>
    </div>
  </div>

  <div class="container-fluid">
    <div class="row">
      <aside class="col-lg-3 d-none d-lg-block">
        <div class="sidebar py-4 pe-3">
          <h6 class="text-uppercase text-body-secondary mb-3 fw-bold small">Contents</h6>
          <nav id="sidebar-nav" class="nav flex-column">${sidebarHtml}</nav>
        </div>
      </aside>
      <main class="col-lg-9 py-4 px-4 px-lg-5">${body}</main>
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

  <button class="btn btn-top rounded-circle shadow" onclick="window.scrollTo({top:0})" aria-label="Back to top" id="btnTop">
    <i class="bi bi-arrow-up"></i>
  </button>

  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script>
    const btnTop = document.getElementById('btnTop');
    addEventListener('scroll', () => btnTop.classList.toggle('show', scrollY > 400));

    const oc = document.getElementById('tocOffcanvas');
    oc?.querySelectorAll('.nav-link').forEach(a =>
      a.addEventListener('click', () => bootstrap.Offcanvas.getInstance(oc)?.hide())
    );
  </script>
</body>
</html>`;

fs.writeFileSync('map-editor-tutorial.html', page, 'utf8');
console.log('Done! map-editor-tutorial.md -> map-editor-tutorial.html');
