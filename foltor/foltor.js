(function(){
  var _a, _b, _c, apply, bar, div, field, fields, filter, label, mousedown, mousemove, mouseup, move, position, reset, tag, text;
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
');
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
    label.appendChild(tag('input'));
    div.appendChild(label);
    filter.appendChild(div);
  }
  apply = tag('a');
  apply.textContent = 'apply';
  apply.className = 'pointer';
  reset = tag('a');
  reset.textContent = 'reset';
  reset.className = 'pointer';
  div = tag('div');
  div.className = 'bottom';
  div.appendChild(apply);
  div.appendChild(text(' '));
  div.appendChild(reset);
  filter.appendChild(div);
  document.body.appendChild(filter);
})();
