/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
SW.yotsuba = {
  isOPContainerThread: false,
  hasIPCount: true,
  archivedBoardsKnown: true,

  urls: {
    thread({boardID, threadID}) { return `${location.protocol}//${BoardConfig.domain(boardID)}/${boardID}/thread/${threadID}`; },
    post({postID})            { return `#p${postID}`; },
    index({boardID})           { return `${location.protocol}//${BoardConfig.domain(boardID)}/${boardID}/`; },
    catalog({boardID})           { if (boardID === 'f') { return undefined; } else { return `${location.protocol}//${BoardConfig.domain(boardID)}/${boardID}/catalog`; } },
    archive({boardID})           { if (BoardConfig.isArchived(boardID)) { return `${location.protocol}//${BoardConfig.domain(boardID)}/${boardID}/archive`; } else { return undefined; } },
    threadJSON({boardID, threadID}) { return `${location.protocol}//a.4cdn.org/${boardID}/thread/${threadID}.json`; },
    threadsListJSON({boardID})      { return `${location.protocol}//a.4cdn.org/${boardID}/threads.json`; },
    archiveListJSON({boardID})      { if (BoardConfig.isArchived(boardID)) { return `${location.protocol}//a.4cdn.org/${boardID}/archive.json`; } else { return ''; } },
    catalogJSON({boardID})      { return `${location.protocol}//a.4cdn.org/${boardID}/catalog.json`; },
    file({boardID}, filename) {
      const hostname = boardID === 'f' ? ImageHost.flashHost() : ImageHost.host();
      return `${location.protocol}//${hostname}/${boardID}/${filename}`;
    },
    thumb({boardID}, filename) {
      return `${location.protocol}//${ImageHost.thumbHost()}/${boardID}/${filename}`;
    }
  },

  isPrunedByAge({boardID}) { return boardID === 'f'; },
  areMD5sDeferred({boardID}) { return boardID === 'f'; },
  isOnePage({boardID}) { return boardID === 'f'; },
  noAudio({boardID}) { return BoardConfig.noAudio(boardID); },

  selectors: {
    board:         '.board',
    thread:        '.thread',
    threadDivider: '.board > hr',
    summary:       '.summary',
    postContainer: '.postContainer',
    replyOriginal: '.replyContainer:not([data-clone])',
    sideArrows:    'div.sideArrows',
    post:          '.post',
    infoRoot:      '.postInfo',
    info: {
      subject:   '.subject',
      name:      '.name',
      email:     '.useremail',
      tripcode:  '.postertrip',
      uniqueIDRoot: '.posteruid',
      uniqueID:  '.posteruid > .hand',
      capcode:   '.capcode.hand',
      pass:      '.n-pu',
      flag:      '.flag, .bfl',
      date:      '.dateTime',
      nameBlock: '.nameBlock',
      quote:     '.postNum > a:nth-of-type(2)',
      reply:     '.replylink'
    },
    icons: {
      isSticky:   '.stickyIcon',
      isClosed:   '.closedIcon',
      isArchived: '.archivedIcon'
    },
    file: {
      text:  '.file > :first-child',
      link:  '.fileText > a',
      thumb: 'a.fileThumb > [data-md5]'
    },
    thumbLink: 'a.fileThumb',
    highlightable: {
      op:      '.opContainer',
      reply:   ' > .reply',
      catalog: ''
    },
    comment:   '.postMessage',
    spoiler:   's',
    quotelink: ':not(pre) > .quotelink', // XXX https://github.com/4chan/4chan-JS/issues/77: 4chan currently creates quote links inside [code] tags; ignore them
    catalog: {
      board:  '#threads',
      thread: '.thread',
      thumb:  '.thumb'
    },
    boardList: '#boardNavDesktop > .boardList',
    boardListBottom: '#boardNavDesktopFoot > .boardList',
    styleSheet: 'link[title=switch]',
    psa:       '#globalMessage',
    psaTop:    '#globalToggle',
    searchBox: '#search-box',
    nav: {
      prev: '.prev > form > [type=submit]',
      next: '.next > form > [type=submit]'
    }
  },

  classes: {
    highlight: 'highlight'
  },

  xpath: {
    thread:         'div[contains(concat(" ",@class," ")," thread ")]',
    postContainer:  'div[contains(@class,"postContainer")]',
    replyContainer: 'div[contains(@class,"replyContainer")]'
  },

  regexp: {
    quotelink:
      new RegExp(`\
^https?://boards\\.4chan(?:nel)?\\.org/+\
([^/]+)\
/+thread/+\
(\\d+)\
(?:[/?][^#]*)?\
(?:#p\
(\\d+)\
)?\
$\
`),
    quotelinkHTML:
      /<a [^>]*\bhref="(?:(?:\/\/boards\.4chan(?:nel)?\.org)?\/([^\/]+)\/thread\/)?(\d+)?(?:#p(\d+))?"/g,
    pass:
      /^https?:\/\/www\.4chan(?:nel)?\.org\/+pass(?:$|[?#])/
  },

  bgColoredEl() {
    return $.el('div', {className: 'reply'});
  },

  isThisPageLegit() {
    // not 404 error page or similar.
    return ['boards.4chan.org', 'boards.4channel.org'].includes(location.hostname) &&
    d.doctype &&
    !$('link[href*="favicon-status.ico"]', d.head) &&
    !['4chan - Temporarily Offline', '4chan - Error', '504 Gateway Time-out', 'MathJax Equation Source'].includes(d.title);
  },

  is404() {
    // XXX Sometimes threads don't 404 but are left over as stubs containing one garbage reply post.
    return ['4chan - Temporarily Offline', '4chan - 404 Not Found'].includes(d.title) || ((g.VIEW === 'thread') && $('.board') && !$('.opContainer'));
  },

  isIncomplete() {
    return ['index', 'thread'].includes(g.VIEW) && !$('.board + *');
  },

  isBoardlessPage(url) {
    return ['www.4chan.org', 'www.4channel.org'].includes(url.hostname);
  },

  isAuxiliaryPage(url) {
    return !['boards.4chan.org', 'boards.4channel.org'].includes(url.hostname);
  },

  isFileURL(url) {
    return ImageHost.test(url.hostname);
  },

  initAuxiliary() {
    switch (location.hostname) {
      case 'www.4chan.org': case 'www.4channel.org':
        if (SW.yotsuba.regexp.pass.test(location.href)) {
          PassMessage.init();
        } else {
          $.onExists(doc, 'body', () => $.addStyle(CSS.www));
          Captcha.replace.init();
        }
        return;
      case 'sys.4chan.org': case 'sys.4channel.org':
        var pathname = location.pathname.split(/\/+/);
        if (pathname[2] === 'imgboard.php') {
          let match;
          if (/\bmode=report\b/.test(location.search)) {
            Report.init();
          } else if (match = location.search.match(/\bres=(\d+)/)) {
            $.ready(function() {
              if (Conf['404 Redirect'] && ($.id('errmsg')?.textContent === 'Error: Specified thread does not exist.')) {
                return Redirect.navigate('thread', {
                  boardID: g.BOARD.ID,
                  postID:  +match[1]
                });
              }});
          }
        } else if (pathname[2] === 'post') {
          PostSuccessful.init();
        }
        return;
    }
  },

  scriptData() {
    for (var script of $$('script:not([src])', d.head)) {
      if (/\bcooldowns *=/.test(script.textContent)) { return script.textContent; }
    }
    return '';
  },

  parseThreadMetadata(thread) {
    let m;
    const scriptData = this.scriptData();
    thread.postLimit = /\bbumplimit *= *1\b/.test(scriptData);
    thread.fileLimit = /\bimagelimit *= *1\b/.test(scriptData);
    thread.ipCount   = (m = scriptData.match(/\bunique_ips *= *(\d+)\b/)) ? +m[1] : undefined;

    if ((g.BOARD.ID === 'f') && thread.OP.file) {
      const {file} = thread.OP;
      return $.ajax(this.urls.threadJSON({boardID: 'f', threadID: thread.ID}), {
        timeout: $.MINUTE,
        onloadend() {
          if (this.response) {
            return file.text.dataset.md5 = (file.MD5 = this.response.posts[0].md5);
          }
        }
      }
      );
    }
  },

  parseNodes(post, nodes) {
    // Add CSS classes to sticky/closed icons on /f/ to match other boards.
    if (post.boardID === 'f') {
      return (() => {
        const result = [];
        for (var type of ['Sticky', 'Closed']) {
          var icon;
          if (icon = $(`img[alt=${type}]`, nodes.info)) {
            result.push($.addClass(icon, `${type.toLowerCase()}Icon`, 'retina'));
          }
        }
        return result;
      })();
    }
  },

  parseDate(node) {
    return new Date(node.dataset.utc * 1000);
  },

  parseFile(post, file) {
    let info;
    const {text, link, thumb} = file;
    if (!(info = link.nextSibling?.textContent.match(/\(([\d.]+ [KMG]?B).*\)/))) { return false; }
    $.extend(file, {
      name:       text.title || link.title || link.textContent,
      size:       info[1],
      dimensions: info[0].match(/\d+x\d+/)?.[0],
      tag:        info[0].match(/,[^,]*, ([a-z]+)\)/i)?.[1],
      MD5:        text.dataset.md5
    }
    );
    if (thumb) {
      $.extend(file, {
        thumbURL:  thumb.src,
        MD5:       thumb.dataset.md5,
        isSpoiler: $.hasClass(thumb.parentNode, 'imgspoiler')
      }
      );
      if (file.isSpoiler) {
        let m;
        file.thumbURL = (m = link.href.match(/\d+(?=\.\w+$)/)) ? `${location.protocol}//${ImageHost.thumbHost()}/${post.board}/${m[0]}s.jpg` : undefined;
      }
    }
    return true;
  },

  cleanComment(bq) {
    let abbr;
    if (abbr = $('.abbr', bq)) { // 'Comment too long' or 'EXIF data available'
      for (var node of $$('.abbr + br, .exif', bq)) {
        $.rm(node);
      }
      for (let i = 0; i < 2; i++) {
        var br;
        if ((br = abbr.previousSibling) && (br.nodeName === 'BR')) { $.rm(br); }
      }
      return $.rm(abbr);
    }
  },

  cleanCommentDisplay(bq) {
    let b;
    if ((b = $('b', bq)) && /^Rolled /.test(b.textContent)) { $.rm(b); }
    return $.rm($('.fortune', bq));
  },

  insertTags(bq) {
    let node;
    for (node of $$('s, .removed-spoiler', bq)) {
      $.replace(node, [$.tn('[spoiler]'), ...Array.from(node.childNodes), $.tn('[/spoiler]')]);
    }
    for (node of $$('.prettyprint', bq)) {
      $.replace(node, [$.tn('[code]'), ...Array.from(node.childNodes), $.tn('[/code]')]);
    }
  },

  hasCORS(url) {
    return url.split('/').slice(0, 3).join('/') === (location.protocol + '//a.4cdn.org');
  },

  sfwBoards(sfw) {
    return BoardConfig.sfwBoards(sfw);
  },

  uidColor(uid) {
    let msg = 0;
    let i = 0;
    while (i < 8) {
      msg = ((msg << 5) - msg) + uid.charCodeAt(i++);
    }
    return (msg >> 8) & 0xFFFFFF;
  },

  isLinkified(link) {
    return ImageHost.test(link.hostname);
  },

  testNativeExtension() {
    return $.global(function() {
      if (window.Parser.postMenuIcon) { return this.enabled = 'true'; }
    });
  },

  transformBoardList() {
    let node;
    const nodes = [];
    const spacer = () => $.el('span', {className: 'spacer'});
    const items = $.X('.//a|.//text()[not(ancestor::a)]', $(SW.yotsuba.selectors.boardList));
    let i = 0;
    while ((node = items.snapshotItem(i++))) {
      switch (node.nodeName) {
        case '#text':
          for (var chr of node.nodeValue) {
            var span = $.el('span', {textContent: chr});
            if (chr === ' ') { span.className = 'space'; }
            if (chr === ']') { nodes.push(spacer()); }
            nodes.push(span);
            if (chr === '[') { nodes.push(spacer()); }
          }
          break;
        case 'A':
          var a = node.cloneNode(true);
          nodes.push(a);
          break;
      }
    }
    return nodes;
  }
};
