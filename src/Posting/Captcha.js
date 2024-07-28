import $ from "../platform/$";
import CaptchaReplace from "./Captcha.replace";
import CaptchaT from "./Captcha.t";
import meta from '../../package.json';
import Main from "../main/Main";
import Keybinds from "../Miscellaneous/Keybinds";
import $$ from "../platform/$$";
import QR from "./QR";
import { Conf, d } from "../globals/globals";
import { MINUTE, SECOND } from "../platform/helpers";

const Captcha = {
  cache: {
    init() {
      $.on(d, 'SaveCaptcha', e => {
        return this.saveAPI(e.detail);
      });
      return $.on(d, 'NoCaptcha', e => {
        return this.noCaptcha(e.detail);
      });
    },

    captchas: [],

    getCount() {
      return this.captchas.length;
    },

    neededRaw() {
      return !(
        this.haveCookie() || this.captchas.length || QR.req || this.submitCB
      ) && (
          (QR.posts.length > 1) || Conf['Auto-load captcha'] || !QR.posts[0].isOnlyQuotes() || QR.posts[0].file
        );
    },

    needed() {
      return this.neededRaw() && $.event('LoadCaptcha');
    },

    prerequest() {
      if (!Conf['Prerequest Captcha']) { return; }
      // Post count temporarily off by 1 when called from QR.post.rm, QR.close, or QR.submit
      return $.queueTask(() => {
        if (
          !this.prerequested &&
          this.neededRaw() &&
          !$.event('LoadCaptcha') &&
          !QR.captcha.occupied() &&
          (QR.cooldown.seconds <= 60) &&
          (QR.selected === QR.posts[QR.posts.length - 1]) &&
          !QR.selected.isOnlyQuotes()
        ) {
          const isReply = (QR.selected.thread !== 'new');
          if (!$.event('RequestCaptcha', { isReply })) {
            this.prerequested = true;
            this.submitCB = captcha => {
              if (captcha) { return this.save(captcha); }
            };
            return this.updateCount();
          }
        }
      });
    },

    haveCookie() {
      return /\b_ct=/.test(d.cookie) && (QR.posts[0].thread !== 'new');
    },

    getOne() {
      let captcha;
      delete this.prerequested;
      this.clear();
      if (captcha = this.captchas.shift()) {
        this.count();
        return captcha;
      } else {
        return null;
      }
    },

    request(isReply) {
      if (!this.submitCB) {
        if ($.event('RequestCaptcha', { isReply })) { return; }
      }
      return cb => {
        this.submitCB = cb;
        return this.updateCount();
      };
    },

    abort() {
      if (this.submitCB) {
        delete this.submitCB;
        $.event('AbortCaptcha');
        return this.updateCount();
      }
    },

    saveAPI(captcha) {
      let cb;
      if (cb = this.submitCB) {
        delete this.submitCB;
        cb(captcha);
        return this.updateCount();
      } else {
        return this.save(captcha);
      }
    },

    noCaptcha(detail) {
      let cb;
      if (cb = this.submitCB) {
        if (!this.haveCookie() || detail?.error) {
          QR.error(detail?.error || 'Failed to retrieve captcha.');
          QR.captcha.setup(d.activeElement === QR.nodes.status);
        }
        delete this.submitCB;
        cb();
        return this.updateCount();
      }
    },

    save(captcha) {
      let cb;
      if (cb = this.submitCB) {
        this.abort();
        cb(captcha);
        return;
      }
      this.captchas.push(captcha);
      this.captchas.sort((a, b) => a.timeout - b.timeout);
      return this.count();
    },

    clear() {
      if (this.captchas.length) {
        let i;
        const now = Date.now();
        for (i = 0; i < this.captchas.length; i++) {
          var captcha = this.captchas[i];
          if (captcha.timeout > now) { break; }
        }
        if (i) {
          this.captchas = this.captchas.slice(i);
          return this.count();
        }
      }
    },

    count() {
      clearTimeout(this.timer);
      if (this.captchas.length) {
        this.timer = setTimeout(this.clear.bind(this), this.captchas[0].timeout - Date.now());
      }
      return this.updateCount();
    },

    updateCount() {
      return $.event('CaptchaCount', this.captchas.length);
    }
  },
  replace: CaptchaReplace,
  t: CaptchaT,
  v2: {
    lifetime: 2 * MINUTE,

    init() {
      if (d.cookie.indexOf('pass_enabled=1') >= 0) { return; }
      if (!(this.isEnabled = !!$('#g-recaptcha, #captcha-forced-noscript') || !$.id('postForm'))) { return; }

      if (this.noscript = Conf['Force Noscript Captcha'] || !Main.jsEnabled) {
        $.addClass(QR.nodes.el, 'noscript-captcha');
      }

      Captcha.cache.init();
      $.on(d, 'CaptchaCount', this.count.bind(this));

      const root = $.el('div', { className: 'captcha-root' });
      $.extend(root, {
        innerHTML:
          '<div class="captcha-counter"><a href="javascript:;"></a></div>'
      }
      );
      const counter = $('.captcha-counter > a', root);
      this.nodes = { root, counter };
      this.count();
      $.addClass(QR.nodes.el, 'has-captcha', 'captcha-v2');
      $.after(QR.nodes.com.parentNode, root);

      $.on(counter, 'click', this.toggle.bind(this));
      $.on(counter, 'keydown', e => {
        if (Keybinds.keyCode(e) !== 'Space') { return; }
        this.toggle();
        e.preventDefault();
        return e.stopPropagation();
      });
      return $.on(window, 'captcha:success', () => {
        // XXX Greasemonkey 1.x workaround to gain access to GM_* functions.
        return $.queueTask(() => this.save(false));
      });
    },

    timeouts: {},
    prevNeeded: 0,

    noscriptURL() {
      let lang;
      let url = `https://www.google.com/recaptcha/api/fallback?k=${meta.recaptchaKey}`;
      if (lang = Conf['captchaLanguage'].trim()) {
        url += `&hl=${encodeURIComponent(lang)}`;
      }
      return url;
    },

    moreNeeded() {
      // Post count temporarily off by 1 when called from QR.post.rm, QR.close, or QR.submit
      return $.queueTask(() => {
        const needed = Captcha.cache.needed();
        if (needed && !this.prevNeeded) {
          this.setup(QR.cooldown.auto && (d.activeElement === QR.nodes.status));
        }
        return this.prevNeeded = needed;
      });
    },

    toggle() {
      if (this.nodes.container && !this.timeouts.destroy) {
        return this.destroy();
      } else {
        return this.setup(true, true);
      }
    },

    setup(focus, force) {
      if (!this.isEnabled || (!Captcha.cache.needed() && !force)) { return; }

      if (focus) {
        $.addClass(QR.nodes.el, 'focus');
        this.nodes.counter.focus();
      }

      if (this.timeouts.destroy) {
        clearTimeout(this.timeouts.destroy);
        delete this.timeouts.destroy;
        return this.reload();
      }

      if (this.nodes.container) {
        // XXX https://bugzilla.mozilla.org/show_bug.cgi?id=1226835
        $.queueTask(() => {
          let iframe;
          if (this.nodes.container && (d.activeElement === this.nodes.counter) && (iframe = $('iframe[src^="https://www.google.com/recaptcha/"]', this.nodes.container))) {
            iframe.focus();
            return QR.focus();
          }
        }); // Event handler not fired in Firefox
        return;
      }

      this.nodes.container = $.el('div', { className: 'captcha-container' });
      $.prepend(this.nodes.root, this.nodes.container);
      new MutationObserver(this.afterSetup.bind(this)).observe(this.nodes.container, {
        childList: true,
        subtree: true
      }
      );

      if (this.noscript) {
        return this.setupNoscript();
      } else {
        return this.setupJS();
      }
    },

    setupNoscript() {
      const iframe = $.el('iframe', {
        id: 'qr-captcha-iframe',
        scrolling: 'no',
        src: this.noscriptURL()
      }
      );
      const div = $.el('div');
      const textarea = $.el('textarea');
      $.add(div, textarea);
      return $.add(this.nodes.container, [iframe, div]);
    },

    setupJS() {
      return $.global(function () {
        const { recaptchaKey } = this;
        const render = function () {
          const { classList } = document.documentElement;
          const container = document.querySelector('#qr .captcha-container');
          return container.dataset.widgetID = window.grecaptcha.render(container, {
            sitekey: recaptchaKey,
            theme: classList.contains('tomorrow') || classList.contains('spooky') || classList.contains('dark-captcha') ? 'dark' : 'light',
            callback(response) {
              return window.dispatchEvent(new CustomEvent('captcha:success', { detail: response }));
            }
          }
          );
        };
        if (window.grecaptcha) {
          return render();
        } else {
          const cbNative = window.onRecaptchaLoaded;
          window.onRecaptchaLoaded = function () {
            render();
            return cbNative();
          };
          if (!document.head.querySelector('script[src^="https://www.google.com/recaptcha/api.js"]')) {
            const script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoaded&render=explicit';
            return document.head.appendChild(script);
          }
        }
      }, { recaptchaKey: meta.recaptchaKey });
    },

    afterSetup(mutations) {
      for (var mutation of mutations) {
        for (var node of mutation.addedNodes) {
          var iframe, textarea;
          if (iframe = $.x('./descendant-or-self::iframe[starts-with(@src, "https://www.google.com/recaptcha/")]', node)) { this.setupIFrame(iframe); }
          if (textarea = $.x('./descendant-or-self::textarea', node)) { this.setupTextArea(textarea); }
        }
      }
    },

    setupIFrame(iframe) {
      let needle;
      if (!doc.contains(iframe)) { return; }
      Captcha.replace.iframe(iframe);
      $.addClass(QR.nodes.el, 'captcha-open');
      this.fixQRPosition();
      $.on(iframe, 'load', this.fixQRPosition);
      if (d.activeElement === this.nodes.counter) { iframe.focus(); }
      // XXX Make sure scroll on space prevention (see src/css/style.css) doesn't cause scrolling of div
      if (['blink', 'edge'].includes($.engine) && (needle = iframe.parentNode, $$('#qr .captcha-container > div > div:first-of-type').includes(needle))) {
        return $.on(iframe.parentNode, 'scroll', function () { return this.scrollTop = 0; });
      }
    },

    fixQRPosition() {
      if (QR.nodes.el.getBoundingClientRect().bottom > doc.clientHeight) {
        QR.nodes.el.style.top = '';
        return QR.nodes.el.style.bottom = '0px';
      }
    },

    setupTextArea(textarea) {
      return $.one(textarea, 'input', () => this.save(true));
    },

    destroy() {
      if (!this.isEnabled) { return; }
      delete this.timeouts.destroy;
      $.rmClass(QR.nodes.el, 'captcha-open');
      if (this.nodes.container) {
        $.global(function () {
          const container = document.querySelector('#qr .captcha-container');
          return window.grecaptcha.reset(container.dataset.widgetID);
        });
        $.rm(this.nodes.container);
        return delete this.nodes.container;
      }
    },

    getOne(isReply) {
      return Captcha.cache.getOne(isReply);
    },

    save(pasted, token) {
      Captcha.cache.save({
        response: token || $('textarea', this.nodes.container).value,
        timeout: Date.now() + this.lifetime
      });

      const focus = (d.activeElement?.nodeName === 'IFRAME') && /https?:\/\/www\.google\.com\/recaptcha\//.test(d.activeElement.src);
      if (Captcha.cache.needed()) {
        if (focus) {
          if (QR.cooldown.auto || Conf['Post on Captcha Completion']) {
            this.nodes.counter.focus();
          } else {
            QR.nodes.status.focus();
          }
        }
        this.reload();
      } else {
        if (pasted) {
          this.destroy();
        } else {
          if (this.timeouts.destroy == null) { this.timeouts.destroy = setTimeout(this.destroy.bind(this), 3 * SECOND); }
        }
        if (focus) { QR.nodes.status.focus(); }
      }

      if (Conf['Post on Captcha Completion'] && !QR.cooldown.auto) { return QR.submit(); }
    },

    count() {
      const count = Captcha.cache.getCount();
      const loading = Captcha.cache.submitCB ? '...' : '';
      this.nodes.counter.textContent = `Captchas: ${count}${loading}`;
      return this.moreNeeded();
    },

    reload() {
      if ($('iframe[src^="https://www.google.com/recaptcha/api/fallback?"]', this.nodes.container)) {
        this.destroy();
        return this.setup(false, true);
      } else {
        return $.global(function () {
          const container = document.querySelector('#qr .captcha-container');
          return window.grecaptcha.reset(container.dataset.widgetID);
        });
      }
    },

    occupied() {
      return !!this.nodes.container && !this.timeouts.destroy;
    }
  }
};
export default Captcha;
