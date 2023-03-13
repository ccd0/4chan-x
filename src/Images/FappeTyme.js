/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var FappeTyme = {
  init() {
    if ((!Conf['Fappe Tyme'] && !Conf['Werk Tyme']) || !['index', 'thread', 'archive'].includes(g.VIEW)) { return; }

    this.nodes = {};
    this.enabled = {
      fappe: false,
      werk:  Conf['werk']
    };

    for (var type of ["Fappe", "Werk"]) {
      if (Conf[`${type} Tyme`]) {
        var lc = type.toLowerCase();
        var el = UI.checkbox(lc, `${type} Tyme`, false);
        el.title = `${type} Tyme`;

        this.nodes[lc] = el.firstElementChild;
        if (Conf[lc]) { this.set(lc, true); }
        $.on(this.nodes[lc], 'change', this.toggle.bind(this, lc));

        Header.menu.addEntry({
          el,
          order: 97
        });

        var indicator = $.el('span', {
          className: 'indicator',
          textContent: type[0],
          title: `${type} Tyme active`
        }
        );
        $.on(indicator, 'click', function() {
          const check = $.getOwn(FappeTyme.nodes, this.parentNode.id.replace('shortcut-', ''));
          check.checked = !check.checked;
          return $.event('change', null, check);
        });
        Header.addShortcut(lc, indicator, 410);
      }
    }

    if (Conf['Werk Tyme']) {
      $.sync('werk', this.set.bind(this, 'werk'));
    }

    Callbacks.Post.push({
      name: 'Fappe Tyme',
      cb:   this.node
    });

    return Callbacks.CatalogThread.push({
      name: 'Werk Tyme',
      cb:   this.catalogNode
    });
  },

  node() {
    return this.nodes.root.classList.toggle('noFile', !this.files.length);
  },

  catalogNode() {
    const file = this.thread.OP.files[0];
    if (!file) { return; }
    const filename = $.el('div', {
      textContent: file.name,
      className:   'werkTyme-filename'
    }
    );
    return $.add(this.nodes.thumb.parentNode, filename);
  },

  set(type, enabled) {
    this.enabled[type] = (this.nodes[type].checked = enabled);
    return $[`${enabled ? 'add' : 'rm'}Class`](doc, `${type}Tyme`);
  },

  toggle(type) {
    this.set(type, !this.enabled[type]);
    if (type === 'werk') { return $.cb.checked.call(this.nodes[type]); }
  }
};
