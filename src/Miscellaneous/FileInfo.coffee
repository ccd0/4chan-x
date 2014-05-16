FileInfo =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['File Info Formatting']

    Post.callbacks.push
      name: 'File Info Formatting'
      cb:   @node
  node: ->
    return if !@file or @isClone
    @file.text.innerHTML = "<span class='file-info'>#{FileInfo.h_format Conf['fileInfo'], @}</span>"
  h_format: (formatString, post) ->
    formatString.replace /%([A-Za-z])|[^%]+/g, (s, c) ->
      if c of FileInfo.h_formatters
        FileInfo.h_formatters[c].call(post)
      else
        Build.h_escape s
  h_formatters:
    t: -> Build.h_escape @file.URL.match(/\d+\..+$/)[0]
    T: -> "<a href='#{Build.h_escape @file.URL}' target='_blank'>#{FileInfo.h_formatters.t.call @}</a>"
    l: -> "<a href='#{Build.h_escape @file.URL}' target='_blank'>#{FileInfo.h_formatters.n.call @}</a>"
    L: -> "<a href='#{Build.h_escape @file.URL}' target='_blank'>#{FileInfo.h_formatters.N.call @}</a>"
    n: ->
      fullname  = @file.name
      shortname = Build.shortFilename @file.name, @isReply
      if fullname is shortname
        Build.h_escape fullname
      else
        "<span class='fntrunc'>#{Build.h_escape shortname}</span><span class='fnfull'>#{Build.h_escape fullname}</span>"
    N: -> Build.h_escape @file.name
    p: -> if @file.isSpoiler then 'Spoiler, ' else ''
    s: -> Build.h_escape @file.size
    B: -> return "#{+@file.sizeInBytes} Bytes"
    K: -> "#{+Math.round(@file.sizeInBytes/1024)} KB"
    M: -> "#{+Math.round(@file.sizeInBytes/1048576*100)/100} MB"
    r: -> Build.h_escape (@file.dimensions or 'PDF')
