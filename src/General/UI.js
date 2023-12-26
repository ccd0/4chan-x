import { Conf, d, doc } from "../globals/globals";
import Main from "../main/Main";
import $ from "../platform/$";
import $$ from "../platform/$$";
import Header from "./Header";

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const dialog = function(id, properties) {
  const el = $.el('div', {
    className: 'dialog',
    id
  }
  );
  $.extend(el, properties);
  el.style.cssText = Conf[`${id}.position`];

  const move = $('.move', el);
  $.on(move, 'touchstart mousedown', dragstart);
  for (var child of move.children) {
    if (!child.tagName) { continue; }
    $.on(child, 'touchstart mousedown', e => e.stopPropagation());
  }

  return el;
};

var Menu = (function() {
  let currentMenu = undefined;
  let lastToggledButton = undefined;
  Menu = class Menu {
    static initClass() {
      currentMenu       = null;
      lastToggledButton = null;
    }

    constructor(type) {
      // XXX AddMenuEntry event is deprecated
      this.setPosition = this.setPosition.bind(this);
      this.close = this.close.bind(this);
      this.keybinds = this.keybinds.bind(this);
      this.onFocus = this.onFocus.bind(this);
      this.addEntry = this.addEntry.bind(this);
      this.type = type;
      $.on(d, 'AddMenuEntry', ({detail}) => {
        if (detail.type !== this.type) { return; }
        delete detail.open;
        return this.addEntry(detail);
      });
      this.entries = [];
    }

    makeMenu() {
      const menu = $.el('div', {
        className: 'dialog',
        id:        'menu',
        tabIndex:  0
      }
      );
      menu.dataset.type = this.type;
      $.on(menu, 'click', e => e.stopPropagation());
      $.on(menu, 'keydown', this.keybinds);
      return menu;
    }

    toggle(e, button, data) {
      e.preventDefault();
      e.stopPropagation();

      if (currentMenu) {
        // Close if it's already opened.
        // Reopen if we clicked on another button.
        const previousButton = lastToggledButton;
        currentMenu.close();
        if (previousButton === button) { return; }
      }

      if (!this.entries.length) { return; }
      return this.open(button, data);
    }

    open(button, data) {
      let entry;
      const menu = (this.menu = this.makeMenu());
      currentMenu       = this;
      lastToggledButton = button;

      this.entries.sort((first, second) => first.order - second.order);

      for (entry of this.entries) {
        this.insertEntry(entry, menu, data);
      }

      $.addClass(lastToggledButton, 'active');

      $.on(d, 'click CloseMenu', this.close);
      $.on(d, 'scroll', this.setPosition);
      $.on(window, 'resize', this.setPosition);
      $.after(button, menu);

      this.setPosition();

      entry = $('.entry', menu);
      // We've removed flexbox, so we don't use order anymore.
      // while prevEntry = @findNextEntry entry, -1
      //   entry = prevEntry
      this.focus(entry);

      return menu.focus();
    }

    setPosition() {
      const mRect   = this.menu.getBoundingClientRect();
      const bRect   = lastToggledButton.getBoundingClientRect();
      const bTop    = window.scrollY + bRect.top;
      const bLeft   = window.scrollX + bRect.left;
      const cHeight = doc.clientHeight;
      const cWidth  = doc.clientWidth;
      const [top, bottom] = Array.from((bRect.top + bRect.height + mRect.height) < cHeight ?
        [`${bRect.bottom}px`, '']
      :
        ['', `${cHeight - bRect.top}px`]);
      const [left, right] = Array.from((bRect.left + mRect.width) < cWidth ?
        [`${bRect.left}px`, '']
      :
        ['', `${cWidth - bRect.right}px`]);
      $.extend(this.menu.style, {top, right, bottom, left});
      return this.menu.classList.toggle('left', right);
    }

    insertEntry(entry, parent, data) {
      let submenu;
      if (typeof entry.open === 'function') {
        try {
          if (!entry.open(data)) { return; }
        } catch (err) {
          Main.handleErrors({
            message: `Error in building the ${this.type} menu.`,
            error: err
          });
          return;
        }
      }
      $.add(parent, entry.el);

      if (!entry.subEntries) { return; }
      if (submenu = $('.submenu', entry.el)) {
        // Reset sub menu, remove irrelevant entries.
        $.rm(submenu);
      }
      submenu = $.el('div',
        {className: 'dialog submenu'});
      for (var subEntry of entry.subEntries) {
        this.insertEntry(subEntry, submenu, data);
      }
      $.add(entry.el, submenu);
    }

    close() {
      $.rm(this.menu);
      delete this.menu;
      $.rmClass(lastToggledButton, 'active');
      currentMenu       = null;
      lastToggledButton = null;
      $.off(d, 'click scroll CloseMenu', this.close);
      $.off(d, 'scroll', this.setPosition);
      return $.off(window, 'resize', this.setPosition);
    }

    findNextEntry(entry, direction) {
      const entries = [...Array.from(entry.parentNode.children)];
      entries.sort((first, second) => first.style.order - second.style.order);
      return entries[entries.indexOf(entry) + direction];
    }

    keybinds(e) {
      let subEntry;
      let next, submenu;
      let entry = $('.focused', this.menu);
      while ((subEntry = $('.focused', entry))) {
        entry = subEntry;
      }

      switch (e.keyCode) {
        case 27: // Esc
          lastToggledButton.focus();
          this.close();
          break;
        case 13: case 32: // Enter, Space
          entry.click();
          break;
        case 38: // Up
          if (next = this.findNextEntry(entry, -1)) {
            this.focus(next);
          }
          break;
        case 40: // Down
          if (next = this.findNextEntry(entry, +1)) {
            this.focus(next);
          }
          break;
        case 39: // Right
          if ((submenu = $('.submenu', entry)) && (next = submenu.firstElementChild)) {
            let nextPrev;
            while ((nextPrev = this.findNextEntry(next, -1))) {
              next = nextPrev;
            }
            this.focus(next);
          }
          break;
        case 37: // Left
          if (next = $.x('parent::*[contains(@class,"submenu")]/parent::*', entry)) {
            this.focus(next);
          }
          break;
        default:
          return;
      }

      e.preventDefault();
      return e.stopPropagation();
    }

    onFocus(e) {
      e.stopPropagation();
      return this.focus(e.target);
    }

    focus(entry) {
      let focused, submenu;
      while ((focused = $.x('parent::*/child::*[contains(@class,"focused")]', entry))) {
        $.rmClass(focused, 'focused');
      }
      for (focused of $$('.focused', entry)) {
        $.rmClass(focused, 'focused');
      }
      $.addClass(entry, 'focused');

      // Submenu positioning.
      if (!(submenu = $('.submenu', entry))) { return; }
      const sRect   = submenu.getBoundingClientRect();
      const eRect   = entry.getBoundingClientRect();
      const cHeight = doc.clientHeight;
      const cWidth  = doc.clientWidth;
      const [top, bottom] = Array.from((eRect.top + sRect.height) < cHeight ?
        ['0px', 'auto']
      :
        ['auto', '0px']);
      const [left, right] = Array.from((eRect.right + sRect.width) < (cWidth - 150) ?
        ['100%', 'auto']
      :
        ['auto', '100%']);
      const {style} = submenu;
      style.top    = top;
      style.bottom = bottom;
      style.left   = left;
      return style.right  = right;
    }

    addEntry(entry) {
      this.parseEntry(entry);
      return this.entries.push(entry);
    }

    parseEntry(entry) {
      const {el, subEntries} = entry;
      $.addClass(el, 'entry');
      $.on(el, 'focus mouseover', this.onFocus);
      el.style.order = entry.order || 100;
      if (!subEntries) { return; }
      $.addClass(el, 'has-submenu');
      for (var subEntry of subEntries) {
        this.parseEntry(subEntry);
      }
    }
  };
  Menu.initClass();
  return Menu;
})();

