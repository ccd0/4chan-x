/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
Post.Clone = (function() {
  const Cls = class extends Post {
    static initClass() {
      this.prototype.isClone = true;
    }

    constructor() {
      const that = Object.create(Post.Clone.prototype);
      that.construct(...arguments);
      return that;
    }

    construct(origin, context, contractThumb) {
      let file, fileRoots, key;
      this.origin = origin;
      this.context = context;
      for (key of ['ID', 'postID', 'threadID', 'boardID', 'siteID', 'fullID', 'board', 'thread', 'info', 'quotes', 'isReply']) {
        // Copy or point to the origin's key value.
        this[key] = this.origin[key];
      }

      const {nodes} = this.origin;
      const root = contractThumb ?
        this.cloneWithoutVideo(nodes.root)
      :
        nodes.root.cloneNode(true);
      if (!Post.Clone.suffix) { Post.Clone.suffix = 0; }
      for (var node of [root, ...Array.from($$('[id]', root))]) {
        node.id += `_${Post.Clone.suffix}`;
      }
      Post.Clone.suffix++;

      // Remove inlined posts inside of this post.
      for (var inline  of $$('.inline', root)) {
        $.rm(inline);
      }
      for (var inlined of $$('.inlined', root)) {
        $.rmClass(inlined, 'inlined');
      }

      this.nodes = this.parseNodes(root);

      root.hidden = false; // post hiding
      $.rmClass(root,        'forwarded'); // quote inlining
      $.rmClass(this.nodes.post, 'highlight'); // keybind navigation, ID highlighting

      // Remove catalog stuff.
      if (!this.isReply) {
        this.setCatalogOP(false);
        $.rm($('.catalog-link', this.nodes.post));
        $.rm($('.catalog-stats', this.nodes.post));
        $.rm($('.catalog-replies', this.nodes.post));
      }

      this.parseQuotes();
      this.quotes = [...Array.from(this.origin.quotes)];

      this.files = [];
      if (this.origin.files.length) { fileRoots = this.fileRoots(); }
      for (var originFile of this.origin.files) {
        // Copy values, point to relevant elements.
        file = {};
        for (key in originFile) {
          var val = originFile[key];
          file[key] = val;
        }
        var fileRoot = fileRoots[file.docIndex];
        for (key in g.SITE.selectors.file) {
          var selector = g.SITE.selectors.file[key];
          file[key] = $(selector, fileRoot);
        }
        file.thumbLink = file.thumb?.parentNode;
        if (file.thumbLink) { file.fullImage = $('.full-image', file.thumbLink); }
        file.videoControls = $('.video-controls', file.text);
        if (file.videoThumb) { file.thumb.muted = true; }
        this.files.push(file);
      }

      if (this.files.length) {
        this.file = this.files[0];

        // Contract thumbnails in quote preview
        if (this.file.thumb && contractThumb) { ImageExpand.contract(this); }
      }

      if (this.origin.isDead) { this.isDead  = true; }
      return root.dataset.clone = this.origin.clones.push(this) - 1;
    }

    cloneWithoutVideo(node) {
      if ((node.tagName === 'VIDEO') && !node.dataset.md5) { // (exception for WebM thumbnails)
        return [];
      } else if ((node.nodeType === Node.ELEMENT_NODE) && $('video', node)) {
        const clone = node.cloneNode(false);
        for (var child of node.childNodes) { $.add(clone, this.cloneWithoutVideo(child)); }
        return clone;
      } else {
        return node.cloneNode(true);
      }
    }
  };
  Cls.initClass();
  return Cls;
})();
