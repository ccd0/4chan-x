Build =
  staticPath: '//s.4cdn.org/image/'
  gifIcon: if window.devicePixelRatio >= 2 then '@2x.gif' else '.gif'
  spoilerRange: {}
  unescape: (text) ->
    return text unless text?
    text.replace(/<[^>]*>/g, '').replace /&(amp|#039|quot|lt|gt);/g, (c) ->
      {'&amp;': '&', '&#039;': "'", '&quot;': '"', '&lt;': '<', '&gt;': '>'}[c]
  shortFilename: (filename) ->
    threshold = 30
    ext = filename.match(/\.?[^\.]*$/)[0]
    if filename.length - ext.length > threshold
      "#{filename[...threshold - 5]}(...)#{ext}"
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
  postURL: (boardID, threadID, postID) ->
    if Build.sameThread boardID, threadID
      "#p#{postID}"
    else
      "/#{boardID}/thread/#{threadID}#p#{postID}"
  postFromObject: (data, boardID) ->
    o =
      # id
      postID:   data.no
      threadID: data.resto or data.no
      boardID:  boardID
      # info
      name:     Build.unescape data.name
      capcode:  data.capcode
      tripcode: data.trip
      uniqueID: data.id
      email:    Build.unescape data.email
      subject:  Build.unescape data.sub
      flagCode: data.country
      flagName: Build.unescape data.country_name
      date:     data.now
      dateUTC:  data.time
      comment:  {innerHTML: data.com or ''}
      # thread status
      isSticky: !!data.sticky
      isClosed: !!data.closed
      isArchived: !!data.archived
      # file
    if data.filedeleted
      o.file =
        isDeleted: true
    else if data.ext
      o.file =
        name:      (Build.unescape data.filename) + data.ext
        timestamp: "#{data.tim}#{data.ext}"
        url: if boardID is 'f'
          "//i.4cdn.org/#{boardID}/#{encodeURIComponent data.filename}#{data.ext}"
        else
          "//i.4cdn.org/#{boardID}/#{data.tim}#{data.ext}"
        height:    data.h
        width:     data.w
        MD5:       data.md5
        size:      data.fsize
        turl:      "//i.4cdn.org/#{boardID}/#{data.tim}s.jpg"
        theight:   data.tn_h
        twidth:    data.tn_w
        isSpoiler: !!data.spoiler
        isDeleted: false
        tag:       data.tag
    Build.post o
  post: (o) ->
    ###
    This function contains code from 4chan-JS (https://github.com/4chan/4chan-JS).
    @license: https://github.com/4chan/4chan-JS/blob/master/LICENSE
    ###
    {
      postID, threadID, boardID
      name, capcode, tripcode, uniqueID, email, subject, flagCode, flagName, date, dateUTC
      comment
      file
    } = o
    name    or= ''
    subject or= ''
    isOP = postID is threadID
    {staticPath, gifIcon} = Build

    ### Post Info ###

    if capcode
      capcodeLC = capcode.split('_')[0]
      capcodeUC = capcodeLC[0].toUpperCase() + capcodeLC[1..]
      capcodeText   = capcodeUC
      capcodeLong   = {'Admin': 'Administrator', 'Mod': 'Moderator'}[capcodeUC] or capcodeUC
      capcodePlural = "#{capcodeLong}s"
      capcodeDescription = "a 4chan #{capcodeLong}"
      if capcode is 'admin_emeritus'
        capcodeText        = 'Admin Emeritus'
        capcodePlural      = 'the Administrator Emeritus'
        capcodeDescription = "4chan's founding Administrator"

    postLink = Build.postURL boardID, threadID, postID
    quoteLink = if Build.sameThread boardID, threadID
      "javascript:quote('#{+postID}');"
    else
      "/#{boardID}/thread/#{threadID}#q#{postID}"

    postInfo = <%= html(
      '<div class="postInfo desktop" id="pi${postID}">' +
        '<input type="checkbox" name="${postID}" value="delete"> ' +
        '?{isOP || boardID === "f"}{<span class="subject">${subject}</span> }' +
        '<span class="nameBlock?{capcode}{ capcode${capcodeUC}}">' +
          '?{email}{<a href="mailto:${encodeURIComponent(email).replace(/%40/g, "@")}" class="useremail">}' +
            '<span class="name?{capcode}{ capcode}">${name}</span>' +
            '?{tripcode}{ <span class="postertrip">${tripcode}</span>}' +
            '?{capcode}{ <strong class="capcode hand id_${capcodeLC}" title="Highlight posts by ${capcodePlural}">## ${capcodeText}</strong>}' +
          '?{email}{</a>}' +
          '?{boardID === "f" && isOP || capcode}{}{ }' +
          '?{capcode}{ <img src="${staticPath}${capcodeLC}icon${gifIcon}" alt="${capcodeUC} Icon" title="This user is ${capcodeDescription}." class="identityIcon retina">}' +
          '?{uniqueID && !capcode}{ <span class="posteruid id_${uniqueID}">(ID: <span class="hand" title="Highlight posts by this ID">${uniqueID}</span>)</span>}' +
          '?{flagCode}{ <span title="${flagName}" class="flag flag-${flagCode.toLowerCase()}"></span>}' +
        '</span> ' +
        '<span class="dateTime" data-utc="${dateUTC}">${date}</span> ' +
        '<span class="postNum?{!(boardID === "f" && isOP)}{ desktop}">' +
          '<a href="${postLink}" title="Link to this post">No.</a>' +
          '<a href="${quoteLink}" title="Reply to this post">${postID}</a>' +
          '?{o.isSticky}{ <img src="${staticPath}sticky${gifIcon}" alt="Sticky" title="Sticky" class="stickyIcon retina">}' +
          '?{o.isClosed && !o.isArchived}{ <img src="${staticPath}closed${gifIcon}" alt="Closed" title="Closed" class="closedIcon retina">}' +
          '?{o.isArchived}{ <img src="${staticPath}archived${gifIcon}" alt="Archived" title="Archived" class="archivedIcon retina">}' +
          '?{isOP && g.VIEW === "index"}{ &nbsp; <span>[<a href="/${boardID}/thread/${threadID}" class="replylink">Reply</a>]</span>}' +
        '</span>' +
      '</div>'
    ) %>

    ### File Info ###

    if file and not file.isDeleted
      shortFilename = Build.shortFilename file.name
      fileSize = $.bytesToString file.size
      fileDims = if file.url[-4..] is '.pdf' then 'PDF' else "#{file.width}x#{file.height}"

    fileBlock = <%= html(
      '?{file}{<div class="file" id="f${postID}">' +
        '?{file.isDeleted}{' +
          '<span class="fileThumb">' +
            '<img src="${staticPath}filedeleted-res${gifIcon}" alt="File deleted." class="fileDeletedRes retina">' +
          '</span>' +
        '}{?{boardID === "f"}{' +
          '<div class="fileInfo"><span class="fileText" id="fT${postID}">' +
            'File: ' +
            '<a data-width="${file.width}" data-height="${file.height}" href="${file.url}" target="_blank">${file.name}</a>' +
            '-(${fileSize}, ${fileDims}, ${file.tag})' +
          '</span></div>' +
        '}{' +
          '<div class="fileText" id="fT${postID}"?{file.isSpoiler}{ title="${file.name}"}>' +
            'File: ' +
            '<a?{file.name === shortFilename || file.isSpoiler}{}{ title="${file.name}"} href="${file.url}" target="_blank">' +
              '?{file.isSpoiler}{Spoiler Image}{${shortFilename}}' +
            '</a> ' +
            '(${fileSize}, ${fileDims})' +
          '</div>' +
          '<a class="fileThumb?{file.isSpoiler}{ imgspoiler}{}" href="${file.url}" target="_blank">' +
            '<img ' +
              'src="${file.isSpoiler ? Build.spoilerThumb(boardID) : file.turl}" ' +
              'alt="${fileSize}" ' +
              'data-md5="${file.MD5}" ' +
              'style="height: ${file.isSpoiler ? 100 : file.theight}px; width: ${file.isSpoiler ? 100 : file.twidth}px;"' +
            '>' +
          '</a>' +
        '}}' +
      '</div>}'
    ) %>

    ### Whole Post ###

    postClass = if isOP then 'op' else 'reply'

    wholePost = <%= html(
      '?{!isOP}{<div class="sideArrows" id="sa${postID}">&gt;&gt;</div>}' +
      '<div id="p${postID}" class="post ${postClass}?{capcode === "admin_highlight"}{ highlightPost}">' +
        '?{isOP}{&{fileBlock}&{postInfo}}{&{postInfo}&{fileBlock}}' +
        '<blockquote class="postMessage" id="m${postID}">&{comment}</blockquote>' +
      '</div>'
    ) %>

    container = $.el 'div',
      className: "postContainer #{postClass}Container"
      id:        "pc#{postID}"
    $.extend container, wholePost

    # Fix pathnames
    for quote in $$ '.quotelink', container
      href = quote.getAttribute 'href'
      if (href[0] is '#') and !(Build.sameThread boardID, threadID)
        quote.href = "/#{boardID}/thread/#{threadID}" + href
      else if (match = href.match /^\/([^\/]+)\/thread\/(\d+)/) and (Build.sameThread match[1], match[2])
        quote.href = href.match(/(#[^#]*)?$/)[0] or '#'

    container

  summary: (boardID, threadID, posts, files) ->
    text = []
    text.push "#{posts} post#{if posts > 1 then 's' else ''}"
    text.push "and #{files} image repl#{if files > 1 then 'ies' else 'y'}" if files
    text.push 'omitted.'
    $.el 'a',
      className: 'summary'
      textContent: text.join ' '
      href: "/#{boardID}/thread/#{threadID}"

  thread: (board, data, full) ->
    Build.spoilerRange[board] = data.custom_spoiler

    if OP = board.posts[data.no]
      OP = null if OP.isFetchedQuote

    if OP and (root = OP.nodes.root.parentNode)
      $.rmAll root
    else
      root = $.el 'div',
        className: 'thread'
        id: "t#{data.no}"

    $.add root, Build[if full then 'fullThread' else 'excerptThread'] board, data, OP
    root

  excerptThread: (board, data, OP) ->
    nodes = [if OP then OP.nodes.root else Build.postFromObject data, board.ID]
    if data.omitted_posts or !Conf['Show Replies'] and data.replies
      [posts, files] = if Conf['Show Replies']
        # XXX data.omitted_images is not accurate.
        [data.omitted_posts, data.images - data.last_replies.filter((data) -> !!data.ext).length]
      else
        [data.replies, data.images]
      nodes.push Build.summary board.ID, data.no, posts, files
    nodes

  fullThread: (board, data) -> Build.postFromObject data, board.ID

  catalogThread: (thread) ->
    {staticPath, gifIcon} = Build
    data = Index.liveThreadData[Index.liveThreadIDs.indexOf thread.ID]

    if data.spoiler and !Conf['Reveal Spoiler Thumbnails']
      src = "#{staticPath}spoiler"
      if spoilerRange = Build.spoilerRange[thread.board]
        # Randomize the spoiler image.
        src += "-#{thread.board}" + Math.floor 1 + spoilerRange * Math.random()
      src += '.png'
      imgClass = 'spoiler-file'
    else if data.filedeleted
      src = "#{staticPath}filedeleted-res#{gifIcon}"
      imgClass = 'deleted-file'
    else if thread.OP.file
      src = thread.OP.file.thumbURL
    else
      src = "#{staticPath}nofile.png"
      imgClass = 'no-file'

    thumb = if imgClass
      <%= html('<img src="${src}" class="catalog-thumb ${imgClass}">') %>
    else
      <%= html('<img src="${src}" class="catalog-thumb" data-width="${data.tn_w}" data-height="${data.tn_h}">') %>

    postCount = data.replies + 1
    fileCount = data.images  + !!data.ext
    pageCount = Index.liveThreadIDs.indexOf(thread.ID) // Index.threadsNumPerPage + 1

    subject = if thread.OP.info.subject
      <%= html('<div class="subject">${thread.OP.info.subject}</div>') %>
    else
      <%= html('') %>

    comment = innerHTML: data.com or ''

    root = $.el 'div',
      className: 'catalog-thread'

    $.extend root, <%= html(
      '<a href="/${thread.board}/thread/${thread.ID}">' +
        '&{thumb}' +
      '</a>' +
      '<div class="catalog-stats" title="Post count / File count / Page count">' +
        '<span class="post-count">${postCount}</span> / <span class="file-count">${fileCount}</span> / <span class="page-count">${pageCount}</span>' +
        '<span class="catalog-icons"></span>' +
      '</div>' +
      '&{subject}' +
      '<div class="comment">&{comment}</div>'
    ) %>

    root.dataset.fullID = thread.fullID
    $.addClass root, thread.OP.highlights... if thread.OP.highlights

    for quote in $$ '.quotelink', root.lastElementChild
      href = quote.getAttribute 'href'
      quote.href = "/#{thread.board}/thread/#{thread.ID}" + href if href[0] is '#'

    for exif in $$ '.abbr, .exif', root.lastElementChild
      $.rm exif

    for pp in $$ '.prettyprint', root.lastElementChild
      cc = $.el 'span', className: 'catalog-code'
      $.add cc, [pp.childNodes...]
      $.replace pp, cc

    for br in $$ 'br', root.lastElementChild when br.previousSibling?.nodeName is 'BR'
      $.rm br

    if thread.isSticky
      $.add $('.catalog-icons', root), $.el 'img',
        src: "#{staticPath}sticky#{gifIcon}"
        className: 'stickyIcon'
        title: 'Sticky'

    if thread.isClosed
      $.add $('.catalog-icons', root), $.el 'img',
        src: "#{staticPath}closed#{gifIcon}"
        className: 'closedIcon'
        title: 'Closed'

    if data.bumplimit
      $.addClass $('.post-count', root), 'warning'

    if data.imagelimit
      $.addClass $('.file-count', root), 'warning'

    root
