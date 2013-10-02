ExpandComment =
  init: ->
    return if g.VIEW isnt 'index' or !Conf['Comment Expansion']

    Post.callbacks.push
      name: 'Comment Expansion'
      cb:   @node
  node: ->
    if a = $ '.abbr > a:not([onclick])', @nodes.comment
      $.on a, 'click', ExpandComment.cb
  cb: (e) ->
    e.preventDefault()
    ExpandComment.expand Get.postFromNode @
  expand: (post) ->
    if post.nodes.longComment and !post.nodes.longComment.parentNode
      $.replace post.nodes.shortComment, post.nodes.longComment
      post.nodes.comment = post.nodes.longComment
      return
    return unless a = $ '.abbr > a', post.nodes.comment
    a.textContent = "Post No.#{post} Loading..."
    $.cache "//api.4chan.org#{a.pathname}.json", -> ExpandComment.parse @, a, post
  contract: (post) ->
    return unless post.nodes.shortComment
    a = $ '.abbr > a', post.nodes.shortComment
    a.textContent = 'here'
    $.replace post.nodes.longComment, post.nodes.shortComment
    post.nodes.comment = post.nodes.shortComment
  parse: (req, a, post) ->
    {status} = req
    if status not in [200, 304]
      a.textContent = "Error #{req.statusText} (#{status})"
      return

    posts = JSON.parse(req.response).posts
    if spoilerRange = posts[0].custom_spoiler
      Build.spoilerRange[g.BOARD] = spoilerRange

    for postObj in posts
      break if postObj.no is post.ID
    if postObj.no isnt post.ID
      a.textContent = "Post No.#{post} not found."
      return

    {comment} = post.nodes
    clone = comment.cloneNode false
    clone.innerHTML = postObj.com
    for quote in $$ '.quotelink', clone
      href = quote.getAttribute 'href'
      continue if href[0] is '/' # Cross-board quote, or board link
      quote.href = "/#{post.board}/res/#{href}" # Fix pathnames
    post.nodes.shortComment = comment
    $.replace comment, clone
    post.nodes.comment = post.nodes.longComment = clone
    post.parseComment()
    post.parseQuotes()
    if Conf['Resurrect Quotes']
      Quotify.node.call      post
    if Conf['Quote Previewing']
      QuotePreview.node.call post
    if Conf['Quote Inlining']
      QuoteInline.node.call  post
    if Conf['Mark OP Quotes']
      QuoteOP.node.call      post
    if Conf['Mark Cross-thread Quotes']
      QuoteCT.node.call      post
    if g.BOARD.ID is 'g'
      Fourchan.code.call     post
    if g.BOARD.ID is 'sci'
      Fourchan.math.call     post
    if Conf['Linkify']
      Linkify.node.call      post
