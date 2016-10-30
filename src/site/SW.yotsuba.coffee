SW.yotsuba =
  isOPContainerThread: false

  selectors:
    board:         '.board'
    thread:        '.thread'
    postContainer: '.postContainer'
    sideArrows:    '.sideArrows'
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
    comment:   '.postMessage'
    spoiler:   's'
    quotelink: ':not(pre) > .quotelink' # XXX https://github.com/4chan/4chan-JS/issues/77: 4chan currently creates quote links inside [code] tags; ignore them

  regexp:
    quotelink:
      ///
        ^https?://boards\.4chan\.org/+
        ([^/]+) # boardID
        /+thread/+\d+(?:[/?][^#]*)?#p
        (\d+)   # postID
        $
      ///

  isThisPageLegit: ->
    # not 404 error page or similar.
    location.hostname is 'boards.4chan.org' and
    !$('link[href*="favicon-status.ico"]', d.head) and
    d.title not in ['4chan - Temporarily Offline', '4chan - Error', '504 Gateway Time-out']

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
      $.ajax "//a.4cdn.org/f/thread/#{thread}.json",
        timeout: $.MINUTE
        onloadend: ->
          if @response
            file.text.dataset.md5 = file.MD5 = @response.posts[0].md5

  parseFile: (post, file) ->
    {text, link, thumb} = file
    return false if not (info = link.nextSibling?.textContent.match /\(([\d.]+ [KMG]?B).*\)/)
    # XXX full images on https://is.4chan.org don't load
    link.hostname = 'i.4cdn.org' if link.hostname is 'is.4chan.org'
    $.extend file,
      name:       text.title or link.title or link.textContent
      size:       info[1]
      dimensions: info[0].match(/\d+x\d+/)?[0]
      tag:        info[0].match(/,[^,]*, ([a-z]+)\)/i)?[1]
    if thumb
      # XXX full images on https://is.4chan.org don't load
      thumb.parentNode.hostname = 'i.4cdn.org' if thumb.parentNode.hostname is 'is.4chan.org'
      $.extend file,
        thumbURL:  if (m = link.href.match /\d+(?=\.\w+$)/) then "#{location.protocol}//i.4cdn.org/#{post.board}/#{m[0]}s.jpg"
        MD5:       thumb.dataset.md5
        isSpoiler: $.hasClass thumb.parentNode, 'imgspoiler'
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
