/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
QR.persona = {
  always: {},
  types: {
    name:  [],
    email: [],
    sub:   []
  },

  init() {
    if (!Conf['Quick Reply'] && (!Conf['Menu'] || !Conf['Delete Link'])) { return; }
    for (var item of Conf['QR.personas'].split('\n')) {
      QR.persona.parseItem(item.trim());
    }
  },

  parseItem(item) {
    let match, needle, type, val;
    if (item[0] === '#') { return; }
    if (!(match = item.match(/(name|options|email|subject|password):"(.*)"/i))) { return; }
    [match, type, val]  = Array.from(match);

    // Don't mix up item settings with val.
    item = item.replace(match, '');

    const boards = item.match(/boards:([^;]+)/i)?.[1].toLowerCase() || 'global';
    if ((boards !== 'global') && (needle = g.BOARD.ID, !boards.split(',').includes(needle))) { return; }


    if (type === 'password') {
      QR.persona.pwd = val;
      return;
    }

    if (type === 'options') { type = 'email'; }
    if (type === 'subject') { type = 'sub'; }

    if (/always/i.test(item)) {
      QR.persona.always[type] = val;
    }

    if (!QR.persona.types[type].includes(val)) {
      return QR.persona.types[type].push(val);
    }
  },

  load() {
    for (var type in QR.persona.types) {
      var arr = QR.persona.types[type];
      var list = $(`#list-${type}`, QR.nodes.el);
      for (var val of arr) {
        if (val) {
          $.add(list, $.el('option',
            {textContent: val})
          );
        }
      }
    }
  },

  getPassword() {
    let m;
    if (QR.persona.pwd != null) {
      return QR.persona.pwd;
    } else if (m = d.cookie.match(/4chan_pass=([^;]+)/)) {
      return decodeURIComponent(m[1]);
    } else {
      return '';
    }
  },

  get(cb) {
    return $.get('QR.persona', {}, ({'QR.persona': persona}) => cb(persona));
  },

  set(post) {
    return $.get('QR.persona', {}, function({'QR.persona': persona}) {
      persona = {
        name:  post.name,
        flag:  post.flag
      };
      return $.set('QR.persona', persona);
    });
  }
};
