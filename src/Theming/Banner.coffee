Banner =
  init: ->
    $.asap (-> d.body), ->
      $.asap (-> $ '.abovePostForm'), Banner.ready

  ready: ->
    banner = $ ".boardBanner"
    title = $.el "div",
      id: "boardTitle"
    children = banner.children
    i = children.length
    nodes = []
    while i--
      child = children[i]
      if child.tagName.toLowerCase() is "img"
        child.id = "Banner"
        $.on child, 'click', Banner.cb.toggle
        continue

      if Conf['Custom Board Titles']
        Banner.custom child

      nodes.push child

    $.add title, nodes.reverse()
    $.after banner, title
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
      if e.shiftKey
        @contentEditable = true

    keydown: (e) ->
      e.stopPropagation()

    focus: ->
      string = "#{g.BOARD}.#{@className}"
      items = 
        title: @innerHTML
      items["#{string}"]      = ''
      items["#{string}.orig"] = false

      $.get items, (items) ->
        unless items["#{string}.orig"] and items.title is items["#{string}"]
          $.set "#{string}.orig", items.title
      @textContent = @innerHTML

    blur: ->
      $.set "#{g.BOARD}.#{@className}",           @textContent
      @innerHTML = @textContent
      @contentEditable = false

  custom: (child) ->
    cachedTest = child.innerHTML

    $.get "#{g.BOARD}.#{child.className}", cachedTest, (item) ->
      return unless title = item["#{g.BOARD}.#{child.className}"]
      if Conf['Persistent Custom Board Titles']
        child.innerHTML = title
      else
        $.get "#{g.BOARD}.#{child.className}.orig", cachedTest, (itemb) ->
          if cachedTest is itemb["#{g.BOARD}.#{child.className}.orig"]
            child.innerHTML = title
          else
            $.set "#{g.BOARD}.#{child.className}",      cachedTest
            $.set "#{g.BOARD}.#{child.className}.orig", cachedTest

    $.on child, 'click',   Banner.cb.click
    $.on child, 'keydown', Banner.cb.keydown
    $.on child, 'focus',   Banner.cb.focus
    $.on child, 'blur',    Banner.cb.blur