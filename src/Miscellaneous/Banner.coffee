Banner =
  init: ->
    $.asap (-> d.body), ->
      $.asap (-> $ 'hr'), Banner.ready

  ready: ->
    banner = $ ".boardBanner"
    {children} = banner

    i = 0
    while child = children[i++]
      if i is 1
        child.title = "Click to change"
        $.on child, 'click', Banner.cb.toggle

        continue

      if Conf['Custom Board Titles']
        Banner.custom(child).title = "Ctrl+click to edit board #{if i is 3
          'sub'
        else
          ''}title"
        child.spellcheck = false

    return

  cb:
    toggle: do ->
      types =
        jpg: 227
        png: 270
        gif: 253

      ->
        type = Object.keys(types)[Math.floor 3 * Math.random()]
        num = Math.floor types[type] * Math.random()
        $('img', @parentNode).src = "//s.4cdn.org/image/title/#{num}.#{type}"
      
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
