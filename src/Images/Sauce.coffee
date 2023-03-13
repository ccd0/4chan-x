/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var Sauce = {
  init() {
    let link;
    if (!['index', 'thread'].includes(g.VIEW) || !Conf['Sauce']) { return; }
    $.addClass(doc, 'show-sauce');

    const links = [];
    for (link of Conf['sauces'].split('\n')) {
      var linkData;
      if ((link[0] !== '#') && (linkData = this.parseLink(link))) {
        links.push(linkData);
      }
    }
    if (!links.length) { return; }

    this.links = links;
    this.link  = $.el('a', {
      target:    '_blank',
      className: 'sauce'
    }
    );
    return Callbacks.Post.push({
      name: 'Sauce',
      cb:   this.node
    });
  },

  parseLink(link) {
    if (!(link = link.trim())) { return null; }
    const parts = $.dict();
    const iterable = link.split(/;(?=(?:text|boards|types|regexp|sandbox):?)/);
    for (let i = 0; i < iterable.length; i++) {
      var part = iterable[i];
      if (i === 0) {
        parts['url'] = part;
      } else {
        var m = part.match(/^(\w*):?(.*)$/);
        parts[m[1]] = m[2];
      }
    }
    if (!parts['text']) { parts['text'] = parts['url'].match(/(\w+)\.\w+\//)?.[1] || '?'; }
    if ('boards' in parts) {
      parts['boards'] = Filter.parseBoards(parts['boards']);
    }
    if ('regexp' in parts) {
      try {
        let regexp;
        if (regexp = parts['regexp'].match(/^\/(.*)\/(\w*)$/)) {
          parts['regexp'] = RegExp(regexp[1], regexp[2]);
        } else {
          parts['regexp'] = RegExp(parts['regexp']);
        }
      } catch (err) {
        new Notice('warning', [
          $.tn("Invalid regexp for Sauce link:"),
          $.el('br'),
          $.tn(link),
          $.el('br'),
          $.tn(err.message)
        ], 60);
        return null;
      }
    }
    return parts;
  },

  createSauceLink(link, post, file) {
    let a, matches, needle;
    const ext = file.url.match(/[^.]*$/)[0];
    const parts = $.dict();
    $.extend(parts, link);

    if (!!parts['boards'] && !parts['boards'][`${post.siteID}/${post.boardID}`] && !parts['boards'][`${post.siteID}/*`]) { return null; }
    if (!!parts['types']  && (needle = ext, !parts['types'].split(',').includes(needle))) { return null; }
    if (!!parts['regexp'] && (!(matches = file.name.match(parts['regexp'])))) { return null; }

    const missing = [];
    for (var key of ['url', 'text']) {
      parts[key] = parts[key].replace(/%(T?URL|IMG|[sh]?MD5|board|name|%|semi|\$\d+)/g, function(orig, parameter) {
        let type;
        if (parameter[0] === '$') {
          if (!matches) { return orig; }
          type = matches[parameter.slice(1)] || '';
        } else {
          type = Sauce.formatters[parameter](post, file, ext);
          if ((type == null)) {
            missing.push(parameter);
            return '';
          }
        }

        if ((key === 'url') && !['%', 'semi'].includes(parameter)) {
          if (/^javascript:/i.test(parts['url'])) { type = JSON.stringify(type); }
          type = encodeURIComponent(type);
        }
        return type;
      });
    }

    if (g.SITE.areMD5sDeferred?.(post.board) && missing.length && !missing.filter(x => !/^.?MD5$/.test(x)).length) {
      a = Sauce.link.cloneNode(false);
      a.dataset.skip = '1';
      return a;
    }

    if (missing.length) { return null; }

    a = Sauce.link.cloneNode(false);
    a.href = parts['url'];
    a.textContent = parts['text'];
    if (/^javascript:/i.test(parts['url'])) { a.removeAttribute('target'); }
    return a;
  },

  node() {
    if (this.isClone) { return; }
    for (var file of this.files) {
      Sauce.file(this, file);
    }
  },

  file(post, file) {
    let link, node;
    const nodes = [];
    const skipped = [];
    for (link of Sauce.links) {
      if (node = Sauce.createSauceLink(link, post, file)) {
        nodes.push($.tn(' '), node);
        if (node.dataset.skip) { skipped.push([link, node]); }
      }
    }
    $.add(file.text, nodes);

    if (skipped.length) {
      var observer = new MutationObserver(function() {
        if (file.text.dataset.md5) {
          for ([link, node] of skipped) {
            var node2;
            if (node2 = Sauce.createSauceLink(link, post, file)) {
              $.replace(node, node2);
            }
          }
          return observer.disconnect();
        }
      });
      return observer.observe(file.text, {attributes: true});
    }
  },

  formatters: {
    TURL(post, file) { return file.thumbURL; },
    URL(post, file) { return file.url; },
    IMG(post, file, ext) { if (['gif', 'jpg', 'jpeg', 'png'].includes(ext)) { return file.url; } else { return file.thumbURL; } },
    MD5(post, file) { return file.MD5; },
    sMD5(post, file) { return file.MD5?.replace(/[+/=]/g, c => ({'+': '-', '/': '_', '=': ''})[c]); },
    hMD5(post, file) { if (file.MD5) { return (atob(file.MD5).map((c) => `0${c.charCodeAt(0).toString(16)}`.slice(-2))).join(''); } },
    board(post) { return post.board.ID; },
    name(post, file) { return file.name; },
    '%'() { return '%'; },
    semi() { return ';'; }
  }
};
