# Task: Mobile View — Villarias Motors Website
## Scope: Full mobile responsiveness across all pages including working 3D models on mobile

---

## Current State (Issues to Fix)

- `css/style.css` line: `.hero-3d-canvas { display:none !important; }` at `@media (max-width:768px)` — **3D model is forcibly hidden on mobile**
- `performance.js` `getRenderMode()` returns `'static-fallback'` for any touch device or mobile UA — **3D is skipped entirely on mobile browsers**
- `.cin2-canvas-wrap canvas { display:none !important; }` at `@media (max-width:768px)` — **second cinematic 3D canvas also hidden on mobile**
- Various layout issues across pages at small screen widths (nav, hero, sections, footer, cards)

---

## Module 1 — 3D Model: Make It Work on Mobile

### TASK-3D-01 — Update `performance.js` `getRenderMode()` to allow 3D on capable mobile devices
- Remove blanket `touch || mobileUA` → `'static-fallback'` rule
- Instead, check **WebGL availability** + **device memory** + **hardware concurrency** to decide:
  - Mobile with WebGL + memory ≥ 2GB + cores ≥ 4 → `'3d-lite'`
  - Mobile with WebGL but lower specs → `'3d-lite'` with reduced quality
  - Mobile without WebGL → `'static-fallback'` (only real fallback)
- Keep `prefers-reduced-motion` → `'static-fallback'`

### TASK-3D-02 — Add a `'3d-lite'` quality profile to `performance.js` `getQuality()`
- `antialias: false`
- `dprCap: 1` (limit pixel ratio to 1 on mobile to save GPU fill-rate)
- `shadows: false`
- `particleScale: 0.3`
- `effectsScale: 0.3`
- `shadowMapSize: 512`
- `maxFPS: 30` (target 30fps on mobile instead of 60)

### TASK-3D-03 — Remove `display:none !important` for `.hero-3d-canvas` on mobile in `css/style.css`
- Delete or replace the `@media (max-width:768px)` rule:
  ```css
  /* REMOVE: .hero-3d-canvas { display:none !important; } */
  ```
- Allow canvas to be visible; size it correctly for mobile (see TASK-3D-05)
- Only show `.cin-canvas-wrap .hero-3d-fallback` if `getRenderMode()` returns `'static-fallback'`

### TASK-3D-04 — Remove `display:none !important` for second cinematic canvas on mobile in `css/style.css`
- Delete or replace:
  ```css
  /* REMOVE: .cin2-canvas-wrap canvas { display:none !important; } */
  /* REMOVE: .cin2-fallback { display:block !important; } */
  ```
- Show fallback only when JS explicitly sets it (WebGL not available)

### TASK-3D-05 — Ensure canvas fills mobile viewport correctly
- In `css/style.css`, for mobile breakpoint (`max-width:768px`):
  ```css
  .hero-3d-canvas { width: 100% !important; height: 100% !important; }
  .cin2-canvas-wrap canvas { width: 100% !important; height: 100% !important; }
  ```
- Ensure `cin-canvas-wrap` and `cin2-canvas-wrap` are `position:absolute; inset:0;` on mobile

### TASK-3D-06 — Update `hero3d.js` renderer initialization to use mobile-safe settings
- When `quality.mode === '3d-lite'` or mobile:
  - `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))` — cap at 1× on mobile
  - `renderer.shadowMap.enabled = false`
  - Reduce scene particle count by `particleScale`
  - Disable post-processing effects (`effectsScale < 0.5`)
- Set `renderer.powerPreference = "high-performance"` for mobile WebGL context

### TASK-3D-07 — Update `intro3d.js` renderer initialization with the same mobile-safe settings
- Mirror TASK-3D-06 changes in `intro3d.js`
- Cap DPR to 1 on mobile
- Disable shadows and heavy particle effects

### TASK-3D-08 — Handle touch/scroll events for 3D scene transitions on mobile
- In `hero3d.js` and `intro3d.js`, ensure the scroll-driven scene transitions work with touch scrolling
- Test that `window.scrollY` / `IntersectionObserver` callbacks fire correctly on iOS Safari and Android Chrome
- Ensure no `passive: false` event listeners block native scrolling

### TASK-3D-09 — Add resize handler to re-initialize canvas size on orientation change
- In `hero3d.js` and `intro3d.js`, listen for `orientationchange` and `resize` events
- On resize: update `renderer.setSize(newW, newH)` and update camera aspect ratio + `camera.updateProjectionMatrix()`

