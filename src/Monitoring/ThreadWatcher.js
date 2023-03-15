import ThreadWatcherPage from './ThreadWatcher/ThreadWatcher.html';
import $ from "../platform/$";
import Board from '../classes/Board';
import Callbacks from '../classes/Callbacks';
import DataBoard from '../classes/DataBoard';
import Thread from '../classes/Thread';
import Filter from '../Filtering/Filter';
import Main from '../main/Main';
import $$ from '../platform/$$';
import Config from '../config/Config';
import CrossOrigin from '../platform/CrossOrigin';
import PostRedirect from '../Posting/PostRedirect';
import QuoteYou from '../Quotelinks/QuoteYou';
import Unread from './Unread';
import UnreadIndex from './UnreadIndex';
import Header from '../General/Header';
import Index from '../General/Index';
import { Conf, d, doc, g } from '../globals/globals';
import Menu from '../Menu/Menu';
import UI from '../General/UI';
import Get from '../General/Get';
import { dict, HOUR, MINUTE } from '../platform/helpers';

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */

var ThreadWatcher = {
  init() {
    let sc;
    if (!(this.enabled = Conf['Thread Watcher'])) { return; }

    this.shortcut = (sc = $.el('a', {
      id:   'watcher-link',
      textContent: 'Watcher',
      title: 'Thread Watcher',
      href: 'javascript:;',
      className: 'fa fa-eye'
    }
    ));

    this.db     = new DataBoard('watchedThreads', this.refresh, true);
    this.dbLM   = new DataBoard('watcherLastModified', null, true);
    this.dialog = UI.dialog('thread-watcher', { innerHTML: ThreadWatcherPage });
    this.status = $('#watcher-status', this.dialog);
    this.list   = this.dialog.lastElementChild;
    this.refreshButton = $('.refresh', this.dialog);
    this.closeButton = $('.move > .close', this.dialog);
    this.unreaddb = Unread.db || UnreadIndex.db || new DataBoard('lastReadPosts');
    this.unreadEnabled = Conf['Remember Last Read Post'];

    $.on(d, 'QRPostSuccessful',   this.cb.post);
    $.on(sc, 'click', this.toggleWatcher);
    $.on(this.refreshButton, 'click', this.buttonFetchAll);
    $.on(this.closeButton, 'click', this.toggleWatcher);

    this.menu.addHeaderMenuEntry();
    $.onExists(doc, 'body', this.addDialog);

    switch (g.VIEW) {
      case 'index':
        $.on(d, 'IndexUpdate', this.cb.onIndexUpdate);
        break;
      case 'thread':
        $.on(d, 'ThreadUpdate', this.cb.onThreadRefresh);
        break;
    }

    if (Conf['Fixed Thread Watcher']) {
      $.addClass(doc, 'fixed-watcher');
    }
    if (!Conf['Persistent Thread Watcher']) {
      $.addClass(ThreadWatcher.shortcut, 'disabled');
      this.dialog.hidden = true;
    }

    Header.addShortcut('watcher', sc, 510);

    ThreadWatcher.initLastModified();
    ThreadWatcher.fetchAuto();
    $.on(window, 'visibilitychange focus', () => $.queueTask(ThreadWatcher.fetchAuto));

    if (Conf['Menu'] && Index.enabled) {
      Menu.menu.addEntry({
        el: $.el('a', {
          href:      'javascript:;',
          className: 'has-shortcut-text'
        }
        , {innerHTML: '<span></span><span class="shortcut-text">Alt+click</span>'}),
        order: 6,
        open({thread}) {
          if (Conf['Index Mode'] !== 'catalog') { return false; }
          this.el.firstElementChild.textContent = ThreadWatcher.isWatched(thread) ?
            'Unwatch'
          :
            'Watch';
          if (this.cb) { $.off(this.el, 'click', this.cb); }
          this.cb = function() {
            $.event('CloseMenu');
            return ThreadWatcher.toggle(thread);
          };
          $.on(this.el, 'click', this.cb);
          return true;
        }
      });
    }

    if (!['index', 'thread'].includes(g.VIEW)) { return; }

    Callbacks.Post.push({
      name: 'Thread Watcher',
      cb:   this.node
    });
    return Callbacks.CatalogThread.push({
      name: 'Thread Watcher',
      cb:   this.catalogNode
    });
  },

  isWatched(thread) {
    return !!ThreadWatcher.db?.get({boardID: thread.board.ID, threadID: thread.ID});
  },

  isWatchedRaw(boardID, threadID) {
    return !!ThreadWatcher.db?.get({boardID, threadID});
  },

  setToggler(toggler, isWatched) {
    toggler.classList.toggle('watched', isWatched);
    return toggler.title = `${isWatched ? 'Unwatch' : 'Watch'} Thread`;
  },

  node() {
    let toggler;
    if (this.isReply) { return; }
    if (this.isClone) {
      toggler = $('.watch-thread-link', this.nodes.info);
    } else {
      toggler = $.el('a', {
        href: 'javascript:;',
        className: 'watch-thread-link'
      }
      );
      $.before($('input', this.nodes.info), toggler);
    }
    const siteID = g.SITE.ID;
    const boardID = this.board.ID;
    const threadID = this.thread.ID;
    const data = ThreadWatcher.db.get({siteID, boardID, threadID});
    ThreadWatcher.setToggler(toggler, !!data);
    $.on(toggler, 'click', ThreadWatcher.cb.toggle);
    // Add missing excerpt for threads added by Auto Watch
    if (data && (data.excerpt == null)) {
      return $.queueTask(() => {
        return ThreadWatcher.update(siteID, boardID, threadID, {excerpt: Get.threadExcerpt(this.thread)});
    });
    }
  },

  catalogNode() {
    if (ThreadWatcher.isWatched(this.thread)) { $.addClass(this.nodes.root, 'watched'); }
    return $.on(this.nodes.root, 'mousedown click', e => {
      if ((e.button !== 0) || !e.altKey) { return; }
      if (e.type === 'click') { ThreadWatcher.toggle(this.thread); }
      return e.preventDefault();
    });
  }, // Also on mousedown to prevent highlighting thumbnail in Firefox.

  addDialog() {
    if (!Main.isThisPageLegit()) { return; }
    ThreadWatcher.build();
    return $.prepend(d.body, ThreadWatcher.dialog);
  },

  toggleWatcher() {
    $.toggleClass(ThreadWatcher.shortcut, 'disabled');
    return ThreadWatcher.dialog.hidden = !ThreadWatcher.dialog.hidden;
  },

  cb: {
    openAll() {
      if ($.hasClass(this, 'disabled')) { return; }
      for (var a of $$('a.watcher-link', ThreadWatcher.list)) {
        $.open(a.href);
      }
      return $.event('CloseMenu');
    },
    openUnread() {
      if ($.hasClass(this, 'disabled')) { return; }
      for (var a of $$('.replies-unread > a.watcher-link', ThreadWatcher.list)) {
        $.open(a.href);
      }
      return $.event('CloseMenu');
    },
    openDeads() {
      if ($.hasClass(this, 'disabled')) { return; }
      for (var a of $$('.dead-thread > a.watcher-link', ThreadWatcher.list)) {
        $.open(a.href);
      }
      return $.event('CloseMenu');
    },
    pruneDeads() {
      if ($.hasClass(this, 'disabled')) { return; }
      for (var {siteID, boardID, threadID, data} of ThreadWatcher.getAll()) {
        if (data.isDead) {
          ThreadWatcher.db.delete({siteID, boardID, threadID});
        }
      }
      ThreadWatcher.refresh();
      return $.event('CloseMenu');
    },
    dismiss() {
      for (var {siteID, boardID, threadID, data} of ThreadWatcher.getAll()) {
        if (data.quotingYou) {
          ThreadWatcher.update(siteID, boardID, threadID, {dismiss: data.quotingYou || 0});
        }
      }
      return $.event('CloseMenu');
    },
    toggle() {
      const {thread} = Get.postFromNode(this);
      return ThreadWatcher.toggle(thread);
    },
    rm() {
      const {siteID} = this.parentNode.dataset;
      const [boardID, threadID] = Array.from(this.parentNode.dataset.fullID.split('.'));
      return ThreadWatcher.rm(siteID, boardID, +threadID);
    },
    post(e) {
      const {boardID, threadID, postID} = e.detail;
      const cb = PostRedirect.delay();
      if (postID === threadID) {
        if (Conf['Auto Watch']) {
          return ThreadWatcher.addRaw(boardID, threadID, {}, cb);
        }
      } else if (Conf['Auto Watch Reply']) {
        return ThreadWatcher.add((g.threads.get(boardID + '.' + threadID) || new Thread(threadID, g.boards[boardID] || new Board(boardID))), cb);
      }
    },
    onIndexUpdate(e) {
      const {db}    = ThreadWatcher;
      const siteID  = g.SITE.ID;
      const boardID = g.BOARD.ID;
      let nKilled = 0;
      for (var threadID in db.data[siteID].boards[boardID]) {
        // Don't prune threads that have yet to appear in index.
        var data = db.data[siteID].boards[boardID][threadID];
        if (!data?.isDead && !e.detail.threads.includes(`${boardID}.${threadID}`)) {
          if (!e.detail.threads.some(fullID => +fullID.split('.')[1] > threadID)) { continue; }
          if (Conf['Auto Prune'] || !(data && (typeof data === 'object'))) { // corrupt data
            db.delete({boardID, threadID});
            nKilled++;
          } else {
            ThreadWatcher.fetchStatus({siteID, boardID, threadID, data});
          }
        }
      }
      if (nKilled) { return ThreadWatcher.refresh(); }
    },
    onThreadRefresh(e) {
      const thread = g.threads.get(e.detail.threadID);
      if (!e.detail[404] || !ThreadWatcher.isWatched(thread)) { return; }
      // Update dead status.
      return ThreadWatcher.add(thread);
    }
  },

  requests: [],
  fetched:  0,

  fetch(url, {siteID, force}, args, cb) {
    if (ThreadWatcher.requests.length === 0) {
      ThreadWatcher.status.textContent = '...';
      $.addClass(ThreadWatcher.refreshButton, 'fa-spin');
    }
    const onloadend = function() {
      if (this.finished) { return; }
      this.finished = true;
      ThreadWatcher.fetched++;
      if (ThreadWatcher.fetched === ThreadWatcher.requests.length) {
        ThreadWatcher.clearRequests();
      } else {
        ThreadWatcher.status.textContent = `${Math.round((ThreadWatcher.fetched / ThreadWatcher.requests.length) * 100)}%`;
      }
      return cb.apply(this, args);
    };
    const ajax = siteID === g.SITE.ID ? $.ajax : CrossOrigin.ajax;
    if (force) {
      delete $.lastModified.ThreadWatcher?.[url];
    }
    const req = $.whenModified(
      url,
      'ThreadWatcher',
      onloadend,
      { timeout: MINUTE, ajax }
    );
    return ThreadWatcher.requests.push(req);
  },

  clearRequests() {
    ThreadWatcher.requests = [];
    ThreadWatcher.fetched = 0;
    ThreadWatcher.status.textContent = '';
    return $.rmClass(ThreadWatcher.refreshButton, 'fa-spin');
  },

  abort() {
    delete ThreadWatcher.syncing;
    for (var req of ThreadWatcher.requests) {
      if (!req.finished) {
        req.finished = true;
        req.abort();
      }
    }
    return ThreadWatcher.clearRequests();
  },

  initLastModified() {
    const lm = ($.lastModified['ThreadWatcher'] || ($.lastModified['ThreadWatcher'] = dict()));
    for (var siteID in ThreadWatcher.dbLM.data) {
      var boards = ThreadWatcher.dbLM.data[siteID];
      for (var boardID in boards.boards) {
        var data = boards.boards[boardID];
        if (ThreadWatcher.db.get({siteID, boardID})) {
          for (var url in data) {
            var date = data[url];
            lm[url] = date;
          }
        } else {
          ThreadWatcher.dbLM.delete({siteID, boardID});
        }
      }
    }
  },

  fetchAuto() {
    let middle;
    clearTimeout(ThreadWatcher.timeout);
    if (!Conf['Auto Update Thread Watcher']) { return; }
    const {db} = ThreadWatcher;
    const interval = Conf['Show Page'] || (ThreadWatcher.unreadEnabled && Conf['Show Unread Count']) ? 5 * MINUTE : 2 * HOUR;
    const now = Date.now();
    if ((now - interval >= ((middle = db.data.lastChecked || 0)) || middle > now) && !d.hidden && !!d.hasFocus()) {
      ThreadWatcher.fetchAllStatus(interval);
    }
    return ThreadWatcher.timeout = setTimeout(ThreadWatcher.fetchAuto, interval);
  },

  buttonFetchAll() {
    if (ThreadWatcher.syncing || ThreadWatcher.requests.length) {
      return ThreadWatcher.abort();
    } else {
      return ThreadWatcher.fetchAllStatus();
    }
  },

  fetchAllStatus(interval=0) {
    ThreadWatcher.status.textContent = '...';
    $.addClass(ThreadWatcher.refreshButton, 'fa-spin');
    ThreadWatcher.syncing = true;
    const dbs = [ThreadWatcher.db, ThreadWatcher.unreaddb, QuoteYou.db].filter(x => x);
    let n = 0;
    return dbs.map((dbi) =>
      dbi.forceSync(function() {
        if ((++n) === dbs.length) {
          let middle;
          if (!ThreadWatcher.syncing) { return; } // aborted
          delete ThreadWatcher.syncing;
          if (0 > (middle = Date.now() - (ThreadWatcher.db.data.lastChecked || 0)) || middle >= interval) { // not checked in another tab
            // XXX On vichan boards, last_modified field of threads.json does not account for sage posts.
            // Occasionally check replies field of catalog.json to find these posts.
            let middle1;
            const {db} = ThreadWatcher;
            const now = Date.now();
            const deep = !(now - (2 * HOUR) < ((middle1 = db.data.lastChecked2 || 0)) && middle1 <= now);
            const boards = ThreadWatcher.getAll(true);
            for (var board of boards) {
              ThreadWatcher.fetchBoard(board, deep);
            }
            db.setLastChecked();
            if (deep) { db.setLastChecked('lastChecked2'); }
          }
          if (ThreadWatcher.fetched === ThreadWatcher.requests.length) {
            return ThreadWatcher.clearRequests();
          }
        }
      }));
  },

  fetchBoard(board, deep) {
    if (!board.some(thread => !thread.data.isDead)) { return; }
    let force = false;
    for (var thread of board) {
      var {data} = thread;
      if (!data.isDead && (data.last !== -1)) {
        if (Conf['Show Page'] && (data.page == null)) { force = true; }
        if ((data.modified == null)) { force = (thread.force = true); }
      }
    }
    const {siteID, boardID} = board[0];
    const site = g.sites[siteID];
    if (!site) { return; }
    const urlF = deep && site.threadModTimeIgnoresSage ? 'catalogJSON' : 'threadsListJSON';
    const url = site.urls[urlF]?.({siteID, boardID});
    if (!url) { return; }
    return ThreadWatcher.fetch(url, {siteID, force}, [board, url], ThreadWatcher.parseBoard);
  },

  parseBoard(board, url) {
    let page, thread;
    if (this.status !== 200) { return; }
    const {siteID, boardID} = board[0];
    const lmDate = this.getResponseHeader('Last-Modified');
    ThreadWatcher.dbLM.extend({siteID, boardID, val: $.item(url, lmDate)});
    const threads = dict();
    let pageLength = 0;
    let nThreads = 0;
    let oldest = null;
    try {
      pageLength = this.response[0]?.threads.length || 0;
      for (let i = 0; i < this.response.length; i++) {
        page = this.response[i];
        for (var item of page.threads) {
          threads[item.no] = {
            page: i + 1,
            index: nThreads,
            modified: item.last_modified,
            replies: item.replies
          };
          nThreads++;
          if ((oldest == null) || (item.no < oldest)) {
            oldest = item.no;
          }
        }
      }
    } catch (error) {
      for (thread of board) {
        ThreadWatcher.fetchStatus(thread);
      }
    }
    for (thread of board) {
      var {threadID, data} = thread;
      if (threads[threadID]) {
        var index, modified, replies;
        ({page, index, modified, replies} = threads[threadID]);
        if (Conf['Show Page']) {
          var lastPage = g.sites[siteID].isPrunedByAge?.({siteID, boardID}) ?
            threadID === oldest
          :
            index >= (nThreads - pageLength);
          ThreadWatcher.update(siteID, boardID, threadID, {page, lastPage});
        }
        if (ThreadWatcher.unreadEnabled && Conf['Show Unread Count']) {
          if ((modified !== data.modified) || ((replies != null) && (replies !== data.replies))) {
            (thread.newData || (thread.newData = {})).modified = modified;
            ThreadWatcher.fetchStatus(thread);
          }
        }
      } else {
        ThreadWatcher.fetchStatus(thread);
      }
    }
  },

  fetchStatus(thread) {
    const {siteID, boardID, threadID, data, force} = thread;
    const url = g.sites[siteID]?.urls.threadJSON?.({siteID, boardID, threadID});
    if (!url) { return; }
    if (data.isDead && !force) { return; }
    if (data.last === -1) { return; } // 404 or no JSON API
    return ThreadWatcher.fetch(url, {siteID, force}, [thread], ThreadWatcher.parseStatus);
  },

  parseStatus(thread, isArchiveURL) {
    let isDead, last;
    let {siteID, boardID, threadID, data, newData, force} = thread;
    const site = g.sites[siteID];
    if ((this.status === 200) && this.response) {
      let isArchived;
      last = this.response.posts[this.response.posts.length-1].no;
      const replies = this.response.posts.length-1;
      isDead = (isArchived = !!(this.response.posts[0].archived || isArchiveURL));
      if (isDead && Conf['Auto Prune']) {
        ThreadWatcher.rm(siteID, boardID, threadID);
        return;
      }

      if ((last === data.last) && (isDead === data.isDead) && (isArchived === data.isArchived)) { return; }

      const lastReadPost = ThreadWatcher.unreaddb.get({siteID, boardID, threadID, defaultValue: 0});
      let unread = data.unread || 0;
      let quotingYou = data.quotingYou || 0;
      const youOP = !!QuoteYou.db?.get({siteID, boardID, threadID, postID: threadID});

      for (var postObj of this.response.posts) {
        if ((postObj.no <= (data.last || 0)) || (postObj.no <= lastReadPost)) { continue; }
        if (QuoteYou.db?.get({siteID, boardID, threadID, postID: postObj.no})) { continue; }

        var quotesYou = false;
        if (!Conf['Require OP Quote Link'] && youOP) {
          quotesYou = true;
        } else if (QuoteYou.db && postObj.com) {
          var match;
          var regexp = site.regexp.quotelinkHTML;
          regexp.lastIndex = 0;
          while (match = regexp.exec(postObj.com)) {
            if (QuoteYou.db.get({
              siteID,
              boardID:  match[1] ? encodeURIComponent(match[1]) : boardID,
              threadID: match[2] || threadID,
              postID:   match[3] || match[2] || threadID
            })) {
              quotesYou = true;
              break;
            }
          }
        }

        if (!unread || (!quotingYou && quotesYou)) {
          if (Filter.isHidden(site.Build.parseJSON(postObj, {siteID, boardID}))) { continue; }
        }

        unread++;
        if (quotesYou) { quotingYou = postObj.no; }
      }

      if (!newData) { newData = {}; }
      $.extend(newData, {last, replies, isDead, isArchived, unread, quotingYou});
      return ThreadWatcher.update(siteID, boardID, threadID, newData);

    } else if (this.status === 404) {
      const archiveURL = g.sites[siteID]?.urls.archivedThreadJSON?.({siteID, boardID, threadID});
      if (!isArchiveURL && archiveURL) {
        return ThreadWatcher.fetch(archiveURL, {siteID, force}, [thread, true], ThreadWatcher.parseStatus);
      } else if (site.mayLackJSON && (data.last == null)) {
        return ThreadWatcher.update(siteID, boardID, threadID, {last: -1});
      } else {
        return ThreadWatcher.update(siteID, boardID, threadID, {isDead: true});
      }
    }
  },

  getAll(groupByBoard) {
    const all = [];
    for (var siteID in ThreadWatcher.db.data) {
      var boards = ThreadWatcher.db.data[siteID];
      for (var boardID in boards.boards) {
        var cont;
        var threads = boards.boards[boardID];
        if (Conf['Current Board'] && ((siteID !== g.SITE.ID) || (boardID !== g.BOARD.ID))) {
          continue;
        }
        if (groupByBoard) {
          all.push((cont = []));
        }
        for (var threadID in threads) {
          var data = threads[threadID];
          if (data && (typeof data === 'object')) {
            (groupByBoard ? cont : all).push({siteID, boardID, threadID, data});
          }
        }
      }
    }
    return all;
  },

  makeLine(siteID, boardID, threadID, data) {
    let page;
    const x = $.el('a', {
      className: 'fa fa-times',
      href: 'javascript:;'
    }
    );
    $.on(x, 'click', ThreadWatcher.cb.rm);

    let {excerpt, isArchived} = data;
    if (!excerpt) { excerpt = `/${boardID}/ - No.${threadID}`; }
    if (Conf['Show Site Prefix']) { excerpt = ThreadWatcher.prefixes[siteID] + excerpt; }

    const link = $.el('a', {
      href: g.sites[siteID]?.urls.thread({siteID, boardID, threadID}, isArchived) || '',
      title: excerpt,
      className: 'watcher-link'
    }
    );

    if (Conf['Show Page'] && (data.page != null)) {
      page = $.el('span', {
        textContent: `[${data.page}]`,
        className: 'watcher-page'
      }
      );
      $.add(link, page);
    }

    if (ThreadWatcher.unreadEnabled && Conf['Show Unread Count'] && (data.unread != null)) {
      const count = $.el('span', {
        textContent: `(${data.unread})`,
        className: 'watcher-unread'
      }
      );
      $.add(link, count);
    }

    const title = $.el('span', {
      textContent: excerpt,
      className: 'watcher-title'
    }
    );
    $.add(link, title);

    const div = $.el('div');
    const fullID = `${boardID}.${threadID}`;
    div.dataset.fullID = fullID;
    div.dataset.siteID = siteID;
    if ((g.VIEW === 'thread') && (fullID === `${g.BOARD}.${g.THREADID}`)) { $.addClass(div, 'current'); }
    if (data.isDead) { $.addClass(div, 'dead-thread'); }
    if (Conf['Show Page']) {
      if (data.lastPage) { $.addClass(div, 'last-page'); }
      if (data.page != null) { div.dataset.page = data.page; }
    }
    if (ThreadWatcher.unreadEnabled && Conf['Show Unread Count']) {
      if (data.unread === 0) { $.addClass(div, 'replies-read'); }
      if (data.unread) { $.addClass(div, 'replies-unread'); }
      if ((data.quotingYou || 0) > (data.dismiss || 0)) { $.addClass(div, 'replies-quoting-you'); }
    }
    $.add(div, [x, $.tn(' '), link]);
    return div;
  },

  setPrefixes(threads) {
    const prefixes = dict();
    for (var {siteID} of threads) {
      if (siteID in prefixes) { continue; }
      var len = 0;
      var prefix = '';
      var conflicts = Object.keys(prefixes);
      while (conflicts.length > 0) {
        len++;
        prefix = siteID.slice(0, len);
        var conflicts2 = [];
        for (var siteID2 of conflicts) {
          if (siteID2.slice(0, len) === prefix) {
            conflicts2.push(siteID2);
          } else if (prefixes[siteID2].length < len) {
            prefixes[siteID2] = siteID2.slice(0, len);
          }
        }
        conflicts = conflicts2;
      }
      prefixes[siteID] = prefix;
    }
    return ThreadWatcher.prefixes = prefixes;
  },

  build() {
    const nodes = [];
    const threads = ThreadWatcher.getAll();
    ThreadWatcher.setPrefixes(threads);
    for (var {siteID, boardID, threadID, data} of threads) {
      // Add missing excerpt for threads added by Auto Watch
      var thread;
      if ((data.excerpt == null) && (siteID === g.SITE.ID) && (thread = g.threads.get(`${boardID}.${threadID}`)) && thread.OP) {
        ThreadWatcher.db.extend({boardID, threadID, val: {excerpt: Get.threadExcerpt(thread)}});
      }
      nodes.push(ThreadWatcher.makeLine(siteID, boardID, threadID, data));
    }
    const {list} = ThreadWatcher;
    $.rmAll(list);
    $.add(list, nodes);

    return ThreadWatcher.refreshIcon();
  },

  refresh() {
    ThreadWatcher.build();

    g.threads.forEach(function(thread) {
      const isWatched = ThreadWatcher.isWatched(thread);
      if (thread.OP) {
        for (var post of [thread.OP, ...Array.from(thread.OP.clones)]) {
          var toggler;
          if (toggler = $('.watch-thread-link', post.nodes.info)) {
            ThreadWatcher.setToggler(toggler, isWatched);
          }
        }
      }
      if (thread.catalogView) { return thread.catalogView.nodes.root.classList.toggle('watched', isWatched); }
    });

    if (Conf['Pin Watched Threads']) {
      return $.event('SortIndex', {deferred: Conf['Index Mode'] !== 'catalog'});
    }
  },

  refreshIcon() {
    for (var className of ['replies-unread', 'replies-quoting-you']) {
      ThreadWatcher.shortcut.classList.toggle(className, !!$(`.${className}`, ThreadWatcher.dialog));
    }
  },

  update(siteID, boardID, threadID, newData) {
    let data, key, line, val;
    if (!(data = ThreadWatcher.db?.get({siteID, boardID, threadID}))) { return; }
    if (newData.isDead && Conf['Auto Prune']) {
      ThreadWatcher.rm(siteID, boardID, threadID);
      return;
    }
    if (newData.isDead || (newData.last === -1)) {
      for (key of ['isArchived', 'page', 'lastPage', 'unread', 'quotingyou']) {
        if (!(key in newData)) {
          newData[key] = undefined;
        }
      }
    }
    if ((newData.last != null) && (newData.last < data.last)) {
      newData.modified = undefined;
    }
    let n = 0;
    for (key in newData) { val = newData[key]; if (data[key] !== val) { n++; } }
    if (!n) { return; }
    ThreadWatcher.db.extend({siteID, boardID, threadID, val: newData});
    if (line = $(`#watched-threads > [data-site-i-d='${siteID}'][data-full-i-d='${boardID}.${threadID}']`, ThreadWatcher.dialog)) {
      const newLine = ThreadWatcher.makeLine(siteID, boardID, threadID, data);
      $.replace(line, newLine);
      return ThreadWatcher.refreshIcon();
    } else {
      return ThreadWatcher.refresh();
    }
  },

  set404(boardID, threadID, cb) {
    let data;
    if (!(data = ThreadWatcher.db?.get({boardID, threadID}))) { return cb(); }
    if (Conf['Auto Prune']) {
      ThreadWatcher.db.delete({boardID, threadID});
      return cb();
    }
    if (data.isDead && !((data.isArchived != null) || (data.page != null) || (data.lastPage != null) || (data.unread != null) || (data.quotingYou != null))) { return cb(); }
    return ThreadWatcher.db.extend({boardID, threadID, val: {isDead: true, isArchived: undefined, page: undefined, lastPage: undefined, unread: undefined, quotingYou: undefined}}, cb);
  },

  toggle(thread) {
    const siteID   = g.SITE.ID;
    const boardID  = thread.board.ID;
    const threadID = thread.ID;
    if (ThreadWatcher.db.get({boardID, threadID})) {
      return ThreadWatcher.rm(siteID, boardID, threadID);
    } else {
      return ThreadWatcher.add(thread);
    }
  },

  add(thread, cb) {
    const data     = {};
    const siteID   = g.SITE.ID;
    const boardID  = thread.board.ID;
    const threadID = thread.ID;
    if (thread.isDead) {
      if (Conf['Auto Prune'] && ThreadWatcher.db.get({boardID, threadID})) {
        ThreadWatcher.rm(siteID, boardID, threadID, cb);
        return;
      }
      data.isDead = true;
    }
    if (thread.OP) { data.excerpt = Get.threadExcerpt(thread); }
    return ThreadWatcher.addRaw(boardID, threadID, data, cb);
  },

  addRaw(boardID, threadID, data, cb) {
    const oldData = ThreadWatcher.db.get({ boardID, threadID, defaultValue: dict() });
    delete oldData.last;
    delete oldData.modified;
    $.extend(oldData, data);
    ThreadWatcher.db.set({boardID, threadID, val: oldData}, cb);
    ThreadWatcher.refresh();
    const thread = {siteID: g.SITE.ID, boardID, threadID, data, force: true};
    if (Conf['Show Page'] && !data.isDead) {
      return ThreadWatcher.fetchBoard([thread]);
    } else if (ThreadWatcher.unreadEnabled && Conf['Show Unread Count']) {
      return ThreadWatcher.fetchStatus(thread);
    }
  },

  rm(siteID, boardID, threadID, cb) {
    ThreadWatcher.db.delete({siteID, boardID, threadID}, cb);
    return ThreadWatcher.refresh();
  },

  menu: {
    init() {
      if (!Conf['Thread Watcher']) { return; }
      const menu = (this.menu = new UI.Menu('thread watcher'));
      $.on($('.menu-button', ThreadWatcher.dialog), 'click', function(e) {
        return menu.toggle(e, this, ThreadWatcher);
      });
      return this.addMenuEntries();
    },

    addHeaderMenuEntry() {
      if (g.VIEW !== 'thread') { return; }
      const entryEl = $.el('a',
        {href: 'javascript:;'});
      Header.menu.addEntry({
        el: entryEl,
        order: 60,
        open() {
          const [addClass, rmClass, text] = Array.from(!!ThreadWatcher.db.get({boardID: g.BOARD.ID, threadID: g.THREADID}) ?
            ['unwatch-thread', 'watch-thread', 'Unwatch thread']
          :
            ['watch-thread', 'unwatch-thread', 'Watch thread']);
          $.addClass(entryEl, addClass);
          $.rmClass(entryEl, rmClass);
          entryEl.textContent = text;
          return true;
        }
      });
      return $.on(entryEl, 'click', () => ThreadWatcher.toggle(g.threads.get(`${g.BOARD}.${g.THREADID}`)));
    },

    addMenuEntries() {
      const entries = [];

      // `Open all` entry
      entries.push({
        text: 'Open all threads',
        cb: ThreadWatcher.cb.openAll,
        open() {
          this.el.classList.toggle('disabled', !ThreadWatcher.list.firstElementChild);
          return true;
        }
      });

      // `Open Unread` entry
      entries.push({
        text: 'Open unread threads',
        cb: ThreadWatcher.cb.openUnread,
        open() {
          this.el.classList.toggle('disabled', !$('.replies-unread', ThreadWatcher.list));
          return true;
        }
      });

      // `Open dead threads` entry
      entries.push({
        text: 'Open dead threads',
        cb: ThreadWatcher.cb.openDeads,
        open() {
          this.el.classList.toggle('disabled', !$('.dead-thread', ThreadWatcher.list));
          return true;
        }
      });

      // `Prune dead threads` entry
      entries.push({
        text: 'Prune dead threads',
        cb: ThreadWatcher.cb.pruneDeads,
        open() {
          this.el.classList.toggle('disabled', !$('.dead-thread', ThreadWatcher.list));
          return true;
        }
      });

      // `Dismiss posts quoting you` entry
      entries.push({
        text: 'Dismiss posts quoting you',
        title: 'Unhighlight the thread watcher icon and threads until there are new replies quoting you.',
        cb: ThreadWatcher.cb.dismiss,
        open() {
          this.el.classList.toggle('disabled', !$.hasClass(ThreadWatcher.shortcut, 'replies-quoting-you'));
          return true;
        }
      });

      for (var {text, title, cb, open} of entries) {
        var entry = {
          el: $.el('a', {
            textContent: text,
            href: 'javascript:;'
          }
          )
        };
        if (title) { entry.el.title = title; }
        $.on(entry.el, 'click', cb);
        entry.open = open.bind(entry);
        this.menu.addEntry(entry);
      }

      // Settings checkbox entries:
      for (var name in Config.threadWatcher) {
        var conf = Config.threadWatcher[name];
        this.addCheckbox(name, conf[1]);
      }

    },

    addCheckbox(name, desc) {
      const entry = {
        type: 'thread watcher',
        el: UI.checkbox(name, name.replace(' Thread Watcher', ''))
      };
      entry.el.title = desc;
      const input = entry.el.firstElementChild;
      if ((name === 'Show Unread Count') && !ThreadWatcher.unreadEnabled) {
        input.disabled = true;
        $.addClass(entry.el, 'disabled');
        entry.el.title += '\n[Remember Last Read Post is disabled.]';
      }
      $.on(input, 'change', $.cb.checked);
      if (['Current Board', 'Show Page', 'Show Unread Count', 'Show Site Prefix'].includes(name)) { $.on(input, 'change', ThreadWatcher.refresh); }
      if (['Show Page', 'Show Unread Count', 'Auto Update Thread Watcher'].includes(name)) { $.on(input, 'change', ThreadWatcher.fetchAuto); }
      return this.menu.addEntry(entry);
    }
  }
};
export default ThreadWatcher;
