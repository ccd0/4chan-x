(function(){
  var $, $$, _a, _b, _c, _d, _e, _f, _g, _h, a, addClass, autoHide, bar, board, box, cancel, defaultValue, del, div, f, field, fields, filterAll, filterReply, filterThread, filters, inBefore, input, keydown, klass, label, loadFilters, mousedown, mousemove, mouseup, move, name, option, optionKeydown, options, position, remove, reset, sBoard, sKlass, save, saveFilters, tag, text, x;
  var __hasProp = Object.prototype.hasOwnProperty;
  x = function(path, root) {
    root = root || document.body;
    return document.evaluate(path, root, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
  };
  $ = function(selector, root) {
    root = root || document.body;
    return root.querySelector(selector);
  };
  $$ = function(selector, root) {
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
  inBefore = function(root, el) {
    return root.parentNode.insertBefore(el, root);
  };
  tag = function(el) {
    return document.createElement(el);
  };
  text = function(s) {
    return document.createTextNode(s);
  };
  remove = function(root) {
    return root.parentNode.removeChild(root);
  };
  position = function(el) {
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
  mousedown = function(e) {
    var div;
    div = this.parentNode;
    move.div = div;
    move.divX = parseInt(div.style.left);
    move.divY = parseInt(div.style.top);
    move.clientX = e.clientX;
    move.clientY = e.clientY;
    move.bodyX = document.body.clientWidth;
    move.bodyY = document.body.clientHeight;
    window.addEventListener('mousemove', mousemove, true);
    return window.addEventListener('mouseup', mouseup, true);
  };
  mousemove = function(e) {
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
  mouseup = function() {
    var id;
    id = move.div.id;
    GM_setValue(("" + (id) + "Left"), move.div.style.left);
    GM_setValue(("" + (id) + "Top"), move.div.style.top);
    window.removeEventListener('mousemove', mousemove, true);
    return window.removeEventListener('mouseup', mouseup, true);
  };
  //x-browser
  if (typeof GM_deleteValue === 'undefined') {
    this.GM_setValue = function(name, value) {
      value = (typeof value)[0] + value;
      return localStorage.setItem(name, value);
    };
    this.GM_getValue = function(name, defaultValue) {
      var type, value;
      if (!(value = localStorage.getItem(name))) {
        return defaultValue;
      }
      type = value[0];
      value = value.substring(1);
      if (type === 'b') {
        return value === 'true';
      } else if (type === 'n') {
        return Number(value);
      } else {
        return value;
      }
    };
    this.GM_addStyle = function(css) {
      var style;
      style = tag('style');
      style.type = 'text/css';
      style.textContent = css;
      return $('head', document).appendChild(style);
    };
  }
  GM_addStyle(' \
#box_options input { \
width: 100px; \
} \
#box, #box_options { \
position: fixed; \
text-align: right; \
border: 1px solid; \
} \
#box.autohide:not(:hover) { \
background: rgba(0,0,0,0); \
border: none; \
} \
#box.autohide:not(:hover):not(:active) > *:not(.top) { \
display: none; \
} \
#box.autohide a:last-child { \
font-weight: bold; \
} \
#box > div { \
padding: 0 5px 0 5px; \
} \
#box > .top { \
padding: 5px 5px 0 5px; \
} \
#box > .bottom { \
padding: 0 5px 5px 5px; \
} \
.move { \
cursor: move; \
} \
#box a, #box_options a { \
cursor: pointer; \
} \
.hide { \
display: none; \
} \
div.hide + hr { \
display: none; \
} \
');
  //duplicated code. sigh.
  // we could try threading the op, but that might affect other scripts.
  // also, I really want to try out *gasp* eval().
  filterThread = function(thread, fields) {
    var _a, _b, _c, _d, _e, _f, _g, _h, field, regex, s;
    _a = fields;
    for (field in _a) { if (__hasProp.call(_a, field)) {
      if (field === 'Name') {
        s = $('span.postername', thread).textContent;
      } else if (field === 'Tripcode') {
        s = (typeof (_b = (x('./span[@class="postertrip"]', thread))) === "undefined" || _b == undefined ? undefined : _b.textContent) || '';
      } else if (field === 'Email') {
        s = (typeof (_c = (x('./a[@class="linkmail"]', thread))) === "undefined" || _c == undefined ? undefined : _c.href.slice(7)) || '';
      } else if (field === 'Subject') {
        s = (typeof (_d = (x('./span[@class="filetitle"]', thread))) === "undefined" || _d == undefined ? undefined : _d.textContent) || '';
      } else if (field === 'Comment') {
        s = $('blockquote', thread).textContent;
      } else if (field === 'File') {
        s = (typeof (_e = (x('./span[@class="filesize"]', thread))) === "undefined" || _e == undefined ? undefined : _e.textContent) || '';
      }
      _g = fields[field].op;
      for (_f = 0, _h = _g.length; _f < _h; _f++) {
        regex = _g[_f];
        if (regex.test(s)) {
          return true;
        }
      }
    }}
  };
  filterReply = function(table, fields) {
    var _a, _b, _c, _d, _e, _f, _g, _h, field, regex, s;
    _a = fields;
    for (field in _a) { if (__hasProp.call(_a, field)) {
      if (field === 'Name') {
        s = $('span.commentpostername', table).textContent;
      } else if (field === 'Tripcode') {
        s = (typeof (_b = ($('span.postertrip', table))) === "undefined" || _b == undefined ? undefined : _b.textContent) || '';
      } else if (field === 'Email') {
        s = (typeof (_c = ($('a.linkmail', table))) === "undefined" || _c == undefined ? undefined : _c.href.slice(7)) || '';
      } else if (field === 'Subject') {
        s = (typeof (_d = ($('span.filetitle', table))) === "undefined" || _d == undefined ? undefined : _d.textContent) || '';
      } else if (field === 'Comment') {
        s = $('blockquote', table).textContent;
      } else if (field === 'File') {
        s = (typeof (_e = ($('span.filesize', table))) === "undefined" || _e == undefined ? undefined : _e.textContent) || '';
      }
      _g = fields[field].reply;
      for (_f = 0, _h = _g.length; _f < _h; _f++) {
        regex = _g[_f];
        if (regex.test(s)) {
          return true;
        }
      }
    }}
  };
  filterAll = function() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, boards, compiled, el, field, filtered, imageCount, key, klass, match, nop, num, obj, regex, replies, reply, s, split, thread, threads, trimmed;
    saveFilters();
    compiled = {};
    _a = filters;
    for (klass in _a) { if (__hasProp.call(_a, klass)) {
      compiled[klass] = {};
      boards = filters[klass];
      //for ['global', BOARD] of boards
      _b = boards['global'];
      for (field in _b) { if (__hasProp.call(_b, field)) {
        s = boards['global'][field];
        split = s.split(';');
        trimmed = (function() {
          _c = []; _e = split;
          for (_d = 0, _f = _e.length; _d < _f; _d++) {
            el = _e[_d];
            _c.push(el.trimLeft());
          }
          return _c;
        })();
        filtered = (function() {
          _g = []; _i = trimmed;
          for (_h = 0, _j = _i.length; _h < _j; _h++) {
            el = _i[_h];
            el.length ? _g.push(el) : null;
          }
          return _g;
        })();
        if (filtered.length) {
          obj = {
            op: [],
            reply: []
          };
          _l = filtered;
          for (_k = 0, _m = _l.length; _k < _m; _k++) {
            el = _l[_k];
            if (/\ -\w+$/.test(el)) {
              _n = el.match(/(.+) -(\w+)$/);
              nop = _n[0];
              el = _n[1];
              match = _n[2];
              if (match === 'o') {
                key = 'op';
              } else if (match === 'O') {
                key = 'reply';
              }
            }
            regex = new RegExp(el, 'i');
            if (key) {
              obj[key].push(regex);
            } else {
              obj['op'].push(regex);
              obj['reply'].push(regex);
            }
          }
          compiled[klass][field] = obj;
        }
      }}
    }}
    _o = reset();
    replies = _o[0];
    threads = _o[1];
    num = threads.length ? replies.length + threads.length : $$('blockquote').length;
    //these loops look combinable
    _q = replies;
    for (_p = 0, _r = _q.length; _p < _r; _p++) {
      reply = _q[_p];
      _s = compiled;
      for (klass in _s) { if (__hasProp.call(_s, klass)) {
        filterReply(reply, compiled[klass]) ? reply.className += ' ' + klass : null;
      }}
    }
    _u = threads;
    for (_t = 0, _v = _u.length; _t < _v; _t++) {
      thread = _u[_t];
      _w = compiled;
      for (klass in _w) { if (__hasProp.call(_w, klass)) {
        filterThread(thread, compiled[klass]) ? thread.className += ' ' + klass : null;
      }}
    }
    imageCount = $$('img[md5]').length;
    box.firstChild.textContent = ("Images: " + imageCount + " Posts: " + num);
    return box.firstChild.textContent;
  };
  keydown = function(e) {
    if (e.keyCode === 13) {
      //enter
      return filterAll();
    }
  };
  reset = function() {
    var _a, _b, _c, _d, _e, _f, form, table, tables, thread, threads;
    form = $('form[name="delform"]');
    tables = $$('table', form);
    tables.pop();
    tables.pop();
    _b = tables;
    for (_a = 0, _c = _b.length; _a < _c; _a++) {
      table = _b[_a];
      table.className = '';
    }
    threads = $$('div', form);
    threads.pop();
    _e = threads;
    for (_d = 0, _f = _e.length; _d < _f; _d++) {
      thread = _e[_d];
      thread.className = '';
    }
    return [tables, threads];
  };
  autoHide = function() {
    box.className === 'reply' ? (box.className = 'reply autohide') : (box.className = 'reply');
    return GM_setValue('className', box.className);
  };
  save = function() {
    var _a, _b, _c, div, input, inputs, option, value;
    div = this.parentNode.parentNode;
    inputs = $$('input:enabled', div);
    _b = inputs;
    for (_a = 0, _c = _b.length; _a < _c; _a++) {
      input = _b[_a];
      if ((value = input.value)) {
        filters[value] = {};
        option = tag('option');
        option.textContent = value;
        sKlass.appendChild(option);
      }
    }
    typeof option === "undefined" || option == undefined ? undefined : option.selected = true;
    loadFilters();
    GM_setValue('filters', JSON.stringify(filters));
    return remove(div);
  };
  cancel = function() {
    var div;
    div = this.parentNode.parentNode;
    return remove(div);
  };
  optionKeydown = function(e) {
    if (e.keyCode === 13) {
      //enter
      return save.call(this.parentNode);
    }
  };
  addClass = function() {
    var div, input;
    div = tag('div');
    input = tag('input');
    input.addEventListener('keydown', optionKeydown, true);
    div.appendChild(input);
    inBefore(this, div);
    return input.focus();
  };
  del = function() {
    var _a, _b, _c, option, value;
    value = this.nextElementSibling.value;
    delete filters[value];
    GM_setValue('filters', JSON.stringify(filters));
    remove(this.parentNode);
    _b = sKlass.options;
    for (_a = 0, _c = _b.length; _a < _c; _a++) {
      option = _b[_a];
      option.value === value ? remove(option) : null;
    }
    return loadFilters();
  };
  options = function() {
    var _a, a, bar, div, filter, filters, input, opt;
    if ((opt = $('#box_options'))) {
      return remove(opt);
    } else {
      opt = tag('div');
      opt.id = 'box_options';
      opt.className = 'reply';
      position(opt);
      bar = tag('div');
      bar.textContent = 'Options';
      bar.className = 'move';
      bar.addEventListener('mousedown', mousedown, true);
      opt.appendChild(bar);
      filters = JSON.parse(GM_getValue('filters', '{ "hide": {} }'));
      _a = filters;
      for (filter in _a) { if (__hasProp.call(_a, filter)) {
        div = tag('div');
        a = tag('a');
        a.textContent = 'delete';
        a.addEventListener('click', del, true);
        div.appendChild(a);
        div.appendChild(text(' '));
        input = tag('input');
        input.value = filter;
        input.disabled = true;
        div.appendChild(input);
        opt.appendChild(div);
      }}
      div = tag('div');
      a = tag('a');
      a.textContent = 'Add Class';
      a.addEventListener('click', addClass, true);
      div.appendChild(a);
      opt.appendChild(div);
      div = tag('div');
      a = tag('a');
      a.textContent = 'save';
      a.addEventListener('click', save, true);
      div.appendChild(a);
      div.appendChild(text(' '));
      a = tag('a');
      a.textContent = 'cancel';
      a.addEventListener('click', cancel, true);
      div.appendChild(a);
      opt.appendChild(div);
      return document.body.appendChild(opt);
    }
  };
  loadFilters = function() {
    var _a, _b, _c, _d, filter, input, inputs;
    filter = filters[sKlass.value][sBoard.value];
    inputs = $$('input', box);
    _a = []; _c = inputs;
    for (_b = 0, _d = _c.length; _b < _d; _b++) {
      input = _c[_b];
      _a.push((input.value = filter[input.name] || ''));
    }
    return _a;
  };
  saveFilters = function() {
    var _a, _b, _c, filter, input, inputs, value;
    filter = {};
    inputs = $$('input', box);
    _b = inputs;
    for (_a = 0, _c = _b.length; _a < _c; _a++) {
      input = _b[_a];
      (value = input.value) ? (filter[input.name] = value) : null;
    }
    filters[sKlass.value][sBoard.value] = filter;
    return GM_setValue('filters', JSON.stringify(filters));
  };
  box = tag('div');
  box.id = 'box';
  box.className = GM_getValue('className', 'reply');
  position(box);
  bar = tag('div');
  bar.className = 'move top';
  bar.addEventListener('mousedown', mousedown, true);
  box.appendChild(bar);
  sKlass = tag('select');
  sKlass.addEventListener('mousedown', saveFilters, true);
  sKlass.addEventListener('mouseup', loadFilters, true);
  defaultValue = JSON.stringify({
    'hide': {
      'global': []
    }
  });
  filters = JSON.parse(GM_getValue('filters', defaultValue));
  _a = filters;
  for (klass in _a) { if (__hasProp.call(_a, klass)) {
    option = tag('option');
    option.textContent = klass;
    sKlass.appendChild(option);
  }}
  box.appendChild(sKlass);
  sBoard = tag('select');
  _b = filters[klass];
  for (board in _b) { if (__hasProp.call(_b, board)) {
    option = tag('option');
    option.textContent = board;
    sBoard.appendChild(option);
  }}
  box.appendChild(sBoard);
  fields = ['Name', 'Tripcode', 'Email', 'Subject', 'Comment', 'File'];
  _d = fields;
  for (_c = 0, _e = _d.length; _c < _e; _c++) {
    field = _d[_c];
    div = tag('div');
    label = tag('label');
    label.textContent = field;
    input = tag('input');
    input.name = field;
    input.addEventListener('keydown', keydown, true);
    label.appendChild(input);
    div.appendChild(label);
    box.appendChild(div);
  }
  loadFilters();
  div = tag('div');
  div.className = 'bottom';
  _g = ['apply', 'reset', 'options', 'autohide'];
  for (_f = 0, _h = _g.length; _f < _h; _f++) {
    name = _g[_f];
    a = tag('a');
    a.textContent = name;
    if (name === 'apply') {
      f = filterAll;
    } else if (name === 'reset') {
      f = reset;
    } else if (name === 'options') {
      f = options;
    } else if (name === 'autohide') {
      f = autoHide;
    }
    a.addEventListener('click', f, true);
    div.appendChild(a);
    div.appendChild(text(' '));
  }
  box.appendChild(div);
  document.body.appendChild(box);
  filterAll();
})();
