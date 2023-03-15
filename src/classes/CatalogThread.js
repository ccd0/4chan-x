import $ from "../platform/$";

export default class CatalogThread {
  toString() { return this.ID; }

  constructor(root, thread) {
    this.thread = thread;
    this.ID    = this.thread.ID;
    this.board = this.thread.board;
    const {post} = this.thread.OP.nodes;
    this.nodes = {
      root,
      thumb:     $('.catalog-thumb', post),
      icons:     $('.catalog-icons', post),
      postCount: $('.post-count',    post),
      fileCount: $('.file-count',    post),
      pageCount: $('.page-count',    post),
      replies:   null
    };
    this.thread.catalogView = this;
  }
}
