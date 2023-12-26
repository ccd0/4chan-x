import DataBoard from "../classes/DataBoard";
import { Conf, d, g } from "../globals/globals";
import $ from "../platform/$";

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PostSuccessful = {
  init() {
    if (!Conf['Remember Your Posts']) { return; }
    return $.ready(this.ready);
  },

  ready() {
    if (d.title !== 'Post successful!') { return; }

    let [_, threadID, postID] = Array.from($('h1').nextSibling.textContent.match(/thread:(\d+),no:(\d+)/));
    postID   = +postID;
    threadID = +threadID || postID;

    const db = new DataBoard('yourPosts');
    return db.set({
      boardID: g.BOARD.ID,
      threadID,
      postID,
      val: true
    });
  }
};
export default PostSuccessful;
