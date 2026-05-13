/* ============================================================
   VILLARIAS MOTORS - PERFORMANCE HELPERS
   Shared capability detection, script loading, and debug overlay.
   ============================================================ */

(function () {
  'use strict';

  function hasWebGL() {
    try {
      var canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      ));
    } catch (e) {
      return false;
    }
  }

  function getForcedMode() {
    var params = new URLSearchParams(window.location.search);
    var mode = params.get('render');
    if (mode === 'full-3d' || mode === '3d-lite' || mode === 'static-fallback') {
      return mode;
    }
    return null;
  }

  function getRenderMode() {
    var forced = getForcedMode();
    if (forced) return forced;

    var nav = window.navigator;
    var reducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var touch = (window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches) ||
      nav.maxTouchPoints > 0;
    var mobileUA = /Mobi|Android|iPhone|iPad|iPod/i.test(nav.userAgent);

    if (reducedMotion || !hasWebGL()) {
      return 'static-fallback';
    }

    var memory = nav.deviceMemory || 4;
    var cores = nav.hardwareConcurrency || 4;
    var dpr = window.devicePixelRatio || 1;
    var isMobile = touch || mobileUA;

    if (isMobile) {
      if (memory >= 2 && cores >= 4) {
        return '3d-lite';
      }
      return '3d-lite';
    }

    if (memory < 6 || cores < 6 || dpr > 2) {
      return '3d-lite';
    }

    return 'full-3d';
  }

  function getQuality(mode) {
    if (mode === 'full-3d') {
      return {
        mode: mode,
        antialias: true,
        dprCap: 2,
        shadows: true,
        shadowMapSize: 1024,
        particleScale: 1,
        effectsScale: 1,
        physicallyCorrectLights: true
      };
    }

    if (mode === '3d-lite') {
      return {
        mode: mode,
        antialias: false,
        dprCap: 1,
        shadows: false,
        shadowMapSize: 512,
        particleScale: 0.3,
        effectsScale: 0.3,
        physicallyCorrectLights: false,
        maxFPS: 30
      };
    }

    return {
      mode: 'static-fallback',
      antialias: false,
      dprCap: 1,
      shadows: false,
      shadowMapSize: 0,
      particleScale: 0,
      effectsScale: 0,
      physicallyCorrectLights: false
    };
  }

  function loadScript(src, cb) {
    var el = document.createElement('script');
    el.src = src;
    el.onload = cb || function () {};
    el.onerror = function () {
      console.warn('Failed to load: ' + src);
      if (cb) cb(new Error('Failed to load ' + src));
    };
    document.body.appendChild(el);
    return el;
  }

  function whenIdle(cb, timeout) {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(cb, { timeout: timeout || 1200 });
      return;
    }
    window.setTimeout(cb, 250);
  }

  var debug = new URLSearchParams(window.location.search).get('perf') === '1';
  var overlay = null;
  var frames = 0;
  var lastFpsTime = performance.now();
  var fps = 0;
  var state = {
    mode: getRenderMode(),
    active3d: 'none',
    dpr: window.devicePixelRatio || 1,
    longTasks: 0
  };

  function ensureOverlay() {
    if (!debug || overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'vmPerfOverlay';
    overlay.style.cssText = [
      'position:fixed',
      'right:12px',
      'bottom:12px',
      'z-index:999999',
      'padding:10px 12px',
      'background:rgba(0,0,0,.78)',
      'border:1px solid rgba(201,168,76,.5)',
      'color:#fafafa',
      'font:12px/1.5 monospace',
      'pointer-events:none'
    ].join(';');
    document.body.appendChild(overlay);
  }

  function updateOverlay() {
    if (!debug) return;
    ensureOverlay();
    if (!overlay) return;
    overlay.innerHTML =
      'mode: ' + state.mode + '<br>' +
      'active3d: ' + state.active3d + '<br>' +
      'dpr: ' + state.dpr + '<br>' +
      'fps: ' + fps + '<br>' +
      'longTasks: ' + state.longTasks;
  }

  function tickFps() {
    if (!debug) return;
    frames += 1;
    var now = performance.now();
    if (now - lastFpsTime >= 1000) {
      fps = Math.round((frames * 1000) / (now - lastFpsTime));
      frames = 0;
      lastFpsTime = now;
      updateOverlay();
    }
    window.requestAnimationFrame(tickFps);
  }

  if (debug) {
    window.requestAnimationFrame(tickFps);
    if ('PerformanceObserver' in window) {
      try {
        new PerformanceObserver(function (list) {
          state.longTasks += list.getEntries().length;
          updateOverlay();
        }).observe({ entryTypes: ['longtask'] });
      } catch (e) {}
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', updateOverlay);
    } else {
      updateOverlay();
    }
  }

  window.VMPerformance = {
    isDebug: debug,
    getRenderMode: getRenderMode,
    getQuality: getQuality,
    hasWebGL: hasWebGL,
    loadScript: loadScript,
    whenIdle: whenIdle,
    setActive3d: function (name) {
      state.active3d = name || 'none';
      updateOverlay();
    },
    setMode: function (mode) {
      state.mode = mode;
      updateOverlay();
    },
    shouldUseCustomCursor: function () {
      var reducedMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var touch = (window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches) ||
        window.navigator.maxTouchPoints > 0;
      return !reducedMotion && !touch;
    }
  };
})();
