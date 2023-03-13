/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var Get = {
  url(type, IDs, ...args) {
    let f, site;
    if ((site = g.sites[IDs.siteID]) && (f = $.getOwn(site.urls, type))) {
      return f(IDs, ...Array.from(args));
    } else {
      return undefined;
    }
  },
  threadExcerpt(thread) {
    const {OP} = thread;
    const excerpt = (`/${decodeURIComponent(thread.board.ID)}/ - `) + (
      OP.info.subject?.trim() ||
      OP.commentDisplay().replace(/\n+/g, ' // ') ||
      OP.file?.name ||
      `No.${OP}`);
    if (excerpt.length > 73) { return `${excerpt.slice(0, 70)}...`; }
    return excerpt;
  },
  threadFromRoot(root) {
    if (root == null) { return null; }
    const {board} = root.dataset;
    return g.threads.get(`${board ? encodeURIComponent(board) : g.BOARD.ID}.${root.id.match(/\d*$/)[0]}`);
  },
  threadFromNode(node) {
    return Get.threadFromRoot($.x(`ancestor-or-self::${g.SITE.xpath.thread}`, node));
  },
  postFromRoot(root) {
    if (root == null) { return null; }
    const post  = g.posts.get(root.dataset.fullID);
    const index = root.dataset.clone;
    if (index) { return post.clones[+index]; } else { return post; }
  },
  postFromNode(root) {
    return Get.postFromRoot($.x(`ancestor-or-self::${g.SITE.xpath.postContainer}[1]`, root));
  },
  postDataFromLink(link) {
    let boardID, postID, threadID;
    if (link.dataset.postID) { // resurrected quote
      ({boardID, threadID, postID} = link.dataset);
      if (!threadID) { threadID = 0; }
    } else {
      const match = link.href.match(g.SITE.regexp.quotelink);
      [boardID, threadID, postID] = Array.from(match.slice(1));
      if (!postID) { postID = threadID; }
    }
    return {
      boardID,
      threadID: +threadID,
      postID:   +postID
    };
  },
  allQuotelinksLinkingTo(post) {
    // Get quotelinks & backlinks linking to the given post.
    const quotelinks = [];
    const {posts} = g;
    const {fullID} = post;
    const handleQuotes = function(qPost, type) {
      quotelinks.push(...Array.from(qPost.nodes[type] || []));
      for (var clone of qPost.clones) { quotelinks.push(...Array.from(clone.nodes[type] || [])); }
    };
    // First:
    //   In every posts,
    //   if it did quote this post,
    //   get all their backlinks.
    posts.forEach(function(qPost) {
      if (qPost.quotes.includes(fullID)) {
        return handleQuotes(qPost, 'quotelinks');
      }
    });

    // Second:
    //   If we have quote backlinks:
    //   in all posts this post quoted
    //   and their clones,
    //   get all of their backlinks.
    if (Conf['Quote Backlinks']) {
      for (var quote of post.quotes) { var qPost;
      if ((qPost = posts.get(quote))) { handleQuotes(qPost, 'backlinks'); } }
    }

    // Third:
    //   Filter out irrelevant quotelinks.
    return quotelinks.filter(function(quotelink) {
      const {boardID, postID} = Get.postDataFromLink(quotelink);
      return (boardID === post.board.ID) && (postID === post.ID);
    });
  }
};
