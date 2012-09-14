Main =
  init: ->
    Main.flatten null, Config

    # Load values from localStorage.
    for key, val of Conf
      Conf[key] = $.get key, val

    userThemes  = $.get "userThemes",  Themes
    userMascots = $.get "userMascots", Mascots

    for name, mascot of userMascots
      enabledmascots[name] = $.get name, ->
        if mascot.category == 'SFW' then true else false

    path = location.pathname
    pathname = path[1..].split '/'
    [g.BOARD, temp] = pathname
    if temp is 'res'
      g.REPLY = true
      g.THREAD_ID = pathname[2]

    switch location.hostname
      when 'sys.4chan.org'
        if /report/.test location.search
          $.ready ->
            form  = $ 'form'
            field = $.id 'recaptcha_response_field'
            $.on field, 'keydown', (e) ->
              window.location = 'javascript:Recaptcha.reload()' if e.keyCode is 8 and not e.target.value
            $.on form, 'submit', (e) ->
              e.preventDefault()
              response = field.value.trim()
              field.value = "#{response} #{response}" unless /\s/.test response
              form.submit()
        return
      when 'images.4chan.org'
        $.ready ->
          if /^4chan - 404/.test(d.title) and Conf['404 Redirect']
            path = location.pathname.split '/'
            url  = Redirect.image path[1], path[3]
            location.href = url if url
        return

    Main.pruneHidden()

    #major features

    Style.init()

    now = Date.now()
    if Conf['Check for Updates'] and $.get('lastUpdate',  0) < now - 18*$.HOUR
      $.ready ->
        $.on window, 'message', Main.message
        $.set 'lastUpdate', now
        $.add d.head, $.el 'script',
          src: 'https://github.com/zixaphir/appchan-x/raw/master/latest.js'

    if Conf['Disable inline 4chan addon'] or Conf['Style']
      localStorage.setItem '4chan-settings', '{"disableAll":true}'
      
    if Conf['Filter']
      Filter.init()

    if Conf['Reply Hiding']
      ReplyHiding.init()

    if Conf['Filter'] or Conf['Reply Hiding']
      StrikethroughQuotes.init()

    if Conf['Anonymize']
      Anonymize.init()

    if Conf['Time Formatting']
      Time.init()

    if Conf['File Info Formatting']
      FileInfo.init()

    if Conf['Sauce']
      Sauce.init()

    if Conf['Reveal Spoilers']
      RevealSpoilers.init()

    if Conf['Image Auto-Gif']
      AutoGif.init()

    if Conf['Png Thumbnail Fix']
      PngFix.init()

    if Conf['Image Hover']
      ImageHover.init()

    if Conf['Menu']
      Menu.init()

      if Conf['Report Link']
        ReportLink.init()

      if Conf['Delete Link']
        DeleteLink.init()

      if Conf['Filter']
        Filter.menuInit()

      if Conf['Download Link']
        DownloadLink.init()

      if Conf['Archive Link']
        ArchiveLink.init()

    if Conf['Resurrect Quotes']
      Quotify.init()

    if Conf['Quote Inline']
      QuoteInline.init()

    if Conf['Quote Preview']
      QuotePreview.init()

    if Conf['Quote Backlinks']
      QuoteBacklink.init()

    if Conf['Indicate OP quote']
      QuoteOP.init()

    if Conf['Indicate Cross-thread Quotes']
      QuoteCT.init()

    $.ready Main.ready

  ready: ->
    if /^4chan - 404/.test d.title
      if Conf['404 Redirect'] and /^\d+$/.test g.THREAD_ID
        location.href = Redirect.thread g.BOARD, g.THREAD_ID, location.hash
      return
    unless $.id 'navtopright'
      return
    $.addClass d.body, $.engine
    $.addClass d.body, 'fourchan_x'
    for nav in ['boardNavDesktop', 'boardNavDesktopFoot']
      if a = $ "a[href$='/#{g.BOARD}/']", $.id nav
        # Gotta make it work in temporary boards.
        $.addClass a, 'current'

    now = Date.now()

    Favicon.init()
    Options.init()

    # Major features.
    if Conf['Quick Reply']
      QR.init()

    if Conf['Image Expansion']
      ImageExpand.init()

    if Conf['Thread Watcher']
      Watcher.init()

    if Conf['Keybinds']
      Keybinds.init()

    if g.REPLY
      if Conf['Prefetch']
        Prefetch.init()

      if Conf['Thread Updater']
        Updater.init()

      if Conf['Thread Stats']
        ThreadStats.init()

      if Conf['Reply Navigation']
        Nav.init()

      if Conf['Post in Title']
        TitlePost.init()

      if Conf['Unread Count'] or Conf['Unread Favicon']
        Unread.init()

      if Conf['Quote Threading']
        QuoteThreading.init()

    else #not reply
      if Conf['Thread Hiding']
        ThreadHiding.init()

      if Conf['Thread Expansion']
        ExpandThread.init()

      if Conf['Comment Expansion']
        ExpandComment.init()

      if Conf['Index Navigation']
        Nav.init()

    board = $ '.board'
    nodes = []
    for node in $$ '.postContainer', board
      nodes.push Main.preParse node
    Main.node nodes, true
    Main.prettify = Main._prettify

    Main.observe()

  observe: ->
    board = $ '.board'
    if MutationObserver = window.WebKitMutationObserver or window.MozMutationObserver or window.OMutationObserver or window.MutationObserver
      Main.observer2 = observer = new MutationObserver Main.observer
      observer.observe board,
        childList: true
        subtree:   true
    else
      $.on board, 'DOMNodeInserted', Main.listener

  disconnect: ->
    if Main.observer2
      Main.observer2.disconnect()
    else
      board = $ '.board'
      $.off board, 'DOMNodeInserted', Main.listener

  pruneHidden: ->
    now = Date.now()
    g.hiddenReplies = $.get "hiddenReplies/#{g.BOARD}/", {}
    if $.get('lastChecked', 0) < now - 1*$.DAY
      $.set 'lastChecked', now

      cutoff = now - 7*$.DAY
      hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}

      for id, timestamp of hiddenThreads
        if timestamp < cutoff
          delete hiddenThreads[id]

      for id, timestamp of g.hiddenReplies
        if timestamp < cutoff
          delete g.hiddenReplies[id]

      $.set "hiddenThreads/#{g.BOARD}/", hiddenThreads
      $.set "hiddenReplies/#{g.BOARD}/", g.hiddenReplies

  flatten: (parent, obj) ->
    if obj instanceof Array
      Conf[parent] = obj[0]
    else if typeof obj is 'object'
      for key, val of obj
        Main.flatten key, val
    else # string or number
      Conf[parent] = obj
    return

  message: (e) ->
    {version} = e.data
    if version and version isnt Main.version and confirm 'An updated version of appchan X is available, would you like to install it now?'
      window.location = "https://raw.github.com/zixaphir/appchan-x/#{version}/appchan_x.user.js"

  preParse: (node) ->
    parentClass = node.parentNode.className
    el   = $ '.post', node
    post =
      root:        node
      el:          el
      class:       el.className
      ID:          el.id.match(/\d+$/)[0]
      threadID:    g.THREAD_ID or $.x('ancestor::div[parent::div[@class="board"]]', node).id.match(/\d+$/)[0]
      isArchived:  /\barchivedPost\b/.test parentClass
      isInlined:   /\binline\b/.test       parentClass
      isCrosspost: /\bcrosspost\b/.test    parentClass
      blockquote:  el.lastElementChild
      quotes:      el.getElementsByClassName 'quotelink'
      backlinks:   el.getElementsByClassName 'backlink'
      fileInfo:    false
      img:         false
    if img = $ 'img[data-md5]', el
      # Make sure to not add deleted images,
      # those do not have a data-md5 attribute.
      post.fileInfo = img.parentNode.previousElementSibling
      post.img      = img
    Main.prettify post.blockquote
    post
  node: (nodes, notify) ->
    for callback in Main.callbacks
      try
        callback node for node in nodes
      catch err
        alert "AppChan X has experienced an error. You can help by sending this snippet to:\nhttps://github.com/zixaphir/appchan-x/issues\n\n#{Main.version}\n#{window.location}\n#{navigator.userAgent}\n\n#{err.stack}" if notify
    return
  observer: (mutations) ->
    nodes = []
    for mutation in mutations
      for addedNode in mutation.addedNodes
        if /\bpostContainer\b/.test(addedNode.className) and addedNode.parentNode.className isnt 'threadContainer'
          nodes.push Main.preParse addedNode
    Main.node nodes if nodes.length
  listener: (e) ->
    {target} = e
    if /\bpostContainer\b/.test(target.className) and target.parentNode.className isnt 'threadContainer'
      Main.node [Main.preParse target]

  prettify: -> return
  _prettify: (bq) ->
    switch g.BOARD
      when 'g'
        code = ->
          for pre in document.getElementById('_id_').getElementsByClassName 'prettyprint'
            pre.innerHTML = prettyPrintOne pre.innerHTML.replace /\s/g, '&nbsp;'
          return
      when 'sci'
        code = ->
          jsMath.Process document.getElementById '_id_'
          return
      else
        return
    $.globalEval "#{code}".replace '_id_', bq.id

  namespace: 'appchan_x.'
  version: '0.9beta'
  callbacks: []