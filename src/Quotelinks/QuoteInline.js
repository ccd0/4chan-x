import Callbacks from "../classes/Callbacks";
import Fetcher from "../classes/Fetcher";
import Get from "../General/Get";
import { g, Conf, doc } from "../globals/globals";
import ExpandComment from "../Miscellaneous/ExpandComment";
import Unread from "../Monitoring/Unread";
import $ from "../platform/$";

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var QuoteInline = {
  init() {
    if (!['index', 'thread'].includes(g.VIEW) || !Conf['Quote Inlining']) { return; }

    if (Conf['Comment Expansion']) {
      ExpandComment.callbacks.push(this.node);
    }

    return Callbacks.Post.push({
      name: 'Quote Inlining',
      cb:   this.node
    });
  },

  node() {
    const {process} = QuoteInline;
    const {isClone} = this;
    for (var link of this.nodes.quotelinks.concat([...Array.from(this.nodes.backlinks)], this.nodes.archivelinks)) {
      process(link, isClone);
    }
  },

  process(link, clone) {
    if (Conf['Quote Hash Navigation']) {
      if (!clone) { $.after(link, QuoteInline.qiQuote(link, $.hasClass(link, 'filtered'))); }
    }
    return $.on(link, 'click', QuoteInline.toggle);
  },

  qiQuote(link, hidden) {
    let name = "hashlink";
    if (hidden) { name += " filtered"; }
    return $.el('a', {
      className: name,
      textContent: '#',
      href: link.href
    }
    );
  },

  toggle(e) {
    if ($.modifiedClick(e)) { return; }

    const {boardID, threadID, postID} = Get.postDataFromLink(this);
    if (Conf['Inline Cross-thread Quotes Only'] && (g.VIEW === 'thread') && g.posts.get(`${boardID}.${postID}`)?.nodes.root.offsetParent) { return; } // exists and not hidden
    if ($.hasClass(doc, 'catalog-mode')) { return; }

    e.preventDefault();
    const quoter = Get.postFromNode(this);
    const {context} = quoter;
    if ($.hasClass(this, 'inlined')) {
      QuoteInline.rm(this, boardID, threadID, postID, context);
    } else {
      if ($.x(`ancestor::div[@data-full-i-d='${boardID}.${postID}']`, this)) { return; }
      QuoteInline.add(this, boardID, threadID, postID, context, quoter);
    }
    return this.classList.toggle('inlined');
  },

  findRoot(quotelink, isBacklink) {
    if (isBacklink) {
      return $.x('ancestor::*[parent::*[contains(@class,"post")]][1]', quotelink);
    } else {
      return $.x('ancestor-or-self::*[parent::blockquote][1]', quotelink);
    }
  },

  add(quotelink, boardID, threadID, postID, context, quoter) {
    let post;
    const isBacklink = $.hasClass(quotelink, 'backlink');
    const inline = $.el('div',
      {className: 'inline'});
    inline.dataset.fullID = `${boardID}.${postID}`;
    const root = QuoteInline.findRoot(quotelink, isBacklink);
    $.after(root, inline);

    const qroot = $.x('ancestor::*[contains(@class,"postContainer")][1]', root);

    $.addClass(qroot, 'hasInline');
    new Fetcher(boardID, threadID, postID, inline, quoter);

    if (!(
      (post = g.posts.get(`${boardID}.${postID}`)) &&
      (context.thread === post.thread)
    )) { return; }

    // Hide forward post if it's a backlink of a post in this thread.
    // Will only unhide if there's no inlined backlinks of it anymore.
    if (isBacklink && Conf['Forward Hiding']) {
      $.addClass(post.nodes.root, 'forwarded');
      post.forwarded++ || (post.forwarded = 1);
    }

    // Decrease the unread count if this post
    // is in the array of unread posts.
    if (!Unread.posts) { return; }
    return Unread.readSinglePost(post);
  },

  rm(quotelink, boardID, threadID, postID, context) {
    let el;
    let inlined;
    const isBacklink = $.hasClass(quotelink, 'backlink');
    // Select the corresponding inlined quote, and remove it.
    let root = QuoteInline.findRoot(quotelink, isBacklink);
    root = $.x(`following-sibling::div[@data-full-i-d='${boardID}.${postID}'][1]`, root);
    const qroot = $.x('ancestor::*[contains(@class,"postContainer")][1]', root);
    const {parentNode} = root;
    $.rm(root);
    $.event('PostsRemoved', null, parentNode);

    if (!$('.inline', qroot)) {
      $.rmClass(qroot, 'hasInline');
    }

    // Stop if it only contains text.
    if (!(el = root.firstElementChild)) { return; }

    // Dereference clone.
    const post = g.posts.get(`${boardID}.${postID}`);
    post.rmClone(el.dataset.clone);

    // Decrease forward count and unhide.
    if (Conf['Forward Hiding'] &&
      isBacklink &&
      (context.thread === g.threads.get(`${boardID}.${threadID}`)) &&
      !--post.forwarded) {
        delete post.forwarded;
        $.rmClass(post.nodes.root, 'forwarded');
      }

    // Repeat.
    while ((inlined = $('.inlined', el))) {
      ({boardID, threadID, postID} = Get.postDataFromLink(inlined));
      QuoteInline.rm(inlined, boardID, threadID, postID, context);
      $.rmClass(inlined, 'inlined');
    }
  }
};
export default QuoteInline;
