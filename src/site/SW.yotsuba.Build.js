/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import PostInfoPage from './SW.yotsuba.Build/PostInfo.html';
import FilePage from './SW.yotsuba.Build/File.html';
import PostPage from './SW.yotsuba.Build/Post.html';
import CatalogThreadPage from './SW.yotsuba.Build/CatalogThread.html';
import CatalogReplyPage from './SW.yotsuba.Build/CatalogReply.html';

var Build = {
  staticPath: '//s.4cdn.org/image/',
  gifIcon: window.devicePixelRatio >= 2 ? '@2x.gif' : '.gif',
  spoilerRange: $.dict(),

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
    if ((spoilerRange = Build.spoilerRange[boardID])) {
      // Randomize the spoiler image.
      return `${Build.staticPath}spoiler-${boardID}${Math.floor(1 + (spoilerRange * Math.random()))}.png`;
    } else {
      return `${Build.staticPath}spoiler.png`;
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
    return `${Build.threadURL(boardID, threadID)}#p${postID}`;
  },

  parseJSON(data, {siteID, boardID}) {
    const o = {
      // id
      ID:       data.no,
      postID:   data.no,
      threadID: data.resto || data.no,
      boardID,
      siteID,
      isReply:  !!data.resto,
      // thread status
      isSticky: !!data.sticky,
      isClosed: !!data.closed,
      isArchived: !!data.archived,
      // file status
      fileDeleted: !!data.filedeleted,
      filesDeleted: data.filedeleted ? [0] : []
    };
    o.info = {
      subject:  $.unescape(data.sub),
      email:    $.unescape(data.email),
      name:     $.unescape(data.name) || '',
      tripcode: data.trip,
      pass:     (data.since4pass != null) ? `${data.since4pass}` : undefined,
      uniqueID: data.id,
      flagCode: data.country,
      flagCodeTroll: data.board_flag,
      flag:     $.unescape((data.country_name || data.flag_name)),
      dateUTC:  data.time,
      dateText: data.now,
      commentHTML: {innerHTML: data.com || ''}
    };
    if (data.capcode) {
      o.info.capcode = data.capcode.replace(/_highlight$/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      o.capcodeHighlight = /_highlight$/.test(data.capcode);
      delete o.info.uniqueID;
    }
    o.files = [];
    if (data.ext) {
      o.file = SW.yotsuba.Build.parseJSONFile(data, {siteID, boardID});
      o.files.push(o.file);
    }
    // Temporary JSON properties for events such as April 1 / Halloween
    o.extra = $.dict();
    for (var key in data) {
      if (key[0] === 'x') {
        o.extra[key] = data[key];
      }
    }
    return o;
  },

  parseJSONFile(data, {siteID, boardID}) {
    const site = g.sites[siteID];
    const filename = (site.software === 'yotsuba') && (boardID === 'f') ?
      `${encodeURIComponent(data.filename)}${data.ext}`
    :
      `${data.tim}${data.ext}`;
    const o = {
      name:      ($.unescape(data.filename)) + data.ext,
      url:       site.urls.file({siteID, boardID}, filename),
      height:    data.h,
      width:     data.w,
      MD5:       data.md5,
      size:      $.bytesToString(data.fsize),
      thumbURL:  site.urls.thumb({siteID, boardID}, `${data.tim}s.jpg`),
      theight:   data.tn_h,
      twidth:    data.tn_w,
      isSpoiler: !!data.spoiler,
      tag:       data.tag,
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
    return Build.parseComment(html).trim().replace(/\s+$/gm, '');
  },

  postFromObject(data, boardID) {
    const o = Build.parseJSON(data, {boardID, siteID: g.SITE.ID});
    return Build.post(o);
  },

  post(o) {
    const {ID, threadID, boardID, file} = o;
    const {subject, email, name, tripcode, capcode, pass, uniqueID, flagCode, flagCodeTroll, flag, dateUTC, dateText, commentHTML} = o.info;
    const {staticPath, gifIcon} = Build;

    /* Post Info */

    if (capcode) {
      let capcodeDescription, capcodePlural;
      const capcodeLC = capcode.toLowerCase();
      if (capcode === 'Founder') {
        capcodePlural      = 'the Founder';
        capcodeDescription = "4chan's Founder";
      } else if (capcode === 'Verified') {
        capcodePlural      = 'Verified Users';
        capcodeDescription = '';
      } else {
        const capcodeLong   = $.getOwn({'Admin': 'Administrator', 'Mod': 'Moderator'}, capcode) || capcode;
        capcodePlural = `${capcodeLong}s`;
        capcodeDescription = `a 4chan ${capcodeLong}`;
      }
    }

    const url = Build.threadURL(boardID, threadID);
    const postLink = `${url}#p${ID}`;
    const quoteLink = Build.sameThread(boardID, threadID) ?
      `javascript:quote('${+ID}');`
    :
      `${url}#q${ID}`;

    const postInfo = { innerHTML: PostInfoPage };

    /* File Info */

    if (file) {
      const protocol = /^https?:(?=\/\/i\.4cdn\.org\/)/;
      const fileURL = file.url.replace(protocol, '');
      const shortFilename = Build.shortFilename(file.name);
      const fileThumb = file.isSpoiler ? Build.spoilerThumb(boardID) : file.thumbURL.replace(protocol, '');
    }

    const fileBlock = { innerHTML: FilePage };

    /* Whole Post */

    const postClass = o.isReply ? 'reply' : 'op';

    const wholePost = { innerHTML: PostPage };

    const container = $.el('div', {
      className: `postContainer ${postClass}Container`,
      id:        `pc${ID}`
    }
    );
    $.extend(container, wholePost);

    // Fix quotelinks
    for (var quote of $$('.quotelink', container)) {
      var href = quote.getAttribute('href');
      if (href[0] === '#') {
        if (!Build.sameThread(boardID, threadID)) {
          quote.href = Build.threadURL(boardID, threadID) + href;
        }
      } else {
        var match;
        if ((match = quote.href.match(SW.yotsuba.regexp.quotelink)) && (Build.sameThread(match[1], match[2]))) {
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
      textContent: Build.summaryText('', posts, files),
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
    if (Build.hat) { $.add(root, Build.hat.cloneNode(false)); }
    $.add(root, thread.OP.nodes.root);
    if (data.omitted_posts || (!withReplies && data.replies)) {
      const [posts, files] = Array.from(withReplies ?
        // XXX data.omitted_images is not accurate.
        [data.omitted_posts, data.images - data.last_replies.filter(data => !!data.ext).length]
      :
        [data.replies, data.images]);
      const summary = Build.summary(thread.board.ID, data.no, posts, files);
      $.add(root, summary);
    }
    return root;
  },

  catalogThread(thread, data, pageCount) {
    let cssText, imgClass, src;
    const {staticPath, gifIcon} = Build;
    const {tn_w, tn_h} = data;

    if (data.spoiler && !Conf['Reveal Spoiler Thumbnails']) {
      let spoilerRange;
      src = `${staticPath}spoiler`;
      if (spoilerRange = Build.spoilerRange[thread.board]) {
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
    const fileCount = data.images  + !!data.ext;

    const container = $.el('div', { innerHTML: CatalogThreadPage });
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
      excerpt = Build.parseCommentDisplay(data.com).replace(/>>\d+/g, '').trim().replace(/\n+/g, ' // ');
    }
    if (data.ext) {
      if (!excerpt) { excerpt = `${$.unescape(data.filename)}${data.ext}`; }
    }
    if (data.com) {
      if (!excerpt) { excerpt = $.unescape(data.com.replace(/<br\b[^<]*>/gi, ' // ')); }
    }
    if (!excerpt) { excerpt = '\xA0'; }
    if (excerpt.length > 73) { excerpt = `${excerpt.slice(0, 70)}...`; }

    const link = Build.postURL(thread.board.ID, thread.ID, data.no);
    return $.el('div', {className: 'catalog-reply'},
      { innerHTML: CatalogReplyPage });
  }
};

SW.yotsuba.Build = Build;
