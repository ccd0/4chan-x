/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import QuickReplyPage from './QR/QuickReply.html';

var QR = {
  mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/vnd.adobe.flash.movie', 'application/x-shockwave-flash', 'video/webm'],

  validExtension: /\.(jpe?g|png|gif|pdf|swf|webm)$/i,

  typeFromExtension: {
    'jpg':  'image/jpeg',
    'jpeg': 'image/jpeg',
    'png':  'image/png',
    'gif':  'image/gif',
    'pdf':  'application/pdf',
    'swf':  'application/vnd.adobe.flash.movie',
    'webm': 'video/webm'
  },

  extensionFromType: {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'application/pdf': 'pdf',
    'application/vnd.adobe.flash.movie': 'swf',
    'application/x-shockwave-flash': 'swf',
    'video/webm': 'webm'
  },

  init() {
    let sc;
    if (!Conf['Quick Reply']) { return; }

    this.posts = [];

    $.on(d, '4chanXInitFinished', () => BoardConfig.ready(QR.initReady));

    Callbacks.Post.push({
      name: 'Quick Reply',
      cb:   this.node
    });

    this.shortcut = (sc = $.el('a', {
      className: 'fa fa-comment-o disabled',
      textContent: 'QR',
      title: 'Quick Reply',
      href: 'javascript:;'
    }
    ));
    $.on(sc, 'click', function() {
      if (!QR.postingIsEnabled) { return; }
      if (Conf['Persistent QR'] || !QR.nodes || QR.nodes.el.hidden) {
        QR.open();
        return QR.nodes.com.focus();
      } else {
        return QR.close();
      }
    });

    return Header.addShortcut('qr', sc, 540);
  },

  initReady() {
    let origToggle;
    const captchaVersion = $('#g-recaptcha, #captcha-forced-noscript') ? 'v2' : 't';
    QR.captcha = Captcha[captchaVersion];
    QR.postingIsEnabled = true;

    const {config} = g.BOARD;
    const prop = (key, def) => +(config[key] ?? def);

    QR.min_width  = prop('min_image_width',  1);
    QR.min_height = prop('min_image_height', 1);
    QR.max_width  = (QR.max_height = 10000);

    QR.max_size       = prop('max_filesize',      4194304);
    QR.max_size_video = prop('max_webm_filesize', QR.max_size);
    QR.max_comment    = prop('max_comment_chars', 2000);

    QR.max_width_video = (QR.max_height_video = 2048);
    QR.max_duration_video = prop('max_webm_duration', 120);

    QR.forcedAnon = !!config.forced_anon;
    QR.spoiler    = !!config.spoilers;

    if (origToggle = $.id('togglePostFormLink')) {
      const link = $.el('h1',
        {className: "qr-link-container"});
      $.extend(link, {innerHTML: '<a href="javascript:;" class="qr-link">?{g.VIEW === "thread"}{Reply to Thread}{Start a Thread}</a>'});

      QR.link = link.firstElementChild;
      $.on(link.firstChild, 'click', function() {
        QR.open();
        return QR.nodes.com.focus();
      });

      $.before(origToggle, link);
      origToggle.firstElementChild.textContent = 'Original Form';
    }

    if (g.VIEW === 'thread') {
      let navLinksBot;
      const linkBot = $.el('div',
        {className: "brackets-wrap qr-link-container-bottom"});
      $.extend(linkBot, {innerHTML: '<a href="javascript:;" class="qr-link-bottom">Reply to Thread</a>'});

      $.on(linkBot.firstElementChild, 'click', function() {
        QR.open();
        return QR.nodes.com.focus();
      });

      if (navLinksBot = $('.navLinksBot')) { $.prepend(navLinksBot, linkBot); }
    }

    $.on(d, 'QRGetFile',          QR.getFile);
    $.on(d, 'QRDrawFile',         QR.drawFile);
    $.on(d, 'QRSetFile',          QR.setFile);

    $.on(d, 'paste',              QR.paste);
    $.on(d, 'dragover',           QR.dragOver);
    $.on(d, 'drop',               QR.dropFile);
    $.on(d, 'dragstart dragend',  QR.drag);

    $.on(d, 'IndexRefreshInternal', QR.generatePostableThreadsList);
    $.on(d, 'ThreadUpdate', QR.statusCheck);

    if (!Conf['Persistent QR']) { return; }
    QR.open();
    if (Conf['Auto Hide QR']) { return QR.hide(); }
  },

  statusCheck() {
    if (!QR.nodes) { return; }
    const {thread} = QR.posts[0];
    if ((thread !== 'new') && g.threads.get(`${g.BOARD}.${thread}`).isDead) {
      return QR.abort();
    } else {
      return QR.status();
    }
  },

  node() {
    $.on(this.nodes.quote, 'click', QR.quote);
    if (this.isFetchedQuote) { return QR.generatePostableThreadsList(); }
  },

  open() {
    if (QR.nodes) {
      if (QR.nodes.el.hidden) { QR.captcha.setup(); }
      QR.nodes.el.hidden = false;
      QR.unhide();
    } else {
      try {
        QR.dialog();
      } catch (err) {
        delete QR.nodes;
        Main.handleErrors({
          message: 'Quick Reply dialog creation crashed.',
          error: err
        });
        return;
      }
    }
    return $.rmClass(QR.shortcut, 'disabled');
  },

  close() {
    if (QR.req) {
      QR.abort();
      return;
    }
    QR.nodes.el.hidden = true;
    QR.cleanNotifications();
    QR.blur();
    $.rmClass(QR.nodes.el, 'dump');
    $.addClass(QR.shortcut, 'disabled');
    new QR.post(true);
    for (var post of QR.posts.splice(0, QR.posts.length - 1)) {
      post.delete();
    }
    QR.cooldown.auto = false;
    QR.status();
    return QR.captcha.destroy();
  },

  focus() {
    return $.queueTask(function() {
      if (!QR.inBubble()) {
        QR.hasFocus = d.activeElement && QR.nodes.el.contains(d.activeElement);
        return QR.nodes.el.classList.toggle('focus', QR.hasFocus);
      }
    });
  },

  inBubble() {
    const bubbles = $$('iframe[src^="https://www.google.com/recaptcha/api2/frame"]');
    return bubbles.includes(d.activeElement) || bubbles.some(el => (getComputedStyle(el).visibility !== 'hidden') && (el.getBoundingClientRect().bottom > 0));
  },

  hide() {
    QR.blur();
    $.addClass(QR.nodes.el, 'autohide');
    return QR.nodes.autohide.checked = true;
  },

  unhide() {
    $.rmClass(QR.nodes.el, 'autohide');
    return QR.nodes.autohide.checked = false;
  },

  toggleHide() {
    if (this.checked) {
      return QR.hide();
    } else {
      return QR.unhide();
    }
  },

  blur() {
    if (QR.nodes.el.contains(d.activeElement)) { return d.activeElement.blur(); }
  },

  toggleSJIS(e) {
    e.preventDefault();
    Conf['sjisPreview'] = !Conf['sjisPreview'];
    $.set('sjisPreview', Conf['sjisPreview']);
    return QR.nodes.el.classList.toggle('sjis-preview', Conf['sjisPreview']);
  },

  texPreviewShow() {
    if ($.hasClass(QR.nodes.el, 'tex-preview')) { return QR.texPreviewHide(); }
    $.addClass(QR.nodes.el, 'tex-preview');
    QR.nodes.texPreview.textContent = QR.nodes.com.value;
    return $.event('mathjax', null, QR.nodes.texPreview);
  },

  texPreviewHide() {
    return $.rmClass(QR.nodes.el, 'tex-preview');
  },

  addPost() {
    const wasOpen = (QR.nodes && !QR.nodes.el.hidden);
    QR.open();
    if (wasOpen) {
      $.addClass(QR.nodes.el, 'dump');
      new QR.post(true);
    }
    return QR.nodes.com.focus();
  },

  setCustomCooldown(enabled) {
    Conf['customCooldownEnabled'] = enabled;
    QR.cooldown.customCooldown = enabled;
    return QR.nodes.customCooldown.classList.toggle('disabled', !enabled);
  },

  toggleCustomCooldown() {
    const enabled = $.hasClass(QR.nodes.customCooldown, 'disabled');
    QR.setCustomCooldown(enabled);
    return $.set('customCooldownEnabled', enabled);
  },

  error(err, focusOverride) {
    let el;
    QR.open();
    if (typeof err === 'string') {
      el = $.tn(err);
    } else {
      el = err;
      el.removeAttribute('style');
    }
    const notice = new Notice('warning', el);
    QR.notifications.push(notice);
    if (!Header.areNotificationsEnabled) {
      if (d.hidden && !QR.cooldown.auto) { return alert(el.textContent); }
    } else if (d.hidden || !(focusOverride || d.hasFocus())) {
      const notif = new Notification(el.textContent, {
        body: el.textContent,
        icon: Favicon.logo
      }
      );
      notif.onclick = () => window.focus();
      if ($.engine !== 'gecko') {
        // Firefox automatically closes notifications
        // so we can't control the onclose properly.
        notif.onclose = () => notice.close();
        return notif.onshow  = () => setTimeout(function() {
          notif.onclose = null;
          return notif.close();
        }
        , 7 * $.SECOND);
      }
    }
  },

  connectionError() {
    return $.el('span',
      { innerHTML:
        'Connection error while posting. ' +
        '[<a href="' + meta.faq + '#connection-errors" target="_blank">More info</a>]'
      }
    );
  },

  notifications: [],

  cleanNotifications() {
    for (var notification of QR.notifications) {
      notification.close();
    }
    return QR.notifications = [];
  },

  status() {
    let disabled, value;
    if (!QR.nodes) { return; }
    const {thread} = QR.posts[0];
    if ((thread !== 'new') && g.threads.get(`${g.BOARD}.${thread}`).isDead) {
      value    = 'Dead';
      disabled = true;
      QR.cooldown.auto = false;
    }

    value = QR.req ?
      QR.req.progress
    :
      QR.cooldown.seconds || value;

    const {status} = QR.nodes;
    status.value = !value ?
      'Submit'
    : QR.cooldown.auto ?
      `Auto ${value}`
    :
      value;
    return status.disabled = disabled || false;
  },

  openPost() {
    QR.open();
    if (QR.selected.isLocked) {
      const index = QR.posts.indexOf(QR.selected);
      (QR.posts[index+1] || new QR.post()).select();
      $.addClass(QR.nodes.el, 'dump');
      return QR.cooldown.auto = true;
    }
  },

  quote(e) {
    let range;
    e?.preventDefault();
    if (!QR.postingIsEnabled) { return; }
    const sel  = d.getSelection();
    const post = Get.postFromNode(this);
    const {root} = post.nodes;
    const postRange = new Range();
    postRange.selectNode(root);
    let text = post.board.ID === g.BOARD.ID ? `>>${post}\n` : `>>>/${post.board}/${post}\n`;
    for (let i = 0, end = sel.rangeCount, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      var insideCode, node;
      range = sel.getRangeAt(i);
      // Trim range to be fully inside post
      if (range.compareBoundaryPoints(Range.START_TO_START, postRange) < 0) {
        range.setStartBefore(root);
      }
      if (range.compareBoundaryPoints(Range.END_TO_END, postRange) > 0) {
        range.setEndAfter(root);
      }

      if (!range.toString().trim()) { continue; }

      var frag  = range.cloneContents();
      var ancestor = range.commonAncestorContainer;
      // Quoting the insides of a spoiler/code tag.
      if ($.x('ancestor-or-self::*[self::s or contains(@class,"removed-spoiler")]', ancestor)) {
        $.prepend(frag, $.tn('[spoiler]'));
        $.add(frag, $.tn('[/spoiler]'));
      }
      if (insideCode = $.x('ancestor-or-self::pre[contains(@class,"prettyprint")]', ancestor)) {
        $.prepend(frag, $.tn('[code]'));
        $.add(frag, $.tn('[/code]'));
      }
      for (node of $$((insideCode ? 'br' : '.prettyprint br'), frag)) {
        $.replace(node, $.tn('\n'));
      }
      for (node of $$('br', frag)) {
        if (node !== frag.lastChild) { $.replace(node, $.tn('\n>')); }
      }
      g.SITE.insertTags?.(frag);
      for (node of $$('.linkify[data-original]', frag)) {
        $.replace(node, $.tn(node.dataset.original));
      }
      for (node of $$('.embedder', frag)) {
        if (node.previousSibling?.nodeValue === ' ') { $.rm(node.previousSibling); }
        $.rm(node);
      }
      text += `>${frag.textContent.trim()}\n`;
    }

    QR.openPost();
    const {com, thread} = QR.nodes;
    if (!com.value) { thread.value = Get.threadFromNode(this); }

    const wasOnlyQuotes = QR.selected.isOnlyQuotes();

    const caretPos = com.selectionStart;
    // Replace selection for text.
    com.value = com.value.slice(0, caretPos) + text + com.value.slice(com.selectionEnd);
    // Move the caret to the end of the new quote.
    range = caretPos + text.length;
    com.setSelectionRange(range, range);
    com.focus();

    // This allows us to determine if any text other than quotes has been typed.
    if (wasOnlyQuotes) { QR.selected.quotedText = com.value; }

    QR.selected.save(com);
    return QR.selected.save(thread);
  },

  characterCount() {
    const counter = QR.nodes.charCount;
    const count   = QR.nodes.com.value.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '_').length;
    counter.textContent = count;
    counter.hidden      = count < (QR.max_comment/2);
    return (count > QR.max_comment ? $.addClass : $.rmClass)(counter, 'warning');
  },

  getFile() {
    return $.event('QRFile', QR.selected?.file);
  },

  drawFile(e) {
    const file = QR.selected?.file;
    if (!file || !/^(image|video)\//.test(file.type)) { return; }
    const isVideo = /^video\//.test(file);
    const el = $.el((isVideo ? 'video' : 'img'));
    $.on(el, 'error', () => QR.openError());
    $.on(el, (isVideo ? 'loadeddata' : 'load'), function() {
      e.target.getContext('2d').drawImage(el, 0, 0);
      URL.revokeObjectURL(el.src);
      return $.event('QRImageDrawn', null, e.target);
    });
    return el.src = URL.createObjectURL(file);
  },

  openError() {
    const div = $.el('div');
    $.extend(div, { innerHTML: 'Could not open file. [<a href="' + meta.faq + '#error-reading-metadata" target="_blank">More info</a>]'});
    return QR.error(div);
  },

  setFile(e) {
    const {file, name, source} = e.detail;
    if (name != null) { file.name   = name; }
    if (source != null) { file.source = source; }
    QR.open();
    return QR.handleFiles([file]);
  },

  drag(e) {
    // Let it drag anything from the page.
    const toggle = e.type === 'dragstart' ? $.off : $.on;
    toggle(d, 'dragover', QR.dragOver);
    return toggle(d, 'drop',     QR.dropFile);
  },

  dragOver(e) {
    e.preventDefault();
    return e.dataTransfer.dropEffect = 'copy';
  }, // cursor feedback

  dropFile(e) {
    // Let it only handle files from the desktop.
    if (!e.dataTransfer.files.length) { return; }
    e.preventDefault();
    QR.open();
    return QR.handleFiles(e.dataTransfer.files);
  },

  paste(e) {
    if (!e.clipboardData.items) { return; }
    let file = null;
    let score = -1;
    for (var item of e.clipboardData.items) {
      var file2;
      if ((item.kind === 'file') && (file2 = item.getAsFile())) {
        var score2 = (2*(file2.size <= QR.max_size)) + (file2.type === 'image/png');
        if (score2 > score) {
          file = file2;
          score = score2;
        }
      }
    }
    if (file) {
      const {type} = file;
      const blob = new Blob([file], {type});
      blob.name = `${Conf['pastedname']}.${$.getOwn(QR.extensionFromType, type) || 'jpg'}`;
      QR.open();
      QR.handleFiles([blob]);
      $.addClass(QR.nodes.el, 'dump');
    }
  },

  pasteFF() {
    const {pasteArea} = QR.nodes;
    if (!pasteArea.childNodes.length) { return; }
    const images = $$('img', pasteArea);
    $.rmAll(pasteArea);
    for (var img of images) {
      var m;
      var {src} = img;
      if (m = src.match(/data:(image\/(\w+));base64,(.+)/)) {
        var bstr = atob(m[3]);
        var arr = new Uint8Array(bstr.length);
        for (var i = 0, end = bstr.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
          arr[i] = bstr.charCodeAt(i);
        }
        var blob = new Blob([arr], {type: m[1]});
        blob.name = `${Conf['pastedname']}.${m[2]}`;
        QR.handleFiles([blob]);
      } else if (/^https?:\/\//.test(src)) {
        QR.handleUrl(src);
      }
    }
  },

  handleUrl(urlDefault) {
    QR.open();
    QR.selected.preventAutoPost();
    return CrossOrigin.permission(function() {
      const url = prompt('Enter a URL:', urlDefault);
      if (url === null) { return; }
      QR.nodes.fileButton.focus();
      return CrossOrigin.file(url, function(blob) {
        if (blob && !/^text\//.test(blob.type)) {
          return QR.handleFiles([blob]);
        } else {
          return QR.error("Can't load file.");
        }
      });
    });
  },

  handleFiles(files) {
    if (this !== QR) { // file input
      files  = [...Array.from(this.files)];
      this.value = null;
    }
    if (!files.length) { return; }
    QR.cleanNotifications();
    for (var file of files) {
      QR.handleFile(file, files.length);
    }
    if (files.length !== 1) { $.addClass(QR.nodes.el, 'dump'); }
    if ((d.activeElement === QR.nodes.fileButton) && $.hasClass(QR.nodes.fileSubmit, 'has-file')) {
      return QR.nodes.filename.focus();
    }
  },

  handleFile(file, nfiles) {
    let post;
    const isText = /^text\//.test(file.type);
    if (nfiles === 1) {
      post = QR.selected;
    } else {
      post = QR.posts[QR.posts.length - 1];
      if (isText ? post.com || post.pasting : post.file) {
        post = new QR.post();
      }
    }
    return post[isText ? 'pasteText' : 'setFile'](file);
  },

  openFileInput() {
    if (QR.nodes.fileButton.disabled) { return; }
    QR.nodes.fileInput.click();
    return QR.nodes.fileButton.focus();
  },

  generatePostableThreadsList() {
    if (!QR.nodes) { return; }
    const list    = QR.nodes.thread;
    const options = [list.firstElementChild];
    for (var thread of g.BOARD.threads.keys) {
      options.push($.el('option', {
        value: thread,
        textContent: `Thread ${thread}`
      }
      )
      );
    }
    const val = list.value;
    $.rmAll(list);
    $.add(list, options);
    list.value = val;
    if (list.value === val) { return; }
    // Fix the value if the option disappeared.
    list.value = g.VIEW === 'thread' ?
      g.THREADID
    :
      'new';
    return (g.VIEW === 'thread' ? $.addClass : $.rmClass)(QR.nodes.el, 'reply-to-thread');
  },

  dialog() {
    let dialog, event, nodes;
    let name;
    QR.nodes = (nodes = {
      el: (dialog = UI.dialog('qr',
        { innerHTML: QuickReplyPage }))
    });

    const setNode = (name, query) => nodes[name] = $(query, dialog);

    setNode('move',           '.move');
    setNode('autohide',       '#autohide');
    setNode('close',          '.close');
    setNode('thread',         'select');
    setNode('form',           'form');
    setNode('sjisToggle',     '#sjis-toggle');
    setNode('texButton',      '#tex-preview-button');
    setNode('name',           '[data-name=name]');
    setNode('email',          '[data-name=email]');
    setNode('sub',            '[data-name=sub]');
    setNode('com',            '[data-name=com]');
    setNode('charCount',      '#char-count');
    setNode('texPreview',     '#tex-preview');
    setNode('dumpList',       '#dump-list');
    setNode('addPost',        '#add-post');
    setNode('oekaki',         '.oekaki');
    setNode('drawButton',     '#qr-draw-button');
    setNode('fileSubmit',     '#file-n-submit');
    setNode('fileButton',     '#qr-file-button');
    setNode('noFile',         '#qr-no-file');
    setNode('filename',       '#qr-filename');
    setNode('spoiler',        '#qr-file-spoiler');
    setNode('oekakiButton',   '#qr-oekaki-button');
    setNode('fileRM',         '#qr-filerm');
    setNode('urlButton',      '#url-button');
    setNode('pasteArea',      '#paste-area');
    setNode('customCooldown', '#custom-cooldown-button');
    setNode('dumpButton',     '#dump-button');
    setNode('status',         '[type=submit]');
    setNode('flashTag',       '[name=filetag]');
    setNode('fileInput',      '[type=file]');

    const {config} = g.BOARD;
    const {classList} = QR.nodes.el;
    classList.toggle('forced-anon',  QR.forcedAnon);
    classList.toggle('has-spoiler',  QR.spoiler);
    classList.toggle('has-sjis',     !!config.sjis_tags);
    classList.toggle('has-math',     !!config.math_tags);
    classList.toggle('sjis-preview', !!config.sjis_tags && Conf['sjisPreview']);
    classList.toggle('show-new-thread-option', Conf['Show New Thread Option in Threads']);

    if (parseInt(Conf['customCooldown'], 10) > 0) {
      $.addClass(QR.nodes.fileSubmit, 'custom-cooldown');
      $.get('customCooldownEnabled', Conf['customCooldownEnabled'], function({customCooldownEnabled}) {
        QR.setCustomCooldown(customCooldownEnabled);
        return $.sync('customCooldownEnabled', QR.setCustomCooldown);
      });
    }

    QR.flagsInput();

    $.on(nodes.autohide,       'change',    QR.toggleHide);
    $.on(nodes.close,          'click',     QR.close);
    $.on(nodes.status,         'click',     QR.submit);
    $.on(nodes.form,           'submit',    QR.submit);
    $.on(nodes.sjisToggle,     'click',     QR.toggleSJIS);
    $.on(nodes.texButton,      'mousedown', QR.texPreviewShow);
    $.on(nodes.texButton,      'mouseup',   QR.texPreviewHide);
    $.on(nodes.addPost,        'click',     () => new QR.post(true));
    $.on(nodes.drawButton,     'click',     QR.oekaki.draw);
    $.on(nodes.fileButton,     'click',     QR.openFileInput);
    $.on(nodes.noFile,         'click',     QR.openFileInput);
    $.on(nodes.filename,       'focus',     function() { return $.addClass(this.parentNode, 'focus'); });
    $.on(nodes.filename,       'blur',      function() { return $.rmClass(this.parentNode, 'focus'); });
    $.on(nodes.spoiler,        'change',    () => QR.selected.nodes.spoiler.click());
    $.on(nodes.oekakiButton,   'click',     QR.oekaki.button);
    $.on(nodes.fileRM,         'click',     () => QR.selected.rmFile());
    $.on(nodes.urlButton,      'click',     () => QR.handleUrl(''));
    $.on(nodes.customCooldown, 'click',     QR.toggleCustomCooldown);
    $.on(nodes.dumpButton,     'click',     () => nodes.el.classList.toggle('dump'));
    $.on(nodes.fileInput,      'change',    QR.handleFiles);

    window.addEventListener('focus', QR.focus, true);
    window.addEventListener('blur',  QR.focus, true);
    // We don't receive blur events from captcha iframe.
    $.on(d, 'click', QR.focus);

    // XXX Workaround for image pasting in Firefox, obsolete as of v50.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=906420
    if (($.engine === 'gecko') && !window.DataTransferItemList) {
      nodes.pasteArea.hidden = false;
    }
    new MutationObserver(QR.pasteFF).observe(nodes.pasteArea, {childList: true});

    // save selected post's data
    const items = ['thread', 'name', 'email', 'sub', 'com', 'filename', 'flag'];
    let i = 0;
    const save = function() { return QR.selected.save(this); };
    while ((name = items[i++])) {
      var node;
      if (!(node = nodes[name])) { continue; }
      event = node.nodeName === 'SELECT' ? 'change' : 'input';
      $.on(nodes[name], event, save);
    }

    // XXX Blink and WebKit treat width and height of <textarea>s as min-width and min-height
    if (($.engine === 'gecko') && Conf['Remember QR Size']) {
      $.get('QR Size', '', item => nodes.com.style.cssText = item['QR Size']);
      $.on(nodes.com, 'mouseup', function(e) {
        if (e.button !== 0) { return; }
        return $.set('QR Size', this.style.cssText);
      });
    }

    QR.generatePostableThreadsList();
    QR.persona.load();
    new QR.post(true);
    QR.status();
    QR.cooldown.setup();
    QR.captcha.init();

    $.add(d.body, dialog);
    QR.captcha.setup();
    QR.oekaki.setup();

    // Create a custom event when the QR dialog is first initialized.
    // Use it to extend the QR's functionalities, or for XTRM RICE.
    return $.event('QRDialogCreation', null, dialog);
  },

  flags() {
    const select = $.el('select', {
      name:      'flag',
      className: 'flagSelector'
    }
    );

    const addFlag = (value, textContent) => $.add(select, $.el('option', {value, textContent}));

    addFlag('0', (g.BOARD.config.country_flags ? 'Geographic Location' : 'None'));
    for (var value in g.BOARD.config.board_flags) {
      var textContent = g.BOARD.config.board_flags[value];
      addFlag(value, textContent);
    }

    return select;
  },

  flagsInput() {
    const {nodes} = QR;
    if (!nodes) { return; }
    if (nodes.flag) {
      $.rm(nodes.flag);
      delete nodes.flag;
    }

    if (g.BOARD.config.board_flags) {
      const flag = QR.flags();
      flag.dataset.name    = 'flag';
      flag.dataset.default = '0';
      nodes.flag = flag;
      return $.add(nodes.form, flag);
    }
  },

  submit(e) {
    let captcha, err, filetag;
    e?.preventDefault();
    const force = e?.shiftKey;

    if (QR.req) {
      QR.abort();
      return;
    }

    $.forceSync('cooldowns');
    if (QR.cooldown.seconds) {
      if (force) {
        QR.cooldown.clear();
      } else {
        QR.cooldown.auto = !QR.cooldown.auto;
        QR.status();
        return;
      }
    }

    const post = QR.posts[0];
    delete post.quotedText;
    post.forceSave();
    let threadID = post.thread;
    const thread = g.BOARD.threads.get(threadID);
    if ((g.BOARD.ID === 'f') && (threadID === 'new')) {
      filetag = QR.nodes.flashTag.value;
    }

    // prevent errors
    if (threadID === 'new') {
      threadID = null;
      if (!!g.BOARD.config.require_subject && !post.sub) {
        err = 'New threads require a subject.';
      } else if (!!!g.BOARD.config.text_only && !post.file) {
        err = 'No file selected.';
      }
    } else if (g.BOARD.threads.get(threadID).isClosed) {
      err = 'You can\'t reply to this thread anymore.';
    } else if (!post.com && !post.file) {
      err = 'No comment or file.';
    } else if (post.file && thread.fileLimit) {
      err = 'Max limit of image replies has been reached.';
    }

    if ((g.BOARD.ID === 'r9k') && !post.com?.match(/[a-z-]/i)) {
      if (!err) { err = 'Original comment required.'; }
    }

    if (QR.captcha.isEnabled && !((QR.captcha === Captcha.v2) && /\b_ct=/.test(d.cookie) && threadID) && !(err && !force)) {
      captcha = QR.captcha.getOne(!!threadID);
      if (QR.captcha === Captcha.v2) {
        if (!captcha) { captcha = Captcha.cache.request(!!threadID); }
      }
      if (!captcha) {
        err = 'No valid captcha.';
        QR.captcha.setup(!QR.cooldown.auto || (d.activeElement === QR.nodes.status));
      }
    }

    QR.cleanNotifications();
    if (err && !force) {
      // stop auto-posting
      QR.cooldown.auto = false;
      QR.status();
      QR.error(err);
      return;
    }

    // Enable auto-posting if we have stuff to post, disable it otherwise.
    QR.cooldown.auto = QR.posts.length > 1;

    post.lock();

    const formData = {
      resto:    threadID,
      name:     (!QR.forcedAnon ? post.name : undefined),
      email:    post.email,
      sub:      (!QR.forcedAnon && !threadID ? post.sub : undefined),
      com:      post.com,
      upfile:   post.file,
      filetag,
      spoiler:  post.spoiler,
      flag:     post.flag,
      mode:     'regist',
      pwd:      QR.persona.getPassword()
    };

    const options = {
      responseType: 'document',
      withCredentials: true,
      onloadend: QR.response,
      form: $.formData(formData)
    };
    if (Conf['Show Upload Progress']) {
      options.onprogress = function(e) {
        if (this !== QR.req?.upload) { return; } // aborted
        if (e.loaded < e.total) {
          // Uploading...
          QR.req.progress = `${Math.round((e.loaded / e.total) * 100)}%`;
        } else {
          // Upload done, waiting for server response.
          QR.req.isUploadFinished = true;
          QR.req.progress = '...';
        }
        return QR.status();
      };
    }

    let cb = function(response) {
      if (response != null) {
        QR.currentCaptcha = response;
        if (QR.captcha === Captcha.v2) {
          if (response.challenge != null) {
            options.form.append('recaptcha_challenge_field', response.challenge);
            options.form.append('recaptcha_response_field', response.response);
          } else {
            options.form.append('g-recaptcha-response', response.response);
          }
        } else {
          for (var key in response) {
            var val = response[key];
            options.form.append(key, val);
          }
        }
      }
      QR.req = $.ajax(`https://sys.${location.hostname.split('.')[1]}.org/${g.BOARD}/post`, options);
      return QR.req.progress = '...';
    };

    if (typeof captcha === 'function') {
      // Wait for captcha to be verified before submitting post.
      QR.req = {
        progress: '...',
        abort() {
          if (QR.captcha === Captcha.v2) {
            Captcha.cache.abort();
          }
          return cb = null;
        }
      };
      captcha(function(response) {
        if ((QR.captcha === Captcha.v2) && Captcha.cache.haveCookie()) {
          cb?.();
          if (response) { return Captcha.cache.save(response); }
        } else if (response) {
          return cb?.(response);
        } else {
          delete QR.req;
          post.unlock();
          QR.cooldown.auto = !!Captcha.cache.getCount();
          return QR.status();
        }
      });
    } else {
      cb(captcha);
    }

    // Starting to upload might take some time.
    // Provide some feedback that we're starting to submit.
    return QR.status();
  },

  response() {
    let connErr, err;
    if (this !== QR.req) { return; } // aborted
    delete QR.req;

    const post = QR.posts[0];
    post.unlock();

    if (err = this.response?.getElementById('errmsg')) { // error!
      // TODO: check if exists
      $('a', err).target = '_blank'; // duplicate image link
    } else if (connErr = (!this.response || (this.response.title !== 'Post successful!'))) {
      err = QR.connectionError();
      if ((QR.captcha === Captcha.v2) && QR.currentCaptcha) { Captcha.cache.save(QR.currentCaptcha); }
    } else if (this.status !== 200) {
      err = `Error ${this.statusText} (${this.status})`;
    }

    if (!connErr) { QR.captcha.setUsed?.(); }
    delete QR.currentCaptcha;

    if (err) {
      let m;
      QR.errorCount = (QR.errorCount || 0) + 1;
      if (/captcha|verification/i.test(err.textContent) || connErr) {
        // Remove the obnoxious 4chan Pass ad.
        if (/mistyped/i.test(err.textContent)) {
          err = 'You mistyped the CAPTCHA, or the CAPTCHA malfunctioned.';
        } else if (/expired/i.test(err.textContent)) {
          err = 'This CAPTCHA is no longer valid because it has expired.';
        }
        if (QR.errorCount >= 5) {
          // Too many posting errors can ban you. Stop autoposting after 5 errors.
          QR.cooldown.auto = false;
        } else {
          // Something must've gone terribly wrong if you get captcha errors without captchas.
          // Don't auto-post indefinitely in that case.
          QR.cooldown.auto = QR.captcha.isEnabled || connErr;
          // Too many frequent mistyped captchas will auto-ban you!
          // On connection error, the post most likely didn't go through.
          // If the post did go through, it should be stopped by the duplicate reply cooldown.
          QR.cooldown.addDelay(post, 2);
        }
      } else if (err.textContent && (m = err.textContent.match(/\d+\s+(?:minute|second)/gi)) && !/duplicate|hour/i.test(err.textContent)) {
        QR.cooldown.auto = !/have\s+been\s+muted/i.test(err.textContent);
        let seconds = 0;
        for (var mi of m) {
          seconds += (/minute/i.test(mi) ? 60 : 1) * (+mi.match(/\d+/)[0]);
        }
        if (/muted/i.test(err.textContent)) {
          QR.cooldown.addMute(seconds);
        } else {
          QR.cooldown.addDelay(post, seconds);
        }
      } else { // stop auto-posting
        QR.cooldown.auto = false;
      }
      QR.captcha.setup(QR.cooldown.auto && [QR.nodes.status, d.body].includes(d.activeElement));
      QR.status();
      QR.error(err);
      return;
    }

    delete QR.errorCount;

    const h1 = $('h1', this.response);

    let [_, threadID, postID] = Array.from(h1.nextSibling.textContent.match(/thread:(\d+),no:(\d+)/));
    postID   = +postID;
    threadID = +threadID || postID;
    const isReply  = threadID !== postID;

    // Post/upload confirmed as successful.
    $.event('QRPostSuccessful', {
      boardID: g.BOARD.ID,
      threadID,
      postID
    });
    // XXX deprecated
    $.event('QRPostSuccessful_', {boardID: g.BOARD.ID, threadID, postID});

    // Enable auto-posting if we have stuff left to post, disable it otherwise.
    const postsCount = QR.posts.length - 1;
    QR.cooldown.auto = postsCount && isReply;

    const lastPostToThread = !((function() { for (var p of QR.posts.slice(1)) { if (p.thread === post.thread) { return true; } } })());

    if (postsCount) {
      post.rm();
      QR.captcha.setup(d.activeElement === QR.nodes.status);
    } else if (Conf['Persistent QR']) {
      post.rm();
      if (Conf['Auto Hide QR']) {
        QR.hide();
      } else {
        QR.blur();
      }
    } else {
      QR.close();
    }

    QR.cleanNotifications();
    if (Conf['Posting Success Notifications']) {
      QR.notifications.push(new Notice('success', h1.textContent, 5));
    }

    QR.cooldown.add(threadID, postID);

    const URL = threadID === postID ? ( // new thread
      `${window.location.origin}/${g.BOARD}/thread/${threadID}`
    ) : (threadID !== g.THREADID) && lastPostToThread && Conf['Open Post in New Tab'] ? ( // replying from the index or a different thread
      `${window.location.origin}/${g.BOARD}/thread/${threadID}#p${postID}`
    ) : undefined;

    if (URL) {
      const open = Conf['Open Post in New Tab'] || postsCount ?
        () => $.open(URL)
      :
        () => location.href = URL;

      if (threadID === postID) {
        // XXX 4chan sometimes responds before the thread exists.
        QR.waitForThread(URL, open);
      } else {
        open();
      }
    }

    return QR.status();
  },

  waitForThread(url, cb) {
    let attempts = 0;
    var check = function() {
      return $.ajax(url, {
        onloadend() {
          attempts++;
          if ((attempts >= 6) || (this.status === 200)) {
            return cb();
          } else {
            return setTimeout(check, attempts * $.SECOND);
          }
        },
        responseType: 'text',
        type: 'HEAD'
      }
      );
    };
    return check();
  },

  abort() {
    let oldReq;
    if ((oldReq = QR.req) && !QR.req.isUploadFinished) {
      delete QR.req;
      oldReq.abort();
      if ((QR.captcha === Captcha.v2) && QR.currentCaptcha) { Captcha.cache.save(QR.currentCaptcha); }
      delete QR.currentCaptcha;
      QR.posts[0].unlock();
      QR.cooldown.auto = false;
      QR.notifications.push(new Notice('info', 'QR upload aborted.', 5));
    }
    return QR.status();
  }
};
