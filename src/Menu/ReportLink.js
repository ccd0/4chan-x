import { g, Conf, d } from "../globals/globals";
import $ from "../platform/$";
import Menu from "./Menu";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var ReportLink = {
  init() {
    if (!['index', 'thread'].includes(g.VIEW) || !Conf['Menu'] || !Conf['Report Link']) { return; }

    const a = $.el('a', {
      className: 'report-link',
      href: 'javascript:;',
      textContent: 'Report'
    }
    );
    $.on(a, 'click', ReportLink.report);

    return Menu.menu.addEntry({
      el: a,
      order: 10,
      open(post) {
        ReportLink.url = `//sys.${location.hostname.split('.')[1]}.org/${post.board}/imgboard.php?mode=report&no=${post}`;
        if (d.cookie.indexOf('pass_enabled=1') >= 0) {
          ReportLink.dims = 'width=350,height=275';
        } else {
          ReportLink.dims = 'width=400,height=550';
        }
        return true;
      }
    });
  },

  report() {
    const {url, dims} = ReportLink;
    const id  = Date.now();
    const set = `toolbar=0,scrollbars=1,location=0,status=1,menubar=0,resizable=1,${dims}`;
    return window.open(url, id, set);
  }
};
export default ReportLink;
