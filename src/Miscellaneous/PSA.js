import Notice from "../classes/Notice";
import { g, Conf, doc } from "../globals/globals";
import Main from "../main/Main";
import $ from "../platform/$";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PSA = {
  init() {
    let el;
    if ((g.SITE.software === 'yotsuba') && (g.BOARD.ID === 'qa')) {
      const announcement = {innerHTML: "Stay in touch with your <a href=\"https://www.4chan-x.net/qa_friends.html\" target=\"_blank\" rel=\"noopener\">/qa/ friends</a>!"};
      el = $.el('div', {className: 'fcx-announcement'}, announcement);
      $.onExists(doc, '.boardBanner', banner => $.after(banner, el));
    }
    if ('samachan.org' in Conf['siteProperties'] && !Conf['PSAseen'].includes('samachan')) {
      el = $.el('span',
        {innerHTML: "<a href=\"https://sushigirl.us/yakuza/res/776.html\" target=\"_blank\" rel=\"noopener\">Looking for a new home?<br>Some former Samachan users are regrouping on SushiChan.</a><br>(a message from 4chan X)"});
      return Main.ready(function() {
        new Notice('info', el);
        Conf['PSAseen'].push('samachan');
        return $.set('PSAseen', Conf['PSAseen']);});
    }
  }
};
export default PSA;
