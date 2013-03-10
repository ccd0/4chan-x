Filter =
  filters: {}
  init: ->
    for key of Config.filter
      @filters[key] = []
      for filter in Conf[key].split '\n'
        continue if filter[0] is '#'

        unless regexp = filter.match /\/(.+)\/(\w*)/
          continue

        # Don't mix up filter flags with the regular expression.
        filter = filter.replace regexp[0], ''

        # Do not add this filter to the list if it's not a global one
        # and it's not specifically applicable to the current board.
        # Defaults to global.
        boards = filter.match(/boards:([^;]+)/)?[1].toLowerCase() or 'global'
        unless boards is 'global' or boards.split(',').contains(g.BOARD)
          continue

        if key is 'md5'
          # MD5 filter will use strings instead of regular expressions.
          regexp = regexp[1]
        else
          try
            # Please, don't write silly regular expressions.
            regexp = RegExp regexp[1], regexp[2]
          catch err
            # I warned you, bro.
            alert err.message
            continue

        # Filter OPs along with their threads, replies only, or both.
        # Defaults to replies only.
        op = filter.match(/[^t]op:(yes|no|only)/)?[1] or 'no'

        # Overrule the `Show Stubs` setting.
        # Defaults to stub showing.
        stub = switch filter.match(/stub:(yes|no)/)?[1]
          when 'yes'
            true
          when 'no'
            false
          else
            Conf['Show Stubs']

        # Highlight the post, or hide it.
        # If not specified, the highlight class will be filter_highlight.
        # Defaults to post hiding.
        if hl = /highlight/.test filter
          hl  = filter.match(/highlight:(\w+)/)?[1] or 'filter_highlight'
          # Put highlighted OP's thread on top of the board page or not.
          # Defaults to on top.
          top = filter.match(/top:(yes|no)/)?[1] or 'yes'
          top = top is 'yes' # Turn it into a boolean

        @filters[key].push @createFilter regexp, op, stub, hl, top

      # Only execute filter types that contain valid filters.
      unless @filters[key].length
        delete @filters[key]

    if Object.keys(@filters).length
      Main.callbacks.push @node

  createFilter: (regexp, op, stub, hl, top) ->
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
    (value, isOP) ->
      if isOP and op is 'no' or !isOP and op is 'only'
        return false
      unless test value
        return false
      settings

  node: (post) ->
    return if post.isInlined
    isOP = post.ID is post.threadID
    {root} = post
    for key of Filter.filters
      value = Filter[key] post
      if value is false
        # Continue if there's nothing to filter (no tripcode for example).
        continue
      for filter in Filter.filters[key]
        unless result = filter value, isOP
          continue

        # Hide
        if result.hide
          if isOP
            unless g.REPLY
              ThreadHiding.hide root.parentNode, result.stub
            else
              continue
          else
            ReplyHiding.hide post.root, result.stub
          return

        # Highlight
        $.addClass root, result.class

  name: (post) ->
    $('.name', post.el).textContent
  uniqueid: (post) ->
    if uid = $ '.posteruid', post.el
      return uid.textContent[5...-1]
    false
  tripcode: (post) ->
    if trip = $ '.postertrip', post.el
      return trip.textContent
    false
  mod: (post) ->
    if mod = $ '.capcode', post.el
      return mod.textContent
    false
  email: (post) ->
    if mail = $ '.useremail', post.el
      # remove 'mailto:'
      # decode %20 into space for example
      return decodeURIComponent mail.href[7..]
    false
  subject: (post) ->
    if (subject = $ '.postInfo .subject', post.el).textContent.length isnt 0
      return subject.textContent
    false
  comment: (post) ->
    text = []
    nodes = d.evaluate './/br|.//text()', post.blockquote, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
    for i in [0...nodes.snapshotLength]
      text.push if data = nodes.snapshotItem(i).data then data else '\n'
    if (content = text.join '').length isnt 0
      return content
    false
  country: (post) ->
    if flag = $ '.countryFlag', post.el
      return flag.title
    false
  filename: (post) ->
    {fileInfo} = post
    if fileInfo
      if file = $ '.fileText > span', fileInfo
        return file.title
      else
        return fileInfo.firstElementChild.dataset.filename
    false
  dimensions: (post) ->
    {fileInfo} = post
    if fileInfo and match = fileInfo.textContent.match /\d+x\d+/
      return match[0]
    false
  filesize: (post) ->
    {img} = post
    if img
      return img.alt.replace 'Spoiler Image, ', ''
    false
  md5: (post) ->
    {img} = post
    if img
      return img.dataset.md5
    false

  menuInit: ->
    div = $.el 'div',
      textContent: 'Filter'

    entry =
      el: div
      open: -> true
      children: []

    for type in [
      ['Name',             'name']
      ['Unique ID',        'uniqueid']
      ['Tripcode',         'tripcode']
      ['Admin/Mod',        'mod']
      ['E-mail',           'email']
      ['Subject',          'subject']
      ['Comment',          'comment']
      ['Country',          'country']
      ['Filename',         'filename']
      ['Image dimensions', 'dimensions']
      ['Filesize',         'filesize']
      ['Image MD5',        'md5']
    ]
      # Add a sub entry for each filter type.
      entry.children.push(@createSubEntry(type[0], type[1]));

    Menu.addEntry entry

  createSubEntry: (text, type) ->
    el = $.el 'a',
      href: 'javascript:;'
      textContent: text
    # Define the onclick var outside of open's scope to $.off it properly.
    onclick = null

    open = (post) ->
      value = Filter[type] post
      return false if value is false
      $.off el, 'click', onclick
      onclick = ->
        # Convert value -> regexp, unless type is md5
        re = if type is 'md5' then value else value.replace ///
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

        re =
          if type is 'md5'
            "/#{value}/"
          else
            "/^#{re}$/"
        if /\bop\b/.test post.class
          re += ';op:yes'

        # Add a new line before the regexp unless the text is empty.
        save = if save = $.get type, '' then "#{save}\n#{re}" else re
        $.set type, save

        # Open the options and display & focus the relevant filter textarea.
        Options.dialog()
        select = $ 'select[name=filter]', $.id 'options'
        select.value = type
        $.event select, new Event 'change'
        $.id('filter_tab').checked = true
        ta = select.nextElementSibling
        tl = ta.textLength
        ta.setSelectionRange tl, tl
        ta.focus()
      $.on el, 'click', onclick
      true

    return el: el, open: open