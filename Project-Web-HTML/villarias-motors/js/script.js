/* ============================================================
   VILLARIAS MOTORS — MAIN SCRIPT
   ============================================================ */

const CARS = [
  { id:1,  brand:'Ferrari',      name:'SF90 Stradale',     tagline:'Hybrid hypercar icon',           price:507000,  top_speed:'211 mph', hp:'986 hp',   engine:'4.0L V8 Hybrid',    badge:'New',     color:'#FF2800', img:'assets/cars/car-1.png'  },
  { id:2,  brand:'Ferrari',      name:'LaFerrari Aperta',  tagline:'Open-air V12 perfection',         price:3100000, top_speed:'217 mph', hp:'963 hp',   engine:'6.3L V12 Hybrid',   badge:'Rare',    color:'#FF2800', img:'assets/cars/car-2.png'  },
  { id:3,  brand:'Lamborghini',  name:'Huracán EVO',       tagline:'Raw naturally aspirated fury',    price:261274,  top_speed:'202 mph', hp:'640 hp',   engine:'5.2L V10',           badge:'',        color:'#F5A623', img:'assets/cars/car-3.png'  },
  { id:4,  brand:'Lamborghini',  name:'Revuelto',          tagline:'V12 hybrid successor',            price:608358,  top_speed:'217 mph', hp:'1001 hp',  engine:'6.5L V12 Hybrid',   badge:'New',     color:'#F5A623', img:'assets/cars/car-4.png'  },
  { id:5,  brand:'Bugatti',      name:'Chiron Super Sport',tagline:'1600 hp of legend',               price:3900000, top_speed:'273 mph', hp:'1600 hp',  engine:'8.0L W16',           badge:'Ultra',   color:'#00BFFF', img:'assets/cars/car-5.png'  },
  { id:6,  brand:'Porsche',      name:'911 GT3 RS',        tagline:'Motorsport DNA for the road',     price:225250,  top_speed:'184 mph', hp:'525 hp',   engine:'4.0L Flat-6',        badge:'',        color:'#0091FF', img:'assets/cars/car-6.png'  },
  { id:7,  brand:'Porsche',      name:'918 Spyder',        tagline:'The hybrid that changed history', price:845000,  top_speed:'214 mph', hp:'887 hp',   engine:'4.6L V8 Hybrid',     badge:'Rare',    color:'#0091FF', img:'assets/cars/car-7.png'  },
  { id:8,  brand:'McLaren',      name:'720S Spider',       tagline:'Aerodynamic engineering art',     price:315000,  top_speed:'212 mph', hp:'720 hp',   engine:'4.0L V8 Twin-T',     badge:'',        color:'#FF6600', img:'assets/cars/car-8.png'  },
  { id:9,  brand:'McLaren',      name:'Senna',             tagline:'Named for a legend',              price:958966,  top_speed:'208 mph', hp:'789 hp',   engine:'4.0L V8 Twin-T',     badge:'Limited', color:'#FF6600', img:'assets/cars/car-9.png'  },
  { id:10, brand:'Bugatti',      name:'Veyron 16.4',       tagline:'The car that rewrote the rules',  price:2700000, top_speed:'267 mph', hp:'1001 hp',  engine:'8.0L W16',           badge:'Classic', color:'#00BFFF', img:'assets/cars/car-10.png' },
  { id:11, brand:'Rolls-Royce',  name:'Phantom Coupe',     tagline:'The pinnacle of opulence',        price:460000,  top_speed:'155 mph', hp:'563 hp',   engine:'6.75L V12',          badge:'',        color:'#C9A84C', img:'assets/cars/car-11.png' },
  { id:12, brand:'Rolls-Royce',  name:'Ghost Black Badge', tagline:'Darker, more powerful',           price:380000,  top_speed:'155 mph', hp:'591 hp',   engine:'6.75L V12',          badge:'',        color:'#C9A84C', img:'assets/cars/car-12.png' },
  { id:13, brand:'Aston Martin', name:'Valkyrie',          tagline:'F1 for the street',               price:2600000, top_speed:'217 mph', hp:'1160 hp',  engine:'6.5L V12 Hybrid',    badge:'Ultra',   color:'#00CC66', img:'assets/cars/car-13.png' },
  { id:14, brand:'Aston Martin', name:'DBS 770 Ultimate',  tagline:'Final chapter of the DBS',        price:340000,  top_speed:'211 mph', hp:'770 hp',   engine:'5.2L V12',           badge:'Limited', color:'#00CC66', img:'assets/cars/car-14.png' },
  { id:15, brand:'Ferrari',      name:'Monza SP2',         tagline:'Open-air V12 barchetta',          price:1750000, top_speed:'186 mph', hp:'809 hp',   engine:'6.5L V12',           badge:'Limited', color:'#FF2800', img:'assets/cars/car-15.png' },
  { id:16, brand:'Lamborghini',  name:'Urus Performante',  tagline:'The fastest super-SUV',           price:265000,  top_speed:'190 mph', hp:'657 hp',   engine:'4.0L V8 Twin-T',     badge:'',        color:'#F5A623', img:'assets/cars/car-16.png' },
  { id:17, brand:'McLaren',      name:'P1 GTR',            tagline:'Track-only perfection',           price:3100000, top_speed:'225 mph', hp:'1000 hp',  engine:'3.8L V8 Hybrid',     badge:'Rare',    color:'#FF6600', img:'assets/cars/car-17.png' },
  { id:18, brand:'Porsche',      name:'Taycan Turbo GT',   tagline:'Electric 870 hp precision',       price:195700,  top_speed:'190 mph', hp:'870 hp',   engine:'Dual Electric',      badge:'EV',      color:'#0091FF', img:'assets/cars/car-18.png' },
  { id:19, brand:'Bugatti',      name:'Divo',              tagline:'Handling over top speed',         price:5000000, top_speed:'236 mph', hp:'1479 hp',  engine:'8.0L W16',           badge:'Ultra',   color:'#00BFFF', img:'assets/cars/car-19.png' },
  { id:20, brand:'Aston Martin', name:'DB12',              tagline:'The new super tourer',            price:245000,  top_speed:'202 mph', hp:'671 hp',   engine:'4.0L V8 Twin-T',     badge:'New',     color:'#00CC66', img:'assets/cars/car-20.png' },
  { id:21, brand:'Rolls-Royce',  name:'Spectre',           tagline:'First fully electric Rolls',      price:420000,  top_speed:'155 mph', hp:'577 hp',   engine:'Dual Electric',      badge:'EV',      color:'#C9A84C', img:'assets/cars/car-21.png' },
  { id:22, brand:'Ferrari',      name:'Purosangue',        tagline:'Ferraris first ever SUV',         price:400000,  top_speed:'193 mph', hp:'715 hp',   engine:'6.5L V12',           badge:'New',     color:'#FF2800', img:'assets/cars/car-22.png' },
];

