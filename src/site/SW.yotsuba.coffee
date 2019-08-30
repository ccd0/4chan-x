SW.yotsuba =
  isOPContainerThread: false
  hasIPCount: true

  urls:
    thread:     ({boardID, threadID}) -> "#{location.protocol}//#{BoardConfig.domain(boardID)}/#{boardID}/thread/#{threadID}"
    post:       ({postID})            -> "#p#{postID}"
    index:      ({boardID})           -> "#{location.protocol}//#{BoardConfig.domain(boardID)}/#{boardID}/"
    catalog:    ({boardID})           -> if boardID is 'f' then undefined else "#{location.protocol}//#{BoardConfig.domain(boardID)}/#{boardID}/catalog"
    archive:    ({boardID})           -> if BoardConfig.isArchived(boardID) then "#{location.protocol}//#{BoardConfig.domain(boardID)}/#{boardID}/archive" else undefined
    threadJSON: ({boardID, threadID}) -> "#{location.protocol}//a.4cdn.org/#{boardID}/thread/#{threadID}.json"
    threadsListJSON: ({boardID})      -> "#{location.protocol}//a.4cdn.org/#{boardID}/threads.json"
    archiveListJSON: ({boardID})      -> if BoardConfig.isArchived(boardID) then "#{location.protocol}//a.4cdn.org/#{boardID}/archive.json" else ''
    catalogJSON:     ({boardID})      -> "#{location.protocol}//a.4cdn.org/#{boardID}/catalog.json"
    file: ({boardID}, filename) ->
      hostname = if boardID is 'f' then ImageHost.flashHost() else ImageHost.host()
      "#{location.protocol}//#{hostname}/#{boardID}/#{filename}"
    thumb: ({boardID}, filename) ->
      "#{location.protocol}//#{ImageHost.thumbHost()}/#{boardID}/#{filename}"

  isPrunedByAge:   ({boardID}) -> boardID is 'f'
  areMD5sDeferred: ({boardID}) -> boardID is 'f'
  isOnePage:       ({boardID}) -> boardID is 'f'
  noAudio: ({boardID}) -> BoardConfig.noAudio(boardID)

  selectors:
    board:         '.board'
    thread:        '.thread'
    threadDivider: '.board > hr'
    summary:       '.summary'
    postContainer: '.postContainer'
    replyOriginal: '.replyContainer:not([data-clone])'
    sideArrows:    'div.sideArrows'
    post:          '.post'
    infoRoot:      '.postInfo'
    info:
      subject:   '.subject'
      name:      '.name'
      email:     '.useremail'
      tripcode:  '.postertrip'
      uniqueIDRoot: '.posteruid'
      uniqueID:  '.posteruid > .hand'
      capcode:   '.capcode.hand'
      pass:      '.n-pu'
      flag:      '.flag, .countryFlag'
      date:      '.dateTime'
      nameBlock: '.nameBlock'
      quote:     '.postNum > a:nth-of-type(2)'
      reply:     '.replylink'
    icons:
      isSticky:   '.stickyIcon'
      isClosed:   '.closedIcon'
      isArchived: '.archivedIcon'
    file:
      text:  '.file > :first-child'
      link:  '.fileText > a'
      thumb: 'a.fileThumb > [data-md5]'
    thumbLink: 'a.fileThumb'
    highlightable:
      op:      '.opContainer'
      reply:   ' > .reply'
      catalog: ''
    comment:   '.postMessage'
    spoiler:   's'
    quotelink: ':not(pre) > .quotelink' # XXX https://github.com/4chan/4chan-JS/issues/77: 4chan currently creates quote links inside [code] tags; ignore them
    catalog:
      board:  '#threads'
      thread: '.thread'
      thumb:  '.thumb'
    boardList: '#boardNavDesktop > .boardList'
    boardListBottom: '#boardNavDesktopFoot > .boardList'
    styleSheet: 'link[title=switch]'
    psa:       '#globalMessage'
    psaTop:    '#globalToggle'
    searchBox: '#search-box'
    nav:
      prev: '.prev > form > [type=submit]'
      next: '.next > form > [type=submit]'

  classes:
    highlight: 'highlight'

  xpath:
    thread:         'div[contains(concat(" ",@class," ")," thread ")]'
    postContainer:  'div[contains(@class,"postContainer")]'
    replyContainer: 'div[contains(@class,"replyContainer")]'

  regexp:
    quotelink:
      ///
        ^https?://boards\.4chan(?:nel)?\.org/+
        ([^/]+) # boardID
        /+thread/+
        (\d+)   # threadID
        (?:[/?][^#]*)?
        (?:#p
        (\d+)   # postID
        )?
        $
      ///
    quotelinkHTML:
      /<a [^>]*\bhref="(?:(?:\/\/boards\.4chan(?:nel)?\.org)?\/([^\/]+)\/thread\/)?(\d+)?(?:#p(\d+))?"/g

  bgColoredEl: ->
    $.el 'div', className: 'reply'

  isThisPageLegit: ->
    # not 404 error page or similar.
    location.hostname in ['boards.4chan.org', 'boards.4channel.org'] and
    d.doctype and
    !$('link[href*="favicon-status.ico"]', d.head) and
    d.title not in ['4chan - Temporarily Offline', '4chan - Error', '504 Gateway Time-out', 'MathJax Equation Source']

  is404: ->
    # XXX Sometimes threads don't 404 but are left over as stubs containing one garbage reply post.
    d.title in ['4chan - Temporarily Offline', '4chan - 404 Not Found'] or (g.VIEW is 'thread' and $('.board') and not $('.opContainer'))

  isIncomplete: ->
    return g.VIEW in ['index', 'thread'] and not $('.board + *')

  isBoardlessPage: (url) ->
    url.hostname in ['www.4chan.org', 'www.4channel.org']

  isAuxiliaryPage: (url) ->
    url.hostname not in ['boards.4chan.org', 'boards.4channel.org']

  isFileURL: (url) ->
    ImageHost.test(url.hostname)

  initAuxiliary: ->
    switch location.hostname
      when 'www.4chan.org', 'www.4channel.org'
        $.onExists doc, 'body', -> $.addStyle CSS.www
        Captcha.replace.init()
        return
      when 'sys.4chan.org', 'sys.4channel.org'
        pathname = location.pathname.split /\/+/
        if pathname[2] is 'imgboard.php'
          if /\bmode=report\b/.test location.search
            Report.init()
          else if (match = location.search.match /\bres=(\d+)/)
            $.ready ->
              if Conf['404 Redirect'] and $.id('errmsg')?.textContent is 'Error: Specified thread does not exist.'
                Redirect.navigate 'thread', {
                  boardID: g.BOARD.ID
                  postID:  +match[1]
                }
        else if pathname[2] is 'post'
          PostSuccessful.init()
        return

  scriptData: ->
    for script in $$ 'script:not([src])', d.head
      return script.textContent if /\bcooldowns *=/.test script.textContent
    ''

  parseThreadMetadata: (thread) ->
    scriptData = @scriptData()
    thread.postLimit = /\bbumplimit *= *1\b/.test scriptData
    thread.fileLimit = /\bimagelimit *= *1\b/.test scriptData
    thread.ipCount   = if (m = scriptData.match /\bunique_ips *= *(\d+)\b/) then +m[1]

    if g.BOARD.ID is 'f' and thread.OP.file
      {file} = thread.OP
      $.ajax @urls.threadJSON({boardID: 'f', threadID: thread.ID}),
        timeout: $.MINUTE
        onloadend: ->
          if @response
            file.text.dataset.md5 = file.MD5 = @response.posts[0].md5

  parseNodes: (post, nodes) ->
    # Add CSS classes to sticky/closed icons on /f/ to match other boards.
    if post.boardID is 'f'
      for type in ['Sticky', 'Closed'] when (icon = $ "img[alt=#{type}]", nodes.info)
        $.addClass icon, "#{type.toLowerCase()}Icon", 'retina'

  parseDate: (node) ->
    new Date(node.dataset.utc * 1000)

  parseFile: (post, file) ->
    {text, link, thumb} = file
    return false if not (info = link.nextSibling?.textContent.match /\(([\d.]+ [KMG]?B).*\)/)
    $.extend file,
      name:       text.title or link.title or link.textContent
      size:       info[1]
      dimensions: info[0].match(/\d+x\d+/)?[0]
      tag:        info[0].match(/,[^,]*, ([a-z]+)\)/i)?[1]
      MD5:        text.dataset.md5
    if thumb
      $.extend file,
        thumbURL:  thumb.src
        MD5:       thumb.dataset.md5
        isSpoiler: $.hasClass thumb.parentNode, 'imgspoiler'
      if file.isSpoiler
        file.thumbURL = if (m = link.href.match /\d+(?=\.\w+$)/) then "#{location.protocol}//#{ImageHost.thumbHost()}/#{post.board}/#{m[0]}s.jpg"
    true

  cleanComment: (bq) ->
    if (abbr = $ '.abbr', bq) # 'Comment too long' or 'EXIF data available'
      for node in $$ '.abbr + br, .exif', bq
        $.rm node
      for i in [0...2]
        $.rm br if (br = abbr.previousSibling) and br.nodeName is 'BR'
      $.rm abbr

  cleanCommentDisplay: (bq) ->
    $.rm b if (b = $ 'b', bq) and /^Rolled /.test(b.textContent)
    $.rm $('.fortune', bq)

  insertTags: (bq) ->
    for node in $$ 's, .removed-spoiler', bq
      $.replace node, [$.tn('[spoiler]'), node.childNodes..., $.tn '[/spoiler]']
    for node in $$ '.prettyprint', bq
      $.replace node, [$.tn('[code]'), node.childNodes..., $.tn '[/code]']
    return

  hasCORS: (url) ->
    url.split('/')[...3].join('/') is location.protocol + '//a.4cdn.org'

  sfwBoards: (sfw) ->
    BoardConfig.sfwBoards(sfw)

  uidColor: (uid) ->
    msg = 0
    i = 0
    while i < 8
      msg = (msg << 5) - msg + uid.charCodeAt i++
    (msg >> 8) & 0xFFFFFF

  isLinkified: (link) ->
    ImageHost.test(link.hostname)

  testNativeExtension: ->
    $.global ->
      @enabled = 'true' if window.Parser.postMenuIcon
