Filter =
  filters: {}
  results: {}
  init: ->
    return unless g.VIEW in ['index', 'thread'] and Conf['Filter']

    unless Conf['Filtered Backlinks']
      $.addClass doc, 'hide-backlinks'

    nsfwBoards = BoardConfig.sfwBoards(false).join(',')
    sfwBoards  = BoardConfig.sfwBoards(true).join(',')

    for key of Config.filter
      @filters[key] = []
      for line in Conf[key].split '\n'
        continue if line[0] is '#'

        if not (regexp = line.match /\/(.+)\/(\w*)/)
          continue

        # Don't mix up filter flags with the regular expression.
        filter = line.replace regexp[0], ''

        # Comma-separated list of the boards this filter applies to.
        # Defaults to global.
        boards = filter.match(/boards:([^;]+)/)?[1].toLowerCase() or 'global'
        boards = boards.replace('nsfw', nsfwBoards).replace('sfw', sfwBoards)
        boards = if boards is 'global' then null else boards.split(',')

        # boards to exclude from an otherwise global rule
        # due to the sfw and nsfw keywords, also works on all filters
        # replaces 'nsfw' and 'sfw' for consistency
        excludes = filter.match(/exclude:([^;]+)/)?[1].toLowerCase() or null
        excludes = if excludes is null then null else excludes.replace('nsfw', nsfwBoards).replace('sfw', sfwBoards).split(',')

        if key in ['uniqueID', 'MD5']
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

        # Filter OPs along with their threads, replies only, or both.
        # Defaults to both.
        op = filter.match(/[^t]op:(yes|no|only)/)?[1] or 'yes'

        # Overrule the `Show Stubs` setting.
        # Defaults to stub showing.
        stub = switch filter.match(/stub:(yes|no)/)?[1]
          when 'yes'
            true
          when 'no'
            false
          else
            Conf['Stubs']

        # Highlight the post, or hide it.
        # If not specified, the highlight class will be filter-highlight.
        # Defaults to post hiding.
        if hl = /highlight/.test filter
          hl  = filter.match(/highlight:([\w-]+)/)?[1] or 'filter-highlight'
          # Put highlighted OP's thread on top of the board page or not.
          # Defaults to on top.
          top = filter.match(/top:(yes|no)/)?[1] or 'yes'
          top = top is 'yes' # Turn it into a boolean

        @filters[key].push @createFilter regexp, boards, excludes, op, stub, hl, top

      # Only execute filter types that contain valid filters.
      unless @filters[key].length
        delete @filters[key]

    return unless Object.keys(@filters).length
    Callbacks.Post.push
      name: 'Filter'
      cb:   @node

  createFilter: (regexp, boards, excludes, op, stub, hl, top) ->
    test =
      if typeof regexp is 'string'
        # MD5 checking
        (value) -> regexp is value
      else
        (value) -> regexp.test value

    settings =
      hide:  !hl
      stub:  stub
      class: hl
      top:   top

    (value, boardID, isReply) ->
      if boards and boardID not in boards
        return false
      if excludes and boardID in excludes
        return false
      if isReply and op is 'only' or !isReply and op is 'no'
        return false
      unless test value
        return false
      settings

  test: (post, hideable=true) ->
    return post.filterResults if post.filterResults
    hl  = undefined
    top = false
    for key of Filter.filters when ((value = Filter[key] post)?)
      # Continue if there's nothing to filter (no tripcode for example).
      for filter in Filter.filters[key] when (result = filter value, post.boardID, post.isReply)
        {hide, stub} = result
        if hide
          return {hide, stub} if hideable
        else
          unless hl and result.class in hl
            (hl or= []).push result.class
          top or= result.top
    {hl, top}

  node: ->
    return if @isClone
    {hide, stub, hl, top} = Filter.test @, (!@isFetchedQuote and (@isReply or g.VIEW is 'index'))
    if hide
      if @isReply
        PostHiding.hide @, stub
      else
        ThreadHiding.hide @thread, stub
    else
      if hl
        @highlights = hl
        $.addClass @nodes.root, hl...
    return

  isHidden: (post) ->
    !!Filter.test(post).hide

  postID:     (post) -> "#{post.ID}"
  name:       (post) -> post.info.name
  uniqueID:   (post) -> post.info.uniqueID
  tripcode:   (post) -> post.info.tripcode
  capcode:    (post) -> post.info.capcode
  pass:       (post) -> post.info.pass
  subject:    (post) -> post.info.subject
  comment:    (post) -> (post.info.comment ?= Build.parseComment post.info.commentHTML.innerHTML)
  flag:       (post) -> post.info.flag
  filename:   (post) -> post.file?.name
  dimensions: (post) -> post.file?.dimensions
  filesize:   (post) -> post.file?.size
  MD5:        (post) -> post.file?.MD5

  addFilter: (type, re, cb) ->
    $.get type, Conf[type], (item) ->
      save = item[type]
      # Add a new line before the regexp unless the text is empty.
      save =
        if save
          "#{save}\n#{re}"
        else
          re
      $.set type, save, cb

  quickFilterMD5: ->
    post = Get.postFromNode @
    return unless post.file
    Filter.addFilter 'MD5', "/#{post.file.MD5}/"
    origin = post.origin or post
    if origin.isReply
      PostHiding.hide origin
    else if g.VIEW is 'index'
      ThreadHiding.hide origin.thread
    # If post is still visible, give an indication that the MD5 was filtered.
    if post.nodes.post.getBoundingClientRect().height
      new Notice 'info', 'MD5 filtered.', 2

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
          value = Filter[type] post
          value? and not (g.BOARD.ID is 'f' and type is 'MD5')
      }

    makeFilter: ->
      {type} = @dataset
      # Convert value -> regexp, unless type is MD5
      value = Filter[type] Filter.menu.post
      re = if type in ['uniqueID', 'MD5'] then value else value.replace ///
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

      re = if type in ['uniqueID', 'MD5']
        "/#{re}/"
      else
        "/^#{re}$/"

      Filter.addFilter type, re, ->
        # Open the settings and display & focus the relevant filter textarea.
        Settings.open 'Filter'
        section = $ '.section-container'
        select = $ 'select[name=filter]', section
        select.value = type
        Settings.selectFilter.call select
        ta = $ 'textarea', section
        tl = ta.textLength
        ta.setSelectionRange tl, tl
        ta.focus()
