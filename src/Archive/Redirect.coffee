Redirect =
  init: ->
    $.sync 'archivers', @updateArchives

  updateArchives: ->
    $.get 'archivers', {}, ({archivers}) ->
      Conf['archivers'] = archivers

  imageArchives: do ->
    o = 
      a:   "//archive.foolz.us/"
      ck:  "//fuuka.warosu.org/"
      an:  "http://archive.heinessen.com/"
      cgl: "//rbt.asia/"
      c:   "//archive.nyafuu.org/"
      d:   "//loveisover.me/"
      e:   "http://archive.foolzashit.com"
      hr:  "http://archive.4plebs.org/"
      u:   "//nsfw.foolz.us/"
      po:  "//archive.thedarkcave.org/"
      vg:  "http://nth.pensivenonsen.se/"
      c:   "//archive.nyafuu.org/"

    o.adv = o.asp = o.cm = o.i = o.n = o.o = o.p = o.s = o.t = o.trv = o.y = o.lgbt = o.s4s = o.e
    o.gd = o.jp = o.m = o.q = o.tg = o.vp = o.vr = o.wsg = o.a
    o.fa = o.lit = o.ck
    o.k = o.toy = o.x = o.an
    o.g = o.mu = o.cgl
    o.w = o.wg = o.c
    o.h = o.v = o.d
    o.tv = o.hr

    return o

  image: (boardID, filename) ->
    # Do not use g.BOARD, the image url can originate from a cross-quote.
    # Fuck. Your. Shit.
    "#{Redirect.imageArchives[boardID]}#{boardID}/full_image/#{filename}"

  post: (boardID, postID) ->
    unless Redirect.post[boardID]?
      for name, archive of @archiver
        if archive.type is 'foolfuuka' and archive.boards.contains boardID
          Redirect.post[boardID] = archive.base
          break
      Redirect.post[boardID] or= false

    return if Redirect.post[boardID]
      "#{Redirect.post[boardID]}/_/api/chan/post/?board=#{boardID}&num=#{postID}"
    else
      null

  select: (board) ->
    for name, archive of @archiver
      continue unless archive.boards.contains board
      name

  to: (data) ->
    {boardID} = data

    unless (arch = Conf.archivers[boardID])?
      Conf.archivers[boardID] = arch = @select(boardID)[0]
      $.set 'archivers', Conf.archivers

    return (if arch and archive = @archiver[arch]
      Redirect.path archive.base, archive.type, data
    else if data.threadID
      "//boards.4chan.org/#{boardID}/"
    else
      null)

    unless archive.boards.contains g.BOARD.ID
      Conf['archivers'] = archive

  archiver:
    'Foolz':
      base:   'https://archive.foolz.us'
      boards: ['a', 'co', 'gd', 'jp', 'm', 'q', 'sp', 'tg', 'tv', 'vp', 'vr', 'wsg']
      type:   'foolfuuka'
    'NSFWFoolz':
      base:   'https://nsfw.foolz.us'
      boards: ['u']
      type:   'foolfuuka'
    'TheDarkCave':
      base:   'http://archive.thedarkcave.org'
      boards: ['c', 'int', 'out', 'po']
      type:   'foolfuuka'
    '4plebs':
      base:   'http://archive.4plebs.org'
      boards: ['hr', 'tg', 'tv', 'x']
      base:   'foolfuuka'
    'NyaFuu':
      base:   '//archive.nyafuu.org'
      boards: ['c', 'w', 'wg']
      type:   'foolfuuka'
    'LoveIsOver':
      base:   '//loveisover.me'
      boards: ['d', 'h', 'v']
      type:   'foolfuuka'
    'PensiveNonsen':
      base:   'http://nth.pensivenonsen.se'
      boards: ['vg']
      type:   'foolfuuka'
    'FoolzaShit':
      base:   'http://archive.foolzashit.com'
      boards: ["adv", "asp", "cm", "e", "i", "lgbt", "n", "o", "p", "s", "s4s", "t", "trv", "y"]
      type:   'foolfuuka'
    'Warosu':
      base:   '//fuuka.warosu.org'
      boards: ['cgl', 'ck', 'fa', 'jp', 'lit', 's4s', 'q', 'tg', 'vr']
      type:   'fuuka'
    'InstallGentoo':
      base:   '//archive.installgentoo.net'
      boards: ['diy', 'g', 'sci']
      type:   'fuuka'
    'RebeccaBlackTech':
      base:   '//rbt.asia'
      boards: ['cgl', 'g', 'mu', 'w']
      type:   'fuuka_mail'
    'Heinessen':
      base:   'http://archive.heinessen.com'
      boards: ['an', 'fit', 'k', 'mlp', 'r9k', 'toy', 'x']
      type:   'fuuka'
    'Cliche':
      base:   '//www.cliché.net/4chan/cgi-board.pl'
      boards: ['e']
      type:   'fuuka'

  path: (base, archiver, data) ->
    if data.isSearch
      {boardID, type, value} = data
      type = if type is 'name'
        'username'
      else if type is 'MD5'
        'image'
      else
        type
      value = encodeURIComponent value
      return if archiver is 'foolfuuka'
        "#{base}/#{boardID}/search/#{type}/#{value}"
      else if type is 'image'
        "#{base}/#{boardID}/?task=search2&search_media_hash=#{value}"
      else
        "#{base}/#{boardID}/?task=search2&search_#{type}=#{value}"

    {boardID, threadID, postID} = data
    # keep the number only if the location.hash was sent f.e.
    path = if threadID
      "#{boardID}/thread/#{threadID}"
    else
      "#{boardID}/post/#{postID}"
    if archiver is 'foolfuuka'
      path += '/'
    if threadID and postID
      path += if archiver is 'foolfuuka'
        "##{postID}"
      else
        "#p#{postID}"
    "#{base}/#{path}"
