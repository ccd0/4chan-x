Redirect =
  data:
    thread: {}
    post:   {}
    file:   {}

  init: ->
    for boardID, data of Conf['selectedArchives']
      for type, id of data
        if archive = Redirect.archives[id]
          boards = archive[type] or archive['boards']
          continue unless boards.contains boardID
          Redirect.data[type][boardID] = archive
    for name, archive of Redirect.archives
      for boardID in archive.boards
        unless boardID of Redirect.data.thread
          Redirect.data.thread[boardID] = archive
        unless boardID of Redirect.data.post or archive.software isnt 'foolfuuka'
          Redirect.data.post[boardID] = archive
        unless boardID of Redirect.data.file or !archive.files.contains boardID
          Redirect.data.file[boardID] = archive
    return

  archives:
    '4plebs':
      domain: 'archive.4plebs.org'
      http: true
      software: 'foolfuuka'
      boards: ['hr', 'tg', 'tv', 'x']
      files:  ['hr', 'tg', 'tv', 'x']

    'fap archive':
      domain: 'fuuka.worldathleticproject.org'
      http:  true
      https: false
      software: 'foolfuuka'
      boards: ['b', 'e', 'h', 'hc', 'p', 's', 'u']
      files:  ['b', 'e', 'h', 'hc', 'p', 's', 'u']

    'Foolz':
      domain: 'archive.foolz.us'
      http:  false
      https: true
      software: 'foolfuuka'
      boards: ['a', 'co', 'gd', 'jp', 'm', 'q', 'sp', 'tg', 'tv', 'v', 'vg', 'vp', 'vr', 'wsg']
      files:  ['a', 'gd', 'jp', 'm', 'q', 'tg', 'vg', 'vp', 'vr', 'wsg']

    'Foolz a Shit':
      domain: 'archive.foolzashit.com'
      http:  true
      https: true
      software: 'foolfuuka'
      boards: ['adv', 'asp', 'cm', 'i', 'lgbt', 'n', 'o', 'p', 's4s', 't', 'trv']
      files:  ['adv', 'asp', 'cm', 'i', 'lgbt', 'n', 'o', 'p', 's4s', 't', 'trv']

    'Foolz Beta':
      domain: 'beta.foolz.us'
      http:  true
      https: true
      withCredentials: true
      software: 'foolfuuka'
      boards: ['a', 'co', 'gd', 'h', 'jp', 'm', 'mlp', 'q', 'sp', 'tg', 'tv', 'u', 'v', 'vg', 'vp', 'vr', 'wsg'],
      files:  ['a', 'gd', 'h', 'jp', 'm', 'q', 'tg', 'u', 'vg', 'vp', 'vr', 'wsg']

    'Heinessen':
      domain: 'archive.heinessen.com'
      http: true
      software: 'fuuka'
      boards: ['an', 'fit', 'k', 'mlp', 'r9k', 'toy']
      files:  ['an', 'k', 'toy']

    'Install Gentoo':
      domain: 'archive.installgentoo.net'
      http:  false
      https: true
      software: 'fuuka'
      boards: ['diy', 'g', 'sci']
      files:  []

    'NSFW Foolz':
      domain: 'nsfw.foolz.us'
      http:  false
      https: true
      software: 'foolfuuka'
      boards: ['u']
      files:  ['u']

    'Nyafuu':
      domain: 'archive.nyafuu.org'
      http:  true
      https: true
      software: 'foolfuuka'
      boards: ['c', 'w', 'wg']
      files:  ['c', 'w', 'wg']

    'Rebecca Black Tech':
      domain: 'rbt.asia'
      http:  true
      https: true
      software: 'fuuka'
      boards: ['cgl', 'g', 'mu', 'w']
      files:  ['cgl', 'g', 'mu', 'w']

    'The Dark Cave':
      domain: 'archive.thedarkcave.org'
      http:  true
      https: true
      software: 'foolfuuka'
      boards: ['c', 'int', 'out', 'po']
      files:  ['c', 'po']

    'warosu':
      domain: 'fuuka.warosu.org'
      http:  true
      https: true
      software: 'fuuka'
      boards: ['3', 'cgl', 'ck', 'fa', 'ic', 'jp', 'lit', 'q', 'tg', 'vr']
      files:  ['3', 'cgl', 'ck', 'fa', 'ic', 'jp', 'lit', 'q', 'tg', 'vr']

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
    protocol = Redirect.protocol archive
    # XXX foolz had HSTS set for 120 days, which broke XHR+CORS+Redirection when on HTTP.
    # Remove necessary HTTPS procotol in September 2013.
    if ['Foolz', 'NSFW Foolz'].contains archive.name
      protocol = 'https://'
    URL = new String "#{protocol}#{archive.domain}/_/api/chan/post/?board=#{boardID}&num=#{postID}"
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
