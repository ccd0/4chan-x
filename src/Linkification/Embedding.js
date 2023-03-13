/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import EmbeddingPage from './Ebedding/embedding.html';

var Embedding = {
  init() {
    if (!['index', 'thread', 'archive'].includes(g.VIEW) || !Conf['Linkify'] || (!Conf['Embedding'] && !Conf['Link Title'] && !Conf['Cover Preview'])) { return; }
    this.types = $.dict();
    for (var type of this.ordered_types) { this.types[type.key] = type; }

    if (Conf['Embedding'] && (g.VIEW !== 'archive')) {
      this.dialog = UI.dialog('embedding',
        { innerHTML: EmbeddingPage });
      this.media = $('#media-embed', this.dialog);
      $.one(d, '4chanXInitFinished', this.ready);
      $.on(d, 'IndexRefreshInternal', () => g.posts.forEach(function(post) {
        for (post of [post, ...Array.from(post.clones)]) {
          for (var embed of post.nodes.embedlinks) {
            Embedding.cb.catalogRemove.call(embed);
          }
        }
      }));
    }
    if (Conf['Link Title']) {
      return $.on(d, '4chanXInitFinished PostsInserted', function() {
        for (var key in Embedding.types) {
          var service = Embedding.types[key];
          if (service.title?.batchSize) {
            Embedding.flushTitles(service.title);
          }
        }
      });
    }
  },

  events(post) {
    let el, i, items;
    if (g.VIEW === 'archive') { return; }
    if (Conf['Embedding']) {
      i = 0;
      items = (post.nodes.embedlinks = $$('.embedder', post.nodes.comment));
      while ((el = items[i++])) {
        $.on(el, 'click', Embedding.cb.click);
        if ($.hasClass(el, 'embedded')) { Embedding.cb.toggle.call(el); }
      }
    }
    if (Conf['Cover Preview']) {
      i = 0;
      items = $$('.linkify', post.nodes.comment);
      while ((el = items[i++])) {
        var data;
        if (data = Embedding.services(el)) {
          Embedding.preview(data);
        }
      }
      return;
    }
  },

  process(link, post) {
    let data;
    if (!Conf['Embedding'] && !Conf['Link Title'] && !Conf['Cover Preview']) { return; }
    if ($.x('ancestor::pre', link)) { return; }
    if (data = Embedding.services(link)) {
      data.post = post;
      if (Conf['Embedding'] && (g.VIEW !== 'archive')) { Embedding.embed(data); }
      if (Conf['Link Title']) { Embedding.title(data); }
      if (Conf['Cover Preview'] && (g.VIEW !== 'archive')) { return Embedding.preview(data); }
    }
  },

  services(link) {
    const {href} = link;
    for (var type of Embedding.ordered_types) {
      var match;
      if (match = type.regExp.exec(href)) {
        return {key: type.key, uid: match[1], options: match[2], link};
      }
    }
  },

  embed(data) {
    const {key, uid, options, link, post} = data;
    const {href} = link;

    $.addClass(link, key.toLowerCase());

    const embed = $.el('a', {
      className:   'embedder',
      href:        'javascript:;'
    }
    ,
      {innerHTML: '(<span>un</span>embed)'});

    const object = {key, uid, options, href};
    for (var name in object) { var value = object[name]; embed.dataset[name] = value; }

    $.on(embed, 'click', Embedding.cb.click);
    $.after(link, [$.tn(' '), embed]);
    post.nodes.embedlinks.push(embed);

    if (Conf['Auto-embed'] && !Conf['Floating Embeds'] && !post.isFetchedQuote) {
      if ($.hasClass(doc, 'catalog-mode')) {
        return $.addClass(embed, 'embed-removed');
      } else {
        return Embedding.cb.toggle.call(embed);
      }
    }
  },

  ready() {
    if (!Main.isThisPageLegit()) { return; }
    $.addClass(Embedding.dialog, 'empty');
    $.on($('.close', Embedding.dialog), 'click',     Embedding.closeFloat);
    $.on($('.move',  Embedding.dialog), 'mousedown', Embedding.dragEmbed);
    $.on($('.jump',  Embedding.dialog), 'click', function() {
      if (doc.contains(Embedding.lastEmbed)) { return Header.scrollTo(Embedding.lastEmbed); }
    });
    return $.add(d.body, Embedding.dialog);
  },

  closeFloat() {
    delete Embedding.lastEmbed;
    $.addClass(Embedding.dialog, 'empty');
    return $.replace(Embedding.media.firstChild, $.el('div'));
  },

  dragEmbed() {
    // only webkit can handle a blocking div
    const {style} = Embedding.media;
    if (Embedding.dragEmbed.mouseup) {
      $.off(d, 'mouseup', Embedding.dragEmbed);
      Embedding.dragEmbed.mouseup = false;
      style.pointerEvents = '';
      return;
    }
    $.on(d, 'mouseup', Embedding.dragEmbed);
    Embedding.dragEmbed.mouseup = true;
    return style.pointerEvents = 'none';
  },

  title(data) {
    let service;
    const {key, uid, options, link, post} = data;
    if (!(service = Embedding.types[key].title)) { return; }
    $.addClass(link, key.toLowerCase());
    if (service.batchSize) {
      (service.queue || (service.queue = [])).push(data);
      if (service.queue.length >= service.batchSize) {
        return Embedding.flushTitles(service);
      }
    } else {
      return CrossOrigin.cache(service.api(uid), (function() { return Embedding.cb.title(this, data); }));
    }
  },

  flushTitles(service) {
    let data;
    const {queue} = service;
    if (!queue?.length) { return; }
    service.queue = [];
    const cb = function() {
      for (data of queue) { Embedding.cb.title(this, data); }
    };
    return CrossOrigin.cache(service.api((() => {
      const result = [];
      for (data of queue) {         result.push(data.uid);
      }
      return result;
    })()), cb);
  },

  preview(data) {
    let service;
    const {key, uid, link} = data;
    if (!(service = Embedding.types[key].preview)) { return; }
    return $.on(link, 'mouseover', function(e) {
      const src = service.url(uid);
      const {height} = service;
      const el = $.el('img', {
        src,
        id: 'ihover'
      }
      );
      $.add(Header.hover, el);
      return UI.hover({
        root: link,
        el,
        latestEvent: e,
        endEvents: 'mouseout click',
        height
      });
    });
  },

  cb: {
    click(e) {
      e.preventDefault();
      if (!$.hasClass(this, 'embedded') && (Conf['Floating Embeds'] || $.hasClass(doc, 'catalog-mode'))) {
        let div;
        if (!(div = Embedding.media.firstChild)) { return; }
        $.replace(div, Embedding.cb.embed(this));
        Embedding.lastEmbed = Get.postFromNode(this).nodes.root;
        return $.rmClass(Embedding.dialog, 'empty');
      } else {
        return Embedding.cb.toggle.call(this);
      }
    },

    toggle() {
      if ($.hasClass(this, "embedded")) {
        $.rm(this.nextElementSibling);
      } else {
        $.after(this, Embedding.cb.embed(this));
      }
      return $.toggleClass(this, 'embedded');
    },

    embed(a) {
      // We create an element to embed
      let el, type;
      const container = $.el('div', {className: 'media-embed'});
      $.add(container, (el = (type = Embedding.types[a.dataset.key]).el(a)));

      // Set style values.
      el.style.cssText = (type.style != null) ?
        type.style
      :
        'border: none; width: 640px; height: 360px;';

      return container;
    },

    catalogRemove() {
      const isCatalog = $.hasClass(doc, 'catalog-mode');
      if ((isCatalog && $.hasClass(this, 'embedded')) || (!isCatalog && $.hasClass(this, 'embed-removed'))) {
        Embedding.cb.toggle.call(this);
        return $.toggleClass(this, 'embed-removed');
      }
    },

    title(req, data) {
      let text;
      const {key, uid, options, link, post} = data;
      const service = Embedding.types[key].title;

      let {status} = req;
      if ([200, 304].includes(status) && service.status) {
        status = service.status(req.response)[0];
      }

      if (!status) { return; }

      text = `[${key}] ${(() => { switch (status) {
        case 200: case 304:
          text = service.text(req.response, uid);
          if (typeof text === 'string') {
            return text;
          } else {
            return text = link.textContent;
          }
        case 404:
          return "Not Found";
        case 403: case 401:
          return "Forbidden or Private";
        default:
          return `${status}'d`;
      } })()
      }`;

      link.dataset.original = link.textContent;
      link.textContent = text;
      for (var post2 of post.clones) {
        for (var link2 of $$('a.linkify', post2.nodes.comment)) {
          if (link2.href === link.href) {
            if (link2.dataset.original == null) { link2.dataset.original = link2.textContent; }
            link2.textContent = text;
          }
        }
      }
    }
  },

  ordered_types: [{
      key: 'audio',
      regExp: /^[^?#]+\.(?:mp3|m4a|oga|wav|flac)(?:[?#]|$)/i,
      style: '',
      el(a) {
        return $.el('audio', {
          controls:    true,
          preload:     'auto',
          src:         a.dataset.href
        }
        );
      }
    }
    , {
      key: 'image',
      regExp: /^[^?#]+\.(?:gif|png|jpg|jpeg|bmp|webp)(?::\w+)?(?:[?#]|$)/i,
      style: '',
      el(a) {
        return $.el('div', {innerHTML: '<a target="_blank" href="${a.dataset.href}"><img src="${a.dataset.href}" style="max-width: 80vw; max-height: 80vh;"></a>'});
      }
    }
    , {
      key: 'video',
      regExp: /^[^?#]+\.(?:og[gv]|webm|mp4)(?:[?#]|$)/i,
      style: 'max-width: 80vw; max-height: 80vh;',
      el(a) {
        const el = $.el('video', {
          hidden:   true,
          controls: true,
          preload:  'auto',
          src:      a.dataset.href,
          loop:     ImageHost.test(a.dataset.href.split('/')[2])
        });
        $.on(el, 'loadedmetadata', function() {
          if ((el.videoHeight === 0) && el.parentNode) {
            return $.replace(el, Embedding.types.audio.el(a));
          } else {
            return el.hidden = false;
          }
        });
        return el;
      }
    }
    , {
      key: 'PeerTube',
      regExp: /^(\w+:\/\/[^\/]+\/videos\/watch\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12})(.*)/,
      el(a) {
        let start;
        const options = (start = a.dataset.options.match(/[?&](start=\w+)/)) ? `?${start[1]}` : '';
        const el = $.el('iframe',
          {src: a.dataset.uid.replace('/videos/watch/', '/videos/embed/') + options});
        el.setAttribute("allowfullscreen", "true");
        return el;
      }
    }
    , {
      key: 'BitChute',
      regExp:  /^\w+:\/\/(?:www\.)?bitchute\.com\/video\/([\w\-]+)/,
      el(a) {
        const el = $.el('iframe',
          {src: `https://www.bitchute.com/embed/${a.dataset.uid}/`});
        el.setAttribute("allowfullscreen", "true");
        return el;
      }
    }
    , {
      key: 'Clyp',
      regExp: /^\w+:\/\/(?:www\.)?clyp\.it\/(\w{8})/,
      style: 'border: 0; width: 640px; height: 160px;',
      el(a) {
        return $.el('iframe',
          {src: `https://clyp.it/${a.dataset.uid}/widget`});
      },
      title: {
        api(uid) { return `https://api.clyp.it/oembed?url=https://clyp.it/${uid}`; },
        text(_) { return _.title; }
      }
    }
    , {
      key: 'Dailymotion',
      regExp:  /^\w+:\/\/(?:(?:www\.)?dailymotion\.com\/(?:embed\/)?video|dai\.ly)\/([A-Za-z0-9]+)[^?]*(.*)/,
      el(a) {
        let start;
        const options = (start = a.dataset.options.match(/[?&](start=\d+)/)) ? `?${start[1]}` : '';
        const el = $.el('iframe',
          {src: `//www.dailymotion.com/embed/video/${a.dataset.uid}${options}`});
        el.setAttribute("allowfullscreen", "true");
        return el;
      },
      title: {
        api(uid) { return `https://api.dailymotion.com/video/${uid}`; },
        text(_) { return _.title; }
      },
      preview: {
        url(uid) { return `https://www.dailymotion.com/thumbnail/video/${uid}`; },
        height: 240
      }
    }
    , {
      key: 'Gfycat',
      regExp: /^\w+:\/\/(?:www\.)?gfycat\.com\/(?:iframe\/)?(\w+)/,
      el(a) {
        const el = $.el('iframe',
          {src: `//gfycat.com/ifr/${a.dataset.uid}`});
        el.setAttribute("allowfullscreen", "true");
        return el;
      }
    }
    , {
      key: 'Gist',
      regExp: /^\w+:\/\/gist\.github\.com\/[\w\-]+\/(\w+)/,
      style: '',
      el: (function() {
        let counter = 0;
        return function(a) {
          const el = $.el('pre', {
            hidden: true,
            id: `gist-embed-${counter++}`
          }
          );
          CrossOrigin.cache(`https://api.github.com/gists/${a.dataset.uid}`, function() {
            el.textContent = Object.values(this.response.files)[0].content;
            el.className = 'prettyprint';
            $.global(() => window.prettyPrint?.((function() {}), document.getElementById(document.currentScript.dataset.id).parentNode)
            , {id: el.id});
            return el.hidden = false;
          });
          return el;
        };
      })(),
      title: {
        api(uid) { return `https://api.github.com/gists/${uid}`; },
        text({files}) {
          for (var file in files) { if (files.hasOwnProperty(file)) { return file; } }
        }
      }
    }
    , {
      key: 'InstallGentoo',
      regExp: /^\w+:\/\/paste\.installgentoo\.com\/view\/(?:raw\/|download\/|embed\/)?(\w+)/,
      el(a) {
        return $.el('iframe',
          {src: `https://paste.installgentoo.com/view/embed/${a.dataset.uid}`});
      }
    }
    , {
      key: 'LiveLeak',
      regExp: /^\w+:\/\/(?:\w+\.)?liveleak\.com\/.*\?.*[tif]=(\w+)/,
      el(a) {
        const el = $.el('iframe',
          {src: `https://www.liveleak.com/e/${a.dataset.uid}`,});
        el.setAttribute("allowfullscreen", "true");
        return el;
      }
    }
    , {
      key: 'Loopvid',
      regExp: /^\w+:\/\/(?:www\.)?loopvid.appspot.com\/#?((?:pf|kd|lv|gd|gh|db|dx|nn|cp|wu|ig|ky|mf|m2|pc|1c|pi|ni|wl|ko|mm|ic|gc)\/[\w\-\/]+(?:,[\w\-\/]+)*|fc\/\w+\/\d+|https?:\/\/.+)/,
      style: 'max-width: 80vw; max-height: 80vh;',
      el(a) {
        const el = $.el('video', {
          controls: true,
          preload:  'auto',
          loop:     true
        }
        );
        if (/^http/.test(a.dataset.uid)) {
          $.add(el, $.el('source', {src: a.dataset.uid}));
          return el;
        }
        const [_, host, names] = Array.from(a.dataset.uid.match(/(\w+)\/(.*)/));
        const types = (() => { switch (host) {
          case 'gd': case 'wu': case 'fc': return [''];
          case 'gc': return ['giant', 'fat', 'zippy'];
          default: return ['.webm', '.mp4'];
        } })();
        for (var name of names.split(',')) {
          for (var type of types) {
            var base = `${name}${type}`;
            var urls = (() => { switch (host) {
              // list from src/common.py at http://loopvid.appspot.com/source.html
              case 'pf': return [`https://kastden.org/_loopvid_media/pf/${base}`, `https://web.archive.org/web/2/http://a.pomf.se/${base}`];
              case 'kd': return [`https://kastden.org/loopvid/${base}`];
              case 'lv': return [`https://lv.kastden.org/${base}`];
              case 'gd': return [`https://docs.google.com/uc?export=download&id=${base}`];
              case 'gh': return [`https://googledrive.com/host/${base}`];
              case 'db': return [`https://dl.dropboxusercontent.com/u/${base}`];
              case 'dx': return [`https://dl.dropboxusercontent.com/${base}`];
              case 'nn': return [`https://kastden.org/_loopvid_media/nn/${base}`];
              case 'cp': return [`https://copy.com/${base}`];
              case 'wu': return [`http://webmup.com/${base}/vid.webm`];
              case 'ig': return [`https://i.imgur.com/${base}`];
              case 'ky': return [`https://kastden.org/_loopvid_media/ky/${base}`];
              case 'mf': return [`https://kastden.org/_loopvid_media/mf/${base}`, `https://web.archive.org/web/2/https://d.maxfile.ro/${base}`];
              case 'm2': return [`https://kastden.org/_loopvid_media/m2/${base}`];
              case 'pc': return [`https://kastden.org/_loopvid_media/pc/${base}`, `https://web.archive.org/web/2/http://a.pomf.cat/${base}`];
              case '1c': return [`http://b.1339.cf/${base}`];
              case 'pi': return [`https://kastden.org/_loopvid_media/pi/${base}`, `https://web.archive.org/web/2/https://u.pomf.is/${base}`];
              case 'ni': return [`https://kastden.org/_loopvid_media/ni/${base}`, `https://web.archive.org/web/2/https://u.nya.is/${base}`];
              case 'wl': return [`http://webm.land/media/${base}`];
              case 'ko': return [`https://kordy.kastden.org/loopvid/${base}`];
              case 'mm': return [`https://kastden.org/_loopvid_media/mm/${base}`, `https://web.archive.org/web/2/https://my.mixtape.moe/${base}`];
              case 'ic': return [`https://media.8ch.net/file_store/${base}`];
              case 'fc': return [`//${ImageHost.host()}/${base}.webm`];
              case 'gc': return [`https://${type}.gfycat.com/${name}.webm`];
            } })();

            for (var url of urls) {
              $.add(el, $.el('source', {src: url}));
            }
          }
        }
        return el;
      }
    }
    , {
      key: 'Openings.moe',
      regExp: /^\w+:\/\/openings.moe\/\?video=([^.&=]+)/,
      style: 'width: 1280px; height: 720px; max-width: 80vw; max-height: 80vh;',
      el(a) {
        const el = $.el('iframe',
          {src: `https://openings.moe/?video=${a.dataset.uid}`,});
        el.setAttribute("allowfullscreen", "true");
        return el;
      }
    }
    , {
      key: 'Pastebin',
      regExp: /^\w+:\/\/(?:\w+\.)?pastebin\.com\/(?!u\/)(?:[\w.]+(?:\/|\?i\=))?(\w+)/,
      el(a) {
        let div;
        return div = $.el('iframe',
          {src: `//pastebin.com/embed_iframe.php?i=${a.dataset.uid}`});
      }
    }
    , {
      key: 'SoundCloud',
      regExp: /^\w+:\/\/(?:www\.)?(?:soundcloud\.com\/|snd\.sc\/)([\w\-\/]+)/,
      style: 'border: 0; width: 500px; height: 400px;',
      el(a) {
        return $.el('iframe',
          {src: `https://w.soundcloud.com/player/?visual=true&show_comments=false&url=https%3A%2F%2Fsoundcloud.com%2F${encodeURIComponent(a.dataset.uid)}`});
      },
      title: {
        api(uid) { return `${location.protocol}//soundcloud.com/oembed?format=json&url=https%3A%2F%2Fsoundcloud.com%2F${encodeURIComponent(uid)}`; },
        text(_) { return _.title; }
      }
    }
    , {
      key: 'StrawPoll',
      regExp: /^\w+:\/\/(?:www\.)?strawpoll\.me\/(?:embed_\d+\/)?(\d+(?:\/r)?)/,
      style: 'border: 0; width: 600px; height: 406px;',
      el(a) {
        return $.el('iframe',
          {src: `https://www.strawpoll.me/embed_1/${a.dataset.uid}`});
      }
    }
    , {
      key: 'Streamable',
      regExp: /^\w+:\/\/(?:www\.)?streamable\.com\/(\w+)/,
      el(a) {
        const el = $.el('iframe',
          {src: `https://streamable.com/o/${a.dataset.uid}`});
        el.setAttribute("allowfullscreen", "true");
        return el;
      },
      title: {
        api(uid) { return `https://api.streamable.com/oembed?url=https://streamable.com/${uid}`; },
        text(_) { return _.title; }
      }
    }
    , {
      key: 'TwitchTV',
      regExp: /^\w+:\/\/(?:www\.|secure\.|clips\.|m\.)?twitch\.tv\/(\w[^#\&\?]*)/,
      el(a) {
        let url;
        let m = a.dataset.href.match(/^\w+:\/\/(?:(clips\.)|\w+\.)?twitch\.tv\/(?:\w+\/)?(clip\/)?(\w[^#\&\?]*)/);
        if (m[1] || m[2]) {
          url = `//clips.twitch.tv/embed?clip=${m[3]}&parent=${location.hostname}`;
        } else {
          let time;
          m = a.dataset.uid.match(/(\w+)(?:\/(?:v\/)?(\d+))?/);
          url = `//player.twitch.tv/?${m[2] ? `video=v${m[2]}` : `channel=${m[1]}`}&autoplay=false&parent=${location.hostname}`;
          if (time = a.dataset.href.match(/\bt=(\w+)/)) {
            url += `&time=${time[1]}`;
          }
        }
        const el = $.el('iframe',
          {src: url});
        el.setAttribute("allowfullscreen", "true");
        return el;
      }
    }
    , {
      key: 'Twitter',
      regExp: /^\w+:\/\/(?:www\.|mobile\.)?twitter\.com\/(\w+\/status\/\d+)/,
      style: 'border: none; width: 550px; height: 250px; overflow: hidden; resize: both;',
      el(a) {
        const el = $.el('iframe');
        $.on(el, 'load', function() {
          return this.contentWindow.postMessage({element: 't', query: 'height'}, 'https://twitframe.com');
        });
        var onMessage = function(e) {
          if ((e.source === el.contentWindow) && (e.origin === 'https://twitframe.com')) {
            $.off(window, 'message', onMessage);
            return (cont || el).style.height = `${+$.minmax(e.data.height, 250, 0.8 * doc.clientHeight)}px`;
          }
        };
        $.on(window, 'message', onMessage);
        el.src = `https://twitframe.com/show?url=https://twitter.com/${a.dataset.uid}`;
        if ($.engine === 'gecko') {
          // XXX https://bugzilla.mozilla.org/show_bug.cgi?id=680823
          el.style.cssText = 'border: none; width: 100%; height: 100%;';
          var cont = $.el('div');
          $.add(cont, el);
          return cont;
        } else {
          return el;
        }
      }
    }
    , {
      key: 'VidLii',
      regExp:  /^\w+:\/\/(?:www\.)?vidlii\.com\/watch\?v=(\w{11})/,
      style: 'border: none; width: 640px; height: 392px;',
      el(a) {
        const el = $.el('iframe',
          {src: `https://www.vidlii.com/embed?v=${a.dataset.uid}&a=0`});
        el.setAttribute("allowfullscreen", "true");
        return el;
      }
    }
    , {
      key: 'Vimeo',
      regExp:  /^\w+:\/\/(?:www\.)?vimeo\.com\/(\d+)/,
      el(a) {
        const el = $.el('iframe',
          {src: `//player.vimeo.com/video/${a.dataset.uid}?wmode=opaque`});
        el.setAttribute("allowfullscreen", "true");
        return el;
      },
      title: {
        api(uid) { return `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${uid}`; },
        text(_) { return _.title; }
      }
    }
    , {
      key: 'Vine',
      regExp: /^\w+:\/\/(?:www\.)?vine\.co\/v\/(\w+)/,
      style: 'border: none; width: 500px; height: 500px;',
      el(a) {
        return $.el('iframe',
          {src: `https://vine.co/v/${a.dataset.uid}/card`});
      }
    }
    , {
      key: 'Vocaroo',
      regExp: /^\w+:\/\/(?:(?:www\.|old\.)?vocaroo\.com|voca\.ro)\/((?:i\/)?\w+)/,
      style: '',
      el(a) {
        const el = $.el('iframe');
        el.width = 300;
        el.height = 60;
        el.setAttribute('frameborder', 0);
        el.src = `https://vocaroo.com/embed/${a.dataset.uid.replace(/^i\//, '')}?autoplay=0`;
        return el;
      }
    }
    , {
      key: 'YouTube',
      regExp: /^\w+:\/\/(?:youtu.be\/|[\w.]*youtube[\w.]*\/.*(?:v=|\bembed\/|\bv\/))([\w\-]{11})(.*)/,
      el(a) {
        let start = a.dataset.options.match(/\b(?:star)?t\=(\w+)/);
        if (start) { start = start[1]; }
        if (start && !/^\d+$/.test(start)) {
          start += ' 0h0m0s';
          start = (3600 * start.match(/(\d+)h/)[1]) + (60 * start.match(/(\d+)m/)[1]) + (1 * start.match(/(\d+)s/)[1]);
        }
        const el = $.el('iframe',
          {src: `//www.youtube.com/embed/${a.dataset.uid}?rel=0&wmode=opaque${start ? '&start=' + start : ''}`});
        el.setAttribute("allowfullscreen", "true");
        return el;
      },
      title: {
        api(uid) { return `https://www.youtube.com/oembed?url=https%3A//www.youtube.com/watch%3Fv%3D${uid}&format=json`; },
        text(_) { return _.title; },
        status(_) {
          if (_.error) {
            const m = _.error.match(/^(\d*)\s*(.*)/);
            return [+m[1], m[2]];
          } else {
            return [200, 'OK'];
          }
        }
      },
      preview: {
        url(uid) { return `https://img.youtube.com/vi/${uid}/0.jpg`; },
        height: 360
      }
    }
  ]
};
