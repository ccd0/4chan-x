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
    output = innerHTML: ''
    formatString.replace /%([A-Za-z])|[^%]+/g, (s, c) ->
      if c of FileInfo.formatters
        FileInfo.formatters[c].call post, output
      else
        output.innerHTML += E s
      ''
    outputNode.innerHTML = output.innerHTML
  formatters:
    t: (x) ->
      timestamp = @file.URL.match(/\d+\..+$/)[0]
      x.innerHTML += E timestamp
    T: (x) ->
      x.innerHTML += "<a href='#{E @file.URL}' target='_blank'>"
      FileInfo.formatters.t.call @, x
      x.innerHTML += '</a>'
    l: (x) ->
      x.innerHTML += "<a href='#{E @file.URL}' target='_blank'>"
      FileInfo.formatters.n.call @, x
      x.innerHTML += '</a>'
    L: (x) ->
      x.innerHTML += "<a href='#{E @file.URL}' target='_blank'>"
      FileInfo.formatters.N.call @, x
      x.innerHTML += '</a>'
    n: (x) ->
      fullname  = @file.name
      shortname = Build.shortFilename @file.name, @isReply
      if fullname is shortname
        x.innerHTML += E fullname
      else
        x.innerHTML += "<span class='fnswitch'><span class='fntrunc'>#{E shortname}</span><span class='fnfull'>#{E fullname}</span></span>"
    N: (x) ->
      x.innerHTML += E @file.name
    p: (x) ->
      if @file.isSpoiler
        x.innerHTML += 'Spoiler, '
    s: (x) ->
      x.innerHTML += E @file.size
    B: (x) ->
      x.innerHTML += "#{+@file.sizeInBytes} Bytes"
    K: (x) ->
      sizeKB = Math.round(@file.sizeInBytes/1024)
      x.innerHTML += "#{+sizeKB} KB"
    M: (x) ->
      sizeMB = Math.round(@file.sizeInBytes/1048576*100)/100
      x.innerHTML += "#{+sizeMB} MB"
    r: (x) ->
      dim = @file.dimensions or 'PDF'
      x.innerHTML += E dim
