/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const NormalizeURL = {
  init() {
    if (!Conf['Normalize URL']) { return; }

    let pathname = location.pathname.split(/\/+/);
    if (g.SITE.software === 'yotsuba') {
      switch (g.VIEW) {
        case 'thread':
          pathname[2] = 'thread';
          pathname = pathname.slice(0, 4);
          break;
        case 'index':
          pathname = pathname.slice(0, 3);
          break;
      }
    }
    pathname = pathname.join('/');
    if (location.pathname !== pathname) {
      return history.replaceState(history.state, '', `${location.protocol}//${location.host}${pathname}${location.hash}`);
    }
  }
};
