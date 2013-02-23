QuoteInline =
  init: ->
    ExpandComment.callbacks.push @node
    Main.callbacks.push @node
    
  callbacks: []
  
  callback: (node) ->
    for callback in QuotePreview.callbacks
      callback node

  node: (post) ->
    for quote in post.quotes
      continue unless quote.hash and quote.hostname is 'boards.4chan.org' and !/catalog$/.test(quote.pathname) or /\bdeadlink\b/.test quote.className
      $.on quote, 'click', QuoteInline.toggle
      QuoteInline.qiQuote quote if Conf['Quote Hash Navigation'] and !post.isInlined
    for quote in post.backlinks
      $.on quote, 'click', QuoteInline.toggle
    return

  qiQuote: (quote) ->
    $.after quote, [
      $.tn(' ')
      $.el 'a',
        className:   'qiQuote'
        textContent: '#'
        href:        quote.href
    ]

  toggle: (e) ->
    return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
    e.preventDefault()
    id = @dataset.id or @hash[2..]
    if /\binlined\b/.test @className
      QuoteInline.rm @, id
    else
      return if $.x "ancestor::div[contains(@id,'p#{id}')]", @
      QuoteInline.add @, id
    $.toggleClass @, 'inlined'

  add: (q, id) ->
    if q.host is 'boards.4chan.org'
      path     = q.pathname.split '/'
      board    = path[1]
      threadID = path[3]
      postID   = id
    else
      board    = q.dataset.board
      threadID = 0
      postID   = q.dataset.id

    el = if board is g.BOARD then $.id "p#{postID}" else false

    inline = $.el 'div',
      id: "i#{postID}"
      className: if el then 'inline' else 'inline crosspost'

    root =
      if isBacklink = /\bbacklink\b/.test q.className
        q.parentNode
      else
        $.x 'ancestor-or-self::*[parent::blockquote][1]', q

    if Conf['Quote Hash Navigation'] and !isBacklink
      $.after root.nextElementSibling, inline
    else
      $.after root, inline

    Get.post board, threadID, postID, inline, QuoteInline.callback

    return unless el

    # Will only unhide if there's no inlined backlinks of it anymore.
    if isBacklink and Conf['Forward Hiding']
      $.addClass el.parentNode, 'forwarded'
      ++el.dataset.forwarded or el.dataset.forwarded = 1

    # Decrease the unread count if this post is in the array of unread reply.
    if (i = Unread.replies.indexOf el) isnt -1
      Unread.replies.splice i, 1
      Unread.update true

    if Conf['Color user IDs'] and ['b', 'q', 'soc'].contains board
      setTimeout -> $.rmClass $('.reply.highlight', inline), 'highlight'

  rm: (q, id) ->
    # select the corresponding inlined quote or loading quote
    div = $.x "following::div[@id='i#{id}']", q
    $.rm div
    return unless Conf['Forward Hiding']
    for inlined in $$ '.backlink.inlined', div
      div = $.id inlined.hash[1..]
      $.rmClass div.parentNode, 'forwarded' unless --div.dataset.forwarded
    if /\bbacklink\b/.test q.className
      div = $.id "p#{id}"
      $.rmClass div.parentNode, 'forwarded' unless --div.dataset.forwarded