// ── CAR FEATURES DATA ─────────────────────────────────────
const CAR_FEATURES = {
  1:  [
    { label:'Performance',  img:'assets/car-features/car1-f1.png',  desc:'986 hp hybrid V8 catapults from 0–100 in 2.5 seconds.' },
    { label:'Interior',     img:'assets/car-features/car1-f2.png',  desc:'Handcrafted cabin fusing Alcantara, carbon fibre and digital precision.' },
    { label:'Technology',   img:'assets/car-features/car1-f3.png',  desc:'eManettino switch cycles four electrified driving modes instantly.' },
    { label:'Comfort',      img:'assets/car-features/car1-f4.png',  desc:'Active suspension and magnetic dampers absorb every imperfection.' },
  ],
  2:  [
    { label:'Performance',  img:'assets/car-features/car2-f1.png',  desc:'963 hp V12 hybrid open-air machine, 0–100 in 2.9 seconds.' },
    { label:'Interior',     img:'assets/car-features/car2-f2.png',  desc:'Bespoke removable hardtop with carbon-reinforced roll hoops.' },
    { label:'Technology',   img:'assets/car-features/car2-f3.png',  desc:'Kinetic energy recovery system feeding electric motors on demand.' },
    { label:'Comfort',      img:'assets/car-features/car2-f4.png',  desc:'Wind deflector and climate seats for open-top grand touring.' },
  ],
  3:  [
    { label:'Performance',  img:'assets/car-features/car3-f1.png',  desc:'640 hp naturally aspirated V10 screaming to 8,500 rpm.' },
    { label:'Interior',     img:'assets/car-features/car3-f2.png',  desc:'Driver-focused cockpit with Lamborghini Alcantara steering.' },
    { label:'Technology',   img:'assets/car-features/car3-f3.png',  desc:'LDVI predictive all-wheel-drive system reads road in milliseconds.' },
    { label:'Comfort',      img:'assets/car-features/car3-f4.png',  desc:'Strada mode softens ride for effortless daily city driving.' },
  ],
  4:  [
    { label:'Performance',  img:'assets/car-features/car4-f1.png',  desc:'1,001 hp V12 hybrid successor to the Aventador flagship.' },
    { label:'Interior',     img:'assets/car-features/car4-f2.png',  desc:'Futuristic cockpit wrapped in full-colour digital interface.' },
    { label:'Technology',   img:'assets/car-features/car4-f3.png',  desc:'Three electric motors plus V12 form a 3-motor hybrid architecture.' },
    { label:'Comfort',      img:'assets/car-features/car4-f4.png',  desc:'Adaptive suspension balances track aggression with road civility.' },
  ],
  5:  [
    { label:'Performance',  img:'assets/car-features/car5-f1.png',  desc:'1,600 hp quad-turbo W16 engine, 0–100 in 2.4 seconds.' },
    { label:'Interior',     img:'assets/car-features/car5-f2.png',  desc:'Bespoke leather and carbon interior with floating centre console.' },
    { label:'Technology',   img:'assets/car-features/car5-f3.png',  desc:'Seven-speed dual-clutch gearbox with paddle-shift in 100 ms.' },
    { label:'Comfort',      img:'assets/car-features/car5-f4.png',  desc:'Hydropneumatic suspension auto-levels for imperious grand touring.' },
  ],
  6:  [
    { label:'Performance',  img:'assets/car-features/car6-f1.png',  desc:'525 hp flat-six naturally aspirated, revving freely to 9,000 rpm.' },
    { label:'Interior',     img:'assets/car-features/car6-f2.png',  desc:'Motorsport bucket seats and roll cage-ready lightweight cabin.' },
    { label:'Technology',   img:'assets/car-features/car6-f3.png',  desc:'Active aerodynamics generate 409 kg of downforce at top speed.' },
    { label:'Comfort',      img:'assets/car-features/car6-f4.png',  desc:'PCCB ceramic brakes offer fade-free stopping from 200 mph.' },
  ],
  7:  [
    { label:'Performance',  img:'assets/car-features/car7-f1.png',  desc:'887 hp V8 hybrid capable of 214 mph without compromising fuel economy.' },
    { label:'Interior',     img:'assets/car-features/car7-f2.png',  desc:'Panoramic glass roof flooding cockpit with natural light.' },
    { label:'Technology',   img:'assets/car-features/car7-f3.png',  desc:'Two front electric motors enable torque vectoring on demand.' },
    { label:'Comfort',      img:'assets/car-features/car7-f4.png',  desc:'PASM chassis with rear-axle steering for urban manoeuvrability.' },
  ],
  8:  [
    { label:'Performance',  img:'assets/car-features/car8-f1.png',  desc:'720 hp twin-turbo V8 with retractable hard top in 11 seconds.' },
    { label:'Interior',     img:'assets/car-features/car8-f2.png',  desc:'Driver-centric Alcantara wrapped interior with MSO options.' },
    { label:'Technology',   img:'assets/car-features/car8-f3.png',  desc:'Proactive chassis control II anticipates road surfaces in real time.' },
    { label:'Comfort',      img:'assets/car-features/car8-f4.png',  desc:'Comfort suspension setting transforms 720S into a refined GT.' },
  ],
  9:  [
    { label:'Performance',  img:'assets/car-features/car9-f1.png',  desc:'789 hp V8 producing the most downforce of any road-legal McLaren.' },
    { label:'Interior',     img:'assets/car-features/car9-f2.png',  desc:'F1-inspired central driving position puts you at the apex.' },
    { label:'Technology',   img:'assets/car-features/car9-f3.png',  desc:'Inertia push rods and active aero work in unison below 250 km/h.' },
    { label:'Comfort',      img:'assets/car-features/car9-f4.png',  desc:'Hydraulic steering delivers unfiltered road feel and precision.' },
  ],
  10: [
    { label:'Performance',  img:'assets/car-features/car10-f1.png', desc:'1,001 hp W16 that reset the world top-speed record at 253 mph.' },
    { label:'Interior',     img:'assets/car-features/car10-f2.png', desc:'Hand-stitched two-tone leather with polished aluminium accents.' },
    { label:'Technology',   img:'assets/car-features/car10-f3.png', desc:'Seven-speed DSG gearbox with Haldex all-wheel-drive management.' },
    { label:'Comfort',      img:'assets/car-features/car10-f4.png', desc:'Pneumatic suspension raises ride height for ramp approach angles.' },
  ],
  11: [
    { label:'Performance',  img:'assets/car-features/car11-f1.png', desc:'563 hp twin-turbo V12 wrapped in serene, cathedral-quiet refinement.' },
    { label:'Interior',     img:'assets/car-features/car11-f2.png', desc:'Starlight headliner with 1,340 hand-sewn fibre-optic stars.' },
    { label:'Technology',   img:'assets/car-features/car11-f3.png', desc:'Night Vision and four-camera Park Assist for effortless luxury.' },
    { label:'Comfort',      img:'assets/car-features/car11-f4.png', desc:'Magic Carpet Ride air suspension floats over any surface.' },
  ],
  12: [
    { label:'Performance',  img:'assets/car-features/car12-f1.png', desc:'591 hp Black Badge V12 with 50 nm more torque than standard Ghost.' },
    { label:'Interior',     img:'assets/car-features/car12-f2.png', desc:'Darkened chrome and carbon fibre accents define Black Badge excess.' },
    { label:'Technology',   img:'assets/car-features/car12-f3.png', desc:'Satellite Aided Transmission pre-selects gears before every bend.' },
    { label:'Comfort',      img:'assets/car-features/car12-f4.png', desc:'Planar suspension system provides unparalleled body isolation.' },
  ],
  13: [
    { label:'Performance',  img:'assets/car-features/car13-f1.png', desc:'1,160 hp naturally aspirated V12 co-developed with Red Bull Racing.' },
    { label:'Interior',     img:'assets/car-features/car13-f2.png', desc:'FIA-certified racing harness and HANS-compatible roll structure.' },
    { label:'Technology',   img:'assets/car-features/car13-f3.png', desc:'DRS rear wing deploys electronically to slash aerodynamic drag.' },
    { label:'Comfort',      img:'assets/car-features/car13-f4.png', desc:'Reactive spring system enables road legality without compromising pace.' },
  ],
  14: [
    { label:'Performance',  img:'assets/car-features/car14-f1.png', desc:'770 hp twin-turbo V12 — the most powerful production Aston ever.' },
    { label:'Interior',     img:'assets/car-features/car14-f2.png', desc:'Bridge of Weir leather with carbon fibre inlays throughout.' },
    { label:'Technology',   img:'assets/car-features/car14-f3.png', desc:'Electronic rear differential and torque vectoring for precise exits.' },
    { label:'Comfort',      img:'assets/car-features/car14-f4.png', desc:'Adaptive dampers offer GT touring mode for long-distance comfort.' },
  ],
  15: [
    { label:'Performance',  img:'assets/car-features/car15-f1.png', desc:'809 hp V12 barchetta with zero roof and pure wind-in-hair drama.' },
    { label:'Interior',     img:'assets/car-features/car15-f2.png', desc:'Minimalist carbonfibre cockpit strips every gram to essentials.' },
    { label:'Technology',   img:'assets/car-features/car15-f3.png', desc:'Virtual windscreen channels airflow over occupants at speed.' },
    { label:'Comfort',      img:'assets/car-features/car15-f4.png', desc:'Manettino offers Wet, Comfort, Sport, Race, and Qualify modes.' },
  ],
  16: [
    { label:'Performance',  img:'assets/car-features/car16-f1.png', desc:'657 hp twin-turbo V8 SUV hitting 100 km/h in 3.3 seconds flat.' },
    { label:'Interior',     img:'assets/car-features/car16-f2.png', desc:'5-seat cabin with Lamborghini sport seats and open-pore carbon.' },
    { label:'Technology',   img:'assets/car-features/car16-f3.png', desc:'Lamborghini Dynamic Vehicle Control coordinates torque to all wheels.' },
    { label:'Comfort',      img:'assets/car-features/car16-f4.png', desc:'Air suspension and active anti-roll bars tame body roll at cornering.' },
  ],
  17: [
    { label:'Performance',  img:'assets/car-features/car17-f1.png', desc:'1,000 hp V8 hybrid, built for track-only extra-sensory speed.' },
    { label:'Interior',     img:'assets/car-features/car17-f2.png', desc:'Full harness, helmet accommodation and FIA-grade roll cage.' },
    { label:'Technology',   img:'assets/car-features/car17-f3.png', desc:'DRS system and active front axle aerodynamics for downforce mastery.' },
    { label:'Comfort',      img:'assets/car-features/car17-f4.png', desc:'Bespoke air cooling system maintains driver temperature on track.' },
  ],
  18: [
    { label:'Performance',  img:'assets/car-features/car18-f1.png', desc:'870 hp dual-motor EV with 0–100 in 2.5 seconds and PDCC Sport.' },
    { label:'Interior',     img:'assets/car-features/car18-f2.png', desc:'GT Sport seats with integrated belt guides and Race-Tex upholstery.' },
    { label:'Technology',   img:'assets/car-features/car18-f3.png', desc:'800-volt architecture enables 270 kW DC fast-charge capability.' },
    { label:'Comfort',      img:'assets/car-features/car18-f4.png', desc:'Active suspension with air springs and electromechanical roll bars.' },
  ],
  19: [
    { label:'Performance',  img:'assets/car-features/car19-f1.png', desc:'1,479 hp quad-turbo W16 tuned for lateral grip over raw top speed.' },
    { label:'Interior',     img:'assets/car-features/car19-f2.png', desc:'Body-hugging carbon-framed seats with double-layer Alcantara finish.' },
    { label:'Technology',   img:'assets/car-features/car19-f3.png', desc:'Front slit and rear NACA ducts generate 90 kg more downforce than Chiron.' },
    { label:'Comfort',      img:'assets/car-features/car19-f4.png', desc:'Adaptive air suspension lowers 35 mm in Sport mode at 180 km/h.' },
  ],
  20: [
    { label:'Performance',  img:'assets/car-features/car20-f1.png', desc:'671 hp twin-turbo V8 with 8-speed automatic, 0–100 in 3.6 seconds.' },
    { label:'Interior',     img:'assets/car-features/car20-f2.png', desc:'55 standard leather options and an array of piano-black trims.' },
    { label:'Technology',   img:'assets/car-features/car20-f3.png', desc:'Aston Martin\'s latest infotainment with wireless Apple CarPlay.' },
    { label:'Comfort',      img:'assets/car-features/car20-f4.png', desc:'Sport Plus seats with 14-way power adjustment and heating.' },
  ],
  21: [
    { label:'Performance',  img:'assets/car-features/car21-f1.png', desc:'577 hp dual-motor EV — Rolls-Royce\'s first fully electric motor car.' },
    { label:'Interior',     img:'assets/car-features/car21-f2.png', desc:'Illuminated Fascia with 5,500 LEDs creates celestial ambient lighting.' },
    { label:'Technology',   img:'assets/car-features/car21-f3.png', desc:'Fully adaptive air suspension with noise-cancelling road-sensing.' },
    { label:'Comfort',      img:'assets/car-features/car21-f4.png', desc:'Four-zone climate and reclining rear seats for limousine serenity.' },
  ],
  22: [
    { label:'Performance',  img:'assets/car-features/car22-f1.png', desc:'715 hp naturally aspirated V12 SUV, Ferrari\'s first in its history.' },
    { label:'Interior',     img:'assets/car-features/car22-f2.png', desc:'2+2 seating with rear individual bucket seats for four adults.' },
    { label:'Technology',   img:'assets/car-features/car22-f3.png', desc:'Active suspension with integrated Ferrari Dynamic Enhancer Pro.' },
    { label:'Comfort',      img:'assets/car-features/car22-f4.png', desc:'Panoramic glass roof spanning the full width of the cabin.' },
  ],
};

