import $ from "../platform/$";
import Callbacks from "../classes/Callbacks";
import { g, Conf } from "../globals/globals";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var Time = {
  init() {
    if (!['index', 'thread', 'archive'].includes(g.VIEW) || !Conf['Time Formatting']) { return; }

    return Callbacks.Post.push({
      name: 'Time Formatting',
      cb:   this.node
    });
  },

  node() {
    if (!this.info.date || this.isClone) { return; }
    const {textContent} = this.nodes.date;
    return this.nodes.date.textContent = textContent.match(/^\s*/)[0] + Time.format(Conf['time'], this.info.date) + textContent.match(/\s*$/)[0];
  },

  format(formatString, date) {
    return formatString.replace(/%(.)/g, function(s, c) {
      if ($.hasOwn(Time.formatters, c)) {
        return Time.formatters[c].call(date);
      } else {
        return s;
      }
    });
  },

  day: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ],

  month: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],

  localeFormat(date, options, defaultValue) {
    if (Conf['timeLocale']) {
      try {
        return Intl.DateTimeFormat(Conf['timeLocale'], options).format(date);
      } catch (error) {}
    }
    return defaultValue;
  },

  localeFormatPart(date, options, part, defaultValue) {
    if (Conf['timeLocale']) {
      try {
        const parts = Intl.DateTimeFormat(Conf['timeLocale'], options).formatToParts(date);
        return parts.map(function(x) { if (x.type === part) { return x.value; } else { return ''; } }).join('');
      } catch (error) {}
    }
    return defaultValue;
  },

  zeroPad(n) { if (n < 10) { return `0${n}`; } else { return n; } },

  formatters: {
    a() { return Time.localeFormat(this, {weekday: 'short'}, Time.day[this.getDay()].slice(0, 3)); },
    A() { return Time.localeFormat(this, {weekday: 'long'},  Time.day[this.getDay()]); },
    b() { return Time.localeFormat(this, {month:   'short'}, Time.month[this.getMonth()].slice(0, 3)); },
    B() { return Time.localeFormat(this, {month:   'long'},  Time.month[this.getMonth()]); },
    d() { return Time.zeroPad(this.getDate()); },
    e() { return this.getDate(); },
    H() { return Time.zeroPad(this.getHours()); },
    I() { return Time.zeroPad((this.getHours() % 12) || 12); },
    k() { return this.getHours(); },
    l() { return (this.getHours() % 12) || 12; },
    m() { return Time.zeroPad(this.getMonth() + 1); },
    M() { return Time.zeroPad(this.getMinutes()); },
    p() { return Time.localeFormatPart(this, {hour: 'numeric', hour12: true}, 'dayperiod', (this.getHours() < 12 ? 'AM' : 'PM')); },
    P() { return Time.formatters.p.call(this).toLowerCase(); },
    S() { return Time.zeroPad(this.getSeconds()); },
    y() { return this.getFullYear().toString().slice(2); },
    Y() { return this.getFullYear(); },
    '%'() { return '%'; }
  }
};
export default Time;
