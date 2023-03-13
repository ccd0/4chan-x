/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
Captcha.replace = {
  init() {
    if ((g.SITE.software !== 'yotsuba') || (d.cookie.indexOf('pass_enabled=1') >= 0)) { return; }

    if (Conf['Force Noscript Captcha'] && Main.jsEnabled) {
      $.ready(Captcha.replace.noscript);
      return;
    }

    if (Conf['captchaLanguage'].trim()) {
      if (['boards.4chan.org', 'boards.4channel.org'].includes(location.hostname)) {
        return $.onExists(doc, '#captchaFormPart', node => $.onExists(node, 'iframe[src^="https://www.google.com/recaptcha/"]', Captcha.replace.iframe));
      } else {
        return $.onExists(doc, 'iframe[src^="https://www.google.com/recaptcha/"]', Captcha.replace.iframe);
      }
    }
  },

  noscript() {
    let noscript, original, toggle;
    if (!((original = $('#g-recaptcha')) && (noscript = $('noscript', original.parentNode)))) { return; }
    const span = $.el('span',
      {id: 'captcha-forced-noscript'});
    $.replace(noscript, span);
    $.rm(original);
    const insert = function() {
      span.innerHTML = noscript.textContent;
      return Captcha.replace.iframe($('iframe[src^="https://www.google.com/recaptcha/"]', span));
    };
    if (toggle = $('#togglePostFormLink a, #form-link')) {
      return $.on(toggle, 'click', insert);
    } else {
      return insert();
    }
  },

  iframe(iframe) {
    let lang;
    if (lang = Conf['captchaLanguage'].trim()) {
      const src = /[?&]hl=/.test(iframe.src) ?
        iframe.src.replace(/([?&]hl=)[^&]*/, '$1' + encodeURIComponent(lang))
      :
        iframe.src + `&hl=${encodeURIComponent(lang)}`;
      if (iframe.src !== src) { iframe.src = src; }
    }
  }
};
