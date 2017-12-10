QuoteYou =
  init: ->
    return unless Conf['Remember Your Posts']

    @db = new DataBoard 'yourPosts'
    $.sync 'Remember Your Posts', (enabled) -> Conf['Remember Your Posts'] = enabled
    $.on d, 'QRPostSuccessful', (e) ->
      $.forceSync 'Remember Your Posts'
      if Conf['Remember Your Posts']
        {boardID, threadID, postID} = e.detail
        (QuoteYou.db.set {boardID, threadID, postID, val: true})

    return unless g.VIEW in ['index', 'thread', 'archive']

    if Conf['Highlight Own Posts']
      $.addClass doc, 'highlight-own'

    if Conf['Highlight Posts Quoting You']
      $.addClass doc, 'highlight-you'

    if Conf['Comment Expansion']
      ExpandComment.callbacks.push @node

    # \u00A0 is nbsp
    @mark = $.el 'span',
      textContent: '\u00A0(You)'
      className:   'qmark-you'
    Callbacks.Post.push
      name: 'Mark Quotes of You'
      cb:   @node

    QuoteYou.menu.init()

  isYou: (post) ->
    !!QuoteYou.db?.get {
      boardID:  post.board.ID
      threadID: post.thread.ID
      postID:   post.ID
    }

  node: ->
    return if @isClone

    if QuoteYou.isYou @
      $.addClass @nodes.root, 'yourPost'

    # Stop there if there's no quotes in that post.
    return unless @quotes.length

    for quotelink in @nodes.quotelinks when QuoteYou.db.get Get.postDataFromLink quotelink
        $.add quotelink, QuoteYou.mark.cloneNode(true) if Conf['Mark Quotes of You']
        $.addClass quotelink, 'you'
        $.addClass @nodes.root, 'quotesYou'
    return

  menu:
    init: ->
      label = $.el 'label',
        className: 'toggle-you'
      ,
        <%= html('<input type="checkbox"> You') %>
      input = $ 'input', label
      $.on input, 'change', QuoteYou.menu.toggle
      Menu.menu?.addEntry
        el: label
        order: 80
        open: (post) ->
          QuoteYou.menu.post = (post.origin or post)
          input.checked = QuoteYou.isYou post
          true

    toggle: ->
      {post} = QuoteYou.menu
      data = {boardID: post.board.ID, threadID: post.thread.ID, postID: post.ID, val: true}
      if @checked
        QuoteYou.db.set data
      else
        QuoteYou.db.delete data
      for clone in [post].concat post.clones
        clone.nodes.root.classList.toggle 'yourPost', @checked
      for quotelink in Get.allQuotelinksLinkingTo post
        if @checked
          $.add quotelink, QuoteYou.mark.cloneNode(true) if Conf['Mark Quotes of You']
        else
          $.rm $('.qmark-you', quotelink)
        quotelink.classList.toggle 'you', @checked
        if $.hasClass quotelink, 'quotelink'
          quoter = Get.postFromNode(quotelink).nodes.root
          quoter.classList.toggle 'quotesYou', !!$('.quotelink.you', quoter)
      return

  cb:
    seek: (type) ->
      $.rmClass highlight, 'highlight' if highlight = $ '.highlight'

      unless QuoteYou.lastRead and doc.contains(QuoteYou.lastRead) and $.hasClass(QuoteYou.lastRead, 'quotesYou')
        if not (post = QuoteYou.lastRead = $ '.quotesYou')
          new Notice 'warning', 'No posts are currently quoting you, loser.', 20
          return
        return if QuoteYou.cb.scroll post
      else
        post = QuoteYou.lastRead

      str = "#{type}::div[contains(@class,'quotesYou')]"

      while (post = (result = $.X(str, post)).snapshotItem(if type is 'preceding' then result.snapshotLength - 1 else 0))
        return if QuoteYou.cb.scroll post

      posts = $$ '.quotesYou'
      QuoteYou.cb.scroll posts[if type is 'following' then 0 else posts.length - 1]

    scroll: (root) ->
      post = $ '.post', root
      if !post.getBoundingClientRect().height
        return false
      else
        QuoteYou.lastRead = root
        location.href = "##{post.id}"
        Header.scrollTo post
        $.addClass post, 'highlight'
        return true
