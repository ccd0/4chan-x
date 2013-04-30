Redirect =
  image: (boardID, filename) ->
    # Do not use g.BOARD, the image url can originate from a cross-quote.
    switch boardID
      when 'a', 'gd', 'jp', 'm', 'q', 'tg', 'vp', 'vr', 'wsg'
        "//archive.foolz.us/#{boardID}/full_image/#{filename}"
      when 'u'
        "//nsfw.foolz.us/#{boardID}/full_image/#{filename}"
      when 'po'
        "//archive.thedarkcave.org/#{boardID}/full_image/#{filename}"
      when 'hr', 'tv'
        "http://archive.4plebs.org/#{boardID}/full_image/#{filename}"
      when 'c', 'w', 'wg'
        "//archive.nyafuu.org/#{boardID}/full_image/#{filename}"
      when 'vg'
        "http://archive.nihil-ad-rem.net/#{boardID}/full_image/#{filename}"
      when 'd'
        "//loveisover.me/#{boardID}/full_image/#{filename}"
      when 'ck', 'fa', 'lit', 's4s'
        "//fuuka.warosu.org/#{boardID}/full_image/#{filename}"
      when 'cgl', 'g', 'mu'
        "//rbt.asia/#{boardID}/full_image/#{filename}"
      when 'an', 'k', 'toy', 'x'
        "http://archive.heinessen.com/#{boardID}/full_image/#{filename}"
  post: (boardID, postID) ->
    # XXX foolz had HSTS set for 120 days, which broke XHR+CORS+Redirection when on HTTP.
    # Remove necessary HTTPS procotol in September 2013.
    switch boardID
      when 'a', 'co', 'gd', 'jp', 'm', 'q', 'sp', 'tg', 'tv', 'vp', 'vr', 'wsg'
        "https://archive.foolz.us/_/api/chan/post/?board=#{boardID}&num=#{postID}"
      when 'u'
        "https://nsfw.foolz.us/_/api/chan/post/?board=#{boardID}&num=#{postID}"
      when 'int', 'out', 'po'
        "//archive.thedarkcave.org/_/api/chan/post/?board=#{boardID}&num=#{postID}"
      when 'hr', 'x'
        "http://archive.4plebs.org/_/api/chan/post/?board=#{boardID}&num=#{postID}"
      when 'c', 'w', 'wg'
        "//archive.nyafuu.org/_/api/chan/post/?board=#{boardID}&num=#{postID}"
      when 'v', 'vg'
        "http://archive.nihil-ad-rem.net/_/api/chan/post/?board=#{boardID}&num=#{postID}"
      when 'd'
        "//loveisover.me/_/api/chan/post/?board=#{boardID}&num=#{postID}"
    # for fuuka-based archives:
    # https://github.com/eksopl/fuuka/issues/27
  to: (data) ->
    {boardID} = data
    switch boardID
      when 'a', 'co', 'gd', 'jp', 'm', 'q', 'sp', 'tg', 'tv', 'vp', 'vr', 'wsg'
        Redirect.path '//archive.foolz.us', 'foolfuuka', data
      when 'u'
        Redirect.path '//nsfw.foolz.us', 'foolfuuka', data
      when 'int', 'out', 'po'
        Redirect.path '//archive.thedarkcave.org', 'foolfuuka', data
      when 'hr'
        Redirect.path 'http://archive.4plebs.org', 'foolfuuka', data
      when 'c', 'w', 'wg'
        Redirect.path '//archive.nyafuu.org', 'foolfuuka', data
      when 'v', 'vg'
        Redirect.path 'http://archive.nihil-ad-rem.net', 'foolfuuka', data
      when 'd'
        Redirect.path '//loveisover.me', 'foolfuuka', data
      when 'ck', 'fa', 'lit', 's4s'
        Redirect.path '//fuuka.warosu.org', 'fuuka', data
      when 'diy', 'g', 'sci'
        Redirect.path '//archive.installgentoo.net', 'fuuka', data
      when 'cgl', 'mu'
        Redirect.path '//rbt.asia', 'fuuka', data
      when 'an', 'fit', 'k', 'mlp', 'r9k', 'toy', 'x'
        Redirect.path 'http://archive.heinessen.com', 'fuuka', data
      else
        if data.threadID then "//boards.4chan.org/#{boardID}/" else ''
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
