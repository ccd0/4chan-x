import { g } from "../globals/globals";
import $ from "../platform/$";
import Board from "./Board";
import Thread from "./Thread";

export default class CatalogThreadNative {
  toString() { return this.ID; }

  constructor(root) {
    this.nodes = {
      root,
      thumb: $(g.SITE.selectors.catalog.thumb, root)
    };
    this.siteID  = g.SITE.ID;
    this.boardID = this.nodes.thumb.parentNode.pathname.split(/\/+/)[1];
    this.board = g.boards[this.boardID] || new Board(this.boardID);
    this.ID = (this.threadID = +(root.dataset.id || root.id).match(/\d*$/)[0]);
    this.thread = this.board.threads.get(this.ID) || new Thread(this.ID, this.board);
  }
}
