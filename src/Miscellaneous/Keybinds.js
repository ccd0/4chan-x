/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var Keybinds = {
  init() {
    if (!Conf['Keybinds']) { return; }

    for (var hotkey in Config.hotkeys) {
      $.sync(hotkey, Keybinds.sync);
    }

    var init = function() {
      $.off(d, '4chanXInitFinished', init);
      $.on(d, 'keydown', Keybinds.keydown);
      for (var node of $$('[accesskey]')) {
        node.removeAttribute('accesskey');
      }
    };
    return $.on(d, '4chanXInitFinished', init);
  },

  sync(key, hotkey) {
    return Conf[hotkey] = key;
  },

  keydown(e) {
    let key, thread, threadRoot;
    let catalog, notifications;
    if (!(key = Keybinds.keyCode(e))) { return; }
    const {target} = e;
    if (['INPUT', 'TEXTAREA'].includes(target.nodeName)) {
      if (!/(Esc|Alt|Ctrl|Meta|Shift\+\w{2,})/.test(key) || !!/^Alt\+(\d|Up|Down|Left|Right)$/.test(key)) { return; }
    }
    if (['index', 'thread'].includes(g.VIEW)) {
      threadRoot = Nav.getThread();
      thread = Get.threadFromRoot(threadRoot);
    }
    switch (key) {
      // QR & Options
      case Conf['Toggle board list']:
        if (!Conf['Custom Board Navigation']) { return; }
        Header.toggleBoardList();
        break;
      case Conf['Toggle header']:
        Header.toggleBarVisibility();
        break;
      case Conf['Open empty QR']:
        if (!QR.postingIsEnabled) { return; }
        Keybinds.qr();
        break;
      case Conf['Open QR']:
        if (!QR.postingIsEnabled || !threadRoot) { return; }
        Keybinds.qr(threadRoot);
        break;
      case Conf['Open settings']:
        Settings.open();
        break;
      case Conf['Close']:
        if (Settings.dialog) {
          Settings.close();
        } else if ((notifications = $$('.notification')).length) {
          for (var notification of notifications) {
            $('.close', notification).click();
          }
        } else if (QR.nodes && !(QR.nodes.el.hidden || (window.getComputedStyle(QR.nodes.form).display === 'none'))) {
          if (Conf['Persistent QR']) {
            QR.hide();
          } else {
            QR.close();
          }
        } else if (Embedding.lastEmbed) {
          Embedding.closeFloat();
        } else {
          return;
        }
        break;
      case Conf['Spoiler tags']:
        if (target.nodeName !== 'TEXTAREA') { return; }
        Keybinds.tags('spoiler', target);
        break;
      case Conf['Code tags']:
        if (target.nodeName !== 'TEXTAREA') { return; }
        Keybinds.tags('code', target);
        break;
      case Conf['Eqn tags']:
        if (target.nodeName !== 'TEXTAREA') { return; }
        Keybinds.tags('eqn', target);
        break;
      case Conf['Math tags']:
        if (target.nodeName !== 'TEXTAREA') { return; }
        Keybinds.tags('math', target);
        break;
      case Conf['SJIS tags']:
        if (target.nodeName !== 'TEXTAREA') { return; }
        Keybinds.tags('sjis', target);
        break;
      case Conf['Toggle sage']:
        if (!QR.nodes || !!QR.nodes.el.hidden) { return; }
        Keybinds.sage();
        break;
      case Conf['Toggle Cooldown']:
        if (!QR.nodes || !!QR.nodes.el.hidden || !$.hasClass(QR.nodes.fileSubmit, 'custom-cooldown')) { return; }
        QR.toggleCustomCooldown();
        break;
      case Conf['Post from URL']:
        if (!QR.postingIsEnabled) { return; }
        QR.handleUrl('');
        break;
      case Conf['Add new post']:
        if (!QR.postingIsEnabled) { return; }
        QR.addPost();
        break;
      case Conf['Submit QR']:
        if (!QR.nodes || !!QR.nodes.el.hidden) { return; }
        if (!QR.status()) { QR.submit(); }
        break;
      // Index/Thread related
      case Conf['Update']:
        switch (g.VIEW) {
          case 'thread':
            if (!ThreadUpdater.enabled) { return; }
            ThreadUpdater.update();
            break;
          case 'index':
            if (!Index.enabled) { return; }
            Index.update();
            break;
          default:
            return;
        }
        break;
      case Conf['Watch']:
        if (!ThreadWatcher.enabled || !thread) { return; }
        ThreadWatcher.toggle(thread);
        break;
      case Conf['Update thread watcher']:
        if (!ThreadWatcher.enabled) { return; }
        ThreadWatcher.buttonFetchAll();
        break;
      case Conf['Toggle thread watcher']:
        if (!ThreadWatcher.enabled) { return; }
        ThreadWatcher.toggleWatcher();
        break;
      case Conf['Toggle threading']:
        if (!QuoteThreading.ready) { return; }
        QuoteThreading.toggleThreading();
        break;
      case Conf['Mark thread read']:
        if ((g.VIEW !== 'index') || !thread || !UnreadIndex.enabled) { return; }
        UnreadIndex.markRead.call(threadRoot);
        break;
      // Images
      case Conf['Expand image']:
        if (!ImageExpand.enabled || !threadRoot) { return; }
        var post = Get.postFromNode(Keybinds.post(threadRoot));
        if (post.file) { ImageExpand.toggle(post); }
        break;
      case Conf['Expand images']:
        if (!ImageExpand.enabled) { return; }
        ImageExpand.cb.toggleAll();
        break;
      case Conf['Open Gallery']:
        if (!Gallery.enabled) { return; }
        Gallery.cb.toggle();
        break;
      case Conf['fappeTyme']:
        if (!FappeTyme.nodes?.fappe) { return; }
        FappeTyme.toggle('fappe');
        break;
      case Conf['werkTyme']:
        if (!FappeTyme.nodes?.werk) { return; }
        FappeTyme.toggle('werk');
        break;
      // Board Navigation
      case Conf['Front page']:
        if (Index.enabled) {
          Index.userPageNav(1);
        } else {
          location.href = `/${g.BOARD}/`;
        }
        break;
      case Conf['Open front page']:
        $.open(`${location.origin}/${g.BOARD}/`);
        break;
      case Conf['Next page']:
        if ((g.VIEW !== 'index') || !!g.SITE.isOnePage?.(g.BOARD)) { return; }
        if (Index.enabled) {
          if (!['paged', 'infinite'].includes(Conf['Index Mode'])) { return; }
          $('.next button', Index.pagelist).click();
        } else {
          $(g.SITE.selectors.nav.next)?.click();
        }
        break;
      case Conf['Previous page']:
        if ((g.VIEW !== 'index') || !!g.SITE.isOnePage?.(g.BOARD)) { return; }
        if (Index.enabled) {
          if (!['paged', 'infinite'].includes(Conf['Index Mode'])) { return; }
          $('.prev button', Index.pagelist).click();
        } else {
          $(g.SITE.selectors.nav.prev)?.click();
        }
        break;
      case Conf['Search form']:
        if (g.VIEW !== 'index') { return; }
        var searchInput = Index.enabled ?
          Index.searchInput
        : g.SITE.selectors.searchBox ?
          $(g.SITE.selectors.searchBox)
        :
          undefined;
        if (!searchInput) { return; }
        Header.scrollToIfNeeded(searchInput);
        searchInput.focus();
        break;
      case Conf['Paged mode']:
        if (!Index.enabledOn(g.BOARD)) { return; }
        location.href = g.VIEW === 'index' ? '#paged' : `/${g.BOARD}/#paged`;
        break;
      case Conf['Infinite scrolling mode']:
        if (!Index.enabledOn(g.BOARD)) { return; }
        location.href = g.VIEW === 'index' ? '#infinite' : `/${g.BOARD}/#infinite`;
        break;
      case Conf['All pages mode']:
        if (!Index.enabledOn(g.BOARD)) { return; }
        location.href = g.VIEW === 'index' ? '#all-pages' : `/${g.BOARD}/#all-pages`;
        break;
      case Conf['Open catalog']:
        if (!(catalog = CatalogLinks.catalog())) { return; }
        location.href = catalog;
        break;
      case Conf['Cycle sort type']:
        if (!Index.enabled) { return; }
        Index.cycleSortType();
        break;
      // Thread Navigation
      case Conf['Next thread']:
        if ((g.VIEW !== 'index') || !threadRoot) { return; }
        Nav.scroll(+1);
        break;
      case Conf['Previous thread']:
        if ((g.VIEW !== 'index') || !threadRoot) { return; }
        Nav.scroll(-1);
        break;
      case Conf['Expand thread']:
        if ((g.VIEW !== 'index') || !threadRoot) { return; }
        ExpandThread.toggle(thread);
        // Keep thread from moving off screen when contracted.
        Header.scrollTo(threadRoot);
        break;
      case Conf['Open thread']:
        if ((g.VIEW !== 'index') || !threadRoot) { return; }
        Keybinds.open(thread);
        break;
      case Conf['Open thread tab']:
        if ((g.VIEW !== 'index') || !threadRoot) { return; }
        Keybinds.open(thread, true);
        break;
      // Reply Navigation
      case Conf['Next reply']:
        if (!threadRoot) { return; }
        Keybinds.hl(+1, threadRoot);
        break;
      case Conf['Previous reply']:
        if (!threadRoot) { return; }
        Keybinds.hl(-1, threadRoot);
        break;
      case Conf['Deselect reply']:
        if (!threadRoot) { return; }
        Keybinds.hl(0, threadRoot);
        break;
      case Conf['Hide']:
        if (!thread || !ThreadHiding.db) { return; }
        Header.scrollTo(threadRoot);
        ThreadHiding.toggle(thread);
        break;
      case Conf['Quick Filter MD5']:
        if (!threadRoot) { return; }
        post = Keybinds.post(threadRoot);
        Keybinds.hl(+1, threadRoot);
        Filter.quickFilterMD5.call(post, e);
        break;
      case Conf['Previous Post Quoting You']:
        if (!threadRoot || !QuoteYou.db) { return; }
        QuoteYou.cb.seek('preceding');
        break;
      case Conf['Next Post Quoting You']:
        if (!threadRoot || !QuoteYou.db) { return; }
        QuoteYou.cb.seek('following');
        break;
      default:
        return;
    }
    e.preventDefault();
    return e.stopPropagation();
  },

  keyCode(e) {
    let key = (() => { let kc;
    switch ((kc = e.keyCode)) {
      case 8: // return
        return '';
      case 13:
        return 'Enter';
      case 27:
        return 'Esc';
      case 32:
        return 'Space';
      case 37:
        return 'Left';
      case 38:
        return 'Up';
      case 39:
        return 'Right';
      case 40:
        return 'Down';
      case 188:
        return 'Comma';
      case 190:
        return 'Period';
      case 191:
        return 'Slash';
      case 59: case 186:
        return 'Semicolon';
      default:
        if ((48 <= kc && kc <= 57) || (65 <= kc && kc <= 90)) { // 0-9, A-Z
          return String.fromCharCode(kc).toLowerCase();
        } else if (96 <= kc && kc <= 105) { // numpad 0-9
          return String.fromCharCode(kc - 48).toLowerCase();
        } else {
          return null;
        }
    } })();
    if (key) {
      if (e.altKey) {   key = 'Alt+'   + key; }
      if (e.ctrlKey) {  key = 'Ctrl+'  + key; }
      if (e.metaKey) {  key = 'Meta+'  + key; }
      if (e.shiftKey) { key = 'Shift+' + key; }
    }
    return key;
  },

  post(thread) {
    const s = g.SITE.selectors;
    return (
      $(`${s.postContainer}${s.highlightable.reply}.${g.SITE.classes.highlight}`, thread) ||
      $(`${g.SITE.isOPContainerThread ? s.thread : s.postContainer}${s.highlightable.op}`, thread)
    );
  },

  qr(thread) {
    QR.open();
    if (thread != null) {
      QR.quote.call(Keybinds.post(thread));
    }
    return QR.nodes.com.focus();
  },

  tags(tag, ta) {
    BoardConfig.ready(function() {
      const {config} = g.BOARD;
      const supported = (() => { switch (tag) {
        case 'spoiler':     return !!config.spoilers;
        case 'code':        return !!config.code_tags;
        case 'math': case 'eqn': return !!config.math_tags;
        case 'sjis':        return !!config.sjis_tags;
      } })();
      if (!supported) { return new Notice('warning', `[${tag}] tags are not supported on /${g.BOARD}/.`, 20); }
    });

    const {
      value
    } = ta;
    const selStart = ta.selectionStart;
    const selEnd   = ta.selectionEnd;

    ta.value =
      value.slice(0, selStart) +
      `[${tag}]` + value.slice(selStart, selEnd) + `[/${tag}]` +
      value.slice(selEnd);

    // Move the caret to the end of the selection.
    const range = (`[${tag}]`).length + selEnd;
    ta.setSelectionRange(range, range);

    // Fire the 'input' event
    return $.event('input', null, ta);
  },

  sage() {
    const isSage  = /sage/i.test(QR.nodes.email.value);
    return QR.nodes.email.value = isSage ?
      ""
    : "sage";
  },

  open(thread, tab) {
    if (g.VIEW !== 'index') { return; }
    const url = Get.url('thread', thread);
    if (tab) {
      return $.open(url);
    } else {
      return location.href = url;
    }
  },

  hl(delta, thread) {
    const replySelector = `${g.SITE.selectors.postContainer}${g.SITE.selectors.highlightable.reply}`;
    const {highlight} = g.SITE.classes;

    const postEl = $(`${replySelector}.${highlight}`, thread);

    if (!delta) {
      if (postEl) { $.rmClass(postEl, highlight); }
      return;
    }

    if (postEl) {
      const {height} = postEl.getBoundingClientRect();
      if ((Header.getTopOf(postEl) >= -height) && (Header.getBottomOf(postEl) >= -height)) { // We're at least partially visible
        let next;
        const {root} = Get.postFromNode(postEl).nodes;
        const axis = delta === +1 ?
          'following'
        :
          'preceding';
        if (!(next = $.x(`${axis}-sibling::${g.SITE.xpath.replyContainer}[not(@hidden) and not(child::div[@class='stub'])][1]`, root))) { return; }
        if (!next.matches(replySelector)) { next = $(replySelector, next); }
        Header.scrollToIfNeeded(next, delta === +1);
        $.addClass(next, highlight);
        $.rmClass(postEl, highlight);
        return;
      }
      $.rmClass(postEl, highlight);
    }

    const replies = $$(replySelector, thread);
    if (delta === -1) { replies.reverse(); }
    for (var reply of replies) {
      if (((delta === +1) && (Header.getTopOf(reply) > 0)) || ((delta === -1) && (Header.getBottomOf(reply) > 0))) {
        $.addClass(reply, highlight);
        return;
      }
    }
  }
};
