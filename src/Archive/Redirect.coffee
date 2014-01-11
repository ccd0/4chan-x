Redirect =

  init: ->
    o =
      thread: {}
      post:   {}
      file:   {}

    archives = {}
    for {name, boards, files, data} in Redirect.archives
      archives[name] = {boards, files, data}

    for boardID, record of Conf['selectedArchives']
      for type, id of record when (archive = archives[id])
        boards = if type is 'file' then archive.file else archive.boards
        continue unless boardID in boards
        o[type][boardID] = archive.data

    for {data, boards, files} in Redirect.archives
      {software} = data
      for boardID in boards
        o.thread[boardID] = data unless boardID of o.thread
        o.post[boardID]   = data unless boardID of o.post   or software isnt 'foolfuuka'
        o.file[boardID]   = data unless boardID of o.file   or boardID  not in files

    Redirect.data = o

  archives: [
      name:   "Foolz"
      boards: ["a", "co", "gd", "jp", "m", "sp", "tg", "tv", "v", "vg", "vp", "vr", "wsg"]
      files:  ["a", "gd", "jp", "m", "tg", "vg", "vp", "vr", "wsg"]
      data:
        domain: "archive.foolz.us"
        http:  false
        https: true
        software: "foolfuuka"
    ,
      name:   "NSFW Foolz"
      boards: ["u"]
      files:  ["u"]
      data:
        domain: "nsfw.foolz.us"
        http:  false
        https: true
        software: "foolfuuka"
    ,
      name:   "The Dark Cave"
      boards: ["c", "int", "out", "po"]
      files:  ["c", "po"]
      data:
        domain: "archive.thedarkcave.org"
        http:  true
        https: true
        software: "foolfuuka"
    ,
      name:   "4plebs"
      boards: ["hr", "pol", "s4s", "tg", "tv", "x"]
      files:  ["hr", "pol", "s4s", "tg", "tv", "x"]
      data:
        domain: "archive.4plebs.org"
        http:  true
        https: true
        software: "foolfuuka"
    ,
      name:   "Nyafuu"
      boards: ["c", "w", "wg"]
      files:  ["c", "w", "wg"]
      data:
        domain: "archive.nyafuu.org"
        http:  true
        https: true
        software: "foolfuuka"
    ,
      name:   "Install Gentoo"
      boards: ["diy", "g", "sci"]
      files:  []
      data:
        domain: "archive.installgentoo.net"
        http:  false
        https: true
        software: "fuuka"
    ,
      name:   "Rebecca Black Tech"
      boards: ["cgl", "g", "mu", "w"]
      files:  ["cgl", "g", "mu", "w"]
      data:
        domain: "rbt.asia"
        http:  true
        https: true
        software: "fuuka"
    ,
      name:   "Heinessen"
      boards: ["an", "fit", "k", "mlp", "r9k", "toy"]
      files:  ["an", "fit", "k", "r9k", "toy"]
      data:
        domain: "archive.heinessen.com"
        http: true
        software: "fuuka"
    ,
      name:   "warosu"
      boards: ["3", "cgl", "ck", "fa", "ic", "jp", "lit", "tg", "vr"]
      files:  ["3", "cgl", "ck", "fa", "ic", "jp", "lit", "tg", "vr"]
      data:
        domain: "fuuka.warosu.org"
        http:  true
        https: true
        software: "fuuka"
    ,
      name:   "Foolz Beta"
      boards: ["a", "co", "d", "gd", "h", "jp", "m", "mlp", "sp", "tg", "tv", "u", "v", "vg", "vp", "vr", "wsg"],
      files:  ["a", "d", "gd", "h", "jp", "m", "tg", "u", "vg", "vp", "vr", "wsg"]
      data:
        domain: "beta.foolz.us"
        http:  true
        https: true
        withCredentials: true
        software: "foolfuuka"
  ]

  to: (dest, data) ->
    archive = (if dest is 'search' then Redirect.data.thread else Redirect.data[dest])[data.boardID]
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