// ── CART ──────────────────────────────────────────────────
const Cart = {
  get()  { try { return JSON.parse(localStorage.getItem('vm_cart') || '[]'); } catch(e){ return []; } },
  save(d){ localStorage.setItem('vm_cart', JSON.stringify(d)); },
  add(car) {
    let cart = this.get();
    if (!cart.find(c => c.id === car.id)) { cart.push(car); this.save(cart); }
    this.updateCount();
    showToast(car.name + ' added to your cart.');
  },
  remove(id) {
    this.save(this.get().filter(c => c.id !== id));
    this.updateCount();
    renderCartPage();
  },
  count(){ return this.get().length; },
  total(){ return this.get().reduce((s,c) => s + c.price, 0); },
  updateCount() {
    const n = this.count();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = n;
      el.style.display = n > 0 ? 'flex' : 'none';
    });
  }
};

// ── FORMAT ────────────────────────────────────────────────
function fmtPrice(n) {
  return '$' + new Intl.NumberFormat('en-US').format(n);
}

// ── TOAST ─────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timeout);
  t._timeout = setTimeout(() => t.classList.remove('show'), 3200);
}

// ── CURSOR ────────────────────────────────────────────────
function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;
  if (window.VMPerformance && !window.VMPerformance.shouldUseCustomCursor()) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
    document.body.classList.add('native-cursor');
    document.body.style.cursor = 'auto';
    return;
  }
  let mx=0, my=0, fx=0, fy=0;
  let rafId = 0;
  let pointerInside = true;
  document.addEventListener('mousemove', e => {
    mx=e.clientX; my=e.clientY;
    cursor.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0) translate(-50%,-50%)';
    pointerInside = true;
    if (!rafId && document.visibilityState !== 'hidden') rafId = requestAnimationFrame(followAnim);
  });
  document.addEventListener('mouseleave', () => {
    pointerInside = false;
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    pointerInside = true;
    cursor.style.opacity = '';
    follower.style.opacity = '';
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    } else if (!rafId) {
      rafId = requestAnimationFrame(followAnim);
    }
  });
  function followAnim(){
    rafId = 0;
    if (!pointerInside || document.visibilityState === 'hidden') return;
    fx += (mx-fx)*.12; fy += (my-fy)*.12;
    follower.style.transform = 'translate3d(' + fx + 'px,' + fy + 'px,0) translate(-50%,-50%)';
    rafId = requestAnimationFrame(followAnim);
  }
  rafId = requestAnimationFrame(followAnim);
  document.querySelectorAll('a,button,[data-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ── NAVBAR ────────────────────────────────────────────────
function initNav() {
  const nav = document.querySelector('nav');
  if (nav) {
    let isScrolled = window.scrollY > 50;
    nav.classList.toggle('scrolled', isScrolled);
    window.addEventListener('scroll', () => {
      const next = window.scrollY > 50;
      if (next === isScrolled) return;
      isScrolled = next;
      nav.classList.toggle('scrolled', isScrolled);
    }, { passive: true });
  }
  const toggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('mobile-open'));
  }
}

