/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var PostHiding = {
  init() {
    if (!['index', 'thread'].includes(g.VIEW) || (!Conf['Reply Hiding Buttons'] && !(Conf['Menu'] && Conf['Reply Hiding Link']))) { return; }

    if (Conf['Reply Hiding Buttons']) {
      $.addClass(doc, "reply-hide");
    }

    this.db = new DataBoard('hiddenPosts');
    return Callbacks.Post.push({
      name: 'Reply Hiding',
      cb:   this.node
    });
  },

  isHidden(boardID, threadID, postID) {
    return !!(PostHiding.db && PostHiding.db.get({boardID, threadID, postID}));
  },

  node() {
    let data, sa;
    if (!this.isReply || this.isClone || this.isFetchedQuote) { return; }

    if (data = PostHiding.db.get({boardID: this.board.ID, threadID: this.thread.ID, postID: this.ID})) {
      if (data.thisPost) {
        PostHiding.hide(this, data.makeStub, data.hideRecursively);
      } else {
        Recursive.apply(PostHiding.hide, this, data.makeStub, true);
        Recursive.add(PostHiding.hide, this, data.makeStub, true);
      }
    }

    if (!Conf['Reply Hiding Buttons']) { return; }

    const button = PostHiding.makeButton(this, 'hide');
    if (sa = g.SITE.selectors.sideArrows) {
      const sideArrows = $(sa, this.nodes.root);
      $.replace(sideArrows.firstChild, button);
      return sideArrows.className = 'replacedSideArrows';
    } else {
      return $.prepend(this.nodes.info, button);
    }
  },

  menu: {
    init() {
      if (!['index', 'thread'].includes(g.VIEW) || !Conf['Menu'] || !Conf['Reply Hiding Link']) { return; }

      // Hide
      let div = $.el('div', {
        className: 'hide-reply-link',
        textContent: 'Hide'
      }
      );

      let apply = $.el('a', {
        textContent: 'Apply',
        href: 'javascript:;'
      }
      );
      $.on(apply, 'click', PostHiding.menu.hide);

      let thisPost = UI.checkbox('thisPost', 'This post',    true);
      let replies  = UI.checkbox('replies',  'Hide replies', Conf['Recursive Hiding']);
      const makeStub = UI.checkbox('makeStub', 'Make stub',    Conf['Stubs']);

      Menu.menu.addEntry({
        el: div,
        order: 20,
        open(post) {
          if (!post.isReply || post.isClone || post.isHidden) {
            return false;
          }
          PostHiding.menu.post = post;
          return true;
        },
        subEntries: [
            {el: apply}
          ,
            {el: thisPost}
          ,
            {el: replies}
          ,
            {el: makeStub}
        ]});

      // Show
      div = $.el('div', {
        className: 'show-reply-link',
        textContent: 'Show'
      }
      );

      apply = $.el('a', {
        textContent: 'Apply',
        href: 'javascript:;'
      }
      );
      $.on(apply, 'click', PostHiding.menu.show);

      thisPost = UI.checkbox('thisPost', 'This post',    false);
      replies  = UI.checkbox('replies',  'Show replies', false);
      const hideStubLink = $.el('a', {
        textContent: 'Hide stub',
        href: 'javascript:;'
      }
      );
      $.on(hideStubLink, 'click', PostHiding.menu.hideStub);

      Menu.menu.addEntry({
        el: div,
        order: 20,
        open(post) {
          let data;
          if (!post.isReply || post.isClone || !post.isHidden) {
            return false;
          }
          if (!(data = PostHiding.db.get({boardID: post.board.ID, threadID: post.thread.ID, postID: post.ID}))) {
            return false;
          }
          PostHiding.menu.post = post;
          thisPost.firstChild.checked = post.isHidden;
          replies.firstChild.checked  = (data?.hideRecursively != null) ? data.hideRecursively : Conf['Recursive Hiding'];
          return true;
        },
        subEntries: [
            {el: apply}
          ,
            {el: thisPost}
          ,
            {el: replies}
        ]});

      return Menu.menu.addEntry({
        el: hideStubLink,
        order: 15,
        open(post) {
          let data;
          if (!post.isReply || post.isClone || !post.isHidden) {
            return false;
          }
          if (!(data = PostHiding.db.get({boardID: post.board.ID, threadID: post.thread.ID, postID: post.ID}))) {
            return false;
          }
          return PostHiding.menu.post = post;
        }
      });
    },

    hide() {
      const parent   = this.parentNode;
      const thisPost = $('input[name=thisPost]', parent).checked;
      const replies  = $('input[name=replies]',  parent).checked;
      const makeStub = $('input[name=makeStub]', parent).checked;
      const {post}   = PostHiding.menu;
      if (thisPost) {
        PostHiding.hide(post, makeStub, replies);
      } else if (replies) {
        Recursive.apply(PostHiding.hide, post, makeStub, true);
        Recursive.add(PostHiding.hide, post, makeStub, true);
      } else {
        return;
      }
      PostHiding.saveHiddenState(post, true, thisPost, makeStub, replies);
      return $.event('CloseMenu');
    },

    show() {
      let data;
      const parent   = this.parentNode;
      const thisPost = $('input[name=thisPost]', parent).checked;
      const replies  = $('input[name=replies]',  parent).checked;
      const {post}   = PostHiding.menu;
      if (thisPost) {
        PostHiding.show(post, replies);
      } else if (replies) {
        Recursive.apply(PostHiding.show, post, true);
        Recursive.rm(PostHiding.hide, post, true);
      } else {
        return;
      }
      if (data = PostHiding.db.get({boardID: post.board.ID, threadID: post.thread.ID, postID: post.ID})) {
        PostHiding.saveHiddenState(post, !(thisPost && replies), !thisPost, data.makeStub, !replies);
      }
      return $.event('CloseMenu');
    },
    hideStub() {
      let data;
      const {post} = PostHiding.menu;
      if (data = PostHiding.db.get({boardID: post.board.ID, threadID: post.thread.ID, postID: post.ID})) {
        PostHiding.show(post, data.hideRecursively);
        PostHiding.hide(post, false, data.hideRecursively);
        PostHiding.saveHiddenState(post, true, true, false, data.hideRecursively);
      }
      $.event('CloseMenu');
    }
  },

  makeButton(post, type) {
    const span = $.el('span', {
      className:   `fa fa-${type === 'hide' ? 'minus' : 'plus'}-square-o`,
      textContent: ""
    }
    );
    const a = $.el('a', {
      className: `${type}-reply-button`,
      href:      'javascript:;'
    }
    );
    $.add(a, span);
    $.on(a, 'click', PostHiding.toggle);
    return a;
  },

  saveHiddenState(post, isHiding, thisPost, makeStub, hideRecursively) {
    const data = {
      boardID:  post.board.ID,
      threadID: post.thread.ID,
      postID:   post.ID
    };
    if (isHiding) {
      data.val = {
        thisPost: thisPost !== false, // undefined -> true
        makeStub,
        hideRecursively
      };
      return PostHiding.db.set(data);
    } else {
      return PostHiding.db.delete(data);
    }
  },

  toggle() {
    const post = Get.postFromNode(this);
    PostHiding[(post.isHidden ? 'show' : 'hide')](post); 
    return PostHiding.saveHiddenState(post, post.isHidden);
  },

  hide(post, makeStub=Conf['Stubs'], hideRecursively=Conf['Recursive Hiding']) {
    if (post.isHidden) { return; }
    post.isHidden = true;

    if (hideRecursively) {
      Recursive.apply(PostHiding.hide, post, makeStub, true);
      Recursive.add(PostHiding.hide, post, makeStub, true);
    }

    for (var quotelink of Get.allQuotelinksLinkingTo(post)) {
      $.addClass(quotelink, 'filtered');
    }

    if (!makeStub) {
      post.nodes.root.hidden = true;
      return;
    }

    const a = PostHiding.makeButton(post, 'show');
    $.add(a, $.tn(` ${post.info.nameBlock}`));
    post.nodes.stub = $.el('div',
      {className: 'stub'});
    $.add(post.nodes.stub, a);
    if (Conf['Menu']) {
      $.add(post.nodes.stub, Menu.makeButton(post));
    }
    return $.prepend(post.nodes.root, post.nodes.stub);
  },

  show(post, showRecursively=Conf['Recursive Hiding']) {
    if (post.nodes.stub) {
      $.rm(post.nodes.stub);
      delete post.nodes.stub;
    } else {
      post.nodes.root.hidden = false;
    }
    post.isHidden = false;
    if (showRecursively) {
      Recursive.apply(PostHiding.show, post, true);
      Recursive.rm(PostHiding.hide, post);
    }
    for (var quotelink of Get.allQuotelinksLinkingTo(post)) {
      $.rmClass(quotelink, 'filtered');
    }
  }
};
