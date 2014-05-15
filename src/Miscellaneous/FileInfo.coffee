FileInfo =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['File Info Formatting']

    Post.callbacks.push
      name: 'File Info Formatting'
      cb:   @node
  node: ->
    return if !@file or @isClone
    @file.text.innerHTML = "<span class=file-info>#{FileInfo.format Conf['fileInfo'], @}</span>"
  format: (formatString, post) ->
    formatString.replace /%([A-Za-z])|[^%]+/g, (s, c) ->
      if c of FileInfo.formatters
        FileInfo.formatters[c].call(post)
      else
        Build.escape s
  convertUnit: (size, unit) ->
    if unit is 'B'
      return "#{size.toFixed()} Bytes"
    i = 1 + ['KB', 'MB'].indexOf unit
    size /= 1024 while i--
    size = if unit is 'MB'
      Math.round(size * 100) / 100
    else
      size.toFixed()
    "#{size} #{unit}"
  formatters:
    t: -> Build.escape @file.URL.match(/\d+\..+$/)[0]
    T: -> "<a href=#{Build.escape @file.URL} target=_blank>#{FileInfo.formatters.t.call @}</a>"
    l: -> "<a href=#{Build.escape @file.URL} target=_blank>#{FileInfo.formatters.n.call @}</a>"
    L: -> "<a href=#{Build.escape @file.URL} target=_blank>#{FileInfo.formatters.N.call @}</a>"
    n: ->
      fullname  = @file.name
      shortname = Build.shortFilename @file.name, @isReply
      if fullname is shortname
        Build.escape fullname
      else
        "<span class=fntrunc>#{Build.escape shortname}</span><span class=fnfull>#{Build.escape fullname}</span>"
    N: -> Build.escape @file.name
    p: -> if @file.isSpoiler then 'Spoiler, ' else ''
    s: -> Build.escape @file.size
    B: -> FileInfo.convertUnit @file.sizeInBytes, 'B'
    K: -> FileInfo.convertUnit @file.sizeInBytes, 'KB'
    M: -> FileInfo.convertUnit @file.sizeInBytes, 'MB'
    r: -> Build.escape (@file.dimensions or 'PDF')
