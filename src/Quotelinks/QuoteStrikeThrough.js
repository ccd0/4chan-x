import Callbacks from "../classes/Callbacks";
import Get from "../General/Get";
import { g, Conf } from "../globals/globals";
import $ from "../platform/$";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const QuoteStrikeThrough = {
  init() {
    if (!['index', 'thread'].includes(g.VIEW) ||
      (!Conf['Reply Hiding Buttons'] && (!Conf['Menu'] || !Conf['Reply Hiding Link']) && !Conf['Filter'])) { return; }

    return Callbacks.Post.push({
      name: 'Strike-through Quotes',
      cb:   this.node
    });
  },

  node() {
    if (this.isClone) { return; }
    for (var quotelink of this.nodes.quotelinks) {
      var {boardID, postID} = Get.postDataFromLink(quotelink);
      if (g.posts.get(`${boardID}.${postID}`)?.isHidden) {
        $.addClass(quotelink, 'filtered');
      }
    }
  }
};
export default QuoteStrikeThrough;
