/* ============================================================
   VILLARIAS MOTORS — SECOND CINEMATIC 3D SECTION (intro)
   Uses GLB_MODEL2_DATA (3d-model.glb), 3 scroll scenes
   ============================================================ */

(function () {
  'use strict';

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function easeInOutCubic(t) { return t < 0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; }
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function showFallback() {
    const canvas = document.getElementById('intro3dCanvas');
    if (canvas) canvas.style.display = 'none';
    const fb = document.getElementById('intro3dFallback');
    if (fb) fb.style.display = 'block';
  }

  /*
   * INTRO SCENES — completely different from hero:
   *   Car moves diagonally (X+Y+Z together), tilts on rotX & rotZ
   *   Camera does vertical sweeps (Y changes dramatically)
   *   Entrance slides UP from below (Y offset)
   *   Text: scene-0 bottom-up, scene-1 diagonal top-right, scene-2 left-slide
   */
  const SCENES = [
    {
      /* Scene 0 — Bird-eye left, car tilts toward camera, low on Y */
      camPos:    { x: -1.5, y: 4.5,  z: 6.5 },
      camLookAt: { x:  0,   y: 0.0,  z: 0   },
      carPos:    { x:  1.4, y: -0.3, z: -1.0 },
      carRotX:   0.12,  carRotY: -0.8,  carRotZ:  0.04,
      carScale:  1.0,
      rimInt: 2.5, keyInt: 2.2, fogDens: 0.022,
      textSlide: 'bottom',
    },
    {
      /* Scene 1 — Ground-level right sweep, car lifts + spins 3/4 rear-left */
      camPos:    { x:  3.5, y: 0.3,  z: 5.5 },
      camLookAt: { x: -0.5, y: 0.8,  z: 0   },
      carPos:    { x: -1.8, y:  0.5, z:  1.5 },
      carRotX:  -0.06,  carRotY: Math.PI * 0.7,  carRotZ: -0.08,
      carScale:  1.15,
      rimInt: 3.8, keyInt: 1.8, fogDens: 0.014,
      textSlide: 'top',
    },
    {
      /* Scene 2 — Mid-height straight-on, car dips back down, slight Z tilt */
      camPos:    { x:  0,   y: 1.5,  z: 5.0 },
      camLookAt: { x:  0,   y: 0.4,  z: 0   },
      carPos:    { x:  0.6, y:  0,   z:  0.8 },
      carRotX:   0.0,   carRotY: Math.PI * 0.18, carRotZ:  0.12,
      carScale:  1.08,
      rimInt: 1.8, keyInt: 3.2, fogDens: 0.030,
      textSlide: 'left',
    },
  ];

  function init() {
    if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) { showFallback(); return; }

    const THREE = window.THREE;
    const canvas = document.getElementById('intro3dCanvas');
    if (!canvas) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) { showFallback(); return; }

    function setSize() {
      const w = canvas.parentElement.offsetWidth || window.innerWidth;
      const h = canvas.parentElement.offsetHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    const scene = new THREE.Scene();
    const fog = new THREE.FogExp2(0x000000, 0.025);
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
    camera.position.set(2.5, 2.0, 7.0);
    setSize();
    window.addEventListener('resize', setSize);

    /* ── LIGHTS ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    const keyLight = new THREE.DirectionalLight(0xfff5e0, 2.8);
    keyLight.position.set(6, 9, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00bfff, 2.0);
    rimLight.position.set(-5, 2, -5);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xc9a84c, 1.2, 16);
    fillLight.position.set(0, -1.2, 2);
    scene.add(fillLight);

    /* ── GROUND ── */
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.ShadowMaterial({ opacity: 0.3 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.12;
    ground.receiveShadow = true;
    scene.add(ground);

    /* ── GROUND RING ── */
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.9, 2.8, 64),
      new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.06, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -1.1;
    scene.add(ring);

    /* ── PARTICLES ── */
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(280 * 3);
    for (let i = 0; i < 280; i++) {
      pPos[i*3]   = (Math.random()-0.5)*16;
      pPos[i*3+1] = (Math.random()-0.5)*9;
      pPos[i*3+2] = (Math.random()-0.5)*16;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0xc9a84c, size: 0.038, transparent: true, opacity: 0.5, sizeAttenuation: true,
    }));
    scene.add(particles);

    /* ── CAR GROUP ── */
    const carGroup = new THREE.Group();
    scene.add(carGroup);

    let modelReady = false;

    function onLoaded(gltf) {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const scale = 3.2 / Math.max(size.x, size.y, size.z);
      model.scale.setScalar(scale);
      box.setFromObject(model);
      model.position.y = -box.min.y;
      model.traverse(function (obj) {
        if (!obj.isMesh) return;
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach(m => { m.envMapIntensity = 1.8; m.needsUpdate = true; });
        }
      });
      carGroup.add(model);
      modelReady = true;
    }

    function onError(e) {
      console.warn('intro3d: model load failed', e);
      modelReady = true;
    }

    if (typeof GLB_MODEL2_DATA !== 'undefined') {
      new THREE.GLTFLoader().load(GLB_MODEL2_DATA, onLoaded, undefined, onError);
    } else {
      onError(new Error('GLB_MODEL2_DATA not found'));
    }

    /* ── STATE ── */
    const state = {
      camX: SCENES[0].camPos.x, camY: SCENES[0].camPos.y, camZ: SCENES[0].camPos.z,
      lookX: SCENES[0].camLookAt.x, lookY: SCENES[0].camLookAt.y, lookZ: SCENES[0].camLookAt.z,
      carX: SCENES[0].carPos.x, carY: -4.0, carZ: SCENES[0].carPos.z,
      carRotX: SCENES[0].carRotX, carRotY: SCENES[0].carRotY, carRotZ: SCENES[0].carRotZ,
      carScale: 0, carOpacity: 0,
      rimInt: SCENES[0].rimInt, keyInt: SCENES[0].keyInt, fogDens: SCENES[0].fogDens,
    };

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    document.addEventListener('mousemove', e => {
      mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

    const startTime = performance.now();
    const ENTRANCE_DURATION = 1200;
    let sectionEntered = false;
    let entranceStart = null;

    function syncText(idx, slide) {
      document.querySelectorAll('.cin2-scene').forEach((el, i) => {
        const active = i === idx;
        el.classList.toggle('cin2-active', active);
        if (active && slide) el.dataset.slide = slide;
      });
    }

    /* ── PROGRESS BAR ── */
    const bar = document.getElementById('cin2ProgressBar');

    let lastTime = performance.now();

    function animate() {
      requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const elapsed = now / 1000;

      /* entrance trigger — start counting when section is in view */
      const track = document.getElementById('cin2ScrollTrack');
      if (!track) { renderer.render(scene, camera); return; }

      const trackTop = track.getBoundingClientRect().top + scrollY;
      const inView = scrollY >= trackTop - window.innerHeight * 0.8;
      if (inView && !sectionEntered) {
        sectionEntered = true;
        entranceStart = now;
      }

      const entranceT = sectionEntered
        ? easeOutQuart(clamp((now - entranceStart) / ENTRANCE_DURATION, 0, 1))
        : 0;

      /* scroll progress within this section */
      const totalH = track.offsetHeight - window.innerHeight;
      const localScroll = clamp(scrollY - trackTop, 0, totalH);
      const rawProg = totalH > 0 ? localScroll / totalH : 0;

      const sceneCount = SCENES.length - 1;
      const sceneFloat = rawProg * sceneCount;
      const sceneIdx   = Math.floor(clamp(sceneFloat, 0, sceneCount - 1));
      const sceneT     = easeInOutCubic(sceneFloat - sceneIdx);

      const A = SCENES[sceneIdx];
      const B = SCENES[Math.min(sceneIdx + 1, sceneCount)];

      syncText(sceneIdx, A.textSlide);
      if (bar) bar.style.width = (rawProg * 100) + '%';

      const lerpSpeed = 4 * delta;

      state.camX  = lerp(state.camX,  lerp(A.camPos.x, B.camPos.x, sceneT), lerpSpeed);
      state.camY  = lerp(state.camY,  lerp(A.camPos.y, B.camPos.y, sceneT), lerpSpeed);
      state.camZ  = lerp(state.camZ,  lerp(A.camPos.z, B.camPos.z, sceneT), lerpSpeed);
      state.lookX = lerp(state.lookX, lerp(A.camLookAt.x, B.camLookAt.x, sceneT), lerpSpeed);
      state.lookY = lerp(state.lookY, lerp(A.camLookAt.y, B.camLookAt.y, sceneT), lerpSpeed);
      state.lookZ = lerp(state.lookZ, lerp(A.camLookAt.z, B.camLookAt.z, sceneT), lerpSpeed);

      /* entrance slides UP from below (Y offset) — opposite of hero */
      const entranceOffY = (1 - entranceT) * -4.5;
      state.carX    = lerp(state.carX,    lerp(A.carPos.x, B.carPos.x, sceneT), lerpSpeed * 0.88);
      state.carY    = lerp(state.carY,    lerp(A.carPos.y, B.carPos.y, sceneT), lerpSpeed * 0.9);
      state.carZ    = lerp(state.carZ,    lerp(A.carPos.z, B.carPos.z, sceneT), lerpSpeed * 0.85);
      state.carRotX = lerp(state.carRotX, lerp(A.carRotX,  B.carRotX,  sceneT), lerpSpeed * 0.6);
      state.carRotY = lerp(state.carRotY, lerp(A.carRotY,  B.carRotY,  sceneT), lerpSpeed * 0.6);
      state.carRotZ = lerp(state.carRotZ, lerp(A.carRotZ,  B.carRotZ,  sceneT), lerpSpeed * 0.6);
      state.carScale   = lerp(state.carScale,   lerp(A.carScale, B.carScale, sceneT) * entranceT, lerpSpeed);
      state.carOpacity = lerp(state.carOpacity, modelReady ? entranceT : 0, lerpSpeed * 1.5);

      state.rimInt  = lerp(state.rimInt,  lerp(A.rimInt,  B.rimInt,  sceneT), lerpSpeed);
      state.keyInt  = lerp(state.keyInt,  lerp(A.keyInt,  B.keyInt,  sceneT), lerpSpeed);
      state.fogDens = lerp(state.fogDens, lerp(A.fogDens, B.fogDens, sceneT), lerpSpeed);

      mouse.x = lerp(mouse.x, mouse.tx, 0.06);
      mouse.y = lerp(mouse.y, mouse.ty, 0.06);

      /* camera mouse parallax — inverted Y vs hero for different feel */
      camera.position.set(state.camX + mouse.x * 0.3, state.camY + mouse.y * 0.25, state.camZ);
      camera.lookAt(state.lookX, state.lookY, state.lookZ);

      carGroup.position.set(state.carX, state.carY + entranceOffY, state.carZ);
      /* all 3 rotation axes — unique vs hero which only uses Y */
      carGroup.rotation.x = state.carRotX + Math.sin(elapsed * 0.28) * 0.008;
      carGroup.rotation.y = state.carRotY + Math.sin(elapsed * 0.41) * 0.014;
      carGroup.rotation.z = state.carRotZ + Math.sin(elapsed * 0.19) * 0.006;
      carGroup.scale.setScalar(Math.max(0.001, state.carScale));

      carGroup.traverse(obj => {
        if (obj.isMesh && obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach(m => {
            if ('opacity' in m) {
              m.transparent = state.carOpacity < 0.999;
              m.opacity = clamp(state.carOpacity, 0, 1);
            }
          });
        }
      });

      rimLight.intensity  = state.rimInt + Math.sin(elapsed * 1.2) * 0.12;
      keyLight.intensity  = state.keyInt;
      fog.density         = state.fogDens;

      ring.material.opacity = 0.04 + Math.sin(elapsed * 0.9) * 0.02;
      ring.position.y = -1.1 + Math.sin(elapsed * 0.65) * 0.018;

      particles.rotation.y += delta * 0.012;
      particles.rotation.x += delta * 0.003;

      renderer.render(scene, camera);
    }

    animate();
  }

  /* ── LAZY INIT on intersection ── */
  function lazyInit() {
    if (!window.THREE || !window.THREE.GLTFLoader) return;
    const track = document.getElementById('cin2ScrollTrack');
    if (!track) return;
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { io.disconnect(); init(); }
      }, { threshold: 0.01 });
      io.observe(track);
    } else {
      init();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lazyInit);
  } else {
    lazyInit();
  }
})();
