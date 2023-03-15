import { g, Conf } from "../globals/globals";
import $ from "../platform/$";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var Flash = {
  init() {
    if ((g.BOARD.ID === 'f') && Conf['Enable Native Flash Embedding']) {
      return $.ready(Flash.initReady);
    }
  },

  initReady() {
    if ($.hasStorage) {
      return $.global(function() { if (JSON.parse(localStorage['4chan-settings'] || '{}').disableAll) { return window.SWFEmbed.init(); } });
    } else {
      if (g.VIEW === 'thread') {
        $.global(() => window.Main.tid = location.pathname.split(/\/+/)[3]);
      }
      return $.global(() => window.SWFEmbed.init());
    }
  }
};
export default Flash;
