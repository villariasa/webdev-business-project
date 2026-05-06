/* ============================================================
   VILLARIAS MOTORS — SECOND CINEMATIC 3D SECTION (intro)
   Uses direct GLB loading, 3 scroll scenes
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

  function getPerfQuality() {
    const perf = window.VMPerformance;
    const mode = perf ? perf.getRenderMode() : '3d-lite';
    return perf ? perf.getQuality(mode) : {
      mode: mode,
      antialias: false,
      dprCap: 1.25,
      shadows: false,
      shadowMapSize: 512,
      particleScale: 0.45,
      effectsScale: 0.5,
      physicallyCorrectLights: false,
    };
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
    const quality = getPerfQuality();
    if (quality.mode === 'static-fallback') { showFallback(); return; }

    const THREE = window.THREE;
    const canvas = document.getElementById('intro3dCanvas');
    if (!canvas) return;
    canvas.style.display = 'block';

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: quality.antialias,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (e) { showFallback(); return; }

    function setSize() {
      const w = canvas.parentElement.offsetWidth || window.innerWidth;
      const h = canvas.parentElement.offsetHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.dprCap));
    renderer.shadowMap.enabled = quality.shadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.physicallyCorrectLights = quality.physicallyCorrectLights;

    const scene = new THREE.Scene();
    const fog = new THREE.FogExp2(0x000000, 0.014);
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
    camera.position.set(2.5, 2.0, 7.0);
    setSize();
    window.addEventListener('resize', setSize);

    /* ── LIGHTS ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const keyLight = new THREE.DirectionalLight(0xfff5e0, 4.0);
    keyLight.position.set(6, 9, 4);
    keyLight.castShadow = quality.shadows;
    keyLight.shadow.mapSize.set(quality.shadowMapSize, quality.shadowMapSize);
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x4fc3f7, 2.4);
    rimLight.position.set(-5, 2, -5);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xc9a84c, 1.6, 20);
    fillLight.position.set(0, -1.2, 2);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xc9a84c, 1.2);
    backLight.position.set(0, 2, -6);
    scene.add(backLight);

    const envGen = new THREE.PMREMGenerator(renderer);
    envGen.compileEquirectangularShader();
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x111111);
    [
      { color: 0xfff5e0, intensity: 4.0, pos: [6, 9, 4] },
      { color: 0x4fc3f7, intensity: 2.5, pos: [-5, 2, -5] },
      { color: 0xc9a84c, intensity: 1.8, pos: [0, -2, 2] },
      { color: 0xffffff, intensity: 1.2, pos: [-4, 4, 2] },
    ].forEach(function(l) {
      var dl = new THREE.DirectionalLight(l.color, l.intensity);
      dl.position.set(l.pos[0], l.pos[1], l.pos[2]);
      envScene.add(dl);
    });
    scene.environment = envGen.fromScene(envScene).texture;

    /* ── GROUND ── */
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.ShadowMaterial({ opacity: 0.3 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.12;
    ground.receiveShadow = quality.shadows;
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
    const P_COUNT = Math.max(70, Math.round(280 * quality.particleScale));
    const pPos = new Float32Array(P_COUNT * 3);
    for (let i = 0; i < P_COUNT; i++) {
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

    /* ── 1. SPEED LINES ── */
    var SL2_COUNT = Math.max(24, Math.round(80 * quality.effectsScale));
    var sl2Geo = new THREE.BufferGeometry();
    var sl2Pos = new Float32Array(SL2_COUNT * 6);
    for (var i = 0; i < SL2_COUNT; i++) {
      var sx = (Math.random()-0.5)*24, sy = (Math.random()-0.5)*12, sz = (Math.random()-0.5)*8 - 2;
      sl2Pos[i*6]=sx; sl2Pos[i*6+1]=sy; sl2Pos[i*6+2]=sz;
      sl2Pos[i*6+3]=sx; sl2Pos[i*6+4]=sy; sl2Pos[i*6+5]=sz-0.8;
    }
    sl2Geo.setAttribute('position', new THREE.BufferAttribute(sl2Pos, 3));
    var sl2Mat = new THREE.LineBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.0 });
    var speedLines2 = new THREE.LineSegments(sl2Geo, sl2Mat);
    scene.add(speedLines2);

    /* ── 2. GROUND REFLECTION ── */
    var refl2Mat = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 1.0, roughness: 0.0, transparent: true, opacity: 0.38 });
    var refl2Mesh = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), refl2Mat);
    refl2Mesh.rotation.x = -Math.PI / 2;
    refl2Mesh.position.y = -1.13;
    scene.add(refl2Mesh);

    /* ── 3. CAMERA SHAKE STATE ── */
    var shake2X = 0, shake2Y = 0;

    /* ── 4. EMBER PARTICLES ── */
    var EM2_COUNT = Math.max(20, Math.round(60 * quality.effectsScale));
    var em2Geo = new THREE.BufferGeometry();
    var em2Pos = new Float32Array(EM2_COUNT * 3);
    var em2Vel = [];
    for (var i = 0; i < EM2_COUNT; i++) {
      em2Pos[i*3]=(Math.random()-0.5)*10; em2Pos[i*3+1]=Math.random()*5-1; em2Pos[i*3+2]=(Math.random()-0.5)*10;
      em2Vel.push({ x:(Math.random()-0.5)*0.008, y:Math.random()*0.012+0.004, z:(Math.random()-0.5)*0.008 });
    }
    em2Geo.setAttribute('position', new THREE.BufferAttribute(em2Pos, 3));
    var em2Mat = new THREE.PointsMaterial({ color: 0xffaa33, size: 0.055, transparent: true, opacity: 0.7, sizeAttenuation: true });
    var embers2 = new THREE.Points(em2Geo, em2Mat);
    scene.add(embers2);

    /* ── 5. SPOTLIGHT ── */
    var spotLight2 = new THREE.SpotLight(0xfff5e0, 3.5, 18, Math.PI * 0.18, 0.4, 1.5);
    spotLight2.position.set(0, 10, 2);
    spotLight2.target.position.set(0, 0, 0);
    scene.add(spotLight2); scene.add(spotLight2.target);

    /* ── 6. RIM COLOR STATE ── */
    var rimColor2 = new THREE.Color(0x00bfff);

    /* ── 7. GRID PULSE ── */
    var gridHelper2 = new THREE.GridHelper(20, 20, 0xc9a84c, 0xc9a84c);
    gridHelper2.position.y = -1.14;
    gridHelper2.material.transparent = true;
    gridHelper2.material.opacity = 0.06;
    scene.add(gridHelper2);

    /* ── 8. HEADLIGHT FLARES ── */
    var flare2L = new THREE.PointLight(0xffffff, 0.0, 4);
    flare2L.position.set(0.6, 0.1, 1.8); carGroup.add(flare2L);
    var flare2R = new THREE.PointLight(0xffffff, 0.0, 4);
    flare2R.position.set(-0.6, 0.1, 1.8); carGroup.add(flare2R);

    var lastScrollYFx2 = 0, scrollSpeedFx2 = 0;

    /* ── B. NEON UNDERGLOW ── */
    var glow2A = new THREE.PointLight(0xc9a84c, 0.0, 5);
    glow2A.position.set( 0.8,-1.0, 0); carGroup.add(glow2A);
    var glow2B = new THREE.PointLight(0x00aaff, 0.0, 5);
    glow2B.position.set(-0.8,-1.0, 0); carGroup.add(glow2B);
    var glow2C = new THREE.PointLight(0xaa00ff, 0.0, 5);
    glow2C.position.set( 0,  -1.0, 1); carGroup.add(glow2C);
    var glow2Hue = 0;

    /* ── D. STAR FIELD ── */
    var star2Geo = new THREE.BufferGeometry();
    var STAR2_COUNT = Math.max(120, Math.round(400 * quality.effectsScale));
    var star2Pos = new Float32Array(STAR2_COUNT * 3);
    for (var sti2 = 0; sti2 < STAR2_COUNT; sti2++) {
      var th2 = Math.random()*Math.PI*2, ph2 = Math.acos(2*Math.random()-1), r2 = 35+Math.random()*15;
      star2Pos[sti2*3]=r2*Math.sin(ph2)*Math.cos(th2); star2Pos[sti2*3+1]=r2*Math.sin(ph2)*Math.sin(th2); star2Pos[sti2*3+2]=r2*Math.cos(ph2);
    }
    star2Geo.setAttribute('position', new THREE.BufferAttribute(star2Pos, 3));
    var star2Mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.35, sizeAttenuation: true });
    var stars2 = new THREE.Points(star2Geo, star2Mat);
    scene.add(stars2);


    let modelReady = false;
    let loadFailed = false;
    const fadeMaterials = [];
    let fadeComplete = false;

    function cacheFadeMaterial(material) {
      if (!material || !('opacity' in material)) return;
      fadeMaterials.push({
        material: material,
        opacity: material.opacity === undefined ? 1 : material.opacity,
        transparent: material.transparent,
      });
      material.transparent = true;
      material.opacity = 0;
    }

    function updateFadeMaterials(opacity) {
      if (fadeComplete || !fadeMaterials.length) return;
      const value = clamp(opacity, 0, 1);
      fadeMaterials.forEach(function (entry) {
        entry.material.opacity = entry.opacity * value;
      });
      if (value > 0.995) {
        fadeMaterials.forEach(function (entry) {
          entry.material.opacity = entry.opacity;
          entry.material.transparent = entry.transparent;
        });
        fadeComplete = true;
      }
    }

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
        obj.castShadow = quality.shadows;
        obj.receiveShadow = quality.shadows;
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach(m => {
            m.envMapIntensity = 2.8;
            if (m.metalness !== undefined) m.metalness = Math.max(m.metalness, 0.7);
            if (m.roughness !== undefined) m.roughness = Math.min(m.roughness, 0.35);
            cacheFadeMaterial(m);
            m.needsUpdate = true;
          });
        }
      });
      carGroup.add(model);
      modelReady = true;
    }

    function onError(e) {
      console.warn('intro3d: model load failed', e);
      showFallback();
      loadFailed = true;
      modelReady = false;
    }

    new THREE.GLTFLoader().load('assets/3d/3d-model.glb', onLoaded, undefined, onError);

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
    if (quality.mode === 'full-3d') {
      document.addEventListener('mousemove', e => {
        mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 2;
        mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      });
    }

    let scrollY = window.scrollY || 0;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

    const ENTRANCE_DURATION = 1200;
    let sectionEntered = false;
    let entranceStart = null;
    const track = document.getElementById('cin2ScrollTrack');
    let trackTop = 0;
    let totalH = window.innerHeight * 2;

    function refreshTrackMetrics() {
      if (!track) return;
      trackTop = track.getBoundingClientRect().top + window.scrollY;
      totalH = Math.max(track.offsetHeight - window.innerHeight, 1);
    }
    refreshTrackMetrics();
    window.addEventListener('resize', refreshTrackMetrics);

    const sceneEls = Array.prototype.slice.call(document.querySelectorAll('.cin2-scene'));
    let activeSceneIdx = -1;
    function syncText(idx, slide) {
      if (idx === activeSceneIdx) return;
      activeSceneIdx = idx;
      sceneEls.forEach((el, i) => {
        const active = i === idx;
        el.classList.toggle('cin2-active', active);
        if (active && slide) el.dataset.slide = slide;
      });
    }

    /* ── PROGRESS BAR ── */
    const bar = document.getElementById('cin2ProgressBar');

    let lastTime = performance.now();
    let rafId = 0;
    let isVisible = true;
    let firstRendered = false;

    function canRender() {
      return !loadFailed && isVisible && document.visibilityState !== 'hidden';
    }

    function startLoop() {
      if (rafId || !canRender()) return;
      lastTime = performance.now();
      if (canRender()) {
        rafId = requestAnimationFrame(animate);
      } else if (window.VMPerformance) {
        window.VMPerformance.setActive3d('none');
      }
      if (window.VMPerformance) window.VMPerformance.setActive3d('intro');
    }

    function stopLoop() {
      if (!rafId) return;
      cancelAnimationFrame(rafId);
      rafId = 0;
      if (window.VMPerformance) window.VMPerformance.setActive3d('none');
    }

    if (track && 'IntersectionObserver' in window) {
      const renderObserver = new IntersectionObserver(entries => {
        isVisible = entries[0].isIntersecting;
        if (isVisible) {
          refreshTrackMetrics();
          startLoop();
        } else {
          stopLoop();
        }
      }, { rootMargin: '220px 0px', threshold: 0.01 });
      renderObserver.observe(track);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') stopLoop();
      else startLoop();
    });

    function animate() {
      rafId = 0;
      if (!canRender()) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const elapsed = now / 1000;

      /* entrance trigger — start counting when section is in view */
      if (!track) { renderer.render(scene, camera); return; }

      const inView = scrollY >= trackTop - window.innerHeight * 0.8;
      if (inView && !sectionEntered) {
        sectionEntered = true;
        entranceStart = now;
      }

      const entranceT = sectionEntered
        ? easeOutQuart(clamp((now - entranceStart) / ENTRANCE_DURATION, 0, 1))
        : 0;

      /* scroll progress within this section */
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

      /* camera lookAt — position set by shake block below */
      camera.lookAt(state.lookX, state.lookY, state.lookZ);

      carGroup.position.set(state.carX, state.carY + entranceOffY, state.carZ);
      /* all 3 rotation axes — unique vs hero which only uses Y */
      carGroup.rotation.x = state.carRotX + Math.sin(elapsed * 0.28) * 0.008;
      carGroup.rotation.y = state.carRotY + Math.sin(elapsed * 0.41) * 0.014;
      carGroup.rotation.z = state.carRotZ + Math.sin(elapsed * 0.19) * 0.006;
      carGroup.scale.setScalar(Math.max(0.001, state.carScale));

      updateFadeMaterials(state.carOpacity);

      rimLight.intensity  = state.rimInt + Math.sin(elapsed * 1.2) * 0.12;
      keyLight.intensity  = state.keyInt;
      fog.density         = state.fogDens;

      ring.material.opacity = 0.04 + Math.sin(elapsed * 0.9) * 0.02;
      ring.position.y = -1.1 + Math.sin(elapsed * 0.65) * 0.018;

      particles.rotation.y += delta * 0.012;
      particles.rotation.x += delta * 0.003;

      /* ── SCROLL SPEED ── */
      scrollSpeedFx2 = lerp(scrollSpeedFx2, (scrollY - lastScrollYFx2) / (delta * 500 + 0.001), 0.15);
      lastScrollYFx2 = scrollY;
      var spd2 = clamp(Math.abs(scrollSpeedFx2), 0, 1);

      /* ── 1. SPEED LINES ── */
      sl2Mat.opacity = lerp(sl2Mat.opacity, spd2 * 0.55, 0.12);
      speedLines2.position.z = lerp(speedLines2.position.z, spd2 * 1.2, 0.1);

      /* ── 2. GROUND REFLECTION ── */
      refl2Mat.opacity = 0.22 + Math.sin(elapsed * 0.4) * 0.06;

      /* ── 3. CAMERA SHAKE ── */
      shake2X = lerp(shake2X, (Math.random()-0.5) * spd2 * 0.04, 0.2);
      shake2Y = lerp(shake2Y, (Math.random()-0.5) * spd2 * 0.025, 0.2);
      camera.position.set(state.camX + mouse.x * 0.3 + shake2X, state.camY + mouse.y * 0.25 + shake2Y, state.camZ);

      /* ── 4. EMBER DRIFT ── */
      var ep2 = em2Geo.attributes.position.array;
      for (var ei2 = 0; ei2 < EM2_COUNT; ei2++) {
        ep2[ei2*3] += em2Vel[ei2].x; ep2[ei2*3+1] += em2Vel[ei2].y; ep2[ei2*3+2] += em2Vel[ei2].z;
        if (ep2[ei2*3+1] > 5) { ep2[ei2*3+1]=-1; ep2[ei2*3]=(Math.random()-0.5)*10; ep2[ei2*3+2]=(Math.random()-0.5)*10; }
      }
      em2Geo.attributes.position.needsUpdate = true;
      em2Mat.opacity = 0.4 + spd2 * 0.4;

      /* ── 5. SPOTLIGHT PULSE ── */
      spotLight2.intensity = 2.5 + Math.sin(elapsed * 0.6) * 0.8;

      /* ── 6. RIM COLOR SHIFT ── */
      var hue2 = (rawProg * 0.18 + elapsed * 0.012) % 1;
      rimColor2.setHSL(hue2 + 0.55, 1.0, 0.6);
      rimLight.color.lerp(rimColor2, 0.03);

      /* ── 7. GRID PULSE ── */
      gridHelper2.material.opacity = 0.04 + spd2 * 0.12 + Math.sin(elapsed * 1.8) * 0.02;

      /* ── 8. HEADLIGHT FLARES ── */
      var flare2Base = 0.55 + Math.sin(elapsed * 2.1) * 0.12;
      var flare2Facing = clamp(1.0 - Math.abs(state.carRotY) * 0.6, 0.1, 1.0);
      flare2L.intensity = flare2Base * flare2Facing * state.carOpacity * 2.2 * quality.effectsScale;
      flare2R.intensity = flare2Base * flare2Facing * state.carOpacity * 2.2 * quality.effectsScale;

      /* ── B. NEON UNDERGLOW ── */
      glow2Hue = (glow2Hue + delta * 0.18) % 1;
      var g2c = new THREE.Color().setHSL(glow2Hue, 1.0, 0.55);
      glow2A.color.set(g2c); glow2A.intensity = (1.2 + Math.sin(elapsed * 2.1) * 0.5) * quality.effectsScale;
      var g2c2 = new THREE.Color().setHSL((glow2Hue+0.33)%1, 1.0, 0.55);
      glow2B.color.set(g2c2); glow2B.intensity = (1.2 + Math.sin(elapsed*1.7+1)*0.5) * quality.effectsScale;
      var g2c3 = new THREE.Color().setHSL((glow2Hue+0.66)%1, 1.0, 0.55);
      glow2C.color.set(g2c3); glow2C.intensity = (1.2 + Math.sin(elapsed*2.4+2)*0.5) * quality.effectsScale;

      /* ── D. STAR FIELD ── */
      stars2.rotation.y += delta * 0.004;

      renderer.render(scene, camera);
      if (!firstRendered && modelReady) {
        firstRendered = true;
        const fb = document.getElementById('intro3dFallback');
        if (fb) fb.style.display = 'none';
      }
      rafId = requestAnimationFrame(animate);
    }

    startLoop();
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
