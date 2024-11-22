import Callbacks from "../classes/Callbacks";
import { Conf, doc } from "../globals/globals";
import $ from "../platform/$";
import $$ from "../platform/$$";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var AntiAutoplay = {
  init() {
    if (!Conf['Disable Autoplaying Sounds']) { return; }
    $.addClass(doc, 'anti-autoplay');
    for (var audio of $$('audio[autoplay]', doc)) { this.stop(audio); }
    window.addEventListener('loadstart', (e => this.stop(e.target)), true);
    Callbacks.Post.push({
      name: 'Disable Autoplaying Sounds',
      cb:   this.node
    });
    return $.ready(() => this.process(d.body));
  },

  stop(audio) {
    if (!audio.autoplay) { return; }
    audio.pause();
    audio.autoplay = false;
    if (audio.controls) { return; }
    audio.controls = true;
    return $.addClass(audio, 'controls-added');
  },

  node() {
    return AntiAutoplay.process(this.nodes.comment);
  },

  process(root) {
    for (var iframe of $$('iframe[src*="youtube"][src*="autoplay=1"]', root)) {
      AntiAutoplay.processVideo(iframe, 'src');
    }
    for (var object of $$('object[data*="youtube"][data*="autoplay=1"]', root)) {
      AntiAutoplay.processVideo(object, 'data');
    }
  },

  processVideo(el, attr) {
    el[attr] = el[attr].replace(/\?autoplay=1&?/, '?').replace('&autoplay=1', '');
    if (window.getComputedStyle(el).display === 'none') { el.style.display = 'block'; }
    return $.addClass(el, 'autoplay-removed');
  }
};
export default AntiAutoplay;
