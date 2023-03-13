/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var FileInfo = {
  init() {
    if (!['index', 'thread', 'archive'].includes(g.VIEW) || !Conf['File Info Formatting']) { return; }

    return Callbacks.Post.push({
      name: 'File Info Formatting',
      cb:   this.node
    });
  },

  node() {
    if (!this.file) { return; }
    if (this.isClone) {
      let a;
      for (a of $$('.file-info .download-button', this.file.text)) {
        $.on(a, 'click', ImageCommon.download);
      }
      for (a of $$('.file-info .quick-filter-md5', this.file.text)) {
        $.on(a, 'click', Filter.quickFilterMD5);
      }
      return;
    }

    const oldInfo = $.el('span', {className: 'fileText-original'});
    $.prepend(this.file.link.parentNode, oldInfo);
    $.add(oldInfo, [this.file.link.previousSibling, this.file.link, this.file.link.nextSibling]);

    const info = $.el('span', {className: 'file-info'});
    FileInfo.format(Conf['fileInfo'], this, info);
    return $.prepend(this.file.text, info);
  },

  format(formatString, post, outputNode) {
    let a;
    const output = [];
    formatString.replace(/%(.)|[^%]+/g, function(s, c) {
      output.push($.hasOwn(FileInfo.formatters, c) ?
        FileInfo.formatters[c].call(post)
      :
        {innerHTML: E(s)}
      );
      return '';
    });
    $.extend(outputNode, {innerHTML: E.cat(output)});
    for (a of $$('.download-button', outputNode)) {
      $.on(a, 'click', ImageCommon.download);
    }
    for (a of $$('.quick-filter-md5', outputNode)) {
      $.on(a, 'click', Filter.quickFilterMD5);
    }
  },

  formatters: {
    t() { return {innerHTML: E(this.file.url.match(/[^/]*$/)[0])}; },
    T() { return {innerHTML: "<a href=\"" + E(this.file.url) + "\" target=\"_blank\">" + (FileInfo.formatters.t.call(this)).innerHTML + "</a>"}; },
    l() { return {innerHTML: "<a href=\"" + E(this.file.url) + "\" target=\"_blank\">" + (FileInfo.formatters.n.call(this)).innerHTML + "</a>"}; },
    L() { return {innerHTML: "<a href=\"" + E(this.file.url) + "\" target=\"_blank\">" + (FileInfo.formatters.N.call(this)).innerHTML + "</a>"}; },
    n() {
      const fullname  = this.file.name;
      const shortname = SW.yotsuba.Build.shortFilename(this.file.name, this.isReply);
      if (fullname === shortname) {
        return {innerHTML: E(fullname)};
      } else {
        return {innerHTML: "<span class=\"fnswitch\"><span class=\"fntrunc\">" + E(shortname) + "</span><span class=\"fnfull\">" + E(fullname) + "</span></span>"};
      }
    },
    N() { return {innerHTML: E(this.file.name)}; },
    d() { return {innerHTML: "<a href=\"" + E(this.file.url) + "\" download=\"" + E(this.file.name) + "\" class=\"fa fa-download download-button\"></a>"}; },
    f() { return {innerHTML: "<a href=\"javascript:;\" class=\"fa fa-times quick-filter-md5\"></a>"}; },
    p() { return {innerHTML: ((this.file.isSpoiler) ? "Spoiler, " : "")}; },
    s() { return {innerHTML: E(this.file.size)}; },
    B() { return {innerHTML: E(Math.round(this.file.sizeInBytes)) + " Bytes"}; },
    K() { return {innerHTML: E(Math.round(this.file.sizeInBytes/1024)) + " KB"}; },
    M() { return {innerHTML: E(Math.round(this.file.sizeInBytes/1048576*100)/100) + " MB"}; },
    r() { return {innerHTML: E(this.file.dimensions || "PDF")}; },
    g() { return {innerHTML: ((this.file.tag) ? ", " + E(this.file.tag) : "")}; },
    '%'() { return {innerHTML: "%"}; }
  }
};
