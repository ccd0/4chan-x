import Callbacks from "../classes/Callbacks";
import RandomAccessList from "../classes/RandomAccessList";
import Header from "../General/Header";
import { Conf, d, g } from "../globals/globals";
import ReplyPruning from "../Monitoring/ReplyPruning";
import Unread from "../Monitoring/Unread";
import $ from "../platform/$";
import { dict } from "../platform/helpers";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  <3 aeosynth
*/

var QuoteThreading = {
  init() {
    if (!Conf['Quote Threading'] || (g.VIEW !== 'thread')) { return; }

    this.controls = $.el('label',
      {innerHTML: "<input id=\"threadingControl\" name=\"Thread Quotes\" type=\"checkbox\"> Threading"});

    this.threadNewLink = $.el('span', {
      className: 'brackets-wrap threadnewlink',
      hidden: true
    }
    );
    $.extend(this.threadNewLink, {innerHTML: "<a href=\"javascript:;\">Thread New Posts</a>"});

    this.input = $('input', this.controls);
    this.input.checked = Conf['Thread Quotes'];

    $.on(this.input, 'change', this.setEnabled);
    $.on(this.input, 'change', this.rethread);
    $.on(this.threadNewLink.firstElementChild, 'click', this.rethread);
    $.on(d, '4chanXInitFinished', () => { return this.ready = true; });

    Header.menu.addEntry(this.entry = {
      el:    this.controls,
      order: 99
    }
    );

    Callbacks.Thread.push({
      name: 'Quote Threading',
      cb:   this.setThread
    });

    return Callbacks.Post.push({
      name: 'Quote Threading',
      cb:   this.node
    });
  },

  parent:   dict(),
  children: dict(),
  inserted: dict(),

  toggleThreading() {
    return this.setThreadingState(!Conf['Thread Quotes']);
  },

  setThreadingState(enabled) {
    this.input.checked = enabled;
    this.setEnabled.call(this.input);
    return this.rethread.call(this.input);
  },

  setEnabled() {
    if (this.checked) {
      $.set('Prune All Threads', false);
      const other = ReplyPruning.inputs?.enabled;
      if (other?.checked) {
        other.checked = false;
        $.event('change', null, other);
      }
    }
    return $.cb.checked.call(this);
  },

  setThread() {
    QuoteThreading.thread = this;
    return $.asap((() => !Conf['Thread Updater'] || $('.navLinksBot > .updatelink')), function() {
      let navLinksBot;
      if (navLinksBot = $('.navLinksBot')) { return $.add(navLinksBot, [$.tn(' '), QuoteThreading.threadNewLink]); }
    });
  },

  node() {
    let parent;
    if (this.isFetchedQuote || this.isClone || !this.isReply) { return; }

    const parents = new Set();
    let lastParent = null;
    for (var quote of this.quotes) {
      if ((parent = g.posts.get(quote))) {
        if (!parent.isFetchedQuote && parent.isReply && (parent.ID < this.ID)) {
          parents.add(parent.ID);
          if (!lastParent || (parent.ID > lastParent.ID)) { lastParent = parent; }
        }
      }
    }

    if (!lastParent) { return; }

    let ancestor = lastParent;
    while ((ancestor = QuoteThreading.parent[ancestor.fullID])) {
      parents.delete(ancestor.ID);
    }

    if (parents.size === 1) {
      return QuoteThreading.parent[this.fullID] = lastParent;
    }
  },

  descendants(post) {
    let children;
    let posts = [post];
    if (children = QuoteThreading.children[post.fullID]) {
      for (var child of children) {
        posts = posts.concat(QuoteThreading.descendants(child));
      }
    }
    return posts;
  },

  insert(post) {
    let parent, x;
    if (!(
      Conf['Thread Quotes'] &&
      (parent = QuoteThreading.parent[post.fullID]) &&
      !QuoteThreading.inserted[post.fullID]
    )) { return false; }

    const descendants = QuoteThreading.descendants(post);
    if (!Unread.posts.has(parent.ID)) {
      if ((function() { for (var x of descendants) { if (Unread.posts.has(x.ID)) { return true; } } })()) {
        QuoteThreading.threadNewLink.hidden = false;
        return false;
      }
    }

    const {order} = Unread;
    const children = (QuoteThreading.children[parent.fullID] || (QuoteThreading.children[parent.fullID] = []));
    const threadContainer = parent.nodes.threadContainer || $.el('div', {className: 'threadContainer'});
    const nodes = [post.nodes.root];
    if (post.nodes.threadContainer) { nodes.push(post.nodes.threadContainer); }

    let i = children.length;
    for (let j = children.length - 1; j >= 0; j--) { var child = children[j]; if (child.ID >= post.ID) { i--; } }
    if (i !== children.length) {
      const next = children[i];
      for (x of descendants) { order.before(order[next.ID], order[x.ID]); }
      children.splice(i, 0, post);
      $.before(next.nodes.root, nodes);
    } else {
      let prev2;
      let prev = parent;
      while ((prev2 = QuoteThreading.children[prev.fullID]) && prev2.length) {
        prev = prev2[prev2.length-1];
      }
      for (let k = descendants.length - 1; k >= 0; k--) { x = descendants[k]; order.after(order[prev.ID], order[x.ID]); }
      children.push(post);
      $.add(threadContainer, nodes);
    }

    QuoteThreading.inserted[post.fullID] = true;

    if (!parent.nodes.threadContainer) {
      parent.nodes.threadContainer = threadContainer;
      $.addClass(parent.nodes.root, 'threadOP');
      $.after(parent.nodes.root, threadContainer);
    }

    return true;
  },

  rethread() {
    if (!QuoteThreading.ready) { return; }
    const {thread} = QuoteThreading;
    const {posts} = thread;

    QuoteThreading.threadNewLink.hidden = true;

    if (Conf['Thread Quotes']) {
      posts.forEach(QuoteThreading.insert);
    } else {
      const nodes = [];
      Unread.order = new RandomAccessList();
      QuoteThreading.inserted = dict();
      posts.forEach(function(post) {
        if (post.isFetchedQuote) { return; }
        Unread.order.push(post);
        if (post.isReply) { nodes.push(post.nodes.root); }
        if (QuoteThreading.children[post.fullID]) {
          delete QuoteThreading.children[post.fullID];
          $.rmClass(post.nodes.root, 'threadOP');
          $.rm(post.nodes.threadContainer);
          return delete post.nodes.threadContainer;
        }
      });
      $.add(thread.nodes.root, nodes);
    }

    Unread.position = Unread.order.first;
    Unread.updatePosition();
    Unread.setLine(true);
    Unread.read();
    return Unread.update();
  }
};
export default QuoteThreading;
