FileInfo =
  init: ->
    return if g.VIEW not in ['index', 'thread', 'archive'] or !Conf['File Info Formatting']

    Callbacks.Post.push
      name: 'File Info Formatting'
      cb:   @node

  node: ->
    return unless @file
    if @isClone
      for a in $$ '.file-info .download-button', @file.text
        $.on a, 'click', ImageCommon.download
      for a in $$ '.file-info .quick-filter-md5', @file.text
        $.on a, 'click', Filter.quickFilterMD5
      return

    oldInfo = $.el 'span', {className: 'fileText-original'}
    $.prepend @file.link.parentNode, oldInfo
    $.add oldInfo, [@file.link.previousSibling, @file.link, @file.link.nextSibling]

    info = $.el 'span', {className: 'file-info'}
    FileInfo.format Conf['fileInfo'], @, info
    $.prepend @file.text, info

  format: (formatString, post, outputNode) ->
    output = []
    formatString.replace /%(.)|[^%]+/g, (s, c) ->
      output.push if $.hasOwn(FileInfo.formatters, c)
        FileInfo.formatters[c].call post
      else
        `{innerHTML: E(s)}`
      ''
    $.extend outputNode, `{innerHTML: E.cat(output)}`
    for a in $$ '.download-button', outputNode
      $.on a, 'click', ImageCommon.download
    for a in $$ '.quick-filter-md5', outputNode
      $.on a, 'click', Filter.quickFilterMD5
    return

  formatters:
    t: -> `{innerHTML: E(this.file.url.match(/[^/]*$/)[0])}`
    T: -> `{innerHTML: "<a href=\"" + E(this.file.url) + "\" target=\"_blank\">" + (FileInfo.formatters.t.call(this)).innerHTML + "</a>"}`
    l: -> `{innerHTML: "<a href=\"" + E(this.file.url) + "\" target=\"_blank\">" + (FileInfo.formatters.n.call(this)).innerHTML + "</a>"}`
    L: -> `{innerHTML: "<a href=\"" + E(this.file.url) + "\" target=\"_blank\">" + (FileInfo.formatters.N.call(this)).innerHTML + "</a>"}`
    n: ->
      fullname  = @file.name
      shortname = SW.yotsuba.Build.shortFilename @file.name, @isReply
      if fullname is shortname
        `{innerHTML: E(fullname)}`
      else
        `{innerHTML: "<span class=\"fnswitch\"><span class=\"fntrunc\">" + E(shortname) + "</span><span class=\"fnfull\">" + E(fullname) + "</span></span>"}`
    N: -> `{innerHTML: E(this.file.name)}`
    d: -> `{innerHTML: "<a href=\"" + E(this.file.url) + "\" download=\"" + E(this.file.name) + "\" class=\"fa fa-download download-button\"></a>"}`
    f: -> `{innerHTML: "<a href=\"javascript:;\" class=\"fa fa-times quick-filter-md5\"></a>"}`
    p: -> `{innerHTML: ((this.file.isSpoiler) ? "Spoiler, " : "")}`
    s: -> `{innerHTML: E(this.file.size)}`
    B: -> `{innerHTML: E(Math.round(this.file.sizeInBytes)) + " Bytes"}`
    K: -> `{innerHTML: E(Math.round(this.file.sizeInBytes/1024)) + " KB"}`
    M: -> `{innerHTML: E(Math.round(this.file.sizeInBytes/1048576*100)/100) + " MB"}`
    r: -> `{innerHTML: E(this.file.dimensions || "PDF")}`
    g: -> `{innerHTML: ((this.file.tag) ? ", " + E(this.file.tag) : "")}`
    '%': -> `{innerHTML: "%"}`
