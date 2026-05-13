# Mobile View Bug Fixes — Task List

## Bug 1 — `.cin-stats` panel overlaps hero text and 3D model on mobile
**Screenshot:** `1st-3dmodel-error.png`
**Description:** The stats bar (22 Supercars / 7 Top Brands / 100 Elite Clients / 24 Concierge Hrs) is `position:absolute; bottom:60px` and `flex-wrap:wrap` on mobile, causing it to grow tall and overlap the cinematic scene text ("Zero", "211 m...") and the 3D car model.
**Fix:** On mobile, move `.cin-stats` below the scene text by making it `position:static` (part of the normal flow inside `.cin-scene`), displayed as a 2×2 grid, and removing the absolute positioning.
**Status:** ✅ COMPLETED

---

## Bug 2 — Showroom cars not centered on mobile
**Screenshot:** `our-showroom-indexhtml-not-centered.png`
**Description:** The showroom carousel's active car is not centered on mobile. Root cause: `ITEM_W` was hardcoded as `380` in `script.js` but the CSS sets `.vm-car-item { width: 280px }` on mobile — making `centerOff()` calculate the wrong offset. No `resize` listener existed so switching viewport widths never recalculated.
**Fix:** Changed `ITEM_W` constant to a `getItemW()` function that reads the actual rendered item width via `getBoundingClientRect().width`. Applied to all 4 usages (`centerOff`, `goTo`, `snapAfterDrag`, `liveParallax`). Added `window.addEventListener('resize', ...)` to re-center on viewport change.
**Status:** ✅ COMPLETED

---

## Bug 3 — Cart empty state broken layout on mobile
**Screenshot:** `your-cart-empty-mobile-layout-mobile-error.png`
**Description:** The `.cart-empty` section (cart icon, "Your cart is empty", description, "Browse Showroom" button) has a broken horizontal layout on mobile — elements appear in a row and the button is cut off at the right edge.
**Fix:** In `@media (max-width:768px)`, ensure `.cart-empty` uses `display:flex; flex-direction:column; align-items:center; padding:60px 24px;` so content stacks vertically and stays fully visible.
**Status:** ✅ COMPLETED

---

## Bug 4 — Hamburger nav-toggle (≡) disappears on mobile
**Description:** On mobile, the hamburger menu button (≡) sometimes becomes invisible or unclickable, preventing navigation to other pages. The `position:sticky` cinematic hero creates a new stacking context that competes with the `position:fixed` navbar, pushing the nav-toggle behind the hero layer.
**Fix:** Raised `nav` and `.navbar` `z-index` from `1000` to `9000` in `css/style.css`. The `.nav-links.mobile-open` dropdown retains its `z-index:9999` so it still renders above the navbar.
**Status:** ✅ COMPLETED

---

## Bug 5 — Fallback/default car image flashes before 3D models load
**Description:** Users see the static fallback car image (car-1.png / car-5.png) for 1–2+ seconds before the 3D model appears. Root cause: `show3dFallbacks()` in `index.html` was called immediately on script execution, setting `fallback.style.display = 'block'` before the 3D loader even starts (which has a 1600ms idle delay after `window.load`).
**Fix:**
- `index.html`: Modified `show3dFallbacks()` to only show the fallback image in `static-fallback` mode (low-end device). Added `<div class="cin-3d-loader" id="hero3dLoader">` and `<div class="cin-3d-loader" id="intro3dLoader">` spinner overlays inside each canvas wrap — these cover the canvas with a black background + gold spinning ring during load.
- `css/style.css`: Added `.cin-3d-loader` styles (absolute overlay, black bg, gold spinner animation); added `.cin-3d-loader.loaded` transition (opacity → 0, pointer-events:none); added `display:none !important` override in `prefers-reduced-motion` blocks.
- `js/hero3d.js`: Added `loader.classList.add('loaded')` inside `showStaticFallback()` (on 3D failure) and in the `firstRendered` check (on successful first render).
- `js/intro3d.js`: Same changes applied to `showFallback()` and `firstRendered` check.
**Status:** ✅ COMPLETED
