import Callbacks from "../classes/Callbacks";
import Config from "../config/Config";
import Header from "../General/Header";
import UI from "../General/UI";
import { g, Conf, E } from "../globals/globals";
import $ from "../platform/$";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var Volume = {
  init() {
    if (!['index', 'thread'].includes(g.VIEW) ||
      (!Conf['Image Expansion'] && !Conf['Image Hover'] && !Conf['Image Hover in Catalog'] && !Conf['Gallery'])) { return; }

    $.sync('Allow Sound', function(x) {
      Conf['Allow Sound'] = x;
      if (Volume.inputs) Volume.inputs.unmute.checked = x;
    });

    $.sync('Default Volume', function(x) {
      Conf['Default Volume'] = x;
      if (Volume.inputs) Volume.inputs.volume.value = x;
    });

    if (Conf['Mouse Wheel Volume']) {
      Callbacks.Post.push({
        name: 'Mouse Wheel Volume',
        cb:   this.node
      });
    }

    if (g.SITE.noAudio?.(g.BOARD)) { return; }

    if (Conf['Mouse Wheel Volume']) {
      Callbacks.CatalogThread.push({
        name: 'Mouse Wheel Volume',
        cb:   this.catalogNode
      });
    }

    const unmuteEntry = UI.checkbox('Allow Sound', 'Allow Sound');
    unmuteEntry.title = Config.main['Images and Videos']['Allow Sound'][1];

    const volumeEntry = $.el('label',
      {title: 'Default volume for videos.'});
    $.extend(volumeEntry,
      {innerHTML: "<input name=\"Default Volume\" type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" value=\"" + E(Conf["Default Volume"]) + "\"> Volume"});

    this.inputs = {
      unmute: unmuteEntry.firstElementChild,
      volume: volumeEntry.firstElementChild
    };

    $.on(this.inputs.unmute, 'change', $.cb.checked);
    $.on(this.inputs.volume, 'change', $.cb.value);

    Header.menu.addEntry({el: unmuteEntry, order: 200});
    return Header.menu.addEntry({el: volumeEntry, order: 201});
  },

  setup(video) {
    video.muted  = !Conf['Allow Sound'];
    video.volume = Conf['Default Volume'];
    return $.on(video, 'volumechange', Volume.change);
  },

  change() {
    const {muted, volume} = this;
    const items = {
      'Allow Sound': !muted,
      'Default Volume': volume
    };
    for (var key in items) {
      var val = items[key];
      if (Conf[key] === val) {
        delete items[key];
      }
    }
    $.set(items);
    $.extend(Conf, items);
    if (Volume.inputs) {
      Volume.inputs.unmute.checked = !muted;
      return Volume.inputs.volume.value = volume;
    }
  },

  node() {
    if (g.SITE.noAudio?.(this.board)) { return; }
    for (var file of this.files) {
      if (file.isVideo) {
        if (file.thumb) { $.on(file.thumb,                                'wheel', Volume.wheel.bind(Header.hover)); }
        $.on(($('.file-info', file.text) || file.link), 'wheel', Volume.wheel.bind(file.thumbLink));
      }
    }
  },

  catalogNode() {
    const file = this.thread.OP.files[0];
    if (!file?.isVideo) { return; }
    return $.on(this.nodes.thumb, 'wheel', Volume.wheel.bind(Header.hover));
  },

  wheel(e) {
    let el;
    if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) { return; }
    if (!(el = $('video:not([data-md5])', this))) { return; }
    if (el.muted || !$.hasAudio(el)) { return; }
    let volume = el.volume + 0.1;
    if (e.deltaY < 0) { volume *= 1.1; }
    if (e.deltaY > 0) { volume /= 1.1; }
    el.volume = $.minmax(volume - 0.1, 0, 1);
    return e.preventDefault();
  }
};
export default Volume;
