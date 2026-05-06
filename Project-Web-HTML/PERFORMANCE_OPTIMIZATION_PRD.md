# Villarias Motors Performance Optimization PRD

## 1. Document Control

Project: Villarias Motors Digital Showroom  
Focus: Fix lag and frame drops caused by 3D scenes, large images, scroll animation, and showroom rendering  
Primary page: `villarias-motors/index.html`  
Related files: `villarias-motors/js/hero3d.js`, `villarias-motors/js/intro3d.js`, `villarias-motors/js/script.js`, `villarias-motors/css/style.css`, `villarias-motors/assets/`  
Version: 1.0  

## Implementation Status - 2026-05-06

Completed in pass 1:

- `PERF-002`: Added `?perf=1` debug overlay with render mode, active 3D section, FPS estimate, and long-task count.
- `PERF-003`: Home page no longer loads `model-data.js` or `model2-data.js`; 3D scenes load `.glb` files directly from `assets/3d/`.
- `PERF-004`: 3D loading is deferred until after page load and idle time; static fallback images are shown immediately.
- `PERF-005`: Hero and intro 3D render loops pause when offscreen and when the tab is hidden.
- `PERF-006`: Added device capability detection with `full-3d`, `3d-lite`, and `static-fallback` modes.
- `PERF-007`: Renderer DPR, antialiasing, shadows, particle counts, and effect intensity now scale by render mode.
- `PERF-008`: Removed per-frame model traversal for opacity updates; model materials are cached once.
- `PERF-009`: Cached cinematic text nodes and scroll track metrics to avoid repeated frame-time DOM queries.
- `PERF-011`: Added lazy/async decoding to non-critical dynamic images.
- `PERF-012`: Removed all feature thumbnails from the home carousel; feature images now load from the modal path.
- `PERF-013`: Removed animated carousel blur filters and reduced expensive car shadow/glow CSS.
- `PERF-015`: Replaced full gradient string updates with a CSS variable for active showroom color.
- `PERF-017`: Disabled custom cursor on touch/reduced-motion devices and moved desktop cursor updates to transforms.

Partially completed:

- `PERF-016`: Reduced duplicate scroll work for nav and hero progress; deeper shared scroll-state refactor remains optional.
- `PERF-019`: Three.js now loads only when render mode allows 3D; GSAP is still globally loaded.

Still pending:

- `PERF-001`: Browser-based Lighthouse and Chrome Performance trace baseline.
- `PERF-010`: WebP/AVIF asset conversion. No local image conversion tools were available in this environment.
- `PERF-014`: Full carousel virtualization/windowing.
- `PERF-018`: Full CSS paint audit beyond the highest-cost home carousel effects.
- `PERF-020`: Full page-specific script splitting.
- `PERF-021` and `PERF-022`: GLB optimization/baking pipeline.

## 2. Problem Statement

The home page now feels laggy after adding two cinematic Three.js sections and many high-resolution vehicle images. The current implementation loads heavy model data, runs multiple animation loops, renders costly visual effects, and creates many image-heavy DOM nodes on page load.

The site must keep the premium visual direction while becoming smooth on normal laptops and usable on mobile devices through progressive enhancement, lazy loading, asset optimization, and lower-cost animation paths.

## 3. Current Performance Findings

- `villarias-motors/assets/` is about `67 MB` total.
- `villarias-motors/assets/car-features/` is about `35 MB`.
- `villarias-motors/assets/team/` is about `17 MB`; `lead-engineer.png` is about `8.1 MB`, `ceo.png` is about `6.8 MB`.
- `villarias-motors/assets/logo/horizontal-logo.png` is about `4.7 MB`; `primary.png` is about `1.5 MB`.
- `villarias-motors/js/model-data.js` is about `2.0 MB`.
- `villarias-motors/js/model2-data.js` is about `2.4 MB`.
- The home page loads Three.js, GLTFLoader, `model-data.js`, `model2-data.js`, `hero3d.js`, and `intro3d.js` after window load.
- `hero3d.js` starts a continuous `requestAnimationFrame` loop immediately.
- `intro3d.js` lazy-initializes with `IntersectionObserver`, but after it starts, its render loop continues.
- Both 3D files use `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3))`, 2048 shadow maps, antialiasing, particles, lights, grid helpers, glow effects, and material traversal inside the frame loop.
- `script.js` runs another continuous custom cursor animation loop.
- The home showroom builds 22 car items and includes feature thumbnails for each car directly inside the slider HTML.
- The carousel animates expensive CSS properties like `filter: blur(...)`, large `drop-shadow(...)`, gradient backgrounds, and blurred glow elements.

