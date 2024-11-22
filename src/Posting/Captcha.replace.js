import { g, Conf, doc, d } from "../globals/globals";
import Main from "../main/Main";
import $ from "../platform/$";

const CaptchaReplace = {
  init() {
    if ((g.SITE.software !== 'yotsuba') || (d.cookie.indexOf('pass_enabled=1') >= 0)) { return; }

    if (Conf['Force Noscript Captcha'] && Main.jsEnabled) {
      $.ready(this.noscript);
      return;
    }

    if (Conf['captchaLanguage'].trim()) {
      if (['boards.4chan.org', 'boards.4channel.org'].includes(location.hostname)) {
        $.onExists(doc, '#captchaFormPart', node => $.onExists(node, 'iframe[src^="https://www.google.com/recaptcha/"]', this.iframe));
      } else {
        $.onExists(doc, 'iframe[src^="https://www.google.com/recaptcha/"]', this.iframe);
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
      this.iframe($('iframe[src^="https://www.google.com/recaptcha/"]', span));
    };
    if (toggle = $('#togglePostFormLink a, #form-link')) {
      $.on(toggle, 'click', insert);
    } else {
      insert();
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
export default CaptchaReplace;
