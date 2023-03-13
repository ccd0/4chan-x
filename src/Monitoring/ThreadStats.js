/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var ThreadStats = {
  postCount: 0,
  fileCount: 0,
  postIndex: 0,

  init() {
    let sc;
    if ((g.VIEW !== 'thread') || !Conf['Thread Stats']) { return; }

    if (Conf['Page Count in Stats']) {
      this[g.SITE.isPrunedByAge?.(g.BOARD) ? 'showPurgePos' : 'showPage'] = true;
    }

    const statsHTML = {innerHTML: "<span id=\"post-count\">?</span> / <span id=\"file-count\">?</span>" + ((Conf["IP Count in Stats"] && g.SITE.hasIPCount) ? " / <span id=\"ip-count\">?</span>" : "") + ((Conf["Page Count in Stats"]) ? " / <span id=\"page-count\">?</span>" : "")};
    let statsTitle = 'Posts / Files';
    if (Conf['IP Count in Stats'] && g.SITE.hasIPCount) { statsTitle += ' / IPs'; }
    if (Conf['Page Count in Stats']) { statsTitle += (this.showPurgePos ? ' / Purge Position' : ' / Page'); }

    if (Conf['Updater and Stats in Header']) {
      this.dialog = (sc = $.el('span', {
        id:    'thread-stats',
        title: statsTitle
      }
      ));
      $.extend(sc, statsHTML);
      Header.addShortcut('stats', sc, 200);

    } else {
      this.dialog = (sc = UI.dialog('thread-stats',
        {innerHTML: "<div class=\"move\" title=\"" + E(statsTitle) + "\">" + (statsHTML).innerHTML + "</div>"}));
      $.addClass(doc, 'float');
      $.ready(() => $.add(d.body, sc));
    }

    this.postCountEl = $('#post-count', sc);
    this.fileCountEl = $('#file-count', sc);
    this.ipCountEl   = $('#ip-count',   sc);
    this.pageCountEl = $('#page-count', sc);

    if (this.pageCountEl) { $.on(this.pageCountEl, 'click', ThreadStats.fetchPage); }

    return Callbacks.Thread.push({
      name: 'Thread Stats',
      cb:   this.node
    });
  },

  node() {
    ThreadStats.thread = this;
    ThreadStats.count();
    ThreadStats.update();
    ThreadStats.fetchPage();
    $.on(d, 'PostsInserted', () => $.queueTask(ThreadStats.onPostsInserted));
    return $.on(d, 'ThreadUpdate', ThreadStats.onUpdate);
  },

  count() {
    const {posts} = ThreadStats.thread;
    const n = posts.keys.length;
    for (let i = ThreadStats.postIndex, end = n; i < end; i++) {
      var post = posts.get(posts.keys[i]);
      if (!post.isFetchedQuote) {
        ThreadStats.postCount++;
        ThreadStats.fileCount += post.files.length;
      }
    }
    return ThreadStats.postIndex = n;
  },

  onUpdate(e) {
    if (e.detail[404]) { return; }
    const {postCount, fileCount} = e.detail;
    $.extend(ThreadStats, {postCount, fileCount});
    ThreadStats.postIndex = ThreadStats.thread.posts.keys.length;
    ThreadStats.update();
    if (ThreadStats.showPage && (ThreadStats.pageCountEl.textContent !== '1')) {
      return ThreadStats.fetchPage();
    }
  },

  onPostsInserted() {
    if (ThreadStats.thread.posts.keys.length <= ThreadStats.postIndex) { return; }
    ThreadStats.count();
    ThreadStats.update();
    if (ThreadStats.showPage && (ThreadStats.pageCountEl.textContent !== '1')) {
      return ThreadStats.fetchPage();
    }
  },

  update() {
    const {thread, postCountEl, fileCountEl, ipCountEl} = ThreadStats;
    postCountEl.textContent = ThreadStats.postCount;
    fileCountEl.textContent = ThreadStats.fileCount;
    // TOTO check if ipCountEl exists
    ipCountEl.textContent  = thread.ipCount ?? '?';
    postCountEl.classList.toggle('warning', (thread.postLimit && !thread.isSticky));
    return fileCountEl.classList.toggle('warning', (thread.fileLimit && !thread.isSticky));
  },

  fetchPage() {
    if (!ThreadStats.pageCountEl) { return; }
    clearTimeout(ThreadStats.timeout);
    if (ThreadStats.thread.isDead) {
      ThreadStats.pageCountEl.textContent = 'Dead';
      $.addClass(ThreadStats.pageCountEl, 'warning');
      return;
    }
    ThreadStats.timeout = setTimeout(ThreadStats.fetchPage, 2 * $.MINUTE);
    return $.whenModified(
      g.SITE.urls.threadsListJSON(ThreadStats.thread),
      'ThreadStats',
      ThreadStats.onThreadsLoad
    );
  },

  onThreadsLoad() {
    if (this.status === 200) {
      let page, thread;
      if (ThreadStats.showPurgePos) {
        let purgePos = 1;
        for (page of this.response) {
          for (thread of page.threads) {
            if (thread.no < ThreadStats.thread.ID) {
              purgePos++;
            }
          }
        }
        ThreadStats.pageCountEl.textContent = purgePos;
        return ThreadStats.pageCountEl.classList.toggle('warning', (purgePos === 1));
      } else {
        let nThreads;
        let i = (nThreads = 0);
        for (page of this.response) {
          nThreads += page.threads.length;
        }
        for (let pageNum = 0; pageNum < this.response.length; pageNum++) {
          page = this.response[pageNum];
          for (thread of page.threads) {
            if (thread.no === ThreadStats.thread.ID) {
              ThreadStats.pageCountEl.textContent = pageNum + 1;
              ThreadStats.pageCountEl.classList.toggle('warning', (i >= (nThreads - this.response[0].threads.length)));
              ThreadStats.lastPageUpdate = new Date(thread.last_modified * $.SECOND);
              ThreadStats.retry();
              return;
            }
            i++;
          }
        }
      }
    } else if (this.status === 304) {
      return ThreadStats.retry();
    }
  },

  retry() {
    // If thread data is stale (modification date given < time of last post), try again.
    // Skip this on vichan sites due to sage posts not updating modification time in threads.json.
    if (
      !ThreadStats.showPage ||
      (ThreadStats.pageCountEl.textContent === '1') ||
      !!g.SITE.threadModTimeIgnoresSage ||
      (ThreadStats.thread.posts.get(ThreadStats.thread.lastPost).info.date <= ThreadStats.lastPageUpdate)
    ) { return; }
    clearTimeout(ThreadStats.timeout);
    return ThreadStats.timeout = setTimeout(ThreadStats.fetchPage, 5 * $.SECOND);
  }
};
