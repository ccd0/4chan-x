SW.tinyboard =
  isOPContainerThread: true
  mayLackJSON: true
  threadModTimeIgnoresSage: true

  disabledFeatures: [
    'Resurrect Quotes'
    'Quick Reply Personas'
    'Quick Reply'
    'Cooldown'
    'Report Link'
    'Delete Link'
    'Edit Link'
    'Quote Inlining'
    'Quote Previewing'
    'Quote Backlinks'
    'File Info Formatting'
    'Image Expansion'
    'Image Expansion (Menu)'
    'Comment Expansion'
    'Thread Expansion'
    'Favicon'
    'Quote Threading'
    'Thread Updater'
    'Banner'
    'Flash Features'
    'Reply Pruning'
  ]

  detect: ->
    for script in $$ 'script:not([src])', d.head
      if (m = script.textContent.match(/\bvar configRoot=(".*?")/))
        properties = $.dict()
        try
          root = JSON.parse m[1]
          if root[0] is '/'
            properties.root = location.origin + root
          else if /^https?:/.test(root)
            properties.root = root
        return properties
    false

  urls:
    thread: ({siteID, boardID, threadID}, isArchived) ->
      "#{Conf['siteProperties'][siteID]?.root or "http://#{siteID}/"}#{boardID}/#{if isArchived then 'archive/' else ''}res/#{threadID}.html"
    post:    ({postID})                   -> "##{postID}"
    index:   ({siteID, boardID})          -> "#{Conf['siteProperties'][siteID]?.root or "http://#{siteID}/"}#{boardID}/"
    catalog: ({siteID, boardID})          -> "#{Conf['siteProperties'][siteID]?.root or "http://#{siteID}/"}#{boardID}/catalog.html"
    threadJSON: ({siteID, boardID, threadID}, isArchived) ->
      root = Conf['siteProperties'][siteID]?.root
      if root then "#{root}#{boardID}/#{if isArchived then 'archive/' else ''}res/#{threadID}.json" else ''
    archivedThreadJSON: (thread) ->
      SW.tinyboard.urls.threadJSON thread, true
    threadsListJSON: ({siteID, boardID}) ->
      root = Conf['siteProperties'][siteID]?.root
      if root then "#{root}#{boardID}/threads.json" else ''
    archiveListJSON: ({siteID, boardID}) ->
      root = Conf['siteProperties'][siteID]?.root
      if root then "#{root}#{boardID}/archive/archive.json" else ''
    catalogJSON: ({siteID, boardID}) ->
      root = Conf['siteProperties'][siteID]?.root
      if root then "#{root}#{boardID}/catalog.json" else ''
    file: ({siteID, boardID}, filename) ->
      "#{Conf['siteProperties'][siteID]?.root or "http://#{siteID}/"}#{boardID}/#{filename}"
    thumb: (board, filename) ->
      SW.tinyboard.urls.file board, filename

  selectors:
    board:         'form[name="postcontrols"]'
    thread:        'input[name="board"] ~ div[id^="thread_"]'
    threadDivider: 'div[id^="thread_"] > hr:last-of-type'
    summary:       '.omitted'
    postContainer: 'div[id^="reply_"]:not(.hidden)' # postContainer is thread for OP
    opBottom:      '.op'
    replyOriginal: 'div[id^="reply_"]:not(.hidden)'
    infoRoot:      '.intro'
    info:
      subject:   '.subject'
      name:      '.name'
      email:     '.email'
      tripcode:  '.trip'
      uniqueID:  '.poster_id'
      capcode:   '.capcode'
      flag:      '.flag'
      date:      'time'
      nameBlock: 'label'
      quote:     'a[href*="#q"]'
      reply:     'a[href*="/res/"]:not([href*="#"])'
    icons:
      isSticky:   '.fa-thumb-tack'
      isClosed:   '.fa-lock'
    file:
      text:  '.fileinfo'
      link:  '.fileinfo > a'
      thumb: 'a > .post-image'
    thumbLink: '.file > a'
    multifile: '.files > .file'
    highlightable:
      op:      ' > .op'
      reply:   '.reply'
      catalog: ' > .thread'
    comment:   '.body'
    spoiler:   '.spoiler'
    quotelink: 'a[onclick*="highlightReply("]'
    catalog:
      board:  '#Grid'
      thread: '.mix'
      thumb:  '.thread-image'
    boardList: '.boardlist'
    boardListBottom: '.boardlist.bottom'
    styleSheet: '#stylesheet'
    psa:       '.blotter'
    nav:
      prev: '.pages > form > [value=Previous]'
      next: '.pages > form > [value=Next]'

  classes:
    highlight: 'highlighted'

  xpath:
    thread:         'div[starts-with(@id,"thread_")]'
    postContainer:  'div[starts-with(@id,"reply_") or starts-with(@id,"thread_")]'
    replyContainer: 'div[starts-with(@id,"reply_")]'

  regexp:
    quotelink:
      ///
        /
        ([^/]+) # boardID
        /res/
        (\d+)   # threadID
        (?:\.\w+)?#
        (\d+)   # postID
        $
      ///
    quotelinkHTML:
      /<a [^>]*\bhref="[^"]*\/([^\/]+)\/res\/(\d+)(?:\.\w+)?#(\d+)"/g

  Build:
    parseJSON: (data, board) ->
      o = SW.yotsuba.Build.parseJSON(data, board)
      if data.ext is 'deleted'
        delete o.file
        $.extend o,
          files: []
          fileDeleted: true
          filesDeleted: [0]
      if data.extra_files
        for extra_file, i in data.extra_files
          if extra_file.ext is 'deleted'
            o.filesDeleted.push i
          else
            file = SW.yotsuba.Build.parseJSONFile(data, board)
            o.files.push file
        if o.files.length
          o.file = o.files[0]
      o

    parseComment: (html) ->
      html = html
        .replace(/<br\b[^<]*>/gi, '\n')
        .replace(/<[^>]*>/g, '')
      $.unescape html

  bgColoredEl: ->
    $.el 'div', className: 'post reply'

  isFileURL: (url) ->
    /\/src\/[^\/]+/.test(url.pathname)

  preParsingFixes: (board) ->
    # fixes effects of unclosed link in announcement
    if (broken = $('a > input[name="board"]', board))
      $.before broken.parentNode, broken

  parseNodes: (post, nodes) ->
    # Add vichan's span.poster_id around the ID if not already present.
    return if nodes.uniqueID
    nodes.info.normalize()
    {nextSibling} = nodes.nameBlock
    if nextSibling.nodeType is 3 and (m = nextSibling.textContent.match /(\s*ID:\s*)(\S+)/)
      nextSibling = nextSibling.splitText m[1].length
      nextSibling.splitText m[2].length
      nodes.uniqueID = uniqueID = $.el 'span', {className: 'poster_id'}
      $.replace nextSibling, uniqueID
      $.add uniqueID, nextSibling

  parseDate: (node) ->
    date = Date.parse(node.getAttribute('datetime')?.trim())
    return new Date(date) unless isNaN(date)
    date = Date.parse(node.textContent.trim() + ' UTC') # e.g. onesixtwo.club
    return new Date(date) unless isNaN(date)
    undefined

  parseFile: (post, file) ->
    {text, link, thumb} = file
    return false if $.x("ancestor::#{@xpath.postContainer}[1]", text) isnt post.nodes.root # file belongs to a reply
    return false if not (infoNode = if '(' in link.nextSibling?.textContent then link.nextSibling else link.nextElementSibling)
    return false if not (info = infoNode.textContent.match /\((.*,\s*)?([\d.]+ [KMG]?B).*\)/)
    nameNode = $ '.postfilename', text
    $.extend file,
      name:       if nameNode then (nameNode.title or nameNode.textContent) else link.pathname.match(/[^/]*$/)[0]
      size:       info[2]
      dimensions: info[0].match(/\d+x\d+/)?[0]
    if thumb
      $.extend file,
        thumbURL:  if /\/static\//.test(thumb.src) and /\.(?:gif|jpe?g|png)$/.test(link.href) then link.href else thumb.src
        isSpoiler: /^Spoiler/i.test(info[1] or '') or link.textContent is 'Spoiler Image'
    true

  isThumbExpanded: (file) ->
    # Detect old Tinyboard image expansion that changes src attribute on thumbnail.
    $.hasClass(file.thumb.parentNode, 'expanded') or file.thumb.parentNode.dataset.expanded is 'true'

  isLinkified: (link) ->
    /\bnofollow\b/.test(link.rel)

  catalogPin: (threadRoot) ->
    threadRoot.dataset.sticky = 'true'