// ── SCROLL REVEAL ─────────────────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-up');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// ── STAT COUNTER ──────────────────────────────────────────
function initCounters() {
  const els = document.querySelectorAll('[data-target]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const target = parseInt(e.target.dataset.target);
      let start = 0;
      const step = target / 60;
      const iv = setInterval(() => {
        start += step;
        if (start >= target) { start = target; clearInterval(iv); }
        e.target.textContent = Math.floor(start);
      }, 20);
    });
  }, { threshold: 0.4 });
  els.forEach(el => io.observe(el));
}

// ── GSAP ANIMATIONS ───────────────────────────────────────
function initGSAP() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const page = document.body.dataset.page;

  if (page === 'home') {
    const cinStats = document.getElementById('heroStats');
    if (cinStats) gsap.from(cinStats, { y:30, opacity:0, duration:1, ease:'power3.out', delay:1.3 });
  }

  document.querySelectorAll('.reveal').forEach(el => {
    ScrollTrigger.create({ trigger:el, start:'top 88%', onEnter:() => el.classList.add('revealed') });
  });
}

// ── PREMIUM CINEMATIC SHOWROOM SLIDER ─────────────────────
/*
 * HOW IT WORKS:
 *
 * CENTER DETECTION:
 *   currentIndex tracks which car is active. goTo(index) is the
 *   single source of truth that drives all visual state changes.
 *
 * SNAPPING:
 *   The track uses GSAP to animate to exactly: -(index * ITEM_W)
 *   relative to the stage center. On drag end, we find the closest
 *   index via Math.round(dragOffset / ITEM_W) and snap to it.
 *
 * PARALLAX:
 *   Each car's image wrapper (.vm-car-img-wrap) gets a subtle
 *   translateX offset = (index - currentIndex) * PARALLAX_FACTOR.
 *   This makes images appear to move faster than the track itself,
 *   creating a layered 3D depth effect.
 *
 * 3D TILT (HOVER):
 *   mousemove inside a car item maps cursor position to rotateX/Y
 *   via GSAP, giving a live card-tilt feel. On mouseleave we
 *   return to 0 rotation.
 *
 * BG TRANSITION:
 *   Each car has a .color property. On goTo(), GSAP tweens the
 *   background radial-gradient of .vm-showroom-bg-layer to use
 *   that car's accent color at low opacity.
 */
