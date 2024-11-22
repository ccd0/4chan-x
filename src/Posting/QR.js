import QuickReplyPage from './QR/QuickReply.html';
import $ from '../platform/$';
import Callbacks from '../classes/Callbacks';
import Notice from '../classes/Notice';
import Main from '../main/Main';
import Favicon from '../Monitoring/Favicon';
import $$ from '../platform/$$';
import CrossOrigin from '../platform/CrossOrigin';
import Captcha from './Captcha';
import meta from '../../package.json';
import Header from '../General/Header';
import { Conf, E, d, doc, g } from '../globals/globals';
import Menu from '../Menu/Menu';
import UI from '../General/UI';
import BoardConfig from '../General/BoardConfig';
import Get from '../General/Get';
import { DAY, dict, SECOND } from '../platform/helpers';

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */

var QR = {
  mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/vnd.adobe.flash.movie', 'application/x-shockwave-flash', 'video/webm', 'video/mp4'],

  validExtension: /\.(jpe?g|png|gif|pdf|swf|webm|mp4)$/i,

  typeFromExtension: {
    'jpg':  'image/jpeg',
    'jpeg': 'image/jpeg',
    'png':  'image/png',
    'gif':  'image/gif',
    'pdf':  'application/pdf',
    'swf':  'application/vnd.adobe.flash.movie',
    'webm': 'video/webm',
    'mp4': 'video/mp4'
  },

  extensionFromType: {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'application/pdf': 'pdf',
    'application/vnd.adobe.flash.movie': 'swf',
    'application/x-shockwave-flash': 'swf',
    'video/webm': 'webm',
    'video/mp4': 'mp4'
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
      $.extend(link, {
        innerHTML:
          `<a href="javascript:;" class="qr-link">${g.VIEW === "thread" ? "Reply to Thread" : "Start a Thread"}</a>`
      });

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
        , 7 * SECOND);
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
    $.extend(div, {
      innerHTML:
        'Could not open file. [<a href="' + E(meta.faq) + '#error-reading-metadata" target="_blank">More info</a>]'
    });
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
      const el = $('a', err);
      if (el) el.target = '_blank'; // duplicate image link
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
            return setTimeout(check, attempts * SECOND);
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
  },

  cooldown: {
    seconds: 0,
    delays: {
      deletion: 60
    }, // cooldown for deleting posts/files

    // Called from Main
    init() {
      if (!Conf['Quick Reply']) { return; }
      this.data = Conf['cooldowns'];
      this.changes = dict();
      return $.sync('cooldowns', this.sync);
    },

    // Called from QR
    setup() {
      // Read cooldown times
      $.extend(QR.cooldown.delays, g.BOARD.cooldowns());

      // The longest reply cooldown, for use in pruning old reply data
      QR.cooldown.maxDelay = 0;
      for (var type in QR.cooldown.delays) {
        var delay = QR.cooldown.delays[type];
        if (!['thread', 'thread_global'].includes(type)) {
          QR.cooldown.maxDelay = Math.max(QR.cooldown.maxDelay, delay);
        }
      }

      QR.cooldown.isSetup = true;
      return QR.cooldown.start();
    },

    start() {
      const { data } = QR.cooldown;
      if (
        !Conf['Cooldown'] ||
        !QR.cooldown.isSetup ||
        !!QR.cooldown.isCounting ||
        ((Object.keys(data[g.BOARD.ID] || {}).length + Object.keys(data.global || {}).length) <= 0)
      ) { return; }
      QR.cooldown.isCounting = true;
      return QR.cooldown.count();
    },

    sync(data) {
      QR.cooldown.data = data || dict();
      return QR.cooldown.start();
    },

    add(threadID, postID) {
      if (!Conf['Cooldown']) { return; }
      const start = Date.now();
      const boardID = g.BOARD.ID;
      QR.cooldown.set(boardID, start, { threadID, postID });
      if (threadID === postID) { QR.cooldown.set('global', start, { boardID, threadID, postID }); }
      QR.cooldown.save();
      return QR.cooldown.start();
    },

    addDelay(post, delay) {
      if (!Conf['Cooldown']) { return; }
      const cooldown = QR.cooldown.categorize(post);
      cooldown.delay = delay;
      QR.cooldown.set(g.BOARD.ID, Date.now(), cooldown);
      QR.cooldown.save();
      return QR.cooldown.start();
    },

    addMute(delay) {
      if (!Conf['Cooldown']) { return; }
      QR.cooldown.set(g.BOARD.ID, Date.now(), { type: 'mute', delay });
      QR.cooldown.save();
      return QR.cooldown.start();
    },

    delete(post) {
      let cooldown;
      if (!QR.cooldown.data) { return; }
      const cooldowns = (QR.cooldown.data[post.board.ID] || (QR.cooldown.data[post.board.ID] = dict()));
      for (var id in cooldowns) {
        cooldown = cooldowns[id];
        if ((cooldown.delay == null) && (cooldown.threadID === post.thread.ID) && (cooldown.postID === post.ID)) {
          QR.cooldown.set(post.board.ID, id, null);
        }
      }
      return QR.cooldown.save();
    },

    secondsDeletion(post) {
      if (!QR.cooldown.data || !Conf['Cooldown']) { return 0; }
      const cooldowns = QR.cooldown.data[post.board.ID] || dict();
      for (var start in cooldowns) {
        var cooldown = cooldowns[start];
        if ((cooldown.delay == null) && (cooldown.threadID === post.thread.ID) && (cooldown.postID === post.ID)) {
          var seconds = QR.cooldown.delays.deletion - Math.floor((Date.now() - start) / SECOND);
          return Math.max(seconds, 0);
        }
      }
      return 0;
    },

    categorize(post) {
      if (post.thread === 'new') {
        return { type: 'thread' };
      } else {
        return {
          type: !!post.file ? 'image' : 'reply',
          threadID: +post.thread
        };
      }
    },

    mergeChange(data, scope, id, value) {
      if (value) {
        return (data[scope] || (data[scope] = dict()))[id] = value;
      } else if (scope in data) {
        delete data[scope][id];
        if (Object.keys(data[scope]).length === 0) { return delete data[scope]; }
      }
    },

    set(scope, id, value) {
      QR.cooldown.mergeChange(QR.cooldown.data, scope, id, value);
      return (QR.cooldown.changes[scope] || (QR.cooldown.changes[scope] = dict()))[id] = value;
    },

    save() {
      const { changes } = QR.cooldown;
      if (!Object.keys(changes).length) { return; }
      return $.get('cooldowns', dict(), function ({ cooldowns }) {
        for (var scope in QR.cooldown.changes) {
          for (var id in QR.cooldown.changes[scope]) {
            var value = QR.cooldown.changes[scope][id];
            QR.cooldown.mergeChange(cooldowns, scope, id, value);
          }
          QR.cooldown.data = cooldowns;
        }
        return $.set('cooldowns', cooldowns, () => QR.cooldown.changes = dict());
      });
    },

    clear() {
      QR.cooldown.data = dict();
      QR.cooldown.changes = dict();
      QR.cooldown.auto = false;
      QR.cooldown.update();
      return $.queueTask($.delete, 'cooldowns');
    },

    update() {
      let cooldown;
      if (!QR.cooldown.isCounting) { return; }

      let save = false;
      let nCooldowns = 0;
      const now = Date.now();
      const { type, threadID } = QR.cooldown.categorize(QR.posts[0]);
      let seconds = 0;

      if (Conf['Cooldown']) {
        for (var scope of [g.BOARD.ID, 'global']) {
          var cooldowns = (QR.cooldown.data[scope] || (QR.cooldown.data[scope] = dict()));

          for (var start in cooldowns) {
            cooldown = cooldowns[start];
            start = +start;
            var elapsed = Math.floor((now - start) / SECOND);
            if (elapsed < 0) { // clock changed since then?
              QR.cooldown.set(scope, start, null);
              save = true;
              continue;
            }

            // Explicit delays from error messages
            if (cooldown.delay != null) {
              if (cooldown.delay <= elapsed) {
                QR.cooldown.set(scope, start, null);
                save = true;
              } else if (((cooldown.type === type) && (cooldown.threadID === threadID)) || (cooldown.type === 'mute')) {
                // Delays only apply to the given post type and thread.
                seconds = Math.max(seconds, cooldown.delay - elapsed);
              }
              continue;
            }

            // Clean up expired cooldowns
            var maxDelay = cooldown.threadID !== cooldown.postID ?
              QR.cooldown.maxDelay
              :
              QR.cooldown.delays[scope === 'global' ? 'thread_global' : 'thread'];
            if (QR.cooldown.customCooldown) {
              maxDelay = Math.max(maxDelay, parseInt(Conf['customCooldown'], 10));
            }
            if (maxDelay <= elapsed) {
              QR.cooldown.set(scope, start, null);
              save = true;
              continue;
            }

            if (((type === 'thread') === (cooldown.threadID === cooldown.postID)) && (cooldown.boardID !== g.BOARD.ID)) {
              // Only cooldowns relevant to this post can set the seconds variable:
              //   reply cooldown with a reply, thread cooldown with a thread.
              // Inter-board thread cooldowns only apply on boards other than the one they were posted on.
              var suffix = scope === 'global' ?
                '_global'
                :
                '';
              seconds = Math.max(seconds, QR.cooldown.delays[type + suffix] - elapsed);

              // If additional cooldown is enabled, add the configured seconds to the count.
              if (QR.cooldown.customCooldown) {
                seconds = Math.max(seconds, parseInt(Conf['customCooldown'], 10) - elapsed);
              }
            }
          }

          nCooldowns += Object.keys(cooldowns).length;
        }
      }

      if (save) { QR.cooldown.save; }

      if (nCooldowns) {
        clearTimeout(QR.cooldown.timeout);
        QR.cooldown.timeout = setTimeout(QR.cooldown.count, SECOND);
      } else {
        delete QR.cooldown.isCounting;
      }

      // Update the status when we change posting type.
      // Don't get stuck at some random number.
      // Don't interfere with progress status updates.
      const update = seconds !== QR.cooldown.seconds;
      QR.cooldown.seconds = seconds;
      if (update) { return QR.status(); }
    },

    count() {
      QR.cooldown.update();
      if ((QR.cooldown.seconds === 0) && QR.cooldown.auto && !QR.req) { return QR.submit(); }
    }
  },

  oekaki: {
    menu: {
      init() {
        if (!['index', 'thread'].includes(g.VIEW) || !Conf['Menu'] || !Conf['Edit Link'] || !Conf['Quick Reply']) { return; }

        const a = $.el('a', {
          className: 'edit-link',
          href: 'javascript:;',
          textContent: 'Edit image'
        }
        );
        $.on(a, 'click', this.editFile);

        return Menu.menu.addEntry({
          el: a,
          order: 90,
          open(post) {
            QR.oekaki.menu.post = post;
            const { file } = post;
            return QR.postingIsEnabled && !!file && (file.isImage || file.isVideo);
          }
        });
      },

      editFile() {
        const { post } = QR.oekaki.menu;
        QR.quote.call(post.nodes.post);
        const { isVideo } = post.file;
        const currentTime = post.file.fullImage?.currentTime || 0;
        return CrossOrigin.file(post.file.url, function (blob) {
          if (!blob) {
            return QR.error("Can't load file.");
          } else if (isVideo) {
            const video = $.el('video');
            $.on(video, 'loadedmetadata', function () {
              $.on(video, 'seeked', function () {
                const canvas = $.el('canvas', {
                  width: video.videoWidth,
                  height: video.videoHeight
                }
                );
                canvas.getContext('2d').drawImage(video, 0, 0);
                return canvas.toBlob(function (snapshot) {
                  snapshot.name = post.file.name.replace(/\.\w+$/, '') + '.png';
                  QR.handleFiles([snapshot]);
                  return QR.oekaki.edit();
                });
              });
              return video.currentTime = currentTime;
            });
            $.on(video, 'error', () => QR.openError());
            return video.src = URL.createObjectURL(blob);
          } else {
            blob.name = post.file.name;
            QR.handleFiles([blob]);
            return QR.oekaki.edit();
          }
        });
      }
    },

    setup() {
      return $.global(function () {
        const { FCX } = window;
        FCX.oekakiCB = () => window.Tegaki.flatten().toBlob(function (file) {
          const source = `oekaki-${Date.now()}`;
          FCX.oekakiLatest = source;
          return document.dispatchEvent(new CustomEvent('QRSetFile', {
            bubbles: true,
            detail: { file, name: FCX.oekakiName, source }
          }));
        });
        if (window.Tegaki) {
          return document.querySelector('#qr .oekaki').hidden = false;
        }
      });
    },

    load(cb) {
      if ($('script[src^="//s.4cdn.org/js/tegaki"]', d.head)) {
        return cb();
      } else {
        const style = $.el('link', {
          rel: 'stylesheet',
          href: `//s.4cdn.org/css/tegaki.${Date.now()}.css`
        }
        );
        const script = $.el('script',
          { src: `//s.4cdn.org/js/tegaki.min.${Date.now()}.js` });
        let n = 0;
        const onload = function () {
          if (++n === 2) { return cb(); }
        };
        $.on(style, 'load', onload);
        $.on(script, 'load', onload);
        return $.add(d.head, [style, script]);
      }
    },

    draw() {
      return $.global(function () {
        const { Tegaki, FCX } = window;
        if (Tegaki.bg) { Tegaki.destroy(); }
        FCX.oekakiName = 'tegaki.png';
        return Tegaki.open({
          onDone: FCX.oekakiCB,
          onCancel() { return Tegaki.bgColor = '#ffffff'; },
          width: +document.querySelector('#qr [name=oekaki-width]').value,
          height: +document.querySelector('#qr [name=oekaki-height]').value,
          bgColor:
            document.querySelector('#qr [name=oekaki-bg]').checked ?
              document.querySelector('#qr [name=oekaki-bgcolor]').value
              :
              'transparent'
        });
      });
    },

    button() {
      if (QR.selected.file) {
        return QR.oekaki.edit();
      } else {
        return QR.oekaki.toggle();
      }
    },

    edit() {
      return QR.oekaki.load(() => $.global(function () {
        const { Tegaki, FCX } = window;
        const name = document.getElementById('qr-filename').value.replace(/\.\w+$/, '') + '.png';
        const { source } = document.getElementById('file-n-submit').dataset;
        const error = content => document.dispatchEvent(new CustomEvent('CreateNotification', {
          bubbles: true,
          detail: { type: 'warning', content, lifetime: 20 }
        }));
        var cb = function (e) {
          if (e) { this.removeEventListener('QRMetadata', cb, false); }
          const selected = document.getElementById('selected');
          if (!selected?.dataset.type) { return error('No file to edit.'); }
          if (!/^(image|video)\//.test(selected.dataset.type)) { return error('Not an image.'); }
          if (!selected.dataset.height) { return error('Metadata not available.'); }
          if (selected.dataset.height === 'loading') {
            selected.addEventListener('QRMetadata', cb, false);
            return;
          }
          if (Tegaki.bg) { Tegaki.destroy(); }
          FCX.oekakiName = name;
          Tegaki.open({
            onDone: FCX.oekakiCB,
            onCancel() { return Tegaki.bgColor = '#ffffff'; },
            width: +selected.dataset.width,
            height: +selected.dataset.height,
            bgColor: 'transparent'
          });
          const canvas = document.createElement('canvas');
          canvas.width = (canvas.naturalWidth = +selected.dataset.width);
          canvas.height = (canvas.naturalHeight = +selected.dataset.height);
          canvas.hidden = true;
          document.body.appendChild(canvas);
          canvas.addEventListener('QRImageDrawn', function () {
            this.remove();
            return Tegaki.onOpenImageLoaded.call(this);
          }
            , false);
          return canvas.dispatchEvent(new CustomEvent('QRDrawFile', { bubbles: true }));
        };
        if (Tegaki.bg && (Tegaki.onDoneCb === FCX.oekakiCB) && (source === FCX.oekakiLatest)) {
          FCX.oekakiName = name;
          return Tegaki.resume();
        } else {
          return cb();
        }
      }));
    },

    toggle() {
      return QR.oekaki.load(() => QR.nodes.oekaki.hidden = !QR.nodes.oekaki.hidden);
    }
  },

  persona: {
    always: {},
    types: {
      name: [],
      email: [],
      sub: []
    },

    init() {
      if (!Conf['Quick Reply'] && (!Conf['Menu'] || !Conf['Delete Link'])) { return; }
      for (var item of Conf['QR.personas'].split('\n')) {
        QR.persona.parseItem(item.trim());
      }
    },

    parseItem(item) {
      let match, needle, type, val;
      if (item[0] === '#') { return; }
      if (!(match = item.match(/(name|options|email|subject|password):"(.*)"/i))) { return; }
      [match, type, val] = Array.from(match);

      // Don't mix up item settings with val.
      item = item.replace(match, '');

      const boards = item.match(/boards:([^;]+)/i)?.[1].toLowerCase() || 'global';
      if ((boards !== 'global') && (needle = g.BOARD.ID, !boards.split(',').includes(needle))) { return; }


      if (type === 'password') {
        QR.persona.pwd = val;
        return;
      }

      if (type === 'options') { type = 'email'; }
      if (type === 'subject') { type = 'sub'; }

      if (/always/i.test(item)) {
        QR.persona.always[type] = val;
      }

      if (!QR.persona.types[type].includes(val)) {
        return QR.persona.types[type].push(val);
      }
    },

    load() {
      for (var type in QR.persona.types) {
        var arr = QR.persona.types[type];
        var list = $(`#list-${type}`, QR.nodes.el);
        for (var val of arr) {
          if (val) {
            $.add(list, $.el('option',
              { textContent: val })
            );
          }
        }
      }
    },

    getPassword() {
      let m;
      if (QR.persona.pwd != null) {
        return QR.persona.pwd;
      } else if (m = d.cookie.match(/4chan_pass=([^;]+)/)) {
        return decodeURIComponent(m[1]);
      } else {
        return '';
      }
    },

    get(cb) {
      return $.get('QR.persona', {}, ({ 'QR.persona': persona }) => cb(persona));
    },

    set(post) {
      return $.get('QR.persona', {}, function ({ 'QR.persona': persona }) {
        persona = {
          name: post.name,
          flag: post.flag
        };
        return $.set('QR.persona', persona);
      });
    }
  },

  post: class {
    constructor(select) {
      this.select = this.select.bind(this);
      const el = $.el('a', {
        className: 'qr-preview',
        draggable: true,
        href: 'javascript:;'
      }
      );
      $.extend(el, { innerHTML: '<a class="remove fa fa-times-circle" title="Remove"></a><label class="qr-preview-spoiler"><input type="checkbox"> Spoiler</label><span></span>' });

      this.nodes = {
        el,
        rm: el.firstChild,
        spoiler: $('.qr-preview-spoiler input', el),
        span: el.lastChild
      };

      $.on(el, 'click', this.select);
      $.on(this.nodes.rm, 'click', e => { e.stopPropagation(); return this.rm(); });
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
        (QR.posts[index - 1] || QR.posts[index + 1]).select();
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

    lock(lock = true) {
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
      const rectEl = this.nodes.el.getBoundingClientRect();
      const rectList = this.nodes.el.parentNode.getBoundingClientRect();
      this.nodes.el.parentNode.scrollLeft += (rectEl.left + (rectEl.width / 2)) - rectList.left - (rectList.width / 2);
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
      const { name } = input.dataset;
      if (!['thread', 'name', 'email', 'sub', 'com', 'filename', 'flag'].includes(name)) { return; }
      const prev = this[name] || input.dataset.default || null;
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
      const div = $.el('div', { className });
      $.extend(div, {
        innerHTML: message + (link ? ` [<a href="${E(link)}" target="_blank">More info</a>]` : '') +
          `<br>[<a href="javascript:;">delete post</a>] [<a href="javascript:;">delete all</a>]`
      });
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
        this.filename = `${Date.now() - Math.floor(Math.random() * 365 * DAY)}`;
        if (ext = this.file.name.match(QR.validExtension)) { this.filename += ext[0]; }
      } else {
        this.filename = this.file.name;
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
        this.fileError(`Corrupt ${isVideo ? 'video' : 'image'} or error reading metadata.`, meta.faq + '#error-reading-metadata');
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
        ({ height, width } = el);
        this.nodes.el.dataset.height = height;
        this.nodes.el.dataset.width = width;
        if ((height > QR.max_height) || (width > QR.max_width)) {
          this.fileError(`Image too large (image: ${height}x${width}px, max: ${QR.max_height}x${QR.max_width}px)`);
        }
        if ((height < QR.min_height) || (width < QR.min_width)) {
          return this.fileError(`Image too small (image: ${height}x${width}px, min: ${QR.min_height}x${QR.min_width}px)`);
        }
      } else {
        const { videoHeight, videoWidth, duration } = el;
        this.nodes.el.dataset.height = videoHeight;
        this.nodes.el.dataset.width = videoWidth;
        this.nodes.el.dataset.duration = duration;
        const max_height = Math.min(QR.max_height, QR.max_height_video);
        const max_width = Math.min(QR.max_width, QR.max_width_video);
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
        ({ height, width } = el);
        if ((height < s) || (width < s)) {
          this.URL = el.src;
          this.nodes.el.style.backgroundImage = `url(${this.URL})`;
          return;
        }
      }

      if (height <= width) {
        width = (s / height) * width;
        height = s;
      } else {
        height = (s / width) * height;
        width = s;
      }
      const cv = $.el('canvas');
      cv.height = height;
      cv.width = width;
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
        $.addClass(QR.nodes.oekaki, 'has-file');
        $.addClass(QR.nodes.fileSubmit, 'has-file');
      } else {
        $.rmClass(QR.nodes.oekaki, 'has-file');
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
        const { result } = e.target;
        this.setComment((this.com ? `${this.com}\n${result}` : result));
        return delete this.pasting;
      };
      return reader.readAsText(file);
    }

    dragStart(e) {
      const { left, top } = this.getBoundingClientRect();
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
      const el = $('.drag', this.parentNode);
      const index = el => [...Array.from(el.parentNode.children)].indexOf(el);
      const oldIndex = index(el);
      const newIndex = index(this);
      if (QR.posts[oldIndex].isLocked || QR.posts[newIndex].isLocked) { return; }
      (oldIndex < newIndex ? $.after : $.before)(this, el);
      const post = QR.posts.splice(oldIndex, 1)[0];
      QR.posts.splice(newIndex, 0, post);
      QR.status();
      return QR.captcha.updateThread?.();
    }
  }

};
export default QR;
