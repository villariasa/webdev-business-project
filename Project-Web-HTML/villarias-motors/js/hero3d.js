/* ============================================================
   VILLARIAS MOTORS — SCROLL-DRIVEN CINEMATIC 3D HERO
   Three.js r134 · 4 scroll-bound scenes · particles · lighting
   ============================================================ */

(function () {
  'use strict';

  /* ── DEVICE CAPABILITY ─────────────────────────────────── */
  function isLowEnd() {
    const nav = window.navigator;
    if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) return true;
    if (nav.deviceMemory && nav.deviceMemory < 2) return true;
    if (/Mobi|Android|iPhone|iPad/i.test(nav.userAgent)) return true;
    return false;
  }

  function showStaticFallback() {
    const canvas = document.getElementById('hero3dCanvas');
    if (canvas) canvas.style.display = 'none';
    const fb = document.getElementById('hero3dFallback');
    if (fb) fb.style.display = 'block';
  }

  /* ── WAIT FOR THREE ────────────────────────────────────── */
  function waitForThree(cb) {
    if (window.THREE) { cb(); return; }
    let tries = 0;
    const iv = setInterval(() => {
      if (window.THREE) { clearInterval(iv); cb(); }
      if (++tries > 50) { clearInterval(iv); showStaticFallback(); }
    }, 100);
  }

  /* ── MATH HELPERS ──────────────────────────────────────── */
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function easeInOutCubic(t) { return t < 0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; }
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  /* ── SCROLL PROGRESS WITHIN A RANGE ───────────────────── */
  function scrollProgress(scrollY, start, end) {
    return clamp((scrollY - start) / (end - start), 0, 1);
  }

  /* ── SCENE KEYFRAMES ───────────────────────────────────── */
  /*
   * SCENE 0 (0–25% scroll):   Entrance — car fades/slides in from right, front view
   * SCENE 1 (25–50% scroll):  Move forward — car rushes toward camera on Z
   * SCENE 2 (50–75% scroll):  Side reveal — car rotates to show profile, zoom
   * SCENE 3 (75–100% scroll): Rear + CTA — car turns to rear view, pulls back, fades
   *
   * scrollable height = 4 × viewport height (set on #cinematic-scroll-track)
   */
  /*
   * HERO SCENES — car travels Z (depth), rotates Y, camera stays centred-ish
   * Text: slides LEFT on scene-0, RIGHT on scene-1, BOTTOM on scene-2, TOP on scene-3
   * Car entrance: slides in from RIGHT (positive X)
   */
  const SCENES = [
    {
      /* Scene 0 — Wide front-3/4 view, car right-of-centre */
      camPos:   { x:  1.0, y: 1.4,  z: 7.5 },
      camLookAt:{ x:  0.3, y: 0.5,  z: 0   },
      carPos:   { x:  1.2, y:  0,   z: -0.5 },
      carRot:   { x:  0,   y: -0.55, z: 0  },
      carScale: 1.0,
      rimIntensity: 1.8, keyIntensity: 3.2, fogDensity: 0.026,
      textSlide: 'left',
    },
    {
      /* Scene 1 — Camera dives low-right, car rushes forward on Z */
      camPos:   { x:  2.5, y: 0.5,  z: 4.8 },
      camLookAt:{ x:  0,   y: 0.8,  z: 0   },
      carPos:   { x: -0.5, y:  0,   z: 2.2 },
      carRot:   { x:  0,   y:  0.25, z: 0  },
      carScale: 1.08,
      rimIntensity: 2.8, keyIntensity: 4.0, fogDensity: 0.018,
      textSlide: 'right',
    },
    {
      /* Scene 2 — Camera sweeps high-left, car rotates to full side */
      camPos:   { x: -3.2, y: 2.2,  z: 6.0 },
      camLookAt:{ x:  0,   y: 0.2,  z: 0   },
      carPos:   { x:  0.4, y:  0,   z: 0.5 },
      carRot:   { x:  0,   y: Math.PI * 0.52, z: 0 },
      carScale: 1.12,
      rimIntensity: 3.4, keyIntensity: 2.2, fogDensity: 0.016,
      textSlide: 'bottom',
    },
    {
      /* Scene 3 — Camera pulls way back, car spins to rear + drifts left */
      camPos:   { x: -1.0, y: 1.8,  z: 9.5 },
      camLookAt:{ x:  0,   y: 0.3,  z: 0   },
      carPos:   { x: -1.4, y:  0,   z: -0.8 },
      carRot:   { x:  0,   y: Math.PI * 1.05, z: 0 },
      carScale: 0.88,
      rimIntensity: 1.0, keyIntensity: 1.6, fogDensity: 0.044,
      textSlide: 'top',
    },
  ];

  /* ── MAIN ──────────────────────────────────────────────── */
  function init() {
    if (isLowEnd()) { showStaticFallback(); return; }

    const THREE = window.THREE;
    const canvas = document.getElementById('hero3dCanvas');
    if (!canvas) return;

    /* ── RENDERER ── */
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) { showStaticFallback(); return; }

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
    renderer.toneMappingExposure = 1.25;

    /* ── SCENE ── */
    const scene = new THREE.Scene();
    const fog = new THREE.FogExp2(0x000000, 0.028);
    scene.fog = fog;

    /* ── CAMERA ── */
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    camera.position.set(0, 1.2, 7);
    camera.lookAt(0, 0.5, 0);
    setSize();
    window.addEventListener('resize', setSize);

    /* ── LIGHTS ── */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.18);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e0, 3.0);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00bfff, 1.8);
    rimLight.position.set(-6, 3, -4);
    scene.add(rimLight);

    const groundBounce = new THREE.PointLight(0xc9a84c, 1.0, 14);
    groundBounce.position.set(0, -1.5, 1);
    scene.add(groundBounce);

    const fillLight = new THREE.PointLight(0xffffff, 0.7, 22);
    fillLight.position.set(-4, 4, 2);
    scene.add(fillLight);

    /* ── GROUND ── */
    const groundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.ShadowMaterial({ opacity: 0.35 })
    );
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -1.12;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    /* ── GROUND REFLECTION RING ── */
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.8, 2.6, 64),
      new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.07, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -1.1;
    scene.add(ring);

    /* ── CAR GROUP ── */
    const carGroup = new THREE.Group();
    scene.add(carGroup);

    /* ── LOAD REAL GLB MODEL ── */
    let modelReady = false;

    function onGltfLoaded(gltf) {
      const model = gltf.scene;

      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3.2 / maxDim;
      model.scale.setScalar(scale);

      box.setFromObject(model);
      model.position.y = -box.min.y;

      model.traverse(function (obj) {
        if (!obj.isMesh) return;
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach(function (m) {
            m.envMapIntensity = 1.6;
            m.needsUpdate = true;
          });
        }
      });

      carGroup.add(model);
      modelReady = true;
    }

    function onGltfError(err) {
      console.warn('GLB load failed, using procedural mesh.', err);
      buildCarMesh(THREE, carGroup);
      modelReady = true;
    }

    /* Load from embedded base64 data URL — works on file:// and http:// */
    (function loadGlb() {
      var loader = new THREE.GLTFLoader();
      if (typeof GLB_MODEL_DATA !== 'undefined') {
        loader.load(GLB_MODEL_DATA, onGltfLoaded, undefined, onGltfError);
      } else {
        onGltfError(new Error('model-data.js not loaded'));
      }
    })();

    /* ── PARTICLES ── */
    const particles = buildParticles(THREE, scene);

    /* ── CURRENT STATE (interpolated toward targets) ── */
    const state = {
      camX: SCENES[0].camPos.x, camY: SCENES[0].camPos.y, camZ: SCENES[0].camPos.z,
      lookX: SCENES[0].camLookAt.x, lookY: SCENES[0].camLookAt.y, lookZ: SCENES[0].camLookAt.z,
      carX: 3.0, carY: 0, carZ: SCENES[0].carPos.z,
      carRotX: 0, carRotY: SCENES[0].carRot.y, carRotZ: 0,
      carScale: 0,
      rimInt: SCENES[0].rimIntensity,
      keyInt: SCENES[0].keyIntensity,
      fogDens: SCENES[0].fogDensity,
      carOpacity: 0,
    };
    /* modelReady gates opacity animation so model doesn't pop in */
    // (declared above near loader call)

    /* ── MOUSE PARALLAX ── */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    document.addEventListener('mousemove', e => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ── SCROLL ── */
    let scrollY = 0;
    let entranceDone = false;
    const ENTRANCE_DURATION = 1400; // ms
    const startTime = performance.now();

    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

    /* ── SCENE TEXT SYNC ── */
    function syncSceneText(sceneIdx, slide) {
      document.querySelectorAll('.cin-scene').forEach((el, i) => {
        const active = i === sceneIdx;
        el.classList.toggle('cin-active', active);
        if (active && slide) {
          el.dataset.slide = slide;
        }
      });
    }

    let lastTime = performance.now();

    /* ── ANIMATE ── */
    function animate() {
      requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const elapsed = now / 1000;

      /* entrance fade-in progress (0→1 in first 1.4s) */
      const entranceT = clamp((now - startTime) / ENTRANCE_DURATION, 0, 1);
      const entranceEased = easeOutQuart(entranceT);

      /* ── SCROLL-BASED SCENE INTERPOLATION ── */
      const scrollTrack = document.getElementById('cinematicScrollTrack');
      const totalScrollH = scrollTrack ? scrollTrack.offsetHeight - window.innerHeight : window.innerHeight * 3;

      /* progress 0–1 over entire scroll track */
      const rawProgress = clamp(scrollY / totalScrollH, 0, 1);

      /* map to scene index + sub-progress */
      const sceneCount = SCENES.length - 1;
      const sceneFloat = rawProgress * sceneCount;
      const sceneIdx   = Math.floor(clamp(sceneFloat, 0, sceneCount - 1));
      const sceneT     = easeInOutCubic(sceneFloat - sceneIdx);

      const A = SCENES[sceneIdx];
      const B = SCENES[Math.min(sceneIdx + 1, sceneCount)];

      /* target values */
      const tCamX   = lerp(A.camPos.x, B.camPos.x, sceneT);
      const tCamY   = lerp(A.camPos.y, B.camPos.y, sceneT);
      const tCamZ   = lerp(A.camPos.z, B.camPos.z, sceneT);
      const tLookX  = lerp(A.camLookAt.x, B.camLookAt.x, sceneT);
      const tLookY  = lerp(A.camLookAt.y, B.camLookAt.y, sceneT);
      const tLookZ  = lerp(A.camLookAt.z, B.camLookAt.z, sceneT);
      const tCarX   = lerp(A.carPos.x, B.carPos.x, sceneT);
      const tCarY   = lerp(A.carPos.y, B.carPos.y, sceneT);
      const tCarZ   = lerp(A.carPos.z, B.carPos.z, sceneT);
      const tRotY   = lerp(A.carRot.y, B.carRot.y, sceneT);
      const tScale  = lerp(A.carScale, B.carScale, sceneT);
      const tRim    = lerp(A.rimIntensity, B.rimIntensity, sceneT);
      const tKey    = lerp(A.keyIntensity, B.keyIntensity, sceneT);
      const tFog    = lerp(A.fogDensity, B.fogDensity, sceneT);

      /* scene text with slide direction */
      syncSceneText(sceneIdx, A.textSlide);

      /* smooth interpolation speed */
      const lerpSpeed = 4 * delta;

      state.camX  = lerp(state.camX,  tCamX,  lerpSpeed);
      state.camY  = lerp(state.camY,  tCamY,  lerpSpeed);
      state.camZ  = lerp(state.camZ,  tCamZ,  lerpSpeed);
      state.lookX = lerp(state.lookX, tLookX, lerpSpeed);
      state.lookY = lerp(state.lookY, tLookY, lerpSpeed);
      state.lookZ = lerp(state.lookZ, tLookZ, lerpSpeed);

      /* car position — entrance slides in from right */
      const entranceOffsetX = (1 - entranceEased) * 4.5;
      state.carX  = lerp(state.carX,  tCarX,  lerpSpeed * 0.9);
      state.carY  = lerp(state.carY,  tCarY,  lerpSpeed);
      state.carZ  = lerp(state.carZ,  tCarZ,  lerpSpeed * 0.85);
      state.carRotY = lerp(state.carRotY, tRotY, lerpSpeed * 0.65);
      state.carScale = lerp(state.carScale, tScale * entranceEased, lerpSpeed);
      state.carOpacity = lerp(state.carOpacity, modelReady ? entranceEased : 0, lerpSpeed * 1.5);

      state.rimInt = lerp(state.rimInt, tRim, lerpSpeed);
      state.keyInt = lerp(state.keyInt, tKey, lerpSpeed);
      state.fogDens= lerp(state.fogDens, tFog, lerpSpeed);

      /* ── MOUSE PARALLAX ── */
      mouse.x = lerp(mouse.x, mouse.tx, 0.06);
      mouse.y = lerp(mouse.y, mouse.ty, 0.06);

      /* ── APPLY TO THREE.JS ── */
      camera.position.set(
        state.camX + mouse.x * 0.5,
        state.camY - mouse.y * 0.3,
        state.camZ
      );
      camera.lookAt(state.lookX, state.lookY, state.lookZ);

      carGroup.position.set(state.carX + entranceOffsetX, state.carY, state.carZ);
      carGroup.rotation.y = state.carRotY + Math.sin(elapsed * 0.32) * 0.018;
      carGroup.scale.setScalar(state.carScale);

      /* fade-in all materials */
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

      /* lights */
      rimLight.intensity  = state.rimInt + Math.sin(elapsed * 1.3) * 0.15;
      keyLight.intensity  = state.keyInt;
      fog.density         = state.fogDens;

      /* ring pulse */
      ring.material.opacity = 0.04 + Math.sin(elapsed * 1.1) * 0.025;
      ring.position.y = -1.1 + Math.sin(elapsed * 0.7) * 0.02;

      /* particles drift */
      if (particles) {
        particles.rotation.y += delta * 0.015;
        particles.rotation.x += delta * 0.004;
      }

      renderer.render(scene, camera);
    }

    animate();
  }

  /* ── BUILD PARTICLES ───────────────────────────────────── */
  function buildParticles(THREE, scene) {
    const count = 320;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xc9a84c,
      size: 0.04,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);
    return points;
  }

  /* ── BUILD STYLIZED CAR MESH ───────────────────────────── */
  function buildCarMesh(THREE, group) {
    function mat(opts) {
      return new THREE.MeshStandardMaterial(Object.assign({ transparent: true, opacity: 0 }, opts));
    }
    function physMat(opts) {
      return new THREE.MeshPhysicalMaterial(Object.assign({ transparent: true, opacity: 0 }, opts));
    }

    const bodyMat  = mat({ color: 0xcc1500, metalness: 0.92, roughness: 0.10, envMapIntensity: 1.6 });
    const chromeMat= mat({ color: 0xa8b2c1, metalness: 1.0,  roughness: 0.04 });
    const glassMat = physMat({ color: 0x88ccff, metalness: 0, roughness: 0.04, transmission: 0.88, thickness: 0.2 });
    const tireMat  = mat({ color: 0x111111, metalness: 0.05, roughness: 0.95 });
    const rimMat   = mat({ color: 0xc9a84c, metalness: 1.0,  roughness: 0.06 });
    const glowMat  = mat({ color: 0xc9a84c, emissive: 0xc9a84c, emissiveIntensity: 1.8 });

    function addMesh(geo, material, x, y, z, rx, ry, rz, shadow) {
      const m = new THREE.Mesh(geo, material);
      m.position.set(x || 0, y || 0, z || 0);
      if (rx) m.rotation.x = rx;
      if (ry) m.rotation.y = ry;
      if (rz) m.rotation.z = rz;
      if (shadow !== false) { m.castShadow = true; m.receiveShadow = true; }
      group.add(m);
      return m;
    }

    /* body */
    const bodyGeo = new THREE.BoxGeometry(3.8, 0.55, 1.7, 3, 2, 3);
    taperGeo(bodyGeo);
    addMesh(bodyGeo, bodyMat, 0, -0.35, 0);

    /* cabin */
    const cabinGeo = new THREE.BoxGeometry(1.8, 0.55, 1.5, 2, 2, 2);
    shapeCabin(cabinGeo);
    addMesh(cabinGeo, bodyMat.clone(), -0.05, 0.08, 0);

    /* hood */
    addMesh(new THREE.BoxGeometry(1.1, 0.08, 1.6), bodyMat.clone(), 1.45, -0.13, 0, 0, 0, -0.18);

    /* windshield */
    const ws = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.48), glassMat);
    ws.position.set(0.85, 0.18, 0); ws.rotation.y = Math.PI / 2; ws.rotation.z = -0.42;
    group.add(ws);

    /* rear window */
    const rw = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.38), glassMat.clone());
    rw.position.set(-0.92, 0.18, 0); rw.rotation.y = Math.PI / 2; rw.rotation.z = 0.42;
    group.add(rw);

    /* spoiler */
    addMesh(new THREE.BoxGeometry(0.12, 0.28, 1.4), chromeMat, -2.0, 0.05, 0);
    addMesh(new THREE.BoxGeometry(0.55, 0.055, 1.6), bodyMat.clone(), -2.0, 0.2, 0);

    /* side skirts */
    [-0.85, 0.85].forEach(z => addMesh(new THREE.BoxGeometry(3.4, 0.12, 0.12), chromeMat.clone(), 0, -0.6, z));

    /* underglow */
    addMesh(new THREE.BoxGeometry(3.2, 0.02, 1.6), glowMat, 0, -0.68, 0, 0, 0, 0, false);

    /* headlights */
    buildHeadlight(THREE, group, chromeMat,  1.8, -0.22,  0.72);
    buildHeadlight(THREE, group, chromeMat,  1.8, -0.22, -0.72);

    /* tail lights */
    buildTaillight(THREE, group, -1.82, -0.22,  0.72);
    buildTaillight(THREE, group, -1.82, -0.22, -0.72);

    /* wheels */
    [
      { x:  1.15, z:  0.92 },
      { x:  1.15, z: -0.92 },
      { x: -1.15, z:  0.92 },
      { x: -1.15, z: -0.92 },
    ].forEach(p => buildWheel(THREE, group, tireMat, rimMat, p.x, -0.72, p.z));

    /* front grille */
    addMesh(new THREE.BoxGeometry(0.08, 0.22, 1.0), chromeMat.clone(), 1.9, -0.3, 0);
    const grilleM = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.85),
      mat({ color: 0x111111, metalness: 0.3, roughness: 0.8 }));
    grilleM.position.set(1.91, -0.32, 0); grilleM.rotation.y = Math.PI / 2;
    group.add(grilleM);

    group.position.set(0, -0.1, 0);
    group.scale.setScalar(0);
  }

  function buildWheel(THREE, group, tireMat, rimMat, x, y, z) {
    const wg = new THREE.Group();
    const tire = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.14, 16, 40), tireMat);
    tire.rotation.y = Math.PI / 2; tire.castShadow = true;
    wg.add(tire);
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 32), rimMat);
    disc.rotation.z = Math.PI / 2;
    for (let i = 0; i < 5; i++) {
      const sp = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.03), rimMat);
      sp.rotation.z = (i / 5) * Math.PI * 2;
      disc.add(sp);
    }
    wg.add(disc);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.1, 12),
      new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0, transparent: true, opacity: 0 }));
    hub.rotation.z = Math.PI / 2;
    wg.add(hub);
    wg.position.set(x, y, z);
    group.add(wg);
  }

  function buildHeadlight(THREE, group, chromeMat, x, y, z) {
    const housing = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.32), chromeMat.clone());
    housing.position.set(x, y, z); group.add(housing);
    const lensMat = new THREE.MeshPhysicalMaterial({
      color: 0xfff5cc, emissive: 0xfff5cc, emissiveIntensity: 2.2,
      transparent: true, transmission: 0.5, opacity: 0 });
    const lens = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5), lensMat);
    lens.position.set(x + 0.06, y, z); lens.rotation.z = -Math.PI / 2; group.add(lens);
    const pl = new THREE.PointLight(0xfff5cc, 0.8, 2.5);
    pl.position.set(x + 0.1, y, z); group.add(pl);
  }

  function buildTaillight(THREE, group, x, y, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.38),
      new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff2200, emissiveIntensity: 2.4, transparent: true, opacity: 0 }));
    m.position.set(x, y, z); group.add(m);
    const pl = new THREE.PointLight(0xff2200, 0.7, 2.0);
    pl.position.set(x - 0.1, y, z); group.add(pl);
  }

  /* ── GEOMETRY HELPERS ──────────────────────────────────── */
  function taperGeo(geo) {
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const t = Math.abs(x) / 2.0;
      pos.setZ(i, z * (1 - t * 0.12));
      if (y > 0) pos.setY(i, y * (1 - t * 0.25));
    }
    pos.needsUpdate = true; geo.computeVertexNormals();
  }

  function shapeCabin(geo) {
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i);
      if (y > 0) {
        const f = (x + 0.9) / 1.8;
        pos.setY(i, y * Math.max(0.1, 1 - Math.abs(f - 0.5) * 0.7));
      }
    }
    pos.needsUpdate = true; geo.computeVertexNormals();
  }

  /* ── LAZY TRIGGER ──────────────────────────────────────── */
  function lazyInit() {
    const hero = document.getElementById('cinematicScrollTrack') || document.getElementById('hero');
    if (!hero) { waitForThree(init); return; }
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { io.disconnect(); waitForThree(init); }
      }, { threshold: 0.01 });
      io.observe(hero);
    } else {
      waitForThree(init);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lazyInit);
  } else {
    lazyInit();
  }
})();
