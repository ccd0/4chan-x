/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import Beep from './ThreadUpdater/beep.wav';

var ThreadUpdater = {
  init() {
    let el, name, sc;
    if ((g.VIEW !== 'thread') || !Conf['Thread Updater']) { return; }
    this.enabled = true;

    // Chromium won't play audio created in an inactive tab until the tab has been focused, so set it up now.
    // XXX Sometimes the loading stalls in Firefox, esp. when opening in private browsing window followed by normal window.
    // Don't let it keep the loading icon on indefinitely.
    this.audio = $.el('audio');
    if ($.engine !== 'gecko') { this.audio.src = this.beep; }

    if (Conf['Updater and Stats in Header']) {
      this.dialog = (sc = $.el('span',
        {id:        'updater'}));
      $.extend(sc, {innerHTML: '<span id="update-status" class="empty"></span><span id="update-timer" class="empty" title="Update now"></span>'});
      Header.addShortcut('updater', sc, 100);
    } else {
      this.dialog = (sc = UI.dialog('updater',
        {innerHTML: '<div class="move"></div><span id="update-status" class="empty"></span><span id="update-timer" class="empty" title="Update now"></span>'}));
      $.addClass(doc, 'float');
      $.ready(() => $.add(d.body, sc));
    }

    this.checkPostCount = 0;

    this.timer  = $('#update-timer', sc);
    this.status = $('#update-status', sc);

    $.on(this.timer,  'click', this.update);
    $.on(this.status, 'click', this.update);

    const updateLink = $.el('span',
      {className: 'brackets-wrap updatelink'});
    $.extend(updateLink, {innerHTML: '<a href="javascript:;">Update</a>'});
    Main.ready(function() {
      let navLinksBot;
      if (navLinksBot = $('.navLinksBot')) { return $.add(navLinksBot, [$.tn(' '), updateLink]); }
    });
    $.on(updateLink.firstElementChild, 'click', this.update);

    const subEntries = [];
    for (name in Config.updater.checkbox) {
      var conf = Config.updater.checkbox[name];
      el = UI.checkbox(name, name);
      el.title = conf[1];
      var input = el.firstElementChild;
      $.on(input, 'change', $.cb.checked);
      if (input.name === 'Scroll BG') {
        $.on(input, 'change', this.cb.scrollBG);
        this.cb.scrollBG();
      } else if (input.name === 'Auto Update') {
        $.on(input, 'change', this.setInterval);
      }
      subEntries.push({el});
    }

    this.settings = $.el('span',
      {innerHTML: '<a href="javascript:;">Interval</a>'});

    $.on(this.settings, 'click', this.intervalShortcut);

    subEntries.push({el: this.settings});

    Header.menu.addEntry(this.entry = {
      el: $.el('span',
        {textContent: 'Updater'}),
      order: 110,
      subEntries
    }
    );

    return Callbacks.Thread.push({
      name: 'Thread Updater',
      cb:   this.node
    });
  },

  node() {
    ThreadUpdater.thread       = this;
    ThreadUpdater.root         = this.nodes.root;
    ThreadUpdater.outdateCount = 0;

    // We must keep track of our own list of live posts/files
    // to provide an accurate deletedPosts/deletedFiles on update
    // as posts may be `kill`ed elsewhere.
    ThreadUpdater.postIDs = [];
    ThreadUpdater.fileIDs = [];
    this.posts.forEach(function(post) {
      ThreadUpdater.postIDs.push(post.ID);
      if (post.file) { return ThreadUpdater.fileIDs.push(post.ID); }
    });

    ThreadUpdater.cb.interval.call($.el('input', {value: Conf['Interval']}));

    $.on(d,      'QRPostSuccessful', ThreadUpdater.cb.checkpost);
    $.on(d,      'visibilitychange', ThreadUpdater.cb.visibility);

    return ThreadUpdater.setInterval();
  },

  /*
  http://freesound.org/people/pierrecartoons1979/sounds/90112/
  cc-by-nc-3.0
  */
  beep: 'data:audio/wav;base64,<%= readBase64("beep.wav") %>',

  playBeep() {
    const {audio} = ThreadUpdater;
    if (!audio.src) { audio.src = ThreadUpdater.beep; }
    if (audio.paused) {
      return audio.play();
    } else {
      return $.one(audio, 'ended', ThreadUpdater.playBeep);
    }
  },

  cb: {
    checkpost(e) {
      if (e.detail.threadID !== ThreadUpdater.thread.ID) { return; }
      ThreadUpdater.postID = e.detail.postID;
      ThreadUpdater.checkPostCount = 0;
      ThreadUpdater.outdateCount = 0;
      return ThreadUpdater.setInterval();
    },

    visibility() {
      if (d.hidden) { return; }
      // Reset the counter when we focus this tab.
      ThreadUpdater.outdateCount = 0;
      if (ThreadUpdater.seconds > ThreadUpdater.interval) {
        return ThreadUpdater.setInterval();
      }
    },

    scrollBG() {
      return ThreadUpdater.scrollBG = Conf['Scroll BG'] ?
        () => true
      :
        () => !d.hidden;
    },

    interval(e) {
      let val = parseInt(this.value, 10);
      if (val < 1) { val = 1; }
      ThreadUpdater.interval = (this.value = val);
      if (e) { return $.cb.value.call(this); }
    },

    load() {
      if (this !== ThreadUpdater.req) { return; } // aborted
      switch (this.status) {
        case 200:
          ThreadUpdater.parse(this);
          if (ThreadUpdater.thread.isArchived) {
            return ThreadUpdater.kill();
          } else {
            return ThreadUpdater.setInterval();
          }
        case 404:
          // XXX workaround for 4chan sending false 404s
          return $.ajax(g.SITE.urls.catalogJSON({boardID: ThreadUpdater.thread.board.ID}), { onloadend() {
            let confirmed;
            if (this.status === 200) {
              confirmed = true;
              for (var page of this.response) {
                for (var thread of page.threads) {
                  if (thread.no === ThreadUpdater.thread.ID) {
                    confirmed = false;
                    break;
                  }
                }
              }
            } else {
              confirmed = false;
            }
            if (confirmed) {
              return ThreadUpdater.kill();
            } else {
              return ThreadUpdater.error(this);
            }
          }
        }
          );
        default:
          return ThreadUpdater.error(this);
      }
    }
  },

  kill() {
    ThreadUpdater.thread.kill();
    ThreadUpdater.setInterval();
    return $.event('ThreadUpdate', {
      404: true,
      threadID: ThreadUpdater.thread.fullID
    }
    );
  },

  error(req) {
    if (req.status === 304) {
      ThreadUpdater.set('status', '');
    }
    ThreadUpdater.setInterval();
    if (!req.status) {
      return ThreadUpdater.set('status', 'Connection Error', 'warning');
    } else if (req.status !== 304) {
      return ThreadUpdater.set('status', `${req.statusText} (${req.status})`, 'warning');
    }
  },

  setInterval() {
    clearTimeout(ThreadUpdater.timeoutID);

    if (ThreadUpdater.thread.isDead) {
      ThreadUpdater.set('status', (ThreadUpdater.thread.isArchived ? 'Archived' : '404'), 'warning');
      ThreadUpdater.set('timer', '');
      return;
    }

    // Fetching your own posts after posting
    if (ThreadUpdater.postID && (ThreadUpdater.checkPostCount < 5)) {
      ThreadUpdater.set('timer', '...', 'loading');
      ThreadUpdater.timeoutID = setTimeout(ThreadUpdater.update, ++ThreadUpdater.checkPostCount * $.SECOND);
      return;
    }

    if (!Conf['Auto Update']) {
      ThreadUpdater.set('timer', 'Update');
      return;
    }

    const {interval} = ThreadUpdater;
    if (Conf['Optional Increase']) {
      // Lower the max refresh rate limit on visible tabs.
      const limit = d.hidden ? 10 : 5;
      const j     = Math.min(ThreadUpdater.outdateCount, limit);

      // 1 second to 100, 30 to 300.
      const cur = (Math.floor(interval * 0.1) || 1) * j * j;
      ThreadUpdater.seconds = $.minmax(cur, interval, 300);
    } else {
      ThreadUpdater.seconds = interval;
    }

    return ThreadUpdater.timeout();
  },

  intervalShortcut() {
    Settings.open('Advanced');
    const settings = $.id('fourchanx-settings');
    return $('input[name=Interval]', settings).focus();
  },

  set(name, text, klass) {
    let node;
    const el = ThreadUpdater[name];
    if ((node = el.firstChild)) {
      // Prevent the creation of a new DOM Node
      // by setting the text node's data.
      node.data = text;
    } else {
      el.textContent = text;
    }
    return el.className = klass ?? (text === '' ? 'empty' : '');
  },

  timeout() {
    if (ThreadUpdater.seconds) {
      ThreadUpdater.set('timer', ThreadUpdater.seconds);
      ThreadUpdater.timeoutID = setTimeout(ThreadUpdater.timeout, 1000);
    } else {
      ThreadUpdater.outdateCount++;
      ThreadUpdater.update();
    }
    return ThreadUpdater.seconds--;
  },

  update() {
    let oldReq;
    clearTimeout(ThreadUpdater.timeoutID);
    ThreadUpdater.set('timer', '...', 'loading');
    if (oldReq = ThreadUpdater.req) {
      delete ThreadUpdater.req;
      oldReq.abort();
    }
    return ThreadUpdater.req = $.whenModified(
      g.SITE.urls.threadJSON({boardID: ThreadUpdater.thread.board.ID, threadID: ThreadUpdater.thread.ID}),
      'ThreadUpdater',
      ThreadUpdater.cb.load,
      {timeout: $.MINUTE}
    );
  },

  updateThreadStatus(type, status) {
    let hasChanged;
    if (!(hasChanged = ThreadUpdater.thread[`is${type}`] !== status)) { return; }
    ThreadUpdater.thread.setStatus(type, status);
    if ((type === 'Closed') && ThreadUpdater.thread.isArchived) { return; }
    const change = type === 'Sticky' ?
      status ?
        'now a sticky'
      :
        'not a sticky anymore'
    :
      status ?
        'now closed'
      :
        'not closed anymore';
    return new Notice('info', `The thread is ${change}.`, 30);
  },

  parse(req) {
    let ID, ipCountEl, post;
    const postObjects = req.response.posts;
    const OP = postObjects[0];
    const {thread} = ThreadUpdater;
    const {board} = thread;
    const lastPost = ThreadUpdater.postIDs[ThreadUpdater.postIDs.length - 1];

    // XXX Reject updates that falsely delete the last post.
    if ((postObjects[postObjects.length-1].no < lastPost) &&
      ((new Date(req.getResponseHeader('Last-Modified')) - thread.posts.get(lastPost).info.date) < (30 * $.SECOND))) { return; }

    g.SITE.Build.spoilerRange[board] = OP.custom_spoiler;
    thread.setStatus('Archived', !!OP.archived);
    ThreadUpdater.updateThreadStatus('Sticky', !!OP.sticky);
    ThreadUpdater.updateThreadStatus('Closed', !!OP.closed);
    thread.postLimit = !!OP.bumplimit;
    thread.fileLimit = !!OP.imagelimit;
    if (OP.unique_ips != null) { thread.ipCount   = OP.unique_ips; }

    const posts    = []; // new post objects
    const index    = []; // existing posts
    const files    = []; // existing files
    const newPosts = []; // new post fullID list for API

    // Build the index, create posts.
    for (var postObject of postObjects) {
      ID = postObject.no;
      index.push(ID);
      if (postObject.fsize) { files.push(ID); }

      // Insert new posts, not older ones.
      if (ID <= lastPost) { continue; }

      // XXX Resurrect wrongly deleted posts.
      if ((post = thread.posts.get(ID)) && !post.isFetchedQuote) {
        post.resurrect();
        continue;
      }

      newPosts.push(`${board}.${ID}`);
      var node = g.SITE.Build.postFromObject(postObject, board.ID);
      posts.push(new Post(node, thread, board));
      // Fetching your own posts after posting
      if (ThreadUpdater.postID === ID) { delete ThreadUpdater.postID; }
    }

    // Check for deleted posts.
    const deletedPosts = [];
    for (ID of ThreadUpdater.postIDs) {
      if (!index.includes(ID)) {
        thread.posts.get(ID).kill();
        deletedPosts.push(`${board}.${ID}`);
      }
    }
    ThreadUpdater.postIDs = index;

    // Check for deleted files.
    const deletedFiles = [];
    for (ID of ThreadUpdater.fileIDs) {
      if (!(files.includes(ID) || deletedPosts.includes(`${board}.${ID}`))) {
        thread.posts.get(ID).kill(true);
        deletedFiles.push(`${board}.${ID}`);
      }
    }
    ThreadUpdater.fileIDs = files;

    if (!posts.length) {
      ThreadUpdater.set('status', '');
    } else {
      ThreadUpdater.set('status', `+${posts.length}`, 'new');
      ThreadUpdater.outdateCount = 0;

      const unreadCount   = Unread.posts?.size;
      const unreadQYCount = Unread.postsQuotingYou?.size;

      Main.callbackNodes('Post', posts);

      if (d.hidden || !d.hasFocus()) {
        if (Conf['Beep Quoting You'] && (Unread.postsQuotingYou?.size > unreadQYCount)) {
          ThreadUpdater.playBeep();
          if (Conf['Beep']) { ThreadUpdater.playBeep(); }
        } else if (Conf['Beep'] && (Unread.posts?.size > 0) && (unreadCount === 0)) {
          ThreadUpdater.playBeep();
        }
      }

      const scroll = Conf['Auto Scroll'] && ThreadUpdater.scrollBG() &&
        ((ThreadUpdater.root.getBoundingClientRect().bottom - doc.clientHeight) < 25);

      let firstPost = null;
      for (post of posts) {
        if (!QuoteThreading.insert(post)) {
          if (!firstPost) { firstPost = post.nodes.root; }
          $.add(ThreadUpdater.root, post.nodes.root);
        }
      }
      $.event('PostsInserted', null, ThreadUpdater.root);

      if (scroll) {
        if (Conf['Bottom Scroll']) {
          window.scrollTo(0, d.body.clientHeight);
        } else {
          if (firstPost) { Header.scrollTo(firstPost); }
        }
      }
    }

    // Update IP count in original post form.
    if ((OP.unique_ips != null) && (ipCountEl = $.id('unique-ips'))) {
      ipCountEl.textContent = OP.unique_ips;
      ipCountEl.previousSibling.textContent = ipCountEl.previousSibling.textContent.replace(/\b(?:is|are)\b/, OP.unique_ips === 1 ? 'is' : 'are');
      ipCountEl.nextSibling.textContent = ipCountEl.nextSibling.textContent.replace(/\bposters?\b/, OP.unique_ips === 1 ? 'poster' : 'posters');
    }

    return $.event('ThreadUpdate', {
      404: false,
      threadID: thread.fullID,
      newPosts,
      deletedPosts,
      deletedFiles,
      postCount: OP.replies + 1,
      fileCount: OP.images + !!OP.fsize,
      ipCount: OP.unique_ips
    }
    );
  }
};
