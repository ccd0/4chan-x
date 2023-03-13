/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var PSAHiding = {
  init() {
    if (!Conf['Announcement Hiding'] || !g.SITE.selectors.psa) { return; }
    $.addClass(doc, 'hide-announcement');
    $.onExists(doc, g.SITE.selectors.psa, this.setup);
    return $.ready(function() {
      if (!$(g.SITE.selectors.psa)) { return $.rmClass(doc, 'hide-announcement'); }
    });
  },

  setup(psa) {
    let btn, hr;
    PSAHiding.psa = psa;
    PSAHiding.text = psa.dataset.utc ?? psa.innerHTML;
    if (g.SITE.selectors.psaTop && (hr = $(g.SITE.selectors.psaTop)?.previousElementSibling) && (hr.nodeName === 'HR')) {
      PSAHiding.hr = hr;
    }
    PSAHiding.content = $.el('div');

    const entry = {
      el: $.el('a', {
        textContent: 'Show announcement',
        className: 'show-announcement',
        href: 'javascript:;'
      }
      ),
      order: 50,
      open() { return psa.hidden; }
    };
    Header.menu.addEntry(entry);
    $.on(entry.el, 'click', PSAHiding.toggle);

    PSAHiding.btn = (btn = $.el('a', {
      title:     'Mark announcement as read and hide.',
      className: 'hide-announcement-button fa fa-minus-square',
      href:      'javascript:;'
    }
    ));
    $.on(btn, 'click', PSAHiding.toggle);
    if (psa.firstChild?.tagName === 'HR') {
      $.after(psa.firstChild, btn);
    } else {
      $.prepend(psa, btn);
    }

    PSAHiding.sync(Conf['hiddenPSAList']);
    $.rmClass(doc, 'hide-announcement');

    return $.sync('hiddenPSAList', PSAHiding.sync);
  },

  toggle() {
    const hide = $.hasClass(this, 'hide-announcement-button');
    const set = function(hiddenPSAList) {
      if (hide) {
        return hiddenPSAList[g.SITE.ID] = PSAHiding.text;
      } else {
        return delete hiddenPSAList[g.SITE.ID];
      }
    };
    set(Conf['hiddenPSAList']);
    PSAHiding.sync(Conf['hiddenPSAList']);
    return $.get('hiddenPSAList', Conf['hiddenPSAList'], function({hiddenPSAList}) {
      set(hiddenPSAList);
      return $.set('hiddenPSAList', hiddenPSAList);
    });
  },

  sync(hiddenPSAList) {
    const {psa, content} = PSAHiding;
    psa.hidden = (hiddenPSAList[g.SITE.ID] === PSAHiding.text);
    // Remove content to prevent autoplaying sounds from hidden announcements
    if (psa.hidden) {
      $.add(content, [...Array.from(psa.childNodes)]);
    } else {
      $.add(psa, [...Array.from(content.childNodes)]);
    }
    // TODO check if hr exists
    return PSAHiding.hr.hidden = psa.hidden;
  }
};
