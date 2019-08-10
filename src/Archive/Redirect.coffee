Redirect =
  archives:
    ```<%=
      JSON.stringify(readJSON('archives.json'), null, 2)
        .replace(/\n {2,}(?!{)/g, ' ')
        .replace(/\n/g, '\n    ')
        .replace(/`/g, '\\`')
    %>```

  init: ->
    @selectArchives()
    if Conf['archiveAutoUpdate']
      now = Date.now()
      @update() unless now - 2 * $.DAY < Conf['lastarchivecheck'] <= now

  selectArchives: ->
    o =
      thread: $.dict()
      post:   $.dict()
      file:   $.dict()

    archives = $.dict()
    for data in Conf['archives']
      for key in ['boards', 'files']
        data[key] = [] unless data[key] instanceof Array
      {uid, name, boards, files, software} = data
      continue unless software in ['fuuka', 'foolfuuka']
      archives[JSON.stringify(uid ? name)] = data
      for boardID in boards
        o.thread[boardID] = data unless boardID of o.thread
        o.post[boardID]   = data unless boardID of o.post   or software isnt 'foolfuuka'
        o.file[boardID]   = data unless boardID of o.file   or boardID  not in files

    for boardID, record of Conf['selectedArchives']
      for type, id of record when (archive = archives[JSON.stringify id]) and $.hasOwn(o, type)
        boards = if type is 'file' then archive.files else archive.boards
        o[type][boardID] = archive if boardID in boards

    Redirect.data = o

  update: (cb) ->
    urls = []
    responses = []
    nloaded = 0
    for url in Conf['archiveLists'].split('\n') when url[0] isnt '#'
      url = url.trim()
      urls.push url if url

    fail = (url, action, msg) ->
      new Notice 'warning', "Error #{action} archive data from\n#{url}\n#{msg}", 20

    load = (i) -> ->
      return fail urls[i], 'fetching', (if @status then "Error #{@statusText} (#{@status})" else 'Connection Error') unless @status is 200
      {response} = @
      response = [response] unless response instanceof Array
      responses[i] = response
      nloaded++
      if nloaded is urls.length
        Redirect.parse responses, cb

    if urls.length
      for url, i in urls
        if url[0] in ['[', '{']
          try
            response = JSON.parse url
          catch err
            fail url, 'parsing', err.message
            continue
          load(i).call {status: 200, response}
        else
          CrossOrigin.ajax url,
            onloadend: load(i)
    else
      Redirect.parse [], cb
    return

  parse: (responses, cb) ->
    archives = []
    archiveUIDs = $.dict()
    for response in responses
      for data in response
        uid = JSON.stringify(data.uid ? data.name)
        if uid of archiveUIDs
          $.extend archiveUIDs[uid], data
        else
          archiveUIDs[uid] = $.dict.clone data
          archives.push data
    items = {archives, lastarchivecheck: Date.now()}
    $.set items
    $.extend Conf, items
    Redirect.selectArchives()
    cb?()

  to: (dest, data) ->
    archive = (if dest in ['search', 'board'] then Redirect.data.thread else Redirect.data[dest])[data.boardID]
    return '' unless archive
    Redirect[dest] archive, data

  protocol: (archive) ->
    protocol = location.protocol
    unless $.getOwn(archive, protocol[0...-1])
      protocol = if protocol is 'https:' then 'http:' else 'https:'
    "#{protocol}//"

  thread: (archive, {boardID, threadID, postID}) ->
    # Keep the post number only if the location.hash was sent f.e.
    path = if threadID
      "#{boardID}/thread/#{threadID}"
    else
      "#{boardID}/post/#{postID}"
    if archive.software is 'foolfuuka'
      path += '/'
    if threadID and postID
      path += if archive.software is 'foolfuuka'
        "##{postID}"
      else
        "#p#{postID}"
    "#{Redirect.protocol archive}#{archive.domain}/#{path}"

  post: (archive, {boardID, postID}) ->
    # For fuuka-based archives:
    # https://github.com/eksopl/fuuka/issues/27
    protocol = Redirect.protocol archive
    url = "#{protocol}#{archive.domain}/_/api/chan/post/?board=#{boardID}&num=#{postID}"
    return '' unless Redirect.securityCheck url

    url

  file: (archive, {boardID, filename}) ->
    return '' unless filename
    if boardID is 'f'
      filename = encodeURIComponent $.unescape decodeURIComponent filename
    else
      return '' if /[sm]\.jpg$/.test(filename)
    "#{Redirect.protocol archive}#{archive.domain}/#{boardID}/full_image/#{filename}"

  board: (archive, {boardID}) ->
    "#{Redirect.protocol archive}#{archive.domain}/#{boardID}/"

  search: (archive, {boardID, type, value}) ->
    type = if type is 'name'
      'username'
    else if type is 'MD5'
      'image'
    else
      type
    if type is 'capcode'
      # https://github.com/pleebe/FoolFuuka/blob/bf4224eed04637a4d0bd4411c2bf5f9945dfec0b/src/Model/Search.php#L363
      value = $.getOwn({
        'Developer': 'dev'
        'Verified':  'ver'
      }, value) or value.toLowerCase()
    else if type is 'image'
      value = value.replace /[+/=]/g, (c) -> ({'+': '-', '/': '_', '=': ''})[c]
    value = encodeURIComponent value
    path  = if archive.software is 'foolfuuka'
      "#{boardID}/search/#{type}/#{value}/"
    else if type is 'image'
      "#{boardID}/image/#{value}"
    else
      "#{boardID}/?task=search2&search_#{type}=#{value}"
    "#{Redirect.protocol archive}#{archive.domain}/#{path}"

  report: (boardID) ->
    urls = []
    for archive in Conf['archives']
      {software, https, reports, boards, name, domain} = archive
      if software is 'foolfuuka' and https and reports and boards instanceof Array and boardID in boards
        urls.push [name, "https://#{domain}/_/api/chan/offsite_report/"]
    urls

  securityCheck: (url) ->
    /^https:\/\//.test(url) or
    location.protocol is 'http:' or
    Conf['Exempt Archives from Encryption']

  navigate: (dest, data, alternative) ->
    Redirect.init() unless Redirect.data
    url = Redirect.to dest, data
    if url and (
      Redirect.securityCheck(url) or
      confirm "Redirect to #{url}?\n\nYour connection will not be encrypted."
    )
      location.replace url
    else if alternative
      location.replace alternative
