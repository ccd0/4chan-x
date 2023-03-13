/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import SettingsPage from './Settings/Settings.html';
import FilterGuidePage from './Settings/Filter-guide.html';
import SaucePage from './Settings/Sauce.html';
import AdvancedPage from './Settings/Advanced.html';
import KeybindsPage from './Settings/Keybinds.html';
import FilterSelectPage from './Settings/Filter-select.html';

var Settings = {
  init() {
    // 4chan X settings link
    const link = $.el('a', {
      className:   'settings-link fa fa-wrench',
      textContent: 'Settings',
      title:       '<%= meta.name %> Settings',
      href:        'javascript:;'
    }
    );
    $.on(link, 'click', Settings.open);

    Header.addShortcut('settings', link, 820);

    const add = this.addSection;

    add('Main',     this.main);
    add('Filter',   this.filter);
    add('Sauce',    this.sauce);
    add('Advanced', this.advanced);
    add('Keybinds', this.keybinds);

    $.on(d, 'AddSettingsSection',   Settings.addSection);
    $.on(d, 'OpenSettings', e => Settings.open(e.detail));

    if ((g.SITE.software === 'yotsuba') && Conf['Disable Native Extension']) {
      if ($.hasStorage) {
        // Run in page context to handle case where 4chan X has localStorage access but not the page.
        // (e.g. Pale Moon 26.2.2, GM 3.8, cookies disabled for 4chan only)
        return $.global(function() {
          try {
            const settings = JSON.parse(localStorage.getItem('4chan-settings')) || {};
            if (settings.disableAll) { return; }
            settings.disableAll = true;
            return localStorage.setItem('4chan-settings', JSON.stringify(settings));
          } catch (error) {
            return Object.defineProperty(window, 'Config', {value: {disableAll: true}});
          }});
      } else {
        return $.global(() => Object.defineProperty(window, 'Config', {value: {disableAll: true}}));
      }
    }
  },

  open(openSection) {
    let dialog, sectionToOpen;
    if (Settings.dialog) { return; }
    $.event('CloseMenu');

    Settings.dialog = (dialog = $.el('div',
      {id:        'overlay'}
    , { innerHTML: SettingsPage }));

    $.on($('.export', dialog), 'click',  Settings.export);
    $.on($('.import', dialog), 'click',  Settings.import);
    $.on($('.reset',  dialog), 'click',  Settings.reset);
    $.on($('input',   dialog), 'change', Settings.onImport);

    const links = [];
    for (var section of Settings.sections) {
      var link = $.el('a', {
        className: `tab-${section.hyphenatedTitle}`,
        textContent: section.title,
        href: 'javascript:;'
      }
      );
      $.on(link, 'click', Settings.openSection.bind(section));
      links.push(link, $.tn(' | '));
      if (section.title === openSection) { sectionToOpen = link; }
    }
    links.pop();
    $.add($('.sections-list', dialog), links);
    if (openSection !== 'none') { (sectionToOpen ? sectionToOpen : links[0]).click(); }

    $.on($('.close', dialog), 'click', Settings.close);
    $.on(window, 'beforeunload', Settings.close);
    $.on(dialog, 'click', Settings.close);
    $.on(dialog.firstElementChild, 'click', e => e.stopPropagation());

    $.add(d.body, dialog);

    return $.event('OpenSettings', null, dialog);
  },

  close() {
    if (!Settings.dialog) { return; }
    // Unfocus current field to trigger change event.
    d.activeElement?.blur();
    $.rm(Settings.dialog);
    return delete Settings.dialog;
  },

  sections: [],

  addSection(title, open) {
    if (typeof title !== 'string') {
      ({title, open} = title.detail);
    }
    const hyphenatedTitle = title.toLowerCase().replace(/\s+/g, '-');
    return Settings.sections.push({title, hyphenatedTitle, open});
  },

  openSection() {
    let selected;
    if (selected = $('.tab-selected', Settings.dialog)) {
      $.rmClass(selected, 'tab-selected');
    }
    $.addClass($(`.tab-${this.hyphenatedTitle}`, Settings.dialog), 'tab-selected');
    const section = $('section', Settings.dialog);
    $.rmAll(section);
    section.className = `section-${this.hyphenatedTitle}`;
    this.open(section, g);
    section.scrollTop = 0;
    return $.event('OpenSettings', null, section);
  },

  warnings: {
    localStorage(cb) {
      if ($.cantSync) {
        const why = $.cantSet ? 'save your settings' : 'synchronize settings between tabs';
        return cb($.el('li', {
          textContent: `\
<%= meta.name %> needs local storage to ${why}.
Enable it on boards.${location.hostname.split('.')[1]}.org in your browser's privacy settings (may be listed as part of "local data" or "cookies").\
`
        }
        )
        );
      }
    },
    ads(cb) {
      return $.onExists(doc, '.adg-rects > .desktop', ad => $.onExists(ad, 'iframe', function() {
        const url = Redirect.to('thread', {boardID: 'qa', threadID: 362590});
        return cb($.el('li',
          { innerHTML:
            'To protect yourself from <a href="${url}" target="_blank">malicious ads</a>,' +
            ' you should <a href="https://github.com/gorhill/uBlock#ublock-origin" target="_blank">block ads</a> on 4chan.'
          }
        )
        );
      }));
    }
  },

  main(section) {
    let key;
    const warnings = $.el('fieldset',
      {hidden: true}
    ,
      {innerHTML: '<legend>Warnings</legend><ul></ul>'});
    const addWarning = function(item) {
      $.add($('ul', warnings), item);
      return warnings.hidden = false;
    };
    for (key in Settings.warnings) {
      var warning = Settings.warnings[key];
      warning(addWarning);
    }
    $.add(section, warnings);

    const items  = $.dict();
    const inputs = $.dict();
    const addCheckboxes = function(root, obj) {
      const containers = [root];
      return (() => {
        const result = [];
        for (key in obj) {
          var arr = obj[key];
          if (arr instanceof Array) {
            var description = arr[1];
            var div = $.el('div',
              {innerHTML: '<label><input type="checkbox" name="${key}">${key}</label><span class="description">: ${description}</span>'});
            div.dataset.name = key;
            var input = $('input', div);
            $.on(input, 'change', $.cb.checked);
            $.on(input, 'change', function() { return this.parentNode.parentNode.dataset.checked = this.checked; });
            items[key]  = Conf[key];
            inputs[key] = input;
            var level = arr[2] || 0;
            if (containers.length <= level) {
              var container = $.el('div', {className: 'suboption-list'});
              $.add(containers[containers.length-1].lastElementChild, container);
              containers[level] = container;
            } else if (containers.length > (level+1)) {
              containers.splice(level+1, containers.length - (level+1));
            }
            result.push($.add(containers[level], div));
          }
        }
        return result;
      })();
    };

    for (var keyFS in Config.main) {
      var obj = Config.main[keyFS];
      var fs = $.el('fieldset',
        {innerHTML: '<legend>${keyFS}</legend>'});
      addCheckboxes(fs, obj);
      if (keyFS === 'Posting and Captchas') {
        $.add(fs, $.el('p',
          {innerHTML: 'For more info on captcha options and issues, see the <a href="' + meta.captchaFAQ + '" target="_blank">captcha FAQ</a>.'})
        );
      }
      $.add(section, fs);
    }
    addCheckboxes($('div[data-name="JSON Index"] > .suboption-list', section), Config.Index);

    // Unsupported options
    if ($.engine !== 'gecko') {
      $('div[data-name="Remember QR Size"]', section).hidden = true;
    }
    if ($.perProtocolSettings || (location.protocol !== 'https:')) {
      $('div[data-name="Redirect to HTTPS"]', section).hidden = true;
    }
    if ($.platform !== 'crx') {
      $('div[data-name="Work around CORB Bug"]', section).hidden = true;
    }

    $.get(items, function(items) {
      for (key in items) {
        var val = items[key];
        inputs[key].checked = val;
        inputs[key].parentNode.parentNode.dataset.checked = val;
      }
    });

    const div = $.el('div',
      {innerHTML: '<button></button><span class="description">: Clear manually-hidden threads and posts on all boards. Reload the page to apply.'});
    const button = $('button', div);
    $.get({hiddenThreads: $.dict(), hiddenPosts: $.dict()}, function({hiddenThreads, hiddenPosts}) {
      let board, ID, site, thread;
      let hiddenNum = 0;
      for (ID in hiddenThreads) {
        site = hiddenThreads[ID];
        if (ID !== 'boards') {
          for (ID in site.boards) {
            board = site.boards[ID];
            hiddenNum += Object.keys(board).length;
          }
        }
      }
      for (ID in hiddenThreads.boards) {
        board = hiddenThreads.boards[ID];
        hiddenNum += Object.keys(board).length;
      }
      for (ID in hiddenPosts) {
        site = hiddenPosts[ID];
        if (ID !== 'boards') {
          for (ID in site.boards) {
            board = site.boards[ID];
            for (ID in board) {
              thread = board[ID];
              hiddenNum += Object.keys(thread).length;
            }
          }
        }
      }
      for (ID in hiddenPosts.boards) {
        board = hiddenPosts.boards[ID];
        for (ID in board) {
          thread = board[ID];
          hiddenNum += Object.keys(thread).length;
        }
      }
      return button.textContent = `Hidden: ${hiddenNum}`;
    });
    $.on(button, 'click', function() {
      this.textContent = 'Hidden: 0';
      return $.get('hiddenThreads', $.dict(), function({hiddenThreads}) {
        if ($.hasStorage && (g.SITE.software === 'yotsuba')) {
          let boardID;
          for (boardID in hiddenThreads['4chan.org']?.boards) {
            localStorage.removeItem(`4chan-hide-t-${boardID}`);
          }
          for (boardID in hiddenThreads.boards) {
            localStorage.removeItem(`4chan-hide-t-${boardID}`);
          }
        }
        return ($.delete(['hiddenThreads', 'hiddenPosts']));
      });
    });
    return $.after($('input[name="Stubs"]', section).parentNode.parentNode, div);
  },

  export() {
    // Make sure to export the most recent data, but don't overwrite existing `Conf` object.
    const Conf2 = $.dict();
    $.extend(Conf2, Conf);
    return $.get(Conf2, function(Conf2) {
      // Don't export cached JSON data.
      delete Conf2['boardConfig'];
      return (Settings.downloadExport({version: g.VERSION, date: Date.now(), Conf: Conf2}));
    });
  },

  downloadExport(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = $.el('a', {
      download: `<%= meta.name %> v${g.VERSION}-${data.date}.json`,
      href: url
    }
    );
    const p = $('.imp-exp-result', Settings.dialog);
    $.rmAll(p);
    $.add(p, a);
    return a.click();
  },

  import() {
    return $('input[type=file]', this.parentNode).click();
  },

  onImport() {
    let file;
    if (!(file = this.files[0])) { return; }
    this.value = null;
    const output = $('.imp-exp-result');
    if (!confirm('Your current settings will be entirely overwritten, are you sure?')) {
      output.textContent = 'Import aborted.';
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        return Settings.loadSettings($.dict.json(e.target.result), function(err) {
          if (err) {
            return output.textContent = 'Import failed due to an error.';
          } else if (confirm('Import successful. Reload now?')) {
            return window.location.reload();
          }
        });
      } catch (error) {
        const err = error;
        output.textContent = 'Import failed due to an error.';
        return c.error(err.stack);
      }
    };
    return reader.readAsText(file);
  },

  convertFrom: {
    loadletter(data) {
      const convertSettings = function(data, map) {
        for (var prevKey in map) {
          var newKey = map[prevKey];
          if (newKey) { data.Conf[newKey] = data.Conf[prevKey]; }
          delete data.Conf[prevKey];
        }
        return data;
      };
      data = convertSettings(data, {
        // General confs
        'Disable 4chan\'s extension': 'Disable Native Extension',
        'Comment Auto-Expansion': '',
        'Remove Slug': '',
        'Always HTTPS': 'Redirect to HTTPS',
        'Check for Updates': '',
        'Recursive Filtering': 'Recursive Hiding',
        'Reply Hiding': 'Reply Hiding Buttons',
        'Thread Hiding': 'Thread Hiding Buttons',
        'Show Stubs': 'Stubs',
        'Image Auto-Gif': 'Replace GIF',
        'Expand All WebM': 'Expand videos',
        'Reveal Spoilers': 'Reveal Spoiler Thumbnails',
        'Expand From Current': 'Expand from here',
        'Current Page': 'Page Count in Stats',
        'Current Page Position': '',
        'Alternative captcha': 'Use Recaptcha v1',
        'Alt index captcha': 'Use Recaptcha v1 on Index',
        'Auto Submit': 'Post on Captcha Completion',
        'Open Reply in New Tab': 'Open Post in New Tab',
        'Remember QR size': 'Remember QR Size',
        'Remember Subject': '',
        'Quote Inline': 'Quote Inlining',
        'Quote Preview': 'Quote Previewing',
        'Indicate OP quote': 'Mark OP Quotes',
        'Indicate You quote': 'Mark Quotes of You',
        'Indicate Cross-thread Quotes': 'Mark Cross-thread Quotes',
        // filter
        'uniqueid': 'uniqueID',
        'mod': 'capcode',
        'email': '',
        'country': 'flag',
        'md5': 'MD5',
        // keybinds
        'openEmptyQR': 'Open empty QR',
        'openQR': 'Open QR',
        'openOptions': 'Open settings',
        'close': 'Close',
        'spoiler': 'Spoiler tags',
        'sageru': 'Toggle sage',
        'code': 'Code tags',
        'sjis': 'SJIS tags',
        'submit': 'Submit QR',
        'watch': 'Watch',
        'update': 'Update',
        'unreadCountTo0': '',
        'expandAllImages': 'Expand images',
        'expandImage': 'Expand image',
        'zero': 'Front page',
        'nextPage': 'Next page',
        'previousPage': 'Previous page',
        'nextThread': 'Next thread',
        'previousThread': 'Previous thread',
        'expandThread': 'Expand thread',
        'openThreadTab': 'Open thread',
        'openThread': 'Open thread tab',
        'nextReply': 'Next reply',
        'previousReply': 'Previous reply',
        'hide': 'Hide',
        // updater
        'Scrolling': 'Auto Scroll',
        'Verbose': ''
      }
      );
      if ('Always CDN' in data.Conf) {
        data.Conf['fourchanImageHost'] = data.Conf['Always CDN'] ? 'i.4cdn.org' : '';
        delete data.Conf['Always CDN'];
      }
      data.Conf.sauces = data.Conf.sauces.replace(/\$\d/g, function(c) {
        switch (c) {
          case '$1':
            return '%TURL';
          case '$2':
            return '%URL';
          case '$3':
            return '%MD5';
          case '$4':
            return '%board';
          default:
            return c;
        }
      });
      for (var key in Config.hotkeys) {
        var val = Config.hotkeys[key];
        if (key in data.Conf) {
          data.Conf[key] = data.Conf[key].replace(/ctrl|alt|meta/g, s => `${s[0].toUpperCase()}${s.slice(1)}`).replace(/(^|.+\+)[A-Z]$/g, s => `Shift+${s.slice(0, -1)}${s.slice(-1).toLowerCase()}`);
        }
      }
      if (data.WatchedThreads) {
        data.Conf['watchedThreads'] = $.dict.clone({'4chan.org': {boards: {}}});
        for (var boardID in data.WatchedThreads) {
          var threads = data.WatchedThreads[boardID];
          for (var threadID in threads) {
            var threadData = threads[threadID];
            (data.Conf['watchedThreads']['4chan.org'].boards[boardID] || (data.Conf['watchedThreads']['4chan.org'].boards[boardID] = $.dict()))[threadID] = {excerpt: threadData.textContent};
          }
        }
      }
      return data;
    }
  },

  upgrade(data, version) {
    let corrupted, key, val;
    const changes = $.dict();
    const set = (key, value) => data[key] = (changes[key] = value);
    const setD = function(key, value) {
      if (data[key] == null) { return set(key, value); }
    };
    const addSauces = function(sauces) {
      if (data['sauces'] != null) {
        sauces = sauces.filter(s => data['sauces'].indexOf(s.match(/[^#;\s]+|$/)[0]) < 0);
        if (sauces.length) {
          return set('sauces', data['sauces'] + '\n\n' + sauces.join('\n'));
        }
      }
    };
    const addCSS = function(css) {
      if (data['usercss'] == null) { set('usercss', Config['usercss']); }
      if (data['usercss'].indexOf(css) < 0) {
        return set('usercss', css + '\n\n' + data['usercss']);
      }
    };
    // XXX https://github.com/greasemonkey/greasemonkey/issues/2600
    if (corrupted = (version[0] === '"')) {
      try {
        version = JSON.parse(version);
      } catch (error) {}
    }
    const compareString = version.replace(/\d+/g, x => ('0000'+x).slice(-5));
    if (compareString < '00001.00013.00014.00008') {
      for (key in data) {
        val = data[key];
        if ((typeof val === 'string') && (typeof Conf[key] !== 'string') && !['Index Sort', 'Last Long Reply Thresholds 0', 'Last Long Reply Thresholds 1'].includes(key)) {
          corrupted = true;
          break;
        }
      }
    }
    if (corrupted) {
      for (key in data) {
        val = data[key];
        if (typeof val === 'string') {
          try {
            var val2 = JSON.parse(val);
            set(key, val2);
          } catch (error1) {}
        }
      }
    }
    if (compareString < '00001.00011.00008.00000') {
      if (data['Fixed Thread Watcher'] == null) {
        set('Fixed Thread Watcher', data['Toggleable Thread Watcher'] ?? true);
      }
      if (data['Exempt Archives from Encryption'] == null) {
        set('Exempt Archives from Encryption', data['Except Archives from Encryption'] ?? false);
      }
    }
    if (compareString < '00001.00011.00010.00001') {
      if (data['selectedArchives'] != null) {
        const uids = {"Moe":0,"4plebs Archive":3,"Nyafuu Archive":4,"Love is Over":5,"Rebecca Black Tech":8,"warosu":10,"fgts":15,"not4plebs":22,"DesuStorage":23,"fireden.net":24,"disabled":null};
        for (var boardID in data['selectedArchives']) {
          var record = data['selectedArchives'][boardID];
          for (var type in record) {
            var name = record[type];
            if ($.hasOwn(uids, name)) {
              record[type] = uids[name];
            }
          }
        }
        set('selectedArchives', data['selectedArchives']);
      }
    }
    if (compareString < '00001.00011.00016.00000') {
      let rice;
      if (rice = Config['usercss'].match(/\/\* Board title rice \*\/(?:\n.+)*/)[0]) {
        if ((data['usercss'] != null) && (data['usercss'].indexOf(rice) < 0)) {
          set('usercss', rice + '\n\n' + data['usercss']);
        }
      }
    }
    if (compareString < '00001.00011.00017.00000') {
      for (key of ['Persistent QR', 'Color User IDs', 'Fappe Tyme', 'Werk Tyme', 'Highlight Posts Quoting You', 'Highlight Own Posts']) {
        if (data[key] == null) { set(key, (key === 'Persistent QR')); }
      }
    }
    if (compareString < '00001.00011.00017.00006') {
      if (data['sauces'] != null) {
        set('sauces', data['sauces'].replace(/^(#?\s*)http:\/\/iqdb\.org\//mg, '$1//iqdb.org/'));
      }
    }
    if ((compareString < '00001.00011.00019.00003') && !Settings.dialog) {
      $.queueTask(() => Settings.warnings.ads(item => new Notice('warning', [...Array.from(item.childNodes)])));
    }
    if (compareString < '00001.00011.00020.00003') {
      const object = {'Inline Cross-thread Quotes Only': false, 'Pass Link': true};
      for (key in object) {
        var value = object[key];
        if (data[key] == null) { set(key, value); }
      }
    }
    if (compareString < '00001.00011.00021.00003') {
      if (data['Remember Your Posts'] == null) {
        set('Remember Your Posts', data['Mark Quotes of You'] ?? true);
      }
    }
    if (compareString < '00001.00011.00022.00000') {
      if (data['sauces'] != null) {
        set('sauces', data['sauces'].replace(/^(#?\s*https:\/\/www\.google\.com\/searchbyimage\?image_url=%(?:IMG|URL))%3Fs\.jpg/mg, '$1'));
        set('sauces', data['sauces'].replace(/^#?\s*https:\/\/www\.google\.com\/searchbyimage\?image_url=%(?:IMG|T?URL)(?=$|;)/mg, '$&&safe=off'));
      }
    }
    if (compareString < '00001.00011.00022.00002') {
      if ((data['Use Recaptcha v1 in Reports'] == null) && data['Use Recaptcha v1'] && !data['Use Recaptcha v2 in Reports']) {
        set('Use Recaptcha v1 in Reports', true);
      }
    }
    if (compareString < '00001.00011.00024.00000') {
      if ((data['JSON Navigation'] != null) && (data['JSON Index'] == null)) {
        set('JSON Index', data['JSON Navigation']);
      }
    }
    if (compareString < '00001.00011.00026.00000') {
      if ((data['Oekaki Links'] != null) && (data['Edit Link'] == null)) {
        set('Edit Link', data['Oekaki Links']);
      }
      if (data['Inline Cross-thread Quotes Only'] == null) { set('Inline Cross-thread Quotes Only', true); }
    }
    if (compareString < '00001.00011.00030.00000') {
      if (data['Quote Threading'] && (data['Thread Quotes'] == null)) {
        set('Thread Quotes', true);
      }
    }
    if (compareString < '00001.00011.00032.00000') {
      if (data['sauces'] != null) {
        set('sauces', data['sauces'].replace(/^(#?\s*)http:\/\/3d\.iqdb\.org\//mg, '$1//3d.iqdb.org/'));
      }
      addSauces([
        '#https://desustorage.org/_/search/image/%sMD5/',
        '#https://boards.fireden.net/_/search/image/%sMD5/',
        '#https://foolz.fireden.net/_/search/image/%sMD5/',
        '#//www.gif-explode.com/%URL;types:gif'
      ]);
    }
    if (compareString < '00001.00011.00035.00000') {
      addSauces(['https://whatanime.ga/?auto&url=%IMG;text:wait']);
    }
    if (compareString < '00001.00012.00000.00000') {
      if (data['Exempt Archives from Encryption'] == null) { set('Exempt Archives from Encryption', false); }
      if (data['Show New Thread Option in Threads'] == null) { set('Show New Thread Option in Threads', false); }
      if (data['Show Name and Subject']) { addCSS('#qr .persona .field {display: block !important;}'); }
      if (data['QR Shortcut'] === false) { addCSS('#shortcut-qr {display: none;}'); }
      if (data['Bottom QR Link'] === false) { addCSS('.qr-link-container-bottom {display: none;}'); }
    }
    if (compareString < '00001.00012.00000.00006') {
      if (data['sauces'] != null) {
        set('sauces', data['sauces'].replace(/^(#?\s*)https:\/\/(?:desustorage|cuckchan)\.org\//mg, '$1https://desuarchive.org/'));
      }
    }
    if (compareString < '00001.00012.00001.00000') {
      if ((data['Persistent Thread Watcher'] == null) && (data['Toggleable Thread Watcher'] != null)) {
        set('Persistent Thread Watcher', !data['Toggleable Thread Watcher']);
      }
    }
    if (compareString < '00001.00012.00003.00000') {
      for (key of ['Image Hover in Catalog', 'Auto Watch', 'Auto Watch Reply']) {
        setD(key, false);
      }
    }
    if (compareString < '00001.00013.00001.00002') {
      addSauces(['#//www.bing.com/images/search?q=imgurl:%IMG&view=detailv2&iss=sbi#enterInsights']);
    }
    if (compareString < '00001.00013.00005.00000') {
      if (data['sauces'] != null) {
        set('sauces', data['sauces'].replace(/^(#?\s*)http:\/\/regex\.info\/exif\.cgi/mg, '$1http://exif.regex.info/exif.cgi'));
      }
      addSauces(Config['sauces'].match(/# Known filename formats:(?:\n.+)*|$/)[0].split('\n'));
    }
    if (compareString < '00001.00013.00007.00002') {
      setD('Require OP Quote Link', true);
    }
    if (compareString < '00001.00013.00008.00000') {
      setD('Download Link', true);
    }
    if (compareString < '00001.00013.00009.00003') {
      if (data['jsWhitelist'] != null) {
        const list = data['jsWhitelist'].split('\n');
        if (!list.includes('https://cdnjs.cloudflare.com') && list.includes('https://cdn.mathjax.org')) {
          set('jsWhitelist', data['jsWhitelist'] + '\n\nhttps://cdnjs.cloudflare.com');
        }
      }
    }
    if (compareString < '00001.00014.00000.00006') {
      if (data['siteSoftware'] != null) {
        set('siteSoftware', data['siteSoftware'] + '\n4cdn.org yotsuba');
      }
    }
    if (compareString < '00001.00014.00003.00002') {
      if (data['sauces'] != null) {
        set('sauces', data['sauces'].replace(/^(#?\s*)https:\/\/whatanime\.ga\//mg, '$1https://trace.moe/'));
      }
    }
    if (compareString < '00001.00014.00004.00004') {
      if ((data['siteSoftware'] != null) && !/^4channel\.org yotsuba$/m.test(data['siteSoftware'])) {
        set('siteSoftware', data['siteSoftware'] + '\n4channel.org yotsuba');
      }
    }
    if (compareString < '00001.00014.00005.00000') {
      for (var db of DataBoard.keys) {
        if (data[db]?.boards) {
          var {boards, lastChecked} = data[db];
          data[db]['4chan.org'] = {boards, lastChecked};
          delete data[db].boards;
          delete data[db].lastChecked;
          set(db, data[db]);
        }
      }
      if ((data['siteSoftware'] != null) && (data['siteProperties'] == null)) {
        const siteProperties = $.dict();
        for (var line of data['siteSoftware'].split('\n')) {
          var [hostname, software] = Array.from(line.split(' '));
          siteProperties[hostname] = {software};
        }
        set('siteProperties', siteProperties);
      }
    }
    if (compareString < '00001.00014.00006.00006') {
      if (data['sauces'] != null) {
        set('sauces', data['sauces'].replace(
          /\/\/%\$1\.deviantart\.com\/gallery\/#\/d%\$2;regexp:\/\^\\w\+_by_\(\\w\+\)-d\(\[\\da-z\]\+\)\//g,
          '//www.deviantart.com/gallery/#/d%$1%$2;regexp:/^\\w+_by_\\w+[_-]d([\\da-z]{6})\\b|^d([\\da-z]{6})-[\\da-z]{8}-/'
        )
        );
      }
    }
    if (compareString < '00001.00014.00008.00000') {
      if (data['sauces'] != null) {
        set('sauces', data['sauces'].replace(
          /https:\/\/www\.yandex\.com\/images\/search/g,
          'https://yandex.com/images/search'
        )
        );
      }
    }
    if (compareString < '00001.00014.00009.00000') {
      if (data['sauces'] != null) {
        set('sauces', data['sauces'].replace(/^(#?\s*)(?:http:)?\/\/(www\.pixiv\.net|www\.deviantart\.com|imgur\.com|flickr\.com)\//mg, '$1https://$2/'));
        set('sauces', data['sauces'].replace(/https:\/\/yandex\.com\/images\/search\?rpt=imageview&img_url=%IMG/g, 'https://yandex.com/images/search?rpt=imageview&url=%IMG'));
      }
    }
    if (compareString < '00001.00014.00009.00001') {
      if ((data['Use Faster Image Host'] != null) && (data['fourchanImageHost'] == null)) {
        set('fourchanImageHost', (data['Use Faster Image Host'] ? 'i.4cdn.org' : ''));
      }
    }
    if (compareString < '00001.00014.00010.00001') {
      if (data['Filter in Native Catalog'] == null) {
        set('Filter in Native Catalog', false);
      }
    }
    if (compareString < '00001.00014.00012.00008') {
      if (data['boardnav'] == null) {
        set('boardnav', `\
[ toggle-all ]
a-replace
c-replace
g-replace
k-replace
v-replace
vg-replace
vr-replace
ck-replace
co-replace
fit-replace
jp-replace
mu-replace
sp-replace
tv-replace
vp-replace
[external-text:"FAQ","<%= meta.faq %>"]\
`
        );
      }
    }
    if (compareString < '00001.00014.00016.00001') {
      if (data['archiveLists'] != null) {
        set('archiveLists', data['archiveLists'].replace('https://mayhemydg.github.io/archives.json/archives.json', 'https://nstepien.github.io/archives.json/archives.json'));
      }
    }
    if (compareString < '00001.00014.00016.00007') {
      if (data['sauces'] != null) {
        set('sauces', data['sauces'].replace(
          /https:\/\/www\.deviantart\.com\/gallery\/#\/d%\$1%\$2;regexp:\/\^\\w\+_by_\\w\+\[_-\]d\(\[\\da-z\]\{6\}\)\\b\|\^d\(\[\\da-z\]\{6\}\)-\[\\da-z\]\{8\}-\//g,
          'javascript:void(open("https://www.deviantart.com/"+%$1.replace(/_/g,"-")+"/art/"+parseInt(%$2,36)));regexp:/^\\w+_by_(\\w+)[_-]d([\\da-z]{6})\\b/'
        ).replace(
          /\/\/imgops\.com\/%URL/g,
          '//imgops.com/start?url=%URL'
        )
        );
      }
    }
    if (compareString < '00001.00014.00017.00002') {
      if (data['jsWhitelist'] != null) {
        set('jsWhitelist', data['jsWhitelist'] + '\n\nhttps://hcaptcha.com\nhttps://*.hcaptcha.com');
      }
    }
    if (compareString < '00001.00014.00020.00004') {
      if (data['archiveLists'] != null) {
        set('archiveLists', data['archiveLists'].replace('https://nstepien.github.io/archives.json/archives.json', 'https://4chenz.github.io/archives.json/archives.json'));
      }
    }
    return changes;
  },

  loadSettings(data, cb) {
    if (data.version.split('.')[0] === '2') { // https://github.com/loadletter/4chan-x
      data = Settings.convertFrom.loadletter(data);
    } else if (data.version !== g.VERSION) {
      Settings.upgrade(data.Conf, data.version);
    }
    return $.clear(function(err) {
      if (err) { return cb(err); }
      return $.set(data.Conf, cb);
    });
  },

  reset() {
    if (confirm('Your current settings will be entirely wiped, are you sure?')) {
      return $.clear(function(err) {
        if (err) {
          return $('.imp-exp-result').textContent = 'Import failed due to an error.';
        } else if (confirm('Reset successful. Reload now?')) {
          return window.location.reload();
        }
      });
    }
  },

  filter(section) {
    $.extend(section, { innerHTML: FilterSelectPage });
    const select = $('select', section);
    $.on(select, 'change', Settings.selectFilter);
    return Settings.selectFilter.call(select);
  },

  selectFilter() {
    let name;
    const div = this.nextElementSibling;
    if ((name = this.value) !== 'guide') {
      if (!$.hasOwn(Config.filter, name)) { return; }
      $.rmAll(div);
      const ta = $.el('textarea', {
        name,
        className: 'field',
        spellcheck: false
      }
      );
      $.on(ta, 'change', $.cb.value);
      $.get(name, Conf[name], function(item) {
        ta.value = item[name];
        return $.add(div, ta);
      });
      return;
    }
    const filterTypes = Object.keys(Config.filter).filter(x => x !== 'general').map((x, i) => ({
      innerHTML: '?{i}{,}<wbr>${x}'
    }));
    $.extend(div, { innerHTML: FilterGuidePage });
    return $('.warning', div).hidden = Conf['Filter'];
  },

  sauce(section) {
    $.extend(section, { innerHTML: SaucePage });
    $('.warning', section).hidden = Conf['Sauce'];
    const ta = $('textarea', section);
    $.get('sauces', Conf['sauces'], function(item) {
      ta.value = item['sauces'];
      return (ta.hidden = false);
    }); // XXX prevent Firefox from adding initialization to undo queue
    return $.on(ta, 'change', $.cb.value);
  },

  advanced(section) {
    let input, name;
    $.extend(section, { innerHTML: AdvancedPage });
    for (var warning of $$('.warning', section)) { warning.hidden = Conf[warning.dataset.feature]; }

    const inputs = $.dict();
    for (input of $$('[name]', section)) {
      inputs[input.name] = input;
    }

    $.on(inputs['archiveLists'], 'change', function() {
      $.set('lastarchivecheck', 0);
      Conf['lastarchivecheck'] = 0;
      return $.id('lastarchivecheck').textContent = 'never';
    });

    const items = $.dict();
    for (name in inputs) {
      input = inputs[name];
      if (!['Interval', 'Custom CSS'].includes(name)) {
        items[name] = Conf[name];
        var event = (
          (input.nodeName === 'SELECT') ||
          ['checkbox', 'radio'].includes(input.type) ||
          ((input.nodeName === 'TEXTAREA') && !(name in Settings))
        ) ? 'change' : 'input';
        $.on(input, event, $.cb[input.type === 'checkbox' ? 'checked' : 'value']);
        if (name in Settings) { $.on(input, event, Settings[name]); }
      }
    }

    $.get(items, function(items) {
      for (var key in items) {
        var val = items[key];
        input = inputs[key];
        input[input.type === 'checkbox' ? 'checked' : 'value'] = val;
        input.hidden = false; // XXX prevent Firefox from adding initialization to undo queue
        if (key in Settings) {
          Settings[key].call(input);
        }
      }
    });

    const listImageHost = $.id('list-fourchanImageHost');
    for (var textContent of ImageHost.suggestions) {
      $.add(listImageHost, $.el('option', {textContent}));
    }

    const interval  = inputs['Interval'];
    const customCSS = inputs['Custom CSS'];
    const applyCSS  = $('#apply-css', section);

    interval.value             =  Conf['Interval'];
    customCSS.checked          =  Conf['Custom CSS'];
    inputs['usercss'].disabled = !Conf['Custom CSS'];
    applyCSS.disabled          = !Conf['Custom CSS'];

    $.on(interval,  'change', ThreadUpdater.cb.interval);
    $.on(customCSS, 'change', Settings.togglecss);
    $.on(applyCSS,  'click',  () => CustomCSS.update());

    const itemsArchive = $.dict();
    for (name of ['archives', 'selectedArchives', 'lastarchivecheck']) { itemsArchive[name] = Conf[name]; }
    $.get(itemsArchive, function(itemsArchive) {
      $.extend(Conf, itemsArchive);
      Redirect.selectArchives();
      return Settings.addArchiveTable(section);
    });

    const boardSelect    = $('#archive-board-select', section);
    const table          = $('#archive-table', section);
    const updateArchives = $('#update-archives', section);

    $.on(boardSelect, 'change', function() {
      $('tbody > :not([hidden])', table).hidden = true;
      return $(`tbody > .${this.value}`, table).hidden = false;
    });

    return $.on(updateArchives, 'click', () => Redirect.update(() => Settings.addArchiveTable(section)));
  },

  addArchiveTable(section) {
    let boardID, o;
    $('#lastarchivecheck', section).textContent = Conf['lastarchivecheck'] === 0 ?
      'never'
    :
      new Date(Conf['lastarchivecheck']).toLocaleString();

    const boardSelect = $('#archive-board-select', section);
    const table       = $('#archive-table', section);
    const tbody       = $('tbody', section);

    $.rmAll(boardSelect);
    $.rmAll(tbody);

    const archBoards = $.dict();
    for (var {uid, name, boards, files, software} of Conf['archives']) {
      if (!['fuuka', 'foolfuuka'].includes(software)) { continue; }
      for (boardID of boards) {
        o = archBoards[boardID] || (archBoards[boardID] = {
          thread: [],
          post:   [],
          file:   []
        });
        var archive = [uid ?? name, name];
        o.thread.push(archive);
        if (software === 'foolfuuka') { o.post.push(archive); }
        if (files.includes(boardID)) { o.file.push(archive); }
      }
    }

    const rows = [];
    const boardOptions = [];
    for (boardID of Object.keys(archBoards).sort()) { // Alphabetical order
      var row = $.el('tr',
        {className: `board-${boardID}`});
      row.hidden = boardID !== g.BOARD.ID;

      boardOptions.push($.el('option', {
        textContent: `/${boardID}/`,
        value:       `board-${boardID}`,
        selected:    boardID === g.BOARD.ID
      }));

      o = archBoards[boardID];
      for (var item of ['thread', 'post', 'file']) { $.add(row, Settings.addArchiveCell(boardID, o, item)); }
      rows.push(row);
    }

    if (rows.length === 0) {
      boardSelect.hidden = (table.hidden = true);
      return;
    }

    boardSelect.hidden = (table.hidden = false);

    if (!(g.BOARD.ID in archBoards)) {
      rows[0].hidden = false;
    }

    $.add(boardSelect, boardOptions);
    $.add(tbody, rows);

    for (boardID in Conf['selectedArchives']) {
      var data = Conf['selectedArchives'][boardID];
      for (var type in data) {
        var select;
        var id = data[type];
        if (select = $(`select[data-boardid='${boardID}'][data-type='${type}']`, tbody)) {
          select.value = JSON.stringify(id);
          if (!select.value) { select.value = select.firstChild.value; }
        }
      }
    }
  },

  addArchiveCell(boardID, data, type) {
    const {length} = data[type];
    const td = $.el('td',
      {className: 'archive-cell'});

    if (!length) {
      td.textContent = '--';
      return td;
    }

    const options = [];
    let i = 0;
    while (i < length) {
      var archive = data[type][i++];
      options.push($.el('option', {
        value: JSON.stringify(archive[0]),
        textContent: archive[1]
      }));
    }

    $.extend(td, {innerHTML: '<select></select>'});
    const select = td.firstElementChild;
    if (!(select.disabled = length === 1)) {
      // XXX GM can't into datasets
      select.setAttribute('data-boardid', boardID);
      select.setAttribute('data-type', type);
      $.on(select, 'change', Settings.saveSelectedArchive);
    }
    $.add(select, options);

    return td;
  },

  saveSelectedArchive() {
    return $.get('selectedArchives', Conf['selectedArchives'], ({selectedArchives}) => {
      (selectedArchives[this.dataset.boardid] || (selectedArchives[this.dataset.boardid] = $.dict()))[this.dataset.type] = JSON.parse(this.value);
      $.set('selectedArchives', selectedArchives);
      Conf['selectedArchives'] = selectedArchives;
      return Redirect.selectArchives();
    });
  },

  boardnav() {
    return Header.generateBoardList(this.value);
  },

  time() {
    return this.nextElementSibling.textContent = Time.format(this.value, new Date());
  },

  timeLocale() {
    return Settings.time.call($('[name=time]', Settings.dialog));
  },

  backlink() {
    return this.nextElementSibling.textContent = this.value.replace(/%(?:id|%)/g, x => ({'%id': '123456789', '%%': '%'})[x]);
  },

  fileInfo() {
    const data = {
      isReply: true,
      file: {
        url: `//${ImageHost.host()}/g/1334437723720.jpg`,
        name: 'd9bb2efc98dd0df141a94399ff5880b7.jpg',
        size: '276 KB',
        sizeInBytes: 276 * 1024,
        dimensions: '1280x720',
        isImage: true,
        isVideo: false,
        isSpoiler: true,
        tag: 'Loop'
      }
    };
    return FileInfo.format(this.value, data, this.nextElementSibling);
  },

  favicon() {
    Favicon.switch();
    if ((g.VIEW === 'thread') && Conf['Unread Favicon']) { Unread.update(); }
    const img = this.nextElementSibling.children;
    const f = Favicon;
    const iterable = [f.SFW, f.unreadSFW, f.unreadSFWY, f.NSFW, f.unreadNSFW, f.unreadNSFWY, f.dead, f.unreadDead, f.unreadDeadY];
    for (let i = 0; i < iterable.length; i++) {
      var icon = iterable[i];
      if (!img[i]) { $.add(this.nextElementSibling, $.el('img')); }
      img[i].src = icon;
    }
  },

  togglecss() {
    if (($('textarea[name=usercss]', $.x('ancestor::fieldset[1]', this)).disabled = ($.id('apply-css').disabled = !this.checked))) {
      CustomCSS.rmStyle();
    } else {
      CustomCSS.addStyle();
    }
    return $.cb.checked.call(this);
  },

  keybinds(section) {
    let key;
    $.extend(section, { innerHTML: KeybindsPage });
    $('.warning', section).hidden = Conf['Keybinds'];

    const tbody  = $('tbody', section);
    const items  = $.dict();
    const inputs = $.dict();
    for (key in Config.hotkeys) {
      var arr = Config.hotkeys[key];
      var tr = $.el('tr',
        {innerHTML: '<td>${arr[1]}</td><td><input class="field"></td>'});
      var input = $('input', tr);
      input.name = key;
      input.spellcheck = false;
      items[key]  = Conf[key];
      inputs[key] = input;
      $.on(input, 'keydown', Settings.keybind);
      $.add(tbody, tr);
    }

    return $.get(items, function(items) {
      for (key in items) {
        var val = items[key];
        inputs[key].value = val;
      }
    });
  },

  keybind(e) {
    let key;
    if (e.keyCode === 9) { return; } // tab
    e.preventDefault();
    e.stopPropagation();
    if ((key = Keybinds.keyCode(e)) == null) { return; }
    this.value = key;
    return $.cb.value.call(this);
  }
};