## 4. Goals

- Keep the luxury 3D/showroom experience on capable devices.
- Prevent low-end devices from loading or rendering expensive 3D scenes.
- Reduce initial JavaScript, image, and GPU cost.
- Keep scrolling responsive while 3D sections are visible.
- Make the showroom slider smooth when dragging, hovering, and switching cars.
- Preserve the existing design language and core conversion flow.

## 5. Non-Goals

- Redesigning the whole site.
- Removing 3D entirely for all users.
- Replacing the static HTML/CSS/vanilla JS architecture with a framework.
- Changing vehicle data, pricing, cart behavior, or page navigation.

## 6. Success Metrics

Target metrics for local validation and Chrome Lighthouse:

- Desktop FPS: stable `55-60 FPS` while scrolling 3D sections on a modern laptop.
- Mid-range mobile FPS: minimum `40 FPS` with 3D fallback or 3D-lite mode.
- Low-end mobile: no WebGL scene load; static fallback renders quickly.
- Largest Contentful Paint: under `2.5s` on desktop, under `3.5s` on mobile.
- Interaction to Next Paint: under `200ms`.
- Cumulative Layout Shift: under `0.1`.
- Home page initial critical JS: reduce by at least `50%`.
- Initial image payload: reduce by at least `60%`.
- No animation frame should perform full model tree traversal after entrance animation completes.

## 7. User Stories

- As a visitor on a laptop, I want the cinematic hero to feel smooth while I scroll so the site feels premium instead of heavy.
- As a visitor on a phone, I want the page to load quickly and show a polished static or lightweight version instead of freezing.
- As a buyer browsing the showroom, I want dragging the carousel to react immediately without stutter.
- As a returning visitor, I want images and models to be cached efficiently so repeat visits feel faster.
- As the site owner, I want the page to keep its high-end visual identity without sacrificing usability.

## 8. Task List

### P0 - Baseline And Performance Guardrails

#### PERF-001: Create a measurable performance baseline

Description: Capture the current performance before optimization so improvements can be proven.

Implementation tasks:

- Run Lighthouse on `villarias-motors/index.html` served locally.
- Record desktop and mobile scores.
- Use Chrome Performance panel to record a full scroll through both 3D sections and the showroom slider.
- Capture main-thread long tasks, FPS, GPU memory spikes, JS heap growth, and image/network payload.
- Add screenshots or notes to a new `performance-audit/` folder if desired.

Acceptance criteria:

- Baseline includes current Lighthouse metrics.
- Baseline identifies top three frame-drop sources.
- Baseline includes total JS, total image payload, and total 3D payload.

#### PERF-002: Add a lightweight debug performance mode

Description: Add a development-only way to inspect FPS, render mode, and active 3D state.

Implementation tasks:

- Add optional query flag: `?perf=1`.
- When enabled, show FPS estimate, current render mode, DPR, and active 3D section.
- Add `PerformanceObserver` for long tasks where supported.
- Log when the page chooses `full-3d`, `3d-lite`, or `static-fallback`.

Acceptance criteria:

- Debug overlay is hidden by default.
- Debug mode has no visible impact for normal users.
- Developers can confirm whether 3D is paused offscreen.

### P0 - 3D Loading And Runtime

#### PERF-003: Stop embedding GLB files as base64 JavaScript

Description: The current `model-data.js` and `model2-data.js` files add about `4.4 MB` of JavaScript that must be parsed before models can load. Load binary `.glb` files directly instead.

Implementation tasks:

- Replace `GLB_MODEL_DATA` and `GLB_MODEL2_DATA` data URL loading with direct loading from:
  - `villarias-motors/assets/3d/3d-model-1.glb`
  - `villarias-motors/assets/3d/3d-model.glb`
- Remove `model-data.js` and `model2-data.js` from the home page loading path after the direct loader is working.
- Add cache-friendly file names or version query strings only when assets change.
- Keep fallback image behavior if the GLB request fails.

Acceptance criteria:

- Initial JS payload is reduced by about `4.4 MB`.
- Models still load from local server.
- Static fallback appears if the GLB cannot load.

