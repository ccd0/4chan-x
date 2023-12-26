import $ from "../platform/$";
import Callbacks from "../classes/Callbacks";
import ExpandComment from "../Miscellaneous/ExpandComment";
import { g, Conf } from "../globals/globals";
import Get from "../General/Get";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var QuoteCT = {
  init() {
    if (!['index', 'thread'].includes(g.VIEW) || !Conf['Mark Cross-thread Quotes']) { return; }

    if (Conf['Comment Expansion']) {
      ExpandComment.callbacks.push(this.node);
    }

    // \u00A0 is nbsp
    this.mark = $.el('span', {
      textContent: '\u00A0(Cross-thread)',
      className:   'qmark-ct'
    }
    );
    return Callbacks.Post.push({
      name: 'Mark Cross-thread Quotes',
      cb:   this.node
    });
  },
  node() {
    // Stop there if it's a clone of a post in the same thread.
    if (this.isClone && (this.thread === this.context.thread)) { return; }

    const {board, thread} = this.context;
    for (var quotelink of this.nodes.quotelinks) {
      var {boardID, threadID} = Get.postDataFromLink(quotelink);
      if (!threadID) { continue; } // deadlink
      if (this.isClone) {
        $.rm($('.qmark-ct', quotelink));
      }
      if ((boardID === board.ID) && (threadID !== thread.ID)) {
        $.add(quotelink, QuoteCT.mark.cloneNode(true));
      }
    }
  }
};
export default QuoteCT;
