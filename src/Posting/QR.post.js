/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
QR.post = class {
  constructor(select) {
    this.select = this.select.bind(this);
    const el = $.el('a', {
      className: 'qr-preview',
      draggable: true,
      href: 'javascript:;'
    }
    );
    $.extend(el, {innerHTML: '<a class="remove fa fa-times-circle" title="Remove"></a><label class="qr-preview-spoiler"><input type="checkbox"> Spoiler</label><span></span>'});

    this.nodes = {
      el,
      rm:      el.firstChild,
      spoiler: $('.qr-preview-spoiler input', el),
      span:    el.lastChild
    };

    $.on(el,             'click',  this.select);
    $.on(this.nodes.rm,      'click',  e => { e.stopPropagation(); return this.rm(); });
    $.on(this.nodes.spoiler, 'change', e => {
      this.spoiler = e.target.checked;
      if (this === QR.selected) { QR.nodes.spoiler.checked = this.spoiler; }
      return this.preventAutoPost();
    });
    for (var label of $$('label', el)) {
      $.on(label, 'click', e => e.stopPropagation());
    }
    $.add(QR.nodes.dumpList, el);

    for (var event of ['dragStart', 'dragEnter', 'dragLeave', 'dragOver', 'dragEnd', 'drop']) {
      $.on(el, event.toLowerCase(), this[event]);
    }

    this.thread = g.VIEW === 'thread' ?
      g.THREADID
    :
      'new';

    const prev = QR.posts[QR.posts.length - 1];
    QR.posts.push(this);
    this.nodes.spoiler.checked = (this.spoiler = prev && Conf['Remember Spoiler'] ?
      prev.spoiler
    :
      false);
    QR.persona.get(persona => {
      this.name = 'name' in QR.persona.always ?
        QR.persona.always.name
      : prev ?
        prev.name
      :
        persona.name;

      this.email = 'email' in QR.persona.always ?
        QR.persona.always.email
      :
        '';

      this.sub = 'sub' in QR.persona.always ?
        QR.persona.always.sub
      :
        '';

      if (QR.nodes.flag) {
        this.flag = (() => {
          if (prev) {
          return prev.flag;
        } else if (persona.flag && persona.flag in g.BOARD.config.board_flags) {
          return persona.flag;
        }
        })();
      }
      if (QR.selected === this) { return this.load(); }
    }); // load persona
    if (select) { this.select(); }
    this.unlock();
    QR.captcha.moreNeeded();
  }

  rm() {
    this.delete();
    const index = QR.posts.indexOf(this);
    if (QR.posts.length === 1) {
      new QR.post(true);
      $.rmClass(QR.nodes.el, 'dump');
    } else if (this === QR.selected) {
      (QR.posts[index-1] || QR.posts[index+1]).select();
    }
    QR.posts.splice(index, 1);
    QR.status();
    return QR.captcha.updateThread?.();
  }

  delete() {
    $.rm(this.nodes.el);
    URL.revokeObjectURL(this.URL);
    return this.dismissErrors();
  }

  lock(lock=true) {
    this.isLocked = lock;
    if (this !== QR.selected) { return; }
    for (var name of ['thread', 'name', 'email', 'sub', 'com', 'fileButton', 'filename', 'spoiler', 'flag']) {
      var node;
      if ((node = QR.nodes[name])) {
        node.disabled = lock;
      }
    }
    this.nodes.rm.style.visibility = lock ? 'hidden' : '';
    this.nodes.spoiler.disabled = lock;
    return this.nodes.el.draggable = !lock;
  }

  unlock() {
    return this.lock(false);
  }

  select() {
    if (QR.selected) {
      QR.selected.nodes.el.removeAttribute('id');
      QR.selected.forceSave();
    }
    QR.selected = this;
    this.lock(this.isLocked);
    this.nodes.el.id = 'selected';
    // Scroll the list to center the focused post.
    const rectEl   = this.nodes.el.getBoundingClientRect();
    const rectList = this.nodes.el.parentNode.getBoundingClientRect();
    this.nodes.el.parentNode.scrollLeft += (rectEl.left + (rectEl.width/2)) - rectList.left - (rectList.width/2);
    return this.load();
  }

  load() {
    // Load this post's values.

    for (var name of ['thread', 'name', 'email', 'sub', 'com', 'filename', 'flag']) {
      var node;
      if (!(node = QR.nodes[name])) { continue; }
      node.value = this[name] || node.dataset.default || '';
    }

    (this.thread !== 'new' ? $.addClass : $.rmClass)(QR.nodes.el, 'reply-to-thread');

    this.showFileData();
    return QR.characterCount();
  }

  save(input, forced) {
    if (input.type === 'checkbox') {
      this.spoiler = input.checked;
      return;
    }
    const {name}  = input.dataset;
    if (!['thread', 'name', 'email', 'sub', 'com', 'filename', 'flag'].includes(name)) { return; }
    const prev    = this[name] || input.dataset.default || null;
    this[name] = input.value || input.dataset.default || null;
    switch (name) {
      case 'thread':
        (this.thread !== 'new' ? $.addClass : $.rmClass)(QR.nodes.el, 'reply-to-thread');
        QR.status();
        QR.captcha.updateThread?.();
        break;
      case 'com':
        this.updateComment();
        break;
      case 'filename':
        if (!this.file) { return; }
        this.saveFilename();
        this.updateFilename();
        break;
      case 'name': case 'flag':
        if (this[name] !== prev) { // only save manual changes, not values filled in by persona settings
          QR.persona.set(this);
        }
        break;
    }
    if (!forced) { return this.preventAutoPost(); }
  }

  forceSave() {
    if (this !== QR.selected) { return; }
    // Do this in case people use extensions
    // that do not trigger the `input` event.
    for (var name of ['thread', 'name', 'email', 'sub', 'com', 'filename', 'spoiler', 'flag']) {
      var node;
      if (!(node = QR.nodes[name])) { continue; }
      this.save(node, true);
    }
  }

  preventAutoPost() {
    // Disable auto-posting if you're editing the first post
    // during the last 5 seconds of the cooldown.
    if (QR.cooldown.auto && (this === QR.posts[0])) {
      QR.cooldown.update(); // adding/removing file can change cooldown
      if (QR.cooldown.seconds <= 5) { return QR.cooldown.auto = false; }
    }
  }

  setComment(com) {
    this.com = com || null;
    if (this === QR.selected) {
      QR.nodes.com.value = this.com;
    }
    return this.updateComment();
  }

  updateComment() {
    if (this === QR.selected) {
      QR.characterCount();
    }
    this.nodes.span.textContent = this.com;
    QR.captcha.moreNeeded();
    if (QR.captcha === Captcha.v2) {
      return Captcha.cache.prerequest();
    }
  }

  isOnlyQuotes() {
    return (this.com || '').trim() === (this.quotedText || '').trim();
  }

  static rmErrored(e) {
    e.stopPropagation();
    for (let i = QR.posts.length - 1; i >= 0; i--) {
      var errors;
      var post = QR.posts[i];
      if ((errors = post.errors)) {
        for (var error of errors) {
          if (doc.contains(error)) {
            post.rm();
            break;
          }
        }
      }
    }
  }

  error(className, message, link) {
    const div = $.el('div', {className});
    $.extend(div, {innerHTML: '${message}?{link}{ [<a href="${link}" target="_blank">More info</a>]}<br>[<a href="javascript:;">delete post</a>] [<a href="javascript:;">delete all</a>]'});
    (this.errors || (this.errors = [])).push(div);
    const [rm, rmAll] = Array.from($$('a', div));
    $.on(div, 'click', () => {
      if (QR.posts.includes(this)) { return this.select(); }
    });
    $.on(rm, 'click', e => {
      e.stopPropagation();
      if (QR.posts.includes(this)) { return this.rm(); }
    });
    $.on(rmAll, 'click', QR.post.rmErrored);
    return QR.error(div, true);
  }

  fileError(message, link) {
    return this.error('file-error', `${this.filename}: ${message}`, link);
  }

  dismissErrors(test = () => true) {
    if (this.errors) {
      for (var error of this.errors) {
        if (doc.contains(error) && test(error)) {
          error.parentNode.previousElementSibling.click();
        }
      }
    }
  }

  setFile(file) {
    this.file = file;
    if (Conf['Randomize Filename'] && (g.BOARD.ID !== 'f')) {
      let ext;
      this.filename  = `${Date.now() - Math.floor(Math.random() * 365 * $.DAY)}`;
      if (ext = this.file.name.match(QR.validExtension)) { this.filename += ext[0]; }
    } else {
      this.filename  = this.file.name;
    }
    this.filesize = $.bytesToString(this.file.size);
    this.checkSize();
    $.addClass(this.nodes.el, 'has-file');
    QR.captcha.moreNeeded();
    URL.revokeObjectURL(this.URL);
    this.saveFilename();
    if (this === QR.selected) {
      this.showFileData();
    } else {
      this.updateFilename();
    }
    this.rmMetadata();
    this.nodes.el.dataset.type = this.file.type;
    this.nodes.el.style.backgroundImage = '';
    if (!QR.mimeTypes.includes(this.file.type)) {
      this.fileError('Unsupported file type.');
    } else if (/^(image|video)\//.test(this.file.type)) {
      this.readFile();
    }
    return this.preventAutoPost();
  }

  checkSize() {
    let max = QR.max_size;
    if (/^video\//.test(this.file.type)) { max = Math.min(max, QR.max_size_video); }
    if (this.file.size > max) {
      return this.fileError(`File too large (file: ${this.filesize}, max: ${$.bytesToString(max)}).`);
    }
  }

  readFile() {
    const isVideo = /^video\//.test(this.file.type);
    const el = $.el(isVideo ? 'video' : 'img');
    if (isVideo && !el.canPlayType(this.file.type)) { return; }

    const event = isVideo ? 'loadeddata' : 'load';
    var onload = () => {
      $.off(el, event, onload);
      $.off(el, 'error', onerror);
      this.checkDimensions(el);
      this.setThumbnail(el);
      return $.event('QRMetadata', null, this.nodes.el);
    };
    var onerror = () => {
      $.off(el, event, onload);
      $.off(el, 'error', onerror);
      this.fileError(`Corrupt ${isVideo ? 'video' : 'image'} or error reading metadata.`, '<%= meta.faq %>#error-reading-metadata');
      URL.revokeObjectURL(el.src);
      // XXX https://bugzilla.mozilla.org/show_bug.cgi?id=1021289
      this.nodes.el.removeAttribute('data-height');
      return $.event('QRMetadata', null, this.nodes.el);
    };
    this.nodes.el.dataset.height = 'loading';
    $.on(el, event, onload);
    $.on(el, 'error', onerror);
    return el.src = URL.createObjectURL(this.file);
  }

  checkDimensions(el) {
    let height, width;
    if (el.tagName === 'IMG') {
      ({height, width} = el);
      this.nodes.el.dataset.height = height;
      this.nodes.el.dataset.width = width;
      if ((height > QR.max_height) || (width > QR.max_width)) {
        this.fileError(`Image too large (image: ${height}x${width}px, max: ${QR.max_height}x${QR.max_width}px)`);
      }
      if ((height < QR.min_height) || (width < QR.min_width)) {
        return this.fileError(`Image too small (image: ${height}x${width}px, min: ${QR.min_height}x${QR.min_width}px)`);
      }
    } else {
      const {videoHeight, videoWidth, duration} = el;
      this.nodes.el.dataset.height = videoHeight;
      this.nodes.el.dataset.width = videoWidth;
      this.nodes.el.dataset.duration = duration;
      const max_height = Math.min(QR.max_height, QR.max_height_video);
      const max_width  = Math.min(QR.max_width,  QR.max_width_video);
      if ((videoHeight > max_height) || (videoWidth > max_width)) {
        this.fileError(`Video too large (video: ${videoHeight}x${videoWidth}px, max: ${max_height}x${max_width}px)`);
      }
      if ((videoHeight < QR.min_height) || (videoWidth < QR.min_width)) {
        this.fileError(`Video too small (video: ${videoHeight}x${videoWidth}px, min: ${QR.min_height}x${QR.min_width}px)`);
      }
      if (!isFinite(duration)) {
        this.fileError('Video lacks duration metadata (try remuxing)');
      } else if (duration > QR.max_duration_video) {
        this.fileError(`Video too long (video: ${duration}s, max: ${QR.max_duration_video}s)`);
      }
      if (BoardConfig.noAudio(g.BOARD.ID) && $.hasAudio(el)) {
        return this.fileError('Audio not allowed');
      }
    }
  }

  setThumbnail(el) {
    // Create a redimensioned thumbnail.
    let height, width;
    const isVideo = el.tagName === 'VIDEO';

    // Generate thumbnails only if they're really big.
    // Resized pictures through canvases look like ass,
    // so we generate thumbnails `s` times bigger then expected
    // to avoid crappy resized quality.
    let s = 90 * 2 * window.devicePixelRatio;
    if (this.file.type === 'image/gif') { s *= 3; } // let them animate
    if (isVideo) {
      height = el.videoHeight;
      width = el.videoWidth;
    } else {
      ({height, width} = el);
      if ((height < s) || (width < s)) {
        this.URL = el.src;
        this.nodes.el.style.backgroundImage = `url(${this.URL})`;
        return;
      }
    }

    if (height <= width) {
      width  = (s / height) * width;
      height = s;
    } else {
      height = (s / width)  * height;
      width  = s;
    }
    const cv = $.el('canvas');
    cv.height = height;
    cv.width  = width;
    cv.getContext('2d').drawImage(el, 0, 0, width, height);
    URL.revokeObjectURL(el.src);
    return cv.toBlob(blob => {
      this.URL = URL.createObjectURL(blob);
      return this.nodes.el.style.backgroundImage = `url(${this.URL})`;
    });
  }

  rmFile() {
    if (this.isLocked) { return; }
    delete this.file;
    delete this.filename;
    delete this.filesize;
    this.nodes.el.removeAttribute('title');
    QR.nodes.filename.removeAttribute('title');
    this.rmMetadata();
    this.nodes.el.style.backgroundImage = '';
    $.rmClass(this.nodes.el, 'has-file');
    this.showFileData();
    URL.revokeObjectURL(this.URL);
    this.dismissErrors(error => $.hasClass(error, 'file-error'));
    return this.preventAutoPost();
  }

  rmMetadata() {
    for (var attr of ['type', 'height', 'width', 'duration']) {
      // XXX https://bugzilla.mozilla.org/show_bug.cgi?id=1021289
      this.nodes.el.removeAttribute(`data-${attr}`);
    }
  }

  saveFilename() {
    this.file.newName = (this.filename || '').replace(/[/\\]/g, '-');
    if (!QR.validExtension.test(this.filename)) {
      // 4chan will truncate the filename if it has no extension.
      return this.file.newName += `.${$.getOwn(QR.extensionFromType, this.file.type) || 'jpg'}`;
    }
  }

  updateFilename() {
    const long = `${this.filename} (${this.filesize})`;
    this.nodes.el.title = long;
    if (this !== QR.selected) { return; }
    return QR.nodes.filename.title = long;
  }

  showFileData() {
    if (this.file) {
      this.updateFilename();
      QR.nodes.filename.value = this.filename;
      $.addClass(QR.nodes.oekaki,     'has-file');
      $.addClass(QR.nodes.fileSubmit, 'has-file');
    } else {
      $.rmClass(QR.nodes.oekaki,     'has-file');
      $.rmClass(QR.nodes.fileSubmit, 'has-file');
    }
    if (this.file?.source != null) {
      QR.nodes.fileSubmit.dataset.source = this.file.source;
    } else {
      QR.nodes.fileSubmit.removeAttribute('data-source');
    }
    return QR.nodes.spoiler.checked = this.spoiler;
  }

  pasteText(file) {
    this.pasting = true;
    this.preventAutoPost();
    const reader = new FileReader();
    reader.onload = e => {
      const {result} = e.target;
      this.setComment((this.com ? `${this.com}\n${result}` : result));
      return delete this.pasting;
    };
    return reader.readAsText(file);
  }

  dragStart(e) {
    const {left, top} = this.getBoundingClientRect();
    e.dataTransfer.setDragImage(this, e.clientX - left, e.clientY - top);
    return $.addClass(this, 'drag');
  }
  dragEnd() { return $.rmClass(this, 'drag'); }
  dragEnter() { return $.addClass(this, 'over'); }
  dragLeave() { return $.rmClass(this, 'over'); }

  dragOver(e) {
    e.preventDefault();
    return e.dataTransfer.dropEffect = 'move';
  }

  drop() {
    $.rmClass(this, 'over');
    if (!this.draggable) { return; }
    const el       = $('.drag', this.parentNode);
    const index    = el => [...Array.from(el.parentNode.children)].indexOf(el);
    const oldIndex = index(el);
    const newIndex = index(this);
    if (QR.posts[oldIndex].isLocked || QR.posts[newIndex].isLocked) { return; }
    (oldIndex < newIndex ? $.after : $.before)(this, el);
    const post = QR.posts.splice(oldIndex, 1)[0];
    QR.posts.splice(newIndex, 0, post);
    QR.status();
    return QR.captcha.updateThread?.();
  }
};
