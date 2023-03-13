/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var Banner = {
  init() {
    if (Conf['Custom Board Titles']) {
      this.db = new DataBoard('customTitles', null, true);
    }

    $.asap((() => d.body), () => $.asap((() => $('hr')), Banner.ready));

    // Let 4chan's JS load the banner if enabled; otherwise, load it ourselves.
    if (g.BOARD.ID !== 'f') {
      return Main.ready(() => $.queueTask(Banner.load));
    }
  },

  ready() {
    const banner = $(".boardBanner");
    const {children} = banner;

    if ((g.VIEW === 'thread') && Conf['Remove Thread Excerpt']) {
      Banner.setTitle(children[1].textContent);
    }

    children[0].title = "Click to change";
    $.on(children[0], 'click', Banner.cb.toggle);

    if (Conf['Custom Board Titles']) {
      Banner.custom(children[1]);
      if (children[2]) { return Banner.custom(children[2]); }
    }
  },

  load() {
    const bannerCnt = $.id('bannerCnt');
    if (!bannerCnt.firstChild) {
      const img = $.el('img', {
        alt: '4chan',
        src: '//s.4cdn.org/image/title/' + bannerCnt.dataset.src
      }
      );
      return $.add(bannerCnt, img);
    }
  },

  setTitle(title) {
    if (Unread.title != null) {
      Unread.title = title;
      return Unread.update();
    } else {
      return d.title = title;
    }
  },

  cb: {
    toggle() {
      if (!Banner.choices?.length) {
        Banner.choices = Conf['knownBanners'].split(',').slice();
      }
      const i = Math.floor(Banner.choices.length * Math.random());
      const banner = Banner.choices.splice(i, 1);
      return $('img', this.parentNode).src = `//s.4cdn.org/image/title/${banner}`;
    },

    click(e) {
      if (!e.ctrlKey && !e.metaKey) { return; }
      if (Banner.original[this.className] == null) { Banner.original[this.className] = this.cloneNode(true); }
      this.contentEditable = true;
      for (var br of $$('br', this)) { $.replace(br, $.tn('\n')); }
      return this.focus();
    },

    keydown(e) {
      e.stopPropagation();
      if (!e.shiftKey && (e.keyCode === 13)) { return this.blur(); }
    },

    blur() {
      for (var br of $$('br', this)) { $.replace(br, $.tn('\n')); }
      if (this.textContent = this.textContent.replace(/\n*$/, '')) {
        this.contentEditable = false;
        return Banner.db.set({
          boardID:  g.BOARD.ID,
          threadID: this.className,
          val: {
            title: this.textContent,
            orig:  Banner.original[this.className].textContent
          }
        });
      } else {
        $.rmAll(this);
        $.add(this, [...Array.from(Banner.original[this.className].cloneNode(true).childNodes)]);
        return Banner.db.delete({
          boardID:  g.BOARD.ID,
          threadID: this.className
        });
      }
    }
  },

  original: $.dict(),

  custom(child) {
    let data;
    const {className} = child;
    child.title = `Ctrl/\u2318+click to edit board ${className.slice(5).toLowerCase()}`;
    child.spellcheck = false;

    for (var event of ['click', 'keydown', 'blur']) {
      $.on(child, event, Banner.cb[event]);
    }

    if (data = Banner.db.get({boardID: g.BOARD.ID, threadID: className})) {
      if (Conf['Persistent Custom Board Titles'] || (data.orig === child.textContent)) {
        Banner.original[className] = child.cloneNode(true);
        return child.textContent = data.title;
      } else {
        return Banner.db.delete({boardID: g.BOARD.ID, threadID: className});
      }
    }
  }
};
