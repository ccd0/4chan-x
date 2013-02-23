ExpandComment =
  init: ->
    for a in $$ '.abbr'
      $.on a.firstElementChild, 'click', ExpandComment.expand
    return
  
  callbacks: []
  
  node: (node) ->
    for callback in ExpandComment.callbacks
      callback node

  expand: (e) ->
    e.preventDefault()
    [_, threadID, replyID] = @href.match /(\d+)#p(\d+)/
    @textContent = "Loading No.#{replyID}..."
    a = @
    $.cache "//api.4chan.org#{@pathname}.json", -> ExpandComment.parse @, a, threadID, replyID

  parse: (req, a, threadID, replyID) ->
    _conf = Conf
    if req.status isnt 200
      a.textContent = "#{req.status} #{req.statusText}"
      return

    posts = JSON.parse(req.response).posts
    if spoilerRange = posts[0].custom_spoiler
      Build.spoilerRange[g.BOARD] = spoilerRange
    replyID = +replyID

    for post in posts
      break if post.no is replyID
    if post.no isnt replyID
      a.textContent = 'No.#{replyID} not found.'
      return

    bq = $.id "m#{replyID}"
    clone = bq.cloneNode false
    clone.innerHTML = post.com

    for quote in quotes = clone.getElementsByClassName 'quotelink'
      href = quote.getAttribute 'href'
      continue if href[0] is '/' # Cross-board quote
      quote.href = "res/#{href}" # Fix pathnames

    post =
      blockquote: clone
      threadID:   threadID
      quotes:     quotes
      backlinks:  []

    ExpandComment.node post

    $.replace bq, clone
    Main.prettify clone