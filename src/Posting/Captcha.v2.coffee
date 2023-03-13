/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
Captcha.v2 = {
  lifetime: 2 * $.MINUTE,

  init() {
    if (d.cookie.indexOf('pass_enabled=1') >= 0) { return; }
    if (!(this.isEnabled = !!$('#g-recaptcha, #captcha-forced-noscript') || !$.id('postForm'))) { return; }

    if (this.noscript = Conf['Force Noscript Captcha'] || !Main.jsEnabled) {
      $.addClass(QR.nodes.el, 'noscript-captcha');
    }

    Captcha.cache.init();
    $.on(d, 'CaptchaCount', this.count.bind(this));

    const root = $.el('div', {className: 'captcha-root'});
    $.extend(root, { innerHTML:
      '<div class="captcha-counter"><a href="javascript:;"></a></div>'
    }
    );
    const counter   = $('.captcha-counter > a', root);
    this.nodes = {root, counter};
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
    let url = 'https://www.google.com/recaptcha/api/fallback?k=<%= meta.recaptchaKey %>';
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

    this.nodes.container = $.el('div', {className: 'captcha-container'});
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
    return $.global(function() {
      const render = function() {
        const {classList} = document.documentElement;
        const container = document.querySelector('#qr .captcha-container');
        return container.dataset.widgetID = window.grecaptcha.render(container, {
          sitekey:  '<%= meta.recaptchaKey %>',
          theme:    classList.contains('tomorrow') || classList.contains('spooky') || classList.contains('dark-captcha') ? 'dark' : 'light',
          callback(response) {
            return window.dispatchEvent(new CustomEvent('captcha:success', {detail: response}));
          }
        }
        );
      };
      if (window.grecaptcha) {
        return render();
      } else {
        const cbNative = window.onRecaptchaLoaded;
        window.onRecaptchaLoaded = function() {
          render();
          return cbNative();
        };
        if (!document.head.querySelector('script[src^="https://www.google.com/recaptcha/api.js"]')) {
          const script = document.createElement('script');
          script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoaded&render=explicit';
          return document.head.appendChild(script);
        }
      }
    });
  },

  afterSetup(mutations) {
    for (var mutation of mutations) {
      for (var node of mutation.addedNodes) {
        var iframe, textarea;
        if (iframe   = $.x('./descendant-or-self::iframe[starts-with(@src, "https://www.google.com/recaptcha/")]',   node)) { this.setupIFrame(iframe); }
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
      return $.on(iframe.parentNode, 'scroll', function() { return this.scrollTop = 0; });
    }
  },

  fixQRPosition() {
    if (QR.nodes.el.getBoundingClientRect().bottom > doc.clientHeight) {
      QR.nodes.el.style.top    = '';
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
      $.global(function() {
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
      timeout:  Date.now() + this.lifetime
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
        if (this.timeouts.destroy == null) { this.timeouts.destroy = setTimeout(this.destroy.bind(this), 3 * $.SECOND); }
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
      return $.global(function() {
        const container = document.querySelector('#qr .captcha-container');
        return window.grecaptcha.reset(container.dataset.widgetID);
      });
    }
  },

  occupied() {
    return !!this.nodes.container && !this.timeouts.destroy;
  }
};
