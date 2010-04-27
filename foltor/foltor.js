(function(){
  var $, $$, _a, _b, _c, apply, bar, div, field, fields, filter, filterAll, filterSingle, input, keydown, label, mousedown, mousemove, mouseup, move, position, reset, resetF, tag, text, x;
  var __hasProp = Object.prototype.hasOwnProperty;
  x = function x(path, root) {
    root = root || document.body;
    return document.evaluate(path, root, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
  };
  $ = function $(selector, root) {
    root = root || document.body;
    return root.querySelector(selector);
  };
  $$ = function $$(selector, root) {
    var _a, _b, _c, _d, node, result;
    root = root || document.body;
    result = root.querySelectorAll(selector);
    //magic that turns the results object into an array:
    _a = []; _c = result;
    for (_b = 0, _d = _c.length; _b < _d; _b++) {
      node = _c[_b];
      _a.push(node);
    }
    return _a;
  };
  tag = function tag(el) {
    return document.createElement(el);
  };
  text = function text(s) {
    return document.createTextNode(s);
  };
  position = function position(el) {
    var id, left, top;
    id = el.id;
    (left = GM_getValue(("" + (id) + "Left"), '0px')) ? (el.style.left = left) : (el.style.right = '0px');
    if ((top = GM_getValue(("" + (id) + "Top"), '0px'))) {
      el.style.top = top;
      return el.style.top;
    } else {
      el.style.bottom = '0px';
      return el.style.bottom;
    }
  };
  move = {};
  mousedown = function mousedown(e) {
    var div;
    div = this.parentNode;
    move.div = div;
    move.divX = div.offsetLeft;
    move.divY = div.offsetTop;
    move.clientX = e.clientX;
    move.clientY = e.clientY;
    move.bodyX = document.body.clientWidth;
    move.bodyY = document.body.clientHeight;
    window.addEventListener('mousemove', mousemove, true);
    return window.addEventListener('mouseup', mouseup, true);
  };
  mousemove = function mousemove(e) {
    var div, left, realX, realY, top;
    div = move.div;
    realX = move.divX + (e.clientX - move.clientX);
    // x + dx
    left = realX < 20 ? 0 : realX;
    if (move.bodyX - div.offsetWidth - realX < 20) {
      div.style.left = '';
      div.style.right = '0px';
    } else {
      div.style.left = left + 'px';
      div.style.right = '';
    }
    realY = move.divY + (e.clientY - move.clientY);
    // y + dy
    top = realY < 20 ? 0 : realY;
    if (move.bodyY - div.offsetHeight - realY < 20) {
      div.style.top = '';
      div.style.bottom = '0px';
      return div.style.bottom;
    } else {
      div.style.top = top + 'px';
      div.style.bottom = '';
      return div.style.bottom;
    }
  };
  mouseup = function mouseup() {
    var id;
    id = move.div.id;
    GM_setValue(("" + (id) + "Left"), move.div.style.left);
    GM_setValue(("" + (id) + "Top"), move.div.style.top);
    window.removeEventListener('mousemove', mousemove, true);
    return window.removeEventListener('mouseup', mouseup, true);
  };
  GM_addStyle(' \
#filter { \
position: fixed; \
text-align: right; \
} \
#filter:hover { \
border: 1px solid; \
} \
#filter:not(:hover) { \
background: rgba(0,0,0,0) \
} \
#filter:not(:hover) > div { \
display: none; \
} \
#filter:not(:hover) > div.top { \
display: block; \
padding: 0; \
} \
#filter > div { \
padding: 0 5px 0 5px; \
} \
#filter > .top { \
padding: 5px 5px 0 5px; \
} \
#filter > .bottom { \
padding: 0 5px 5px 5px; \
} \
.move { \
cursor: move; \
} \
.pointer { \
cursor: pointer; \
} \
.hide { \
display: none; \
} \
');
  filterSingle = function filterSingle(table, regex) {
    var _a, _b, _c, _d, _e, family, s;
    _a = regex;
    for (family in _a) { if (__hasProp.call(_a, family)) {
      if (family === 'Name') {
        s = $('span.commentpostername', table).textContent;
      } else if (family === 'Tripcode') {
        s = ((_b = $('span.postertrip', table)) == undefined ? undefined : _b.textContent) || '';
      } else if (family === 'Email') {
        s = (_c = $('a.linkmail', table)) == undefined ? undefined : _c.href.slice(7) || '';
      } else if (family === 'Subject') {
        s = ((_d = $('span.filetitle', table)) == undefined ? undefined : _d.textContent) || '';
      } else if (family === 'Comment') {
        s = $('blockquote', table).textContent;
      } else if (family === 'File') {
        s = ((_e = $('span.filesize', table)) == undefined ? undefined : _e.textContent) || '';
      }
      if (regex[family].test(s)) {
        return true;
      }
    }}
  };
  filterAll = function filterAll() {
    var _a, _b, _c, _d, _e, _f, _g, input, inputs, regex, table, tables, value;
    regex = {};
    inputs = $$('input', filter);
    _b = inputs;
    for (_a = 0, _c = _b.length; _a < _c; _a++) {
      input = _b[_a];
      (value = input.value) ? (regex[input.name] = new RegExp(value, 'i')) : null;
    }
    tables = $$('form[name="delform"] table');
    tables.pop();
    tables.pop();
    _d = []; _f = tables;
    for (_e = 0, _g = _f.length; _e < _g; _e++) {
      table = _f[_e];
      _d.push(filterSingle(table, regex) ? (table.className = 'hide') : (table.className = ''));
    }
    return _d;
  };
  keydown = function keydown(e) {
    if (e.keyCode === 13) {
      //enter
      return filterAll();
    }
  };
  resetF = function resetF() {
    var _a, _b, _c, _d, table, tables;
    tables = $$('form[name="delform"] table');
    tables.pop();
    tables.pop();
    _a = []; _c = tables;
    for (_b = 0, _d = _c.length; _b < _d; _b++) {
      table = _c[_b];
      _a.push((table.className = ''));
    }
    return _a;
  };
  filter = tag('div');
  filter.id = 'filter';
  filter.className = 'reply';
  position(filter);
  bar = tag('div');
  bar.textContent = '4chon foltor';
  bar.className = 'move top';
  bar.addEventListener('mousedown', mousedown, true);
  filter.appendChild(bar);
  fields = ['Name', 'Tripcode', 'Email', 'Subject', 'Comment', 'File'];
  _b = fields;
  for (_a = 0, _c = _b.length; _a < _c; _a++) {
    field = _b[_a];
    div = tag('div');
    label = tag('label');
    label.appendChild(text(field));
    input = tag('input');
    input.name = field;
    input.addEventListener('keydown', keydown, true);
    label.appendChild(input);
    div.appendChild(label);
    filter.appendChild(div);
  }
  apply = tag('a');
  apply.textContent = 'apply';
  apply.className = 'pointer';
  apply.addEventListener('click', filterAll, true);
  reset = tag('a');
  reset.textContent = 'reset';
  reset.className = 'pointer';
  reset.addEventListener('click', resetF, true);
  div = tag('div');
  div.className = 'bottom';
  div.appendChild(apply);
  div.appendChild(text(' '));
  div.appendChild(reset);
  filter.appendChild(div);
  document.body.appendChild(filter);
})();