#### PERF-004: Lazy load the first 3D scene after first paint

Description: The first viewport should render the brand and fallback hero immediately, then enhance to 3D only when the browser is ready.

Implementation tasks:

- Show `hero3dFallback` by default.
- Load Three.js and `hero3d.js` after `requestIdleCallback`, first user scroll, or a short delay after first paint.
- Keep the fallback visible until the model is fully ready.
- Fade the canvas in only after the first successful render.

Acceptance criteria:

- User sees a polished hero immediately.
- No blank canvas is visible during model load.
- First paint is not blocked by Three.js or GLB loading.

#### PERF-005: Pause 3D render loops when sections are offscreen

Description: Both 3D scenes should render only when visible or during a short transition period.

Implementation tasks:

- Add `IntersectionObserver` to `hero3d.js` and `intro3d.js`.
- Track `isVisible` for each scroll section.
- Skip `renderer.render(...)` and frame updates when the section is outside the viewport.
- Cancel or stop recursive `requestAnimationFrame` when hidden, then resume when visible.
- Pause rendering when `document.visibilityState === 'hidden'`.

Acceptance criteria:

- Only visible 3D sections consume animation frames.
- Intro 3D does not keep rendering after the user scrolls away.
- Hidden browser tabs do not keep rendering.

#### PERF-006: Add device capability detection and render modes

Description: The site needs different visual modes for high-end desktop, normal desktop, mobile, and low-end devices.

Implementation tasks:

- Create a shared helper such as `getRenderCapability()`.
- Inputs should include:
  - `navigator.deviceMemory`
  - `navigator.hardwareConcurrency`
  - device pixel ratio
  - user agent touch/mobile check
  - `prefers-reduced-motion`
  - WebGL support check
- Return one of:
  - `full-3d`
  - `3d-lite`
  - `static-fallback`
- Use `static-fallback` for mobile by default unless explicitly allowed.
- Use `3d-lite` for normal laptops and tablets.

Acceptance criteria:

- Low-end and mobile devices skip WebGL loading.
- Reduced-motion users get static fallback.
- Render mode can be inspected in `?perf=1`.

#### PERF-007: Lower renderer cost by mode

Description: Current settings are expensive for most devices.

Implementation tasks:

- Change max DPR:
  - `full-3d`: max `2`
  - `3d-lite`: max `1.25` or `1.5`
  - `static-fallback`: no renderer
- Disable antialiasing in `3d-lite`.
- Reduce or disable shadows in `3d-lite`.
- Reduce shadow map from `2048` to `1024` or `512`.
- Remove `physicallyCorrectLights` in `3d-lite` if visual difference is acceptable.
- Reduce particle counts in `3d-lite`.
- Add dynamic quality fallback if average FPS drops below target for several seconds.

Acceptance criteria:

- 3D-lite looks acceptable but uses less GPU.
- Scroll FPS improves on mid-range devices.
- DPR never reaches `3` on high-density screens.

#### PERF-008: Remove per-frame model traversal

Description: Both 3D loops call `carGroup.traverse(...)` every frame to update material opacity. This is expensive and should be cached.

Implementation tasks:

- During model load, collect mesh material references into an array.
- Update opacity only while entrance animation is active.
- Stop opacity updates after it reaches `1`.
- Avoid changing `transparent` every frame.

Acceptance criteria:

- No full `carGroup.traverse(...)` is used inside the main animation loop.
- Model fade-in still works.
- CPU usage drops during idle scroll states.

#### PERF-009: Cache DOM lookups and scene text state

Description: The 3D loops query and update text scene classes repeatedly.

Implementation tasks:

- Cache `.cin-scene` and `.cin2-scene` nodes once during initialization.
- Track the previous active scene index.
- Only update class names when the active scene changes.
- Cache scroll track dimensions and refresh them on resize instead of reading layout every frame.

Acceptance criteria:

- No repeated `querySelectorAll(...)` calls inside 3D animation frames.
- Scene text still switches correctly during scroll.
- Layout reads are minimized during scroll.

### P0 - Image And Asset Optimization

#### PERF-010: Convert large PNG/JPG assets to modern responsive formats

Description: Several image folders are too heavy for a smooth static site.

Implementation tasks:

- Convert car, car-feature, team, and logo images to WebP or AVIF.
- Keep PNG only when transparency quality requires it.
- Produce multiple sizes for images shown at different dimensions.
- Update image tags to use `srcset` and `sizes` where useful.
- Add explicit `width` and `height` to prevent layout shift.

