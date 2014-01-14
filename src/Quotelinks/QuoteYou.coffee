QuoteYou =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Mark Quotes of You']

    if Conf['Highlight Own Posts']
      $.addClass doc, 'highlight-own'

    if Conf['Highlight Posts Quoting You']
      $.addClass doc, 'highlight-you'

    if Conf['Comment Expansion']
      ExpandComment.callbacks.push @node

    # \u00A0 is nbsp
    @text = '\u00A0(You)'
    Post.callbacks.push
      name: 'Mark Quotes of You'
      cb:   @node

  node: ->
    return if @isClone

    if QR.db.get {boardID: @board.ID, threadID: @thread.ID, postID: @ID}
      $.addClass @nodes.root, 'yourPost'

    # Stop there if there's no quotes in that post.
    return unless @quotes.length

    for quotelink in @nodes.quotelinks when QR.db.get Get.postDataFromLink quotelink
        $.add quotelink, $.tn QuoteYou.text
        $.addClass quotelink, 'you'
        $.addClass @nodes.root, 'quotesYou'
    return

  cb:
    seek: (type) ->
      return unless Conf['Mark Quotes of You']
      $.rmClass highlight, 'highlight' if highlight = $ '.highlight'

      unless QuoteYou.lastRead
        unless post = QuoteYou.lastRead = $ '.quotesYou'
          new Notice 'warning', 'No posts are currently quoting you, loser.', 20
          return
        return if QuoteYou.cb.scroll post
      else
        post = QuoteYou.lastRead

      str = "#{type}::div[contains(@class,'quotesYou')]"

      while post = (result = $.X(str, post)).snapshotItem(if type is 'preceding' then result.snapshotLength - 1 else 0)
        return if QuoteYou.cb.scroll post

      posts = $$ '.quotesYou'
      QuoteYou.cb.scroll posts[if type is 'following' then 0 else posts.length - 1]

    scroll: (post) ->
      if Get.postFromRoot(post).isHidden
        return false
      else
        QuoteYou.lastRead = post
        window.location = "##{post.id}"
        Header.scrollToPost post
        $.addClass $('.post', post), 'highlight'
        return true
