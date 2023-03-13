/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import archives from './archives.js';

var Redirect = {
  // TODO check
  archives,

  init() {
    this.selectArchives();
    if (Conf['archiveAutoUpdate']) {
      const now = Date.now();
      if (now - (2 * $.DAY) >= Conf['lastarchivecheck'] || Conf['lastarchivecheck'] > now) { return this.update(); }
    }
  },

  selectArchives() {
    let boardID, boards, data, files;
    const o = {
      thread: $.dict(),
      post:   $.dict(),
      file:   $.dict()
    };

    archives = $.dict();
    for (data of Conf['archives']) {
      var name, software, uid;
      for (var key of ['boards', 'files']) {
        if (!(data[key] instanceof Array)) { data[key] = []; }
      }
      ({uid, name, boards, files, software} = data);
      if (!['fuuka', 'foolfuuka'].includes(software)) { continue; }
      archives[JSON.stringify(uid ?? name)] = data;
      for (boardID of boards) {
        if (!(boardID in o.thread)) { o.thread[boardID] = data; }
        if (!(boardID in o.post)   && (software === 'foolfuuka')) { o.post[boardID]   = data; }
        if (!(boardID in o.file)   && files.includes(boardID)) { o.file[boardID]   = data; }
      }
    }

    for (boardID in Conf['selectedArchives']) {
      var record = Conf['selectedArchives'][boardID];
      for (var type in record) {
        var archive;
        var id = record[type];
        if ((archive = archives[JSON.stringify(id)]) && $.hasOwn(o, type)) {
          boards = type === 'file' ? archive.files : archive.boards;
          if (boards.includes(boardID)) { o[type][boardID] = archive; }
        }
      }
    }

    return Redirect.data = o;
  },

  update(cb) {
    let url;
    const urls = [];
    const responses = [];
    let nloaded = 0;
    for (url of Conf['archiveLists'].split('\n')) {
      if (url[0] !== '#') {
        url = url.trim();
        if (url) { urls.push(url); }
      }
    }

    const fail = (url, action, msg) => new Notice('warning', `Error ${action} archive data from\n${url}\n${msg}`, 20);

    const load = i => (function() {
      if (this.status !== 200) { return fail(urls[i], 'fetching', (this.status ? `Error ${this.statusText} (${this.status})` : 'Connection Error')); }
      let {response} = this;
      if (!(response instanceof Array)) { response = [response]; }
      responses[i] = response;
      nloaded++;
      if (nloaded === urls.length) {
        return Redirect.parse(responses, cb);
      }
    });

    if (urls.length) {
      for (let i = 0; i < urls.length; i++) {
        url = urls[i];
        if (['[', '{'].includes(url[0])) {
          var response;
          try {
            response = JSON.parse(url);
          } catch (err) {
            fail(url, 'parsing', err.message);
            continue;
          }
          load(i).call({status: 200, response});
        } else {
          CrossOrigin.ajax(url,
            {onloadend: load(i)});
        }
      }
    } else {
      Redirect.parse([], cb);
    }
  },

  parse(responses, cb) {
    archives = [];
    const archiveUIDs = $.dict();
    for (var response of responses) {
      for (var data of response) {
        var uid = JSON.stringify(data.uid ?? data.name);
        if (uid in archiveUIDs) {
          $.extend(archiveUIDs[uid], data);
        } else {
          archiveUIDs[uid] = $.dict.clone(data);
          archives.push(data);
        }
      }
    }
    const items = {archives, lastarchivecheck: Date.now()};
    $.set(items);
    $.extend(Conf, items);
    Redirect.selectArchives();
    return cb?.();
  },

  to(dest, data) {
    const archive = (['search', 'board'].includes(dest) ? Redirect.data.thread : Redirect.data[dest])[data.boardID];
    if (!archive) { return ''; }
    return Redirect[dest](archive, data);
  },

  protocol(archive) {
    let {
      protocol
    } = location;
    if (!$.getOwn(archive, protocol.slice(0, -1))) {
      protocol = protocol === 'https:' ? 'http:' : 'https:';
    }
    return `${protocol}//`;
  },

  thread(archive, {boardID, threadID, postID}) {
    // Keep the post number only if the location.hash was sent f.e.
    let path = threadID ?
      `${boardID}/thread/${threadID}`
    :
      `${boardID}/post/${postID}`;
    if (archive.software === 'foolfuuka') {
      path += '/';
    }
    if (threadID && postID) {
      path += archive.software === 'foolfuuka' ?
        `#${postID}`
      :
        `#p${postID}`;
    }
    return `${Redirect.protocol(archive)}${archive.domain}/${path}`;
  },

  post(archive, {boardID, postID}) {
    // For fuuka-based archives:
    // https://github.com/eksopl/fuuka/issues/27
    const protocol = Redirect.protocol(archive);
    const url = `${protocol}${archive.domain}/_/api/chan/post/?board=${boardID}&num=${postID}`;
    if (!Redirect.securityCheck(url)) { return ''; }

    return url;
  },

  file(archive, {boardID, filename}) {
    if (!filename) { return ''; }
    if (boardID === 'f') {
      filename = encodeURIComponent($.unescape(decodeURIComponent(filename)));
    } else {
      if (/[sm]\.jpg$/.test(filename)) { return ''; }
    }
    return `${Redirect.protocol(archive)}${archive.domain}/${boardID}/full_image/${filename}`;
  },

  board(archive, {boardID}) {
    return `${Redirect.protocol(archive)}${archive.domain}/${boardID}/`;
  },

  search(archive, {boardID, type, value}) {
    type = type === 'name' ?
      'username'
    : type === 'MD5' ?
      'image'
    :
      type;
    if (type === 'capcode') {
      // https://github.com/pleebe/FoolFuuka/blob/bf4224eed04637a4d0bd4411c2bf5f9945dfec0b/src/Model/Search.php#L363
      value = $.getOwn({
        'Developer': 'dev',
        'Verified':  'ver'
      }, value) || value.toLowerCase();
    } else if (type === 'image') {
      value = value.replace(/[+/=]/g, c => ({'+': '-', '/': '_', '=': ''})[c]);
    }
    value = encodeURIComponent(value);
    const path  = archive.software === 'foolfuuka' ?
      `${boardID}/search/${type}/${value}/`
    : type === 'image' ?
      `${boardID}/image/${value}`
    :
      `${boardID}/?task=search2&search_${type}=${value}`;
    return `${Redirect.protocol(archive)}${archive.domain}/${path}`;
  },

  report(boardID) {
    const urls = [];
    for (var archive of Conf['archives']) {
      var {software, https, reports, boards, name, domain} = archive;
      if ((software === 'foolfuuka') && https && reports && boards instanceof Array && boards.includes(boardID)) {
        urls.push([name, `https://${domain}/_/api/chan/offsite_report/`]);
      }
    }
    return urls;
  },

  securityCheck(url) {
    return /^https:\/\//.test(url) ||
    (location.protocol === 'http:') ||
    Conf['Exempt Archives from Encryption'];
  },

  navigate(dest, data, alternative) {
    if (!Redirect.data) { Redirect.init(); }
    const url = Redirect.to(dest, data);
    if (url && (
      Redirect.securityCheck(url) ||
      confirm(`Redirect to ${url}?\n\nYour connection will not be encrypted.`)
    )) {
      return location.replace(url);
    } else if (alternative) {
      return location.replace(alternative);
    }
  }
};
