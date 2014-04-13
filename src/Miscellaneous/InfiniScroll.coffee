InfiniScroll =
  init: ->
    return unless Conf['Infinite Scrolling'] and g.VIEW is 'index' and g.BOARD isnt 'f'

    @threads = g.threads

    $.on d, '4chanXInitFinished', @ready

  ready: ->
    $.off d, '4chanXInitFinished', InfiniScroll.ready
    $.on d, 'scroll', InfiniScroll.scroll
    InfiniScroll.scroll()

  scroll: $.debounce 100, ->
    return if InfiniScroll.isFetching or ((d.body.scrollTop or doc.scrollTop) <= doc.scrollHeight - (300 + window.innerHeight))
    return InfiniScroll.notice() if InfiniScroll.isDead

    # For once, lets respect 4chan's API rules.
    if InfiniScroll.cache and InfiniScroll.cache.time > Date.now() - $.MINUTE
      return InfiniScroll.parse InfiniScroll.cache

    new Notice 'info', "Fetching next page.", 2

    InfiniScroll.isFetching = true
    url = "//api.4chan.org/#{g.BOARD}/catalog.json"
    $.ajax url, onloadend: InfiniScroll.cb.load,
      whenModified: true

  parse: (response) ->
    threads     = InfiniScroll.parsePages response
    threadNodes = []
    nodes       = []

    return unless threads.length
      InfiniScroll.notice()
      InfiniScroll.isDead = true
    
    for thread in threads
      posts = []
      {omitted_posts, omitted_images} = thread
      threadID = thread.no

      el = $.el 'div',
        className: 'thread'
        id:        "t#{threadID}"

      op = Build.postFromObject thread, g.BOARD
      posts.push op
      
      replylink = $.el 'a',
        href: "thread/#{threadID}"
        className: 'replylink'
        textContent: 'Reply'
      
      postlink = $.el 'div',
        className: "postLink mobile"
        innerHTML: """<a href="thread/#{threadID}" class="button">View Thread</a>"""

      if omitted_posts
        posts.push $.el 'span',
          className: 'summary desktop'
          innerHTML: """
            #{omitted_posts} posts #{if omitted_images then "and " + omitted_images + " image replies"} omitted. Click <a class="replylink" href="thread/#{threadID}">here</a> to view.
          """

        $.prepend postlink, $.el 'span',
          className: 'info'
          innerHTML: """
            <strong>#{omitted_posts} posts omitted</strong>#{if omitted_images then "<br><em>(#{omitted_images} have images)</em>" else ""}
          """
      
      $.add $('.postInfo', op), [$.tn('\u00A0\u00A0\u00A0['), replylink, $.tn(']\u00A0')]
      $.add op, postlink

      if thread.last_replies then posts.push Build.postFromObject post, g.BOARD for post in thread.last_replies

      $.add el, posts

      threadNodes.push el
      nodes.push el
      nodes.push $.el 'hr'

    InfiniScroll.features threadNodes

    $.before botPostForm, nodes if botPostForm = $ '.board > .mobile.center'

  parsePages: (response) ->
    pages = JSON.parse response
    newThreads = []

    for number, page of pages when pages.hasOwnProperty number
      {threads} = page
      for thread in threads
        continue if g.threads["#{g.BOARD}.#{thread.no}"]

        newThreads.push thread

        return newThreads if newThreads.length is 15

    return newThreads

  features: (threadNodes) ->
    posts   = []
    threads = []
    for threadRoot in threadNodes
      thread = new Thread +threadRoot.id[1..], g.BOARD
      threads.push thread
      for post in $$ '.thread > .postContainer', threadRoot
        try
          posts.push new Post post, thread, g.BOARD
        catch err
          # Skip posts that we failed to parse.
          unless errors
            errors = []
          errors.push
            message: "Parsing of Post No.#{postRoot.id.match(/\d+/)} failed. Post will be skipped."
            error: err
    Main.handleErrors errors if errors

    Main.callbackNodes Thread, threads
    Main.callbackNodes Post,   posts
  
  notice: do ->
    notify = false
    reset = -> notify = false
    return ->
      return if notify
      notify = true
      new Notice 'info', "Last page reached.", 2
      setTimeout reset, 3 * $.SECOND

  cb:
    load: ->
      InfiniScroll.isFetching = false
      return unless @status is 200
      
      InfiniScroll.cache = new String @response
      InfiniScroll.cache.time = Date.now()
      InfiniScroll.parse @response
