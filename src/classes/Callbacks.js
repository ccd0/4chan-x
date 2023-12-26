import Main from "../main/Main";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
export default class Callbacks {
  static initClass() {
    this.Post          = new Callbacks('Post');
    this.Thread        = new Callbacks('Thread');
    this.CatalogThread = new Callbacks('Catalog Thread');
    this.CatalogThreadNative = new Callbacks('Catalog Thread');
  }

  constructor(type) {
    this.type = type;
    this.keys = [];
  }

  push({name, cb}) {
    if (!this[name]) { this.keys.push(name); }
    return this[name] = cb;
  }

  execute(node, keys=this.keys, force=false) {
    let errors;
    if (node.callbacksExecuted && !force) { return; }
    node.callbacksExecuted = true;
    for (var name of keys) {
      try {
        this[name]?.call(node);
      } catch (err) {
        if (!errors) { errors = []; }
        errors.push({
          message: ['"', name, '" crashed on node ', this.type, ' No.', node.ID, ' (', node.board, ').'].join(''),
          error: err,
          html: node.nodes?.root?.outerHTML
        });
      }
    }

    if (errors) { return Main.handleErrors(errors); }
  }
}
Callbacks.initClass();
