import Callbacks from "../classes/Callbacks";
import DataBoard from "../classes/DataBoard";
import RandomAccessList from "../classes/RandomAccessList";
import Get from "../General/Get";
import Header from "../General/Header";
import { g, Conf, d } from "../globals/globals";
import $ from "../platform/$";
import { debounce, SECOND } from "../platform/helpers";
import QuoteYou from "../Quotelinks/QuoteYou";
import Favicon from "./Favicon";
import ThreadWatcher from "./ThreadWatcher";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var Unread = {
  init() {
    if ((g.VIEW !== 'thread') || (
      !Conf['Unread Count'] &&
      !Conf['Unread Favicon'] &&
      !Conf['Unread Line'] &&
      !Conf['Remember Last Read Post'] &&
      !Conf['Desktop Notifications'] &&
      !Conf['Quote Threading']
    )) { return; }

    if (Conf['Remember Last Read Post']) {
      $.sync('Remember Last Read Post', enabled => Conf['Remember Last Read Post'] = enabled);
      this.db = new DataBoard('lastReadPosts', this.sync);
    }

    this.hr = $.el('hr', {
      id: 'unread-line',
      className: 'unread-line'
    }
    );
    this.posts = new Set();
    this.postsQuotingYou = new Set();
    this.order = new RandomAccessList();
    this.position = null;

    Callbacks.Thread.push({
      name: 'Unread',
      cb:   this.node
    });

    return Callbacks.Post.push({
      name: 'Unread',
      cb:   this.addPost
    });
  },

  node() {
    Unread.thread = this;
    Unread.title  = d.title;
    Unread.lastReadPost = Unread.db?.get({
      boardID: this.board.ID,
      threadID: this.ID
    }) || 0;
    Unread.readCount = 0;
    for (var ID of this.posts.keys) { if (+ID <= Unread.lastReadPost) { Unread.readCount++; } }
    $.one(d, '4chanXInitFinished', Unread.ready);
    $.on(d, 'PostsInserted',      Unread.onUpdate);
    $.on(d, 'ThreadUpdate',       function(e) { if (e.detail[404]) { return Unread.update(); } });
    const resetLink = $.el('a', {
      href: 'javascript:;',
      className: 'unread-reset',
      textContent: 'Mark all unread'
    }
    );
    $.on(resetLink, 'click', Unread.reset);
    return Header.menu.addEntry({
      el: resetLink,
      order: 70
    });
  },

  ready() {
    if (Conf['Remember Last Read Post'] && Conf['Scroll to Last Read Post']) { Unread.scroll(); }
    Unread.setLine(true);
    Unread.read();
    Unread.update();
    $.on(d, 'scroll visibilitychange', Unread.read);
    if (Conf['Unread Line']) { return $.on(d, 'visibilitychange',        Unread.setLine); }
  },

  positionPrev() {
    if (Unread.position) { return Unread.position.prev; } else { return Unread.order.last; }
  },

  scroll() {
    // Let the header's onload callback handle it.
    let hash;
    if ((hash = location.hash.match(/\d+/)) && hash[0] in Unread.thread.posts) { return; }

    let position = Unread.positionPrev();
    while (position) {
      var {bottom} = position.data.nodes;
      if (!bottom.getBoundingClientRect().height) {
        // Don't try to scroll to posts with display: none
        position = position.prev;
      } else {
        Header.scrollToIfNeeded(bottom, true);
        break;
      }
    }
  },

  reset() {
    if (Unread.lastReadPost == null) { return; }

    Unread.posts = new Set();
    Unread.postsQuotingYou = new Set();
    Unread.order = new RandomAccessList();
    Unread.position = null;
    Unread.lastReadPost = 0;
    Unread.readCount = 0;
    Unread.thread.posts.forEach(post => Unread.addPost.call(post));

    $.forceSync('Remember Last Read Post');
    if (Conf['Remember Last Read Post'] && (!Unread.thread.isDead || Unread.thread.isArchived)) {
      Unread.db.set({
        boardID:  Unread.thread.board.ID,
        threadID: Unread.thread.ID,
        val:      0
      });
    }

    Unread.updatePosition();
    Unread.setLine();
    return Unread.update();
  },

  sync() {
    if (Unread.lastReadPost == null) { return; }
    const lastReadPost = Unread.db.get({
      boardID: Unread.thread.board.ID,
      threadID: Unread.thread.ID,
      defaultValue: 0
    });
    if (Unread.lastReadPost >= lastReadPost) { return; }
    Unread.lastReadPost = lastReadPost;

    const postIDs = Unread.thread.posts.keys;
    for (let i = Unread.readCount, end = postIDs.length; i < end; i++) {
      var ID = +postIDs[i];
      if (!Unread.thread.posts.get(ID).isFetchedQuote) {
        if (ID > Unread.lastReadPost) { break; }
        Unread.posts.delete(ID);
        Unread.postsQuotingYou.delete(ID);
      }
      Unread.readCount++;
    }

    Unread.updatePosition();
    Unread.setLine();
    return Unread.update();
  },

  addPost() {
    if (this.isFetchedQuote || this.isClone) { return; }
    Unread.order.push(this);
    if ((this.ID <= Unread.lastReadPost) || this.isHidden || QuoteYou.isYou(this)) { return; }
    Unread.posts.add((Unread.posts.last = this.ID));
    Unread.addPostQuotingYou(this);
    return Unread.position != null ? Unread.position : (Unread.position = Unread.order[this.ID]);
  },

  addPostQuotingYou(post) {
    for (var quotelink of post.nodes.quotelinks) {
      if (QuoteYou.db?.get(Get.postDataFromLink(quotelink))) {
        Unread.postsQuotingYou.add((Unread.postsQuotingYou.last = post.ID));
        Unread.openNotification(post);
        return;
      }
    }
  },

  openNotification(post, predicate=' replied to you') {
    if (!Header.areNotificationsEnabled) { return; }
    const notif = new Notification(`${post.info.nameBlock}${predicate}`, {
      body: post.commentDisplay(),
      icon: Favicon.logo
    }
    );
    notif.onclick = function() {
      Header.scrollToIfNeeded(post.nodes.bottom, true);
      return window.focus();
    };
    return notif.onshow = () => setTimeout(() => notif.close()
    , 7 * SECOND);
  },

  onUpdate() {
    return $.queueTask(function() { // ThreadUpdater may scroll immediately after inserting posts
      Unread.setLine();
      Unread.read();
      return Unread.update();
    });
  },

  readSinglePost(post) {
    const {ID} = post;
    if (!Unread.posts.has(ID)) { return; }
    Unread.posts.delete(ID);
    Unread.postsQuotingYou.delete(ID);
    Unread.updatePosition();
    Unread.saveLastReadPost();
    return Unread.update();
  },

  read: debounce(100, function(e) {
    // Update the lastReadPost when hidden posts are added to the thread.
    if (!Unread.posts.size && (Unread.readCount !== Unread.thread.posts.keys.length)) {
      Unread.saveLastReadPost();
    }

    if (d.hidden || !Unread.posts.size) { return; }

    let count = 0;
    while (Unread.position) {
      var {ID, data} = Unread.position;
      var {bottom} = data.nodes;
      if (!!bottom.getBoundingClientRect().height && // post has been hidden
        (Header.getBottomOf(bottom) <= -1)) { break; }                      // post is completely read
      count++;
      Unread.posts.delete(ID);
      Unread.postsQuotingYou.delete(ID);
      Unread.position = Unread.position.next;
    }

    if (!count) { return; }
    Unread.updatePosition();
    Unread.saveLastReadPost();
    if (e) { return Unread.update(); }
  }),

  updatePosition() {
    while (Unread.position && !Unread.posts.has(Unread.position.ID)) {
      Unread.position = Unread.position.next;
    }
  },

  saveLastReadPost: debounce(2 * SECOND, function() {
    let ID;
    $.forceSync('Remember Last Read Post');
    if (!Conf['Remember Last Read Post'] || !Unread.db) { return; }
    const postIDs = Unread.thread.posts.keys;
    for (let i = Unread.readCount, end = postIDs.length; i < end; i++) {
      ID = +postIDs[i];
      if (!Unread.thread.posts.get(ID).isFetchedQuote) {
        if (Unread.posts.has(ID)) { break; }
        Unread.lastReadPost = ID;
      }
      Unread.readCount++;
    }
    if (Unread.thread.isDead && !Unread.thread.isArchived) { return; }
    return Unread.db.set({
      boardID:  Unread.thread.board.ID,
      threadID: Unread.thread.ID,
      val:      Unread.lastReadPost
    });
  }),

  setLine(force) {
    if (!Conf['Unread Line']) { return; }
    if (Unread.hr.hidden || d.hidden || (force === true)) {
      const oldPosition = Unread.linePosition;
      if (Unread.linePosition = Unread.positionPrev()) {
        if (Unread.linePosition !== oldPosition) {
          let node = Unread.linePosition.data.nodes.bottom;
          if (node.nextSibling?.tagName === 'BR') { node = node.nextSibling; }
          $.after(node, Unread.hr);
        }
      } else {
        $.rm(Unread.hr);
      }
    }
    return Unread.hr.hidden = Unread.linePosition === Unread.order.last;
  },

  update() {
    const count = Unread.posts.size;
    const countQuotingYou = Unread.postsQuotingYou.size;

    if (Conf['Unread Count']) {
      const titleQuotingYou = Conf['Quoted Title'] && countQuotingYou ? '(!) ' : '';
      const titleCount = count || !Conf['Hide Unread Count at (0)'] ? `(${count}) ` : '';
      const titleDead = Unread.thread.isDead ?
        Unread.title.replace('-', (Unread.thread.isArchived ? '- Archived -' : '- 404 -'))
      :
        Unread.title;
      d.title = `${titleQuotingYou}${titleCount}${titleDead}`;
    }

    Unread.saveThreadWatcherCount();

    if (Conf['Unread Favicon'] && (g.SITE.software === 'yotsuba')) {
      const {isDead} = Unread.thread;
      return Favicon.set((
        countQuotingYou ?
          (isDead ? 'unreadDeadY' : 'unreadY')
        : count ?
          (isDead ? 'unreadDead' : 'unread')
        :
          (isDead ? 'dead' : 'default')
      )
      );
    }
  },

  saveThreadWatcherCount: debounce(2 * SECOND, function() {
    $.forceSync('Remember Last Read Post');
    if (Conf['Remember Last Read Post'] && (!Unread.thread.isDead || Unread.thread.isArchived)) {
      let posts;
      const quotingYou = !Conf['Require OP Quote Link'] && QuoteYou.isYou(Unread.thread.OP) ? Unread.posts : Unread.postsQuotingYou;
      if (!quotingYou.size) {
        quotingYou.last = 0;
      } else if (!quotingYou.has(quotingYou.last)) {
        quotingYou.last = 0;
        posts = Unread.thread.posts.keys;
        for (let i = posts.length - 1; i >= 0; i--) {
          if (quotingYou.has(+posts[i])) {
            quotingYou.last = posts[i];
            break;
          }
        }
      }
      return ThreadWatcher.update(g.SITE.ID, Unread.thread.board.ID, Unread.thread.ID, {
        last: Unread.thread.lastPost,
        isDead: Unread.thread.isDead,
        isArchived: Unread.thread.isArchived,
        unread: Unread.posts.size,
        quotingYou: (quotingYou.last || 0)
      }
      );
    }
  })
};
export default Unread;
