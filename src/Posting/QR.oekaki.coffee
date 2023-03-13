/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
QR.oekaki = {
  menu: {
    init() {
      if (!['index', 'thread'].includes(g.VIEW) || !Conf['Menu'] || !Conf['Edit Link'] || !Conf['Quick Reply']) { return; }

      const a = $.el('a', {
        className: 'edit-link',
        href: 'javascript:;',
        textContent: 'Edit image'
      }
      );
      $.on(a, 'click', this.editFile);

      return Menu.menu.addEntry({
        el: a,
        order: 90,
        open(post) {
          QR.oekaki.menu.post = post;
          const {file} = post;
          return QR.postingIsEnabled && !!file && (file.isImage || file.isVideo);
        }
      });
    },

    editFile() {
      const {post} = QR.oekaki.menu;
      QR.quote.call(post.nodes.post);
      const {isVideo} = post.file;
      const currentTime = post.file.fullImage?.currentTime || 0;
      return CrossOrigin.file(post.file.url, function(blob) {
        if (!blob) {
          return QR.error("Can't load file.");
        } else if (isVideo) {
          const video = $.el('video');
          $.on(video, 'loadedmetadata', function() {
            $.on(video, 'seeked', function() {
              const canvas = $.el('canvas', {
                width: video.videoWidth,
                height: video.videoHeight
              }
              );
              canvas.getContext('2d').drawImage(video, 0, 0);
              return canvas.toBlob(function(snapshot) {
                snapshot.name = post.file.name.replace(/\.\w+$/, '') + '.png';
                QR.handleFiles([snapshot]);
                return QR.oekaki.edit();
              });
            });
            return video.currentTime = currentTime;
          });
          $.on(video, 'error', () => QR.openError());
          return video.src = URL.createObjectURL(blob);
        } else {
          blob.name = post.file.name;
          QR.handleFiles([blob]);
          return QR.oekaki.edit();
        }
      });
    }
  },

  setup() {
    return $.global(function() {
      const {FCX} = window;
      FCX.oekakiCB = () => window.Tegaki.flatten().toBlob(function(file) {
        const source = `oekaki-${Date.now()}`;
        FCX.oekakiLatest = source;
        return document.dispatchEvent(new CustomEvent('QRSetFile', {
          bubbles: true,
          detail: {file, name: FCX.oekakiName, source}
        }));});
      if (window.Tegaki) {
        return document.querySelector('#qr .oekaki').hidden = false;
      }
    });
  },

  load(cb) {
    if ($('script[src^="//s.4cdn.org/js/tegaki"]', d.head)) {
      return cb();
    } else {
      const style = $.el('link', {
        rel: 'stylesheet',
        href: `//s.4cdn.org/css/tegaki.${Date.now()}.css`
      }
      );
      const script = $.el('script',
        {src: `//s.4cdn.org/js/tegaki.min.${Date.now()}.js`});
      let n = 0;
      const onload = function() {
        if (++n === 2) { return cb(); }
      };
      $.on(style,  'load', onload);
      $.on(script, 'load', onload);
      return $.add(d.head, [style, script]);
    }
  },

  draw() {
    return $.global(function() {
      const {Tegaki, FCX} = window;
      if (Tegaki.bg) { Tegaki.destroy(); }
      FCX.oekakiName = 'tegaki.png';
      return Tegaki.open({
        onDone: FCX.oekakiCB,
        onCancel() { return Tegaki.bgColor = '#ffffff'; },
        width:  +document.querySelector('#qr [name=oekaki-width]').value,
        height: +document.querySelector('#qr [name=oekaki-height]').value,
        bgColor:
          document.querySelector('#qr [name=oekaki-bg]').checked ?
            document.querySelector('#qr [name=oekaki-bgcolor]').value
          :
            'transparent'
      });
    });
  },

  button() {
    if (QR.selected.file) {
      return QR.oekaki.edit();
    } else {
      return QR.oekaki.toggle();
    }
  },

  edit() {
    return QR.oekaki.load(() => $.global(function() {
      const {Tegaki, FCX} = window;
      const name     = document.getElementById('qr-filename').value.replace(/\.\w+$/, '') + '.png';
      const {source} = document.getElementById('file-n-submit').dataset;
      const error = content => document.dispatchEvent(new CustomEvent('CreateNotification', {
        bubbles: true,
        detail: {type: 'warning', content, lifetime: 20}
      }));
      var cb = function(e) {
        if (e) { this.removeEventListener('QRMetadata', cb, false); }
        const selected = document.getElementById('selected');
        if (!selected?.dataset.type) { return error('No file to edit.'); }
        if (!/^(image|video)\//.test(selected.dataset.type)) { return error('Not an image.'); }
        if (!selected.dataset.height) { return error('Metadata not available.'); }
        if (selected.dataset.height === 'loading') {
          selected.addEventListener('QRMetadata', cb, false);
          return;
        }
        if (Tegaki.bg) { Tegaki.destroy(); }
        FCX.oekakiName = name;
        Tegaki.open({
          onDone: FCX.oekakiCB,
          onCancel() { return Tegaki.bgColor = '#ffffff'; },
          width:  +selected.dataset.width,
          height: +selected.dataset.height,
          bgColor: 'transparent'
        });
        const canvas = document.createElement('canvas');
        canvas.width  = (canvas.naturalWidth  = +selected.dataset.width);
        canvas.height = (canvas.naturalHeight = +selected.dataset.height);
        canvas.hidden = true;
        document.body.appendChild(canvas);
        canvas.addEventListener('QRImageDrawn', function() {
          this.remove();
          return Tegaki.onOpenImageLoaded.call(this);
        }
        , false);
        return canvas.dispatchEvent(new CustomEvent('QRDrawFile', {bubbles: true}));
      };
      if (Tegaki.bg && (Tegaki.onDoneCb === FCX.oekakiCB) && (source === FCX.oekakiLatest)) {
        FCX.oekakiName = name;
        return Tegaki.resume();
      } else {
        return cb();
      }
    }));
  },

  toggle() {
    return QR.oekaki.load(() => QR.nodes.oekaki.hidden = !QR.nodes.oekaki.hidden);
  }
};
