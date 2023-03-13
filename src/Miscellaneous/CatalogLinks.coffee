/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var CatalogLinks = {
  init() {
    if ((g.SITE.software === 'yotsuba') && (Conf['External Catalog'] || Conf['JSON Index']) && !(Conf['JSON Index'] && (g.VIEW === 'index'))) {
      const selector = (() => { switch (g.VIEW) {
        case 'thread': case 'archive': return '.navLinks.desktop > a';
        case 'catalog':           return '.navLinks > :first-child > a';
        case 'index':             return '#ctrl-top > a, .cataloglink > a';
      } })();
      $.ready(function() {
        for (var link of $$(selector)) {
          var catalogURL;
          switch (link.pathname.replace(/\/+/g, '/')) {
            case `/${g.BOARD}/`:
              if (Conf['JSON Index']) { link.textContent = 'Index'; }
              link.href = CatalogLinks.index();
              break;
            case `/${g.BOARD}/catalog`:
              link.href = CatalogLinks.catalog();
              break;
          }
          if ((g.VIEW === 'catalog') && ((catalogURL = CatalogLinks.catalog()) !== g.SITE.urls.catalog?.(g.BOARD))) {
            var catalogLink = link.parentNode.cloneNode(true);
            var link2 = catalogLink.firstElementChild;
            link2.href = catalogURL;
            link2.textContent = link2.hostname === location.hostname ? '<%= meta.name %> Catalog' : 'External Catalog';
            $.after(link.parentNode, [$.tn(' '), catalogLink]);
          }
        }
      });
    }

    if ((g.SITE.software === 'yotsuba') && Conf['JSON Index'] && Conf['Use <%= meta.name %> Catalog']) {
      Callbacks.Post.push({
        name: 'Catalog Link Rewrite',
        cb:   this.node
      });
    }

    if (this.enabled = Conf['Catalog Links']) {
      let el;
      CatalogLinks.el = (el = UI.checkbox('Header catalog links', 'Catalog Links'));
      el.id = 'toggleCatalog';
      const input = $('input', el);
      $.on(input, 'change', this.toggle);
      $.sync('Header catalog links', CatalogLinks.set);
      return Header.menu.addEntry({
        el,
        order: 95
      });
    }
  },

  node() {
    for (var a of $$('a', this.nodes.comment)) {
      var m;
      if (m = a.href.match(/^https?:\/\/(boards\.4chan(?:nel)?\.org\/[^\/]+)\/catalog(#s=.*)?/)) {
        a.href = `//${m[1]}/${m[2] || '#catalog'}`;
      }
    }
  },

  toggle() {
    $.event('CloseMenu');
    $.set('Header catalog links', this.checked);
    return CatalogLinks.set(this.checked);
  },

  set(useCatalog) {
    Conf['Header catalog links'] = useCatalog;
    CatalogLinks.setLinks(Header.boardList);
    CatalogLinks.setLinks(Header.bottomBoardList);
    CatalogLinks.el.title = `Turn catalog links ${useCatalog ? 'off' : 'on'}.`;
    return $('input', CatalogLinks.el).checked = useCatalog;
  },

  // Also called by Header when board lists are loaded / generated.
  setLinks(list) {
    if ((!(CatalogLinks.enabled ?? Conf['Catalog Links'])) || !list) { return; }

    // do not transform links unless they differ from the expected value at most by this tail
    const tail = /(?:index)?(?:\.\w+)?$/;

    for (var a of $$('a:not([data-only])', list)) {
      var {siteID, boardID} = a.dataset;
      if (!siteID || !boardID) {
        var VIEW;
        ({siteID, boardID, VIEW} = Site.parseURL(a));
        if (
          !siteID || !boardID ||
          !['index', 'catalog'].includes(VIEW) ||
          (!a.dataset.indexOptions && (a.href.replace(tail, '') !== (Get.url(VIEW, {siteID, boardID}) || '').replace(tail, '')))
        ) { continue; }
        $.extend(a.dataset, {siteID, boardID});
      }

      var board = {siteID, boardID};
      var url = Conf['Header catalog links'] ? CatalogLinks.catalog(board) : Get.url('index', board);
      if (url) {
        a.href = url;
        if (a.dataset.indexOptions && (url.split('#')[0] === Get.url('index', board))) {
          a.href += (a.hash ? '/' : '#') + a.dataset.indexOptions;
        }
      }
    }
  },

  externalParse() {
    CatalogLinks.externalList = $.dict();
    for (var line of Conf['externalCatalogURLs'].split('\n')) {
      if (line[0] === '#') { continue; }
      var url = line.split(';')[0];
      var boards   = Filter.parseBoards(line.match(/;boards:([^;]+)/)?.[1] || '*');
      var excludes = Filter.parseBoards(line.match(/;exclude:([^;]+)/)?.[1]) || $.dict();
      for (var board in boards) {
        if (!excludes[board] && !excludes[board.split('/')[0] + '/*']) {
          CatalogLinks.externalList[board] = url;
        }
      }
    }
  },

  external({siteID, boardID}) {
    if (!CatalogLinks.externalList) { CatalogLinks.externalParse(); }
    const external = (CatalogLinks.externalList[`${siteID}/${boardID}`] || CatalogLinks.externalList[`${siteID}/*`]);
    if (external) { return external.replace(/%board/g, boardID); } else { return undefined; }
  },

  jsonIndex(board, hash) {
    if ((g.SITE.ID === board.siteID) && (g.BOARD.ID === board.boardID) && (g.VIEW === 'index')) {
      return hash;
    } else {
      return Get.url('index', board) + hash;
    }
  },

  catalog(board=g.BOARD) {
    let external, nativeCatalog;
    if (Conf['External Catalog'] && (external = CatalogLinks.external(board))) {
      return external;
    } else if (Index.enabledOn(board) && Conf['Use <%= meta.name %> Catalog']) {
      return CatalogLinks.jsonIndex(board, '#catalog');
    } else if (nativeCatalog = Get.url('catalog', board)) {
      return nativeCatalog;
    } else {
      return CatalogLinks.external(board);
    }
  },

  index(board=g.BOARD) {
    if (Index.enabledOn(board)) {
      return CatalogLinks.jsonIndex(board, '#index');
    } else {
      return Get.url('index', board);
    }
  }
};
