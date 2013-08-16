Banner =
  init: ->
    $.asap (-> d.body), ->
      $.asap (-> $ '.abovePostForm'), Banner.ready

  ready: ->
    banner = $ ".boardBanner"
    {children} = banner

    i = 0
    while child = children[i++]
      if i is 1
        child.id = "Banner"
        child.title = "Click to change"
        $.on child, 'click', Banner.cb.toggle

        continue

      if Conf['Custom Board Titles']
        Banner.custom(child).title = "Ctrl+click to edit board #{if i is 3
          'sub'
        else
          ''}title"
        Banner.custom(child).spellcheck = false

    return

  cb:
    toggle: ->
      types =
        jpg: 227
        png: 270
        gif: 253

      type = Object.keys(types)[Math.floor 3 * Math.random()]
      num = Math.floor types[type] * Math.random()
      @src = "//static.4chan.org/image/title/#{num}.#{type}"
      
    click: (e) ->
      if e.ctrlKey
        @contentEditable = true
        @focus()

    keydown: (e) ->
      e.stopPropagation()
      return @blur() if !e.shiftKey and e.keyCode is 13

    focus: ->
      @textContent = @innerHTML

      string = "#{g.BOARD}.#{@className}"
      string2 = "#{string}.orig"

      items = {title: @innerHTML}
      items[string] = ''
      items[string2] = false

      $.get items, (items) ->
        unless items[string2] and items.title is items[string]
          $.set string2, items.title

      return

    blur: ->
      @innerHTML = @textContent
      @contentEditable = false
      $.set "#{g.BOARD}.#{@className}", @textContent

  custom: (child) ->
    cachedTest = child.innerHTML
    string = "#{g.BOARD}.#{child.className}"

    $.on child, 'click keydown focus blur', (e) -> Banner.cb[e.type].apply @, [e]

    $.get string, cachedTest, (item) ->
      return unless title = item[string]
      return child.innerHTML = title if Conf['Persistent Custom Board Titles']

      string2 = "#{string}.orig"

      $.get string2, cachedTest, (itemb) ->
       if cachedTest is itemb[string2]
          child.innerHTML = title
        else
          $.set string, cachedTest
          $.set string2, cachedTest

    child