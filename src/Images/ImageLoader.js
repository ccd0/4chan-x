/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var ImageLoader = {
  init() {
    if (!['index', 'thread', 'archive'].includes(g.VIEW)) { return; }
    const replace = Conf['Replace JPG'] || Conf['Replace PNG'] || Conf['Replace GIF'] || Conf['Replace WEBM'];
    if (!Conf['Image Prefetching'] && !replace) { return; }

    Callbacks.Post.push({
      name: 'Image Replace',
      cb:   this.node
    });

    $.on(d, 'PostsInserted', function() {
      if (ImageLoader.prefetchEnabled || replace) {
        return g.posts.forEach(ImageLoader.prefetchAll);
      }
    });

    if (Conf['Replace WEBM']) {
      $.on(d, 'scroll visibilitychange 4chanXInitFinished PostsInserted', this.playVideos);
    }

    if (!Conf['Image Prefetching'] || !['index', 'thread'].includes(g.VIEW)) { return; }

    const el = $.el('a', {
      href: 'javascript:;',
      title: 'Prefetch Images',
      className: 'fa fa-bolt disabled',
      textContent: 'Prefetch'
    }
    );

    $.on(el, 'click', this.toggle);

    return Header.addShortcut('prefetch', el, 525);
  },

  node() {
    if (this.isClone) { return; }
    for (var file of this.files) {
      if (Conf['Replace WEBM'] && file.isVideo) { ImageLoader.replaceVideo(this, file); }
      ImageLoader.prefetch(this, file);
    }
  },

  replaceVideo(post, file) {
    const {thumb} = file;
    const video = $.el('video', {
      preload:     'none',
      loop:        true,
      muted:       true,
      poster:      thumb.src || thumb.dataset.src,
      textContent: thumb.alt,
      className:   thumb.className
    }
    );
    video.setAttribute('muted', 'muted');
    video.dataset.md5 = thumb.dataset.md5;
    for (var attr of ['height', 'width', 'maxHeight', 'maxWidth']) { video.style[attr] = thumb.style[attr]; }
    video.src         = file.url;
    $.replace(thumb, video);
    file.thumb      = video;
    return file.videoThumb = true;
  },

  prefetch(post, file) {
    let clone, type;
    const {isImage, isVideo, thumb, url} = file;
    if (file.isPrefetched || !(isImage || isVideo) || post.isHidden || post.thread.isHidden) { return; }
    if (isVideo) {
      type = 'WEBM';
    } else {
      type = url.match(/\.([^.]+)$/)?.[1].toUpperCase();
      if (type === 'JPEG') { type = 'JPG'; }
    }
    const replace = Conf[`Replace ${type}`] && !/spoiler/.test(thumb.src || thumb.dataset.src);
    if (!replace && !ImageLoader.prefetchEnabled) { return; }
    if ($.hasClass(doc, 'catalog-mode')) { return; }
    if (![post, ...Array.from(post.clones)].some(clone => doc.contains(clone.nodes.root))) { return; }
    file.isPrefetched = true;
    if (file.videoThumb) {
      for (clone of post.clones) { clone.file.thumb.preload = 'auto'; }
      thumb.preload = 'auto';
      // XXX Cloned video elements with poster in Firefox cause momentary display of image loading icon.
      if ($.engine === 'gecko') {
        $.on(thumb, 'loadeddata', function() { return this.removeAttribute('poster'); });
      }
      return;
    }

    const el = $.el(isImage ? 'img' : 'video');
    if (isVideo) { el.preload = 'auto'; }
    if (replace && isImage) {
      $.on(el, 'load', function() {
        for (clone of post.clones) { clone.file.thumb.src = url; }
        return thumb.src = url;
      });
    }
    return el.src = url;
  },

  prefetchAll(post) {
    for (var file of post.files) {
      ImageLoader.prefetch(post, file);
    }
  },

  toggle() {
    ImageLoader.prefetchEnabled = !ImageLoader.prefetchEnabled;
    this.classList.toggle('disabled', !ImageLoader.prefetchEnabled);
    if (ImageLoader.prefetchEnabled) {
      g.posts.forEach(ImageLoader.prefetchAll);
    }
  },

  playVideos() {
    // Special case: Quote previews are off screen when inserted into document, but quickly moved on screen.
    const qpClone = $.id('qp')?.firstElementChild;
    return g.posts.forEach(function(post) {
      for (post of [post, ...Array.from(post.clones)]) {
        for (var file of post.files) {
          if (file.videoThumb) {
            var {thumb} = file;
            if (Header.isNodeVisible(thumb) || (post.nodes.root === qpClone)) { thumb.play(); } else { thumb.pause(); }
          }
        }
      }
    });
  }
};
