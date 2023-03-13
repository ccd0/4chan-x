/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
Captcha.t = {
  init() {
    if (d.cookie.indexOf('pass_enabled=1') >= 0) { return; }
    if (!(this.isEnabled = !!$('#t-root') || !$.id('postForm'))) { return; }

    const root = $.el('div', {className: 'captcha-root'});
    this.nodes = {root};

    $.addClass(QR.nodes.el, 'has-captcha', 'captcha-t');
    return $.after(QR.nodes.com.parentNode, root);
  },

  moreNeeded() {
  },

  getThread() {
    let threadID;
    const boardID = g.BOARD.ID;
    if (QR.posts[0].thread === 'new') {
      threadID = '0';
    } else {
      threadID = '' + QR.posts[0].thread;
    }
    return {boardID, threadID};
  },

  setup(focus) {
    if (!this.isEnabled) { return; }

    if (!this.nodes.container) {
      this.nodes.container = $.el('div', {className: 'captcha-container'});
      $.prepend(this.nodes.root, this.nodes.container);
      Captcha.t.currentThread = Captcha.t.getThread();
      $.global(function() {
        const el = document.querySelector('#qr .captcha-container');
        window.TCaptcha.init(el, this.boardID, +this.threadID);
        return window.TCaptcha.setErrorCb(err => window.dispatchEvent(new CustomEvent('CreateNotification', {detail: {
          type: 'warning',
          content: '' + err
        }})
        ));
      }
      , Captcha.t.currentThread);
    }

    if (focus) {
      return $('#t-resp').focus();
    }
  },

  destroy() {
    if (!this.isEnabled || !this.nodes.container) { return; }
    $.global(() => window.TCaptcha.destroy());
    $.rm(this.nodes.container);
    return delete this.nodes.container;
  },

  updateThread() {
    if (!this.isEnabled) { return; }
    const {boardID, threadID} = (Captcha.t.currentThread || {});
    const newThread = Captcha.t.getThread();
    if ((newThread.boardID !== boardID) || (newThread.threadID !== threadID)) {
      Captcha.t.destroy();
      return Captcha.t.setup();
    }
  },

  getOne() {
    let el;
    let response = {};
    if (this.nodes.container) {
      for (var key of ['t-response', 't-challenge']) {
        response[key] = $(`[name='${key}']`, this.nodes.container).value;
      }
    }
    if (!response['t-response'] && !((el = $('#t-msg')) && /Verification not required/i.test(el.textContent))) {
      response = null;
    }
    return response;
  },

  setUsed() {
    if (!this.isEnabled) { return; }
    if (this.nodes.container) {
      return $.global(() => window.TCaptcha.clearChallenge());
    }
  },

  occupied() {
    return !!this.nodes.container;
  }
};
