Redirect =
  thread: {}
  post:   {}
  file:   {}

  init: ->
    for boardID, data of Conf['selectedArchives']
      for type, id of data
        for name, archive of Redirect.archives
          continue if name isnt id or type is 'post' and archive.software isnt 'foolfuuka'
          arr = if type is 'file'
            archive.files
          else
            archive.boards
          Redirect[type][boardID] = archive if arr.contains boardID
    for name, archive of Redirect.archives
      for boardID in archive.boards
        unless boardID of Redirect.thread
          Redirect.thread[boardID] = archive
        unless boardID of Redirect.post or archive.software isnt 'foolfuuka'
          Redirect.post[boardID] = archive
        unless boardID of Redirect.file or !archive.files.contains boardID
          Redirect.file[boardID] = archive
    return

  archives:
    'Foolz':
      'domain': 'archive.foolz.us'
      'http':  false
      'https': true
      'software': 'foolfuuka'
      'boards': ['a', 'co', 'gd', 'jp', 'm', 'q', 'sp', 'tg', 'tv', 'v', 'vg', 'vp', 'vr', 'wsg']
      'files':  ['a', 'gd', 'jp', 'm', 'q', 'tg', 'vg', 'vp', 'vr', 'wsg']

    'NSFW Foolz':
      'domain': 'nsfw.foolz.us'
      'http':  false
      'https': true
      'software': 'foolfuuka'
      'boards': ['u']
      'files':  ['u']

    'The Dark Cave':
      'domain': 'archive.thedarkcave.org'
      'http':  true
      'https': true
      'software': 'foolfuuka'
      'boards': ['c', 'int', 'out', 'po']
      'files':  ['c', 'po']

    '4plebs':
      'domain': 'archive.4plebs.org'
      'http': true
      'software': 'foolfuuka'
      'boards': ['hr', 'tg', 'tv', 'x']
      'files':  ['hr', 'tg', 'tv', 'x']

    'Nyafuu':
      'domain': 'archive.nyafuu.org'
      'http':  true
      'https': true
      'software': 'foolfuuka'
      'boards': ['c', 'w', 'wg']
      'files':  ['c', 'w', 'wg']

    'Foolz a Shit':
      'domain': 'archive.foolzashit.com'
      'http':  true
      'https': true
      'software': 'foolfuuka'
      'boards': ['adv', 'asp', 'cm', 'i', 'lgbt', 'n', 'o', 'p', 's4s', 't', 'trv']
      'files':  ['adv', 'asp', 'cm', 'i', 'lgbt', 'n', 'o', 'p', 's4s', 't', 'trv']

    'World Athletic Project':
      'domain': 'fuuka.worldathleticproject.org'
      'http':  true
      'https': false
      'software': 'foolfuuka'
      'boards': ['e', 'h', 'hc', 'p', 's', 'u']
      'files':  ['e', 'h', 'hc', 'p', 's', 'u']

    'Install Gentoo':
      'domain': 'archive.installgentoo.net'
      'http':  false
      'https': true
      'software': 'fuuka'
      'boards': ['diy', 'g', 'sci']
      'files':  []

    'warosu':
      'domain': 'fuuka.warosu.org'
      'http':  true
      'https': true
      'software': 'fuuka'
      'boards': ['3', 'cgl', 'ck', 'fa', 'ic', 'jp', 'lit', 'q', 'tg', 'vr']
      'files':  ['3', 'cgl', 'ck', 'fa', 'ic', 'jp', 'lit', 'q', 'tg', 'vr'] 

    'Rebecca Black Tech':
      'domain': 'rbt.asia'
      'http':  true
      'https': true
      'software': 'fuuka'
      'boards': ['cgl', 'g', 'mu', 'w']
      'files':  ['cgl', 'g', 'mu', 'w']

    'Heinessen':
      'domain': 'archive.heinessen.com'
      'http': true
      'software': 'fuuka'
      'boards': ['an', 'fit', 'k', 'mlp', 'r9k', 'toy']
      'files':  ['an', 'k', 'toy']

  to: (dest, data) ->
    archive = (if dest is 'search' then Redirect.thread else Redirect[dest])[data.boardID]
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
    "#{protocol}#{archive.domain}/_/api/chan/post/?board=#{boardID}&num=#{postID}"

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
