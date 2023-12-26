import Callbacks from "../classes/Callbacks";
import Config from "../config/Config";
import Get from "../General/Get";
import Header from "../General/Header";
import UI from "../General/UI";
import { Conf, d, doc, g } from "../globals/globals";
import Nav from "../Miscellaneous/Nav";
import $ from "../platform/$";
import { SECOND } from "../platform/helpers";
import ImageCommon from "./ImageCommon";
import Volume from "./Volume";

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var ImageExpand = {
  init() {
    if (!(this.enabled = Conf['Image Expansion'] && ['index', 'thread'].includes(g.VIEW))) { return; }

    this.EAI = $.el('a', {
      className: 'expand-all-shortcut fa fa-expand',
      textContent: 'EAI', 
      title: 'Expand All Images',
      href: 'javascript:;'
    }
    );

    $.on(this.EAI, 'click', this.cb.toggleAll);
    Header.addShortcut('expand-all', this.EAI, 520);
    $.on(d, 'scroll visibilitychange', this.cb.playVideos);
    this.videoControls = $.el('span', {className: 'video-controls'});
    $.extend(this.videoControls, {innerHTML: " <a href=\"javascript:;\" title=\"You can also contract the video by dragging it to the left.\">contract</a>"});

    return Callbacks.Post.push({
      name: 'Image Expansion',
      cb: this.node
    });
  },

  node() {
    if (!this.file || (!this.file.isImage && !this.file.isVideo)) { return; }
    $.on(this.file.thumbLink, 'click', ImageExpand.cb.toggle);

    if (this.isClone) { 
      if (this.file.isExpanding) {
        // If we clone a post where the image is still loading,
        // make it loading in the clone too.
        ImageExpand.contract(this);
        return ImageExpand.expand(this);

      } else if (this.file.isExpanded && this.file.isVideo) {
        Volume.setup(this.file.fullImage);
        ImageExpand.setupVideoCB(this);
        return ImageExpand.setupVideo(this, !this.origin.file.fullImage?.paused || this.origin.file.wasPlaying, this.file.fullImage.controls);
      }

    } else if (ImageExpand.on && !this.isHidden && !this.isFetchedQuote &&
      (Conf['Expand spoilers'] || !this.file.isSpoiler) &&
      (Conf['Expand videos'] || !this.file.isVideo)) {
        return ImageExpand.expand(this);
      }
  },

  cb: {
    toggle(e) {
      if ($.modifiedClick(e)) { return; }
      const post = Get.postFromNode(this);
      const {file} = post;
      if (file.isExpanded && ImageCommon.onControls(e)) { return; }
      e.preventDefault();
      if (!Conf['Autoplay'] && file.fullImage?.paused) {
        return file.fullImage.play();
      } else {
        return ImageExpand.toggle(post);
      }
    },

    toggleAll() {
      let func;
      $.event('CloseMenu');
      const threadRoot = Nav.getThread();
      const toggle = function(post) {
        const {file} = post;
        if (!file || (!file.isImage && !file.isVideo) || !doc.contains(post.nodes.root)) { return; }
        if (ImageExpand.on &&
          ((!Conf['Expand spoilers']  && file.isSpoiler) ||
          (!Conf['Expand videos']     && file.isVideo) ||
          (Conf['Expand from here']   && (Header.getTopOf(file.thumb) < 0)) ||
          (Conf['Expand thread only'] && (g.VIEW === 'index') && !threadRoot?.contains(file.thumb)))) {
            return;
          }
        return $.queueTask(func, post);
      };

      if (ImageExpand.on = $.hasClass(ImageExpand.EAI, 'expand-all-shortcut')) {
        ImageExpand.EAI.className = 'contract-all-shortcut fa fa-compress';
        ImageExpand.EAI.title     = 'Contract All Images';
        func = ImageExpand.expand;
      } else {
        ImageExpand.EAI.className = 'expand-all-shortcut fa fa-expand';
        ImageExpand.EAI.title     = 'Expand All Images';
        func = ImageExpand.contract;
      }

      return g.posts.forEach(function(post) {
        for (post of [post, ...Array.from(post.clones)]) { toggle(post); }
      });
    },

    playVideos() {
      return g.posts.forEach(function(post) {
        for (post of [post, ...Array.from(post.clones)]) {
          var {file} = post;
          if (!file || !file.isVideo || !file.isExpanded) { continue; }

          var video = file.fullImage;
          var visible = ($.hasAudio(video) && !video.muted) || Header.isNodeVisible(video);
          if (visible && file.wasPlaying) {
            delete file.wasPlaying;
            video.play();
          } else if (!visible && !video.paused) {
            file.wasPlaying = true;
            video.pause();
          }
        }
      });
    },

    setFitness() {
      return $[this.checked ? 'addClass' : 'rmClass'](doc, this.name.toLowerCase().replace(/\s+/g, '-'));
    }
  },

  toggle(post) {
    if (!post.file.isExpanding && !post.file.isExpanded) {
      post.file.scrollIntoView = Conf['Scroll into view'];
      ImageExpand.expand(post);
      return;
    }

    ImageExpand.contract(post);

    if (Conf['Advance on contract']) {
      let next = post.nodes.root;
      while ((next = $.x("following::div[contains(@class,'postContainer')][1]", next))) {
        if (!$('.stub', next) && (next.offsetHeight !== 0)) { break; }
      }
      if (next) {
        return Header.scrollTo(next);
      }
    }
  },

  contract(post) {
    let bottom, el, oldHeight, scrollY;
    const {file} = post;

    if (el = file.fullImage) {
      const top = Header.getTopOf(el);
      bottom = top + el.getBoundingClientRect().height;
      oldHeight = d.body.clientHeight;
      ({scrollY} = window);
    }

    $.rmClass(post.nodes.root, 'expanded-image');
    $.rmClass(file.thumb,      'expanding');
    $.rm(file.videoControls);
    file.thumbLink.href   = file.url;
    file.thumbLink.target = '_blank';
    for (var x of ['isExpanding', 'isExpanded', 'videoControls', 'wasPlaying', 'scrollIntoView']) {
      delete file[x];
    }

    if (!el) { return; }

    if (doc.contains(el)) {
      if (bottom <= 0) {
        // For images entirely above us, scroll to remain in place.
        window.scrollBy(0, ((scrollY - window.scrollY) + d.body.clientHeight) - oldHeight);
      } else {
        // For images not above us that would be moved above us, scroll to the thumbnail.
        Header.scrollToIfNeeded(post.nodes.root);
      }
      if (window.scrollX > 0) {
        // If we have scrolled right viewing an expanded image, return to the left.
        window.scrollBy(-window.scrollX, 0);
      }
    }

    $.off(el, 'error', ImageExpand.error);
    ImageCommon.pushCache(el);
    if (file.isVideo) {
      ImageCommon.pause(el);
      for (var eventName in ImageExpand.videoCB) {
        var cb = ImageExpand.videoCB[eventName];
        $.off(el, eventName, cb);
      }
    }
    if (Conf['Restart when Opened']) { ImageCommon.rewind(file.thumb); }
    delete file.fullImage;
    return $.queueTask(function() {
      // XXX Work around Chrome/Chromium not firing mouseover on the thumbnail.
      if (file.isExpanding || file.isExpanded) { return; }
      $.rmClass(el, 'full-image');
      if (el.id) { return; }
      return $.rm(el);
    });
  },

  expand(post, src) {
    // Do not expand images of hidden/filtered replies, or already expanded pictures.
    let el;
    const {file} = post;
    const {thumb, thumbLink, isVideo} = file;
    if (post.isHidden || file.isExpanding || file.isExpanded) { return; }

    $.addClass(thumb, 'expanding');
    file.isExpanding = true;

    if (file.fullImage) {
      el = file.fullImage;
    } else if (ImageCommon.cache?.dataset.fileID === `${post.fullID}.${file.index}`) {
      el = (file.fullImage = ImageCommon.popCache());
      $.on(el, 'error', ImageExpand.error);
      if (Conf['Restart when Opened'] && (el.id !== 'ihover')) { ImageCommon.rewind(el); }
      el.removeAttribute('id');
    } else {
      el = (file.fullImage = $.el((isVideo ? 'video' : 'img')));
      el.dataset.fileID = `${post.fullID}.${file.index}`;
      $.on(el, 'error', ImageExpand.error);
      el.src = src || file.url;
    }

    el.className = 'full-image';
    $.after(thumb, el);

    if (isVideo) {
      // add contract link to file info
      if (!file.videoControls) {
        file.videoControls = ImageExpand.videoControls.cloneNode(true);
        $.add(file.text, file.videoControls);
      }

      // disable link to file so native controls can work
      thumbLink.removeAttribute('href');
      thumbLink.removeAttribute('target');

      el.loop = true;
      Volume.setup(el);
      ImageExpand.setupVideoCB(post);
    }

    if (!isVideo) {
      return $.asap((() => el.naturalHeight), () => ImageExpand.completeExpand(post));
    } else if (el.readyState >= el.HAVE_METADATA) {
      return ImageExpand.completeExpand(post);
    } else {
      return $.on(el, 'loadedmetadata', () => ImageExpand.completeExpand(post));
    }
  },

  completeExpand(post) {
    const {file} = post;
    if (!file.isExpanding) { return; } // contracted before the image loaded

    const bottom = Header.getTopOf(file.thumb) + file.thumb.getBoundingClientRect().height;
    const oldHeight = d.body.clientHeight;
    const {scrollY} = window;

    $.addClass(post.nodes.root, 'expanded-image');
    $.rmClass(file.thumb,      'expanding');
    file.isExpanded = true;
    delete file.isExpanding;

    // Scroll to keep our place in the thread when images are expanded above us.
    if (doc.contains(post.nodes.root) && (bottom <= 0)) {
      window.scrollBy(0, ((scrollY - window.scrollY) + d.body.clientHeight) - oldHeight);
    }

    // Scroll to display full image.
    if (file.scrollIntoView) {
      delete file.scrollIntoView;
      const imageBottom = Math.min(doc.clientHeight - file.fullImage.getBoundingClientRect().bottom - 25, Header.getBottomOf(file.fullImage));
      if (imageBottom < 0) {
        window.scrollBy(0, Math.min(-imageBottom, Header.getTopOf(file.fullImage)));
      }
    }

    if (file.isVideo) {
      return ImageExpand.setupVideo(post, Conf['Autoplay'], Conf['Show Controls']);
    }
  },

  setupVideo(post, playing, controls) {
    const {fullImage} = post.file;
    if (!playing) {
      fullImage.controls = controls;
      return;
    }
    fullImage.controls = false;
    $.asap((() => doc.contains(fullImage)), function() {
      if (!d.hidden && Header.isNodeVisible(fullImage)) {
        return fullImage.play();
      } else {
        return post.file.wasPlaying = true;
      }
    });
    if (controls) {
      return ImageCommon.addControls(fullImage);
    }
  },

  videoCB: (function() {
    // dragging to the left contracts the video
    let mousedown = false;
    return {
      mouseover() { return mousedown = false; },
      mousedown(e) { if (e.button === 0) { return mousedown = true; } },
      mouseup(e) { if (e.button === 0) { return mousedown = false; } },
      mouseout(e) { if (((e.buttons & 1) || mousedown) && (e.clientX <= this.getBoundingClientRect().left)) { return ImageExpand.toggle(Get.postFromNode(this)); } }
    };
  })(),

  setupVideoCB(post) {
    for (var eventName in ImageExpand.videoCB) {
      var cb = ImageExpand.videoCB[eventName];
      $.on(post.file.fullImage, eventName, cb);
    }
    if (post.file.videoControls) {
      return $.on(post.file.videoControls.firstElementChild, 'click', () => ImageExpand.toggle(post));
    }
  },

  error() {
    const post = Get.postFromNode(this);
    $.rm(this);
    delete post.file.fullImage;
    // Images can error:
    //  - before the image started loading.
    //  - after the image started loading.
    // Don't try to re-expand if it was already contracted.
    if (!post.file.isExpanding && !post.file.isExpanded) { return; }
    if (ImageCommon.decodeError(this, post.file)) {
      return ImageExpand.contract(post);
    }
    // Don't autoretry images from the archive.
    if (ImageCommon.isFromArchive(this)) {
      return ImageExpand.contract(post);
    }
    return ImageCommon.error(this, post, post.file, 10 * SECOND, function(URL) {
      if (post.file.isExpanding || post.file.isExpanded) {
        ImageExpand.contract(post);
        if (URL) { return ImageExpand.expand(post, URL); }
      }
    });
  },

  menu: {
    init() {
      if (!ImageExpand.enabled) { return; }

      const el = $.el('span', {
        textContent: 'Image Expansion',
        className:   'image-expansion-link'
      }
      );

      const {createSubEntry} = ImageExpand.menu;
      const subEntries = [];
      for (var name in Config.imageExpansion) {
        var conf = Config.imageExpansion[name];
        subEntries.push(createSubEntry(name, conf[1]));
      }

      return Header.menu.addEntry({
        el,
        order: 105,
        subEntries
      });
    },

    createSubEntry(name, desc) {
      const label = UI.checkbox(name, name);
      label.title = desc;
      const input = label.firstElementChild;
      if (['Fit width', 'Fit height'].includes(name)) {
        $.on(input, 'change', ImageExpand.cb.setFitness);
      }
      $.event('change', null, input);
      $.on(input, 'change', $.cb.checked);
      return {el: label};
    }
  }
};
export default ImageExpand;
