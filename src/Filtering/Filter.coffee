Filter =
  filters: $.dict()
  init: ->
    return unless g.VIEW in ['index', 'thread', 'catalog'] and Conf['Filter']
    return if g.VIEW is 'catalog' and not Conf['Filter in Native Catalog']

    unless Conf['Filtered Backlinks']
      $.addClass doc, 'hide-backlinks'

    for key of Config.filter
      for line in Conf[key].split '\n'
        continue if line[0] is '#'

        if not (regexp = line.match /\/(.*)\/(\w*)/)
          continue

        # Don't mix up filter flags with the regular expression.
        filter = line.replace regexp[0], ''

        # List of the boards this filter applies to.
        boards = @parseBoards filter.match(/(?:^|;)\s*boards:([^;]+)/)?[1]

        # Boards to exclude from an otherwise global rule.
        excludes = @parseBoards filter.match(/(?:^|;)\s*exclude:([^;]+)/)?[1]

        if (isstring = (key in ['uniqueID', 'MD5']))
          # MD5 filter will use strings instead of regular expressions.
          regexp = regexp[1]
        else
          try
            # Please, don't write silly regular expressions.
            regexp = RegExp regexp[1], regexp[2]
          catch err
            # I warned you, bro.
            new Notice 'warning', [
              $.tn "Invalid #{key} filter:"
              $.el 'br'
              $.tn line
              $.el 'br'
              $.tn err.message
            ], 60
            continue

        # Filter OPs along with their threads or replies only.
        op = filter.match(/(?:^|;)\s*op:(no|only)/)?[1] or ''
        mask = $.getOwn({'no': 1, 'only': 2}, op) or 0

        # Filter only posts with/without files.
        file = filter.match(/(?:^|;)\s*file:(no|only)/)?[1] or ''
        mask = mask | ($.getOwn({'no': 4, 'only': 8}, file) or 0)

        # Overrule the `Show Stubs` setting.
        # Defaults to stub showing.
        stub = switch filter.match(/(?:^|;)\s*stub:(yes|no)/)?[1]
          when 'yes'
            true
          when 'no'
            false
          else
            Conf['Stubs']

        # Desktop notification
        noti = /(?:^|;)\s*notify/.test filter

        # Highlight the post.
        # If not specified, the highlight class will be filter-highlight.
        if (hl = /(?:^|;)\s*highlight/.test filter)
          hl = filter.match(/(?:^|;)\s*highlight:([\w-]+)/)?[1] or 'filter-highlight'
          # Put highlighted OP's thread on top of the board page or not.
          # Defaults to on top.
          top = filter.match(/(?:^|;)\s*top:(yes|no)/)?[1] or 'yes'
          top = top is 'yes' # Turn it into a boolean

        # Fields that this filter applies to (for 'general' filters)
        if key is 'general'
          if (types = filter.match /(?:^|;)\s*type:([^;]*)/)
            types = types[1].split(',')
          else
            types = ['subject', 'name', 'filename', 'comment']

        # Hide the post (default case).
        hide = !(hl or noti)

        filter = {isstring, regexp, boards, excludes, mask, hide, stub, hl, top, noti}
        if key is 'general'
          for type in types
            (@filters[type] or= []).push filter
        else
          (@filters[key] or= []).push filter

    return unless Object.keys(@filters).length
    if g.VIEW is 'catalog'
      Filter.catalog()
    else
      Callbacks.Post.push
        name: 'Filter'
        cb:   @node

  # Parse comma-separated list of boards.
  # Sites can be specified by a beginning part of the site domain followed by a colon.
  parseBoards: (boardsRaw) ->
    return false unless boardsRaw
    return boards if (boards = Filter.parseBoardsMemo[boardsRaw])
    boards = $.dict()
    siteFilter = ''
    for boardID in boardsRaw.split(',')
      if ':' in boardID
        [siteFilter, boardID] = boardID.split(':')[-2..]
      for siteID, site of g.sites when siteID[...siteFilter.length] is siteFilter
        if boardID in ['nsfw', 'sfw']
          for boardID2 in site.sfwBoards?(boardID is 'sfw') or []
            boards["#{siteID}/#{boardID2}"] = true
        else
          boards["#{siteID}/#{encodeURIComponent boardID}"] = true
    Filter.parseBoardsMemo[boardsRaw] = boards
    boards

  parseBoardsMemo: $.dict()

  test: (post, hideable=true) ->
    return post.filterResults if post.filterResults
    hide = false
    stub = true
    hl   = undefined
    top  = false
    noti = false
    matcher = undefined
    fielder = undefined
    if QuoteYou.isYou(post)
      hideable = false
    mask = (if post.isReply then 2 else 1)
    mask = (mask | (if post.file then 4 else 8))
    board = "#{post.siteID}/#{post.boardID}"
    site = "#{post.siteID}/*"
    for key of Filter.filters
      for value in Filter.values(key, post)
        for filter in Filter.filters[key]
          continue if (
            (filter.boards   and !(filter.boards[board]   or filter.boards[site]  )) or
            (filter.excludes and  (filter.excludes[board] or filter.excludes[site])) or
            (filter.mask & mask) or
            (if filter.isstring then (filter.regexp isnt value) else !filter.regexp.test(value))
          )
          matcher = key
          fielder = filter.regexp
          if filter.hide
            if hideable
              hide = true
              stub and= filter.stub
          else
            unless hl and filter.hl in hl
              (hl or= []).push filter.hl
            top or= filter.top
            if filter.noti
              noti = true
    if hide
      {hide, stub, matcher, fielder}
    else
      {hl, top, noti, matcher, fielder}

  node: ->
    return if @isClone
    {hide, stub, hl, top, noti, matcher, fielder} = Filter.test @, (!@isFetchedQuote and (@isReply or g.VIEW is 'index'))
    if hide
      if @isReply
        PostHiding.hide @, stub
        @labels.push "Hidden by the #{fielder} in #{matcher}"
      else
        ThreadHiding.hide @thread, stub
        @labels.push "Hidden by the #{fielder} in #{matcher}"
    else
      if hl
        @highlights = hl
        @labels.push "Highlighting with #{hl} by the #{fielder} in #{matcher}"
        $.addClass @nodes.root, hl...
    if noti and Unread.posts and (@ID > Unread.lastReadPost) and not QuoteYou.isYou(@)
      Unread.openNotification @, ' triggered a notification filter'

  catalog: ->
    return unless (url = g.SITE.urls.catalogJSON?(g.BOARD))
    Filter.catalogData = $.dict()
    $.ajax url,
      onloadend: Filter.catalogParse
    Callbacks.CatalogThreadNative.push
      name: 'Filter'
      cb:   @catalogNode

  catalogParse: ->
    if @status not in [200, 404]
      new Notice 'warning', "Failed to fetch catalog JSON data. #{if @status then "Error #{@statusText} (#{@status})" else 'Connection Error'}", 1
      return
    for page in @response
      for item in page.threads
        Filter.catalogData[item.no] = item
    g.BOARD.threads.forEach (thread) ->
      if thread.catalogViewNative
        Filter.catalogNode.call thread.catalogViewNative
    return

  catalogNode: ->
    return unless @boardID is g.BOARD.ID and Filter.catalogData[@ID]
    return if QuoteYou.db?.get {siteID: g.SITE.ID, boardID: @boardID, threadID: @ID, postID: @ID}
    {hide, hl, top} = Filter.test(g.SITE.Build.parseJSON Filter.catalogData[@ID], @)
    if hide
      @nodes.root.hidden = true
    else
      if hl
        @highlights = hl
        $.addClass @nodes.root, hl...
      if top
        $.prepend @nodes.root.parentNode, @nodes.root
        g.SITE.catalogPin? @nodes.root

  isHidden: (post) ->
    !!Filter.test(post).hide

  valueF:
    postID:     (post) -> ["#{post.ID}"]
    name:       (post) -> [post.info.name]
    uniqueID:   (post) -> [post.info.uniqueID or '']
    tripcode:   (post) -> [post.info.tripcode]
    capcode:    (post) -> [post.info.capcode]
    pass:       (post) -> [post.info.pass]
    email:      (post) -> [post.info.email]
    subject:    (post) -> [post.info.subject or (if post.isReply then undefined else '')]
    comment:    (post) -> [(post.info.comment ?= g.sites[post.siteID]?.Build?.parseComment?(post.info.commentHTML.innerHTML))]
    flag:       (post) -> [post.info.flag]
    filename:   (post) -> post.files.map((f) -> f.name)
    dimensions: (post) -> post.files.map((f) -> f.dimensions)
    filesize:   (post) -> post.files.map((f) -> f.size)
    MD5:        (post) -> post.files.map((f) -> f.MD5)

  values: (key, post) ->
    if $.hasOwn(Filter.valueF, key)
      Filter.valueF[key](post).filter((v) -> v?)
    else
      [key.split('+').map((k) ->
        if (f = $.getOwn(Filter.valueF, k))
          f(post).map((v) -> v or '').join('\n')
        else
          ''
      ).join('\n')]

  addFilter: (type, re, cb) ->
    return unless $.hasOwn(Config.filter, type)
    $.get type, Conf[type], (item) ->
      save = item[type]
      # Add a new line before the regexp unless the text is empty.
      save =
        if save
          "#{save}\n#{re}"
        else
          re
      $.set type, save, cb

  removeFilters: (type, res, cb) ->
    $.get type, Conf[type], (item) ->
      save = item[type]
      res = res.map(Filter.escape).join('|')
      save = save.replace RegExp("(?:$\n|^)(?:#{res})$", 'mg'), ''
      $.set type, save, cb

  showFilters: (type) ->
    # Open the settings and display & focus the relevant filter textarea.
    Settings.open 'Filter'
    section = $ '.section-container'
    select = $ 'select[name=filter]', section
    select.value = type
    Settings.selectFilter.call select
    $.onExists section, 'textarea', (ta) ->
      tl = ta.textLength
      ta.setSelectionRange tl, tl
      ta.focus()

  quickFilterMD5: ->
    post = Get.postFromNode @
    files = post.files.filter((f) -> f.MD5)
    return unless files.length
    filter = files.map((f) -> "/#{f.MD5}/").join('\n')
    Filter.addFilter 'MD5', filter
    origin = post.origin or post
    if origin.isReply
      PostHiding.hide origin
    else if g.VIEW is 'index'
      ThreadHiding.hide origin.thread

    unless Conf['MD5 Quick Filter Notifications']
      # feedback for when nothing gets hidden
      if post.nodes.post.getBoundingClientRect().height
        new Notice 'info', 'MD5 filtered.', 2
      return

    {notice} = Filter.quickFilterMD5
    if notice
      notice.filters.push filter
      notice.posts.push origin
      $('span', notice.el).textContent = "#{notice.filters.length} MD5s filtered."
    else
      msg = $.el 'div',
        `<%= html('<span>MD5 filtered.</span> [<a href="javascript:;">show</a>] [<a href="javascript:;">undo</a>]') %>`
      notice = Filter.quickFilterMD5.notice = new Notice 'info', msg, undefined, ->
        delete Filter.quickFilterMD5.notice
      notice.filters = [filter]
      notice.posts = [origin]
      links = $$ 'a', msg
      $.on links[0], 'click', Filter.quickFilterCB.show.bind(notice)
      $.on links[1], 'click', Filter.quickFilterCB.undo.bind(notice)

  quickFilterCB:
    show: ->
      Filter.showFilters 'MD5'
      @close()
    undo: ->
      Filter.removeFilters 'MD5', @filters
      for post in @posts
        if post.isReply
          PostHiding.show post
        else if g.VIEW is 'index'
          ThreadHiding.show post.thread
      @close()

  escape: (value) ->
    value.replace ///
      /
      | \\
      | \^
      | \$
      | \n
      | \.
      | \(
      | \)
      | \{
      | \}
      | \[
      | \]
      | \?
      | \*
      | \+
      | \|
      ///g, (c) ->
        if c is '\n'
          '\\n'
        else if c is '\\'
          '\\\\'
        else
          "\\#{c}"

  menu:
    init: ->
      return unless g.VIEW in ['index', 'thread'] and Conf['Menu'] and Conf['Filter']

      div = $.el 'div',
        textContent: 'Filter'

      entry =
        el: div
        order: 50
        open: (post) ->
          Filter.menu.post = post
          true
        subEntries: []

      for type in [
        ['Name',             'name']
        ['Unique ID',        'uniqueID']
        ['Tripcode',         'tripcode']
        ['Capcode',          'capcode']
        ['Pass Date',        'pass']
        ['Email',            'email']
        ['Subject',          'subject']
        ['Comment',          'comment']
        ['Flag',             'flag']
        ['Filename',         'filename']
        ['Image dimensions', 'dimensions']
        ['Filesize',         'filesize']
        ['Image MD5',        'MD5']
      ]
        # Add a sub entry for each filter type.
        entry.subEntries.push Filter.menu.createSubEntry type[0], type[1]

      Menu.menu.addEntry entry

    createSubEntry: (text, type) ->
      el = $.el 'a',
        href: 'javascript:;'
        textContent: text
      el.dataset.type = type
      $.on el, 'click', Filter.menu.makeFilter

      return {
        el: el
        open: (post) ->
          Filter.values(type, post).length
      }

    makeFilter: ->
      {type} = @dataset
      # Convert value -> regexp, unless type is MD5
      values = Filter.values type, Filter.menu.post
      res = values.map((value) ->
        re = if type in ['uniqueID', 'MD5'] then value else Filter.escape(value)
        if type in ['uniqueID', 'MD5']
          "/#{re}/"
        else
          "/^#{re}$/"
      ).join('\n')

      Filter.addFilter type, res, ->
        Filter.showFilters type
