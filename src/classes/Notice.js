import Header from "../General/Header";
import { d } from "../globals/globals";
import $ from "../platform/$";
import { SECOND } from "../platform/helpers";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
export default class Notice {
  constructor(type, content, timeout, onclose) {
    this.add = this.add.bind(this);
    this.close = this.close.bind(this);
    this.timeout = timeout;
    this.onclose = onclose;
    this.el = $.el('div',
      {innerHTML: "<a href=\"javascript:;\" class=\"close fa fa-times\" title=\"Close\"></a><div class=\"message\"></div>"});
    this.el.style.opacity = 0;
    this.setType(type);
    $.on(this.el.firstElementChild, 'click', this.close);
    if (typeof content === 'string') {
      content = $.tn(content);
    }
    $.add(this.el.lastElementChild, content);

    $.ready(this.add);
  }

  setType(type) {
    return this.el.className = `notification ${type}`;
  }

  add() {
    if (this.closed) { return; }
    if (d.hidden) {
      $.on(d, 'visibilitychange', this.add);
      return;
    }
    $.off(d, 'visibilitychange', this.add);
    $.add(Header.noticesRoot, this.el);
    this.el.clientHeight; // force reflow
    this.el.style.opacity = 1;
    if (this.timeout) { return setTimeout(this.close, this.timeout * SECOND); }
  }

  close() {
    this.closed = true;
    $.off(d, 'visibilitychange', this.add);
    $.rm(this.el);
    return this.onclose?.();
  }
}
