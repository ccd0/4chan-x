SW.tinyboard =
  isOPContainerThread: true

  detect: ->
    for script in $$ 'script:not([src])', d.head
      return true if /\bvar configRoot=".*?"/.test(script.textContent)
    false

  selectors:
    board:         'form[name="postcontrols"]'
    thread:        'div[id^="thread_"]'
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
    return false if text.parentNode isnt post.nodes.root # file belongs to a reply
    return false if not (infoNode = $ '.unimportant', text)
    return false if not (info = infoNode.textContent.match /\((Spoiler Image, )?([\d.]+ [KMG]?B).*\)/)
    nameNode = $ '.postfilename', text
    $.extend file,
      name:       if nameNode then (nameNode.title or nameNode.textContent) else link.pathname.match(/[^/]*$/)[0]
      size:       info[2]
      dimensions: info[0].match(/\d+x\d+/)?[0]
    if thumb
      $.extend file,
        thumbURL:  if '/static/' in thumb.src then link.href else thumb.src
        isSpoiler: !!info[1]
    true
