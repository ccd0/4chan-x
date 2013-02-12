QuotePreview =
  init: ->
    Main.callbacks.push @node

    $.ready -> $.add d.body, QuotePreview.el = $.el 'div',
      id: 'qp'
      className: 'reply dialog'

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

    Get.post board, threadID, postID, qp, ->
      _conf = Conf
      bq = $ 'blockquote', qp
      Main.prettify bq
      post =
        el: qp
        blockquote: bq
        isArchived: qp.className.contains 'archivedPost'
      if img = $ 'img[data-md5]', qp
        post.fileInfo = img.parentNode.previousElementSibling
        post.img      = img
      if _conf['Reveal Spoilers']
        RevealSpoilers.node post
      if _conf['Time Formatting']
        Time.node           post
      if _conf['File Info Formatting']
        FileInfo.node       post
      if _conf['Linkify']
        Linkify.node        post
      if _conf['Resurrect Quotes']
        Quotify.node        post
      if _conf['Anonymize']
        Anonymize.node      post
      if _conf['Replace GIF'] or _conf['Replace PNG'] or _conf['Replace JPG']
        ImageReplace.node   post
      if _conf['Color user IDs'] and ['b', 'q', 'soc'].contains board
        IDColor.node        post
      if _conf['RemoveSpoilers']
        RemoveSpoilers.node post

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

  mouseout: (e) ->
    delete UI.el
    $.rm QuotePreview.el.firstChild
    if (hash = @hash) and el = $.id hash[1..]
      $.rmClass el.parentNode, 'qphl' # op
      $.rmClass el,            'qphl' # reply

    $.off @, 'mousemove',      UI.hover
    $.off @, 'mouseout click', QuotePreview.mouseout

QuoteOP =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    return if post.isInlined and not post.isCrosspost
    for quote in post.quotes
      if quote.hash[2..] is post.threadID
        # \u00A0 is nbsp
        $.add quote, $.tn '\u00A0(OP)'
    return