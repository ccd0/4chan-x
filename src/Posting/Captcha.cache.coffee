/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
Captcha.cache = {
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
        if (!$.event('RequestCaptcha', {isReply})) {
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
      if ($.event('RequestCaptcha', {isReply})) { return; }
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
};
