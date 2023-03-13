/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var IDPostCount = {
  init() {
    if ((g.VIEW !== 'thread') || !Conf['Count Posts by ID']) { return; }
    Callbacks.Thread.push({
      name: 'Count Posts by ID',
      cb() { return IDPostCount.thread = this; }
    });
    return Callbacks.Post.push({
      name: 'Count Posts by ID',
      cb:   this.node
    });
  },

  node() {
    if (this.nodes.uniqueID && (this.thread === IDPostCount.thread)) {
      return $.on(this.nodes.uniqueID, 'mouseover', IDPostCount.count);
    }
  },

  count() {
    const {uniqueID} = Get.postFromNode(this).info;
    let n = 0;
    IDPostCount.thread.posts.forEach(function(post) {
      if (post.info.uniqueID === uniqueID) { return n++; }
    });
    return this.title = `${n} post${n === 1 ? '' : 's'} by this ID`;
  }
};
