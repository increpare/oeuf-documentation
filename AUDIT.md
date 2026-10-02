# HTML and navigation audit

Run `npm test` to rebuild the tutorial, lint the generated HTML and check the
navigation. `npm run lint` validates the existing generated file without rebuilding.
The HTML validator allows Unicode IDs (valid HTML); duplicate IDs, whitespace in
IDs and unresolved fragment links are still checked.

Changes made during the September 2026 audit:

- Contents auto-follow now changes only the desktop sidebar's `scrollTop`.
  Calling `scrollIntoView()` on menu entries could also scroll the viewport;
  doing that every page-scroll frame could interfere with reading and anchor jumps.
  Following stops while the reader hovers or focuses the sidebar. The mobile
  contents menu reveals its active entry once when opened.
- Mobile section links wait until Bootstrap finishes closing the menu and
  restores body scrolling. Navigation preserves fragment history and focuses
  the destination, including when selecting the same fragment again.
- Anchor offsets and the sticky sidebar follow the measured header height.
  The title wraps on small screens; the sidebar uses the dynamic viewport height.
- URL fragments jump immediately on load. Only in-document clicks request smooth
  scrolling, respecting reduced-motion preferences. The final section can
  become active at the bottom, and back-to-top initializes on restored scroll
  positions and cannot receive keyboard focus while hidden.
- PNG/GIF dimensions reserve screenshot space before loading. Heading icons
  are decorative; missing screenshot alt attributes have short labels. The page
  has a primary heading, labeled navigation, a skip link and `aria-current`.
  The mobile menu now shares desktop active-link styling, with dark text for
  better contrast on the pink background.

Automated checks cover HTML structure, all 56 contents targets in both menus,
local asset/font paths, image dimensions, scroll isolation, menu interaction,
header resizing, the final section, back-to-top and Bootstrap's actual close
events. Navigation tests use jsdom with supplied geometry, not a layout engine.

Visual browser verification remains outstanding: the browser tool's URL policy
blocked opening the local file. Check at desktop and narrow mobile widths:

1. Follow a distant contents link, scroll in either direction, and use Back/Forward.
2. Browse the sidebar independently while a section jump is in progress.
3. Open mobile Contents, choose a distant section, reopen it and choose the same
   section again. Verify the heading clears the header and the backdrop disappears.
4. Switch to desktop width while the mobile menu is open; verify body scrolling
   is restored. Test keyboard navigation, browser zoom and reduced motion.
5. Load a deep fragment with a cold image cache; verify its destination stays put.

This audit does not assess tutorial accuracy, wording or the quality of existing
generic image descriptions.
