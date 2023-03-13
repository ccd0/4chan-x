/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class Post {
  static initClass() {
  
    this.deadMark =
      // \u00A0 is nbsp
      $.el('span', {
        textContent: '\u00A0(Dead)',
        className:   'qmark-dead'
      }
      );
  }
  toString() { return this.ID; }

  constructor(root, thread, board, flags={}) {
    // <% if (readJSON('/.tests_enabled')) { %>
    // @normalizedOriginal = Test.normalize root
    // <% } %>

    this.thread = thread;
    this.board = board;
    $.extend(this, flags);
    this.ID       = +root.id.match(/\d*$/)[0];
    this.postID   = this.ID;
    this.threadID = this.thread.ID;
    this.boardID  = this.board.ID;
    this.siteID   = g.SITE.ID;
    this.fullID   = `${this.board}.${this.ID}`;
    this.context  = this;
    this.isReply  = (this.ID !== this.threadID);

    root.dataset.fullID = this.fullID;

    this.nodes = this.parseNodes(root);

    if (!this.isReply) {
      this.thread.OP = this;
      for (var key of ['isSticky', 'isClosed', 'isArchived']) {
        var selector;
        if (selector = g.SITE.selectors.icons[key]) {
          this.thread[key] = !!$(selector, this.nodes.info);
        }
      }
      if (this.thread.isArchived) {
        this.thread.isClosed = true;
        this.thread.kill();
      }
    }

    this.info = {
      subject:   this.nodes.subject?.textContent || undefined,
      name:      this.nodes.name?.textContent,
      email:     this.nodes.email ? decodeURIComponent(this.nodes.email.href.replace(/^mailto:/, '')) : undefined,
      tripcode:  this.nodes.tripcode?.textContent,
      uniqueID:  this.nodes.uniqueID?.textContent,
      capcode:   this.nodes.capcode?.textContent.replace('## ', ''),
      pass:      this.nodes.pass?.title.match(/\d*$/)[0],
      flagCode:  this.nodes.flag?.className.match(/flag-(\w+)/)?.[1].toUpperCase(),
      flagCodeTroll: this.nodes.flag?.className.match(/bfl-(\w+)/)?.[1].toUpperCase(),
      flag:      this.nodes.flag?.title,
      date:      this.nodes.date ? g.SITE.parseDate(this.nodes.date) : undefined
    };

    if (Conf['Anonymize']) {
      this.info.nameBlock = 'Anonymous';
    } else {
      this.info.nameBlock = `${this.info.name || ''} ${this.info.tripcode || ''}`.trim();
    }
    if (this.info.capcode) { this.info.nameBlock += ` ## ${this.info.capcode}`; }
    if (this.info.uniqueID) { this.info.nameBlock += ` (ID: ${this.info.uniqueID})`; }

    this.parseComment();
    this.parseQuotes();
    this.parseFiles();

    this.isDead   = false;
    this.isHidden = false;

    this.clones = [];
    // <% if (readJSON('/.tests_enabled')) { %>
    // return if @forBuildTest
    // <% } %>
    if (g.posts.get(this.fullID)) {
      this.isRebuilt = true;
      this.clones = g.posts.get(this.fullID).clones;
      for (var clone of this.clones) { clone.origin = this; }
    }

    if (!this.isFetchedQuote && (this.ID > this.thread.lastPost)) { this.thread.lastPost = this.ID; }
    this.board.posts.push(this.ID, this);
    this.thread.posts.push(this.ID, this);
    g.posts.push(this.fullID, this);
  }

  parseNodes(root) {
    const s = g.SITE.selectors;
    const post = $(s.post, root) || root;
    const info = $(s.infoRoot, post);
    const nodes = {
      root,
      bottom:     this.isReply || !g.SITE.isOPContainerThread ? root : $(s.opBottom, root),
      post,
      info,
      comment:    $(s.comment, post),
      quotelinks: [],
      archivelinks: [],
      embedlinks:   []
    };
    for (var key in s.info) {
      var selector = s.info[key];
      nodes[key] = $(selector, info);
    }
    g.SITE.parseNodes?.(this, nodes);
    if (!nodes.uniqueIDRoot) { nodes.uniqueIDRoot = nodes.uniqueID; }

    // XXX Edge invalidates HTMLCollections when an ancestor node is inserted into another node.
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7560353/
    if ($.engine === 'edge') {
      Object.defineProperty(nodes, 'backlinks', {
        configurable: true,
        enumerable:   true,
        get() { return post.getElementsByClassName('backlink'); }
      }
      );
    } else {
      nodes.backlinks = post.getElementsByClassName('backlink');
    }

    return nodes;
  }

  parseComment() {
    // Merge text nodes and remove empty ones.
    let bq;
    this.nodes.comment.normalize();

    // Get the comment's text.
    // <br> -> \n
    // Remove:
    //   'Comment too long'...
    //   EXIF data. (/p/)
    this.nodes.commentClean = (bq = this.nodes.comment.cloneNode(true));
    g.SITE.cleanComment?.(bq);
    return this.info.comment = this.nodesToText(bq);
  }

  commentDisplay() {
    // Get the comment's text for display purposes (e.g. notifications, excerpts).
    // In addition to what's done in generating `@info.comment`, remove:
    //   Spoilers. (filter to '[spoiler]')
    //   Rolls. (/tg/, /qst/)
    //   Fortunes. (/s4s/)
    //   Preceding and following new lines.
    //   Trailing spaces.
    const bq = this.nodes.commentClean.cloneNode(true);
    if (!Conf['Remove Spoilers'] && !Conf['Reveal Spoilers']) { this.cleanSpoilers(bq); }
    g.SITE.cleanCommentDisplay?.(bq);
    return this.nodesToText(bq).trim().replace(/\s+$/gm, '');
  }

  commentOrig() {
    // Get the comment's text for reposting purposes.
    const bq = this.nodes.commentClean.cloneNode(true);
    g.SITE.insertTags?.(bq);
    return this.nodesToText(bq);
  }

  nodesToText(bq) {
    let node;
    let text = "";
    const nodes = $.X('.//br|.//text()', bq);
    let i = 0;
    while ((node = nodes.snapshotItem(i++))) {
      text += node.data || '\n';
    }
    return text;
  }

  cleanSpoilers(bq) {
    const spoilers = $$(g.SITE.selectors.spoiler, bq);
    for (var node of spoilers) {
      $.replace(node, $.tn('[spoiler]'));
    }
  }

  parseQuotes() {
    this.quotes = [];
    for (var quotelink of $$(g.SITE.selectors.quotelink, this.nodes.comment)) {
      this.parseQuote(quotelink);
    }
  }

  parseQuote(quotelink) {
    // Only add quotes that link to posts on an imageboard.
    // Don't add:
    //  - board links. (>>>/b/)
    //  - catalog links. (>>>/b/catalog or >>>/b/search)
    //  - rules links. (>>>/a/rules)
    //  - text-board quotelinks. (>>>/img/1234)
    const match = quotelink.href.match(g.SITE.regexp.quotelink);
    if (!match && (!this.isClone || !quotelink.dataset.postID)) { return; } // normal or resurrected quote

    this.nodes.quotelinks.push(quotelink);

    if (this.isClone) { return; }

    // ES6 Set when?
    const fullID = `${match[1]}.${match[3]}`;
    if (!this.quotes.includes(fullID)) { return this.quotes.push(fullID); }
  }

  parseFiles() {
    let file;
    this.files = [];
    const fileRoots = this.fileRoots();
    let index = 0;
    for (let docIndex = 0; docIndex < fileRoots.length; docIndex++) {
      var fileRoot = fileRoots[docIndex];
      if (file = this.parseFile(fileRoot)) {
        file.index = (index++);
        file.docIndex = docIndex;
        this.files.push(file);
      }
    }
    if (this.files.length) {
      return this.file = this.files[0];
    }
  }

  fileRoots() {
    if (g.SITE.selectors.multifile) {
      const roots = $$(g.SITE.selectors.multifile, this.nodes.root);
      if (roots.length) { return roots; }
    }
    return [this.nodes.root];
  }

  parseFile(fileRoot) {
    const file = {};
    for (var key in g.SITE.selectors.file) {
      var selector = g.SITE.selectors.file[key];
      file[key] = $(selector, fileRoot);
    }
    file.thumbLink = file.thumb?.parentNode;

    if (!(file.text && file.link)) { return; }
    if (!g.SITE.parseFile(this, file)) { return; }

    $.extend(file, {
      url:     file.link.href,
      isImage: $.isImage(file.link.href),
      isVideo: $.isVideo(file.link.href)
    }
    );
    let size  = +file.size.match(/[\d.]+/)[0];
    let unit  = ['B', 'KB', 'MB', 'GB'].indexOf(file.size.match(/\w+$/)[0]);
    while (unit-- > 0) { size *= 1024; }
    file.sizeInBytes = size;

    return file;
  }

  kill(file, index=0) {
    let strong;
    if (file) {
      if (this.isDead || this.files[index].isDead) { return; }
      this.files[index].isDead = true;
      $.addClass(this.nodes.root, 'deleted-file');
    } else {
      if (this.isDead) { return; }
      this.isDead = true;
      $.rmClass(this.nodes.root, 'deleted-file');
      $.addClass(this.nodes.root, 'deleted-post');
    }

    if (!(strong = $('strong.warning', this.nodes.info))) {
      strong = $.el('strong',
        {className: 'warning'});
      $.after($('input', this.nodes.info), strong);
    }
    strong.textContent = file ? '[File deleted]' : '[Deleted]';

    if (this.isClone) { return; }
    for (var clone of this.clones) {
      clone.kill(file, index);
    }

    if (file) { return; }
    // Get quotelinks/backlinks to this post
    // and paint them (Dead).
    for (var quotelink of Get.allQuotelinksLinkingTo(this)) {
      if (!$.hasClass(quotelink, 'deadlink')) {
        $.add(quotelink, Post.deadMark.cloneNode(true));
        $.addClass(quotelink, 'deadlink');
      }
    }
  }

  // XXX Workaround for 4chan's racing condition
  // giving us false-positive dead posts.
  resurrect() {
    this.isDead = false;
    $.rmClass(this.nodes.root, 'deleted-post');
    const strong = $('strong.warning', this.nodes.info);
    // no false-positive files
    if (this.files.some(file => file.isDead)) {
      $.addClass(this.nodes.root, 'deleted-file');
      strong.textContent = '[File deleted]';
    } else {
      $.rm(strong);
    }

    if (this.isClone) { return; }
    for (var clone of this.clones) {
      clone.resurrect();
    }

    for (var quotelink of Get.allQuotelinksLinkingTo(this)) {
      if ($.hasClass(quotelink, 'deadlink')) {
        $.rm($('.qmark-dead', quotelink));
        $.rmClass(quotelink, 'deadlink');
      }
    }
  }

  collect() {
    g.posts.rm(this.fullID);
    this.thread.posts.rm(this);
    return this.board.posts.rm(this);
  }

  addClone(context, contractThumb) {
    // Callbacks may not have been run yet due to anti-browser-lock delay in Main.callbackNodesDB.
    Callbacks.Post.execute(this);
    return new Post.Clone(this, context, contractThumb);
  }

  rmClone(index) {
    this.clones.splice(index, 1);
    for (var clone of this.clones.slice(index)) {
      clone.nodes.root.dataset.clone = index++;
    }
  }

  setCatalogOP(isCatalogOP) {
    this.nodes.root.classList.toggle('catalog-container', isCatalogOP);
    this.nodes.root.classList.toggle('opContainer', !isCatalogOP);
    this.nodes.post.classList.toggle('catalog-post', isCatalogOP);
    this.nodes.post.classList.toggle('op', !isCatalogOP);
    return this.nodes.post.style.left = (this.nodes.post.style.right = null);
  }
}
Post.initClass();