Acceptance criteria:

- Initial visible images are reduced by at least `60%`.
- Logos are under `200 KB` each where possible.
- Team images are under `300 KB` each where possible.
- No visible quality loss at displayed sizes.

#### PERF-011: Lazy load non-critical images

Description: Images outside the first viewport should not load immediately.

Implementation tasks:

- Add `loading="lazy"` and `decoding="async"` to non-critical images.
- Use `fetchpriority="high"` only for the first visible hero fallback/logo if needed.
- Keep eager loading only for images visible above the fold.
- Ensure modal and feature images load only when needed.

Acceptance criteria:

- Browser network panel does not show all feature images loading on initial home page load.
- Above-the-fold image remains fast and stable.
- Modal images load when the modal opens.

#### PERF-012: Defer feature thumbnails in the home showroom

Description: The home slider currently builds preview thumbnails for every vehicle, which can trigger unnecessary image work.

Implementation tasks:

- Render feature preview thumbnails only for the active vehicle and nearby vehicles.
- Or remove feature thumbnails from home slider and load them only inside the modal.
- Add placeholder shells for inactive cards if the layout needs them.
- Lazy load feature thumbnails with `loading="lazy"` and `decoding="async"`.

Acceptance criteria:

- Home slider does not create 88 feature thumbnail image requests on load.
- Active car still has a rich detail path.
- Modal feature grid still works.

### P0 - Showroom Slider Smoothness

#### PERF-013: Remove animated CSS filters from carousel items

Description: Animating `filter: blur(...)` and large drop shadows is expensive, especially across 22 cards.

Implementation tasks:

- Replace inactive-card blur with opacity, scale, and z-index only.
- Reduce large `drop-shadow(...)` effects on active vehicle images.
- Avoid animating `filter` on hover and drag.
- Test with the Chrome Performance panel to confirm fewer paint events.

Acceptance criteria:

- Dragging the showroom does not trigger heavy paint on every frame.
- Center-focus effect remains visually clear.
- Slider interaction feels immediate.

#### PERF-014: Virtualize or window the carousel DOM

Description: The slider renders all 22 vehicle cards and their nested feature previews. Only a small number are visible at once.

Implementation tasks:

- Render only active, previous, next, and a small buffer of nearby cars.
- Keep dots and navigation aware of the full 22-car list.
- Recycle DOM nodes during navigation instead of rebuilding the full slider.
- Keep modal lookup using the original `CARS` data array.

Acceptance criteria:

- DOM node count for the home slider is significantly lower.
- Drag and navigation still support all vehicles.
- No broken click, dot, arrow, or modal behavior.

#### PERF-015: Simplify background transitions

Description: Changing gradient background strings and using `will-change: background` can trigger expensive paints.

Implementation tasks:

- Replace dynamic gradient string updates with a CSS variable such as `--active-car-rgb`.
- Animate opacity of a pseudo-element instead of full background strings.
- Remove permanent `will-change: background`.

Acceptance criteria:

- Active car color still influences the section.
- Background transition causes less repaint work.
- No visual flicker during rapid carousel navigation.

### P1 - Scroll, Cursor, And Animation Cleanup

#### PERF-016: Consolidate scroll listeners

Description: Multiple scripts listen to scroll independently and perform DOM reads/writes.

Implementation tasks:

- Create one shared passive scroll state in `script.js`.
- Use a single `requestAnimationFrame` scheduler for scroll-driven DOM updates.
- Toggle nav state only when the threshold changes.
- Keep 3D scripts reading shared scroll state where possible.

Acceptance criteria:

- Fewer scroll callbacks run during scroll.
- Nav and progress bars still update correctly.
- No scroll jank from repeated DOM reads.

#### PERF-017: Optimize or disable custom cursor on unsupported devices

Description: The custom cursor runs a permanent animation loop and updates `left/top`.

Implementation tasks:

- Disable custom cursor on touch devices and reduced-motion users.
- Move cursor with `transform: translate3d(...)` instead of `left/top`.
- Stop cursor RAF when the page is hidden.
- Avoid cursor work when the pointer is outside the document.

Acceptance criteria:

- Desktop cursor still feels premium.
- Mobile/touch devices do not run cursor animation.
- Cursor does not contribute to idle CPU usage.

