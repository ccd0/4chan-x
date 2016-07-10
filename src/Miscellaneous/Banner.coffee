Banner =
  banners: `<%= JSON.stringify(readJSON('banners.json')) %>`

  init: ->
    if Conf['Custom Board Titles']
      @db = new DataBoard 'customTitles', null, true

    $.asap (-> d.body), ->
      $.asap (-> $ 'hr'), Banner.ready

    # Let 4chan's JS load the banner if enabled; otherwise, load it ourselves.
    if g.BOARD.ID isnt 'f'
      Main.ready -> $.queueTask Banner.load

  ready: ->
    banner = $ ".boardBanner"
    {children} = banner

    if g.VIEW is 'thread' and Conf['Remove Thread Excerpt']
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
      return unless (e.ctrlKey or e.metaKey)
      Banner.original[@className] ?= @cloneNode true
      @contentEditable = true
      $.replace br, $.tn('\n') for br in $$ 'br', @
      @focus()

    keydown: (e) ->
      e.stopPropagation()
      return @blur() if !e.shiftKey and e.keyCode is 13

    blur: ->
      $.replace br, $.tn('\n') for br in $$ 'br', @
      if @textContent = @textContent.replace /\n*$/, ''
        @contentEditable = false
        Banner.db.set
          boardID:  g.BOARD.ID
          threadID: @className
          val:
            title: @textContent
            orig:  Banner.original[@className].textContent
      else
        $.rmAll @
        $.add @, [Banner.original[@className].cloneNode(true).childNodes...]
        Banner.db.delete
          boardID:  g.BOARD.ID
          threadID: @className

  original: {}

  custom: (child) ->
    {className} = child
    child.title = "Ctrl/\u2318+click to edit board #{className[5..].toLowerCase()}"
    child.spellcheck = false

    for event in ['click', 'keydown', 'blur']
      $.on child, event, Banner.cb[event]

    if data = Banner.db.get {boardID: g.BOARD.ID, threadID: className}
      if Conf['Persistent Custom Board Titles'] or data.orig is child.textContent
        Banner.original[className] = child.cloneNode true
        child.textContent = data.title
      else
        Banner.db.delete {boardID: g.BOARD.ID, threadID: className}

return Banner
