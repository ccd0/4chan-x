/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var Recursive = {
  recursives: $.dict(),
  init() {
    if (!['index', 'thread'].includes(g.VIEW)) { return; }
    return Callbacks.Post.push({
      name: 'Recursive',
      cb:   this.node
    });
  },

  node() {
    if (this.isClone || this.isFetchedQuote) { return; }
    for (var quote of this.quotes) {
      var obj;
      if ((obj = Recursive.recursives[quote])) {
        for (var i = 0; i < obj.recursives.length; i++) {
          var recursive = obj.recursives[i];
          recursive(this, ...Array.from(obj.args[i]));
        }
      }
    }
  },

  add(recursive, post, ...args) {
    const obj = Recursive.recursives[post.fullID] || (Recursive.recursives[post.fullID] = {
      recursives: [],
      args: []
    });
    obj.recursives.push(recursive);
    return obj.args.push(args);
  },

  rm(recursive, post) {
    let obj;
    if (!(obj = Recursive.recursives[post.fullID])) { return; }
    for (let i = 0; i < obj.recursives.length; i++) {
      var rec = obj.recursives[i];
      if (rec === recursive) {
        obj.recursives.splice(i, 1);
        obj.args.splice(i, 1);
      }
    }
  },

  apply(recursive, post, ...args) {
    const {fullID} = post;
    return g.posts.forEach(function(post) {
      if (post.quotes.includes(fullID)) {
        return recursive(post, ...Array.from(args));
      }
    });
  }
};
