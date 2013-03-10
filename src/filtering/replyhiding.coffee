ReplyHiding =
  init: ->
    Main.callbacks.push @node

  node: (post) ->
    return if post.isInlined or post.ID is post.threadID
    side = $ '.sideArrows', post.root
    side.innerHTML = '<a href="javascript:;"><span>[ - ]</span></a>'
    $.on side.firstChild, 'click', ->
      ReplyHiding.toggle button = @parentNode, root = button.parentNode, id = root.id[2..]

    if post.ID of g.hiddenReplies
      ReplyHiding.hide post.root

  toggle: (button, root, id) ->
    quotes = $$ ".quotelink[href$='#p#{id}'], .backlink[href$='#p#{id}']"
    if /\bstub\b/.test button.className
      ReplyHiding.show root
      for quote in quotes
        $.rmClass quote, 'filtered'
      delete g.hiddenReplies[id]
    else
      ReplyHiding.hide root
      for quote in quotes
        $.addClass quote, 'filtered'
      g.hiddenReplies[id] = Date.now()
    $.set "hiddenReplies/#{g.BOARD}/", g.hiddenReplies

  hide: (root) ->
    post = $ '.post', root
    return if post.hidden # already hidden once by the filter
    post.hidden = true

    $.addClass root, 'hidden'

    return unless Conf['Show Stubs']

    stub = $.el 'div',
      className: 'stub'
      innerHTML: "<a href='javascript:;' id='show#{id = root.id[2..]}'>#{if Conf['Anonymize'] then 'Anonymous' else $('.desktop > .nameBlock', root).textContent} <span>[ + ]</span> </a>"
    a = stub.firstChild
    $.on  a, 'click', ->
      ReplyHiding.toggle button = @parentNode, root = $.id("pc#{@id[4..]}"), id

    if Conf['Menu']
      menuButton = Menu.a.cloneNode true
      $.on menuButton, 'click', Menu.toggle
      $.add stub, [$.tn(' '), menuButton]

    $.prepend root, stub

  show: (root) ->
    $.rm stub if (stub = $ '.stub', root)

    post = $ '.post', root
    post.hidden = false

    $.rmClass root, 'hidden'

  unhide: (post) ->
    ReplyHiding.show post.root if post.el.hidden
