/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var Menu = {
  init() {
    if (!['index', 'thread'].includes(g.VIEW) || !Conf['Menu']) { return; }

    this.button = $.el('a', {
      className: 'menu-button',
      href:      'javascript:;'
    }
    );

    $.extend(this.button, {innerHTML: "<i class=\"fa fa-angle-down\"></i>"});

    this.menu = new UI.Menu('post');
    Callbacks.Post.push({
      name: 'Menu',
      cb:   this.node
    });

    return Callbacks.CatalogThread.push({
      name: 'Menu',
      cb:   this.catalogNode
    });
  },

  node() {
    if (this.isClone) {
      const button = $('.menu-button', this.nodes.info);
      $.rmClass(button, 'active');
      $.rm($('.dialog', this.nodes.info));
      Menu.makeButton(this, button);
      return;
    }
    return $.add(this.nodes.info, Menu.makeButton(this));
  },

  catalogNode() {
    return $.after(this.nodes.icons, Menu.makeButton(this.thread.OP));
  },

  makeButton(post, button) {
    if (!button) { button = Menu.button.cloneNode(true); }
    $.on(button, 'click', function(e) {
      return Menu.menu.toggle(e, this, post);
    });
    return button;
  }
};
