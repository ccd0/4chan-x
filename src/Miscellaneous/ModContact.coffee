/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var ModContact = {
  init() {
    if ((g.SITE.software !== 'yotsuba') || !['index', 'thread'].includes(g.VIEW)) { return; }
    return Callbacks.Post.push({
      name: 'Mod Contact Links',
      cb:   this.node
    });
  },

  node() {
    let moved;
    if (this.isClone || !$.hasOwn(ModContact.specific, this.info.capcode)) { return; }
    const links = $.el('span', {className: 'contact-links brackets-wrap'});
    $.extend(links, ModContact.template(this.info.capcode));
    $.after(this.nodes.capcode, links);
    if ((moved = this.info.comment.match(/This thread was moved to >>>\/(\w+)\//)) && $.hasOwn(ModContact.moveNote, moved[1])) {
      const moveNote = $.el('div', {className: 'move-note'});
      $.extend(moveNote, ModContact.moveNote[moved[1]]);
      return $.add(this.nodes.post, moveNote);
    }
  },

  template(capcode) {
    return {innerHTML: "<a href=\"https://www.4chan.org/feedback\" target=\"_blank\">feedback</a>" + (ModContact.specific[capcode]()).innerHTML};
  },

  specific: {
    Mod() { return {innerHTML: " <a href=\"https://www.4chan-x.net/4chan-irc.html\" target=\"_blank\">IRC</a>"}; },
    Manager() { return ModContact.specific.Mod(); },
    Developer() { return {innerHTML: " <a href=\"https://github.com/4chan\" target=\"_blank\">github</a>"}; },
    Admin() { return {innerHTML: " <a href=\"https://twitter.com/hiroyuki_ni\" target=\"_blank\">twitter</a>"}; }
  },

  moveNote: {
    qa: {innerHTML: "Moving a thread to /qa/ does not imply mods will read it. If you wish to contact mods, use <a href=\"https://www.4chan.org/feedback\" target=\"_blank\">feedback</a><span class=\"invisible\"> (https://www.4chan.org/feedback)</span> or <a href=\"https://www.4chan-x.net/4chan-irc.html\" target=\"_blank\">IRC</a><span class=\"invisible\"> (https://www.4chan-x.net/4chan-irc.html)</span>."}
  }
};
