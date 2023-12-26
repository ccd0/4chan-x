import ferongr_unreadDead from './Favicon/ferongr.unreadDead.png';
import ferongr_unreadDeadY from './Favicon/ferongr.unreadDeadY.png';
import ferongr_unreadSFW from './Favicon/ferongr.unreadSFW.png';
import ferongr_unreadSFWY from './Favicon/ferongr.unreadSFWY.png';
import ferongr_unreadNSFW from './Favicon/ferongr.unreadNSFW.png';
import ferongr_unreadNSFWY from './Favicon/ferongr.unreadNSFWY.png';
import xat_unreadDead from './Favicon/xat-.unreadDead.png';
import xat_unreadDeadY from './Favicon/xat-.unreadDeadY.png';
import xat_unreadSFW from './Favicon/xat-.unreadSFW.png';
import xat_unreadSFWY from './Favicon/xat-.unreadSFWY.png';
import xat_unreadNSFW from './Favicon/xat-.unreadNSFW.png';
import xat_unreadNSFWY from './Favicon/xat-.unreadNSFWY.png';
import Mayhem_unreadDead from './Favicon/Mayhem.unreadDead.png';
import Mayhem_unreadDeadY from './Favicon/Mayhem.unreadDeadY.png';
import Mayhem_unreadSFW from './Favicon/Mayhem.unreadSFW.png';
import Mayhem_unreadSFWY from './Favicon/Mayhem.unreadSFWY.png';
import Mayhem_unreadNSFW from './Favicon/Mayhem.unreadNSFW.png';
import Mayhem_unreadNSFWY from './Favicon/Mayhem.unreadNSFWY.png';
import fourChanJS_unreadDead from './Favicon/4chanJS.unreadDead.png';
import fourChanJS_unreadDeadY from './Favicon/4chanJS.unreadDeadY.png';
import fourChanJS_unreadSFW from './Favicon/4chanJS.unreadSFW.png';
import fourChanJS_unreadSFWY from './Favicon/4chanJS.unreadSFWY.png';
import fourChanJS_unreadNSFW from './Favicon/4chanJS.unreadNSFW.png';
import fourChanJS_unreadNSFWY from './Favicon/4chanJS.unreadNSFWY.png';
import Original_unreadDead from './Favicon/Original.unreadDead.png';
import Original_unreadDeadY from './Favicon/Original.unreadDeadY.png';
import Original_unreadSFW from './Favicon/Original.unreadSFW.png';
import Original_unreadSFWY from './Favicon/Original.unreadSFWY.png';
import Original_unreadNSFW from './Favicon/Original.unreadNSFW.png';
import Original_unreadNSFWY from './Favicon/Original.unreadNSFWY.png';
import Metro_unreadDead from './Favicon/Metro.unreadDead.png';
import Metro_unreadDeadY from './Favicon/Metro.unreadDeadY.png';
import Metro_unreadSFW from './Favicon/Metro.unreadSFW.png';
import Metro_unreadSFWY from './Favicon/Metro.unreadSFWY.png';
import Metro_unreadNSFW from './Favicon/Metro.unreadNSFW.png';
import Metro_unreadNSFWY from './Favicon/Metro.unreadNSFWY.png';
import dead from './Favicon/dead.gif';
import empty from './Favicon/empty.gif';
import $ from '../platform/$';
import { Conf, d } from '../globals/globals';

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */

var Favicon = {
  init() {
    return $.asap((() => d.head && (Favicon.el = $('link[rel="shortcut icon"]', d.head))), Favicon.initAsap);
  },

  set(status) {
    Favicon.status = status;
    if (Favicon.el) {
      Favicon.el.href = Favicon[status];
      // `favicon.href = href` doesn't work on Firefox.
      return $.add(d.head, Favicon.el);
    }
  },

  initAsap() {
    Favicon.el.type = 'image/x-icon';
    const {href}          = Favicon.el;
    Favicon.isSFW   = /ws\.ico$/.test(href);
    Favicon.default = href;
    Favicon.switch();
    if (Favicon.status) {
      return Favicon.set(Favicon.status);
    }
  },

  switch() {
    let items = {
      ferongr: [
        ferongr_unreadDead,
        ferongr_unreadDeadY,
        ferongr_unreadSFW,
        ferongr_unreadSFWY,
        ferongr_unreadNSFW,
        ferongr_unreadNSFWY,
      ],
      'xat-': [
        xat_unreadDead,
        xat_unreadDeadY,
        xat_unreadSFW,
        xat_unreadSFWY,
        xat_unreadNSFW,
        xat_unreadNSFWY,
      ],
      Mayhem: [
        Mayhem_unreadDead,
        Mayhem_unreadDeadY,
        Mayhem_unreadSFW,
        Mayhem_unreadSFWY,
        Mayhem_unreadNSFW,
        Mayhem_unreadNSFWY,
      ],
      '4chanJS': [
        fourChanJS_unreadDead,
        fourChanJS_unreadDeadY,
        fourChanJS_unreadSFW,
        fourChanJS_unreadSFWY,
        fourChanJS_unreadNSFW,
        fourChanJS_unreadNSFWY,
      ],
      Original: [
        Original_unreadDead,
        Original_unreadDeadY,
        Original_unreadSFW,
        Original_unreadSFWY,
        Original_unreadNSFW,
        Original_unreadNSFWY,
      ],
      'Metro': [
        Metro_unreadDead,
        Metro_unreadDeadY,
        Metro_unreadSFW,
        Metro_unreadSFWY,
        Metro_unreadNSFW,
        Metro_unreadNSFWY,
      ]
    };
    items = $.getOwn(items, Conf['favicon']);

    const f = Favicon;
    const t = 'data:image/png;base64,';
    let i = 0;
    while (items[i]) {
      items[i] = t + items[i++];
    }

    [f.unreadDead, f.unreadDeadY, f.unreadSFW, f.unreadSFWY, f.unreadNSFW, f.unreadNSFWY] = Array.from(items);
    return f.update();
  },

  update() {
    if (this.isSFW) {
      this.unread  = this.unreadSFW;
      return this.unreadY = this.unreadSFWY;
    } else {
      this.unread  = this.unreadNSFW;
      return this.unreadY = this.unreadNSFWY;
    }
  },

  SFW:   '//s.4cdn.org/image/favicon-ws.ico',
  NSFW:  '//s.4cdn.org/image/favicon.ico',
  dead: `data:image/gif;base64,${dead}`,
  logo: `data:image/png;base64,${empty}`,
};
export default Favicon;
