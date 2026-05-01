/* ════════════════════════════════════════════════════════════════
   Almobadir Cookie Banner — privacy-first consent strip
   ════════════════════════════════════════════════════════════════
   Defaults to DENY. No dark patterns (no "yes please" with tiny
   "no thanks" link). Two equal-weight buttons. Persists the choice
   in localStorage. Does not appear if a choice was previously made.

   Why this exists at all when we use Plausible (no cookies, no PII):
     - Defensive — Calendly + Unsplash + esm.sh + future ESP may set
       cookies we can't fully control.
     - Required by GDPR and Saudi PDPL when serving any non-essential
       third-party content.
     - Reads the html[lang] attribute and shows AR or EN copy.

   Public surface:
     window.AlmobadirConsent = {
       has()        -> boolean   (true if user has made any choice)
       accepted()   -> boolean   (true if explicitly accepted)
       reset()      -> void      (clears choice, banner re-appears)
     }
   ──────────────────────────────────────────────────────────────── */

(function () {
  'use strict';
  const KEY = 'almobadir.consent';
  const lang = (document.documentElement.lang || 'ar').toLowerCase().startsWith('ar') ? 'ar' : 'en';
  const isAr = lang === 'ar';

  // If user already made a choice, do nothing.
  let stored = null;
  try { stored = localStorage.getItem(KEY); } catch (_) {}
  if (stored === 'accepted' || stored === 'declined') {
    expose(stored === 'accepted');
    return;
  }

  // Localized copy
  const COPY = isAr ? {
    text: 'يحترم المبادر خصوصيتك. نستخدم تحليلات لا تحتفظ بأي بيانات شخصية. مزوّدو خدمة آخرون (Calendly، الصور) قد يضعون كوكيز خاصة بهم.',
    accept: 'أوافق',
    decline: 'لا، شكراً',
    learn: 'سياسة الخصوصية',
    learnHref: '/privacy/',
  } : {
    text: 'Almobadir respects your privacy. We use analytics that store no personal data. Some third-party services (Calendly, images) may set their own cookies.',
    accept: 'I agree',
    decline: 'No thanks',
    learn: 'Privacy policy',
    learnHref: '/en/privacy/',
  };

  // Wait for DOM, then mount
  function mount() {
    if (document.getElementById('amc-banner')) return;

    const banner = document.createElement('aside');
    banner.id = 'amc-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', isAr ? 'إعدادات الكوكيز' : 'Cookie preferences');
    banner.dir = isAr ? 'rtl' : 'ltr';
    banner.setAttribute('lang', lang);

    // Build via DOM (no innerHTML — XSS-safe)
    const inner = document.createElement('div');
    inner.className = 'amc-inner';

    const text = document.createElement('p');
    text.className = 'amc-text';
    text.appendChild(document.createTextNode(COPY.text + ' '));
    const learn = document.createElement('a');
    learn.href = COPY.learnHref;
    learn.className = 'amc-learn';
    learn.textContent = COPY.learn;
    text.appendChild(learn);

    const actions = document.createElement('div');
    actions.className = 'amc-actions';

    const declineBtn = document.createElement('button');
    declineBtn.type = 'button';
    declineBtn.className = 'amc-btn amc-btn--secondary';
    declineBtn.textContent = COPY.decline;
    declineBtn.addEventListener('click', () => choose('declined'));

    const acceptBtn = document.createElement('button');
    acceptBtn.type = 'button';
    acceptBtn.className = 'amc-btn amc-btn--primary';
    acceptBtn.textContent = COPY.accept;
    acceptBtn.addEventListener('click', () => choose('accepted'));

    // Order matters for keyboard tab order — primary first in DOM but visually equal
    actions.appendChild(declineBtn);
    actions.appendChild(acceptBtn);

    inner.appendChild(text);
    inner.appendChild(actions);
    banner.appendChild(inner);

    // Inject style once (the banner is mounted before the route's CSS may
    // apply to it, so we self-style with brand tokens that we know exist).
    if (!document.getElementById('amc-style')) {
      const style = document.createElement('style');
      style.id = 'amc-style';
      style.textContent = `
        #amc-banner {
          position: fixed; inset: auto 0 0 0;
          z-index: 9000;
          display: grid; place-items: end center;
          padding: 16px clamp(12px, 3vw, 28px);
          pointer-events: none;
          animation: amc-slide-up 380ms cubic-bezier(0.16, 1, 0.3, 1) 200ms backwards;
        }
        #amc-banner .amc-inner {
          pointer-events: auto;
          width: 100%; max-width: 880px;
          display: grid; grid-template-columns: 1fr auto; gap: 16px 24px;
          align-items: center;
          padding: 16px 22px;
          background: color-mix(in srgb, var(--void-2, #0E1525) 92%, transparent);
          backdrop-filter: blur(12px) saturate(1.05);
          -webkit-backdrop-filter: blur(12px) saturate(1.05);
          border: 1px solid var(--hairline, rgba(245,234,210,0.14));
          border-radius: 14px;
          box-shadow: 0 24px 56px -16px rgba(0,0,0,0.55);
        }
        #amc-banner .amc-text {
          margin: 0; font-size: 13.5px; line-height: 1.55;
          color: var(--ink-soft, rgba(245,234,210,0.82));
          font-family: var(--font-ar-body, 'Tajawal', system-ui, sans-serif);
        }
        #amc-banner[lang="en"] .amc-text { font-family: 'Inter', system-ui, sans-serif; }
        #amc-banner .amc-learn {
          color: var(--crimson, #E6213B);
          text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px;
        }
        #amc-banner .amc-actions {
          display: inline-flex; gap: 8px;
        }
        #amc-banner .amc-btn {
          appearance: none; cursor: pointer;
          border: 1px solid transparent;
          padding: 10px 18px; border-radius: 999px;
          font: 600 13px/1 var(--font-ar-body, 'Tajawal', system-ui, sans-serif);
          letter-spacing: 0.01em;
          transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1), background 180ms ease, border-color 180ms ease;
        }
        #amc-banner[lang="en"] .amc-btn { font-family: 'Inter', system-ui, sans-serif; }
        #amc-banner .amc-btn:active { transform: scale(0.97); }
        #amc-banner .amc-btn--primary {
          background: var(--crimson, #E6213B);
          color: var(--ink, #FBF7EE);
        }
        #amc-banner .amc-btn--primary:hover { background: var(--crimson-2, #C41A30); }
        #amc-banner .amc-btn--secondary {
          background: transparent;
          color: var(--ink-soft, rgba(245,234,210,0.82));
          border-color: var(--hairline-strong, rgba(245,234,210,0.32));
        }
        #amc-banner .amc-btn--secondary:hover {
          color: var(--ink, #FBF7EE);
          border-color: rgba(245,234,210,0.5);
        }
        #amc-banner .amc-btn:focus-visible {
          outline: 2px solid var(--crimson, #E6213B);
          outline-offset: 3px;
        }
        @keyframes amc-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 640px) {
          #amc-banner .amc-inner {
            grid-template-columns: 1fr; gap: 12px;
          }
          #amc-banner .amc-actions {
            justify-content: flex-end;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #amc-banner { animation: none; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(banner);
    // Move keyboard focus to the FIRST button (decline — pro-privacy default)
    setTimeout(() => declineBtn.focus(), 420);
  }

  function choose(value) {
    try { localStorage.setItem(KEY, value); } catch (_) {}
    expose(value === 'accepted');
    const banner = document.getElementById('amc-banner');
    if (banner) {
      banner.style.animation = 'amc-slide-up 220ms cubic-bezier(0.4, 0, 1, 1) reverse forwards';
      setTimeout(() => banner.remove(), 240);
    }
    // If a Plausible custom event handler is set up, fire one for the choice.
    if (typeof window.plausible === 'function') {
      window.plausible('Cookie ' + (value === 'accepted' ? 'Accept' : 'Decline'));
    }
  }

  function expose(accepted) {
    window.AlmobadirConsent = {
      has: () => true,
      accepted: () => accepted === true,
      reset: () => {
        try { localStorage.removeItem(KEY); } catch (_) {}
        location.reload();
      },
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
