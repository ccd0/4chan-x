var Conf, E, c, d, doc, docSet, g;

Conf = Object.create(null);
c    = console;
d    = document;
doc  = d.documentElement;

// Workaround for userscript managers that run script before document.documentElement is set
docSet = function() {
  return (doc = d.documentElement);
};

g = {
  VERSION:   '<%= readJSON('/version.json').version %>',
  NAMESPACE: '<%= meta.name %>.',
  sites:     Object.create(null),
  boards:    Object.create(null)
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
