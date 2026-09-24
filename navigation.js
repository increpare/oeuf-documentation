// Embedded by convert.js so the generated tutorial remains self-contained.
(() => {
  const root = document.documentElement;
  const navbar = document.querySelector('.navbar');
  const sidebar = document.querySelector('.sidebar');
  const offcanvas = document.getElementById('tocOffcanvas');
  const btnTop = document.getElementById('btnTop');
  const desktop = matchMedia('(min-width: 992px)');
  const headings = Array.from(document.querySelectorAll('main h2[id], main h3[id], main h4[id]'));
  const links = Array.from(document.querySelectorAll('#sidebar-nav .nav-link, #toc-nav .nav-link'));
  const linksById = new Map();
  let activeId;

  for (const link of links) {
    const id = decodeURIComponent(link.hash.slice(1));
    if (!linksById.has(id)) linksById.set(id, []);
    linksById.get(id).push(link);
  }

  const measureNavbar = () => {
    root.style.setProperty('--nav-height', navbar.getBoundingClientRect().height + 'px');
  };

  // Only move this menu's own scrollbar. scrollIntoView on a nav link can
  // also move the document and interrupt an anchor jump or manual scrolling.
  const revealLink = (container, link) => {
    if (!link || !container.clientHeight) return;
    const bounds = container.getBoundingClientRect();
    const item = link.getBoundingClientRect();
    const top = bounds.top + container.clientTop + 8;
    const bottom = bounds.top + container.clientTop + container.clientHeight - 8;
    if (item.top < top) container.scrollTop += item.top - top;
    else if (item.bottom > bottom) container.scrollTop += item.bottom - bottom;
  };

  const revealSidebar = () => {
    // Let readers browse the TOC without fighting the auto-follow behavior.
    if (!desktop.matches || sidebar.matches(':hover') || sidebar.contains(document.activeElement)) return;
    revealLink(sidebar, linksById.get(activeId)?.find(link => sidebar.contains(link)));
  };

  const update = (reveal = false) => {
    const awayFromTop = scrollY > 400;
    btnTop.classList.toggle('show', awayFromTop);
    btnTop.disabled = !awayFromTop;
    if (!headings.length) return;
    // Use the same offset as anchor links, including zoom/wrapped headers.
    const offset = parseFloat(getComputedStyle(headings[0]).scrollMarginTop) || navbar.getBoundingClientRect().height + 16;
    let nextId = headings[0].id;
    for (const heading of headings) {
      if (heading.getBoundingClientRect().top > offset + 1) break;
      nextId = heading.id;
    }
    // The final section can be too short to reach the activation line.
    if (scrollY > 0 && scrollY + innerHeight >= root.scrollHeight - 2) nextId = headings.at(-1).id;
    if (nextId === activeId) {
      if (reveal) revealSidebar();
      return;
    }
    activeId = nextId;
    for (const link of links) {
      const active = linksById.get(activeId).includes(link);
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    revealSidebar();
  };

  let ticking = false;
  const scheduleUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  };
  const refreshLayout = () => {
    measureNavbar();
    update(true);
  };
  addEventListener('scroll', scheduleUpdate, { passive: true });
  addEventListener('resize', refreshLayout);
  addEventListener('load', refreshLayout);
  addEventListener('pageshow', refreshLayout);
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(refreshLayout).observe(navbar);

  const navigationBehavior = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
  const navigateTo = (link, target) => {
    // Update the URL without triggering the browser's (instant) fragment jump.
    // Loading/pasting a URL and history navigation keep their native behavior.
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'start', behavior: navigationBehavior() });
  };

  btnTop.addEventListener('click', () => {
    navbar.querySelector('a').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: navigationBehavior() });
  });

  // Align the mobile TOC once on opening; never drag it around while browsing.
  offcanvas.addEventListener('shown.bs.offcanvas', () => {
    const container = offcanvas.querySelector('.offcanvas-body');
    revealLink(container, linksById.get(activeId)?.find(link => offcanvas.contains(link)));
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      const instance = offcanvas.contains(link) && window.bootstrap?.Offcanvas.getInstance(offcanvas);
      if (!instance || !offcanvas.classList.contains('show')) {
        navigateTo(link, target);
        return;
      }
      // Bootstrap restores body scrolling and trigger focus after the closing
      // transition. Navigate afterwards, so neither can undo the user's jump.
      offcanvas.addEventListener('hidden.bs.offcanvas', () => {
        requestAnimationFrame(() => {
          measureNavbar();
          navigateTo(link, target);
        });
      }, { once: true });
      instance.hide();
    });
  });

  desktop.addEventListener('change', () => {
    if (desktop.matches) window.bootstrap?.Offcanvas.getInstance(offcanvas)?.hide();
    refreshLayout();
  });
  refreshLayout();
})();