function buildSlider() {
  const track   = document.getElementById('vmTrack');
  const stage   = document.getElementById('vmStage');
  const section = document.getElementById('vmShowroom');
  const bgLayer = document.getElementById('vmBgLayer');
  const dotsEl  = document.getElementById('vmDots');
  const progBar = document.getElementById('vmProgressBar');
  const infoName  = document.getElementById('vmActiveName');
  const infoBrand = document.getElementById('vmActiveBrand');
  const infoPrice = document.getElementById('vmActivePrice');
  if (!track || !stage) return;
  const bgTextTrack  = document.getElementById('vmBgTextTrack');
  const bgTextNodes  = { l1: [], l2: [] }; // layer-1 (large) and layer-2 (gold) per car

  const ITEM_W       = 380;   // px width per car slot (must match CSS .vm-car-item width)
  const PARALLAX     = 28;    // px parallax offset factor per slot
  const TILT_MAX     = 12;    // degrees max tilt on hover
  const TEXT_SLOT_H  = 220;   // px height per car name "slot" in the bg text track
  let currentIndex   = 0;
  let isDragging     = false;
  let hasDragged     = false;
  let dragStartX     = 0;
  let dragStartOff   = 0;
  let currentOffset  = 0;     // current track translateX value
  let velocity       = 0;
  let lastX          = 0;
  let snapTimeout    = null;
  const items        = [];    // references to DOM nodes

  // ── BUILD HTML ──
  track.innerHTML = CARS.map((car, i) => {
    const previewHTML = '';
    return `
    <div class="vm-car-item" data-id="${car.id}" data-index="${i}" style="--vm-car-color:${car.color}">
      ${car.badge ? `<div class="vm-car-badge">${car.badge}</div>` : ''}
      <div class="vm-car-img-wrap">
        <div class="vm-car-glow" style="background:${car.color};"></div>
        <div class="vm-car-shadow"></div>
        <img src="${car.img}" alt="${car.name}" class="vm-car-img"
             loading="lazy" decoding="async" onerror="this.style.opacity='0'"/>
      </div>
      <div class="vm-car-card">
        <span class="vm-car-card-brand">${car.brand}</span>
        <div class="vm-car-card-name">${car.name}</div>
        <div class="vm-car-card-price">${fmtPrice(car.price)}</div>
        <div class="vm-car-card-actions">
          <button class="vm-btn-add" data-id="${car.id}">Add to Cart</button>
          <button class="vm-btn-detail" data-id="${car.id}" title="Details">⊞</button>
        </div>
        ${previewHTML}
      </div>
    </div>`;
  }).join('');

  // ── BUILD BACKGROUND TEXT TRACK ──
  // For each car we create two stacked text nodes (layer-1 large white, layer-2 smaller gold).
  // They are arranged vertically in a column. When the slider moves horizontally,
  // we translateY the entire text track so the "active" car's text is vertically centered.
  if (bgTextTrack) {
    bgTextTrack.innerHTML = CARS.map((car, i) => `
      <div class="vm-bg-name layer-1${i===0?' is-active':''}" data-bg-idx="${i}">${car.name}</div>
      <div class="vm-bg-name layer-2${i===0?' is-active':''}" data-bg-idx="${i}">${car.brand}</div>
    `).join('');
    bgTextTrack.querySelectorAll('.vm-bg-name.layer-1').forEach(el => bgTextNodes.l1.push(el));
    bgTextTrack.querySelectorAll('.vm-bg-name.layer-2').forEach(el => bgTextNodes.l2.push(el));
  }

  // ── BG TEXT SYNC: horizontal slider index → vertical translateY ──
  // Each car occupies TEXT_SLOT_H px in the text track.
  // targetY = -(activeIndex * TEXT_SLOT_H) centers that car's text block.
  // Sliding RIGHT (index increases) → targetY decreases → text moves UP.
  // Sliding LEFT  (index decreases) → targetY increases → text moves DOWN.
  function syncBgText(index, instant) {
    if (!bgTextTrack) return;
    const targetY = -(index * TEXT_SLOT_H);
    if (instant) {
      gsap.set(bgTextTrack, { y: targetY });
    } else {
      gsap.to(bgTextTrack, { y: targetY, duration: .75, ease: 'power3.out' });
    }
    // Highlight active car's text nodes; dim others
    bgTextNodes.l1.forEach((el, i) => el.classList.toggle('is-active', i === index));
    bgTextNodes.l2.forEach((el, i) => el.classList.toggle('is-active', i === index));
  }

  // ── BG TEXT LIVE SYNC during drag (maps track translateX to text translateY) ──
  // As the user drags, we compute the fractional index from track position and
  // animate the text track proportionally for a continuous synchronized feel.
  function liveTextSync(trackX) {
    if (!bgTextTrack) return;
    // fractional index = how far we are from item[0] center
    const fracIdx = (centerOff() - trackX) / ITEM_W;
    // layer-1: direct mapping; layer-2: slight delay factor for parallax depth
    gsap.set(bgTextTrack, { y: -(fracIdx * TEXT_SLOT_H) });
  }

  // ── BUILD DOTS ──
  if (dotsEl) {
    dotsEl.innerHTML = CARS.map((_, i) =>
      `<button class="vm-dot${i===0?' is-active':''}" data-dot="${i}" aria-label="Go to car ${i+1}"></button>`
    ).join('');
    dotsEl.addEventListener('click', e => {
      const btn = e.target.closest('.vm-dot');
      if (btn) goTo(parseInt(btn.dataset.dot));
    });
  }

  // ── CACHE ITEMS ──
  track.querySelectorAll('.vm-car-item').forEach(el => items.push(el));

  // ── TRACK WIDTH: center first item ──
  // Stage center offset so item[0] starts centered
  const stageW    = () => stage.getBoundingClientRect().width || window.innerWidth;
  const centerOff = () => (stageW() / 2) - (ITEM_W / 2);

  function applyTrackTranslate(x) {
    currentOffset = x;
    gsap.set(track, { x: x });
  }

  // ── GOTO ── (snap to index with GSAP, update all visual states)
  function goTo(index, instant) {
    index = Math.max(0, Math.min(CARS.length - 1, index));
    currentIndex = index;
    const targetX = centerOff() - index * ITEM_W;

    if (instant) {
      applyTrackTranslate(targetX);
    } else {
      gsap.to(track, {
        x: targetX,
        duration: .75,
        ease: 'expo.out',
        onUpdate: () => { currentOffset = gsap.getProperty(track, 'x'); }
      });
    }

    updateVisuals(index);
    syncBgText(index, instant);
  }

  // ── UPDATE VISUAL STATE per index ──
  function updateVisuals(activeIdx) {
    items.forEach((item, i) => {
      const dist  = i - activeIdx;           // distance from center
      const abs   = Math.abs(dist);
      const scale = abs === 0 ? 1.15 : Math.max(0.75, 1 - abs * 0.13);
      const opac  = abs === 0 ? 1    : Math.max(0.35, 1 - abs * 0.25);
      const zIdx  = 100 - abs * 10;

      // Keep this transform-only. Animating CSS filters across the whole carousel
      // causes repeated paints and visible drag jank.
      gsap.to(item, {
        scale,
        opacity: opac,
        zIndex: zIdx,
        duration: .6,
        ease: 'power3.out',
      });

      // PARALLAX: shift image wrapper horizontally
      // Car images move faster than the track bg — creates depth
      const imgWrap = item.querySelector('.vm-car-img-wrap');
      if (imgWrap) {
        gsap.to(imgWrap, {
          x: -dist * PARALLAX,
          duration: .6,
          ease: 'power3.out',
        });
      }

      item.classList.toggle('is-active', i === activeIdx);
    });

    // ── BG TRANSITION: smoothly blend car's color into background ──
    const car = CARS[activeIdx];
    if (bgLayer && car) {
      bgLayer.style.setProperty('--active-car-rgb', hexToRgbParts(car.color));
    }

    // ── DOTS ──
    if (dotsEl) {
      dotsEl.querySelectorAll('.vm-dot').forEach((d, i) =>
        d.classList.toggle('is-active', i === activeIdx));
    }

    // ── PROGRESS BAR ──
    if (progBar) {
      progBar.style.width = ((activeIdx / (CARS.length - 1)) * 100) + '%';
    }

    // ── FOOTER INFO ── (animated with GSAP clip)
    if (car) {
      if (infoName)  { gsap.fromTo(infoName,  { y:12, opacity:0 }, { y:0, opacity:1, duration:.45, ease:'power3.out' }); infoName.textContent  = car.name; }
      if (infoBrand) { infoBrand.textContent = car.brand; }
      if (infoPrice) { infoPrice.textContent = fmtPrice(car.price); }
    }
  }

  // ── DRAG-TO-SCROLL with inertia ──
  stage.addEventListener('mousedown', e => {
    isDragging  = true;
    hasDragged  = false;
    dragStartX  = e.clientX;
    dragStartOff= currentOffset;
    lastX       = e.clientX;
    velocity    = 0;
    gsap.killTweensOf(track);
    stage.classList.add('is-dragging');
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    velocity   = e.clientX - lastX;
    lastX      = e.clientX;
    const dx   = e.clientX - dragStartX;
    if (Math.abs(dx) > 5) hasDragged = true;
    const newX = dragStartOff + dx;
    gsap.set(track, { x: newX });
    currentOffset = newX;
    liveParallax(newX);
    liveTextSync(newX);
    e.preventDefault();
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    stage.classList.remove('is-dragging');
    snapAfterDrag();
  });

  // Touch support
  stage.addEventListener('touchstart', e => {
    dragStartX   = e.touches[0].clientX;
    dragStartOff = currentOffset;
    lastX        = dragStartX;
    velocity     = 0;
    gsap.killTweensOf(track);
  }, { passive:true });
  stage.addEventListener('touchmove', e => {
    velocity     = e.touches[0].clientX - lastX;
    lastX        = e.touches[0].clientX;
    const dx     = e.touches[0].clientX - dragStartX;
    const newX   = dragStartOff + dx;
    gsap.set(track, { x: newX });
    currentOffset = newX;
    liveParallax(newX);
    liveTextSync(newX);
  }, { passive:true });
  stage.addEventListener('touchend', () => snapAfterDrag(), { passive:true });

  // ── SNAP AFTER DRAG ──
  // Find closest index based on where the track currently sits,
  // then apply a velocity nudge for inertia feel before snapping.
  function snapAfterDrag() {
    const co     = centerOff();
    // rawIndex: how far we've moved from center in item units
    const rawIdx = (co - currentOffset) / ITEM_W;
    // nudge by velocity (inertia feel) — clamp to ±1.5 items
    const nudge  = Math.max(-1.5, Math.min(1.5, -velocity / 60));
    const snapped = Math.round(rawIdx + nudge);
    goTo(snapped);
  }

  // ── LIVE PARALLAX during drag ──
  function liveParallax(trackX) {
    items.forEach((item, i) => {
      const imgWrap = item.querySelector('.vm-car-img-wrap');
      if (!imgWrap) return;
      // Compute how far this item is from visual center right now
      const itemCenterX = (centerOff()) + (i - currentIndex) * ITEM_W + trackX - (centerOff() - currentIndex * ITEM_W);
      const distFromCenter = i - currentIndex;
      gsap.set(imgWrap, { x: -distFromCenter * PARALLAX });
    });
  }

  // ── HOVER 3D TILT ──
  const enableHoverTilt = !window.matchMedia || window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (enableHoverTilt) items.forEach((item) => {
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const rx   = ((e.clientY - cy) / (rect.height / 2)) * TILT_MAX;
      const ry   = ((e.clientX - cx) / (rect.width  / 2)) * -TILT_MAX;
      gsap.to(item, {
        rotateX: rx, rotateY: ry,
        transformPerspective: 900,
        duration: .35, ease: 'power2.out', overwrite: 'auto'
      });
      // Intensify glow on hover
      const glow = item.querySelector('.vm-car-glow');
      if (glow) gsap.to(glow, { opacity:.9, duration:.3 });
    });

    item.addEventListener('mouseleave', () => {
      gsap.to(item, {
        rotateX: 0, rotateY: 0,
        duration: .5, ease: 'power3.out', overwrite: 'auto'
      });
      const glow = item.querySelector('.vm-car-glow');
      const isAct = item.classList.contains('is-active');
      if (glow) gsap.to(glow, { opacity: isAct ? .7 : .3, duration:.4 });
    });
  });

  // ── CLICK ──
  track.addEventListener('click', e => {
    if (hasDragged) { hasDragged = false; return; }

    const addBtn    = e.target.closest('.vm-btn-add');
    const detailBtn = e.target.closest('.vm-btn-detail');
    const featThumb = e.target.closest('.vm-feat-thumb');
    const carItem   = e.target.closest('.vm-car-item');

    if (addBtn)    { const car=CARS.find(c=>c.id==addBtn.dataset.id);    if(car) { Cart.add(car); return; } }
    if (detailBtn) { const car=CARS.find(c=>c.id==detailBtn.dataset.id); if(car) { openModal(car); return; } }
    if (featThumb) { openFeatureLightbox(featThumb.dataset.featImg, featThumb.dataset.featLabel); return; }
    if (carItem) {
      const idx = parseInt(carItem.dataset.index);
      if (idx !== currentIndex) {
        goTo(idx);
      } else {
        const car = CARS.find(c=>c.id==carItem.dataset.id);
        if (car) openModal(car);
      }
    }
  });

  // ── ARROW NAV ──
  document.getElementById('vmPrev')?.addEventListener('click', () => goTo(currentIndex - 1));
  document.getElementById('vmNext')?.addEventListener('click', () => goTo(currentIndex + 1));

  // ── KEYBOARD ──
  document.addEventListener('keydown', e => {
    if (!section) return;
    const r = section.getBoundingClientRect();
    if (r.top > window.innerHeight || r.bottom < 0) return;
    if (e.key === 'ArrowLeft')  goTo(currentIndex - 1);
    if (e.key === 'ArrowRight') goTo(currentIndex + 1);
  });

  // ── SCROLL TRIGGER entrance animation ──
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.from(items, {
          y: 60, opacity: 0, duration: .9,
          stagger: { each: .08, from: 'center' },
          ease: 'power3.out'
        });
      }
    });
  }

  // ── INIT ──
  // Position track immediately (no animation) so first car is centered
  goTo(0, true);
  // Slight delay to let layout settle then re-center
  setTimeout(() => goTo(0, true), 100);
}