### TASK-3D-10 — Validate fallback image is shown only when 3D is truly unavailable
- In `hero3d.js` `showStaticFallback()`: set `.hero-3d-fallback { display:block }` and hide canvas
- Ensure fallback images (`assets/cars/`) are present and load correctly on mobile
- In `css/style.css`, style `.hero-3d-fallback` and `.cin2-fallback` to fill the cinematic area gracefully on mobile:
  ```css
  .hero-3d-fallback, .cin2-fallback {
    width: 100%; height: 100%; object-fit: cover;
  }
  ```

### TASK-3D-11 — Test 3D on actual mobile browsers
- Test on: iOS Safari 16+, Android Chrome, Samsung Internet
- Verify WebGL context is created and model loads
- Verify scroll scenes transition correctly on touch scroll
- Verify no console errors related to WebGL context loss
- Verify frame rate is acceptable (target ≥ 24fps on mid-range Android)

---

## Module 2 — Navigation (All Pages)

### TASK-NAV-01 — Ensure hamburger menu (`nav-toggle`) opens/closes mobile nav drawer correctly
- Verify `nav-links` slides in/out smoothly on mobile
- Ensure tap targets are at least 44×44px per accessibility guidelines
- Close nav drawer when a link is tapped

### TASK-NAV-02 — Fix nav logo sizing on mobile
- Verify `.nav-logo-img` renders at `height: 30px` on mobile (already in CSS — confirm it applies)
- Ensure logo does not overflow nav bar on small screens (320px width)

### TASK-NAV-03 — Cart icon and count badge visible and tappable on mobile
- Ensure cart icon in nav has sufficient tap target size on mobile
- Badge count should remain visible at 320px viewport width

### TASK-NAV-04 — Nav z-index: ensure mobile drawer overlays all content including 3D canvas
- Set mobile nav drawer `z-index` above canvas layers (`z-index: 9999`)

---

## Module 3 — Hero / Cinematic Sections (index.html)

### TASK-HERO-01 — Cinematic scroll-track height on mobile
- `@media (max-width:768px)`: `.cin-scroll-track { height: 400vh; }` — verify this gives enough scroll distance for all 4 scenes
- `.cin2-scroll-track { height: 320vh; }` — verify for second section's 3 scenes

### TASK-HERO-02 — Cinematic text layout on mobile
- `.cin-scene` padding-bottom `160px` — ensure text is not covered by mobile browser UI chrome (address bar)
- `.cin-title` font size `clamp(1.8rem, 8vw, 2.8rem)` — verify readability at 320px
- `.cin-stats` flex-wrap and center alignment — verify stats row wraps cleanly without overflow

### TASK-HERO-03 — Hide `.cin-progress-bar-wrap` on mobile (already set — confirm)
- Progress bar dots are hidden at `max-width:768px` — this is correct, verify no layout gap remains

### TASK-HERO-04 — Static hero section (above cinematic) responsive layout
- `.hero-content` stacks vertically on mobile (`flex-direction:column`)
- `.hero-car-showcase` width/height appropriate on mobile — check it doesn't overflow
- Hero text, subtext, and CTA buttons stack cleanly at 320–768px

### TASK-HERO-05 — Ensure scroll-driven pin (sticky) section works on mobile Safari
- `position: sticky` on `.cin-sticky` — verify iOS Safari does not glitch (add `-webkit-` prefixes if needed)
- Test that sticky section unpins correctly at scroll-track end on iOS

---

## Module 4 — Showroom / Car Gallery (index.html)

### TASK-SHOW-01 — VM Showroom horizontal carousel touch-swipe support
- Ensure the horizontal car scroll (`vm-car-item width:280px`) is swipeable on touch
- Add `touch-action: pan-x` to the scrollable container if not present
- Ensure momentum scrolling: `-webkit-overflow-scrolling: touch` or `scroll-behavior: smooth`

### TASK-SHOW-02 — Active car name and price readable on mobile
- `.vm-active-name { font-size: 1.1rem; }` — verify it fits within card on mobile
- Ensure "View Details" / "Add to Cart" buttons are full-width and tappable on mobile

### TASK-SHOW-03 — Car feature modal (`cf-grid`) on mobile
- `@media (max-width:600px)`: single column grid — verify feature images (`cf-img-wrap height:150px`) look correct
- Modal itself should be scrollable if content overflows mobile screen height

---

## Module 5 — About Page (`about.html`)

### TASK-ABOUT-01 — Brand story grid collapses to single column on tablet/mobile
- `@media (max-width:1024px)`: `grid-template-columns:1fr` — verify brand story image and text stack vertically
- `.bs-img-frame aspect-ratio:16/9 max-height:400px` — verify image is not cropped badly on mobile

