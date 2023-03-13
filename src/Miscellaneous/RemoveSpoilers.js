/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var RemoveSpoilers = {
  init() {
    if (Conf['Reveal Spoilers']) {
      $.addClass(doc, 'reveal-spoilers');
    }

    if (!Conf['Remove Spoilers']) { return; }

    Callbacks.Post.push({
      name: 'Reveal Spoilers',
      cb:   this.node
    });

    if (g.VIEW === 'archive') {
      return $.ready(() => RemoveSpoilers.unspoiler($.id('arc-list')));
    }
  },

  node() {
    return RemoveSpoilers.unspoiler(this.nodes.comment);
  },

  unspoiler(el) {
    const spoilers = $$(g.SITE.selectors.spoiler, el);
    for (var spoiler of spoilers) {
      var span = $.el('span', {className: 'removed-spoiler'});
      $.replace(spoiler, span);
      $.add(span, [...Array.from(spoiler.childNodes)]);
    }
  }
};
