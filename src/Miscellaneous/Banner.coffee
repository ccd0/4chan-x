Banner =
  init: ->
    $.asap (-> d.body), ->
      $.asap (-> $ '.abovePostForm'), Banner.ready

  ready: ->
    banner = $ ".boardBanner"
    if Conf['Custom Board Titles']
      btitle = $ ".boardTitle", banner
      subtitle = $ ".boardSubtitle", banner
      btitle.title = "Ctrl+click to edit board title"
      subtitle.title = "Ctrl+click to edit board subtitle"
    {children} = banner
    i = 0
    while child = children[i++]
      if child.tagName.toLowerCase() is "img"
        child.id = "Banner"
        child.title = "Click to change"
        $.on child, 'click', Banner.cb.toggle
        continue

      if Conf['Custom Board Titles']
        Banner.custom child

    return

  types:
    jpg: 227
    png: 270
    gif: 253

  cb:
    toggle: ->
      type = ['jpg', 'png', 'gif'][Math.floor 3 * Math.random()]
      num  = Math.floor Banner.types[type] * Math.random()
      @src = "//static.4chan.org/image/title/#{num}.#{type}"
      
    click: (e) ->
      if e.ctrlKey
        @contentEditable = true
        @spellcheck = false
        @focus()

    keydown: (e) ->
      e.stopPropagation()
      return @blur() if !e.shiftKey and e.keyCode is 13

    focus: ->
      string = "#{g.BOARD}.#{@className}"
      string2 = "#{string}.orig"
      items = 
        title: @innerHTML
      items[string]      = ''
      items[string2] = false

      $.get items, (items) ->
        unless items[string2] and items.title is items[string]
          $.set string2, items.title
      @textContent = @innerHTML

    blur: ->
      $.set "#{g.BOARD}.#{@className}",           @textContent
      @innerHTML = @textContent
      @contentEditable = false

  custom: (child) ->
    cachedTest = child.innerHTML
    string = "#{g.BOARD}.#{child.className}"
    string2 = "#{string}.orig"

    $.get string, cachedTest, (item) ->
      return unless title = item[string]
      if Conf['Persistent Custom Board Titles']
        child.innerHTML = title
      else
        $.get string2, cachedTest, (itemb) ->
          if cachedTest is itemb[string2]
            child.innerHTML = title
          else
            $.set string,      cachedTest
            $.set string2, cachedTest

    $.on child, 'click keydown focus blur', (e) -> Banner.cb[e.type].apply @, [e]