Redirect =
  image: (board, filename) ->
    # Do not use g.BOARD, the image url can originate from a cross-quote.
    switch board
      when 'a', 'jp', 'm', 'q', 'sp', 'tg', 'vg', 'wsg'
        "//archive.foolz.us/#{board}/full_image/#{filename}"
      when 'cgl', 'g', 'mu', 'w'
        "//rbt.asia/#{board}/full_image/#{filename}"
      when 'an', 'k', 'toy', 'x'
        "http://archive.heinessen.com/#{board}/full_image/#{filename}"
      when 'ck', 'lit'
        "//fuuka.warosu.org/#{board}/full_image/#{filename}"
      when 'u'
        "//nsfw.foolz.us/#{board}/full_image/#{filename}"
      when 'e'
        "//www.xn--clich-fsa.net/4chan/cgi-board.pl/#{board}/img/#{filename}"
      when 'c'
        "//archive.nyafuu.org/#{board}/full_image/#{filename}"

  post: (board, postID) ->
    if Redirect.post[board] is undefined
      for name, archive of @archiver
        if archive.type is 'foolfuuka' and archive.boards.contains board
          Redirect.post[board] = archive.base
          break
      Redirect.post[board] or= null

    if Redirect.post[board]
      return "#{Redirect.post[board]}/_/api/chan/post/?board=#{board}&num=#{postID}"
    null

  archiver:
    'Foolz':
      base:    '//archive.foolz.us'
      boards:  ['a', 'co', 'gd', 'jp', 'm', 'q', 'sp', 'tg', 'tv', 'v', 'vg', 'vp', 'vr', 'wsg', 'dev', 'foolz']
      type:    'foolfuuka'
    'NSFWFoolz':
      base:    '//nsfw.foolz.us'
      boards:  ['u', 'kuku']
      type:    'foolfuuka'
    'TheDarkCave':
      base:    'http://archive.thedarkcave.org'
      boards:  ['c', 'int', 'out', 'po']
      type:    'foolfuuka'
    'Warosu':
      base:    '//fuuka.warosu.org'
      boards:  ['cgl', 'ck', 'fa', 'jp', 'lit', 'q', 's4s', 'tg', 'vr']
      type:    'fuuka'
    'InstallGentoo':
      base:    '//archive.installgentoo.net'
      boards:  ['diy', 'g', 'sci']
      type:    'fuuka'
    'RebeccaBlackTech':
      base:    '//rbt.asia'
      boards:  ['cgl', 'g', 'mu', 'w']
      type:    'fuuka_mail'
    'Heinessen':
      base:    'http://archive.heinessen.com'
      boards:  ['an', 'fit', 'k', 'mlp', 'r9k', 'toy', 'x']
      type:    'fuuka'
    'Cliche':
      base: '//www.xn--clich-fsa.net/4chan/cgi-board.pl'
      boards: ['e']
      type: 'fuuka'
    'NyaFuu':
      base: '//archive.nyafuu.org'
      boards: ['c', 'w']
      type: 'fuuka'
  select: (board) ->
    return (name for name, archive of @archiver when archive.boards.contains board or g.BOARD)

  to: (data) ->
    {board, threadID, isSearch} = data

    return (if archive = @archiver[$.get "archiver/#{board}/", @select(board)[0]]
      @path archive.base, archive.type, data
    else if threadID and not isSearch
      "//boards.4chan.org/#{board}/"
    else
      null)

  path: (base, archiver, data) ->
    {board, type, value, threadID, postID, isSearch} = data
    if isSearch
      type = if type is 'name'
        'username'
      else if type is 'md5'
        'image'
      else
        type
      value = encodeURIComponent value
      return (if (url = if archiver is 'foolfuuka'
        "search/#{type}/"
      else if type is 'image'
        "?task=search2&search_media_hash="
      else if type isnt 'email' or archiver is 'fuuka_mail'
        "?task=search2&search_#{type}="
      else
        false
      ) then "#{base}/#{board}/#{url}#{value}" else url)
    # keep the number only if the location.hash was sent f.e.
    postID = postID.match(/\d+/)[0] if postID
    return base + "/" + board + "/" + (
      if threadID
        "thread/#{threadID}"
      else
        "post/#{postID}"
    ) + (
      if threadID and postID
        "##{if archiver is 'InstallGentoo' then 'p' else ''}#{postID}"
      else ""
    )
