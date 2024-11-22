import $ from "../platform/$";
import CSS from "../css/CSS";
import { Conf } from "../globals/globals";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CustomCSS = {
  init() {
    if (!Conf['Custom CSS']) { return; }
    return this.addStyle();
  },

  addStyle() {
    return this.style = $.addStyle(CSS.sub(Conf['usercss']), 'custom-css', '#fourchanx-css');
  },

  rmStyle() {
    if (this.style) {
      $.rm(this.style);
      return delete this.style;
    }
  },

  update() {
    if (!this.style) {
      return this.addStyle();
    }
    return this.style.textContent = CSS.sub(Conf['usercss']);
  }
};
export default CustomCSS;
