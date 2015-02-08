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

    children[0].title = "Click to change"
    $.on children[0], 'click', Banner.cb.toggle

    if Conf['Custom Board Titles']
      Banner.custom children[1]
      Banner.custom children[2] if children[2]

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
      return unless (e.ctrlKey or e.metaKey) and @className in ['boardTitle', 'boardSubtitle']

      unless Banner.original[@className]
        Banner.original[@className] = @cloneNode true
        $.set "#{g.BOARD}.#{@className}.orig", @textContent

      @contentEditable = true
      $.replace br, $.tn('\n') for br in $$ 'br', @
      @focus()

    keydown: (e) ->
      e.stopPropagation()
      return @blur() if !e.shiftKey and e.keyCode is 13

    blur: ->
      return unless @className in ['boardTitle', 'boardSubtitle']

      if @textContent
        @contentEditable = false
        $.set "#{g.BOARD}.#{@className}", @textContent
      else
        $.rmAll @
        $.add @, [Banner.original[@className].cloneNode(true).childNodes...]
        $.delete "#{g.BOARD}.#{@className}"

  original: {}

  custom: (child) ->
    {className} = child
    return unless className in ['boardTitle', 'boardSubtitle']

    child.title = "Ctrl/\u2318+click to edit board #{className[5..].toLowerCase()}"
    child.spellcheck = false

    for event in ['click', 'keydown', 'blur']
      $.on child, event, Banner.cb[event]

    cachedTest = child.textContent
    string = "#{g.BOARD}.#{className}"

    $.get string, '', (item) ->
      return unless title = item[string]
      Banner.original[className] ?= child.cloneNode true
      return child.textContent = title if Conf['Persistent Custom Board Titles']

      string2 = "#{string}.orig"

      $.get string2, cachedTest, (itemb) ->
       if cachedTest is itemb[string2]
          child.textContent = title
        else
          $.delete string
          $.set string2, cachedTest
