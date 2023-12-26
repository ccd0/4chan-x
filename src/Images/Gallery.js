/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import galleryPage from './Gallery/Gallery.html';
import $ from '../platform/$';
import Callbacks from '../classes/Callbacks';
import Notice from '../classes/Notice';
import Main from '../main/Main';
import Keybinds from '../Miscellaneous/Keybinds';
import $$ from '../platform/$$';
import ImageCommon from './ImageCommon';
import Sauce from './Sauce';
import Volume from './Volume';
import Header from '../General/Header';
import { Conf, d, doc, g } from '../globals/globals';
import UI from '../General/UI';
import Get from '../General/Get';
import { debounce, dict, SECOND } from '../platform/helpers';

var Gallery = {
  init() {
    if (!(this.enabled = Conf['Gallery'] && ['index', 'thread'].includes(g.VIEW))) { return; }

    this.delay = Conf['Slide Delay'];

    const el = $.el('a', {
      href: 'javascript:;',
      title: 'Gallery',
      className: 'fa fa-picture-o',
      textContent: 'Gallery'
    }
    );

    $.on(el, 'click', this.cb.toggle);

    Header.addShortcut('gallery', el, 530);

    return Callbacks.Post.push({
      name: 'Gallery',
      cb:   this.node
    });
  },

  node() {
    return (() => {
      const result = [];
      for (var file of this.files) {
        if (file.thumb) {
          if (Gallery.nodes) {
            Gallery.generateThumb(this, file);
            Gallery.nodes.total.textContent = Gallery.images.length;
          }

          if (!Conf['Image Expansion'] && ((g.SITE.software !== 'tinyboard') || !Main.jsEnabled)) {
            result.push($.on(file.thumbLink, 'click', Gallery.cb.image));
          } else {
            result.push(undefined);
          }
        }
      }
      return result;
    })();
  },

  build(image) {
    let dialog, thumb;
    const {cb} = Gallery;

    if (Conf['Fullscreen Gallery']) {
      $.one(d, 'fullscreenchange mozfullscreenchange webkitfullscreenchange', () => $.on(d, 'fullscreenchange mozfullscreenchange webkitfullscreenchange', cb.close));
      doc.mozRequestFullScreen?.();
      doc.webkitRequestFullScreen?.(Element.ALLOW_KEYBOARD_INPUT);
    }

    Gallery.images  = [];
    const nodes = (Gallery.nodes = {});
    Gallery.fileIDs = dict();
    Gallery.slideshow = false;

    nodes.el = (dialog = $.el('div',
      {id: 'a-gallery'}));
    $.extend(dialog, {innerHTML: galleryPage });

    const object = {
      buttons: '.gal-buttons',
      frame:   '.gal-image',
      name:    '.gal-name',
      count:   '.count',
      total:   '.total',
      sauce:   '.gal-sauce',
      thumbs:  '.gal-thumbnails',
      next:    '.gal-image a',
      current: '.gal-image img'
    };
    for (var key in object) { var value = object[key]; nodes[key] = $(value, dialog); }

    const menuButton = $('.menu-button', dialog);
    nodes.menu = new UI.Menu('gallery');

    $.on(nodes.frame, 'click', cb.blank);
    if (Conf['Mouse Wheel Volume']) { $.on(nodes.frame, 'wheel', Volume.wheel); }
    $.on(nodes.next,  'click', cb.click);
    $.on(nodes.name,  'click', ImageCommon.download);

    $.on($('.gal-prev',  dialog), 'click', cb.prev);
    $.on($('.gal-next',  dialog), 'click', cb.next);
    $.on($('.gal-start', dialog), 'click', cb.start);
    $.on($('.gal-stop',  dialog), 'click', cb.stop);
    $.on($('.gal-close', dialog), 'click', cb.close);

    $.on(menuButton, 'click', function(e) {
      return nodes.menu.toggle(e, this, g);
    });

    for (var entry of Gallery.menu.createSubEntries()) {
      entry.order = 0;
      nodes.menu.addEntry(entry);
    }

    $.on(d, 'keydown', cb.keybinds);
    if (Conf['Keybinds']) { $.off(d, 'keydown', Keybinds.keydown); }

    $.on(window, 'resize', Gallery.cb.setHeight);

    for (var postThumb of $$(g.SITE.selectors.file.thumb)) {
      var post;
      if (!(post = Get.postFromNode(postThumb))) { continue; }
      for (var file of post.files) {
        if (file.thumb) {
          Gallery.generateThumb(post, file);
          // If no image to open is given, pick image we have scrolled to.
          if (!image && Gallery.fileIDs[`${post.fullID}.${file.index}`]) {
            var candidate = file.thumbLink;
            if ((Header.getTopOf(candidate) + candidate.getBoundingClientRect().height) >= 0) {
              image = candidate;
            }
          }
        }
      }
    }
    $.addClass(doc, 'gallery-open');

    $.add(d.body, dialog);

    nodes.thumbs.scrollTop = 0;
    nodes.current.parentElement.scrollTop = 0;

    if (image) { thumb = $(`[href='${image.href}']`, nodes.thumbs); }
    if (!thumb) { thumb = Gallery.images[Gallery.images.length-1]; }
    if (thumb) { Gallery.open(thumb); }

    doc.style.overflow = 'hidden';
    return nodes.total.textContent = Gallery.images.length;
  },

  generateThumb(post, file) {
    if (post.isClone || post.isHidden) { return; }
    if (!file || !file.thumb || (!file.isImage && !file.isVideo && !Conf['PDF in Gallery'])) { return; }
    if (Gallery.fileIDs[`${post.fullID}.${file.index}`]) { return; }

    Gallery.fileIDs[`${post.fullID}.${file.index}`] = true;

    const thumb = $.el('a', {
      className: 'gal-thumb',
      href:      file.url,
      target:    '_blank',
      title:     file.name
    }
    );

    thumb.dataset.id   = Gallery.images.length;
    thumb.dataset.post = post.fullID;
    thumb.dataset.file = file.index;

    const thumbImg = file.thumb.cloneNode(false);
    thumbImg.style.cssText = '';
    $.add(thumb, thumbImg);

    $.on(thumb, 'click', Gallery.cb.open);

    Gallery.images.push(thumb);
    return $.add(Gallery.nodes.thumbs, thumb);
  },

  load(thumb, errorCB) {
    const ext = thumb.href.match(/\w*$/);
    const elType = $.getOwn({'webm': 'video', 'mp4': 'video', 'ogv': 'video', 'pdf': 'iframe'}, ext) || 'img';
    const file = $.el(elType);
    $.extend(file.dataset, thumb.dataset);
    $.on(file, 'error', errorCB);
    file.src = thumb.href;
    return file;
  },

  open(thumb) {
    let el, file, post;
    const {nodes} = Gallery;
    const oldID = +nodes.current.dataset.id;
    const newID = +thumb.dataset.id;

    // Highlight, center selected thumbnail
    if (el = Gallery.images[oldID]) { $.rmClass(el,    'gal-highlight'); }
    $.addClass(thumb, 'gal-highlight');
    nodes.thumbs.scrollTop = (thumb.offsetTop + (thumb.offsetHeight/2)) - (nodes.thumbs.clientHeight/2);

    // Load image or use preloaded image
    if (Gallery.cache?.dataset.id === (''+newID)) {
      file = Gallery.cache;
      $.off(file, 'error', Gallery.cacheError);
      $.on(file, 'error', Gallery.error);
    } else {
      file = Gallery.load(thumb, Gallery.error);
    }

    // Replace old image with new one
    $.off(nodes.current, 'error', Gallery.error);
    ImageCommon.pause(nodes.current);
    $.replace(nodes.current, file);
    nodes.current = file;

    if (file.nodeName === 'VIDEO') {
      file.loop = true;
      Volume.setup(file);
      if (Conf['Autoplay']) { file.play(); }
      if (Conf['Show Controls']) { ImageCommon.addControls(file); }
    }

    doc.classList.toggle('gal-pdf', file.nodeName === 'IFRAME');
    Gallery.cb.setHeight();
    nodes.count.textContent = +thumb.dataset.id + 1;
    nodes.name.download     = (nodes.name.textContent = thumb.title);
    nodes.name.href         = thumb.href;
    nodes.frame.scrollTop   = 0;
    nodes.next.focus();

    // Set sauce links
    $.rmAll(nodes.sauce);
    if (Conf['Sauce'] && Sauce.links && (post = g.posts.get(file.dataset.post))) {
      const sauces = [];
      for (var link of Sauce.links) {
        var node;
        if (node = Sauce.createSauceLink(link, post, post.files[+file.dataset.file])) {
          sauces.push($.tn(' '), node);
        }
      }
      $.add(nodes.sauce, sauces);
    }

    // Continue slideshow if moving forward, stop otherwise
    if (Gallery.slideshow && ((newID > oldID) || ((oldID === (Gallery.images.length-1)) && (newID === 0)))) {
      Gallery.setupTimer();
    } else {
      Gallery.cb.stop();
    }

    // Scroll to post
    if (Conf['Scroll to Post'] && (post = g.posts.get(file.dataset.post))) {
      Header.scrollTo(post.nodes.root);
    }

    // Preload next image
    if (isNaN(oldID) || (newID === ((oldID + 1) % Gallery.images.length))) {
      return Gallery.cache = Gallery.load(Gallery.images[(newID + 1) % Gallery.images.length], Gallery.cacheError);
    }
  },

  error() {
    if (this.error?.code === MediaError.MEDIA_ERR_DECODE) {
      return new Notice('error', 'Corrupt or unplayable video', 30);
    }
    if (ImageCommon.isFromArchive(this)) { return; }
    const post = g.posts.get(this.dataset.post);
    const file = post.files[+this.dataset.file];
    return ImageCommon.error(this, post, file, null, url => {
      if (!url) { return; }
      Gallery.images[+this.dataset.id].href = url;
      if (Gallery.nodes.current === this) { return this.src = url; }
    });
  },

  cacheError() {
    return delete Gallery.cache;
  },

  cleanupTimer() {
    clearTimeout(Gallery.timeoutID);
    const {current} = Gallery.nodes;
    $.off(current, 'canplaythrough load', Gallery.startTimer);
    return $.off(current, 'ended', Gallery.cb.next);
  },

  startTimer() {
    return Gallery.timeoutID = setTimeout(Gallery.checkTimer, Gallery.delay * SECOND);
  },

  setupTimer() {
    Gallery.cleanupTimer();
    const {current} = Gallery.nodes;
    const isVideo = current.nodeName === 'VIDEO';
    if (isVideo) { current.play(); }
    if ((isVideo ? current.readyState >= 4 : current.complete) || (current.nodeName === 'IFRAME')) {
      return Gallery.startTimer();
    } else {
      return $.on(current, (isVideo ? 'canplaythrough' : 'load'), Gallery.startTimer);
    }
  },

  checkTimer() {
    const {current} = Gallery.nodes;
    if ((current.nodeName === 'VIDEO') && !current.paused) {
      $.on(current, 'ended', Gallery.cb.next);
      return current.loop = false;
    } else {
      return Gallery.cb.next();
    }
  },

  cb: {
    keybinds(e) {
      let key;
      if (!(key = Keybinds.keyCode(e))) { return; }

      const cb = (() => { switch (key) {
        case Conf['Close']: case Conf['Open Gallery']:
          return Gallery.cb.close;
        case Conf['Next Gallery Image']:
          return Gallery.cb.next;
        case Conf['Advance Gallery']:
          return Gallery.cb.advance;
        case Conf['Previous Gallery Image']:
          return Gallery.cb.prev;
        case Conf['Pause']:
          return Gallery.cb.pause;
        case Conf['Slideshow']:
          return Gallery.cb.toggleSlideshow;
        case Conf['Rotate image anticlockwise']:
          return Gallery.cb.rotateLeft;
        case Conf['Rotate image clockwise']:
          return Gallery.cb.rotateRight;
        case Conf['Download Gallery Image']:
          return Gallery.cb.download;
      } })();

      if (!cb) { return; }
      e.stopPropagation();
      e.preventDefault();
      return cb();
    },

    open(e) {
      if (e) { e.preventDefault(); }
      if (this) { return Gallery.open(this); }
    },

    image(e) {
      e.preventDefault();
      e.stopPropagation();
      return Gallery.build(this);
    },

    prev() {
      return Gallery.cb.open.call(
        Gallery.images[+Gallery.nodes.current.dataset.id - 1] || Gallery.images[Gallery.images.length - 1]
      );
    },
    next() {
      return Gallery.cb.open.call(
        Gallery.images[+Gallery.nodes.current.dataset.id + 1] || Gallery.images[0]
      );
    },

    click(e) {
      if (ImageCommon.onControls(e)) { return; }
      e.preventDefault();
      return Gallery.cb.advance();
    },

    advance() { if (!Conf['Autoplay'] && Gallery.nodes.current.paused) { return Gallery.nodes.current.play(); } else { return Gallery.cb.next(); } },
    toggle() { return (Gallery.nodes ? Gallery.cb.close : Gallery.build)(); },
    blank(e) { if (e.target === this) { return Gallery.cb.close(); } },
    toggleSlideshow() {  return Gallery.cb[Gallery.slideshow ? 'stop' : 'start'](); },

    download() {
      const name = $('.gal-name');
      return name.click();
    },

    pause() {
      Gallery.cb.stop();
      const {current} = Gallery.nodes;
      if (current.nodeName === 'VIDEO') { return current[current.paused ? 'play' : 'pause'](); }
    },

    start() {
      $.addClass(Gallery.nodes.buttons, 'gal-playing');
      Gallery.slideshow = true;
      return Gallery.setupTimer();
    },

    stop() {
      if (!Gallery.slideshow) { return; }
      Gallery.cleanupTimer();
      const {current} = Gallery.nodes;
      if (current.nodeName === 'VIDEO') { current.loop = true; }
      $.rmClass(Gallery.nodes.buttons, 'gal-playing');
      return Gallery.slideshow = false;
    },

    rotateLeft() { return Gallery.cb.rotate(270); },
    rotateRight() { return Gallery.cb.rotate(90); },

    rotate: debounce(100, function(delta) {
      const {current} = Gallery.nodes;
      if (current.nodeName === 'IFRAME') { return; }
      current.dataRotate = ((current.dataRotate || 0) + delta) % 360;
      current.style.transform = `rotate(${current.dataRotate}deg)`;
      return Gallery.cb.setHeight();
    }),

    close() {
      $.off(Gallery.nodes.current, 'error', Gallery.error);
      ImageCommon.pause(Gallery.nodes.current);
      $.rm(Gallery.nodes.el);
      $.rmClass(doc, 'gallery-open');
      if (Conf['Fullscreen Gallery']) {
        $.off(d, 'fullscreenchange mozfullscreenchange webkitfullscreenchange', Gallery.cb.close);
        d.mozCancelFullScreen?.();
        d.webkitExitFullscreen?.();
      }
      delete Gallery.nodes;
      delete Gallery.fileIDs;
      doc.style.overflow = '';

      $.off(d, 'keydown', Gallery.cb.keybinds);
      if (Conf['Keybinds']) { $.on(d, 'keydown', Keybinds.keydown); }
      $.off(window, 'resize', Gallery.cb.setHeight);
      return clearTimeout(Gallery.timeoutID);
    },

    setFitness() {
      return (this.checked ? $.addClass : $.rmClass)(doc, `gal-${this.name.toLowerCase().replace(/\s+/g, '-')}`);
    },

    setHeight: debounce(100, function () {
      let dim, margin, minHeight;
      const {current, frame} = Gallery.nodes;
      const {style} = current;

      if (Conf['Stretch to Fit'] && (dim = g.posts.get(current.dataset.post)?.files[+current.dataset.file].dimensions)) {
        const [width, height] = Array.from(dim.split('x'));
        let containerWidth = frame.clientWidth;
        let containerHeight = doc.clientHeight - 25;
        if (((current.dataRotate || 0) % 180) === 90) {
          [containerWidth, containerHeight] = Array.from([containerHeight, containerWidth]);
        }
        minHeight = Math.min(containerHeight, (height / width) * containerWidth);
        style.minHeight = minHeight + 'px';
        style.minWidth = ((width / height) * minHeight) + 'px';
      } else {
        style.minHeight = (style.minWidth = '');
      }

      if (((current.dataRotate || 0) % 180) === 90) {
        style.maxWidth  = Conf['Fit Height'] ? `${doc.clientHeight - 25}px` : 'none';
        style.maxHeight = Conf['Fit Width']  ? `${frame.clientWidth}px`     : 'none';
        margin = (current.clientWidth - current.clientHeight)/2;
        return style.margin = `${margin}px ${-margin}px`;
      } else {
        return style.maxWidth = (style.maxHeight = (style.margin = ''));
      }
    }),

    setDelay() { return Gallery.delay = +this.value; }
  },

  menu: {
    init() {
      if (!Gallery.enabled) { return; }

      const el = $.el('span', {
        textContent: 'Gallery',
        className: 'gallery-link'
      }
      );

      return Header.menu.addEntry({
        el,
        order: 105,
        subEntries: Gallery.menu.createSubEntries()
      });
    },

    createSubEntry(name) {
      const label = UI.checkbox(name, name);
      const input = label.firstElementChild;
      if (['Hide Thumbnails', 'Fit Width', 'Fit Height'].includes(name)) { $.on(input, 'change', Gallery.cb.setFitness); }
      $.event('change', null, input);
      $.on(input, 'change', $.cb.checked);
      if (['Hide Thumbnails', 'Fit Width', 'Fit Height', 'Stretch to Fit'].includes(name)) { $.on(input, 'change', Gallery.cb.setHeight); }
      return {el: label};
    },

    createSubEntries() {
      const subEntries = (['Hide Thumbnails', 'Fit Width', 'Fit Height', 'Stretch to Fit', 'Scroll to Post'].map((item) => Gallery.menu.createSubEntry(item)));

      const delayLabel = $.el('label', {innerHTML: 'Slide Delay: <input type="number" name="Slide Delay" min="0" step="any" class="field">'});
      const delayInput = delayLabel.firstElementChild;
      delayInput.value = Gallery.delay;
      $.on(delayInput, 'change', Gallery.cb.setDelay);
      $.on(delayInput, 'change', $.cb.value);
      subEntries.push({el: delayLabel});

      return subEntries;
    }
  }
};
export default Gallery;
