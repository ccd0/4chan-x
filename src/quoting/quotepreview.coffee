QuotePreview =
  init: ->
    QuoteInline.callbacks.push @node
    ExpandComment.callbacks.push @node
    Main.callbacks.push @node

    $.ready -> $.add d.body, QuotePreview.el = $.el 'div',
      id: 'qp'
      className: 'reply dialog'
  
  callbacks: []
  
  callback: (node) ->
    for callback in QuotePreview.callbacks
      callback node
    return

  node: (post) ->
    for quote in post.quotes
      continue unless quote.hostname is 'boards.4chan.org' and quote.hash and !/catalog$/.test(quote.pathname) or /\bdeadlink\b/.test quote.className
      $.on quote, 'mouseover', QuotePreview.mouseover
    for quote in post.backlinks
      $.on quote, 'mouseover', QuotePreview.mouseover
    return

  mouseover: (e) ->
    return if UI.el or /\binlined\b/.test @className

    qp = QuotePreview.el

    # Make sure to remove the previous qp
    # in case it got stuck.
    if children = qp.children
      for child in children
        $.rm child

    if @host is 'boards.4chan.org'
      path     = @pathname.split '/'
      board    = path[1]
      threadID = path[3]
      postID   = @hash[2..]
    else
      board    = @dataset.board
      threadID = 0
      postID   = @dataset.id

    UI.el = qp
    UI.hover e

    Get.post board, threadID, postID, qp, (post) ->
      _conf = Conf
      Main.prettify post.blockquote
      post.isArchived = qp.className.contains 'archivedPost'
      QuotePreview.callback post

    $.on @, 'mousemove',      UI.hover
    $.on @, 'mouseout click', QuotePreview.mouseout

    _conf = Conf

    if _conf['Fappe Tyme']
      $.rmClass qp.firstElementChild, 'noFile'

    if el = $.id "p#{postID}"
      _conf = Conf
      if _conf['Quote Highlighting']
        if /\bop\b/.test el.className
          $.addClass el.parentNode, 'qphl'
        else
          $.addClass el, 'qphl'

      quoterID = $.x('ancestor::*[@id][1]', @).id.match(/\d+$/)[0]
      for quote in $$ '.quotelink, .backlink', qp
        if quote.hash[2..] is quoterID
          $.addClass quote, 'forwardlink'
    return

  mouseout: (e) ->
    delete UI.el
    $.rm QuotePreview.el.firstChild
    if (hash = @hash) and el = $.id hash[1..]
      $.rmClass el.parentNode, 'qphl' # op
      $.rmClass el,            'qphl' # reply

    $.off @, 'mousemove',      UI.hover
    $.off @, 'mouseout click', QuotePreview.mouseout