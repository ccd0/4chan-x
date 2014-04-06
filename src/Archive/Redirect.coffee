Redirect =
  init: ->
    o =
      thread: {}
      post:   {}
      file:   {}

    archives = {}
    for data in Redirect.archives
      {name, boards, files, software} = data
      archives[name] = data
      for boardID in boards
        o.thread[boardID] = data unless boardID of o.thread
        o.post[boardID]   = data unless boardID of o.post   or software isnt 'foolfuuka'
        o.file[boardID]   = data unless boardID of o.file   or boardID  not in files

    for boardID, record of Conf['selectedArchives']
      for type, id of record when (archive = archives[id])
        boards = if type is 'file' then archive.files else archive.boards
        continue unless boardID in boards
        o[type][boardID] = archive

    Redirect.data = o

  archives: `<%= JSON.stringify(grunt.file.readJSON('src/Archive/archives.json')) %>`

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
    URL = new String "#{Redirect.protocol archive}#{archive.domain}/_/api/chan/post/?board=#{boardID}&num=#{postID}"
    URL.archive = archive
    URL

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
    value = encodeURIComponent value
    path  = if archive.software is 'foolfuuka'
      "#{boardID}/search/#{type}/#{value}"
    else
      "#{boardID}/?task=search2&search_#{if type is 'image' then 'media_hash' else type}=#{value}"
    "#{Redirect.protocol archive}#{archive.domain}/#{path}"
