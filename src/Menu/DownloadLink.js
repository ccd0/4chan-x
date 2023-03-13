/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const DownloadLink = {
  init() {
    if (!['index', 'thread'].includes(g.VIEW) || !Conf['Menu'] || !Conf['Download Link']) { return; }

    const a = $.el('a', {
      className: 'download-link',
      textContent: 'Download file'
    }
    );

    // Specifying the filename with the download attribute only works for same-origin links.
    $.on(a, 'click', ImageCommon.download);

    return Menu.menu.addEntry({
      el: a,
      order: 100,
      open({file}) {
        if (!file) { return false; }
        a.href     = file.url;
        a.download = file.name;
        return true;
      }
    });
  }
};
