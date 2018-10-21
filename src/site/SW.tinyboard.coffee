SW.tinyboard =
  isOPContainerThread: true

  disabledFeatures: [
    'Board Configuration'
    'Normalize URL'
    'Captcha Configuration'
    'Image Host Rewriting'
    'Index Generator'
    'Announcement Hiding'
    'Fourchan thingies'
    'Resurrect Quotes'
    'Quick Reply Personas'
    'Quick Reply'
    'Cooldown'
    'Pass Link'
    'Index Generator (Menu)'
    'Report Link'
    'Delete Link'
    'Edit Link'
    'Archive Link'
    'Quote Inlining'
    'Quote Previewing'
    'Quote Backlinks'
    'File Info Formatting'
    'Fappe Tyme'
    'Image Expansion'
    'Image Expansion (Menu)'
    'Comment Expansion'
    'Thread Expansion'
    'Favicon'
    'Unread'
    'Quote Threading'
    'Thread Stats'
    'Thread Updater'
    'Mark New IPs'
    'Banner'
    'Flash Features'
    'Reply Pruning'
    <% if (readJSON('/.tests_enabled')) { %>
    'Build Test'
    <% } %>
  ]

  detect: ->
    for script in $$ 'script:not([src])', d.head
      return true if /\bvar configRoot=".*?"/.test(script.textContent)
    false

  urls:
    thread: ({boardID, threadID}) -> "#{boardID}/res/#{threadID}.html"

  selectors:
    board:         'form[name="postcontrols"]'
    thread:        'div[id^="thread_"]'
    threadDivider: 'div[id^="thread_"] > hr:last-of-type'
    postContainer: '.reply' # postContainer is thread for OP
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
    comment:   '.body'
    spoiler:   '.spoiler'
    quotelink: 'a[onclick^="highlightReply("]'
    boardList: '.boardlist'

  xpath:
    thread:        'div[starts-with(@id,"thread_")]'
    postContainer: 'div[starts-with(@id,"reply_") or starts-with(@id,"thread_")]'

  regexp:
    quotelink:
      ///
        /
        ([^/]+) # boardID
        /res/
        (\d+)   # threadID
        \.html#
        (\d+)   # postID
        $
      ///

  bgColoredEl: ->
    $.el 'div', className: 'post reply'

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

  parseFile: (post, file) ->
    {text, link, thumb} = file
    return false if $.x("ancestor::#{Site.xpath.postContainer}[1]", text) isnt post.nodes.root # file belongs to a reply
    return false if not (infoNode = if '(' in link.nextSibling?.textContent then link.nextSibling else link.nextElementSibling)
    return false if not (info = infoNode.textContent.match /\((Spoiler Image, )?([\d.]+ [KMG]?B).*\)/)
    nameNode = $ '.postfilename', text
    $.extend file,
      name:       if nameNode then (nameNode.title or nameNode.textContent) else link.pathname.match(/[^/]*$/)[0]
      size:       info[2]
      dimensions: info[0].match(/\d+x\d+/)?[0]
    if thumb
      $.extend file,
        thumbURL:  if /\/static\//.test(thumb.src) and /\.(?:gif|jpe?g|png)$/.test(link.href) then link.href else thumb.src
        isSpoiler: !!info[1] or link.textContent is 'Spoiler Image'
    true

  isThumbExpanded: (file) ->
    # Detect old Tinyboard image expansion that changes src attribute on thumbnail.
    $.hasClass file.thumb.parentNode, 'expanded'