export var dragstart = function (e) {
  let isTouching;
  if ((e.type === 'mousedown') && (e.button !== 0)) { return; } // not LMB
  // prevent text selection
  e.preventDefault();
  if (isTouching = e.type === 'touchstart') {
    e = e.changedTouches[e.changedTouches.length - 1];
  }
  // distance from pointer to el edge is constant; calculate it here.
  const el = $.x('ancestor::div[contains(@class,"dialog")][1]', this);
  const rect = el.getBoundingClientRect();
  const screenHeight = doc.clientHeight;
  const screenWidth  = doc.clientWidth;
  const o = {
    id:     el.id,
    style:  el.style,
    dx:     e.clientX - rect.left,
    dy:     e.clientY - rect.top,
    height: screenHeight - rect.height,
    width:  screenWidth  - rect.width,
    screenHeight,
    screenWidth,
    isTouching
  };

  [o.topBorder, o.bottomBorder] = Array.from(Conf['Header auto-hide'] || !Conf['Fixed Header'] ?
    [0, 0]
  : Conf['Bottom Header'] ?
    [0, Header.bar.getBoundingClientRect().height]
  :
    [Header.bar.getBoundingClientRect().height, 0]);

  if (isTouching) {
    o.identifier = e.identifier;
    o.move = touchmove.bind(o);
    o.up   = touchend.bind(o);
    $.on(d, 'touchmove', o.move);
    return $.on(d, 'touchend touchcancel', o.up);
  } else { // mousedown
    o.move = drag.bind(o);
    o.up   = dragend.bind(o);
    $.on(d, 'mousemove', o.move);
    return $.on(d, 'mouseup',   o.up);
  }
};

