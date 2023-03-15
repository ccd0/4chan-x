/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import Callbacks from '../classes/Callbacks';
import CatalogThread from '../classes/CatalogThread';
import Notice from '../classes/Notice';
import Post from '../classes/Post';
import Thread from '../classes/Thread';
import Config from '../config/Config';
import Filter from '../Filtering/Filter';
import PostHiding from '../Filtering/PostHiding';
import ThreadHiding from '../Filtering/ThreadHiding';
import Main from '../main/Main';
import CatalogLinks from '../Miscellaneous/CatalogLinks';
import RelativeDates from '../Miscellaneous/RelativeDates';
import ThreadWatcher from '../Monitoring/ThreadWatcher';
import $$ from '../platform/$$';
import $ from '../platform/$';
import QuotePreview from '../Quotelinks/QuotePreview';
import { c, Conf, d, doc, g } from '../globals/globals';
import Header from './Header';
import UI from './UI';
import Menu from '../Menu/Menu';

import NavLinksPage from './Index/NavLinks.html';
import PageListPage from './Index/PageList.html';
import BoardConfig from './BoardConfig';
import Get from './Get';
import { dict, SECOND } from '../platform/helpers';

var Index = {
  showHiddenThreads: false,
  changed: {},

  enabledOn({siteID, boardID}) {
    return Conf['JSON Index'] && (g.sites[siteID].software === 'yotsuba') && (boardID !== 'f');
  },

  init() {
    let input, inputs, name;
    if (g.VIEW !== 'index') { return; }

    // For IndexRefresh events
    $.one(d, '4chanXInitFinished', this.cb.initFinished);
    $.on(d, 'PostsInserted', this.cb.postsInserted);

    if (!this.enabledOn(g.BOARD)) { return; }

    this.enabled = true;

    Callbacks.Post.push({
      name: 'Index Page Numbers',
      cb:   this.node
    });
    Callbacks.CatalogThread.push({
      name: 'Catalog Features',
      cb:   this.catalogNode
    });

    this.search = history.state?.searched || '';
    if (history.state?.mode) {
      Conf['Index Mode'] = history.state?.mode;
    }
    this.currentSort = history.state?.sort;
    if (!this.currentSort) { this.currentSort = typeof Conf['Index Sort'] === 'object' ? (
        Conf['Index Sort'][g.BOARD.ID] || 'bump'
      ) : (
        Conf['Index Sort']
      ); }
    this.currentPage = this.getCurrentPage();
    this.processHash();

    $.addClass(doc, 'index-loading', `${Conf['Index Mode'].replace(/\ /g, '-')}-mode`);
    $.on(window, 'popstate', this.cb.popstate);
    $.on(d, 'scroll', this.scroll);
    $.on(d, 'SortIndex', this.cb.resort);

    // Header refresh button
    this.button = $.el('a', {
      className: 'fa fa-refresh',
      title: 'Refresh',
      href: 'javascript:;',
      textContent: 'Refresh Index'
    }
    );
    $.on(this.button, 'click', () => Index.update());
    Header.addShortcut('index-refresh', this.button, 590);

    // Header "Index Navigation" submenu
    const entries = [];
    this.inputs = (inputs = dict());
    for (name in Config.Index) {
      var arr = Config.Index[name];
      if (arr instanceof Array) {
        var label = UI.checkbox(name, `${name[0]}${name.slice(1).toLowerCase()}`);
        label.title = arr[1];
        entries.push({el: label});
        input = label.firstChild;
        $.on(input, 'change', $.cb.checked);
        inputs[name] = input;
      }
    }
    $.on(inputs['Show Replies'], 'change', this.cb.replies);
    $.on(inputs['Catalog Hover Expand'], 'change', this.cb.hover);
    $.on(inputs['Pin Watched Threads'], 'change', this.cb.resort);
    $.on(inputs['Anchor Hidden Threads'], 'change', this.cb.resort);

    const watchSettings = function(e) {
      if (input = $.getOwn(inputs, e.target.name)) {
        input.checked = e.target.checked;
        return $.event('change', null, input);
      }
    };
    $.on(d, 'OpenSettings', () => $.on($.id('fourchanx-settings'), 'change', watchSettings));

    const sortEntry = UI.checkbox('Per-Board Sort Type', 'Per-board sort type', (typeof Conf['Index Sort'] === 'object'));
    sortEntry.title = 'Set the sorting order of each board independently.';
    $.on(sortEntry.firstChild, 'change', this.cb.perBoardSort);
    entries.splice(3, 0, {el: sortEntry});

    Header.menu.addEntry({
      el: $.el('span',
        {textContent: 'Index Navigation'}),
      order: 100,
      subEntries: entries
    });

    // Navigation links at top of index
    this.navLinks = $.el('div', {className: 'navLinks json-index'});
    $.extend(this.navLinks, {innerHTML: NavLinksPage});
    $('.cataloglink a', this.navLinks).href = CatalogLinks.catalog();
    if (!BoardConfig.isArchived(g.BOARD.ID)) { $('.archlistlink', this.navLinks).hidden = true; }
    $.on($('#index-last-refresh a', this.navLinks), 'click', this.cb.refreshFront);

    // Search field
    this.searchInput = $('#index-search', this.navLinks);
    this.setupSearch();
    $.on(this.searchInput, 'input', this.onSearchInput);
    $.on($('#index-search-clear', this.navLinks), 'click', this.clearSearch);

    // Hidden threads toggle
    this.hideLabel = $('#hidden-label', this.navLinks);
    $.on($('#hidden-toggle a', this.navLinks), 'click', this.cb.toggleHiddenThreads);

    // Drop-down menus and reverse sort toggle
    this.selectRev   = $('#index-rev',  this.navLinks);
    this.selectMode  = $('#index-mode', this.navLinks);
    this.selectSort  = $('#index-sort', this.navLinks);
    this.selectSize  = $('#index-size', this.navLinks);
    $.on(this.selectRev,  'change', this.cb.sort);
    $.on(this.selectMode, 'change', this.cb.mode);
    $.on(this.selectSort, 'change', this.cb.sort);
    $.on(this.selectSize, 'change', $.cb.value);
    $.on(this.selectSize, 'change', this.cb.size);
    for (var select of [this.selectMode, this.selectSize]) {
      select.value = Conf[select.name];
    }
    this.selectRev.checked = /-rev$/.test(Index.currentSort);
    this.selectSort.value  = Index.currentSort.replace(/-rev$/, '');

    // Last Long Reply options
    this.lastLongOptions = $('#lastlong-options', this.navLinks);
    this.lastLongInputs = $$('input', this.lastLongOptions);
    this.lastLongThresholds = [0, 0];
    this.lastLongOptions.hidden = (this.selectSort.value !== 'lastlong');
    for (let i = 0; i < this.lastLongInputs.length; i++) {
      input = this.lastLongInputs[i];
      $.on(input, 'change', this.cb.lastLongThresholds);
      var tRaw = Conf[`Last Long Reply Thresholds ${i}`];
      input.value = (this.lastLongThresholds[i] =
        typeof tRaw === 'object' ? (tRaw[g.BOARD.ID] ?? 100) : tRaw);
    }

    // Thread container
    this.root = $.el('div', {className: 'board json-index'});
    $.on(this.root, 'click', this.cb.hoverToggle);
    this.cb.size();
    this.cb.hover();

    // Page list
    this.pagelist = $.el('div', {className: 'pagelist json-index'});
    $.extend(this.pagelist, {innerHTML: PageList});
    $('.cataloglink a', this.pagelist).href = CatalogLinks.catalog();
    $.on(this.pagelist, 'click', this.cb.pageNav);

    this.update(true);

    $.onExists(doc, 'title + *', () => d.title = d.title.replace(/\ -\ Page\ \d+/, ''));

    $.onExists(doc, '.board > .thread > .postContainer, .board + *', function() {
      let el;
      g.SITE.Build.hat = $('.board > .thread > img:first-child');
      if (g.SITE.Build.hat) {
        g.BOARD.threads.forEach(function(thread) {
          if (thread.nodes.root) {
            return $.prepend(thread.nodes.root, g.SITE.Build.hat.cloneNode(false));
          }
        });
        $.addClass(doc, 'hats-enabled');
        $.addStyle(`.catalog-thread::after {background-image: url(${g.SITE.Build.hat.src});}`);
      }

      const board = $('.board');
      $.replace(board, Index.root);
      if (Index.loaded) {
        $.event('PostsInserted', null, Index.root);
      }
      // Hacks:
      // - When removing an element from the document during page load,
      //   its ancestors will still be correctly created inside of it.
      // - Creating loadable elements inside of an origin-less document
      //   will not download them.
      // - Combine the two and you get a download canceller!
      //   Does not work on Firefox unfortunately. bugzil.la/939713
      try {
        d.implementation.createDocument(null, null, null).appendChild(board);
      } catch (error) {}

      for (el of $$('.navLinks')) { $.rm(el); }
      $.rm($.id('ctrl-top'));
      const topNavPos = $.id('delform').previousElementSibling;
      $.before(topNavPos, $.el('hr'));
      $.before(topNavPos, Index.navLinks);
      const timeEl = $('#index-last-refresh time', Index.navLinks);
      if (timeEl.dataset.utc) { return RelativeDates.update(timeEl); }
    });

    return Main.ready(function() {
      let pagelist;
      if (pagelist = $('.pagelist')) {
        $.replace(pagelist, Index.pagelist);
      }
      return $.rmClass(doc, 'index-loading');
    });
  },

  scroll() {
    if (Index.req || !Index.liveThreadData || (Conf['Index Mode'] !== 'infinite') || (window.scrollY <= (doc.scrollHeight - (300 + window.innerHeight)))) { return; }
    if (Index.pageNum == null) { Index.pageNum = Index.currentPage; } // Avoid having to pushState to keep track of the current page

    const pageNum = ++Index.pageNum;
    if (pageNum > Index.pagesNum) { return Index.endNotice(); }

    const threadIDs = Index.threadsOnPage(pageNum);
    return Index.buildStructure(threadIDs);
  },

  endNotice: (function() {
    let notify = false;
    const reset = () => notify = false;
    return function() {
      if (notify) { return; }
      notify = true;
      new Notice('info', "Last page reached.", 2);
      return setTimeout(reset, 3 * SECOND);
    };
  })(),

  menu: {
    init() {
      if ((g.VIEW !== 'index') || !Conf['Menu'] || !Conf['Thread Hiding Link'] || !Index.enabledOn(g.BOARD)) { return; }

      return Menu.menu.addEntry({
        el: $.el('a', {
          href:      'javascript:;',
          className: 'has-shortcut-text'
        }
        , {innerHTML: "<span></span><span class=\"shortcut-text\">Shift+click</span>"}),
        order: 20,
        open({thread}) {
          if (Conf['Index Mode'] !== 'catalog') { return false; }
          this.el.firstElementChild.textContent = thread.isHidden ?
            'Unhide'
          :
            'Hide';
          if (this.cb) { $.off(this.el, 'click', this.cb); }
          this.cb = function() {
            $.event('CloseMenu');
            return Index.toggleHide(thread);
          };
          $.on(this.el, 'click', this.cb);
          return true;
        }
      });
    }
  },

  node() {
    if (this.isReply || this.isClone || (Index.threadPosition[this.ID] == null)) { return; }
    return this.thread.setPage(Math.floor(Index.threadPosition[this.ID] / Index.threadsNumPerPage) + 1);
  },

  catalogNode() {
    return $.on(this.nodes.root, 'mousedown click', e => {
      if ((e.button !== 0) || !e.shiftKey) { return; }
      if (e.type === 'click') { Index.toggleHide(this.thread); }
      return e.preventDefault();
    });
  }, // Also on mousedown to prevent highlighting text.

  toggleHide(thread) {
    if (Index.showHiddenThreads) {
      ThreadHiding.show(thread);
      if (!ThreadHiding.db.get({boardID: thread.board.ID, threadID: thread.ID})) { return; }
      // Don't save when un-hiding filtered threads.
    } else {
      ThreadHiding.hide(thread);
    }
    return ThreadHiding.saveHiddenState(thread);
  },

  cycleSortType() {
    let i;
    const types = [...Array.from(Index.selectSort.options)].filter(option => !option.disabled);
    for (i = 0; i < types.length; i++) {
      var type = types[i];
      if (type.selected) { break; }
    }
    types[(i + 1) % types.length].selected = true;
    return $.event('change', null, Index.selectSort);
  },

  cb: {
    initFinished() {
      Index.initFinishedFired = true;
      return $.queueTask(() => Index.cb.postsInserted());
    },

    postsInserted() {
      if (!Index.initFinishedFired) { return; }
      let n = 0;
      g.posts.forEach(function(post) {
        if (!post.isFetchedQuote && !post.indexRefreshSeen && doc.contains(post.nodes.root)) {
          post.indexRefreshSeen = true;
          return n++;
        }
      });
      if (n) { return $.event('IndexRefresh'); }
    },

    toggleHiddenThreads() {
      $('#hidden-toggle a', Index.navLinks).textContent = (Index.showHiddenThreads = !Index.showHiddenThreads) ?
        'Hide'
      :
        'Show';
      Index.sort();
      return Index.buildIndex();
    },

    mode() {
      Index.pushState({mode: this.value});
      return Index.pageLoad(false);
    },

    sort() {
      const value = Index.selectRev.checked ? Index.selectSort.value + "-rev" : Index.selectSort.value;
      Index.pushState({sort: value});
      return Index.pageLoad(false);
    },

    resort(e) {
      Index.changed.order = true;
      if (!e?.detail?.deferred) { return Index.pageLoad(false); }
    },

    perBoardSort() {
      Conf['Index Sort'] = this.checked ? dict() : '';
      Index.saveSort();
      for (let i = 0; i < 2; i++) {
        Conf[`Last Long Reply Thresholds ${i}`] = this.checked ? dict() : '';
        Index.saveLastLongThresholds(i);
      }
    },

    lastLongThresholds() {
      const i = [...Array.from(this.parentNode.children)].indexOf(this);
      const value = +this.value;
      if (!Number.isFinite(value)) {
        this.value = Index.lastLongThresholds[i];
        return;
      }
      Index.lastLongThresholds[i] = value;
      Index.saveLastLongThresholds(i);
      Index.changed.order = true;
      return Index.pageLoad(false);
    },

    size(e) {
      if (Conf['Index Mode'] !== 'catalog') {
        $.rmClass(Index.root, 'catalog-small');
        $.rmClass(Index.root, 'catalog-large');
      } else if (Conf['Index Size'] === 'small') {
        $.addClass(Index.root, 'catalog-small');
        $.rmClass(Index.root,  'catalog-large');
      } else {
        $.addClass(Index.root, 'catalog-large');
        $.rmClass(Index.root,  'catalog-small');
      }
      if (e) { return Index.buildIndex(); }
    },

    replies() {
      return Index.buildIndex();
    },

    hover() {
      return doc.classList.toggle('catalog-hover-expand', Conf['Catalog Hover Expand']);
    },

    hoverToggle(e) {
      if (Conf['Catalog Hover Toggle'] && $.hasClass(doc, 'catalog-mode') && !$.modifiedClick(e) && !$.x('ancestor-or-self::a', e.target)) {
        let thread;
        const input = Index.inputs['Catalog Hover Expand'];
        input.checked = !input.checked;
        $.event('change', null, input);
        if (thread = Get.threadFromNode(e.target)) {
          Index.cb.catalogReplies.call(thread);
          return Index.cb.hoverAdjust.call(thread.OP.nodes);
        }
      }
    },

    popstate(e) {
      if (e?.state) {
        const {searched, mode, sort} = e.state;
        const page = Index.getCurrentPage();
        Index.setState({search: searched, mode, sort, page});
        return Index.pageLoad(false);
      } else {
        // page load or hash change
        const nCommands = Index.processHash();
        if (Conf['Refreshed Navigation'] && nCommands) {
          return Index.update();
        } else {
          return Index.pageLoad();
        }
      }
    },

    pageNav(e) {
      let a;
      if ($.modifiedClick(e)) { return; }
      switch (e.target.nodeName) {
        case 'BUTTON':
          e.target.blur();
          a = e.target.parentNode;
          break;
        case 'A':
          a = e.target;
          break;
        default:
          return;
      }
      if (a.textContent === 'Catalog') { return; }
      e.preventDefault();
      return Index.userPageNav(+a.pathname.split(/\/+/)[2] || 1);
    },

    refreshFront() {
      Index.pushState({page: 1});
      return Index.update();
    },

    catalogReplies() {
      if (Conf['Show Replies'] && $.hasClass(doc, 'catalog-hover-expand') && !this.catalogView.nodes.replies) {
        return Index.buildCatalogReplies(this);
      }
    },

    hoverAdjust() {
      // Prevent hovered catalog threads from going offscreen.
      let x;
      if (!$.hasClass(doc, 'catalog-hover-expand')) { return; }
      const rect = this.post.getBoundingClientRect();
      if (x = $.minmax(0, -rect.left, doc.clientWidth - rect.right)) {
        const {style} = this.post;
        style.left = `${x}px`;
        style.right = `${-x}px`;
        return $.one(this.root, 'mouseleave', () => style.left = (style.right = null));
      }
    }
  },

  scrollToIndex() {
    // Scroll to navlinks, or top of board if navlinks are hidden.
    return Header.scrollToIfNeeded((Index.navLinks.getBoundingClientRect().height ? Index.navLinks : Index.root));
  },

  getCurrentPage() {
    return +window.location.pathname.split(/\/+/)[2] || 1;
  },

  userPageNav(page) {
    Index.pushState({page});
    if (Conf['Refreshed Navigation']) {
      return Index.update();
    } else {
      return Index.pageLoad();
    }
  },

  hashCommands: {
    mode: {
      'paged':         'paged',
      'infinite-scrolling': 'infinite',
      'infinite':      'infinite',
      'all-threads':   'all pages',
      'all-pages':     'all pages',
      'catalog':       'catalog'
    },
    sort: {
      'bump-order':        'bump',
      'last-reply':        'lastreply',
      'last-long-reply':   'lastlong',
      'creation-date':     'birth',
      'reply-count':       'replycount',
      'file-count':        'filecount',
      'posts-per-minute':  'activity'
    }
  },

  processHash() {
    // XXX https://bugzilla.mozilla.org/show_bug.cgi?id=483304
    let hash = location.href.match(/#.*/)?.[0] || '';
    const state =
      {replace: true};
    const commands = hash.slice(1).split('/');
    const leftover = [];
    for (var command of commands) {
      var mode, sort;
      if (mode = $.getOwn(Index.hashCommands.mode, command)) {
        state.mode = mode;
      } else if (command === 'index') {
        state.mode = Conf['Previous Index Mode'];
        state.page = 1;
      } else if (sort = $.getOwn(Index.hashCommands.sort, command.replace(/-rev$/, ''))) {
        state.sort = sort;
        if (/-rev$/.test(command)) { state.sort += '-rev'; }
      } else if (/^s=/.test(command)) {
        state.search = decodeURIComponent(command.slice(2)).replace(/\+/g, ' ').trim();
      } else {
        leftover.push(command);
      }
    }
    hash = leftover.join('/');
    if (hash) { state.hash = `#${hash}`; }
    Index.pushState(state);
    return commands.length - leftover.length;
  },

  pushState(state) {
    let {search, hash, replace} = state;
    let pageBeforeSearch = history.state?.oldpage;
    if ((search != null) && (search !== Index.search)) {
      state.page = search ? 1 : (pageBeforeSearch || 1);
      if (!search) {
        pageBeforeSearch = undefined;
      } else if (!Index.search) {
        pageBeforeSearch = Index.currentPage;
      }
    }
    Index.setState(state);
    const pathname = Index.currentPage === 1 ? `/${g.BOARD}/` : `/${g.BOARD}/${Index.currentPage}`;
    if (!hash) { hash = ''; }
    return history[replace ? 'replaceState' : 'pushState']({
      mode:     Conf['Index Mode'],
      sort:     Index.currentSort,
      searched: Index.search,
      oldpage:  pageBeforeSearch
    }
    , '', `${location.protocol}//${location.host}${pathname}${hash}`);
  },

  setState({search, mode, sort, page, hash}) {
    if ((search != null) && (search !== Index.search)) {
      Index.changed.search = true;
      Index.search = search;
    }
    if ((mode != null) && (mode !== Conf['Index Mode'])) {
      Index.changed.mode = true;
      Conf['Index Mode'] = mode;
      $.set('Index Mode', mode);
      if ((mode !== 'catalog') && (Conf['Previous Index Mode'] !== mode)) {
        Conf['Previous Index Mode'] = mode;
        $.set('Previous Index Mode', mode);
      }
    }
    if ((sort != null) && (sort !== Index.currentSort)) {
      Index.changed.sort = true;
      Index.currentSort = sort;
      Index.saveSort();
    }
    if (['all pages', 'catalog'].includes(Conf['Index Mode'])) { page = 1; }
    if ((page != null) && (page !== Index.currentPage)) {
      Index.changed.page = true;
      Index.currentPage = page;
    }
    if (hash != null) {
      return Index.changed.hash = true;
    }
  },

  savePerBoard(key, value) {
    if (typeof Conf[key] === 'object') {
      Conf[key][g.BOARD.ID] = value;
    } else {
      Conf[key] = value;
    }
    return $.set(key, Conf[key]);
  },

  saveSort() {
    return Index.savePerBoard('Index Sort', Index.currentSort);
  },

  saveLastLongThresholds(i) {
    return Index.savePerBoard(`Last Long Reply Thresholds ${i}`, Index.lastLongThresholds[i]);
  },

  pageLoad(scroll=true) {
    if (!Index.liveThreadData) { return; }
    let {threads, order, search, mode, sort, page, hash} = Index.changed;
    if (!threads) { threads = search; }
    if (!order) { order = sort; }
    if (threads || order) { Index.sort(); }
    if (threads) { Index.buildPagelist(); }
    if (search) { Index.setupSearch(); }
    if (mode) { Index.setupMode(); }
    if (sort) { Index.setupSort(); }
    if (threads || mode || page || order) { Index.buildIndex(); }
    if (threads || page) { Index.setPage(); }
    if (scroll && !hash) { Index.scrollToIndex(); }
    if (hash) { Header.hashScroll(); }
    return Index.changed = {};
  },

  setupMode() {
    for (var mode of ['paged', 'infinite', 'all pages', 'catalog']) {
      $[mode === Conf['Index Mode'] ? 'addClass' : 'rmClass'](doc, `${mode.replace(/\ /g, '-')}-mode`);
    }
    Index.selectMode.value = Conf['Index Mode'];
    Index.cb.size();
    Index.showHiddenThreads = false;
    return $('#hidden-toggle a', Index.navLinks).textContent = 'Show';
  },

  setupSort() {
    Index.selectRev.checked = /-rev$/.test(Index.currentSort);
    Index.selectSort.value  = Index.currentSort.replace(/-rev$/, '');
    return Index.lastLongOptions.hidden = (Index.selectSort.value !== 'lastlong');
  },

  getPagesNum() {
    if (Index.search) {
      return Math.ceil(Index.sortedThreadIDs.length / Index.threadsNumPerPage);
    } else {
      return Index.pagesNum;
    }
  },

  getMaxPageNum() {
    return Math.max(1, Index.getPagesNum());
  },

  buildPagelist() {
    const pagesRoot = $('.pages', Index.pagelist);
    const maxPageNum = Index.getMaxPageNum();
    if (pagesRoot.childElementCount !== maxPageNum) {
      const nodes = [];
      for (let i = 1, end = maxPageNum; i <= end; i++) {
        var a = $.el('a', {
          textContent: i,
          href: i === 1 ? './' : i
        }
        );
        nodes.push($.tn('['), a, $.tn('] '));
      }
      $.rmAll(pagesRoot);
      return $.add(pagesRoot, nodes);
    }
  },

  setPage() {
    let a, strong;
    const pageNum    = Index.currentPage;
    const maxPageNum = Index.getMaxPageNum();
    const pagesRoot  = $('.pages', Index.pagelist);

    // Previous/Next buttons
    const prev = pagesRoot.previousSibling.firstChild;
    const next = pagesRoot.nextSibling.firstChild;
    let href = Math.max(pageNum - 1, 1);
    prev.href = href === 1 ? './' : href;
    prev.firstChild.disabled = href === pageNum;
    href = Math.min(pageNum + 1, maxPageNum);
    next.href = href === 1 ? './' : href;
    next.firstChild.disabled = href === pageNum;

    // <strong> current page
    if (strong = $('strong', pagesRoot)) {
      if (+strong.textContent === pageNum) { return; }
      $.replace(strong, strong.firstChild);
    } else {
      strong = $.el('strong');
    }

    if (a = pagesRoot.children[pageNum - 1]) {
      $.before(a, strong);
      return $.add(strong, a);
    }
  },

  updateHideLabel() {
    if (!Index.hideLabel) { return; }
    let hiddenCount = 0;
    for (var threadID of Index.liveThreadIDs) {
      if (Index.isHidden(threadID)) {
        hiddenCount++;
      }
    }
    if (!hiddenCount) {
      Index.hideLabel.hidden = true;
      if (Index.showHiddenThreads) { Index.cb.toggleHiddenThreads(); }
      return;
    }
    Index.hideLabel.hidden = false;
    return $('#hidden-count', Index.navLinks).textContent = hiddenCount === 1 ?
      '1 hidden thread'
    :
      `${hiddenCount} hidden threads`;
  },

  update(firstTime) {
    let oldReq;
    if (oldReq = Index.req) {
      delete Index.req;
      oldReq.abort();
    }

    if (Conf['Index Refresh Notifications']) {
      // Optional notification for manual refreshes
      if (!Index.notice) { Index.notice = new Notice('info', 'Refreshing index...'); }
      if (!Index.nTimeout) { Index.nTimeout = setTimeout(() => {
          if (Index.notice) {
            Index.notice.el.lastElementChild.textContent += ' (disable JSON Index if this takes too long)';
          }
        }
        , 3 * SECOND); }
    } else {
      // Also display notice if Index Refresh is taking too long
      if (!Index.nTimeout) { Index.nTimeout = setTimeout(() => Index.notice || (Index.notice = new Notice('info', 'Refreshing index... (disable JSON Index if this takes too long)'))
      , 3 * SECOND); }
    }

    // Hard refresh in case of incomplete page load.
    if (!firstTime && (d.readyState !== 'loading') && !$('.board + *')) {
      location.reload();
      return;
    }

    Index.req = $.whenModified(
      g.SITE.urls.catalogJSON({boardID: g.BOARD.ID}),
      'Index',
      Index.load
    );
    return $.addClass(Index.button, 'fa-spin');
  },

  load() {
    let err;
    if (this !== Index.req) { return; } // aborted

    $.rmClass(Index.button, 'fa-spin');
    const {notice, nTimeout} = Index;
    if (nTimeout) { clearTimeout(nTimeout); }
    delete Index.nTimeout;
    delete Index.req;
    delete Index.notice;

    if (![200, 304].includes(this.status)) {
      err = `Index refresh failed. ${this.status ? `Error ${this.statusText} (${this.status})` : 'Connection Error'}`;
      if (notice) {
        notice.setType('warning');
        notice.el.lastElementChild.textContent = err;
        setTimeout(notice.close, SECOND);
      } else {
        new Notice('warning', err, 1);
      }
      return;
    }

    try {
      if (this.status === 200) {
        Index.parse(this.response);
      } else if (this.status === 304) {
        Index.pageLoad();
      }
    } catch (error) {
      err = error;
      c.error(`Index failure: ${err.message}`, err.stack);
      if (notice) {
        notice.setType('error');
        notice.el.lastElementChild.textContent = 'Index refresh failed.';
        setTimeout(notice.close, SECOND);
      } else {
        new Notice('error', 'Index refresh failed.', 1);
      }
      return;
    }

    if (notice) {
      if (Conf['Index Refresh Notifications']) {
        notice.setType('success');
        notice.el.lastElementChild.textContent = 'Index refreshed!';
        setTimeout(notice.close, SECOND);
      } else {
        notice.close();
      }
    }

    const timeEl = $('#index-last-refresh time', Index.navLinks);
    timeEl.dataset.utc = Date.parse(this.getResponseHeader('Last-Modified'));
    return RelativeDates.update(timeEl);
  },

  parse(pages) {
    $.cleanCache(url => /^https?:\/\/a\.4cdn\.org\//.test(url));
    Index.parseThreadList(pages);
    Index.changed.threads = true;
    return Index.pageLoad();
  },

  parseThreadList(pages) {
    Index.pagesNum          = pages.length;
    Index.threadsNumPerPage = pages[0]?.threads.length || 1;
    Index.liveThreadData    = pages.reduce(((arr, next) => arr.concat(next.threads)), []);
    Index.liveThreadIDs     = Index.liveThreadData.map(data => data.no);
    Index.liveThreadDict    = dict();
    Index.threadPosition    = dict();
    Index.parsedThreads     = dict();
    Index.replyData         = dict();
    for (let i = 0; i < Index.liveThreadData.length; i++) {
      var obj, results;
      var data = Index.liveThreadData[i];
      Index.liveThreadDict[data.no] = data;
      Index.threadPosition[data.no] = i;
      Index.parsedThreads[data.no] = (obj = g.SITE.Build.parseJSON(data, g.BOARD));
      obj.filterResults = (results = Filter.test(obj));
      obj.isOnTop  = results.top;
      obj.isHidden = results.hide || ThreadHiding.isHidden(obj.boardID, obj.threadID);
      if (data.last_replies) {
        for (var reply of data.last_replies) {
          Index.replyData[`${g.BOARD}.${reply.no}`] = reply;
        }
      }
    }
    if (Index.liveThreadData[0]) {
      g.SITE.Build.spoilerRange[g.BOARD.ID] = Index.liveThreadData[0].custom_spoiler;
    }
    g.BOARD.threads.forEach(function(thread) {
      if (!Index.liveThreadIDs.includes(thread.ID)) { return thread.collect(); }
    });
    $.event('IndexUpdate',
      {threads: ((Index.liveThreadIDs.map((ID) => `${g.BOARD}.${ID}`)))});
  },

  isHidden(threadID) {
    let thread;
    if ((thread = g.BOARD.threads.get(threadID)) && thread.OP && !thread.OP.isFetchedQuote) {
      return thread.isHidden;
    } else {
      return Index.parsedThreads[threadID].isHidden;
    }
  },

  isHiddenReply(threadID, replyData) {
    return PostHiding.isHidden(g.BOARD.ID, threadID, replyData.no) || Filter.isHidden(g.SITE.Build.parseJSON(replyData, g.BOARD));
  },

  buildThreads(threadIDs, isCatalog, withReplies) {
    let errors;
    const threads    = [];
    const newThreads = [];
    let newPosts   = [];
    for (var ID of threadIDs) {
      var opRoot, thread;
      try {
        var OP;
        var threadData = Index.liveThreadDict[ID];

        if (thread = g.BOARD.threads.get(ID)) {
          var isStale = (thread.json !== threadData) && (JSON.stringify(thread.json) !== JSON.stringify(threadData));
          if (isStale) {
            thread.setCount('post', threadData.replies + 1,                threadData.bumplimit);
            thread.setCount('file', threadData.images  + !!threadData.ext, threadData.imagelimit);
            thread.setStatus('Sticky', !!threadData.sticky);
            thread.setStatus('Closed', !!threadData.closed);
          }
          if (thread.catalogView) {
            $.rm(thread.catalogView.nodes.replies);
            thread.catalogView.nodes.replies = null;
          }
        } else {
          thread = new Thread(ID, g.BOARD);
          newThreads.push(thread);
        }
        var lastPost = threadData.last_replies && threadData.last_replies.length ? threadData.last_replies[threadData.last_replies.length - 1].no : ID;
        if (lastPost > thread.lastPost) { thread.lastPost = lastPost; }
        thread.json = threadData;
        threads.push(thread);

        if ((OP = thread.OP) && !OP.isFetchedQuote) {
          OP.setCatalogOP(isCatalog);
          thread.setPage(Math.floor(Index.threadPosition[ID] / Index.threadsNumPerPage) + 1);
        } else {
          var obj = Index.parsedThreads[ID];
          opRoot = g.SITE.Build.post(obj);
          OP = new Post(opRoot, thread, g.BOARD);
          OP.filterResults = obj.filterResults;
          newPosts.push(OP);
        }

        if (!isCatalog || !thread.nodes.root) {
          g.SITE.Build.thread(thread, threadData, withReplies);
        }
      } catch (err) {
        // Skip posts that we failed to parse.
        if (!errors) { errors = []; }
        errors.push({
          message: `Parsing of Thread No.${thread} failed. Thread will be skipped.`,
          error: err,
          html: opRoot?.outerHTML
        });
      }
    }
    if (errors) { Main.handleErrors(errors); }

    if (withReplies) {
      newPosts = newPosts.concat(Index.buildReplies(threads));
    }

    Main.callbackNodes('Thread', newThreads);
    Main.callbackNodes('Post',   newPosts);
    Index.updateHideLabel();
    $.event('IndexRefreshInternal', {threadIDs: (threads.map((t) => t.fullID)), isCatalog});

    return threads;
  },

  buildReplies(threads) {
    let errors;
    const posts = [];
    for (var thread of threads) {
      var lastReplies;
      if (!(lastReplies = Index.liveThreadDict[thread.ID].last_replies)) { continue; }
      var nodes = [];
      for (var data of lastReplies) {
        var node, post;
        if ((post = thread.posts.get(data.no)) && !post.isFetchedQuote) {
          nodes.push(post.nodes.root);
          continue;
        }
        nodes.push(node = g.SITE.Build.postFromObject(data, thread.board.ID));
        try {
          posts.push(new Post(node, thread, thread.board));
        } catch (err) {
          // Skip posts that we failed to parse.
          if (!errors) { errors = []; }
          errors.push({
            message: `Parsing of Post No.${data.no} failed. Post will be skipped.`,
            error: err,
            html: node?.outerHTML
          });
        }
      }
      $.add(thread.nodes.root, nodes);
    }

    if (errors) { Main.handleErrors(errors); }
    return posts;
  },

  buildCatalogViews(threads) {
    const catalogThreads = [];
    for (var thread of threads) {
      if (!thread.catalogView) {
        var {ID} = thread;
        var page = Math.floor(Index.threadPosition[ID] / Index.threadsNumPerPage) + 1;
        var root = g.SITE.Build.catalogThread(thread, Index.liveThreadDict[ID], page);
        catalogThreads.push(new CatalogThread(root, thread));
      }
    }
    Main.callbackNodes('CatalogThread', catalogThreads);
  },

  sizeCatalogViews(threads) {
    // XXX When browsers support CSS3 attr(), use it instead.
    const size = Conf['Index Size'] === 'small' ? 150 : 250;
    for (var thread of threads) {
      var {thumb} = thread.catalogView.nodes;
      var {width, height} = thumb.dataset;
      if (!width) { continue; }
      var ratio = size / Math.max(width, height);
      thumb.style.width  = (width  * ratio) + 'px';
      thumb.style.height = (height * ratio) + 'px';
    }
  },

  buildCatalogReplies(thread) {
    let lastReplies;
    const {nodes} = thread.catalogView;
    if (!(lastReplies = Index.liveThreadDict[thread.ID].last_replies)) { return; }

    const replies = [];
    for (var data of lastReplies) {
      if (Index.isHiddenReply(thread.ID, data)) { continue; }
      var reply = g.SITE.Build.catalogReply(thread, data);
      RelativeDates.update($('time', reply));
      $.on($('.catalog-reply-preview', reply), 'mouseover', QuotePreview.mouseover);
      replies.push(reply);
    }

    nodes.replies = $.el('div', {className: 'catalog-replies'});
    $.add(nodes.replies, replies);
    $.add(thread.OP.nodes.post, nodes.replies);
  },

  sort() {
    let threadIDs;
    const {liveThreadIDs, liveThreadData} = Index;
    if (!liveThreadData) { return; }
    const tmp_time = new Date().getTime()/1000;
    const sortType = Index.currentSort.replace(/-rev$/, '');
    Index.sortedThreadIDs = (() => { switch (sortType) {
      case 'lastreply': case 'lastlong':
        var repliesAvailable = liveThreadData.some(thread => thread.last_replies?.length);
        var lastlong = function(thread) {
          if (!repliesAvailable) {
            return thread.last_modified;
          }
          const iterable = thread.last_replies || [];
          for (let i = iterable.length - 1; i >= 0; i--) {
            var r = iterable[i];
            if (Index.isHiddenReply(thread.no, r)) { continue; }
            if (sortType === 'lastreply') {
              return r;
            }
            var len = r.com ? g.SITE.Build.parseComment(r.com).replace(/[^a-z]/ig, '').length : 0;
            if (len >= Index.lastLongThresholds[+!!r.ext]) {
              return r;
            }
          }
          if (thread.omitted_posts && thread.last_replies?.length) { return thread.last_replies[0]; } else { return thread; }
        };
        var lastlongD = dict();
        for (var thread of liveThreadData) {
          lastlongD[thread.no] = lastlong(thread).no;
        }
        return [...Array.from(liveThreadData)].sort((a, b) => lastlongD[b.no] - lastlongD[a.no]).map(post => post.no);
      case 'bump':       return liveThreadIDs;
      case 'birth':      return [...Array.from(liveThreadIDs) ].sort((a, b) => b - a);
      case 'replycount': return [...Array.from(liveThreadData)].sort((a, b) => b.replies - a.replies).map(post => post.no);
      case 'filecount':  return [...Array.from(liveThreadData)].sort((a, b) => b.images  - a.images).map(post => post.no);
      case 'activity':   return [...Array.from(liveThreadData)].sort((a, b) => ((tmp_time-a.time)/(a.replies+1)) - ((tmp_time-b.time)/(b.replies+1))).map(post => post.no);
      default: return liveThreadIDs;
    } })();
    if (/-rev$/.test(Index.currentSort)) {
      Index.sortedThreadIDs = [...Array.from(Index.sortedThreadIDs)].reverse();
    }
    if (Index.search && (threadIDs = Index.querySearch(Index.search))) {
      Index.sortedThreadIDs = threadIDs;
    }
    // Sticky threads
    Index.sortOnTop(obj => obj.isSticky);
    // Highlighted threads
    Index.sortOnTop(obj => obj.isOnTop || (Conf['Pin Watched Threads'] && ThreadWatcher.isWatchedRaw(obj.boardID, obj.threadID)));
    // Non-hidden threads
    if (Conf['Anchor Hidden Threads']) { return Index.sortOnTop(obj => !Index.isHidden(obj.threadID)); }
  },

  sortOnTop(match) {
    const topThreads    = [];
    const bottomThreads = [];
    for (var ID of Index.sortedThreadIDs) {
      (match(Index.parsedThreads[ID]) ? topThreads : bottomThreads).push(ID);
    }
    return Index.sortedThreadIDs = topThreads.concat(bottomThreads);
  },

  buildIndex() {
    let threadIDs;
    if (!Index.liveThreadData) { return; }
    switch (Conf['Index Mode']) {
      case 'all pages':
        threadIDs = Index.sortedThreadIDs;
        break;
      case 'catalog':
        threadIDs = Index.sortedThreadIDs.filter(ID => !Index.isHidden(ID) !== Index.showHiddenThreads);
        break;
      default:
        threadIDs = Index.threadsOnPage(Index.currentPage);
    }
    delete Index.pageNum;
    $.rmAll(Index.root);
    $.rmAll(Header.hover);
    if (Index.loaded && Index.root.parentNode) {
      $.event('PostsRemoved', null, Index.root);
    }
    if (Conf['Index Mode'] === 'catalog') {
      Index.buildCatalog(threadIDs);
    } else {
      Index.buildStructure(threadIDs);
    }
  },

  threadsOnPage(pageNum) {
    const nodesPerPage = Index.threadsNumPerPage;
    const offset = nodesPerPage * (pageNum - 1);
    return Index.sortedThreadIDs.slice(offset ,  offset + nodesPerPage);
  },

  buildStructure(threadIDs) {
    const threads = Index.buildThreads(threadIDs, false, Conf['Show Replies']);
    const nodes = [];
    for (var thread of threads) {
      nodes.push(thread.nodes.root, $.el('hr'));
    }
    $.add(Index.root, nodes);
    if (Index.root.parentNode) {
      $.event('PostsInserted', null, Index.root);
    }
    Index.loaded = true;
  },

  buildCatalog(threadIDs) {
    let i = 0;
    const n = threadIDs.length;
    let node0 = null;
    var fn = function() {
      if (node0 && !node0.parentNode) { return; } // Index.root cleared
      const j = (i > 0) && Index.root.parentNode ? n : i + 30;
      node0 = Index.buildCatalogPart(threadIDs.slice(i, j))[0];
      i = j;
      if (i < n) {
        return $.queueTask(fn);
      } else {
        if (Index.root.parentNode) {
          $.event('PostsInserted', null, Index.root);
        }
        return Index.loaded = true;
      }
    };
    fn();
  },

  buildCatalogPart(threadIDs) {
    const threads = Index.buildThreads(threadIDs, true);
    Index.buildCatalogViews(threads);
    Index.sizeCatalogViews(threads);
    const nodes = [];
    for (var thread of threads) {
      thread.OP.setCatalogOP(true);
      $.add(thread.catalogView.nodes.root, thread.OP.nodes.root);
      nodes.push(thread.catalogView.nodes.root);
      $.on(thread.catalogView.nodes.root, 'mouseenter', Index.cb.catalogReplies.bind(thread));
      $.on(thread.OP.nodes.root, 'mouseenter', Index.cb.hoverAdjust.bind(thread.OP.nodes));
    }
    $.add(Index.root, nodes);
    return nodes;
  },

  clearSearch() {
    Index.searchInput.value = '';
    Index.onSearchInput();
    return Index.searchInput.focus();
  },

  setupSearch() {
    Index.searchInput.value = Index.search;
    if (Index.search) {
      return Index.searchInput.dataset.searching = 1;
    } else {
      // XXX https://bugzilla.mozilla.org/show_bug.cgi?id=1021289
      return Index.searchInput.removeAttribute('data-searching');
    }
  },

  onSearchInput() {
    const search = Index.searchInput.value.trim();
    if (search === Index.search) { return; }
    Index.pushState({
      search,
      replace: !!search === !!Index.search
    });
    return Index.pageLoad(false);
  },

  querySearch(query) {
    let keywords, match;
    if (match = query.match(/^([\w+]+):\/(.*)\/(\w*)$/)) {
      let regexp;
      try {
        regexp = RegExp(match[2], match[3]);
      } catch (error) {
        return [];
      }
      return Index.sortedThreadIDs.filter(ID => regexp.test(Filter.values(match[1], Index.parsedThreads[ID]).join('\n')));
    }
    if (!(keywords = query.toLowerCase().match(/\S+/g))) { return; }
    return Index.sortedThreadIDs.filter(ID => Index.searchMatch(Index.parsedThreads[ID], keywords));
  },

  searchMatch(obj, keywords) {
    const {info, file} = obj;
    if (info.comment == null) { info.comment = g.SITE.Build.parseComment(info.commentHTML.innerHTML); }
    let text = [];
    for (var key of ['comment', 'subject', 'name', 'tripcode']) {
      if (key in info) { text.push(info[key]); }
    }
    if (file) { text.push(file.name); }
    text = text.join(' ').toLowerCase();
    for (var keyword of keywords) {
      if (-1 === text.indexOf(keyword)) { return false; }
    }
    return true;
  }
};
export default Index;
