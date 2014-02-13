Build =
  staticPath: '//s.4cdn.org/image/'
  gifIcon: if window.devicePixelRatio >= 2 then '@2x.gif' else '.gif'
  spoilerRange: {}
  shortFilename: (filename, isReply) ->
    # FILENAME SHORTENING SCIENCE:
    # OPs have a +10 characters threshold.
    # The file extension is not taken into account.
    threshold = if isReply then 30 else 40
    if filename.length - 4 > threshold
      "#{filename[...threshold - 5]}(...).#{filename[-3..]}"
    else
      filename
  thumbRotate: do ->
    n = 0
    -> n = (n + 1) % 2
  postFromObject: (data, boardID) ->
    o =
      # id
      postID:   data.no
      threadID: data.resto or data.no
      boardID:  boardID
      # info
      name:     data.name
      capcode:  data.capcode
      tripcode: data.trip
      uniqueID: data.id
      email:    if data.email then encodeURI data.email.replace /&quot;/g, '"' else ''
      subject:  data.sub
      flagCode: data.country
      flagName: data.country_name
      date:     data.now
      dateUTC:  data.time
      comment:  data.com
      # thread status
      isSticky: !!data.sticky
      isClosed: !!data.closed
      # file
    if data.ext or data.filedeleted
      o.file =
        name:      data.filename + data.ext
        timestamp: "#{data.tim}#{data.ext}"
        url: if boardID is 'f'
          "//i.4cdn.org/#{boardID}/src/#{data.filename}#{data.ext}"
        else
          "//i.4cdn.org/#{boardID}/src/#{data.tim}#{data.ext}"
        height:    data.h
        width:     data.w
        MD5:       data.md5
        size:      data.fsize
        turl:      "//#{Build.thumbRotate()}.t.4cdn.org/#{boardID}/thumb/#{data.tim}s.jpg"
        theight:   data.tn_h
        twidth:    data.tn_w
        isSpoiler: !!data.spoiler
        isDeleted: !!data.filedeleted
    Build.post o
  post: (o, isArchived) ->
    {
      postID, threadID, boardID
      name, capcode, tripcode, uniqueID, email, subject, flagCode, flagName, date, dateUTC
      isSticky, isClosed
      comment
      file
    } = o
    isOP = postID is threadID
    {staticPath, gifIcon} = Build

    tripcode = if tripcode
      " <span class=postertrip>#{tripcode}</span>"
    else
      ''

    if email
      emailStart = '<a href="mailto:' + email + '" class="useremail">'
      emailEnd   = '</a>'
    else
      emailStart = ''
      emailEnd   = ''

    switch capcode
      when 'admin', 'admin_highlight'
        capcodeClass = " capcodeAdmin"
        capcodeStart = " <strong class='capcode hand id_admin'" +
          "title='Highlight posts by the Administrator'>## Admin</strong>"
        capcodeIcon  = " <img src='#{staticPath}adminicon#{gifIcon}' " +
          "title='This user is the 4chan Administrator.' class=identityIcon>"
      when 'mod'
        capcodeClass = " capcodeMod"
        capcodeStart = " <strong class='capcode hand id_mod' " +
          "title='Highlight posts by Moderators'>## Mod</strong>"
        capcodeIcon  = " <img src='#{staticPath}modicon#{gifIcon}' " +
          "title='This user is a 4chan Moderator.' class=identityIcon>"
      when 'developer'
        capcodeClass = " capcodeDeveloper"
        capcodeStart = " <strong class='capcode hand id_developer' " +
          "title='Highlight posts by Developers'>## Developer</strong>"
        capcodeIcon  = " <img src='#{staticPath}developericon#{gifIcon}' " +
          "title='This user is a 4chan Developer.' class=identityIcon>"
      else
        capcodeClass = ''
        capcodeStart = ''
        capcodeIcon  = ''

    userID = if uniqueID and !capcode
      " <span class='posteruid id_#{uniqueID}'>(ID: " +
        "<span class=hand title='Highlight posts by this ID'>#{uniqueID}</span>)</span>"
    else
      ''

    flag = unless flagCode
      ''
    else if boardID is 'pol'
      " <img src='#{staticPath}country/troll/#{flagCode.toLowerCase()}.gif' title='#{flagName}' class=countryFlag>"
    else
      " <span title='#{flagName}' class='flag flag-#{flagCode.toLowerCase()}'></span>"

    if file?.isDeleted
      fileHTML = if isOP
        "<div class=file id=f#{postID}><span class=fileThumb>" +
          "<img src='#{staticPath}filedeleted#{gifIcon}' class=fileDeleted>" +
        "</span></div>"
      else
        "<div class=file id=f#{postID}><span class=fileThumb>" +
          "<img src='#{staticPath}filedeleted-res#{gifIcon}' class=fileDeletedRes>" +
        "</span></div>"
    else if file
      fileSize  = $.bytesToString file.size
      fileThumb = file.turl
      if file.isSpoiler
        fileSize = "Spoiler Image, #{fileSize}"
        unless isArchived
          fileThumb = "#{staticPath}spoiler"
          if spoilerRange = Build.spoilerRange[boardID]
            # Randomize the spoiler image.
            fileThumb += "-#{boardID}" + Math.floor 1 + spoilerRange * Math.random()
          fileThumb += '.png'
          file.twidth = file.theight = 100

      imgSrc = if boardID is 'f'
        ''
      else
        "<a class='fileThumb#{if file.isSpoiler then ' imgspoiler' else ''}' href='#{file.url}' target=_blank>" +
          "<img src='#{fileThumb}' alt='#{fileSize}' data-md5=#{file.MD5} style='height: #{file.theight}px; width: #{file.twidth}px;'>" +
        "</a>"

      # html -> text, translate WebKit's %22s into "s
      a = $.el 'a', innerHTML: file.name
      filename = a.textContent.replace /%22/g, '"'
      # shorten filename, get html
      a.textContent = Build.shortFilename filename
      shortFilename = a.innerHTML
      # get html
      a.textContent = filename
      filename      = a.innerHTML.replace /'/g, '&apos;'

      fileDims = if file.name[-3..] is 'pdf' then 'PDF' else "#{file.width}x#{file.height}"
      fileInfo = "<div class=fileText id=fT#{postID}#{if file.isSpoiler then " title='#{filename}'" else ''}>File: <a href='#{file.url}' target=_blank>#{file.timestamp}</a>" +
        "-(#{fileSize}, #{fileDims}#{
          if file.isSpoiler
            ''
          else
            ", <span#{if filename isnt shortFilename then " title='#{filename}'" else ''}>#{shortFilename}</span>"
        }" + ")</div>"

      fileHTML = "<div class=file id=f#{postID}>#{fileInfo}#{imgSrc}</div>"
    else
      fileHTML = ''

    sticky = if isSticky
      " <img src=#{staticPath}sticky#{gifIcon} title=Sticky class=stickyIcon>"
    else
      ''
    closed = if isClosed
      " <img src=#{staticPath}closed#{gifIcon} title=Closed class=closedIcon>"
    else
      ''

    if isOP and g.VIEW is 'index'
      pageNum   = Index.liveThreadIDs.indexOf(postID) // Index.threadsNumPerPage
      pageIcon  = " <span class=page-num title='This thread is on page #{pageNum} in the original index.'>Page #{pageNum}</span>"
      replyLink = " &nbsp; <span>[<a href='/#{boardID}/res/#{threadID}' class=replylink>Reply</a>]</span>"
    else
      pageIcon = replyLink = ''

    container = $.el 'div',
      id: "pc#{postID}"
      className: "postContainer #{if isOP then 'op' else 'reply'}Container"
      innerHTML: \
      (if isOP then '' else "<div class=sideArrows id=sa#{postID}>&gt;&gt;</div>") +
      "<div id=p#{postID} class='post #{if isOP then 'op' else 'reply'}#{
        if capcode is 'admin_highlight'
          ' highlightPost'
        else
          ''
        }'>" +

        (if isOP then fileHTML else '') +

        "<div class='postInfo' id=pi#{postID}>" +
          "<input type=checkbox name=#{postID} value=delete> " +
          "<span class=subject>#{subject or ''}</span> " +
          "<span class='nameBlock#{capcodeClass}'>" +
            emailStart +
              "<span class=name>#{name or ''}</span>" + tripcode +
            capcodeStart + emailEnd + capcodeIcon + userID + flag +
          ' </span> ' +
          "<span class=dateTime data-utc=#{dateUTC}>#{date}</span> " +
          "<span class='postNum'>" +
            "<a href=#{"/#{boardID}/res/#{threadID}#p#{postID}"} title='Highlight this post'>No.</a>" +
            "<a href='#{
              if g.VIEW is 'thread' and g.THREADID is threadID
                "javascript:quote(#{postID})"
              else
                "/#{boardID}/res/#{threadID}#q#{postID}"
              }' title='Quote this post'>#{postID}</a>" +
            pageIcon + sticky + closed + replyLink +
          '</span>' +
        '</div>' +

        (if isOP then '' else fileHTML) +

        "<blockquote class=postMessage id=m#{postID}>#{comment or ''}</blockquote> " +

      '</div>'

    for quote in $$ '.quotelink', container
      href = quote.getAttribute 'href'
      continue if href[0] is '/' # Cross-board quote, or board link
      quote.href = "/#{boardID}/res/#{href}" # Fix pathnames

    container

  summary: (boardID, threadID, posts, files) ->
    text = []
    text.push "#{posts} post#{if posts > 1 then 's' else ''}"
    text.push "and #{files} image repl#{if files > 1 then 'ies' else 'y'}" if files
    text.push 'omitted.'
    $.el 'a',
      className: 'summary'
      textContent: text.join ' '
      href: "/#{boardID}/res/#{threadID}"
  thread: (board, data) ->
    Build.spoilerRange[board] = data.custom_spoiler

    if (OP = board.posts[data.no]) and root = OP.nodes.root.parentNode
      $.rmAll root
    else
      root = $.el 'div',
        className: 'thread'
        id: "t#{data.no}"

    nodes = [if OP then OP.nodes.root else Build.postFromObject data, board.ID]
    if data.omitted_posts or !Conf['Show Replies'] and data.replies
      [posts, files] = if Conf['Show Replies']
        [data.omitted_posts, data.omitted_images]
      else
        [data.replies, data.images]
      nodes.push Build.summary board.ID, data.no, posts, files

    $.add root, nodes
    root
  catalogThread: (thread) ->
    {staticPath, gifIcon} = Build
    data = Index.liveThreadData[Index.liveThreadIDs.indexOf thread.ID]

    postCount = data.replies + 1
    fileCount = data.images  + !!data.ext
    pageCount = Index.liveThreadIDs.indexOf(thread.ID) // Index.threadsNumPerPage

    subject = if thread.OP.info.subject
      "<div class='subject'>#{thread.OP.info.subject}</div>"
    else
      ''
    comment = thread.OP.nodes.comment.innerHTML.replace /(<br>\s*){2,}/g, '<br>'

    root = $.el 'div',
      className: 'catalog-thread'
      innerHTML: <%= importHTML('General/Thread-catalog-view') %>

    root.dataset.fullID = thread.fullID
    $.addClass root, 'pinned' if thread.isPinned
    $.addClass root, thread.OP.highlights... if thread.OP.highlights

    thumb = root.firstElementChild
    if data.spoiler and !Conf['Reveal Spoilers']
      src = "#{staticPath}spoiler"
      if spoilerRange = Build.spoilerRange[thread.board]
        # Randomize the spoiler image.
        src += "-#{thread.board}" + Math.floor 1 + spoilerRange * Math.random()
      src += '.png'
      $.addClass thumb, 'spoiler-file'
    else if data.filedeleted
      src = "#{staticPath}filedeleted-res#{gifIcon}"
      $.addClass thumb, 'deleted-file'
    else if thread.OP.file
      src = thread.OP.file.thumbURL
      thumb.dataset.width  = data.tn_w
      thumb.dataset.height = data.tn_h
    else
      src = "#{staticPath}nofile.png"
      $.addClass thumb, 'no-file'
    thumb.style.backgroundImage = "url(#{src})"
    if Conf['Open threads in a new tab']
      thumb.target = '_blank'

    for quotelink in $$ '.quotelink', root.lastElementChild
      $.replace quotelink, [quotelink.childNodes...]
    for pp in $$ '.prettyprint', root.lastElementChild
      $.replace pp, $.tn pp.textContent

    if thread.isSticky
      $.add $('.thread-icons', root), $.el 'img',
        src: "#{staticPath}sticky#{gifIcon}"
        className: 'stickyIcon'
        title: 'Sticky'
    if thread.isClosed
      $.add $('.thread-icons', root), $.el 'img',
        src: "#{staticPath}closed#{gifIcon}"
        className: 'closedIcon'
        title: 'Closed'

    if data.bumplimit
      $.addClass $('.post-count', root), 'warning'
    if data.imagelimit
      $.addClass $('.file-count', root), 'warning'

    root
