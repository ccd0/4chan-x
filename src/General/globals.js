var Conf, c, d, doc, g, E, $$;

Conf = {};
c    = console;
d    = document;
doc  = d.documentElement;
g    = {
  VERSION:   '<%= readJSON('version.json').version %>',
  NAMESPACE: '<%= meta.name %>.',
  boards:    {}
};

E = (function() {
  var str = {'&': '&amp;', "'": '&#039;', '"': '&quot;', '<': '&lt;', '>': '&gt;'};
  var r = String.prototype.replace;
  var regex = /[&"'<>]/g;
  var fn = function (x) {
    return str[x];
  };
  return function(text) {
    return r.call(text, regex, fn);
  };
})();

E.cat = function(templates) {
  var html = '';
  for (var i = 0, len = templates.length; i < len; i++) {
    html += templates[i].innerHTML;
  }
  return html;
};

E.url = function (content) {
  return 'data:text/html;charset=utf-8,<!doctype html>' + encodeURIComponent(content.innerHTML);
};

$$ = function(selector, root) {
  if (root == null) {
    root = d.body;
  }
  return [].slice.call(root.querySelectorAll(selector));
};