#### PERF-018: Reduce expensive CSS effects

Description: Large blur, backdrop-filter, drop-shadow, and permanent `will-change` rules increase paint and memory cost.

Implementation tasks:

- Audit all `backdrop-filter`, `filter: blur`, and large `drop-shadow` rules in `style.css`.
- Reduce blur radius where possible.
- Remove permanent `will-change` after animations complete.
- Add `content-visibility: auto` for below-the-fold sections where safe.
- Add `contain: layout paint` to isolated cards or sections where safe.

Acceptance criteria:

- Visual style remains premium.
- Paint events are reduced in Chrome Performance recordings.
- Offscreen sections do less layout and paint work.

### P1 - Script Loading Strategy

#### PERF-019: Defer non-critical libraries

Description: GSAP, ScrollTrigger, Three.js, and GLTFLoader should not all compete with initial page rendering.

Implementation tasks:

- Add `defer` to local scripts where ordering allows.
- Load GSAP/ScrollTrigger only when pages use them.
- Load Three.js only if render capability is not `static-fallback`.
- Add CDN error fallbacks or graceful no-animation paths.

Acceptance criteria:

- First render happens before non-critical animation libraries finish.
- Pages without 3D do not load Three.js.
- Site still works if CDN animation scripts fail.

#### PERF-020: Split home-specific code from global code

Description: `script.js` contains global cart/data code plus page-specific behavior.

Implementation tasks:

- Keep shared car/cart utilities in a shared file.
- Move home slider logic into a home-only script.
- Move services/cart/register page logic into page-specific files or lazy page initializers.
- Ensure every page loads only the code it needs.

Acceptance criteria:

- Non-home pages do not initialize home-specific slider logic.
- Home page still has all required behavior.
- JS parse/execute cost is lower per page.

### P2 - 3D Asset Pipeline

#### PERF-021: Optimize GLB models

Description: The GLB files are not huge, but GPU cost depends on triangle count, material count, texture size, and shadows.

Implementation tasks:

- Run GLB files through a model optimization pipeline.
- Reduce texture sizes to the display need.
- Merge or simplify materials where possible.
- Generate Draco or Meshopt compressed variants if loader support is added.
- Create `high`, `medium`, and `low` model variants.

Acceptance criteria:

- Model file size and GPU memory use decrease.
- Visual quality remains acceptable at hero scale.
- 3D-lite mode uses a lower-cost model.

#### PERF-022: Bake visual effects into assets where possible

Description: Some real-time lights, reflections, shadows, and glow can be baked or simulated more cheaply.

Implementation tasks:

- Replace unnecessary real-time lights with baked model textures or simple material settings.
- Use a static shadow texture or CSS shadow where acceptable.
- Remove or reduce real-time ground reflections in 3D-lite.

Acceptance criteria:

- Lighting remains premium.
- GPU frame time decreases.
- 3D-lite mode has no expensive shadow/reflection setup.

## 9. Recommended Implementation Order

1. Measure baseline with Lighthouse and Chrome Performance.
2. Stop loading base64 model JS and load `.glb` files directly.
3. Add render capability detection and static fallback mode.
4. Pause offscreen 3D loops.
5. Cap DPR and lower 3D quality by mode.
6. Remove per-frame model traversal and cache DOM lookups.
7. Convert and lazy load images.
8. Defer home feature thumbnails or load them only in modal.
9. Remove carousel filter animations and reduce expensive CSS effects.
10. Split page-specific scripts after the main lag sources are fixed.

## 10. QA Test Matrix

- Desktop Chrome, 1920x1080, full-3d mode.
- Desktop Chrome, 1366x768, 3d-lite mode.
- Desktop Safari or Edge, 3d-lite mode.
- Android mid-range phone, static fallback or 3d-lite depending on capability.
- iPhone Safari, static fallback by default.
- Reduced-motion browser setting, static fallback.
- Slow network throttling, verify fallback appears before 3D.
- CDN failure simulation, verify page remains usable.

## 11. Definition Of Done

- The home page no longer freezes or visibly stutters during initial load.
- Scrolling through both cinematic sections stays smooth on a normal laptop.
- Mobile users receive a fast static or lightweight experience.
- The showroom slider drags smoothly without filter-related paint spikes.
- Initial asset payload is significantly smaller.
- The premium visual direction is preserved.
- Performance metrics are documented before and after optimization.
