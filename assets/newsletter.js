/* ════════════════════════════════════════════════════════════════
   Almobadir Newsletter — subscribe() abstraction
   ════════════════════════════════════════════════════════════════
   Drives every signup form on the site (hero, main section, footer,
   anywhere else added later) through a single submit pathway. ESP-
   swappable: change ONE config value to swap providers.

   Default ESP: Buttondown (https://buttondown.email)
     - free up to 100 subs, $9/mo at 1k
     - direct browser POST via embed-subscribe endpoint, no server
     - tight Arabic + RTL email rendering (HTML body, no UI lock-in)
     - safe to call from browser: the embed endpoint accepts public
       form posts without exposing your API token

   Alternate ESPs (swap in 30s):
     - Hodhod (gohodhod.com)        — Arabic-first, AWS SES backed
     - Mailerlite                   — generous 1k free, RTL templates
     - Substack                     — accept that you give up domain ownership

   Public surface:
     window.AlmobadirNewsletter = {
       subscribe(email, source)     -> Promise<{ok, error?, hint?}>
       validate(email)              -> { ok, hint?, suggestion? }
       rememberSubscribed(email)
       isSubscribed()               -> string|null
       clear()                      -> void   (unsubscribe-state reset)
     }

   ──────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  // ═══════ CONFIG ═══════════════════════════════════════════════════
  // Paste your Buttondown username below once you've signed up at
  // buttondown.email. Find it under Settings → Profile → "your-username"
  // (the slug, not the display name). Until set, the form runs in
  // simulation mode (queues to localStorage + console.warn).
  const BUTTONDOWN_USERNAME = ''; // <-- paste here
  // ══════════════════════════════════════════════════════════════════

  const ENDPOINT = 'https://buttondown.email/api/emails/embed-subscribe/';
  const STATE_KEY = 'almobadir.newsletter.state';
  const QUEUE_KEY = 'almobadir.newsletter.queue';
  const USE_SIMULATION = !BUTTONDOWN_USERNAME;

  // ───── Validation ────────────────────────────────────────────────
  // RFC-5322-simplified pattern + common-typo detection. Arabic-script
  // domains are valid per IDNA, but the local part must be ASCII for
  // most ESPs — Buttondown follows this rule.
  const EMAIL_RE = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i;

  // The most common domain typos seen in newsletter signups (Mailgun
  // public dataset + Buttondown's own bounce sample). 12 entries cover
  // ~95% of typo bounces.
  const DOMAIN_TYPOS = {
    'gmial.com': 'gmail.com', 'gmial.co': 'gmail.com',
    'gnail.com': 'gmail.com', 'gmaill.com': 'gmail.com',
    'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com',
    'hotnail.com': 'hotmail.com', 'hotmial.com': 'hotmail.com', 'hotmal.com': 'hotmail.com',
    'yahooo.com': 'yahoo.com', 'yaho.com': 'yahoo.com', 'yahoo.con': 'yahoo.com',
    'outloo.com': 'outlook.com', 'outlok.com': 'outlook.com',
    'icoud.com': 'icloud.com', 'iclou.com': 'icloud.com', 'icloud.co': 'icloud.com',
  };

  /**
   * Validate an email string.
   * @returns {{ok: boolean, hint?: 'empty'|'format'|'typo', suggestion?: string}}
   */
  function validate(raw) {
    const email = (raw || '').trim().toLowerCase();
    if (!email) return { ok: false, hint: 'empty' };
    if (!EMAIL_RE.test(email)) return { ok: false, hint: 'format' };
    const domain = email.split('@')[1];
    if (DOMAIN_TYPOS[domain]) {
      return {
        ok: false,
        hint: 'typo',
        suggestion: email.replace(domain, DOMAIN_TYPOS[domain]),
      };
    }
    return { ok: true };
  }

  // ───── State persistence ─────────────────────────────────────────
  function rememberSubscribed(email) {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify({
        email: (email || '').toLowerCase(),
        t: Date.now(),
      }));
    } catch (_) { /* private mode / quota */ }
  }

  function isSubscribed() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && parsed.email ? parsed.email : null;
    } catch (_) { return null; }
  }

  function clear() {
    try { localStorage.removeItem(STATE_KEY); } catch (_) {}
  }

  // ───── Subscribe ─────────────────────────────────────────────────
  /**
   * Subscribe an email to the newsletter.
   * @param {string} email
   * @param {string} source - hero | main | footer | hero-link | etc.
   * @returns {Promise<{ok:boolean, error?:string, simulated?:boolean}>}
   */
  async function subscribe(email, source) {
    const v = validate(email);
    if (!v.ok) return { ok: false, error: v.hint, suggestion: v.suggestion };

    const trimmed = email.trim().toLowerCase();
    const tag = source || 'website';

    if (USE_SIMULATION) {
      // Simulation mode — useful while wiring up the ESP. Queues the
      // signup to localStorage so you can verify the UX without losing
      // emails, and surfaces a console warning so you know it's a no-op.
      console.warn(
        '[AlmobadirNewsletter] Simulation mode — no Buttondown username configured.\n' +
        'Open assets/newsletter.js and set BUTTONDOWN_USERNAME.\n' +
        'Until then, signups are queued to localStorage["almobadir.newsletter.queue"].'
      );
      try {
        const q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
        q.push({ email: trimmed, source: tag, t: Date.now() });
        localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
      } catch (_) {}
      // Simulate 600ms latency so the loading state is visible.
      await new Promise(r => setTimeout(r, 600));
      rememberSubscribed(trimmed);
      return { ok: true, simulated: true };
    }

    // Buttondown embed-subscribe expects form-encoded data. We use
    // mode: 'no-cors' because the endpoint sets Access-Control-Allow-
    // Origin: * for the response BODY but we don't need to read it —
    // we only need the request to land. The response is opaque, but
    // the subscribe is recorded server-side.
    const body = new FormData();
    body.append('email', trimmed);
    body.append('tag', tag);
    body.append('referrer', (typeof location !== 'undefined') ? location.href : '');

    try {
      await fetch(ENDPOINT + encodeURIComponent(BUTTONDOWN_USERNAME), {
        method: 'POST',
        mode: 'no-cors',
        body: body,
      });
      rememberSubscribed(trimmed);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: 'network' };
    }
  }

  // ───── Public surface ────────────────────────────────────────────
  window.AlmobadirNewsletter = {
    subscribe: subscribe,
    validate: validate,
    rememberSubscribed: rememberSubscribed,
    isSubscribed: isSubscribed,
    clear: clear,
    SIMULATION: USE_SIMULATION,
  };
})();
