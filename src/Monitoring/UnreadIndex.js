import Callbacks from "../classes/Callbacks";
import DataBoard from "../classes/DataBoard";
import Get from "../General/Get";
import Header from "../General/Header";
import Index from "../General/Index";
import { g, Conf, d } from "../globals/globals";
import ExpandThread from "../Miscellaneous/ExpandThread";
import $ from "../platform/$";
import { dict } from "../platform/helpers";
import QuoteYou from "../Quotelinks/QuoteYou";
import ThreadWatcher from "./ThreadWatcher";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var UnreadIndex = {
  lastReadPost: dict(),
  hr:           dict(),
  markReadLink: dict(),

  init() {
    if ((g.VIEW !== 'index') || !Conf['Remember Last Read Post'] || !Conf['Unread Line in Index']) { return; }

    this.enabled = true;
    this.db = new DataBoard('lastReadPosts', this.sync);

    Callbacks.Thread.push({
      name: 'Unread Line in Index',
      cb:   this.node
    });

    $.on(d, 'IndexRefreshInternal', this.onIndexRefresh);
    return $.on(d, 'PostsInserted PostsRemoved', this.onPostsInserted);
  },

  node() {
    UnreadIndex.lastReadPost[this.fullID] = UnreadIndex.db.get({
      boardID: this.board.ID,
      threadID: this.ID
    }) || 0;
    if (!Index.enabled) { // let onIndexRefresh handle JSON Index
      return UnreadIndex.update(this);
    }
  },

  onIndexRefresh(e) {
    if (e.detail.isCatalog) { return; }
    return (() => {
      const result = [];
      for (var threadID of e.detail.threadIDs) {
        var thread = g.threads.get(threadID);
        result.push(UnreadIndex.update(thread));
      }
      return result;
    })();
  },

  onPostsInserted(e) {
    if (e.target === Index.root) { return; } // onIndexRefresh handles this case
    const thread = Get.threadFromNode(e.target);
    if (!thread || (thread.nodes.root !== e.target)) { return; }
    const wasVisible = !!UnreadIndex.hr[thread.fullID]?.parentNode;
    UnreadIndex.update(thread);
    if (Conf['Scroll to Last Read Post'] && (e.type === 'PostsInserted') && !wasVisible && !!UnreadIndex.hr[thread.fullID]?.parentNode) {
      return Header.scrollToIfNeeded(UnreadIndex.hr[thread.fullID], true);
    }
  },

  sync() {
    return g.threads.forEach(function(thread) {
      const lastReadPost = UnreadIndex.db.get({
        boardID: thread.board.ID,
        threadID: thread.ID
      }) || 0;
      if (lastReadPost !== UnreadIndex.lastReadPost[thread.fullID]) {
        UnreadIndex.lastReadPost[thread.fullID] = lastReadPost;
        if (thread.nodes.root?.parentNode) {
          return UnreadIndex.update(thread);
        }
      }
    });
  },

  update(thread) {
    let divider;
    const lastReadPost = UnreadIndex.lastReadPost[thread.fullID];
    let repliesShown = 0;
    let repliesRead = 0;
    let firstUnread = null;
    thread.posts.forEach(function(post) {
      if (post.isReply && thread.nodes.root.contains(post.nodes.root)) {
        repliesShown++;
        if (post.ID <= lastReadPost) {
          return repliesRead++;
        } else if ((!firstUnread || (post.ID < firstUnread.ID)) && !post.isHidden && !QuoteYou.isYou(post)) {
          return firstUnread = post;
        }
      }
    });

    let hr = UnreadIndex.hr[thread.fullID];
    if (firstUnread && (repliesRead || ((lastReadPost === thread.OP.ID) && (!$(g.SITE.selectors.summary, thread.nodes.root) || thread.ID in ExpandThread.statuses)))) {
      if (!hr) {
        hr = (UnreadIndex.hr[thread.fullID] = $.el('hr',
          {className: 'unread-line'}));
      }
      $.before(firstUnread.nodes.root, hr);
    } else {
      $.rm(hr);
    }

    const hasUnread = repliesShown ?
      firstUnread || !repliesRead
    : Index.enabled ?
      thread.lastPost > lastReadPost
    :
      thread.OP.ID > lastReadPost;
    thread.nodes.root.classList.toggle('unread-thread', hasUnread);

    let link = UnreadIndex.markReadLink[thread.fullID];
    if (!link) {
      link = (UnreadIndex.markReadLink[thread.fullID] = $.el('a', {
        className: 'unread-mark-read brackets-wrap',
        href: 'javascript:;',
        textContent: 'Mark Read'
      }
      ));
      $.on(link, 'click', UnreadIndex.markRead);
    }
    if (divider = $(g.SITE.selectors.threadDivider, thread.nodes.root)) { // divider inside thread as in Tinyboard
      return $.before(divider, link);
    } else {
      return $.add(thread.nodes.root, link);
    }
  },

  markRead() {
    const thread = Get.threadFromNode(this);
    UnreadIndex.lastReadPost[thread.fullID] = thread.lastPost;
    UnreadIndex.db.set({
      boardID:  thread.board.ID,
      threadID: thread.ID,
      val:      thread.lastPost
    });
    $.rm(UnreadIndex.hr[thread.fullID]);
    thread.nodes.root.classList.remove('unread-thread');
    return ThreadWatcher.update(g.SITE.ID, thread.board.ID, thread.ID, {
      last: thread.lastPost,
      unread: 0,
      quotingYou: 0
    }
    );
  }
};
export default UnreadIndex;
