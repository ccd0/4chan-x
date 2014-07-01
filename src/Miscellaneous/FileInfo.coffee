FileInfo =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['File Info Formatting']

    Post.callbacks.push
      name: 'File Info Formatting'
      cb:   @node
  node: ->
    return if !@file or @isClone
    @file.text.innerHTML = '<span class="file-info"></span>'
    FileInfo.format Conf['fileInfo'], @, @file.text.firstElementChild
  format: (formatString, post, outputNode) ->
    FileInfo.innerHTML = ''
    formatString.replace /%(.)|[^%]+/g, (s, c) ->
      if c of FileInfo.formatters
        FileInfo.formatters[c].call post
      else
        FileInfo.innerHTML += E s
      ''
    outputNode.innerHTML = FileInfo.innerHTML
  formatters:
    t: ->
      timestamp = @file.URL.match(/\d+\..+$/)[0]
      FileInfo.innerHTML += E timestamp
    T: ->
      FileInfo.innerHTML += "<a href='#{E @file.URL}' target='_blank'>"
      FileInfo.formatters.t.call @
      FileInfo.innerHTML += '</a>'
    l: ->
      FileInfo.innerHTML += "<a href='#{E @file.URL}' target='_blank'>"
      FileInfo.formatters.n.call @
      FileInfo.innerHTML += '</a>'
    L: ->
      FileInfo.innerHTML += "<a href='#{E @file.URL}' target='_blank'>"
      FileInfo.formatters.N.call @
      FileInfo.innerHTML += '</a>'
    n: ->
      fullname  = @file.name
      shortname = Build.shortFilename @file.name, @isReply
      if fullname is shortname
        FileInfo.innerHTML += E fullname
      else
        FileInfo.innerHTML += "<span class='fnswitch'><span class='fntrunc'>#{E shortname}</span><span class='fnfull'>#{E fullname}</span></span>"
    N: ->
      FileInfo.innerHTML += E @file.name
    p: ->
      if @file.isSpoiler
        FileInfo.innerHTML += 'Spoiler, '
    s: ->
      FileInfo.innerHTML += E @file.size
    B: ->
      sizeB = Math.round(@file.sizeInBytes)
      FileInfo.innerHTML += "#{+sizeB} Bytes"
    K: ->
      sizeKB = Math.round(@file.sizeInBytes/1024)
      FileInfo.innerHTML += "#{+sizeKB} KB"
    M: ->
      sizeMB = Math.round(@file.sizeInBytes/1048576*100)/100
      FileInfo.innerHTML += "#{+sizeMB} MB"
    r: ->
      dim = @file.dimensions or 'PDF'
      FileInfo.innerHTML += E dim
    '%': ->
      FileInfo.innerHTML += '%'
