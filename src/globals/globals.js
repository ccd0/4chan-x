var Conf, E, c, d, doc, g;

Conf = {};
c    = console;
d    = document;
doc  = d.documentElement;

g = {
  VERSION:   '<%= readJSON('version.json').version %>',
  NAMESPACE: '<%= meta.name %>.',
  boards:    {}
};

E = (function() {
  var fn, r, regex, str;
  str = {
    '&': '&amp;',
    "'": '&#039;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;'
  };
  r = String.prototype.replace;
  regex = /[&"'<>]/g;
  fn = function(x) {
    return str[x];
  };
  return function(text) {
    return r.call(text, regex, fn);
  };
})();

E.cat = function(templates) {
  var html, i, len;
  html = '';
  for (i = 0, len = templates.length; i < len; i++) {
    html += templates[i].innerHTML;
  }
  return html;
};

E.url = function(content) {
  return "data:text/html;charset=utf-8,<!doctype html>" + encodeURIComponent(content.innerHTML);
};