// ── UTILITY: hex color to rgba ─────────────────────────────
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function hexToRgbParts(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r}, ${g}, ${b}`;
}

// ── FEATURE LIGHTBOX ──────────────────────────────────────
function openFeatureLightbox(src, label) {
  let lb = document.getElementById('featureLightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'featureLightbox';
    lb.className = 'feature-lightbox';
    lb.innerHTML = `
      <div class="flb-overlay"></div>
      <div class="flb-inner">
        <button class="flb-close" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <img class="flb-img" src="" alt="" decoding="async" />
        <div class="flb-label"></div>
      </div>`;
    document.body.appendChild(lb);
    lb.querySelector('.flb-overlay').addEventListener('click', closeFeatureLightbox);
    lb.querySelector('.flb-close').addEventListener('click', closeFeatureLightbox);
    document.addEventListener('keydown', e => { if (e.key==='Escape') closeFeatureLightbox(); });
  }
  lb.querySelector('.flb-img').src  = src;
  lb.querySelector('.flb-img').alt  = label;
  lb.querySelector('.flb-label').textContent = label;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeFeatureLightbox() {
  const lb = document.getElementById('featureLightbox');
  if (lb) {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ── BUILD FEATURES GRID HTML ───────────────────────────────
function buildFeaturesGridHTML(carId) {
  const feats = CAR_FEATURES[carId];
  if (!feats) return '';
  return `
    <div class="cf-section">
      <div class="cf-header">
        <span class="cf-eyebrow">CAR FEATURES</span>
        <h3 class="cf-title">Explore Every <span class="text-gold">Detail</span></h3>
      </div>
      <div class="cf-grid">
        ${feats.map((f, i) => `
          <div class="cf-card cf-card--${i}" data-feat-img="${f.img}" data-feat-label="${f.label}">
            <div class="cf-img-wrap">
              <img src="${f.img}" alt="${f.label}" class="cf-img" loading="lazy" decoding="async" onerror="this.closest('.cf-img-wrap').classList.add('cf-no-img')" />
              <div class="cf-img-overlay">
                <svg class="cf-zoom-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </div>
            </div>
            <div class="cf-card-body">
              <span class="cf-label">${f.label}</span>
              <p class="cf-desc">${f.desc}</p>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
}

// ── MODAL ─────────────────────────────────────────────────
function openModal(car) {
  const modal = document.getElementById('carModal');
  if (!modal) return;
  const imgEl = document.getElementById('modalCarImg');
  const badgeEl = document.getElementById('modalCarBadge');
  const brandEl = document.getElementById('modalBrand');
  const titleEl = document.getElementById('modalTitle');
  const priceEl = document.getElementById('modalPrice');
  const specsEl = document.getElementById('modalSpecs');
  const addBtn  = document.getElementById('modalAddCart');
  const featEl  = document.getElementById('modalFeatures');

  if (imgEl) { imgEl.src=car.img; imgEl.alt=car.name; imgEl.style.opacity='1'; }
  if (badgeEl) { badgeEl.textContent=car.badge||car.brand; badgeEl.style.display=car.badge?'block':'none'; }
  if (brandEl) brandEl.textContent = car.brand;
  if (titleEl) titleEl.textContent = car.name;
  if (priceEl) priceEl.textContent = fmtPrice(car.price);
  if (specsEl) specsEl.innerHTML = `
    <div class="modal-spec-item"><span class="modal-spec-label">Top Speed</span><span class="modal-spec-value">${car.top_speed}</span></div>
    <div class="modal-spec-item"><span class="modal-spec-label">Horsepower</span><span class="modal-spec-value">${car.hp}</span></div>
    <div class="modal-spec-item"><span class="modal-spec-label">Engine</span><span class="modal-spec-value">${car.engine}</span></div>
    <div class="modal-spec-item"><span class="modal-spec-label">Category</span><span class="modal-spec-value">${car.badge||'Production'}</span></div>`;
  if (addBtn) addBtn.dataset.id = car.id;
  if (featEl) {
    featEl.innerHTML = buildFeaturesGridHTML(car.id);
    featEl.querySelectorAll('.cf-card').forEach(card => {
      card.addEventListener('click', () => {
        openFeatureLightbox(card.dataset.featImg, card.dataset.featLabel);
      });
    });
    if (typeof gsap !== 'undefined') {
      gsap.from(featEl.querySelectorAll('.cf-card'), {
        y: 30, opacity: 0, duration: .6,
        stagger: .1, ease: 'power3.out', delay: .2
      });
    }
  }

  modal.classList.add('active');
  document.body.style.overflow='hidden';
}
function closeModal() {
  document.getElementById('carModal')?.classList.remove('active');
  document.body.style.overflow='';
}

// ── SERVICES / CARS GRID ──────────────────────────────────
function buildCarsGrid() {
  const grid = document.getElementById('carsGrid');
  if (!grid) return;

  function renderGrid(brand) {
    const list = brand==='all' ? CARS : CARS.filter(c=>c.brand===brand);
    grid.innerHTML = list.map(car => `
      <div class="car-card" data-brand="${car.brand}" data-id="${car.id}">
        ${car.badge ? `<div class="car-card-badge">${car.badge}</div>` : ''}
        <div class="car-card-img-wrap">
          <img src="${car.img}" alt="${car.name}" class="car-card-img" loading="lazy" decoding="async" onerror="this.style.opacity='0'"/>
          <div class="car-card-hover-overlay">
            <button class="cc-view-btn" data-id="${car.id}">View Details</button>
          </div>
        </div>
        <div class="car-card-body">
          <div class="car-card-brand">${car.brand}</div>
          <div class="car-card-name">${car.name}</div>
          <div class="car-card-desc">${car.tagline}</div>
          <div class="car-card-price">${fmtPrice(car.price)}</div>
        </div>
        <div class="car-card-footer">
          <button class="slide-add-btn" data-id="${car.id}">Add to Cart</button>
          <button class="slide-view-btn" data-id="${car.id}" title="Details">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </div>`).join('');

    const cards = grid.querySelectorAll('.car-card');
    cards.forEach(c => { c.style.opacity = '1'; c.style.transform = 'none'; });
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(cards,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: .5, stagger: .05, ease: 'power3.out', clearProps: 'all' }
      );
    }
  }

  renderGrid('all');

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderGrid(btn.dataset.brand);
    });
  });

  grid.addEventListener('click', e => {
    const addBtn  = e.target.closest('.slide-add-btn');
    if (addBtn)  { const car=CARS.find(c=>c.id==addBtn.dataset.id);  if(car) { Cart.add(car); return; } }
    const viewBtn = e.target.closest('.slide-view-btn');
    if (viewBtn) { const car=CARS.find(c=>c.id==viewBtn.dataset.id); if(car) { openModal(car); return; } }
    const ccBtn   = e.target.closest('.cc-view-btn');
    if (ccBtn)   { const car=CARS.find(c=>c.id==ccBtn.dataset.id);   if(car) { openModal(car); return; } }
    const card    = e.target.closest('.car-card');
    if (card && !e.target.closest('button')) {
      const car = CARS.find(c=>c.id==card.dataset.id);
      if (car) openModal(car);
    }
  });
}

// ── CART PAGE ─────────────────────────────────────────────
function renderCartPage() {
  const listEl     = document.getElementById('cartItemsList');
  const emptyEl    = document.getElementById('cartEmpty');
  const summaryEl  = document.getElementById('cartSummaryCol');
  const countEl    = document.getElementById('summaryCount');
  const subtotalEl = document.getElementById('summarySubtotal');
  const totalEl    = document.getElementById('summaryTotal');
  const upsellGrid = document.getElementById('upsellGrid');
  if (!listEl) return;

  const items = Cart.get();

  if (items.length === 0) {
    listEl.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'flex';
    if (summaryEl) summaryEl.style.display = 'none';
  } else {
    listEl.style.display = 'flex';
    if (emptyEl) emptyEl.style.display = 'none';
    if (summaryEl) summaryEl.style.display = 'block';

    listEl.innerHTML = items.map(car => `
      <div class="cart-item" id="ci-${car.id}">
        <div class="cart-item-img-wrap">
          <img src="${car.img}" alt="${car.name}" loading="lazy" decoding="async" onerror="this.style.opacity='0'"/>
        </div>
        <div class="cart-item-details">
          <span class="cart-item-brand">${car.brand}</span>
          <div class="cart-item-name">${car.name}</div>
          <div class="cart-item-price">${fmtPrice(car.price)}</div>
        </div>
        <button class="cart-item-remove" data-id="${car.id}" title="Remove">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>`).join('');

    const total = Cart.total();
    if (countEl)    countEl.textContent    = items.length + ' vehicle' + (items.length!==1?'s':'');
    if (subtotalEl) subtotalEl.textContent = fmtPrice(total);
    if (totalEl)    totalEl.textContent    = fmtPrice(total);

    listEl.addEventListener('click', e => {
      const btn = e.target.closest('.cart-item-remove');
      if (!btn) return;
      const el = document.getElementById('ci-'+btn.dataset.id);
      if (el) {
        gsap && gsap.to(el, { opacity:0, x:40, duration:.3, ease:'power2.in', onComplete:() => Cart.remove(parseInt(btn.dataset.id)) });
        if (!window.gsap) { el.style.opacity='0'; el.style.transition='opacity .3s'; setTimeout(() => Cart.remove(parseInt(btn.dataset.id)), 300); }
      }
    });
  }

  if (upsellGrid) {
    const cartIds = items.map(c=>c.id);
    const suggestions = CARS.filter(c=>!cartIds.includes(c.id)).slice(0,3);
    upsellGrid.innerHTML = suggestions.map(car => `
      <div class="car-card">
        ${car.badge ? `<div class="car-card-badge">${car.badge}</div>` : ''}
        <div class="car-card-img-wrap">
          <img src="${car.img}" alt="${car.name}" class="car-card-img" loading="lazy" decoding="async" onerror="this.style.opacity='0'"/>
        </div>
        <div class="car-card-body">
          <div class="car-card-brand">${car.brand}</div>
          <div class="car-card-name">${car.name}</div>
          <div class="car-card-price">${fmtPrice(car.price)}</div>
        </div>
        <div class="car-card-footer">
          <button class="slide-add-btn" data-id="${car.id}" style="flex:1;">Add to Cart</button>
        </div>
      </div>`).join('');

    upsellGrid.addEventListener('click', e => {
      const addBtn = e.target.closest('.slide-add-btn');
      if (addBtn) { const car=CARS.find(c=>c.id==addBtn.dataset.id); if(car) Cart.add(car); renderCartPage(); }
    });
  }
}

// ── REGISTER PAGE ─────────────────────────────────────────
function initRegisterForm() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  const togglePw = document.getElementById('togglePw');
  const pwInput  = document.getElementById('reg_password');
  if (togglePw && pwInput) {
    togglePw.addEventListener('click', () => {
      pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
    });
  }

  function setErr(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
    const fg = el?.closest('.form-group');
    if (fg) fg.querySelector('input,select') && (fg.querySelector('input,select').style.borderColor = msg ? '#ef4444' : '');
  }
  function clearErrs() {
    ['err_name','err_email','err_password','err_brand','err_agree'].forEach(id => setErr(id,''));
    form.querySelectorAll('input,select').forEach(el => el.style.borderColor='');
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrs();
    const name  = document.getElementById('reg_name').value.trim();
    const email = document.getElementById('reg_email').value.trim();
    const pass  = document.getElementById('reg_password').value;
    const brand = document.getElementById('reg_brand').value;
    const agree = document.getElementById('reg_agree').checked;
    let valid = true;

    if (!name)                   { setErr('err_name','Full name is required.'); valid=false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('err_email','A valid email address is required.'); valid=false; }
    if (!pass || pass.length<8)  { setErr('err_password','Password must be at least 8 characters.'); valid=false; }
    if (!brand)                  { setErr('err_brand','Please select your preferred brand.'); valid=false; }
    if (!agree)                  { setErr('err_agree','You must agree to the Terms of Service.'); valid=false; }
    if (!valid) return;

    localStorage.setItem('vm_reg_name', name);
    localStorage.setItem('vm_reg_email', email);
    localStorage.setItem('vm_reg_brand', brand);

    const btn = document.getElementById('submitBtn');
    const txt = document.getElementById('submitBtnText');
    const ldr = document.getElementById('submitBtnLoader');
    if (btn) btn.disabled = true;
    if (txt) txt.style.display='none';
    if (ldr) ldr.style.display='flex';

    setTimeout(() => { window.location.href = 'thankyou.html'; }, 1200);
  });
}

// ── THANK YOU PAGE ─────────────────────────────────────────
function initThankYou() {
  const greetEl   = document.getElementById('tyGreeting');
  const brandNote = document.getElementById('tyBrandNote');
  const refEl     = document.getElementById('tyRefCode');
  const emailEl   = document.getElementById('tyEmail');

  const name  = localStorage.getItem('vm_reg_name');
  const email = localStorage.getItem('vm_reg_email');
  const brand = localStorage.getItem('vm_reg_brand');

  if (greetEl && name) greetEl.textContent = 'Dear ' + name + ',';
  if (brandNote && brand) brandNote.textContent = 'We have noted your preference for ' + brand + ' and will curate recommendations accordingly.';
  if (emailEl && email) emailEl.textContent = email;
  if (refEl) refEl.textContent = 'VM-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random()*90000)+10000);

  if (typeof gsap !== 'undefined') {
    gsap.from('.ty-emblem', { scale:0, opacity:0, duration:1, ease:'elastic.out(1,.5)', delay:.3 });
    gsap.from('.ty-title',  { y:50, opacity:0, duration:1.1, ease:'power4.out', delay:.7 });
    gsap.from('.ty-message,.ty-greeting', { y:30, opacity:0, duration:.9, ease:'power3.out', delay:1 });
    gsap.from('.ty-details', { y:30, opacity:0, duration:.9, ease:'power3.out', delay:1.2 });
    gsap.from('.ty-ctas',    { y:20, opacity:0, duration:.8, ease:'power3.out', delay:1.5 });
  }
}

// ── CONTACT FORM ──────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  function setErr(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    ['c_err_name','c_err_email','c_err_subject','c_err_message'].forEach(id => setErr(id,''));

    const name    = document.getElementById('c_name')?.value.trim();
    const email   = document.getElementById('c_email')?.value.trim();
    const subject = document.getElementById('c_subject')?.value;
    const message = document.getElementById('c_message')?.value.trim();

    if (!name)    { setErr('c_err_name','Name is required.'); valid=false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('c_err_email','Valid email required.'); valid=false; }
    if (!subject) { setErr('c_err_subject','Please select a subject.'); valid=false; }
    if (!message) { setErr('c_err_message','Message cannot be empty.'); valid=false; }
    if (!valid) return;

    showToast('Message sent! We will respond within 2 hours.');
    form.reset();
  });
}

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  Cart.updateCount();
  initScrollReveal();
  initCounters();

  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose   = document.getElementById('modalClose');
  const modalAddCart = document.getElementById('modalAddCart');

  modalClose?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key==='Escape') closeModal(); });
  modalAddCart?.addEventListener('click', function() {
    const car = CARS.find(c => c.id == this.dataset.id);
    if (car) { Cart.add(car); closeModal(); }
  });

  buildSlider();
  buildCarsGrid();
  renderCartPage();
  initRegisterForm();
  initThankYou();
  initContactForm();

  setTimeout(initGSAP, 120);
});
