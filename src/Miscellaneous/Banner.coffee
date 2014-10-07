Banner =
  init: ->
    $.asap (-> d.body), ->
      $.asap (-> $ 'hr'), Banner.ready

  ready: ->
    banner = $ ".boardBanner"
    {children} = banner

    if g.BOARD.ID isnt 'f' and g.VIEW is 'thread' and Conf['Remove Thread Excerpt']
      Banner.setTitle children[1].textContent

    for child, i in children
      if i is 0
        $.rm child
        img = $.el 'img',
          alt:   '4chan'
          title: 'Click to change'

        $.on img, 'click error', Banner.cb.toggle
        Banner.cb.toggle.call img

        $.prepend banner, img

        continue

      if Conf['Custom Board Titles']
        Banner.custom(child).title = "Ctrl+click to edit board #{if i is 3
          'sub'
        else
          ''}title"
        child.spellcheck = false

    return

  setTitle: (title) ->
    if Unread.title?
      Unread.title = title
      Unread.update()
    else
      d.title = title

  cb:
    toggle: do ->
      types =
        jpg: 227
        png: 270
        gif: 253

      ->
        type = Object.keys(types)[Math.floor 3 * Math.random()]
        num = Math.floor types[type] * Math.random()
        @src = "//s.4cdn.org/image/title/#{num}.#{type}"
      
    click: (e) ->
      if e.ctrlKey
        @contentEditable = true
        @focus()

    keydown: (e) ->
      e.stopPropagation()
      return @blur() if !e.shiftKey and e.keyCode is 13

    focus: ->
      string = "#{g.BOARD}.#{@className}"
      string2 = "#{string}.orig"

      items = {title: @textContent}
      items[string] = ''
      items[string2] = false

      $.get items, (items) ->
        unless items[string2] and items.title is items[string]
          $.set string2, items.title

      return

    blur: ->
      @contentEditable = false
      $.set "#{g.BOARD}.#{@className}", @textContent

  custom: (child) ->
    cachedTest = child.textContent
    string = "#{g.BOARD}.#{child.className}"

    $.on child, 'click keydown focus blur', (e) -> Banner.cb[e.type].apply @, [e]

    $.get string, cachedTest, (item) ->
      return unless title = item[string]
      return child.textContent = title if Conf['Persistent Custom Board Titles']

      string2 = "#{string}.orig"

      $.get string2, cachedTest, (itemb) ->
       if cachedTest is itemb[string2]
          child.textContent = title
        else
          $.set string, cachedTest
          $.set string2, cachedTest

    child
