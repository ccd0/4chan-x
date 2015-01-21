Banner =
  banners: `<%= JSON.stringify(grunt.file.readJSON('src/Miscellaneous/banners.json')) %>`

  init: ->
    $.asap (-> d.body), ->
      $.asap (-> $ 'hr'), Banner.ready

    # Let 4chan's JS load the banner if enabled; otherwise, load it ourselves.
    if g.BOARD.ID isnt 'f'
      Main.ready -> $.queueTask Banner.load

  ready: ->
    banner = $ ".boardBanner"
    {children} = banner

    if g.BOARD.ID isnt 'f' and g.VIEW is 'thread' and Conf['Remove Thread Excerpt']
      Banner.setTitle children[1].textContent

    i = 0
    while child = children[i++]
      if i is 1
        child.title = "Click to change"
        $.on child, 'click', Banner.cb.toggle

        continue

      if Conf['Custom Board Titles']
        Banner.custom(child).title = "Ctrl/\u2318+click to edit board #{if i is 3
          'sub'
        else
          ''}title"
        child.spellcheck = false

    return

  load: ->
    bannerCnt = $.id 'bannerCnt'
    unless bannerCnt.firstChild
      img = $.el 'img',
        alt: '4chan'
        src: '//s.4cdn.org/image/title/' + bannerCnt.dataset.src
      $.add bannerCnt, img

  setTitle: (title) ->
    if Unread.title?
      Unread.title = title
      Unread.update()
    else
      d.title = title

  cb:
    toggle: ->
      unless Banner.choices?.length
        Banner.choices = Banner.banners.slice()
      i = Math.floor(Banner.choices.length * Math.random())
      banner = Banner.choices.splice i, 1
      $('img', @parentNode).src = "//s.4cdn.org/image/title/#{banner}"
      
    click: (e) ->
      if e.ctrlKey or e.metaKey
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
      return if title is cachedTest
      return child.textContent = title if Conf['Persistent Custom Board Titles']

      string2 = "#{string}.orig"

      $.get string2, cachedTest, (itemb) ->
       if cachedTest is itemb[string2]
          child.textContent = title
        else
          $.set string, cachedTest
          $.set string2, cachedTest

    child
