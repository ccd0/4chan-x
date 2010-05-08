(function(){
  var $, $$, _a, _b, _c, _d, _e, _f, _g, a, addClass, autoHide, bar, box, cancel, del, div, f, field, fields, filter, filterAll, filterReply, filterThread, filters, inBefore, input, keydown, label, loadFilters, mousedown, mousemove, mouseup, move, name, option, optionKeydown, options, position, remove, reset, save, saveFilters, select, tag, text, x;
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
  inBefore = function inBefore(root, el) {
    return root.parentNode.insertBefore(el, root);
  };
  tag = function tag(el) {
    return document.createElement(el);
  };
  text = function text(s) {
    return document.createTextNode(s);
  };
  remove = function remove(root) {
    return root.parentNode.removeChild(root);
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
    move.divX = parseInt(div.style.left);
    move.divY = parseInt(div.style.top);
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
  //x-browser
  if (typeof GM_deleteValue === 'undefined') {
    this.GM_setValue = function GM_setValue(name, value) {
      value = (typeof value)[0] + value;
      return localStorage.setItem(name, value);
    };
    this.GM_getValue = function GM_getValue(name, defaultValue) {
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
    this.GM_addStyle = function GM_addStyle(css) {
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
  filterThread = function filterThread(thread, filter) {
    var _a, _b, _c, _d, _e, _f, _g, _h, field, regex, s;
    _a = filter;
    for (field in _a) { if (__hasProp.call(_a, field)) {
      if (field === 'Name') {
        s = $('span.postername', thread).textContent;
      } else if (field === 'Tripcode') {
        s = ((_b = x('./span[@class="postertrip"]', thread)) == undefined ? undefined : _b.textContent) || '';
      } else if (field === 'Email') {
        s = ((_c = x('./a[@class="linkmail"]', thread)) == undefined ? undefined : _c.href.slice(7)) || '';
      } else if (field === 'Subject') {
        s = ((_d = x('./span[@class="filetitle"]', thread)) == undefined ? undefined : _d.textContent) || '';
      } else if (field === 'Comment') {
        s = $('blockquote', thread).textContent;
      } else if (field === 'File') {
        s = ((_e = x('./span[@class="filesize"]', thread)) == undefined ? undefined : _e.textContent) || '';
      }
      _g = filter[field].all.concat(filter[field].op);
      for (_f = 0, _h = _g.length; _f < _h; _f++) {
        regex = _g[_f];
        if (regex.test(s)) {
          return true;
        }
      }
    }}
  };
  filterReply = function filterReply(table, filter) {
    var _a, _b, _c, _d, _e, _f, _g, _h, field, regex, s;
    _a = filter;
    for (field in _a) { if (__hasProp.call(_a, field)) {
      if (field === 'Name') {
        s = $('span.commentpostername', table).textContent;
      } else if (field === 'Tripcode') {
        s = ((_b = $('span.postertrip', table)) == undefined ? undefined : _b.textContent) || '';
      } else if (field === 'Email') {
        //http://github.com/jashkenas/coffee-script/issues#issue/342
        //s: $('a.linkmail', table)?.href.slice(7) || ''
        s = ((_c = $('a.linkmail', table)) == undefined ? undefined : _c.href.slice(7)) || '';
      } else if (field === 'Subject') {
        s = ((_d = $('span.filetitle', table)) == undefined ? undefined : _d.textContent) || '';
      } else if (field === 'Comment') {
        s = $('blockquote', table).textContent;
      } else if (field === 'File') {
        s = ((_e = $('span.filesize', table)) == undefined ? undefined : _e.textContent) || '';
      }
      _g = filter[field].all.concat(filter[field].reply);
      for (_f = 0, _h = _g.length; _f < _h; _f++) {
        regex = _g[_f];
        if (regex.test(s)) {
          return true;
        }
      }
    }}
  };
  filterAll = function filterAll() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, compiled, filter, imagesCount, num, replies, reply, thread, threads;
    saveFilters();
    //better way of doing this? if we just say `compiled: filters`,
    //changing a prop in one will change a prop in the other.
    compiled = {};
    _a = filters;
    for (filter in _a) { if (__hasProp.call(_a, filter)) {
      (function() {
        var _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, el, field, filtered, key, match, nop, obj, regex, s, split, trimmed;
        compiled[filter] = {};
        _b = []; _c = filters[filter];
        for (field in _c) { if (__hasProp.call(_c, field)) {
          _b.push((function() {
            s = filters[filter][field];
            split = s.split(';');
            trimmed = (function() {
              _d = []; _f = split;
              for (_e = 0, _g = _f.length; _e < _g; _e++) {
                el = _f[_e];
                _d.push(el.trimLeft());
              }
              return _d;
            })();
            filtered = trimmed.filter(function(el) {
              return el.length;
            });
            if (filtered.length) {
              obj = {
                all: [],
                op: [],
                reply: []
              };
              _i = filtered;
              for (_h = 0, _j = _i.length; _h < _j; _h++) {
                el = _i[_h];
                if (/\ -\w+$/.test(el)) {
                  _k = el.match(/(.+) -(\w+)$/);
                  nop = _k[0];
                  el = _k[1];
                  match = _k[2];
                  if (match === 'o') {
                    key = 'op';
                  } else if (match === 'O') {
                    key = 'reply';
                  }
                } else {
                  key = 'all';
                }
                regex = new RegExp(el, 'i');
                obj[key].push(regex);
              }
              compiled[filter][field] = obj;
              return compiled[filter][field];
            }
          })());
        }}
        return _b;
      })();
    }}
    _b = reset();
    replies = _b[0];
    threads = _b[1];
    num = threads.length ? replies.length + threads.length : $$('blockquote').length;
    //these loops look combinable
    _d = replies;
    for (_c = 0, _e = _d.length; _c < _e; _c++) {
      reply = _d[_c];
      _f = compiled;
      for (filter in _f) { if (__hasProp.call(_f, filter)) {
        filterReply(reply, compiled[filter]) ? reply.className += ' ' + filter : null;
      }}
    }
    _h = threads;
    for (_g = 0, _i = _h.length; _g < _i; _g++) {
      thread = _h[_g];
      _j = compiled;
      for (filter in _j) { if (__hasProp.call(_j, filter)) {
        filterThread(thread, compiled[filter]) ? thread.className += ' ' + filter : null;
      }}
    }
    imagesCount = $$('img[md5]').length;
    box.firstChild.textContent = ("Images: " + imagesCount + " Posts: " + num);
    return box.firstChild.textContent;
  };
  keydown = function keydown(e) {
    if (e.keyCode === 13) {
      //enter
      return filterAll();
    }
  };
  reset = function reset() {
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
  autoHide = function autoHide() {
    box.className === 'reply' ? (box.className = 'reply autohide') : (box.className = 'reply');
    return GM_setValue('className', box.className);
  };
  save = function save() {
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
        select.appendChild(option);
      }
    }
    option == undefined ? undefined : option.selected = true;
    loadFilters();
    GM_setValue('filters', JSON.stringify(filters));
    return remove(div);
  };
  cancel = function cancel() {
    var div;
    div = this.parentNode.parentNode;
    return remove(div);
  };
  optionKeydown = function optionKeydown(e) {
    if (e.keyCode === 13) {
      //enter
      return save.call(this.parentNode);
    }
  };
  addClass = function addClass() {
    var div, input;
    div = tag('div');
    input = tag('input');
    input.addEventListener('keydown', optionKeydown, true);
    div.appendChild(input);
    inBefore(this, div);
    return input.focus();
  };
  del = function del() {
    var _a, _b, _c, option, value;
    value = this.nextElementSibling.value;
    delete filters[value];
    GM_setValue('filters', JSON.stringify(filters));
    remove(this.parentNode);
    _b = select.options;
    for (_a = 0, _c = _b.length; _a < _c; _a++) {
      option = _b[_a];
      option.value === value ? remove(option) : null;
    }
    return loadFilters();
  };
  options = function options() {
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
  loadFilters = function loadFilters() {
    var _a, _b, _c, _d, filter, input, inputs;
    filter = filters[select.value];
    inputs = $$('input', box);
    _a = []; _c = inputs;
    for (_b = 0, _d = _c.length; _b < _d; _b++) {
      input = _c[_b];
      _a.push((input.value = filter[input.name] || ''));
    }
    return _a;
  };
  saveFilters = function saveFilters() {
    var _a, _b, _c, filter, input, inputs, value;
    filter = {};
    inputs = $$('input', box);
    _b = inputs;
    for (_a = 0, _c = _b.length; _a < _c; _a++) {
      input = _b[_a];
      (value = input.value) ? (filter[input.name] = value) : null;
    }
    filters[select.value] = filter;
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
  select = tag('select');
  select.addEventListener('mousedown', saveFilters, true);
  select.addEventListener('mouseup', loadFilters, true);
  filters = JSON.parse(GM_getValue('filters', '{ "hide": {} }'));
  _a = filters;
  for (filter in _a) { if (__hasProp.call(_a, filter)) {
    option = tag('option');
    option.textContent = filter;
    select.appendChild(option);
  }}
  box.appendChild(select);
  fields = ['Name', 'Tripcode', 'Email', 'Subject', 'Comment', 'File'];
  _c = fields;
  for (_b = 0, _d = _c.length; _b < _d; _b++) {
    field = _c[_b];
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
  _f = ['apply', 'reset', 'options', 'autohide'];
  for (_e = 0, _g = _f.length; _e < _g; _e++) {
    name = _f[_e];
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
