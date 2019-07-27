Build =
  staticPath: '//s.4cdn.org/image/'
  gifIcon: if window.devicePixelRatio >= 2 then '@2x.gif' else '.gif'
  spoilerRange: {}

  shortFilename: (filename) ->
    ext = filename.match(/\.?[^\.]*$/)[0]
    if filename.length - ext.length > 30
      "#{filename.match(/(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|[^]){0,25}/)[0]}(...)#{ext}"
    else
      filename

  spoilerThumb: (boardID) ->
    if spoilerRange = Build.spoilerRange[boardID]
      # Randomize the spoiler image.
      "#{Build.staticPath}spoiler-#{boardID}#{Math.floor 1 + spoilerRange * Math.random()}.png"
    else
      "#{Build.staticPath}spoiler.png"

  sameThread: (boardID, threadID) ->
    g.VIEW is 'thread' and g.BOARD.ID is boardID and g.THREADID is +threadID

  threadURL: (boardID, threadID) ->
    if boardID isnt g.BOARD.ID
      "//#{BoardConfig.domain(boardID)}/#{boardID}/thread/#{threadID}"
    else if g.VIEW isnt 'thread' or +threadID isnt g.THREADID
      "/#{boardID}/thread/#{threadID}"
    else
      ''

  postURL: (boardID, threadID, postID) ->
    "#{Build.threadURL(boardID, threadID)}#p#{postID}"

  parseJSON: (data, {siteID, boardID}) ->
    o =
      # id
      ID:       data.no
      postID:   data.no
      threadID: data.resto or data.no
      boardID:  boardID
      siteID:   siteID
      isReply:  !!data.resto
      # thread status
      isSticky: !!data.sticky
      isClosed: !!data.closed
      isArchived: !!data.archived
      # file status
      fileDeleted: !!data.filedeleted
      filesDeleted: if data.filedeleted then [0] else []
    o.info =
      subject:  $.unescape data.sub
      email:    $.unescape data.email
      name:     $.unescape(data.name) or ''
      tripcode: data.trip
      pass:     if data.since4pass? then "#{data.since4pass}" else undefined
      uniqueID: data.id
      flagCode: data.country
      flagCodeTroll: data.troll_country
      flag:     $.unescape data.country_name
      dateUTC:  data.time
      dateText: data.now
      commentHTML: {innerHTML: data.com or ''}
    if data.capcode
      o.info.capcode = data.capcode.replace(/_highlight$/, '').replace(/_/g, ' ').replace(/\b\w/g, (c) -> c.toUpperCase())
      o.capcodeHighlight = /_highlight$/.test data.capcode
      delete o.info.uniqueID
    o.files = []
    if data.ext
      o.file = SW.yotsuba.Build.parseJSONFile(data, {siteID, boardID})
      o.files.push o.file
    # Temporary JSON properties for events such as April 1 / Halloween
    for key of data when key[0] is 'x'
      o[key] = data[key]
    o

  parseJSONFile: (data, {siteID, boardID}) ->
    site = g.sites[siteID]
    filename = if site.software is 'yotsuba' and boardID is 'f'
      "#{encodeURIComponent data.filename}#{data.ext}"
    else
      "#{data.tim}#{data.ext}"
    o =
      name:      ($.unescape data.filename) + data.ext
      url:       site.urls.file({siteID, boardID}, filename)
      height:    data.h
      width:     data.w
      MD5:       data.md5
      size:      $.bytesToString data.fsize
      thumbURL:  site.urls.thumb({siteID, boardID}, "#{data.tim}s.jpg")
      theight:   data.tn_h
      twidth:    data.tn_w
      isSpoiler: !!data.spoiler
      tag:       data.tag
      hasDownscale: !!data.m_img
    o.dimensions = "#{o.width}x#{o.height}" if data.h? and !/\.pdf$/.test(o.url)
    o

  parseComment: (html) ->
    html = html
      .replace(/<br\b[^<]*>/gi, '\n')
      .replace(/\n\n<span\b[^<]* class="abbr"[^]*$/i, '') # EXIF data (/p/)
      .replace(/<[^>]*>/g, '')
    $.unescape html

  parseCommentDisplay: (html) ->
    # Hide spoilers.
    unless Conf['Remove Spoilers'] or Conf['Reveal Spoilers']
      while (html2 = html.replace /<s>(?:(?!<\/?s>).)*<\/s>/g, '[spoiler]') isnt html
        html = html2
    html = html
      .replace(/^<b\b[^<]*>Rolled [^<]*<\/b>/i, '')      # Rolls (/tg/, /qst/)
      .replace(/<span\b[^<]* class="fortune"[^]*$/i, '') # Fortunes (/s4s/)
    # Remove preceding and following new lines, trailing spaces.
    Build.parseComment(html).trim().replace(/\s+$/gm, '')

  postFromObject: (data, boardID) ->
    o = Build.parseJSON data, {boardID, siteID: g.SITE.ID}
    Build.post o

  post: (o) ->
    {ID, threadID, boardID, file} = o
    {subject, email, name, tripcode, capcode, pass, uniqueID, flagCode, flagCodeTroll, flag, dateUTC, dateText, commentHTML} = o.info
    {staticPath, gifIcon} = Build

    ### Post Info ###

    if capcode
      capcodeLC = capcode.toLowerCase()
      if capcode is 'Founder'
        capcodePlural      = 'the Founder'
        capcodeDescription = "4chan's Founder"
      else if capcode is 'Verified'
        capcodePlural      = 'Verified Users'
        capcodeDescription = ''
      else
        capcodeLong   = {'Admin': 'Administrator', 'Mod': 'Moderator'}[capcode] or capcode
        capcodePlural = "#{capcodeLong}s"
        capcodeDescription = "a 4chan #{capcodeLong}"

    url = Build.threadURL boardID, threadID
    postLink = "#{url}#p#{ID}"
    quoteLink = if Build.sameThread boardID, threadID
      "javascript:quote('#{+ID}');"
    else
      "#{url}#q#{ID}"

    postInfo = <%= readHTML('PostInfo.html') %>

    ### File Info ###

    if file
      protocol = /^https?:(?=\/\/i\.4cdn\.org\/)/
      fileURL = file.url.replace protocol, ''
      shortFilename = Build.shortFilename file.name
      fileThumb = if file.isSpoiler then Build.spoilerThumb(boardID) else file.thumbURL.replace(protocol, '')

    fileBlock = <%= readHTML('File.html') %>

    ### Whole Post ###

    postClass = if o.isReply then 'reply' else 'op'

    wholePost = <%= readHTML('Post.html') %>

    container = $.el 'div',
      className: "postContainer #{postClass}Container"
      id:        "pc#{ID}"
    $.extend container, wholePost

    # Fix quotelinks
    for quote in $$ '.quotelink', container
      href = quote.getAttribute 'href'
      if (href[0] is '#')
        if !Build.sameThread(boardID, threadID)
          quote.href = Build.threadURL(boardID, threadID) + href
      else
        if (match = quote.href.match SW.yotsuba.regexp.quotelink) and (Build.sameThread match[1], match[2])
          quote.href = href.match(/(#[^#]*)?$/)[0] or '#'

    container

  summaryText: (status, posts, files) ->
    text = ''
    text += "#{status} " if status
    text += "#{posts} post#{if posts > 1 then 's' else ''}"
    text += " and #{files} image repl#{if files > 1 then 'ies' else 'y'}" if +files
    text += " #{if status is '-' then 'shown' else 'omitted'}."

  summary: (boardID, threadID, posts, files) ->
    $.el 'a',
      className: 'summary'
      textContent: Build.summaryText '', posts, files
      href: "/#{boardID}/thread/#{threadID}"

  thread: (thread, data, withReplies) ->
    if (root = thread.nodes.root)
      $.rmAll root
    else
      thread.nodes.root = root = $.el 'div',
        className: 'thread'
        id: "t#{data.no}"
    $.add root, Build.hat.cloneNode(false) if Build.hat
    $.add root, thread.OP.nodes.root
    if data.omitted_posts or !withReplies and data.replies
      [posts, files] = if withReplies
        # XXX data.omitted_images is not accurate.
        [data.omitted_posts, data.images - data.last_replies.filter((data) -> !!data.ext).length]
      else
        [data.replies, data.images]
      summary = Build.summary thread.board.ID, data.no, posts, files
      $.add root, summary
    root

  catalogThread: (thread, data, pageCount) ->
    {staticPath, gifIcon} = Build
    {tn_w, tn_h} = data

    if data.spoiler and !Conf['Reveal Spoiler Thumbnails']
      src = "#{staticPath}spoiler"
      if spoilerRange = Build.spoilerRange[thread.board]
        # Randomize the spoiler image.
        src += ("-#{thread.board}") + Math.floor 1 + spoilerRange * Math.random()
      src += '.png'
      imgClass = 'spoiler-file'
      cssText = "--tn-w: 100; --tn-h: 100;"
    else if data.filedeleted
      src = "#{staticPath}filedeleted-res#{gifIcon}"
      imgClass = 'deleted-file'
    else if thread.OP.file
      src = thread.OP.file.thumbURL
      ratio = 250 / Math.max(tn_w, tn_h)
      cssText = "--tn-w: #{tn_w * ratio}; --tn-h: #{tn_h * ratio};"
    else
      src = "#{staticPath}nofile.png"
      imgClass = 'no-file'

    postCount = data.replies + 1
    fileCount = data.images  + !!data.ext

    container = $.el 'div', <%= readHTML('CatalogThread.html') %>
    $.before thread.OP.nodes.info, [container.childNodes...]

    for br in $$('br', thread.OP.nodes.comment) when br.previousSibling and br.previousSibling.nodeName is 'BR'
      $.addClass br, 'extra-linebreak'

    root = $.el 'div',
      className: 'thread catalog-thread'
      id: "t#{thread}"
    $.addClass root, thread.OP.highlights... if thread.OP.highlights
    $.addClass root, 'noFile' unless thread.OP.file
    root.style.cssText = cssText or ''

    root

  catalogReply: (thread, data) ->
    excerpt = ''
    if data.com
      excerpt = Build.parseCommentDisplay(data.com).replace(/>>\d+/g, '').trim().replace(/\n+/g, ' // ')
    if data.ext
      excerpt or= "#{$.unescape data.filename}#{data.ext}"
    if data.com
      excerpt or= $.unescape data.com.replace(/<br\b[^<]*>/gi, ' // ')
    excerpt or= '\xA0'
    excerpt = "#{excerpt[...70]}..." if excerpt.length > 73

    link = Build.postURL thread.board.ID, thread.ID, data.no
    $.el 'div', {className: 'catalog-reply'},
      <%= readHTML('CatalogReply.html') %>

SW.yotsuba.Build = Build
