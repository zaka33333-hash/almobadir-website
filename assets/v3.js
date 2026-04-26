/* ════════════════════════════════════════════════════════════════
   ALMOBADIR · v3 scripts
   Combined JS from 9 winning specialist agents.
   Each section initializes on DOM ready, scoped via prefix selectors.
   ════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============== HEADER · hdr3 ============== */
  (function () {
    const root = document.getElementById('hdr3-root');
    if (!root) return;
    const ticker = document.getElementById('hdr3-ticker');
    const ticks = ticker ? Array.from(ticker.querySelectorAll('.hdr3-tick')) : [];
    const burger = document.getElementById('hdr3-burger');
    const drawer = document.getElementById('hdr3-drawer');
    let tickIdx = 0; let tickTimer = null;
    function showTick(i) { if (!ticks.length) return; ticks.forEach((t, idx) => t.classList.toggle('is-active', idx === i)); tickIdx = i; }
    function nextTick() { showTick((tickIdx + 1) % ticks.length); }
    function prevTick() { showTick((tickIdx - 1 + ticks.length) % ticks.length); }
    function startTicker() { stopTicker(); tickTimer = setInterval(nextTick, 6000); }
    function stopTicker() { if (tickTimer) { clearInterval(tickTimer); tickTimer = null; } }
    if (ticks.length) {
      startTicker();
      ticker.addEventListener('mouseenter', stopTicker);
      ticker.addEventListener('mouseleave', startTicker);
      const prevBtn = root.querySelector('.hdr3-announce-prev');
      const nextBtn = root.querySelector('.hdr3-announce-next');
      if (prevBtn) prevBtn.addEventListener('click', () => { prevTick(); startTicker(); });
      if (nextBtn) nextBtn.addEventListener('click', () => { nextTick(); startTicker(); });
    }
    let lastScroll = -1;
    function onScroll() { const y = window.scrollY; if (y === lastScroll) return; lastScroll = y; root.classList.toggle('is-scrolled', y > 12); }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    const megaItems = root.querySelectorAll('.hdr3-has-mega');
    let megaCloseTimer = null;
    megaItems.forEach((item) => {
      const trigger = item.querySelector('.hdr3-nav-link');
      const open = () => { clearTimeout(megaCloseTimer); megaItems.forEach(i => i !== item && i.classList.remove('is-open')); item.classList.add('is-open'); trigger.setAttribute('aria-expanded', 'true'); };
      const close = () => { megaCloseTimer = setTimeout(() => { item.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false'); }, 140); };
      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', close);
      trigger.addEventListener('click', (e) => { e.preventDefault(); if (item.classList.contains('is-open')) { item.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false'); } else open(); });
      trigger.addEventListener('focus', open);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') megaItems.forEach(i => { i.classList.remove('is-open'); const t = i.querySelector('.hdr3-nav-link'); if (t) t.setAttribute('aria-expanded', 'false'); }); });
    document.addEventListener('click', (e) => { if (!root.contains(e.target)) megaItems.forEach(i => i.classList.remove('is-open')); });
    if (burger && drawer) {
      burger.addEventListener('click', () => {
        const open = drawer.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(open));
        drawer.setAttribute('aria-hidden', String(!open));
        document.body.style.overflow = open ? 'hidden' : '';
      });
    }
    root.querySelectorAll('.hdr3-lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        root.querySelectorAll('.hdr3-lang-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = root.querySelector('.hdr3-search-input');
        if (input) input.focus();
      }
    });
  })();

  /* ============== HERO · hero3 ============== */
  (() => {
    const hero = document.querySelector('.hero3');
    if (!hero) return;
    const meshA = hero.querySelector('.hero3__mesh--a');
    const meshB = hero.querySelector('.hero3__mesh--b');
    const conic = hero.querySelector('.hero3__conic');
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!reduceMotion && finePointer && meshA && meshB && conic) {
      let raf = 0; let tx = 0, ty = 0, cx = 0, cy = 0;
      const onMove = (e) => {
        const r = hero.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
        if (!raf) raf = requestAnimationFrame(tick);
      };
      const tick = () => {
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;
        meshA.style.transform = `translate3d(${cx * 18}px, ${cy * 14}px, 0)`;
        meshB.style.transform = `translate3d(${cx * -22}px, ${cy * -16}px, 0)`;
        conic.style.transform = `translate3d(${cx * 10}px, ${cy * 8}px, 0)`;
        if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) { raf = requestAnimationFrame(tick); } else { raf = 0; }
      };
      hero.addEventListener('pointermove', onMove, { passive: true });
    }
    const form = hero.querySelector('.hero3__signup');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('.hero3__signup-input');
        const cta = form.querySelector('.hero3__signup-cta span');
        if (!input.value || !input.checkValidity()) { input.focus(); return; }
        const original = cta.textContent;
        cta.textContent = 'تم الاشتراك ✓';
        input.value = '';
        input.disabled = true;
        setTimeout(() => { cta.textContent = original; input.disabled = false; }, 2400);
      });
    }
  })();

  /* ============== MANIFESTO · manif3 ============== */
  (() => {
    const root = document.querySelector('.manif3');
    if (!root) return;
    const words = [...root.querySelectorAll('.manif3__word')];
    if (reduceMotion) { root.classList.add('is-in', 'is-fully-lit'); words.forEach(w => w.classList.add('is-lit')); return; }
    const io = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) root.classList.add('is-in'); }); }, { threshold: .15 });
    io.observe(root);
    const lede = root.querySelector('.manif3__lede');
    let ticking = false;
    const update = () => {
      const r = lede.getBoundingClientRect();
      const vh = innerHeight;
      const start = vh * .85, end = vh * .35;
      const ref = r.top;
      let p = (start - ref) / (start - end);
      p = Math.max(0, Math.min(1, p));
      const lit = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
      root.classList.toggle('is-fully-lit', lit >= words.length);
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    update();
  })();

  /* ============== NETWORK · nw3a ============== */
  (() => {
    const section = document.querySelector('.nw3a');
    if (!section) return;
    const cards = section.querySelectorAll('.nw3a-card');
    if ('IntersectionObserver' in window && !reduceMotion) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('nw3a-in'); io.unobserve(e.target); } });
      }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
      cards.forEach(c => io.observe(c));
    } else {
      cards.forEach(c => c.classList.add('nw3a-in'));
    }
    if (reduceMotion || matchMedia('(hover: none)').matches) return;
    const MAX = 6;
    cards.forEach(card => {
      let raf = 0;
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width - 0.5;
        const cy = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.setProperty('--rx', `${(cx * MAX).toFixed(2)}deg`);
          card.style.setProperty('--ry', `${(-cy * MAX).toFixed(2)}deg`);
        });
      };
      const onLeave = () => { cancelAnimationFrame(raf); card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); };
      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);
    });
  })();

  /* ============== METHOD · mtd3 ============== */
  (() => {
    const root = document.querySelector('.mtd3');
    if (!root) return;
    const frames = root.querySelectorAll('.mtd3__frame');
    const fill = root.querySelector('.mtd3__progress-fill');
    const current = root.querySelector('.mtd3__progress-current');
    const arabicNumeral = n => String(n).padStart(2, '0').replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    const colors = ['#E6213B', '#3CC58B', '#E8B855', '#5AA8FF', '#1FB6A6'];
    const setActive = (idx) => {
      const i = Math.max(0, Math.min(4, idx));
      if (current) current.textContent = arabicNumeral(i + 1);
      if (fill) { fill.style.width = `${(i + 1) * 20}%`; fill.style.background = `linear-gradient(90deg, ${colors[i]}, ${colors[(i + 1) % 5]})`; }
    };
    if (reduceMotion) { frames.forEach(f => f.classList.add('in-view')); setActive(0); return; }

    // Reveal each frame as it enters viewport (slide+fade with internal stagger)
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          revealIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });
    frames.forEach(f => revealIO.observe(f));

    // Track the active step (whichever is closest to viewport center) for the sticky HUD
    const activeIO = new IntersectionObserver((entries) => {
      // Pick the entry with the highest intersectionRatio that's intersecting
      let best = null;
      entries.forEach(e => { if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) best = e; });
      if (best) {
        const idx = parseInt(best.target.dataset.step, 10) - 1;
        setActive(idx);
      }
    }, { threshold: [0.25, 0.5, 0.75], rootMargin: '-20% 0px -40% 0px' });
    frames.forEach(f => activeIO.observe(f));

    setActive(0);
  })();

  /* ============== CONTENT · cnt3 ============== */
  (() => {
    const root = document.getElementById('cnt3-latest');
    if (!root) return;
    const imgs = root.querySelectorAll('.cnt3-img');
    imgs.forEach(img => {
      const skel = img.previousElementSibling;
      const done = () => {
        img.classList.add('is-loaded');
        if (skel && skel.classList.contains('cnt3-skeleton')) { skel.style.opacity = '0'; setTimeout(() => skel.remove(), 350); }
      };
      if (img.complete && img.naturalWidth) done();
      else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', () => skel && skel.remove(), { once: true }); }
    });
    const cards = root.querySelectorAll('.cnt3-card');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      cards.forEach(c => io.observe(c));
    } else {
      cards.forEach(c => c.classList.add('is-in'));
    }
    const featured = root.querySelector('.cnt3-card--featured');
    const fill = featured && featured.querySelector('.cnt3-progress-fill');
    if (featured && fill) {
      let ticking = false;
      const update = () => {
        const r = featured.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const total = r.height + vh;
        const seen = Math.min(Math.max(vh - r.top, 0), total);
        const pct = Math.min(100, Math.max(0, (seen / total) * 100));
        fill.style.width = pct.toFixed(1) + '%';
        ticking = false;
      };
      const onScroll = () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } };
      window.addEventListener('scroll', onScroll, { passive: true });
      update();
    }
    const cta = root.querySelector('.cnt3-cta');
    if (cta && !reduceMotion) {
      cta.addEventListener('mousemove', (e) => {
        const r = cta.getBoundingClientRect();
        const mx = ((e.clientX - r.left) / r.width) * 100;
        const my = ((e.clientY - r.top) / r.height) * 100;
        cta.style.setProperty('--mx', mx + '%');
        cta.style.setProperty('--my', my + '%');
      });
      cta.addEventListener('mouseleave', () => { cta.style.setProperty('--mx', '50%'); cta.style.setProperty('--my', '50%'); });
    }
  })();

  /* ============== NEWSLETTER · nl3 ============== */
  (() => {
    const form = document.getElementById('nl3-form');
    if (!form) return;
    const input = form.querySelector('.nl3-input');
    const button = form.querySelector('.nl3-submit');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = (input.value || '').trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!valid) {
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        form.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }], { duration: 320, easing: 'cubic-bezier(0.28,0.11,0.32,1)' });
        return;
      }
      input.removeAttribute('aria-invalid');
      button.classList.add('is-loading');
      setTimeout(() => { button.classList.remove('is-loading'); button.classList.add('is-success'); input.value = ''; input.disabled = true; }, 720);
    });
    const tilt = document.querySelector('[data-tilt] .nl3-frame');
    const wrap = document.querySelector('[data-tilt]');
    if (tilt && wrap && window.matchMedia('(hover: hover)').matches && !reduceMotion) {
      let raf = 0; let target = { x: 0, y: 0 }; let current = { x: 0, y: 0 };
      const render = () => {
        current.x += (target.x - current.x) * 0.12;
        current.y += (target.y - current.y) * 0.12;
        tilt.style.transform = `rotateX(${current.y}deg) rotateY(${current.x}deg) translateZ(0)`;
        if (Math.abs(target.x - current.x) > 0.01 || Math.abs(target.y - current.y) > 0.01) { raf = requestAnimationFrame(render); } else { raf = 0; }
      };
      wrap.addEventListener('mousemove', (e) => {
        const rect = wrap.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        target.x = px * -6; target.y = py * 4;
        if (!raf) raf = requestAnimationFrame(render);
      });
      wrap.addEventListener('mouseleave', () => { target = { x: 0, y: 0 }; if (!raf) raf = requestAnimationFrame(render); });
    }
    const out = document.getElementById('nl3-countdown');
    if (out) {
      const tick = () => {
        const now = new Date();
        const riyadh = new Date(now.getTime() + (now.getTimezoneOffset() + 180) * 60000);
        const day = riyadh.getDay();
        let daysUntil = (7 - day) % 7;
        if (daysUntil === 0 && (riyadh.getHours() >= 9)) daysUntil = 7;
        const target = new Date(riyadh);
        target.setDate(riyadh.getDate() + daysUntil);
        target.setHours(9, 0, 0, 0);
        const diff = target - riyadh;
        const h = Math.floor(diff / 3600000);
        const d = Math.floor(h / 24);
        const hh = h % 24;
        const m = Math.floor((diff % 3600000) / 60000);
        if (d > 0) { out.textContent = `الأحد · 9:00 ص الرياض · بعد ${d} ي ${hh} س`; }
        else { out.textContent = `الأحد · 9:00 ص الرياض · بعد ${hh} س ${m} د`; }
      };
      tick();
      setInterval(tick, 60000);
    }
  })();

  /* ============== FOUNDER · fnd3a ============== */
  (() => {
    const root = document.querySelector('.fnd3a');
    if (!root) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { root.classList.add('is-inview'); io.unobserve(root); runCounters(); } });
    }, { threshold: 0.18 });
    io.observe(root);
    function runCounters() {
      const els = root.querySelectorAll('.fnd3a__count');
      els.forEach((el) => {
        const target = parseFloat(el.dataset.target || '0');
        const suffix = el.dataset.suffix || '';
        const format = el.dataset.format || '';
        if (reduceMotion) { el.textContent = formatNum(target, format) + suffix; return; }
        const dur = 1400 + Math.random() * 400;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          const v = target * eased;
          el.textContent = formatNum(v, format, target) + suffix;
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = formatNum(target, format) + suffix;
        };
        requestAnimationFrame(tick);
      });
    }
    function formatNum(v, format, target) {
      if (format === 'comma') return Math.round(v).toLocaleString('en-US');
      if (target && target < 100) return v.toFixed(0);
      return Math.round(v).toString();
    }
    const photo = root.querySelector('.fnd3a__photo');
    const frame = root.querySelector('.fnd3a__portrait-frame');
    if (photo && frame && !reduceMotion) {
      frame.addEventListener('mousemove', (e) => {
        const r = frame.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        photo.style.transform = `scale(1.08) translate(${x * -8}px, ${y * -8}px)`;
      });
      frame.addEventListener('mouseleave', () => { photo.style.transform = ''; });
    }
  })();

  /* ============== FOOTER · ftr3 ============== */
  (() => {
    const root = document.querySelector('.ftr3');
    if (!root) return;
    const clockEl = root.querySelector('#ftr3-clock');
    if (clockEl) {
      const fmt = new Intl.DateTimeFormat('ar-SA-u-nu-latn', { timeZone: 'Asia/Riyadh', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const tick = () => { clockEl.textContent = fmt.format(new Date()); };
      tick();
      let raf;
      const loop = () => { tick(); raf = requestAnimationFrame(() => setTimeout(loop, 1000)); };
      loop();
      document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else loop(); });
    }
    const cols = root.querySelectorAll('.ftr3-col');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
      }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
      cols.forEach(c => io.observe(c));
    } else {
      cols.forEach(c => c.classList.add('is-in'));
    }
    const topBtn = root.querySelector('#ftr3-top');
    if (topBtn) { topBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); }); }
    const langWrap = root.querySelector('.ftr3-lang');
    if (langWrap) {
      const btns = langWrap.querySelectorAll('.ftr3-lang__btn');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          const lang = btn.dataset.lang;
          btns.forEach(b => { const active = b === btn; b.classList.toggle('is-active', active); b.setAttribute('aria-pressed', active); });
          langWrap.dataset.active = lang;
          document.dispatchEvent(new CustomEvent('ftr3:lang', { detail: { lang } }));
        });
      });
    }
    const form = root.querySelector('.ftr3-cta__form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('.ftr3-cta__input');
        const btn = form.querySelector('.ftr3-cta__btn span');
        if (!input || !input.value || !/^\S+@\S+\.\S+$/.test(input.value)) { input?.focus(); return; }
        const original = btn.textContent;
        btn.textContent = 'تم ✓';
        input.value = '';
        setTimeout(() => { btn.textContent = original; }, 2400);
      });
    }
  })();

  /* Year update for footer copy */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
