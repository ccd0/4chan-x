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

  hide: (root, show_stub=Conf['Show Stubs']) ->
    hide = $ '.sideArrows', root
    return if hide.hidden # already hidden once by the filter
    hide.hidden = true
    root.hidden = true

    $.addClass root, 'hidden'

    return unless show_stub

    stub = $.el 'div',
      className: 'stub'
      innerHTML: "<a href='javascript:;' id='show#{id = root.id[2..]}'><span>[ + ]</span> </a>"
    a = stub.firstChild
    $.on  a, 'click', ->
      ReplyHiding.toggle button = @parentNode, root = $.id("pc#{@id[4..]}"), id
    $.add a, $.tn if Conf['Anonymize'] then 'Anonymous' else $('.desktop > .nameBlock', root).textContent
    if Conf['Menu']
      menuButton = Menu.a.cloneNode true
      $.on menuButton, 'click', Menu.toggle
      $.add stub, [$.tn(' '), menuButton]
    $.before root, stub

  show: (root) ->
    if stub = root.previousElementSibling
      $.rm stub if stub.className is 'stub'
    ($ '.sideArrows', root).hidden = false
    root.hidden = false

    $.rmClass root, 'hidden'