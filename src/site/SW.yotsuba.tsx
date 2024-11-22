import Redirect from "../Archive/Redirect";
import PassMessage from "../Miscellaneous/PassMessage";
import Report from "../Miscellaneous/Report";
import $ from "../platform/$";
import $$ from "../platform/$$";
import Captcha from "../Posting/Captcha";
import PostSuccessful from "../Posting/PostSuccessful";
import ImageHost from "../Images/ImageHost";
import { g, Conf, E, d, doc } from "../globals/globals";
import BoardConfig from "../General/BoardConfig";
import CSS from "../css/CSS";

import generatePostInfoHtml from './SW.yotsuba.Build/PostInfoHtml';
import generateFileHtml from "./SW.yotsuba.Build/FileHtml";
import generateCatalogThreadHtml from "./SW.yotsuba.Build/CatalogThreadHtml";
import h, { hFragment, isEscaped } from "../globals/jsx";
import { dict, MINUTE } from "../platform/helpers";

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SWYotsuba = {
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
        if (SWYotsuba.regexp.pass.test(location.href)) {
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
        timeout: MINUTE,
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
      if (window.Parser?.postMenuIcon) { return this.enabled = 'true'; }
    });
  },

  transformBoardList() {
    let node;
    const nodes = [];
    const spacer = () => $.el('span', {className: 'spacer'});
    const items = $.X('.//a|.//text()[not(ancestor::a)]', $(SWYotsuba.selectors.boardList));
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
  },

  Build: {
    staticPath: '//s.4cdn.org/image/',
    gifIcon: window.devicePixelRatio >= 2 ? '@2x.gif' : '.gif',
    spoilerRange: Object.create(null),

    shortFilename(filename) {
      const ext = filename.match(/\.?[^\.]*$/)[0];
      if ((filename.length - ext.length) > 30) {
        return `${filename.match(/(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|[^]){0,25}/)[0]}(...)${ext}`;
      } else {
        return filename;
      }
    },

    spoilerThumb(boardID) {
      let spoilerRange;
      if ((spoilerRange = this.spoilerRange[boardID])) {
        // Randomize the spoiler image.
        return `${this.staticPath}spoiler-${boardID}${Math.floor(1 + (spoilerRange * Math.random()))}.png`;
      } else {
        return `${this.staticPath}spoiler.png`;
      }
    },

    sameThread(boardID, threadID) {
      return (g.VIEW === 'thread') && (g.BOARD.ID === boardID) && (g.THREADID === +threadID);
    },

    threadURL(boardID, threadID) {
      if (boardID !== g.BOARD.ID) {
        return `//${BoardConfig.domain(boardID)}/${boardID}/thread/${threadID}`;
      } else if ((g.VIEW !== 'thread') || (+threadID !== g.THREADID)) {
        return `/${boardID}/thread/${threadID}`;
      } else {
        return '';
      }
    },

    postURL(boardID, threadID, postID) {
      return `${this.threadURL(boardID, threadID)}#p${postID}`;
    },

    parseJSON(data, { siteID, boardID }) {
      const o = {
        // id
        ID: data.no,
        postID: data.no,
        threadID: data.resto || data.no,
        boardID,
        siteID,
        isReply: !!data.resto,
        // thread status
        isSticky: !!data.sticky,
        isClosed: !!data.closed,
        isArchived: !!data.archived,
        // file status
        fileDeleted: !!data.filedeleted,
        filesDeleted: data.filedeleted ? [0] : []
      };
      o.info = {
        subject: $.unescape(data.sub),
        email: $.unescape(data.email),
        name: $.unescape(data.name) || '',
        tripcode: data.trip,
        pass: (data.since4pass != null) ? `${data.since4pass}` : undefined,
        uniqueID: data.id,
        flagCode: data.country,
        flagCodeTroll: data.board_flag,
        flag: $.unescape((data.country_name || data.flag_name)),
        dateUTC: data.time,
        dateText: data.now,
        // Yes, we use the raw string here
        commentHTML: { innerHTML: data.com || '', [isEscaped]: true }
      };
      if (data.capcode) {
        o.info.capcode = data.capcode.replace(/_highlight$/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        o.capcodeHighlight = /_highlight$/.test(data.capcode);
        delete o.info.uniqueID;
      }
      o.files = [];
      if (data.ext) {
        o.file = this.parseJSONFile(data, { siteID, boardID });
        o.files.push(o.file);
      }
      // Temporary JSON properties for events such as April 1 / Halloween
      o.extra = dict();
      for (var key in data) {
        if (key[0] === 'x') {
          o.extra[key] = data[key];
        }
      }
      return o;
    },

    parseJSONFile(data, { siteID, boardID }) {
      const site = g.sites[siteID];
      const filename = (site.software === 'yotsuba') && (boardID === 'f') ?
        `${encodeURIComponent(data.filename)}${data.ext}`
        :
        `${data.tim}${data.ext}`;
      const o = {
        name: ($.unescape(data.filename)) + data.ext,
        url: site.urls.file({ siteID, boardID }, filename),
        height: data.h,
        width: data.w,
        MD5: data.md5,
        size: $.bytesToString(data.fsize),
        thumbURL: site.urls.thumb({ siteID, boardID }, `${data.tim}s.jpg`),
        theight: data.tn_h,
        twidth: data.tn_w,
        isSpoiler: !!data.spoiler,
        tag: data.tag,
        hasDownscale: !!data.m_img
      };
      if ((data.h != null) && !/\.pdf$/.test(o.url)) { o.dimensions = `${o.width}x${o.height}`; }
      return o;
    },

    parseComment(html) {
      html = html
        .replace(/<br\b[^<]*>/gi, '\n')
        .replace(/\n\n<span\b[^<]* class="abbr"[^]*$/i, '') // EXIF data (/p/)
        .replace(/<[^>]*>/g, '');
      return $.unescape(html);
    },

    parseCommentDisplay(html) {
      // Hide spoilers.
      if (!Conf['Remove Spoilers'] && !Conf['Reveal Spoilers']) {
        let html2;
        while ((html2 = html.replace(/<s>(?:(?!<\/?s>).)*<\/s>/g, '[spoiler]')) !== html) {
          html = html2;
        }
      }
      html = html
        .replace(/^<b\b[^<]*>Rolled [^<]*<\/b>/i, '')      // Rolls (/tg/, /qst/)
        .replace(/<span\b[^<]* class="fortune"[^]*$/i, ''); // Fortunes (/s4s/)
      // Remove preceding and following new lines, trailing spaces.
      return this.parseComment(html).trim().replace(/\s+$/gm, '');
    },

    postFromObject(data, boardID) {
      const o = this.parseJSON(data, { boardID, siteID: g.SITE.ID });
      return this.post(o);
    },

    post(o) {
      const { ID, threadID, boardID, file } = o;
      const { subject, email, name, tripcode, capcode, pass, uniqueID, flagCode, flagCodeTroll, flag, dateUTC, dateText, commentHTML } = o.info;
      const { staticPath, gifIcon } = this;

      /* Post Info */

      let capcodeDescription, capcodePlural, capcodeLC;
      if (capcode) {
        capcodeLC = capcode.toLowerCase();
        if (capcode === 'Founder') {
          capcodePlural = 'the Founder';
          capcodeDescription = "4chan's Founder";
        } else if (capcode === 'Verified') {
          capcodePlural = 'Verified Users';
          capcodeDescription = '';
        } else {
          const capcodeLong = $.getOwn({ 'Admin': 'Administrator', 'Mod': 'Moderator' }, capcode) || capcode;
          capcodePlural = `${capcodeLong}s`;
          capcodeDescription = `a 4chan ${capcodeLong}`;
        }
      }

      const url = this.threadURL(boardID, threadID);
      const postLink = `${url}#p${ID}`;
      const quoteLink = this.sameThread(boardID, threadID) ?
        `javascript:quote('${+ID}');`
        :
        `${url}#q${ID}`;

      const postInfo = generatePostInfoHtml(
        ID, o, subject, capcode, email, name, tripcode, pass, capcodeLC, capcodePlural, staticPath, gifIcon,
        capcodeDescription, uniqueID, flag, flagCode, flagCodeTroll, dateUTC, dateText, postLink, quoteLink, boardID,
        threadID,
      );

      /* File Info */
      let protocol, fileURL, shortFilename, fileThumb;
      if (file) {
        protocol = /^https?:(?=\/\/i\.4cdn\.org\/)/;
        fileURL = file.url.replace(protocol, '');
        shortFilename = this.shortFilename(file.name);
        fileThumb = file.isSpoiler ? this.spoilerThumb(boardID) : file.thumbURL.replace(protocol, '');
      }

      const fileBlock = generateFileHtml(file, ID, boardID, fileURL, shortFilename, fileThumb, o, staticPath, gifIcon);

      /* Whole Post */

      const postClass = o.isReply ? 'reply' : 'op';

      const wholePost = <>
        {(o.isReply ? <div class="sideArrows" id={`sa${ID}`}>&gt;&gt;</div> : '')}
        <div id={`p${ID}`} class={`post ${postClass}${o.capcodeHighlight ? ' highlightPost' : ''}`}>
          {(o.isReply ? <>{postInfo}{fileBlock}</> : <>{fileBlock}{postInfo}</>)}
          <blockquote class="postMessage" id={`m${ID}`}>{commentHTML}</blockquote>
        </div>
      </>;

      const container = $.el('div', {
        className: `postContainer ${postClass}Container`,
        id: `pc${ID}`
      });
      $.extend(container, wholePost);

      // Fix quotelinks
      for (var quote of $$('.quotelink', container)) {
        var href = quote.getAttribute('href');
        if (href[0] === '#') {
          if (!this.sameThread(boardID, threadID)) {
            quote.href = this.threadURL(boardID, threadID) + href;
          }
        } else {
          var match;
          if ((match = quote.href.match(SWYotsuba.regexp.quotelink)) && (this.sameThread(match[1], match[2]))) {
            quote.href = href.match(/(#[^#]*)?$/)[0] || '#';
          }
        }
      }

      return container;
    },

    summaryText(status, posts, files) {
      let text = '';
      if (status) { text += `${status} `; }
      text += `${posts} post${posts > 1 ? 's' : ''}`;
      if (+files) { text += ` and ${files} image repl${files > 1 ? 'ies' : 'y'}`; }
      return text += ` ${status === '-' ? 'shown' : 'omitted'}.`;
    },

    summary(boardID, threadID, posts, files) {
      return $.el('a', {
        className: 'summary',
        textContent: this.summaryText('', posts, files),
        href: `/${boardID}/thread/${threadID}`
      }
      );
    },

    thread(thread, data, withReplies) {
      let root;
      if (root = thread.nodes.root) {
        $.rmAll(root);
      } else {
        thread.nodes.root = (root = $.el('div', {
          className: 'thread',
          id: `t${data.no}`
        }
        ));
      }
      if (this.hat) { $.add(root, this.hat.cloneNode(false)); }
      $.add(root, thread.OP.nodes.root);
      if (data.omitted_posts || (!withReplies && data.replies)) {
        const [posts, files] = Array.from(withReplies ?
          // XXX data.omitted_images is not accurate.
          [data.omitted_posts, data.images - data.last_replies.filter(data => !!data.ext).length]
          :
          [data.replies, data.images]);
        const summary = this.summary(thread.board.ID, data.no, posts, files);
        $.add(root, summary);
      }
      return root;
    },

    catalogThread(thread, data, pageCount) {
      let cssText, imgClass, src;
      const { staticPath, gifIcon } = this;
      const { tn_w, tn_h } = data;

      if (data.spoiler && !Conf['Reveal Spoiler Thumbnails']) {
        let spoilerRange;
        src = `${staticPath}spoiler`;
        if (spoilerRange = this.spoilerRange[thread.board]) {
          // Randomize the spoiler image.
          src += (`-${thread.board}`) + Math.floor(1 + (spoilerRange * Math.random()));
        }
        src += '.png';
        imgClass = 'spoiler-file';
        cssText = "--tn-w: 100; --tn-h: 100;";
      } else if (data.filedeleted) {
        src = `${staticPath}filedeleted-res${gifIcon}`;
        imgClass = 'deleted-file';
      } else if (thread.OP.file) {
        src = thread.OP.file.thumbURL;
        const ratio = 250 / Math.max(tn_w, tn_h);
        cssText = `--tn-w: ${tn_w * ratio}; --tn-h: ${tn_h * ratio};`;
      } else {
        src = `${staticPath}nofile.png`;
        imgClass = 'no-file';
      }

      const postCount = data.replies + 1;
      const fileCount = data.images + !!data.ext;

      const container = $.el(
        'div',
        generateCatalogThreadHtml(thread, src, imgClass, data, postCount, fileCount, pageCount, staticPath, gifIcon)
      );
      $.before(thread.OP.nodes.info, [...Array.from(container.childNodes)]);

      for (var br of $$('br', thread.OP.nodes.comment)) {
        if (br.previousSibling && (br.previousSibling.nodeName === 'BR')) {
          $.addClass(br, 'extra-linebreak');
        }
      }

      const root = $.el('div', {
        className: 'thread catalog-thread',
        id: `t${thread}`
      }
      );
      if (thread.OP.highlights) { $.addClass(root, ...Array.from(thread.OP.highlights)); }
      if (!thread.OP.file) { $.addClass(root, 'noFile'); }
      root.style.cssText = cssText || '';

      return root;
    },

    catalogReply(thread, data) {
      let excerpt = '';
      if (data.com) {
        excerpt = this.parseCommentDisplay(data.com).replace(/>>\d+/g, '').trim().replace(/\n+/g, ' // ');
      }
      if (data.ext) {
        if (!excerpt) { excerpt = `${$.unescape(data.filename)}${data.ext}`; }
      }
      if (data.com) {
        if (!excerpt) { excerpt = $.unescape(data.com.replace(/<br\b[^<]*>/gi, ' // ')); }
      }
      if (!excerpt) { excerpt = '\xA0'; }
      if (excerpt.length > 73) { excerpt = `${excerpt.slice(0, 70)}...`; }

      const link = this.postURL(thread.board.ID, thread.ID, data.no);
      return $.el('div', { className: 'catalog-reply' },
        <>
          <span><time data-utc={data.time * 1000} data-abbrev="1">...</time>: </span>
          <a class="catalog-reply-excerpt" href={link}>{excerpt}</a>
          <a class="catalog-reply-preview" href={link}>...</a>
        </>
      );
    }
  }
};
export default SWYotsuba;
