/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var Header = {
  init() {
    $.onExists(doc, 'body', () => {
      if (!Main.isThisPageLegit()) { return; }
      $.add(this.bar, [this.noticesRoot, this.toggle]);
      $.prepend(d.body, this.bar);
      $.add(d.body, Header.hover);
      return this.setBarPosition(Conf['Bottom Header']);
  });

    this.menu = new UI.Menu('header');

    const menuButton = $.el('span',
      {className: 'menu-button'});
    $.extend(menuButton, {innerHTML: "<i></i>"});

    const box = UI.checkbox;

    const barFixedToggler     = box('Fixed Header',               'Fixed Header');
    const headerToggler       = box('Header auto-hide',           'Auto-hide header');
    const scrollHeaderToggler = box('Header auto-hide on scroll', 'Auto-hide header on scroll');
    const barPositionToggler  = box('Bottom Header',              'Bottom header');
    const linkJustifyToggler  = box('Centered links',             'Centered links');
    const customNavToggler    = box('Custom Board Navigation',    'Custom board navigation');
    const footerToggler       = box('Bottom Board List',          'Hide bottom board list');
    const shortcutToggler     = box('Shortcut Icons',             'Shortcut Icons');
    const editCustomNav = $.el('a', {
      textContent: 'Edit custom board navigation',
      href: 'javascript:;'
    }
    );

    this.barFixedToggler     = barFixedToggler.firstElementChild;
    this.scrollHeaderToggler = scrollHeaderToggler.firstElementChild;
    this.barPositionToggler  = barPositionToggler.firstElementChild;
    this.linkJustifyToggler  = linkJustifyToggler.firstElementChild;
    this.headerToggler       = headerToggler.firstElementChild;
    this.footerToggler       = footerToggler.firstElementChild;
    this.shortcutToggler     = shortcutToggler.firstElementChild;
    this.customNavToggler    = customNavToggler.firstElementChild;

    $.on(menuButton,           'click',  this.menuToggle);
    $.on(this.headerToggler,       'change', this.toggleBarVisibility);
    $.on(this.barFixedToggler,     'change', this.toggleBarFixed);
    $.on(this.barPositionToggler,  'change', this.toggleBarPosition);
    $.on(this.scrollHeaderToggler, 'change', this.toggleHideBarOnScroll);
    $.on(this.linkJustifyToggler,  'change', this.toggleLinkJustify);
    $.on(this.footerToggler,       'change', this.toggleFooterVisibility);
    $.on(this.shortcutToggler,     'change', this.toggleShortcutIcons);
    $.on(this.customNavToggler,    'change', this.toggleCustomNav);
    $.on(editCustomNav,        'click',  this.editCustomNav);

    this.setBarFixed(Conf['Fixed Header']);
    this.setHideBarOnScroll(Conf['Header auto-hide on scroll']);
    this.setBarVisibility(Conf['Header auto-hide']);
    this.setLinkJustify(Conf['Centered links']);
    this.setShortcutIcons(Conf['Shortcut Icons']);
    this.setFooterVisibility(Conf['Bottom Board List']);

    $.sync('Fixed Header',               this.setBarFixed);
    $.sync('Header auto-hide on scroll', this.setHideBarOnScroll);
    $.sync('Bottom Header',              this.setBarPosition);
    $.sync('Shortcut Icons',             this.setShortcutIcons);
    $.sync('Header auto-hide',           this.setBarVisibility);
    $.sync('Centered links',             this.setLinkJustify);
    $.sync('Bottom Board List',          this.setFooterVisibility);

    this.addShortcut('menu', menuButton, 900);

    this.menu.addEntry({
      el: $.el('span',
        {textContent: 'Header'}),
      order: 107,
      subEntries: [
          {el: barFixedToggler}
        ,
          {el: headerToggler}
        ,
          {el: scrollHeaderToggler}
        ,
          {el: barPositionToggler}
        ,
          {el: linkJustifyToggler}
        ,
          {el: footerToggler}
        ,
          {el: shortcutToggler}
        ,
          {el: customNavToggler}
        ,
          {el: editCustomNav}
      ]});

    $.on(window, 'load popstate', Header.hashScroll);
    $.on(d, 'CreateNotification', this.createNotification);

    this.setBoardList();

    $.onExists(doc, `${g.SITE.selectors.boardList} + *`, Header.generateFullBoardList);

    Main.ready(function() {
      let footer;
      if ((g.SITE.software === 'yotsuba') && !(footer = $.id('boardNavDesktopFoot'))) {
        let absbot;
        if (!(absbot = $.id('absbot'))) { return; }
        footer = $.id('boardNavDesktop').cloneNode(true);
        footer.id = 'boardNavDesktopFoot';
        $('#navtopright',        footer).id = 'navbotright';
        $('#settingsWindowLink', footer).id = 'settingsWindowLinkBot';
        $.before(absbot, footer);
        $.global(() => window.cloneTopNav = function() {});
      }
      if (Header.bottomBoardList = $(g.SITE.selectors.boardListBottom)) {
        for (var a of $$('a', Header.bottomBoardList)) {
          if ((a.hostname === location.hostname) && (a.pathname.split('/')[1] === g.BOARD.ID)) { a.className = 'current'; }
        }
        return CatalogLinks.setLinks(Header.bottomBoardList);
      }
    });

    if ((g.SITE.software === 'yotsuba') && ((g.VIEW === 'catalog') || !Conf['Disable Native Extension'])) {
      const cs = $.el('a', {href: 'javascript:;'});
      if (g.VIEW === 'catalog') {
        cs.title = (cs.textContent = 'Catalog Settings');
        cs.className = 'fa fa-book';
      } else {
        cs.title = (cs.textContent = '4chan Settings');
        cs.className = 'native-settings';
      }
      $.on(cs, 'click', () => $.id('settingsWindowLink').click());
      this.addShortcut('native', cs, 810);
    }

    return this.enableDesktopNotifications();
  },

  bar: $.el('div',
    {id: 'header-bar'}),

  noticesRoot: $.el('div',
    {id: 'notifications'}),

  shortcuts: $.el('span',
    {id: 'shortcuts'}),

  hover: $.el('div',
    {id: 'hoverUI'}),

  toggle: $.el('div',
    {id: 'scroll-marker'}),

  setBoardList() {
    let boardList;
    Header.boardList = (boardList = $.el('span',
      {id: 'board-list'}));
    $.extend(boardList, {innerHTML: "<span id=\"custom-board-list\"></span><span id=\"full-board-list\" hidden><span class=\"hide-board-list-container brackets-wrap\"><a href=\"javascript:;\" class=\"hide-board-list-button\">&nbsp;-&nbsp;</a></span> <span class=\"boardList\"></span></span>"});

    const btn = $('.hide-board-list-button', boardList);
    $.on(btn, 'click', Header.toggleBoardList);

    $.prepend(Header.bar, [Header.boardList, Header.shortcuts]);

    Header.setCustomNav(Conf['Custom Board Navigation']);
    Header.generateBoardList(Conf['boardnav']);

    $.sync('Custom Board Navigation', Header.setCustomNav);
    return $.sync('boardnav', Header.generateBoardList);
  },

  generateFullBoardList() {
    let nodes;
    if (g.SITE.transformBoardList) {
      nodes = g.SITE.transformBoardList();
    } else {
      nodes = [...Array.from($(g.SITE.selectors.boardList).cloneNode(true).childNodes)];
    }
    const fullBoardList = $('.boardList', Header.boardList);
    $.add(fullBoardList, nodes);
    for (var a of $$('a', fullBoardList)) {
      if ((a.hostname === location.hostname) && (a.pathname.split('/')[1] === g.BOARD.ID)) { a.className = 'current'; }
    }
    return CatalogLinks.setLinks(fullBoardList);
  },

  generateBoardList(boardnav) {
    const list = $('#custom-board-list', Header.boardList);
    $.rmAll(list);
    if (!boardnav) { return; }
    boardnav = boardnav.replace(/(\r\n|\n|\r)/g, ' ');
    const re = /[\w@]+(-(all|title|replace|full|index|catalog|archive|expired|nt|(mode|sort|text):"[^"]+"(,"[^"]+")?))*|[^\w@]+/g;
    const nodes = (boardnav.match(re).map((t) => Header.mapCustomNavigation(t)));
    $.add(list, nodes);
    return CatalogLinks.setLinks(list);
  },

  mapCustomNavigation(t) {
    let a, href, m, url;
    if (/^[^\w@]/.test(t)) {
      return $.tn(t);
    }

    let text = (url = null);
    t = t.replace(/-text:"([^"]+)"(?:,"([^"]+)")?/g, function(m0, m1, m2) {
      text = m1;
      url  = m2;
      return '';
    });

    let indexOptions = [];
    t = t.replace(/-(?:mode|sort):"([^"]+)"/g, function(m0, m1) {
      indexOptions.push(m1.toLowerCase().replace(/\ /g, '-'));
      return '';
    });
    indexOptions = indexOptions.join('/');

    if (/^toggle-all/.test(t)) {
      a = $.el('a', {
        className: 'show-board-list-button',
        textContent: text || '+',
        href: 'javascript:;'
      }
      );
      $.on(a, 'click', Header.toggleBoardList);
      return a;
    }

    if (/^external/.test(t)) {
      a = $.el('a', {
        href: url || 'javascript:;',
        textContent: text || '+',
        className: 'external'
      }
      );
      if (/-nt/.test(t)) {
        a.target = '_blank';
        a.rel = 'noopener';
      }
      return a;
    }

    let boardID = t.split('-')[0];
    if (boardID === 'current') {
      if (['boards.4chan.org', 'boards.4channel.org'].includes(location.hostname)) {
        boardID = g.BOARD.ID;
      } else {
        a = $.el('a', {
          href: `/${g.BOARD.ID}/`,
          textContent: text || decodeURIComponent(g.BOARD.ID),
          className: 'current'
        }
        );
        if (/-nt/.test(t)) {
          a.target = '_blank';
          a.rel = 'noopener';
        }
        if (/-index/.test(t)) {
          a.dataset.only = 'index';
        } else if (/-catalog/.test(t)) {
          a.dataset.only = 'catalog';
          a.href += 'catalog.html';
        } else if (/-(archive|expired)/.test(t)) {
          a = a.firstChild; // Its text node.
        }
        return a;
      }
    }

    a = (function() {
      let urlV;
      if (boardID === '@') {
        return $.el('a', {
          href: 'https://twitter.com/4chan',
          title: '4chan Twitter',
          textContent: '@'
        }
        );
      }

      a = $.el('a', {
        href: `//${BoardConfig.domain(boardID)}/${boardID}/`,
        textContent: boardID,
        title: BoardConfig.title(boardID)
      }
      );
      if (['catalog', 'archive'].includes(g.VIEW) && (urlV = Get.url(g.VIEW, {siteID: '4chan.org', boardID}))) {
        a.href = urlV;
      }
      if ((a.hostname === location.hostname) && (boardID === g.BOARD.ID)) { a.className = 'current'; }
      return a;
    })();

    a.textContent = /-title/.test(t) || (/-replace/.test(t) && (a.hostname === location.hostname) && (boardID === g.BOARD.ID)) ?
      a.title || a.textContent
    : /-full/.test(t) ?
      (`/${boardID}/`) + (a.title ? ` - ${a.title}` : '')
    :
      text || boardID;

    if (m = t.match(/-(index|catalog)/)) {
      const urlIC = CatalogLinks[m[1]]({siteID: '4chan.org', boardID});
      if (urlIC) {
        a.dataset.only = m[1];
        a.href = urlIC;
        if (m[1] === 'catalog') { $.addClass(a, 'catalog'); }
      } else {
        return a.firstChild; // Its text node.
      }
    }

    if (Conf['JSON Index'] && indexOptions) {
      a.dataset.indexOptions = indexOptions;
      if (['boards.4chan.org', 'boards.4channel.org'].includes(a.hostname) && (a.pathname.split('/')[2] === '')) {
        a.href += (a.hash ? '/' : '#') + indexOptions;
      }
    }

    if (/-archive/.test(t)) {
      if (href = Redirect.to('board', {boardID})) {
        a.href = href;
      } else {
        return a.firstChild; // Its text node.
      }
    }

    if (/-expired/.test(t)) {
      if (BoardConfig.isArchived(boardID)) {
        a.href = `//${BoardConfig.domain(boardID)}/${boardID}/archive`;
      } else {
        return a.firstChild; // Its text node.
      }
    }

    if (/-nt/.test(t)) {
      a.target = '_blank';
      a.rel = 'noopener';
    }

    if (boardID === '@') { $.addClass(a, 'navSmall'); }
    return a;
  },

  toggleBoardList() {
    const {bar}  = Header;
    const custom = $('#custom-board-list', bar);
    const full   = $('#full-board-list',   bar);
    const showBoardList = !full.hidden;
    custom.hidden = !showBoardList;
    return full.hidden   =  showBoardList;
  },

  setLinkJustify(centered) {
    Header.linkJustifyToggler.checked = centered;
    if (centered) {
      return $.addClass(doc, 'centered-links');
    } else {
      return $.rmClass(doc, 'centered-links');
    }
  },

  toggleLinkJustify() {
    $.event('CloseMenu');
    const centered = this.nodeName === 'INPUT' ?
      this.checked : undefined;
    Header.setLinkJustify(centered);
    return $.set('Centered links', centered);
  },

  setBarFixed(fixed) {
    Header.barFixedToggler.checked = fixed;
    if (fixed) {
      $.addClass(doc, 'fixed');
      return $.addClass(Header.bar, 'dialog');
    } else {
      $.rmClass(doc, 'fixed');
      return $.rmClass(Header.bar, 'dialog');
    }
  },

  toggleBarFixed() {
    $.event('CloseMenu');

    Header.setBarFixed(this.checked);

    Conf['Fixed Header'] = this.checked;
    return $.set('Fixed Header',  this.checked);
  },

  setShortcutIcons(show) {
    Header.shortcutToggler.checked = show;
    if (show) {
      return $.addClass(doc, 'shortcut-icons');
    } else {
      return $.rmClass(doc, 'shortcut-icons');
    }
  },

  toggleShortcutIcons() {
    $.event('CloseMenu');

    Header.setShortcutIcons(this.checked);

    Conf['Shortcut Icons'] = this.checked;
    return $.set('Shortcut Icons',  this.checked);
  },

  setBarVisibility(hide) {
    Header.headerToggler.checked = hide;
    $.event('CloseMenu');
    (hide ? $.addClass : $.rmClass)(Header.bar, 'autohide');
    return (hide ? $.addClass : $.rmClass)(doc, 'autohide');
  },

  toggleBarVisibility() {
    const hide = this.nodeName === 'INPUT' ?
      this.checked
    :
      !$.hasClass(Header.bar, 'autohide');

    Conf['Header auto-hide'] = hide;
    $.set('Header auto-hide', hide);
    Header.setBarVisibility(hide);
    const message = `The header bar will ${hide ?
      'automatically hide itself.'
    :
      'remain visible.'}`;
    return new Notice('info', message, 2);
  },

  setHideBarOnScroll(hide) {
    Header.scrollHeaderToggler.checked = hide;
    if (hide) {
      $.on(window, 'scroll', Header.hideBarOnScroll);
      return;
    }
    $.off(window, 'scroll', Header.hideBarOnScroll);
    $.rmClass(Header.bar, 'scroll');
    return Header.bar.classList.toggle('autohide', Conf['Header auto-hide']);
  },

  toggleHideBarOnScroll() {
    const hide = this.checked;
    $.cb.checked.call(this);
    return Header.setHideBarOnScroll(hide);
  },

  hideBarOnScroll() {
    const offsetY = window.pageYOffset;
    if (offsetY > (Header.previousOffset || 0)) {
      $.addClass(Header.bar, 'autohide', 'scroll');
    } else {
      $.rmClass(Header.bar,  'autohide', 'scroll');
    }
    return Header.previousOffset = offsetY;
  },

  setBarPosition(bottom) {
    // TODO check if barPositionToggler exists
    Header.barPositionToggler.checked = bottom;
    $.event('CloseMenu');
    const args = bottom ? [
      'bottom-header',
      'top-header',
      'after'
    ] : [
      'top-header',
      'bottom-header',
      'add'
    ];

    $.addClass(doc, args[0]);
    $.rmClass(doc, args[1]);
    return $[args[2]](Header.bar, Header.noticesRoot);
  },

  toggleBarPosition() {
    $.cb.checked.call(this);
    return Header.setBarPosition(this.checked);
  },

  setFooterVisibility(hide) {
    Header.footerToggler.checked = hide;
    return doc.classList.toggle('hide-bottom-board-list', hide);
  },

  toggleFooterVisibility() {
    $.event('CloseMenu');
    const hide = this.nodeName === 'INPUT' ?
      this.checked
    :
      $.hasClass(doc, 'hide-bottom-board-list');
    Header.setFooterVisibility(hide);
    $.set('Bottom Board List', hide);
    const message = hide ?
      'The bottom navigation will now be hidden.'
    :
      'The bottom navigation will remain visible.';
    return new Notice('info', message, 2);
  },

  setCustomNav(show) {
    let ref;
    Header.customNavToggler.checked = show;
    const cust = $('#custom-board-list', Header.bar);
    const full = $('#full-board-list',   Header.bar);
    const btn = $('.hide-board-list-container', full);
    return [cust.hidden, full.hidden, btn.hidden] = Array.from(ref = show ?
      [false, true, false]
    :
      [true, false, true]), ref;
  },

  toggleCustomNav() {
    $.cb.checked.call(this);
    return Header.setCustomNav(this.checked);
  },

  editCustomNav() {
    Settings.open('Advanced');
    const settings = $.id('fourchanx-settings');
    return $('[name=boardnav]', settings).focus();
  },

  hashScroll(e) {
    let hash;
    if (e) {
      // Don't scroll when navigating to an already visited state.
      if (e.state) { return; }
      if (!history.state) { history.replaceState({}, ''); }
    }

    if (hash = location.hash.slice(1)) {
      let el;
      ReplyPruning.showIfHidden(hash);
      if (el = $.id(hash)) {
        return $.queueTask(() => Header.scrollTo(el));
      }
    }
  },

  scrollTo(root, down, needed) {
    let height, x;
    if (!root.offsetParent) { return; } // hidden or fixed
    if (down) {
      x = Header.getBottomOf(root);
      if (Conf['Fixed Header'] && Conf['Header auto-hide on scroll'] && Conf['Bottom header']) {
        ({height} = Header.bar.getBoundingClientRect());
        if (x <= 0) {
          if (!Header.isHidden()) { x += height; }
        } else {
          if  (Header.isHidden()) { x -= height; }
        }
      }
      if (!needed || (x < 0)) { return window.scrollBy(0, -x); }
    } else {
      x = Header.getTopOf(root);
      if (Conf['Fixed Header'] && Conf['Header auto-hide on scroll'] && !Conf['Bottom header']) {
        ({height} = Header.bar.getBoundingClientRect());
        if (x >= 0) {
          if (!Header.isHidden()) { x += height; }
        } else {
          if  (Header.isHidden()) { x -= height; }
        }
      }
      if (!needed || (x < 0)) { return window.scrollBy(0,  x); }
    }
  },

  scrollToIfNeeded(root, down) {
    return Header.scrollTo(root, down, true);
  },

  getTopOf(root) {
    let {top} = root.getBoundingClientRect();
    if (Conf['Fixed Header'] && !Conf['Bottom Header']) {
      const headRect = Header.toggle.getBoundingClientRect();
      top     -= headRect.top + headRect.height;
    }
    return top;
  },

  getBottomOf(root) {
    const {clientHeight} = doc;
    let bottom = clientHeight - root.getBoundingClientRect().bottom;
    if (Conf['Fixed Header'] && Conf['Bottom Header']) {
      const headRect = Header.toggle.getBoundingClientRect();
      bottom  -= (clientHeight - headRect.bottom) + headRect.height;
    }
    return bottom;
  },

  isNodeVisible(node) {
    if (d.hidden || !doc.contains(node)) { return false; }
    const {height} = node.getBoundingClientRect();
    return ((Header.getTopOf(node) + height) >= 0) && ((Header.getBottomOf(node) + height) >= 0);
  },

  isHidden() {
    const {top} = Header.bar.getBoundingClientRect();
    if (Conf['Bottom header']) {
      return top === doc.clientHeight;
    } else {
      return top < 0;
    }
  },

  addShortcut(id, el, index) {
    const shortcut = $.el('span', {
      id: `shortcut-${id}`,
      className: 'shortcut brackets-wrap'
    }
    );
    $.add(shortcut, el);
    shortcut.dataset.index = index;
    for (var item of $$('[data-index]', Header.shortcuts)) {
      if (+item.dataset.index > +index) {
        $.before(item, shortcut);
        return;
      }
    }
    return $.add(Header.shortcuts, shortcut);
  },

  rmShortcut(el) {
    return $.rm(el.parentElement);
  },

  menuToggle(e) {
    return Header.menu.toggle(e, this, g);
  },

  createNotification(e) {
    let notice;
    const {type, content, lifetime} = e.detail;
    return notice = new Notice(type, content, lifetime);
  },

  areNotificationsEnabled: false,
  enableDesktopNotifications() {
    let notice;
    if (!window.Notification || !Conf['Desktop Notifications']) { return; }
    switch (Notification.permission) {
      case 'granted':
        Header.areNotificationsEnabled = true;
        return;
        break;
      case 'denied':
        // requestPermission doesn't work if status is 'denied',
        // but it'll still work if status is 'default'.
        return;
        break;
    }

    // TODO meta
    const el = $.el('span',
      {innerHTML: "meta.name needs your permission to show desktop notifications. [<a href=\"meta.faq#why-is-4chan-x-asking-for-permission-to-show-desktop-notifications\" target=\"_blank\">FAQ</a>]<br><button>Authorize</button> or <button>Disable</button>"});
    const [authorize, disable] = Array.from($$('button', el));
    $.on(authorize, 'click', () => Notification.requestPermission(function(status) {
      Header.areNotificationsEnabled = status === 'granted';
      if (status === 'default') { return; }
      return notice.close();
    }));
    $.on(disable, 'click', function() {
      $.set('Desktop Notifications', false);
      return notice.close();
    });
    return notice = new Notice('info', el);
  }
};
