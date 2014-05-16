Build =
  h_staticPath: '//s.4cdn.org/image/'
  h_gifIcon: if window.devicePixelRatio >= 2 then '@2x.gif' else '.gif'
  spoilerRange: {}
  h_escape: (text) ->
    (text+'').replace /[&"'<>]/g, (c) ->
      {'&': '&amp;', "'": '&#039;', '"': '&quot;', '<': '&lt;', '>': '&gt;'}[c]
  unescape: (text) ->
    return text unless text?
    text.replace /&(amp|#039|quot|lt|gt);/g, (c) ->
      {'&amp;': '&', '&#039;': "'", '&quot;': '"', '&lt;': '<', '&gt;': '>'}[c]
  shortFilename: (filename, isReply) ->
    # FILENAME SHORTENING SCIENCE:
    # OPs have a +10 characters threshold.
    # The file extension is not taken into account.
    threshold = if isReply then 30 else 40
    ext = filename.match(/\.?[^\.]*$/)[0]
    if filename.length - ext.length > threshold
      "#{filename[...threshold - 5]}(...)#{ext}"
    else
      filename
  thumbRotate: do ->
    n = 0
    -> n = (n + 1) % 3
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
      h_comment: data.com or ''
      # thread status
      isSticky: !!data.sticky
      isClosed: !!data.closed
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
        turl:      "//#{Build.thumbRotate()}.t.4cdn.org/#{boardID}/#{data.tim}s.jpg"
        theight:   data.tn_h
        twidth:    data.tn_w
        isSpoiler: !!data.spoiler
        isDeleted: false
    Build.post o
  post: (o, isArchived) ->
    ###
    This function contains code from 4chan-JS (https://github.com/4chan/4chan-JS).
    @license: https://github.com/4chan/4chan-JS/blob/master/LICENSE
    ###
    E = Build.h_escape
    {
      postID, threadID, boardID
      name, capcode, tripcode, uniqueID, email, subject, flagCode, flagName, date, dateUTC
      isSticky, isClosed
      h_comment
      file
    } = o
    name    or= ''
    subject or= ''
    isOP = postID is threadID
    {h_staticPath, h_gifIcon} = Build

    if isOP
      h_sideArrows = ''
    else
      h_sideArrows = "<div class='sideArrows' id='sa#{+postID}'>&gt;&gt;</div>"

    h_postClass = "post #{if isOP then 'op' else 'reply'}#{if capcode is 'admin_highlight' then ' highlightPost' else ''}"

    if tripcode
      h_tripcode = " <span class='postertrip'>#{E tripcode}</span>"
    else
      h_tripcode = ''

    if email
      h_emailStart = "<a href='mailto:#{E encodeURIComponent(email)}' class='useremail'>"
      h_emailEnd   = '</a>'
    else
      h_emailStart = ''
      h_emailEnd   = ''

    switch capcode
      when 'admin', 'admin_highlight'
        h_capcodeClass = ' capcodeAdmin'
        h_capcodeStart = ' <strong class="capcode hand id_admin" title="Highlight posts by the Administrator">## Admin</strong>'
        h_capcodeIcon  = " <img src='#{h_staticPath}adminicon#{h_gifIcon}' title='This user is the 4chan Administrator.' class='identityIcon'>"
      when 'mod'
        h_capcodeClass = ' capcodeMod'
        h_capcodeStart = ' <strong class="capcode hand id_mod" title="Highlight posts by Moderators">## Mod</strong>'
        h_capcodeIcon  = " <img src='#{h_staticPath}modicon#{h_gifIcon}' title='This user is a 4chan Moderator.' class='identityIcon'>"
      when 'developer'
        h_capcodeClass = ' capcodeDeveloper'
        h_capcodeStart = ' <strong class="capcode hand id_developer" title="Highlight posts by Developers">## Developer</strong>'
        h_capcodeIcon  = " <img src='#{h_staticPath}developericon#{h_gifIcon}' title='This user is a 4chan Developer.' class='identityIcon'>"
      else
        h_capcodeClass = ''
        h_capcodeStart = ''
        h_capcodeIcon  = ''

    if !capcode and uniqueID
      h_userID = " <span class='posteruid id_#{E uniqueID}'>(ID: <span class='hand' title='Highlight posts by this ID'>#{E uniqueID}</span>)</span> "
    else
      h_userID = ''

    unless flagCode
      h_flag = ''
    else if boardID is 'pol'
      h_flag = " <img src='#{h_staticPath}country/troll/#{E flagCode.toLowerCase()}.gif' alt='#{E flagCode}' title='#{E flagName}' class='countryFlag'>"
    else
      h_flag = " <span title='#{E flagName}' class='flag flag-#{E flagCode.toLowerCase()}'></span>"

    if file?.isDeleted
      if isOP
        h_file  = "<div class='file' id='f#{+postID}'><span class='fileThumb'>"
        h_file +=   "<img src='#{h_staticPath}filedeleted#{h_gifIcon}' alt='File deleted.' class='fileDeleted'>"
        h_file += '</span></div>'
      else
        h_file  = "<div class='file' id='f#{+postID}'><span class='fileThumb'>"
        h_file +=   "<img src='#{h_staticPath}filedeleted-res#{h_gifIcon}' alt='File deleted.' class='fileDeletedRes'>"
        h_file += '</span></div>'
    else if file
      fileSize  = $.bytesToString file.size
      fileThumb = file.turl
      if file.isSpoiler
        fileSize = "Spoiler Image, #{fileSize}"
        unless isArchived
          fileThumb = "#{h_staticPath}spoiler"
          if spoilerRange = Build.spoilerRange[boardID]
            # Randomize the spoiler image.
            fileThumb += "-#{boardID}" + Math.floor 1 + spoilerRange * Math.random()
          fileThumb += '.png'
          file.twidth = file.theight = 100
      shortFilename = Build.shortFilename file.name

      if boardID is 'f'
        h_imgSrc = ''
      else
        h_imgSrc  = "<a class='fileThumb#{if file.isSpoiler then ' imgspoiler' else ''}' href='#{E file.url}' target='_blank'>"
        h_imgSrc +=   "<img src='#{E fileThumb}' alt='#{E fileSize}' data-md5='#{E file.MD5}' style='height: #{+file.theight}px; width: #{+file.twidth}px;'>"
        h_imgSrc += '</a>'

      if file.url[-4..] is '.pdf'
        h_fileDims = 'PDF'
      else
        h_fileDims = "#{+file.width}x#{+file.height}"
      h_fileInfo    = "<div class='fileText' id='fT#{+postID}'"
      if file.isSpoiler
        h_fileInfo +=     " title='#{E file.name}'"
      h_fileInfo   +=   ">File: <a href='#{E file.url}' target='_blank'>#{E file.timestamp}</a>"
      h_fileInfo   +=   "-(#{E fileSize}, #{h_fileDims}"
      unless file.isSpoiler
        h_fileInfo +=   ", <span#{if file.name isnt shortFilename then " title='#{E file.name}'" else ''}>#{E shortFilename}</span>"
      h_fileInfo   +=   ')</div>'

      h_file = "<div class='file' id='f#{+postID}'>#{h_fileInfo}#{h_imgSrc}</div>"
    else
      h_file = ''

    if g.VIEW is 'thread' and g.THREADID is +threadID
      h_quoteLink = "javascript:quote(#{+postID})"
    else
      h_quoteLink = "/#{E boardID}/thread/#{+threadID}\#q#{+postID}"

    if isSticky
      h_sticky = " <img src='#{h_staticPath}sticky#{h_gifIcon}' alt='Sticky' title='Sticky' class='stickyIcon'>"
    else
      h_sticky = ''
    if isClosed
      h_closed = " <img src='#{h_staticPath}closed#{h_gifIcon}' alt='Closed' title='Closed' class='closedIcon'>"
    else
      h_closed = ''

    if isOP and g.VIEW is 'index' and Conf['JSON Navigation']
      pageNum   = Math.floor(Index.liveThreadIDs.indexOf(postID) / Index.threadsNumPerPage) + 1
      h_pageIcon  = " <span class='page-num' title='This thread is on page #{+pageNum} in the original index.'>[#{+pageNum}]</span>"
    else
      h_pageIcon = ''

    if isOP and g.VIEW is 'index'
      h_replyLink = " &nbsp; <span>[<a href='/#{E boardID}/thread/#{+threadID}' class='replylink'>Reply</a>]</span>"
    else
      h_replyLink = ''

    container = $.el 'div',
      id: "pc#{postID}"
      className: "postContainer #{if isOP then 'op' else 'reply'}Container"
      innerHTML: <%= grunt.file.read('src/General/html/Build/post.html').replace(/>\s+/g, '>').replace(/\s+</g, '<').replace(/\s+/g, ' ').trim() %>

    # Fix pathnames
    for quote in $$ '.quotelink', container
      href = quote.getAttribute 'href'
      continue if href[0] is '/' # Cross-board quote, or board link
      if href[0] is '#'
        quote.href = "/#{boardID}/thread/#{threadID}#{href}"
      else
        quote.href = "/#{boardID}/thread/#{href}"

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

    if (OP = board.posts[data.no]) and root = OP.nodes.root.parentNode
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
        [data.omitted_posts, data.omitted_images]
      else
        # XXX data.images is not accurate.
        [data.replies, data.omitted_images + data.last_replies.filter((data) -> !!data.ext).length]
      nodes.push Build.summary board.ID, data.no, posts, files
    nodes

  fullThread: (board, data) -> Build.postFromObject data, board.ID
