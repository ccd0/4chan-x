/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var MarkNewIPs = {
  init() {
    if ((g.SITE.software !== 'yotsuba') || (g.VIEW !== 'thread') || !Conf['Mark New IPs']) { return; }
    return Callbacks.Thread.push({
      name: 'Mark New IPs',
      cb:   this.node
    });
  },

  node() {
    MarkNewIPs.ipCount = this.ipCount;
    MarkNewIPs.postCount = this.posts.keys.length;
    return $.on(d, 'ThreadUpdate', MarkNewIPs.onUpdate);
  },

  onUpdate(e) {
    let fullID;
    const {ipCount, postCount, newPosts, deletedPosts} = e.detail;
    if (ipCount == null) { return; }

    switch (ipCount - MarkNewIPs.ipCount) {
      case (postCount - MarkNewIPs.postCount) + deletedPosts.length:
        var i = MarkNewIPs.ipCount;
        for (fullID of newPosts) {
          MarkNewIPs.markNew(g.posts.get(fullID), ++i);
        }
        break;
      case -deletedPosts.length:
        for (fullID of newPosts) {
          MarkNewIPs.markOld(g.posts.get(fullID));
        }
        break;
    }
    MarkNewIPs.ipCount = ipCount;
    return MarkNewIPs.postCount = postCount;
  },

  markNew(post, ipCount) {
    const suffix = ((Math.floor(ipCount / 10)) % 10) === 1 ?
      'th'
    :
      ['st', 'nd', 'rd'][(ipCount % 10) - 1] || 'th'; // fuck switches
    const counter = $.el('span', {
      className: 'ip-counter',
      textContent: `(${ipCount})`
    }
    );
    post.nodes.nameBlock.title = `This is the ${ipCount}${suffix} IP in the thread.`;
    $.add(post.nodes.nameBlock, [$.tn(' '), counter]);
    return $.addClass(post.nodes.root, 'new-ip');
  },

  markOld(post) {
    post.nodes.nameBlock.title = 'Not the first post from this IP.';
    return $.addClass(post.nodes.root, 'old-ip');
  }
};
