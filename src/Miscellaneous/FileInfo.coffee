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
        `<%= html('${s}') %>`
      ''
    $.extend outputNode, `<%= html('@{output}') %>`
    for a in $$ '.download-button', outputNode
      $.on a, 'click', ImageCommon.download
    for a in $$ '.quick-filter-md5', outputNode
      $.on a, 'click', Filter.quickFilterMD5
    return

  formatters:
    t: -> `<%= html('${this.file.url.match(/[^\/]*$/)[0]}') %>`
    T: -> `<%= html('<a href="${this.file.url}" target="_blank">&{FileInfo.formatters.t.call(this)}</a>') %>`
    l: -> `<%= html('<a href="${this.file.url}" target="_blank">&{FileInfo.formatters.n.call(this)}</a>') %>`
    L: -> `<%= html('<a href="${this.file.url}" target="_blank">&{FileInfo.formatters.N.call(this)}</a>') %>`
    n: ->
      fullname  = @file.name
      shortname = g.SITE.Build.shortFilename @file.name, @isReply
      if fullname is shortname
        `<%= html('${fullname}') %>`
      else
        `<%= html('<span class="fnswitch"><span class="fntrunc">${shortname}</span><span class="fnfull">${fullname}</span></span>') %>`
    N: -> `<%= html('${this.file.name}') %>`
    d: -> `<%= html('<a href="${this.file.url}" download="${this.file.name}" class="download-button fourchan-x--icon">&{Icons.download}</a>') %>`
    f: -> `<%= html('<a href="javascript:;" class="quick-filter-md5 fourchan-x--icon">&{Icons.close}</a>') %>`
    p: -> `<%= html('?{this.file.isSpoiler}{Spoiler, }') %>`
    s: -> `<%= html('${this.file.size}') %>`
    B: -> `<%= html('${Math.round(this.file.sizeInBytes)} Bytes') %>`
    K: -> `<%= html('${Math.round(this.file.sizeInBytes/1024)} KB') %>`
    M: -> `<%= html('${Math.round(this.file.sizeInBytes/1048576*100)/100} MB') %>`
    r: -> `<%= html('${this.file.dimensions || "PDF"}') %>`
    g: -> `<%= html('?{this.file.tag}{, ${this.file.tag}}{}') %>`
    '%': -> `<%= html('%') %>`
