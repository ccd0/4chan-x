/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class DataBoard {
  static initClass() {
    this.keys = ['hiddenThreads', 'hiddenPosts', 'lastReadPosts', 'yourPosts', 'watchedThreads', 'watcherLastModified', 'customTitles'];
  
    this.prototype.changes = [];
  }

  constructor(key, sync, dontClean) {
    this.onSync = this.onSync.bind(this);
    this.key = key;
    this.initData(Conf[this.key]);
    $.sync(this.key, this.onSync);
    if (!dontClean) { this.clean(); }
    if (!sync) { return; }
    // Chrome also fires the onChanged callback on the current tab,
    // so we only start syncing when we're ready.
    var init = () => {
      $.off(d, '4chanXInitFinished', init);
      return this.sync = sync;
    };
    $.on(d, '4chanXInitFinished', init);
  }

  initData(data) {
    let boards;
    this.data = data;
    if (this.data.boards) {
      let lastChecked;
      ({boards, lastChecked} = this.data);
      this.data['4chan.org'] = {boards, lastChecked};
      delete this.data.boards;
      delete this.data.lastChecked;
    }
    return this.data[g.SITE.ID] || (this.data[g.SITE.ID] = {boards: $.dict()});
  }

  save(change, cb) {
    change();
    this.changes.push(change);
    return $.get(this.key, {boards: $.dict()}, items => {
      if (!this.changes.length) { return; }
      const needSync = ((items[this.key].version || 0) > (this.data.version || 0));
      if (needSync) {
        this.initData(items[this.key]);
        for (change of this.changes) { change(); }
      }
      this.changes = [];
      this.data.version = (this.data.version || 0) + 1;
      return $.set(this.key, this.data, () => {
        if (needSync) { this.sync?.(); }
        return cb?.();
      });
    });
  }

  forceSync(cb) {
    return $.get(this.key, {boards: $.dict()}, items => {
      if ((items[this.key].version || 0) > (this.data.version || 0)) {
        this.initData(items[this.key]);
        for (var change of this.changes) { change(); }
        this.sync?.();
      }
      return cb?.();
    });
  }

  delete({siteID, boardID, threadID, postID}, cb) {
    if (!siteID) { siteID = g.SITE.ID; }
    if (!this.data[siteID]) { return; }
    return this.save(() => {
      if (postID) {
        if (!this.data[siteID].boards[boardID]?.[threadID]) { return; }
        delete this.data[siteID].boards[boardID][threadID][postID];
        return this.deleteIfEmpty({siteID, boardID, threadID});
      } else if (threadID) {
        if (!this.data[siteID].boards[boardID]) { return; }
        delete this.data[siteID].boards[boardID][threadID];
        return this.deleteIfEmpty({siteID, boardID});
      } else {
        return delete this.data[siteID].boards[boardID];
      }
    }
    , cb);
  }

  deleteIfEmpty({siteID, boardID, threadID}) {
    if (!this.data[siteID]) { return; }
    if (threadID) {
      if (!Object.keys(this.data[siteID].boards[boardID][threadID]).length) {
        delete this.data[siteID].boards[boardID][threadID];
        return this.deleteIfEmpty({siteID, boardID});
      }
    } else if (!Object.keys(this.data[siteID].boards[boardID]).length) {
      return delete this.data[siteID].boards[boardID];
    }
  }

  set(data, cb) {
    return this.save(() => {
      return this.setUnsafe(data);
    }
    , cb);
  }

  setUnsafe({siteID, boardID, threadID, postID, val}) {
    if (!siteID) { siteID = g.SITE.ID; }
    if (!this.data[siteID]) { this.data[siteID] = {boards: $.dict()}; }
    if (postID !== undefined) {
      let base;
      return (((base = this.data[siteID].boards[boardID] || (this.data[siteID].boards[boardID] = $.dict())))[threadID] || (base[threadID] = $.dict()))[postID] = val;
    } else if (threadID !== undefined) {
      return (this.data[siteID].boards[boardID] || (this.data[siteID].boards[boardID] = $.dict()))[threadID] = val;
    } else {
      return this.data[siteID].boards[boardID] = val;
    }
  }

  extend({siteID, boardID, threadID, postID, val}, cb) {
    return this.save(() => {
      const oldVal = this.get({siteID, boardID, threadID, postID, defaultValue: $.dict()});
      for (var key in val) {
        var subVal = val[key];
        if (typeof subVal === 'undefined') {
          delete oldVal[key];
        } else {
          oldVal[key] = subVal;
        }
      }
      return this.setUnsafe({siteID, boardID, threadID, postID, val: oldVal});
    }
    , cb);
  }

  setLastChecked(key='lastChecked') {
    return this.save(() => {
      return this.data[key] = Date.now();
    });
  }

  get({siteID, boardID, threadID, postID, defaultValue}) {
    let board, val;
    if (!siteID) { siteID = g.SITE.ID; }
    if (board = this.data[siteID]?.boards[boardID]) {
      let thread;
      if (threadID == null) {
        if (postID != null) {
          for (thread = 0; thread < board.length; thread++) {
            var ID = board[thread];
            if (postID in thread) {
              val = thread[postID];
              break;
            }
          }
        } else {
          val = board;
        }
      } else if (thread = board[threadID]) {
        val = (postID != null) ?
          thread[postID]
        :
          thread;
      }
    }
    return val || defaultValue;
  }

  clean() {
    let boardID, middle;
    const siteID = g.SITE.ID;
    for (boardID in this.data[siteID].boards) {
      var val = this.data[siteID].boards[boardID];
      this.deleteIfEmpty({siteID, boardID});
    }
    const now = Date.now();
    if (now - (2 * $.HOUR) >= ((middle = this.data[siteID].lastChecked || 0)) || middle > now) {
      this.data[siteID].lastChecked = now;
      for (boardID in this.data[siteID].boards) {
        this.ajaxClean(boardID);
      }
    }
  }

  ajaxClean(boardID) {
    const that = this;
    const siteID = g.SITE.ID;
    const threadsList = g.SITE.urls.threadsListJSON?.({siteID, boardID});
    if (!threadsList) { return; }
    return $.cache(threadsList, function() {
      if (this.status !== 200) { return; }
      const archiveList = g.SITE.urls.archiveListJSON?.({siteID, boardID});
      if (!archiveList) { return that.ajaxCleanParse(boardID, this.response); }
      const response1 = this.response;
      return $.cache(archiveList, function() {
        if ((this.status !== 200) && (!!g.SITE.archivedBoardsKnown || (this.status !== 404))) { return; }
        return that.ajaxCleanParse(boardID, response1, this.response);
      });
    });
  }

  ajaxCleanParse(boardID, response1, response2) {
    let board, ID;
    const siteID = g.SITE.ID;
    if (!(board = this.data[siteID].boards[boardID])) { return; }
    const threads = $.dict();
    if (response1) {
      for (var page of response1) {
        for (var thread of page.threads) {
          ID = thread.no;
          if (ID in board) { threads[ID] = board[ID]; }
        }
      }
    }
    if (response2) {
      for (ID of response2) {
        if (ID in board) { threads[ID] = board[ID]; }
      }
    }
    this.data[siteID].boards[boardID] = threads;
    this.deleteIfEmpty({siteID, boardID});
    return $.set(this.key, this.data);
  }

  onSync(data) {
    if ((data.version || 0) <= (this.data.version || 0)) { return; }
    this.initData(data);
    return this.sync?.();
  }
}
DataBoard.initClass();