export var touchmove = function (e) {
  for (var touch of e.changedTouches) {
    if (touch.identifier === this.identifier) {
      drag.call(this, touch);
      return;
    }
  }
};

export var drag = function (e) {
  const {clientX, clientY} = e;

  let left = clientX - this.dx;
  left = left < 10 ?
    0
  : (this.width - left) < 10 ?
    ''
  :
    ((left / this.screenWidth) * 100) + '%';

  let top = clientY - this.dy;
  top = top < (10 + this.topBorder) ?
    this.topBorder + 'px'
  : (this.height - top) < (10 + this.bottomBorder) ?
    ''
  :
    ((top / this.screenHeight) * 100) + '%';

  const right = left === '' ?
    0
  :
    '';

  const bottom = top === '' ?
    this.bottomBorder + 'px'
  :
    '';

  const {style} = this;
  style.left   = left;
  style.right  = right;
  style.top    = top;
  return style.bottom = bottom;
};

export var touchend = function (e) {
  for (var touch of e.changedTouches) {
    if (touch.identifier === this.identifier) {
      dragend.call(this);
      return;
    }
  }
};

export var dragend = function () {
  if (this.isTouching) {
    $.off(d, 'touchmove', this.move);
    $.off(d, 'touchend touchcancel', this.up);
  } else { // mouseup
    $.off(d, 'mousemove', this.move);
    $.off(d, 'mouseup',   this.up);
  }
  return $.set(`${this.id}.position`, this.style.cssText);
};

const hoverstart = function ({ root, el, latestEvent, endEvents, height, width, cb, noRemove }) {
  const rect = root.getBoundingClientRect();
  const o = {
    root,
    el,
    style: el.style,
    isImage: ['IMG', 'VIDEO'].includes(el.nodeName),
    cb,
    endEvents,
    latestEvent,
    clientHeight: doc.clientHeight,
    clientWidth:  doc.clientWidth,
    height,
    width,
    noRemove,
    clientX: (rect.left + rect.right) / 2,
    clientY: (rect.top + rect.bottom) / 2
  };
  o.hover    = hover.bind(o);
  o.hoverend = hoverend.bind(o);

  o.hover(o.latestEvent);
  new MutationObserver(function() {
    if (el.parentNode) { return o.hover(o.latestEvent); }
  }).observe(el, {childList: true});

  $.on(root, endEvents,   o.hoverend);
  if ($.x('ancestor::div[contains(@class,"inline")][1]', root)) {
    $.on(d,    'keydown',   o.hoverend);
  }
  $.on(root, 'mousemove', o.hover);

  // Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=674955
  o.workaround = function(e) { if (!root.contains(e.target)) { return o.hoverend(e); } };
  return $.on(doc,  'mousemove', o.workaround);
};

hoverstart.padding = 25;

export var hover = function (e) {
  this.latestEvent = e;
  const height = (this.height || this.el.offsetHeight) + hoverstart.padding;
  const width  = (this.width  || this.el.offsetWidth);
  const {clientX, clientY} = Conf['Follow Cursor'] ? e : this;

  const top = this.isImage ?
    Math.max(0, (clientY * (this.clientHeight - height)) / this.clientHeight)
  :
    Math.max(0, Math.min(this.clientHeight - height, clientY - 120));

  let threshold = this.clientWidth / 2;
  if (!this.isImage) { threshold = Math.max(threshold, this.clientWidth - 400); }
  let marginX = (clientX <= threshold ? clientX : this.clientWidth - clientX) + 45;
  if (this.isImage) { marginX = Math.min(marginX, this.clientWidth - width); }
  marginX += 'px';
  const [left, right] = Array.from(clientX <= threshold ? [marginX, ''] : ['', marginX]);

  const {style} = this;
  style.top   = top + 'px';
  style.left  = left;
  return style.right = right;
};

export var hoverend = function (e) {
  if (((e.type === 'keydown') && (e.keyCode !== 13)) || (e.target.nodeName === "TEXTAREA")) { return; }
  if (!this.noRemove) { $.rm(this.el); }
  $.off(this.root, this.endEvents,  this.hoverend);
  $.off(d,     'keydown',   this.hoverend);
  $.off(this.root, 'mousemove', this.hover);
  // Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=674955
  $.off(doc,   'mousemove', this.workaround);
  if (this.cb) { return this.cb.call(this); }
};

export const checkbox = function (name, text, checked) {
  if (checked == null) { checked = Conf[name]; }
  const label = $.el('label');
  const input = $.el('input', {type: 'checkbox', name, checked});
  $.add(label, [input, $.tn(` ${text}`)]);
  return label;
};

const UI = {
  dialog,
  Menu,
  hover:    hoverstart,
  checkbox
};
export default UI;
