import Redirect from "../Archive/Redirect";
import Board from "../classes/Board";
import Callbacks from "../classes/Callbacks";
import CatalogThreadNative from "../classes/CatalogThreadNative";
import DataBoard from "../classes/DataBoard";
import Notice from "../classes/Notice";
import Post from "../classes/Post";
import SimpleDict from "../classes/SimpleDict";
import Thread from "../classes/Thread";
import Config from "../config/Config";
import Anonymize from "../Filtering/Anonymize";
import Filter from "../Filtering/Filter";
import PostHiding from "../Filtering/PostHiding";
import Recursive from "../Filtering/Recursive";
import ThreadHiding from "../Filtering/ThreadHiding";
import Index from "../General/Index";
import Settings from "../General/Settings";
import FappeTyme from "../Images/FappeTyme";
import Gallery from "../Images/Gallery";
import ImageCommon from "../Images/ImageCommon";
import ImageExpand from "../Images/ImageExpand";
import ImageHost from "../Images/ImageHost";
import ImageHover from "../Images/ImageHover";
import ImageLoader from "../Images/ImageLoader";
import Metadata from "../Images/Metadata";
import RevealSpoilers from "../Images/RevealSpoilers";
import Sauce from "../Images/Sauce";
import Volume from "../Images/Volume";
import Linkify from "../Linkification/Linkify";
import ArchiveLink from "../Menu/ArchiveLink";
import CopyTextLink from "../Menu/CopyTextLink";
import DeleteLink from "../Menu/DeleteLink";
import DownloadLink from "../Menu/DownloadLink";
import ReportLink from "../Menu/ReportLink";
import AntiAutoplay from "../Miscellaneous/AntiAutoplay";
import Banner from "../Miscellaneous/Banner";
import CatalogLinks from "../Miscellaneous/CatalogLinks";
import CustomCSS from "../Miscellaneous/CustomCSS";
import ExpandComment from "../Miscellaneous/ExpandComment";
import ExpandThread from "../Miscellaneous/ExpandThread";
import FileInfo from "../Miscellaneous/FileInfo";
import Flash from "../Miscellaneous/Flash";
import Fourchan from "../Miscellaneous/Fourchan";
import IDColor from "../Miscellaneous/IDColor";
import IDHighlight from "../Miscellaneous/IDHighlight";
import IDPostCount from "../Miscellaneous/IDPostCount";
import Keybinds from "../Miscellaneous/Keybinds";
import ModContact from "../Miscellaneous/ModContact";
import Nav from "../Miscellaneous/Nav";
import NormalizeURL from "../Miscellaneous/NormalizeURL";
import PostJumper from "../Miscellaneous/PostJumper";
import PSA from "../Miscellaneous/PSA";
import PSAHiding from "../Miscellaneous/PSAHiding";
import RelativeDates from "../Miscellaneous/RelativeDates";
import RemoveSpoilers from "../Miscellaneous/RemoveSpoilers";
import ThreadLinks from "../Miscellaneous/ThreadLinks";
import Time from "../Miscellaneous/Time";
import Tinyboard from "../Miscellaneous/Tinyboard";
import Favicon from "../Monitoring/Favicon";
import MarkNewIPs from "../Monitoring/MarkNewIPs";
import ReplyPruning from "../Monitoring/ReplyPruning";
import ThreadStats from "../Monitoring/ThreadStats";
import ThreadUpdater from "../Monitoring/ThreadUpdater";
import ThreadWatcher from "../Monitoring/ThreadWatcher";
import Unread from "../Monitoring/Unread";
import UnreadIndex from "../Monitoring/UnreadIndex";
import $ from "../platform/$";
import $$ from "../platform/$$";
import PassLink from "../Posting/PassLink";
import PostRedirect from "../Posting/PostRedirect";
import QR from "../Posting/QR";
import QuoteBacklink from "../Quotelinks/QuoteBacklink";
import QuoteCT from "../Quotelinks/QuoteCT";
import QuoteInline from "../Quotelinks/QuoteInline";
import QuoteOP from "../Quotelinks/QuoteOP";
import QuotePreview from "../Quotelinks/QuotePreview";
import QuoteStrikeThrough from "../Quotelinks/QuoteStrikeThrough";
import QuoteThreading from "../Quotelinks/QuoteThreading";
import QuoteYou from "../Quotelinks/QuoteYou";
import Quotify from "../Quotelinks/Quotify";
import Site from "../site/Site";
import SW from "../site/SW";
import CSS from "../css/CSS";
import meta from '../../package.json';
import Header from "../General/Header";
import { c, Conf, d, doc, docSet, E, g } from "../globals/globals";
import Menu from "../Menu/Menu";
import BoardConfig from "../General/BoardConfig";
import CaptchaReplace from "../Posting/Captcha.replace";
import Get from "../General/Get";
import { dict, platform } from "../platform/helpers";
import Polyfill from "../General/Polyfill";
// #region tests_enabled
import Test from "../General/Test";
// #endregion

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var Main = {
  init() {
    // XXX dwb userscripts extension reloads scripts run at document-start when replaceState/pushState is called.
    // XXX Firefox reinjects WebExtension content scripts when extension is updated / reloaded.
    let key;
    try {
      let w = window;
      if (platform === 'crx') { w = (w.wrappedJSObject || w); }
      if (`${meta.name} antidup` in w) { return; }
      w[`${meta.name} antidup`] = true;
    } catch (error) {}

    // Don't run inside ad iframes.
    try {
      if (window.frameElement && ['', 'about:blank'].includes(window.frameElement.src)) { return; }
    } catch (error1) {}

    // Detect multiple copies of 4chan X
    if (doc && $.hasClass(doc, 'fourchan-x')) { return; }
    $.asap(docSet, function() {
      $.addClass(doc, 'fourchan-x', 'seaweedchan');
      if ($.engine) { return $.addClass(doc, `ua-${$.engine}`); }
    });
    $.on(d, '4chanXInitFinished', function() {
      if (Main.expectInitFinished) {
        return delete Main.expectInitFinished;
      } else {
        new Notice('error', 'Error: Multiple copies of 4chan X are enabled.');
        return $.addClass(doc, 'tainted');
      }
    });

    // Detect "mounted" event from Kissu
    var mountedCB = function() {
      d.removeEventListener('mounted', mountedCB, true);
      Main.isMounted = true;
      return Main.mountedCBs.map((cb) =>
        (() => { try {
          return cb();
        } catch (error2) {} })());
    };
    d.addEventListener('mounted', mountedCB, true);

    // Flatten default values from Config into Conf
    var flatten = function(parent, obj) {
      if (obj instanceof Array) {
        Conf[parent] = dict.clone(obj[0]);
      } else if (typeof obj === 'object') {
        for (var key in obj) {
          var val = obj[key];
          flatten(key, val);
        }
      } else { // string or number
        Conf[parent] = obj;
      }
    };

    // XXX Remove document-breaking ad
    if (['boards.4chan.org', 'boards.4channel.org'].includes(location.hostname)) {
      $.global(function() {
        const fromCharCode0 = String.fromCharCode;
        return String.fromCharCode = function() {
          if (document.body) {
            String.fromCharCode = fromCharCode0;
          } else if (document.currentScript && !document.currentScript.src) {
            throw Error();
          }
          return fromCharCode0.apply(this, arguments);
        };
      });
      $.asap(docSet, () => $.onExists(doc, 'iframe[srcdoc]', $.rm));
    }

    flatten(null, Config);

    for (var db of DataBoard.keys) {
      Conf[db] = dict();
    }
    Conf['customTitles'] = dict.clone({'4chan.org': {boards: {'qa': {'boardTitle': {orig: '/qa/ - Question & Answer', title: '/qa/ - 2D/Random'}}}}});
    Conf['boardConfig'] = {boards: dict()};
    Conf['archives'] = Redirect.archives;
    Conf['selectedArchives'] = dict();
    Conf['cooldowns'] = dict();
    Conf['Index Sort'] = dict();
    for (let i = 0; i < 2; i++) { Conf[`Last Long Reply Thresholds ${i}`] = dict(); }
    Conf['siteProperties'] = dict();

    // XXX old key names
    Conf['Except Archives from Encryption'] = false;
    Conf['JSON Navigation'] = true;
    Conf['Oekaki Links'] = true;
    Conf['Show Name and Subject'] = false;
    Conf['QR Shortcut'] = true;
    Conf['Bottom QR Link'] = true;
    Conf['Toggleable Thread Watcher'] = true;
    Conf['siteSoftware'] = '';
    Conf['Use Faster Image Host'] = 'true';
    Conf['Captcha Fixes'] = true;
    Conf['captchaServiceDomain'] = '';
    Conf['captchaServiceKey'] = dict();

    // Enforce JS whitelist
    if (
      /\.4chan(?:nel)?\.org$/.test(location.hostname) &&
      !SW.yotsuba.regexp.pass.test(location.href) &&
      !$$('script:not([src])', d).filter(s => /this\[/.test(s.textContent)).length
    ) {
      ($.getSync || $.get)({'jsWhitelist': Conf['jsWhitelist']}, ({jsWhitelist}) => {
        const parsedList = jsWhitelist.replace(/^#.*$/mg, '').replace(/[\s;]+/g, ' ').trim();
        if (/\S/.test(parsedList)) $.addCSP(`script-src ${parsedList}`);
      });
    }

    // Get saved values as items
    const items = dict();
    for (key in Conf) { items[key] = undefined; }
    items['previousversion'] = undefined;
    return ($.getSync || $.get)(items, function(items) {
      if (!$.perProtocolSettings && /\.4chan(?:nel)?\.org$/.test(location.hostname) && (items['Redirect to HTTPS'] ?? Conf['Redirect to HTTPS']) && (location.protocol !== 'https:')) {
        location.replace('https://' + location.host + location.pathname + location.search + location.hash);
        return;
      }
      return $.asap(docSet, function() {

        // Don't hide the local storage warning behind a settings panel.
        if ($.cantSet) {
          // pass

        // Fresh install
        } else if ((items.previousversion == null)) {
          Main.isFirstRun = true;
          Main.ready(function() {
            $.set('previousversion', g.VERSION);
            return Settings.open();
          });

        // Migrate old settings
        } else if (items.previousversion !== g.VERSION) {
          Main.upgrade(items);
        }

        // Combine default values with saved values
        for (key in Conf) {
          var val = Conf[key];
          Conf[key] = items[key] ?? val;
        }

        return Site.init(Main.initFeatures);
      });
    });
  },

  upgrade(items) {
    const {previousversion} = items;
    const changes = Settings.upgrade(items, previousversion);
    items.previousversion = (changes.previousversion = g.VERSION);
    return $.set(changes, function() {
      if (items['Show Updated Notifications'] ?? true) {
        const el = $.el('span',
          { innerHTML: `${meta.name} has been updated to <a href="${meta.changelog}" target="_blank">version ${g.VERSION}</a>.` });
        return new Notice('info', el, 15);
      }
    });
  },

  parseURL(site=g.SITE, url=location) {
    const r = {};

    if (!site) { return r; }
    r.siteID = site.ID;

    if (site.isBoardlessPage?.(url)) { return r; }
    const pathname = url.pathname.split(/\/+/);
    r.boardID = pathname[1];

    if (site.isFileURL(url)) {
      r.VIEW = 'file';
    } else if (site.isAuxiliaryPage?.(url)) {
      // pass
    } else if (['thread', 'res'].includes(pathname[2])) {
      r.VIEW = 'thread';
      r.threadID = (r.THREADID = +pathname[3].replace(/\.\w+$/, ''));
    } else if ((pathname[2] === 'archive') && (pathname[3] === 'res')) {
      r.VIEW = 'thread';
      r.threadID = (r.THREADID = +pathname[4].replace(/\.\w+$/, ''));
      r.threadArchived = true;
    } else if (/^(?:catalog|archive)(?:\.\w+)?$/.test(pathname[2])) {
      r.VIEW = pathname[2].replace(/\.\w+$/, '');
    } else if (/^(?:index|\d*)(?:\.\w+)?$/.test(pathname[2])) {
      r.VIEW = 'index';
    }
    return r;
  },

  initFeatures() {
    $.global(function() {
      document.documentElement.classList.add('js-enabled');
      return window.FCX = {};});
    Main.jsEnabled = $.hasClass(doc, 'js-enabled');

    // XXX https://bugs.chromium.org/p/chromium/issues/detail?id=920638
    $.ajaxPageInit?.();

    $.extend(g, Main.parseURL());
    if (g.boardID) { g.BOARD = new Board(g.boardID); }

    if (!g.VIEW) {
      g.SITE.initAuxiliary?.();
      return;
    }

    if (g.VIEW === 'file') {
      $.asap((() => d.readyState !== 'loading'), function() {
        let video;
        if ((g.SITE.software === 'yotsuba') && Conf['404 Redirect'] && g.SITE.is404?.()) {
          const pathname = location.pathname.split(/\/+/);
          return Redirect.navigate('file', {
            boardID:  g.BOARD.ID,
            filename: pathname[pathname.length - 1]
          });
        } else if (video = $('video')) {
          if (Conf['Volume in New Tab']) {
            Volume.setup(video);
          }
          if (Conf['Loop in New Tab']) {
            video.loop = true;
            video.controls = false;
            video.play();
            return ImageCommon.addControls(video);
          }
        }
      });
      return;
    }

    g.threads = new SimpleDict();
    g.posts   = new SimpleDict();

    // set up CSS when <head> is completely loaded
    $.onExists(doc, 'body', Main.initStyle);

    // c.time 'All initializations'
    for (var [name, feature] of Main.features) {
      if (g.SITE.disabledFeatures && g.SITE.disabledFeatures.includes(name)) { continue; }
      // c.time "#{name} initialization"
      try {
        feature.init();
      } catch (err) {
        Main.handleErrors({
          message: `\"${name}\" initialization crashed.`,
          error: err
        });
      }
    }
      // finally
      //   c.timeEnd "#{name} initialization"

    // c.timeEnd 'All initializations'

    return $.ready(Main.initReady);
  },

  initStyle() {
    if (!Main.isThisPageLegit()) { return; }

    // disable the mobile layout
    const mobileLink = $('link[href*=mobile]', d.head);
    if (mobileLink) mobileLink.disabled = true;
    doc.dataset.host = location.host;
    $.addClass(doc, `sw-${g.SITE.software}`);
    $.addClass(doc, g.VIEW === 'thread' ? 'thread-view' : g.VIEW);
    $.onExists(doc, '.ad-cnt, .adg-rects > .desktop', ad => $.onExists(ad, 'img, iframe', () => $.addClass(doc, 'ads-loaded')));
    if (Conf['Autohiding Scrollbar']) { $.addClass(doc, 'autohiding-scrollbar'); }
    $.ready(function() {
      if ((d.body.clientHeight > doc.clientHeight) && ((window.innerWidth === doc.clientWidth) !== Conf['Autohiding Scrollbar'])) {
        Conf['Autohiding Scrollbar'] = !Conf['Autohiding Scrollbar'];
        $.set('Autohiding Scrollbar', Conf['Autohiding Scrollbar']);
        return $.toggleClass(doc, 'autohiding-scrollbar');
      }
    });
    $.addStyle(CSS.sub(CSS.boards), 'fourchanx-css');
    Main.bgColorStyle = $.el('style', {id: 'fourchanx-bgcolor-css'});

    let keyboard = false;
    $.on(d, 'mousedown', () => keyboard = false);
    $.on(d, 'keydown', function(e) { if (e.keyCode === 9) { return keyboard = true; } }); // tab
    window.addEventListener('focus', (() => doc.classList.toggle('keyboard-focus', keyboard)), true);

    return Main.setClass();
  },

  setClass() {
    let mainStyleSheet, style, styleSheets;
    const knownStyles = ['yotsuba', 'yotsuba-b', 'futaba', 'burichan', 'photon', 'tomorrow', 'spooky'];

    if ((g.SITE.software === 'yotsuba') && (g.VIEW === 'catalog')) {
      if (mainStyleSheet = $.id('base-css')) {
        style = mainStyleSheet.href.match(/catalog_(\w+)/)?.[1].replace('_new', '').replace(/_+/g, '-');
        if (knownStyles.includes(style)) {
          $.addClass(doc, style);
          return;
        }
      }
    }

    style = (mainStyleSheet = (styleSheets = null));

    const setStyle = function() {
      // Use preconfigured CSS for 4chan's default themes.
      if (g.SITE.software === 'yotsuba') {
        $.rmClass(doc, style);
        style = null;
        for (var styleSheet of styleSheets) {
          if (styleSheet.href === mainStyleSheet?.href) {
            style = styleSheet.title.toLowerCase().replace('new', '').trim().replace(/\s+/g, '-');
            if (style === '_special') { style = styleSheet.href.match(/[a-z]*(?=[^/]*$)/)[0]; }
            if (!knownStyles.includes(style)) { style = null; }
            break;
          }
        }
        if (style) {
          $.addClass(doc, style);
          $.rm(Main.bgColorStyle);
          return;
        }
      }

      // Determine proper dialog background color for other themes.
      const div = g.SITE.bgColoredEl();
      div.style.position = 'absolute';
      div.style.visibility = 'hidden';
      $.add(d.body, div);
      let bgColor = window.getComputedStyle(div).backgroundColor;
      $.rm(div);
      const rgb = bgColor.match(/[\d.]+/g);
      // Use body background if reply background is transparent
      if (!/^rgb\(/.test(bgColor)) {
        const s = window.getComputedStyle(d.body);
        bgColor = `${s.backgroundColor} ${s.backgroundImage} ${s.backgroundRepeat} ${s.backgroundPosition}`;
      }
      let css = `\
.dialog, .suboption-list > div:last-of-type, :root.catalog-hover-expand .catalog-container:hover > .post {
  background: ${bgColor};
}
.unread-mark-read {
  background-color: rgba(${rgb.slice(0, 3).join(', ')}, ${0.5*(rgb[3] || 1)});
}\
`;
      if ($.luma(rgb) < 100) {
        css += `\
.watch-thread-link {
  background-image: url("data:image/svg+xml,<svg viewBox='0 0 26 26' preserveAspectRatio='true' xmlns='http://www.w3.org/2000/svg'><path fill='rgb(200,200,200)' d='M24.132,7.971c-2.203-2.205-5.916-2.098-8.25,0.235L15.5,8.588l-0.382-0.382c-2.334-2.333-6.047-2.44-8.25-0.235c-2.204,2.203-2.098,5.916,0.235,8.249l8.396,8.396l8.396-8.396C26.229,13.887,26.336,10.174,24.132,7.971z'/></svg>");
}\
`;
      }
      Main.bgColorStyle.textContent = css;
      return $.after($.id('fourchanx-css'), Main.bgColorStyle);
    };

    $.onExists(d.head, g.SITE.selectors.styleSheet, function(el) {
      mainStyleSheet = el;
      if (g.SITE.software === 'yotsuba') {
        styleSheets = $$('link[rel="alternate stylesheet"]', d.head);
      }
      new MutationObserver(setStyle).observe(mainStyleSheet, {
        attributes: true,
        attributeFilter: ['href']
      });
      $.on(mainStyleSheet, 'load', setStyle);
      return setStyle();
    });
    if (!mainStyleSheet) {
      for (var styleSheet of $$('link[rel="stylesheet"]', d.head)) {
        $.on(styleSheet, 'load', setStyle);
      }
      return setStyle();
    }
  },

  initReady() {
    if (g.SITE.is404?.()) {
      if (g.VIEW === 'thread') {
        ThreadWatcher.set404(g.BOARD.ID, g.THREADID, function() {
          if (Conf['404 Redirect']) {
            return Redirect.navigate('thread', {
              boardID:  g.BOARD.ID,
              threadID: g.THREADID,
              postID:   +location.hash.match(/\d+/)
            } // post number or 0
            , `/${g.BOARD}/`);
          }
        });
      }

      return;
    }

    if (g.SITE.isIncomplete?.()) {
      const msg = $.el('div',
        {innerHTML: 'The page didn&#039;t load completely.<br>Some features may not work unless you <a href="javascript:;">reload</a>.'});
      $.on($('a', msg), 'click', () => location.reload());
      new Notice('warning', msg);
    }

    // Parse HTML or skip it and start building from JSON.
    if (g.VIEW === 'catalog') {
      return Main.initCatalog();
    } else if (!Index.enabled) {
      if (g.SITE.awaitBoard) {
        return g.SITE.awaitBoard(Main.initThread);
      } else {
        return Main.initThread();
      }
    } else {
      Main.expectInitFinished = true;
      return $.event('4chanXInitFinished');
    }
  },

  initThread() {
    let board;
    const s = g.SITE.selectors;
    if (board = $((s.boardFor?.[g.VIEW] || s.board))) {
      const threads = [];
      const posts   = [];
      const errors  = [];

      try {
        g.SITE.preParsingFixes?.(board);
      } catch (error) {}

      Main.addThreadsObserver = new MutationObserver(Main.addThreads);
      Main.addPostsObserver   = new MutationObserver(Main.addPosts);
      Main.addThreadsObserver.observe(board, {childList: true});

      Main.parseThreads($$(s.thread, board), threads, posts, errors);
      if (errors.length) { Main.handleErrors(errors); }

      if (g.VIEW === 'thread') {
        if (g.threadArchived) {
          threads[0].isArchived = true;
          threads[0].kill();
        }
        g.SITE.parseThreadMetadata?.(threads[0]);
      }

      Main.callbackNodes('Thread', threads);
      return Main.callbackNodesDB('Post', posts, function() {
        for (var post of posts) { QuoteThreading.insert(post); }
        Main.expectInitFinished = true;
        return $.event('4chanXInitFinished');
      });

    } else {
      Main.expectInitFinished = true;
      return $.event('4chanXInitFinished');
    }
  },

  parseThreads(threadRoots, threads, posts, errors) {
    for (var threadRoot of threadRoots) {
      var boardObj = (() => {
        let boardID;
        if (boardID = threadRoot.dataset.board) {
        boardID = encodeURIComponent(boardID);
        return g.boards[boardID] || new Board(boardID);
      } else {
        return g.BOARD;
      }
      })();
      var threadID = +threadRoot.id.match(/\d*$/)[0];
      if (!threadID || boardObj.threads.get(threadID)?.nodes.root) { return; }
      var thread = new Thread(threadID, boardObj);
      thread.nodes.root = threadRoot;
      threads.push(thread);
      var postRoots = $$(g.SITE.selectors.postContainer, threadRoot);
      if (g.SITE.isOPContainerThread) { postRoots.unshift(threadRoot); }
      Main.parsePosts(postRoots, thread, posts, errors);
      Main.addPostsObserver.observe(threadRoot, {childList: true});
    }
  },

  parsePosts(postRoots, thread, posts, errors) {
    for (var postRoot of postRoots) {
      if (!(postRoot.dataset.fullID && g.posts.get(postRoot.dataset.fullID)) && $(g.SITE.selectors.comment, postRoot)) {
        try {
          posts.push(new Post(postRoot, thread, thread.board));
        } catch (err) {
          // Skip posts that we failed to parse.
          errors.push({
            message: `Parsing of Post No.${postRoot.id.match(/\d+/)} failed. Post will be skipped.`,
            error: err,
            html: postRoot.outerHTML
          });
        }
      }
    }
  },

  addThreads(records) {
    const threadRoots = [];
    for (var record of records) {
      for (var node of record.addedNodes) {
        if ((node.nodeType === Node.ELEMENT_NODE) && node.matches(g.SITE.selectors.thread)) {
          threadRoots.push(node);
        }
      }
    }
    if (!threadRoots.length) { return; }
    const threads = [];
    const posts   = [];
    const errors  = [];
    Main.parseThreads(threadRoots, threads, posts, errors);
    if (errors.length) { Main.handleErrors(errors); }
    Main.callbackNodes('Thread', threads);
    return Main.callbackNodesDB('Post', posts, () => $.event('PostsInserted', null, records[0].target));
  },

  addPosts(records) {
    let thread;
    const threads   = [];
    const threadsRM = [];
    const posts     = [];
    const errors    = [];
    for (var record of records) {
      thread = Get.threadFromRoot(record.target);
      var postRoots = [];
      for (var node of record.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches(g.SITE.selectors.postContainer) || (node = $(g.SITE.selectors.postContainer, node))) {
            postRoots.push(node);
          }
        }
      }
      var n = posts.length;
      Main.parsePosts(postRoots, thread, posts, errors);
      if ((posts.length > n) && !threads.includes(thread)) {
        threads.push(thread);
      }
      var anyRemoved = false;
      for (var el of record.removedNodes) {
        if ((Get.postFromRoot(el)?.nodes.root === el) && !doc.contains(el)) {
          anyRemoved = true;
          break;
        }
      }
      if (anyRemoved && !threadsRM.includes(thread)) {
        threadsRM.push(thread);
      }
    }
    if (errors.length) { Main.handleErrors(errors); }
    return Main.callbackNodesDB('Post', posts, function() {
      for (thread of threads) {
        $.event('PostsInserted', null, thread.nodes.root);
      }
      for (thread of threadsRM) {
        $.event('PostsRemoved', null, thread.nodes.root);
      }
    });
  },

  initCatalog() {
    let board;
    const s = g.SITE.selectors.catalog;
    if (s && (board = $(s.board))) {
      const threads = [];
      const errors  = [];

      Main.addCatalogThreadsObserver = new MutationObserver(Main.addCatalogThreads);
      Main.addCatalogThreadsObserver.observe(board, {childList: true});

      Main.parseCatalogThreads($$(s.thread, board), threads, errors);
      if (errors.length) { Main.handleErrors(errors); }

      Main.callbackNodes('CatalogThreadNative', threads);
    }

    Main.expectInitFinished = true;
    return $.event('4chanXInitFinished');
  },

  parseCatalogThreads(threadRoots, threads, errors) {
    for (var threadRoot of threadRoots) {
      try {
        var thread = new CatalogThreadNative(threadRoot);
        if (thread.thread.catalogViewNative?.nodes.root !== threadRoot) {
          thread.thread.catalogViewNative = thread;
          threads.push(thread);
        }
      } catch (err) {
        // Skip threads that we failed to parse.
        errors.push({
          message: `Parsing of Catalog Thread No.${(threadRoot.dataset.id || threadRoot.id).match(/\d+/)} failed. Thread will be skipped.`,
          error: err,
          html: threadRoot.outerHTML
        });
      }
    }
  },

  addCatalogThreads(records) {
    const threadRoots = [];
    for (var record of records) {
      for (var node of record.addedNodes) {
        if ((node.nodeType === Node.ELEMENT_NODE) && node.matches(g.SITE.selectors.catalog.thread)) {
          threadRoots.push(node);
        }
      }
    }
    if (!threadRoots.length) { return; }
    const threads = [];
    const errors  = [];
    Main.parseCatalogThreads(threadRoots, threads, errors);
    if (errors.length) { Main.handleErrors(errors); }
    return Main.callbackNodes('CatalogThreadNative', threads);
  },

  callbackNodes(klass, nodes) {
    let node;
    let i = 0;
    const cb = Callbacks[klass];
    while ((node = nodes[i++])) {
      cb.execute(node);
    }
  },

  callbackNodesDB(klass, nodes, cb) {
    let i   = 0;
    const cbs = Callbacks[klass];
    const fn  = function() {
      let node;
      if (!(node = nodes[i])) { return false; }
      cbs.execute(node);
      return ++i % 25;
    };

    var softTask = function() {
      while (fn()) {
        continue;
      }
      if (!nodes[i]) {
        if (cb) { cb(); }
        return;
      }
      return setTimeout(softTask, 0);
    };

    return softTask();
  },

  handleErrors(errors) {
    // Detect conflicts with 4chan X v2
    let error;
    if (d.body && $.hasClass(d.body, 'fourchan_x') && !$.hasClass(doc, 'tainted')) {
      new Notice('error', 'Error: Multiple copies of 4chan X are enabled.');
      $.addClass(doc, 'tainted');
    }

    // Detect conflicts with native extension
    if (g.SITE.testNativeExtension && !$.hasClass(doc, 'tainted')) {
      const {enabled} = g.SITE.testNativeExtension();
      if (enabled) {
        $.addClass(doc, 'tainted');
        if (Conf['Disable Native Extension'] && !Main.isFirstRun) {
          const msg = $.el('div',
            { innerHTML: 'Failed to disable the native extension. You may need to <a href="' + E(meta.faq) + '#blocking-native-extension" target="_blank">block it</a>.' });
          new Notice('error', msg);
        }
      }
    }

    if (!(errors instanceof Array)) {
      error = errors;
    } else if (errors.length === 1) {
      error = errors[0];
    }
    if (error) {
      new Notice('error', Main.parseError(error, Main.reportLink([error])), 15);
      return;
    }

    const div = $.el('div', {
      innerHTML:
        `${errors.length} errors occurred.${Main.reportLink(errors).innerHTML} [<a href="javascript:;">show</a>]`
    });
    $.on(div.lastElementChild, 'click', function () {
      let ref;
      return [this.textContent, logs.hidden] = Array.from(ref = this.textContent === 'show' ? (
        ['hide', false]
      ) : (
        ['show', true]
      )), ref;
    });

    var logs = $.el('div',
      {hidden: true});
    for (error of errors) {
      $.add(logs, Main.parseError(error));
    }

    return new Notice('error', [div, logs], 30);
  },

  parseError(data, reportLink) {
    c.error(data.message, data.error.stack);
    const message = $.el('div',
      { innerHTML: E(data.message) + ((reportLink) ? (reportLink).innerHTML : "") });
    const error = $.el('div',
      {textContent: `${data.error.name || 'Error'}: ${data.error.message || 'see console for details'}`});
    const lines = data.error.stack?.match(/\d+(?=:\d+\)?$)/mg)?.join().replace(/^/, ' at ') || '';
    const context = $.el('div',
      { textContent: `(${meta.name} ${meta.fork} v${g.VERSION} ${platform} on ${$.engine}${lines})` });
    return [message, error, context];
  },

  reportLink(errors) {
    let info;
    const data = errors[0];
    let title  = data.message;
    if (errors.length > 1) { title += ` (+${errors.length - 1} other errors)`; }
    let details = '';
    const addDetails = function(text) {
      if (encodeURIComponent(title + details + text + '\n').length <= meta.newIssueMaxLength - meta.newIssue.replace(/%(title|details)/, '').length) {
        return details += text + '\n';
      }
    };
    addDetails(`\
[Please describe the steps needed to reproduce this error.]

Script: ${meta.name} ${meta.fork} v${g.VERSION} ${platform}
URL: ${location.href}
User agent: ${navigator.userAgent}\
`
    );
    if ((platform === 'userscript') && (info = (() => {
      if (typeof GM !== 'undefined' && GM !== null) { return GM.info; } else { if (typeof GM_info !== 'undefined' && GM_info !== null) { return GM_info; }
  }
    })())) {
      addDetails(`Userscript manager: ${info.scriptHandler} ${info.version}`);
    }
    addDetails('\n' + data.error);
    if (data.error.stack) { addDetails(data.error.stack.replace(data.error.toString(), '').trim()); }
    if (data.html) { addDetails('\n`' + data.html + '`'); }
    details = details.replace(/file:\/{3}.+\//g, ''); // Remove local file paths
    const url = meta.newIssue.replace('%title', encodeURIComponent(title)).replace('%details', encodeURIComponent(details));
    return { innerHTML: `<span class="report-error"> [<a href="${url}" target="_blank">report</a>]</span>` };
  },

  isThisPageLegit() {
    // not 404 error page or similar.
    if (!('thisPageIsLegit' in Main)) {
      Main.thisPageIsLegit = g.SITE.isThisPageLegit ?
        g.SITE.isThisPageLegit()
      :
        !/^[45]\d\d\b/.test(document.title) && !/\.(?:json|rss)$/.test(location.pathname);
    }
    return Main.thisPageIsLegit;
  },

  ready(cb) {
    return $.ready(function() {
      if (Main.isThisPageLegit()) { return cb(); }
    });
  },

  mounted(cb) {
    if (Main.isMounted) {
      return cb();
    } else {
      return Main.mountedCBs.push(cb);
    }
  },

  mountedCBs: [],

  features: [
    ['Polyfill',                  Polyfill],
    ['Board Configuration',       BoardConfig],
    ['Normalize URL',             NormalizeURL],
    ['Delay Redirect on Post',    PostRedirect],
    ['Captcha Configuration',     CaptchaReplace],
    ['Image Host Rewriting',      ImageHost],
    ['Redirect',                  Redirect],
    ['Header',                    Header],
    ['Catalog Links',             CatalogLinks],
    ['Settings',                  Settings],
    ['Index Generator',           Index],
    ['Disable Autoplay',          AntiAutoplay],
    ['Announcement Hiding',       PSAHiding],
    ['Fourchan thingies',         Fourchan],
    ['Tinyboard Glue',            Tinyboard],
    ['Color User IDs',            IDColor],
    ['Highlight by User ID',      IDHighlight],
    ['Count Posts by ID',         IDPostCount],
    ['Custom CSS',                CustomCSS],
    ['Thread Links',              ThreadLinks],
    ['Linkify',                   Linkify],
    ['Reveal Spoilers',           RemoveSpoilers],
    ['Resurrect Quotes',          Quotify],
    ['Filter',                    Filter],
    ['Thread Hiding Buttons',     ThreadHiding],
    ['Reply Hiding Buttons',      PostHiding],
    ['Recursive',                 Recursive],
    ['Strike-through Quotes',     QuoteStrikeThrough],
    ['Quick Reply Personas',      QR.persona],
    ['Quick Reply',               QR],
    ['Cooldown',                  QR.cooldown],
    ['Post Jumper',               PostJumper],
    ['Pass Link',                 PassLink],
    ['Menu',                      Menu],
    ['Index Generator (Menu)',    Index.menu],
    ['Report Link',               ReportLink],
    ['Copy Text Link',            CopyTextLink],
    ['Thread Hiding (Menu)',      ThreadHiding.menu],
    ['Reply Hiding (Menu)',       PostHiding.menu],
    ['Delete Link',               DeleteLink],
    ['Filter (Menu)',             Filter.menu],
    ['Edit Link',                 QR.oekaki.menu],
    ['Download Link',             DownloadLink],
    ['Archive Link',              ArchiveLink],
    ['Quote Inlining',            QuoteInline],
    ['Quote Previewing',          QuotePreview],
    ['Quote Backlinks',           QuoteBacklink],
    ['Mark Quotes of You',        QuoteYou],
    ['Mark OP Quotes',            QuoteOP],
    ['Mark Cross-thread Quotes',  QuoteCT],
    ['Anonymize',                 Anonymize],
    ['Time Formatting',           Time],
    ['Relative Post Dates',       RelativeDates],
    ['File Info Formatting',      FileInfo],
    ['Fappe Tyme',                FappeTyme],
    ['Gallery',                   Gallery],
    ['Gallery (menu)',            Gallery.menu],
    ['Sauce',                     Sauce],
    ['Image Expansion',           ImageExpand],
    ['Image Expansion (Menu)',    ImageExpand.menu],
    ['Reveal Spoiler Thumbnails', RevealSpoilers],
    ['Image Loading',             ImageLoader],
    ['Image Hover',               ImageHover],
    ['Volume Control',            Volume],
    ['WEBM Metadata',             Metadata],
    ['Comment Expansion',         ExpandComment],
    ['Thread Expansion',          ExpandThread],
    ['Favicon',                   Favicon],
    ['Unread',                    Unread],
    ['Unread Line in Index',      UnreadIndex],
    ['Quote Threading',           QuoteThreading],
    ['Thread Stats',              ThreadStats],
    ['Thread Updater',            ThreadUpdater],
    ['Thread Watcher',            ThreadWatcher],
    ['Thread Watcher (Menu)',     ThreadWatcher.menu],
    ['Mark New IPs',              MarkNewIPs],
    ['Index Navigation',          Nav],
    ['Keybinds',                  Keybinds],
    ['Banner',                    Banner],
    ['Announcements',             PSA],
    ['Flash Features',            Flash],
    ['Reply Pruning',             ReplyPruning],
    ['Mod Contact Links',         ModContact]
  ]
};
export default Main;
$.ready(() => Main.init());

// #region tests_enabled
Main.features.push(['Build Test', Test]);
// #endregion
