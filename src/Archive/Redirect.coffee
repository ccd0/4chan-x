Redirect =
  init: ->
    o =
      thread: {}
      post:   {}
      file:   {}
      report: {}

    archives = {}
    for data in Redirect.archives
      {uid, name, boards, files, software, withCredentials} = data
      archives[JSON.stringify(uid ? name)] = data
      for boardID in boards
        unless withCredentials
          o.thread[boardID] = data unless boardID of o.thread
          o.post[boardID]   = data unless boardID of o.post   or software isnt 'foolfuuka'
          o.file[boardID]   = data unless boardID of o.file   or boardID  not in files
        o.report[boardID]   = data if name is 'fgts'

    for boardID, record of Conf['selectedArchives']
      for type, id of record
        if id is null
          delete o[type][boardID]
        else if archive = archives[JSON.stringify id]
          boards = if type is 'file' then archive.files else archive.boards
          o[type][boardID] = archive if boardID in boards

    Redirect.data = o

  archives:
    `<%=
      JSON.stringify(readJSON('archives.json'), null, 2)
        .replace(/\n {2,}(?!{)/g, ' ')
        .replace(/\n/g, '\n    ')
        .replace(/`/g, '\\`')
    %>`

  to: (dest, data) ->
    archive = (if dest in ['search', 'board'] then Redirect.data.thread else Redirect.data[dest])[data.boardID]
    return '' unless archive
    Redirect[dest] archive, data

  protocol: (archive) ->
    protocol = location.protocol
    unless archive[protocol[0...-1]]
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
      value = {'Developer': 'dev'}[value] or value.toLowerCase()
    else if type is 'image'
      value = value.replace /[+/=]/g, (c) -> {'+': '-', '/': '_', '=': ''}[c]
    value = encodeURIComponent value
    path  = if archive.software is 'foolfuuka'
      "#{boardID}/search/#{type}/#{value}/"
    else if type is 'image'
      "#{boardID}/image/#{value}"
    else
      "#{boardID}/?task=search2&search_#{type}=#{value}"
    "#{Redirect.protocol archive}#{archive.domain}/#{path}"

  report: (archive, {boardID, postID}) ->
    "https://so.fgts.jp/report/?board=#{boardID}&no=#{postID}"

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

return Redirect
