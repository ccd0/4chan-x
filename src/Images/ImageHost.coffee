/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var ImageHost = {
  init() {
    if ((!(this.useFaster = /\S/.test(Conf['fourchanImageHost']))) || (g.SITE.software !== 'yotsuba') || !['index', 'thread'].includes(g.VIEW)) { return; }
    return Callbacks.Post.push({
      name: 'Image Host Rewriting',
      cb:   this.node
    });
  },

  suggestions: ['i.4cdn.org', 'is2.4chan.org'],

  host() {
    return Conf['fourchanImageHost'].trim() || 'i.4cdn.org';
  },
  flashHost() {
    return 'i.4cdn.org';
  },
  thumbHost() {
    return 'i.4cdn.org';
  },
  test(hostname) {
    return (hostname === 'i.4cdn.org') || ImageHost.regex.test(hostname);
  },

  regex: /^is\d*\.4chan(?:nel)?\.org$/,

  node() {
    if (this.isClone) { return; }
    const host = ImageHost.host();
    if (this.file && ImageHost.test(this.file.url.split('/')[2]) && !/\.swf$/.test(this.file.url)) {
      this.file.link.hostname = host;
      if (this.file.thumbLink) { this.file.thumbLink.hostname = host; }
      this.file.url = this.file.link.href;
    }
    return ImageHost.fixLinks($$('a', this.nodes.comment));
  },

  fixLinks(links) {
    for (var link of links) {
      if (ImageHost.test(link.hostname) && !/\.swf$/.test(link.pathname)) {
        var host = ImageHost.host();
        if (link.hostname !== host) { link.hostname = host; }
      }
    }
  }
};