### TASK-ABOUT-02 — Mission grid and value cards on mobile
- `@media (max-width:1024px)`: `mission-grid-v2 grid-template-columns:1fr` — verify single column is readable
- Value cards should have sufficient padding and not feel cramped at 320px

### TASK-ABOUT-03 — Team grid on mobile
- `@media (max-width:768px)`: `team-grid-v2 grid-template-columns:1fr` (single column, max-width:400px centered)
- Verify team member photos load and display correctly on mobile

### TASK-ABOUT-04 — Numbers/stats grid on mobile
- `@media (max-width:768px)`: `numbers-grid-v2 grid-template-columns:repeat(2,1fr)` — verify 2-column layout fits at 320px

### TASK-ABOUT-05 — About hero CTA buttons on mobile
- `@media (max-width:768px)`: `.ah-cta { flex-direction:column; align-items:center; }` — verify buttons stack and are full-width

---

## Module 6 — Services, Contact, Register, Cart Pages

### TASK-SVC-01 — Services page (`services.html`) — verify all service cards stack to single column on mobile
### TASK-CON-01 — Contact page (`contact.html`) — verify form fields are full-width, input font-size ≥ 16px (prevents iOS zoom)
### TASK-REG-01 — Register page (`register.html`) — verify form layout, `.reg-verified-badge` margin on mobile
### TASK-CART-01 — Cart page (`cart.html`) — verify cart item rows wrap on mobile, totals section readable, checkout button full-width

---

## Module 7 — Footer (All Pages)

### TASK-FOOT-01 — Footer grid collapses to 2 columns on tablet, 1 column on mobile
- `@media (max-width:1100px)`: `footer-grid grid-template-columns:1fr 1fr`
- `@media (max-width:768px)`: verify single column layout
- `.footer-logo-img height:56px` on mobile — verify it does not feel too small

### TASK-FOOT-02 — Footer social icons and links have sufficient tap target size on mobile (min 44px)

---

## Module 8 — Performance & General Mobile Polish

### TASK-PERF-01 — Ensure all images use appropriate `loading="lazy"` attribute on mobile
- Car images in showroom should lazy-load to save bandwidth on mobile data connections

### TASK-PERF-02 — Viewport meta tag correct on all HTML pages
- Verify all pages have: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- No `user-scalable=no` (bad for accessibility)

### TASK-PERF-03 — Custom cursor disabled on touch devices
- The custom cursor (CSS `cursor:none` + JS cursor follower) must be disabled on touch/mobile — it causes layout issues and is irrelevant on touch
- In `css/style.css`, wrap cursor styles in `@media (hover:hover) and (pointer:fine)` or detect in JS

### TASK-PERF-04 — Font sizes: prevent iOS auto-zoom on input focus
- All `<input>`, `<textarea>`, `<select>` must have `font-size: 16px` minimum in CSS to prevent iOS Safari auto-zoom

### TASK-PERF-05 — Touch tap highlight suppression
- Add `-webkit-tap-highlight-color: transparent` to interactive elements (buttons, links, cards)

### TASK-PERF-06 — Test across devices and screen sizes
- 320px (iPhone SE)
- 375px (iPhone 14)
- 390px (iPhone 15 Pro)
- 414px (iPhone Plus)
- 768px (iPad portrait)
- Test on: iOS Safari, Chrome Android, Samsung Internet

---

## Files to Modify

| File | Modules |
|------|---------|
| `css/style.css` | TASK-3D-03, 3D-04, 3D-05, 3D-10, TASK-PERF-03, TASK-PERF-05 |
| `js/performance.js` | TASK-3D-01, TASK-3D-02 |
| `js/hero3d.js` | TASK-3D-06, TASK-3D-08, TASK-3D-09, TASK-3D-10 |
| `js/intro3d.js` | TASK-3D-07, TASK-3D-08, TASK-3D-09 |
| `index.html` | TASK-PERF-02 (viewport check) |
| `about.html` | TASK-PERF-02 |
| `services.html` | TASK-PERF-02, TASK-SVC-01 |
| `contact.html` | TASK-PERF-02, TASK-CON-01 |
| `register.html` | TASK-PERF-02, TASK-REG-01 |
| `cart.html` | TASK-PERF-02, TASK-CART-01 |

## Files NOT to Modify
- `js/model-data.js`, `js/model2-data.js` — base64 model data, no changes needed
- `js/script.js` — car database and cart logic, no mobile-specific changes needed unless cart UI issues found
- HTML asset files (images, GLB models)
