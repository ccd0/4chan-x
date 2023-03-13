/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var QuoteYou = {
  init() {
    if (!Conf['Remember Your Posts']) { return; }

    this.db = new DataBoard('yourPosts');
    $.sync('Remember Your Posts', enabled => Conf['Remember Your Posts'] = enabled);
    $.on(d, 'QRPostSuccessful', function(e) {
      const cb = PostRedirect.delay();
      return $.get('Remember Your Posts', Conf['Remember Your Posts'], function(items) {
        if (!items['Remember Your Posts']) { return; }
        const {boardID, threadID, postID} = e.detail;
        return QuoteYou.db.set({boardID, threadID, postID, val: true}, cb);
      });
    });

    if (!['index', 'thread', 'archive'].includes(g.VIEW)) { return; }

    if (Conf['Highlight Own Posts']) {
      $.addClass(doc, 'highlight-own');
    }

    if (Conf['Highlight Posts Quoting You']) {
      $.addClass(doc, 'highlight-you');
    }

    if (Conf['Comment Expansion']) {
      ExpandComment.callbacks.push(this.node);
    }

    // \u00A0 is nbsp
    this.mark = $.el('span', {
      textContent: '\u00A0(You)',
      className:   'qmark-you'
    }
    );
    Callbacks.Post.push({
      name: 'Mark Quotes of You',
      cb:   this.node
    });

    return QuoteYou.menu.init();
  },

  isYou(post) {
    return !!QuoteYou.db?.get({
      boardID:  post.boardID,
      threadID: post.threadID,
      postID:   post.ID
    });
  },

  node() {
    if (this.isClone) { return; }

    if (QuoteYou.isYou(this)) {
      $.addClass(this.nodes.root, 'yourPost');
    }

    // Stop there if there's no quotes in that post.
    if (!this.quotes.length) { return; }

    for (var quotelink of this.nodes.quotelinks) {
      if (QuoteYou.db.get(Get.postDataFromLink(quotelink))) {
        if (Conf['Mark Quotes of You']) { $.add(quotelink, QuoteYou.mark.cloneNode(true)); }
        $.addClass(quotelink, 'you');
        $.addClass(this.nodes.root, 'quotesYou');
      }
    }
  },

  menu: {
    init() {
      const label = $.el('label',
        {className: 'toggle-you'}
      ,
        {innerHTML: '<input type="checkbox"> You'});
      const input = $('input', label);
      $.on(input, 'change', QuoteYou.menu.toggle);
      return Menu.menu?.addEntry({
        el: label,
        order: 80,
        open(post) {
          QuoteYou.menu.post = (post.origin || post);
          input.checked = QuoteYou.isYou(post);
          return true;
        }
      });
    },

    toggle() {
      const {post} = QuoteYou.menu;
      const data = {boardID: post.board.ID, threadID: post.thread.ID, postID: post.ID, val: true};
      if (this.checked) {
        QuoteYou.db.set(data);
      } else {
        QuoteYou.db.delete(data);
      }
      for (var clone of [post].concat(post.clones)) {
        clone.nodes.root.classList.toggle('yourPost', this.checked);
      }
      for (var quotelink of Get.allQuotelinksLinkingTo(post)) {
        if (this.checked) {
          if (Conf['Mark Quotes of You']) { $.add(quotelink, QuoteYou.mark.cloneNode(true)); }
        } else {
          $.rm($('.qmark-you', quotelink));
        }
        quotelink.classList.toggle('you', this.checked);
        if ($.hasClass(quotelink, 'quotelink')) {
          var quoter = Get.postFromNode(quotelink).nodes.root;
          quoter.classList.toggle('quotesYou', !!$('.quotelink.you', quoter));
        }
      }
    }
  },

  cb: {
    seek(type) {
      let highlighted, post;
      let result;
      const {highlight} = g.SITE.classes;
      if (highlighted = $(`.${highlight}`)) { $.rmClass(highlighted, highlight); }

      if (!QuoteYou.lastRead || !doc.contains(QuoteYou.lastRead) || !$.hasClass(QuoteYou.lastRead, 'quotesYou')) {
        if (!(post = (QuoteYou.lastRead = $('.quotesYou')))) {
          new Notice('warning', 'No posts are currently quoting you, loser.', 20);
          return;
        }
        if (QuoteYou.cb.scroll(post)) { return; }
      } else {
        post = QuoteYou.lastRead;
      }

      const str = `${type}::div[contains(@class,'quotesYou')]`;

      while (post = (result = $.X(str, post)).snapshotItem(type === 'preceding' ? result.snapshotLength - 1 : 0)) {
        if (QuoteYou.cb.scroll(post)) { return; }
      }

      const posts = $$('.quotesYou');
      return QuoteYou.cb.scroll(posts[type === 'following' ? 0 : posts.length - 1]);
    },

    scroll(root) {
      const post = Get.postFromRoot(root);
      if (!post.nodes.post.getBoundingClientRect().height) {
        return false;
      } else {
        QuoteYou.lastRead = root;
        location.href = Get.url('post', post);
        Header.scrollTo(post.nodes.post);
        if (post.isReply) {
          const sel = `${g.SITE.selectors.postContainer}${g.SITE.selectors.highlightable.reply}`;
          let node = post.nodes.root;
          if (!node.matches(sel)) { node = $(sel, node); }
          $.addClass(node, g.SITE.classes.highlight);
        }
        return true;
      }
    }
  }
};
