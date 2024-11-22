import Redirect from "../Archive/Redirect";
import Notice from "../classes/Notice";
import { g, Conf, d } from "../globals/globals";
import $ from "../platform/$";
import CrossOrigin from "../platform/CrossOrigin";
import ImageHost from "./ImageHost";
import Volume from "./Volume";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var ImageCommon = {
  // Pause and mute video in preparation for removing the element from the document.
  pause(video) {
    if (video.nodeName !== 'VIDEO') { return; }
    video.pause();
    $.off(video, 'volumechange', Volume.change);
    return video.muted = true;
  },

  rewind(el) {
    if (el.nodeName === 'VIDEO') {
      if (el.readyState >= el.HAVE_METADATA) { return el.currentTime = 0; }
    } else if (/\.gif$/.test(el.src)) {
      return $.queueTask(() => el.src = el.src);
    }
  },

  pushCache(el) {
    ImageCommon.cache = el;
    return $.on(el, 'error', ImageCommon.cacheError);
  },

  popCache() {
    const el = ImageCommon.cache;
    $.off(el, 'error', ImageCommon.cacheError);
    delete ImageCommon.cache;
    return el;
  },

  cacheError() {
    if (ImageCommon.cache === this) { return delete ImageCommon.cache; }
  },

  decodeError(file, fileObj) {
    let message;
    if (file.error?.code !== MediaError.MEDIA_ERR_DECODE) { return false; }
    if (!(message = $('.warning', fileObj.thumb.parentNode))) {
      message = $.el('div', {className:   'warning'});
      $.after(fileObj.thumb, message);
    }
    message.textContent = 'Error: Corrupt or unplayable video';
    return true;
  },

  isFromArchive(file) {
    return (g.SITE.software === 'yotsuba') && !ImageHost.test(file.src.split('/')[2]);
  },

  error(file, post, fileObj, delay, cb) {
    let timeoutID;
    const src = fileObj.url.split('/');
    let url = null;
    if ((g.SITE.software === 'yotsuba') && Conf['404 Redirect']) {
      url = Redirect.to('file', {
        boardID:  post.board.ID,
        filename: src[src.length - 1]
      });
    }
    if (!url || !Redirect.securityCheck(url)) { url = null; }

    if ((post.isDead || fileObj.isDead) && !ImageCommon.isFromArchive(file)) { return cb(url); }

    if (delay != null) { timeoutID = setTimeout((() => cb(url)), delay); }
    if (post.isDead || fileObj.isDead) { return; }
    const redirect = function() {
      if (!ImageCommon.isFromArchive(file)) {
        if (delay != null) { clearTimeout(timeoutID); }
        return cb(url);
      }
    };

    const threadJSON = g.SITE.urls.threadJSON?.(post);
    if (!threadJSON) { return; }
    var parseJSON = function(isArchiveURL) {
      let needle, postObj;
      if (this.status === 404) {
        let archivedThreadJSON;
        if (!isArchiveURL && (archivedThreadJSON = g.SITE.urls.archivedThreadJSON?.(post))) {
          $.ajax(archivedThreadJSON, {onloadend() { return parseJSON.call(this, true); }});
        } else {
          post.kill(!post.isClone, fileObj.index);
        }
      }
      if (this.status !== 200) { return redirect(); }
      for (postObj of this.response.posts) {
        if (postObj.no === post.ID) { break; }
      }
      if (postObj.no !== post.ID) {
        post.kill();
        return redirect();
      } else if ((needle = fileObj.docIndex, g.SITE.Build.parseJSON(postObj, post.board).filesDeleted.includes(needle))) {
        post.kill(true);
        return redirect();
      } else {
        return url = fileObj.url;
      }
    };
    return $.ajax(threadJSON, {onloadend() { return parseJSON.call(this); }});
  },

  // Add controls, but not until the mouse is moved over the video.
  addControls(video) {
    var handler = function() {
      $.off(video, 'mouseover', handler);
      // Hacky workaround for Firefox forever-loading bug for very short videos
      const t = new Date().getTime();
      return $.asap((() => ($.engine !== 'gecko') || ((video.readyState >= 3) && (video.currentTime <= Math.max(0.1, (video.duration - 0.5)))) || (new Date().getTime() >= (t + 1000))), () => video.controls = true);
    };
    return $.on(video, 'mouseover', handler);
  },

  // XXX Estimate whether clicks are on the video controls and should be ignored.
  onControls(e) {
    return (Conf['Show Controls'] && Conf['Click Passthrough'] && (e.target.nodeName === 'VIDEO')) ||
      (e.target.controls && ((e.target.getBoundingClientRect().bottom - e.clientY) < 35));
  },

  download(e) {
    if (this.protocol === 'blob:') { return true; }
    e.preventDefault();
    const {href, download} = this;
    return CrossOrigin.file(href, function(blob) {
      if (blob) {
        const a = $.el('a', {
          href: URL.createObjectURL(blob),
          download,
          hidden: true
        }
        );
        $.add(d.body, a);
        a.click();
        return $.rm(a);
      } else {
        return new Notice('warning', `Could not download ${href}`, 20);
      }
    });
  }
};
export default ImageCommon;
