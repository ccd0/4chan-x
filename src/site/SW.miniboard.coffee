SW.miniboard =
  isOPContainerThread: false
  mayLackJSON: true

  disabledFeatures: [
    'Fourchan thingies'
    'Tinyboard Glue'
    'Banner'
    'Favicon'
    'Resurrect Quotes'
    'Quick Reply Personas'
    'Quick Reply'
    'Quote Inlining'
    'Quote Previewing'
    'Quote Backlinks'
    'Quote Threading'
    'Image Expansion'
    'Image Expansion (Menu)'
    'Thread Hiding Buttons'
    'Thread Hiding (Menu)'
    'Thread Stats'
    'Thread Updater'
    'Reply Pruning'
  ]

  detect: ->
    for anchor in $$ 'div.footer > a', d.body
      if anchor.textContent == 'miniboard'
        properties = $.dict()
        return properties
    false

  urls:
    thread:     ({siteID, boardID, threadID}) -> "#{location.protocol}//#{siteID}/#{boardID}/#{threadID}/"
    post:       ({boardID, postID})           -> "##{boardID}-#{postID}"
    index:      ({siteID, boardID})           -> "#{location.protocol}//#{siteID}/#{boardID}/"
    catalog:    ({siteID, boardID})           -> "#{location.protocol}//#{siteID}/#{boardID}/catalog/"
    file: ({siteID}, filename)                -> "#{location.protocol}//#{siteID}/src/#{filename}"
    thumb: ({siteID}, filename)               -> "#{location.protocol}//#{siteID}/src/thumb_#{filename}"

  selectors:
    board:         '.deleteform'
    thread:        '.thread'
    threadDivider: '.deleteform > hr'
    summary:       '.omitted'
    postContainer: '.post-container'
    replyOriginal: '.reply-container'
    sideArrows:    'div.post-dash'
    post:          '.post'
    infoRoot:      '.post-info'
    info:
      subject:   '.post-subject'
      name:      '.post-name'
      email:     'a[href^="mailto:"]'
      tripcode:  '.post-trip'
      #uniqueID:  ''
      capcode:   '.post-cap'
      date:      '.post-datetime'
      nameBlock: 'label'
      quote:     'a[href*="#q"]'
      reply:     '.post-id > a:first-child'
    icons:
      isSticky:   'img[src="/static/sticky.png"]'
      isClosed:   'img[src="/static/lock.png"]'
    file:
      text:  '.file-info'
      link:  '.file-info > a'
      thumb: 'a.file-thumb-href > img'
    thumbLink: 'a.file-thumb-href'
    highlightable:
      op:      ' > .op'
      reply:   ' > .reply'
      catalog: ' > .thread'
    comment:   '.post-message'
    spoiler:   '.spoiler'
    quotelink: '.reference'
    catalog:
      board:  '#catalog'
      thread: '.thread'
      thumb:  'img[id^="thumb-"]'
    boardList: '.boardlist.desktop'
    #boardListBottom: ''
    styleSheet: 'link:not([href^="/css/index.css"])'
    #psa:       '#globalMessage'
    #psaTop:    '#globalToggle'
    #searchBox: '#search-box'
    nav:
      prev: '.pagetable a.prev'
      next: '.pagetable a.next'

  classes:
    highlight: 'highlight'

  xpath:
    thread:         'div[contains(@class, "thread")]'
    postContainer:  'div[contains(@class, "post-container")]'
    replyContainer: 'div[contains(@class, "reply-container")]'

  regexp:
    quotelink: /\/([^\/]+)\/(\d+)\/#[^-]+-(\d+)/
    quotelinkHTML: /href='\/([^\/]+)\/(\d+)\/#[^-]+-(\d+)'/g

  transformBoardList: ->
    nodes = [$(g.SITE.selectors.boardList).cloneNode(true).childNodes...]
    if (menu = $ '.boardmenu.desktop')
      nodes.push $.tn(' ')
      for a in $$ 'a', menu
        nodes.push $.tn('[')
        nodes.push a.cloneNode(true)
        nodes.push $.tn('] ')
    # Fix catalog links in custom board nav that default to catalog.html
    for a in $$ 'a[data-only="catalog"]', $.id('header-bar')
      a.href = @urls.catalog(g.BOARD)
    # Remove 'catalog' class from <html> to avoid collision with miniboard's .catalog CSS
    $.rmClass doc, 'catalog'
    nodes

  bgColoredEl: ->
    $.el 'div', className: 'reply'

  isThisPageLegit: ->
    pathname = location.pathname.split /\/+/
    boardID = pathname[1]
    boardID and boardID isnt 'manage'

  parseURL: (url) ->
    r = {siteID: @ID}
    pathname = url.pathname.split /\/+/
    r.boardID = pathname[1]
    return r unless r.boardID
    return r if r.boardID is 'manage'
    if @isFileURL(url)
      r.VIEW = 'file'
    else if /^catalog$/.test(pathname[2])
      r.VIEW = 'catalog'
    else if /^\d+$/.test(pathname[2])
      r.VIEW = 'thread'
      r.threadID = r.THREADID = +pathname[2]
    else
      r.VIEW = 'index'
    r

  isFileURL: (url) ->
    /\/src\/[^\/]+/.test(url.pathname)

  parseNodes: ->
    return

  parseDate: (node) ->
    text = node.textContent.trim()
    if (m = text.match /(\d{2})\/(\d{2})\/(\d{2})\(\w+\)(\d{2}):(\d{2}):(\d{2})/)
      year = 2000 + (+m[3])
      new Date(year, m[2] - 1, +m[1], +m[4], +m[5], +m[6])
    else
      undefined

  parseFile: (post, file) ->
    {text, link, thumb} = file
    return false if not (info = link.nextSibling?.textContent.match /([\d.]+?[KMG]?B),\s([\d.]+x[\d.]+),\s([^\\\)\/]+?)(?:\)|$)/)
    $.extend file,
      name: info[3]
      size: info[1]
      dimensions: info[2]
    if thumb
      $.extend file,
        thumbURL: thumb.src
    true

  isLinkified: (link) ->
    /\bnofollow\b/.test(link.rel)
