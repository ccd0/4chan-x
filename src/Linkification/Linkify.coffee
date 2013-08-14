Linkify =
  init: ->
    return if g.VIEW is 'catalog' or not Conf['Linkify']

    @regString = 
      ///(
        # http, magnet, ftp, etc
        ?:(http|https|mailto|git|magnet|ftp|irc|https):(
          [a-z\d%/]
        )
        |
        www\d{0,3}[.]
        |
        # This should account for virtually all links posted without www or http:
        # If it misses any, screw it. No, I will not add canv.as
        [-a-z\d.]+[.](
          com|net|org|co\.jp|uk|ru|be|tv|xxx|edu|gov|cd|es|de|se|tk|dk|io|fm|fi
        )
        |
        # IPv4 Addresses
        [\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}
        |
        # E-mails
        [-\w\d.@]+@[a-z\d.-]+\.[a-z\d]
      )///i

    if Conf['Comment Expansion']
      ExpandComment.callbacks.push @node

    if Conf['Title Link']
      $.sync 'CachedTitles', Linkify.titleSync

    Post::callbacks.push
      name: 'Linkify'
      cb:   @node

  node: ->
    if @isClone
      if Conf['Embedding']
        i = 0
        items = $$ '.embed', @nodes.comment
        while el = items[i++]
          $.on el, 'click', Linkify.cb.toggle
          Linkify.cb.toggle.call el if $.hasClass el, 'embedded'

      return

    test = /[^\s'"]+/g
    space = /[\s'"]/

    snapshot = $.X './/br|.//text()', @nodes.comment
    i = 0
    links = []
    while node = snapshot.snapshotItem i++
      {data} = node
      continue if node.parentElement.nodeName is "A" or not data

      while result = test.exec data
        {index} = result
        endNode = node
        # End of node, not necessarily end of space-delimited string
        if (length = index + result[0].length) is data.length

          while (saved = snapshot.snapshotItem i++)
            break if saved.nodeName is 'BR'

            endNode = saved
            {length} = saved.data

            if end = space.exec saved.data
              # Set our snapshot and regex to start on this node at this position when the loop resumes
              test.lastIndex = length = end.index
              i--
              break

          test.lastIndex = 0 if length is endNode.data.length
          range = Linkify.makeRange node, endNode, index, length
          links.push range if link = Linkify.regString.exec range.toString()
          break

        else
          if link = Linkify.regString.exec result[0]
            range = Linkify.makeRange node, node, index + link.index, length + link.index
            links.push range

    for range in links.reverse()
      @nodes.links.push Linkify.makeLink range, @

    return unless Conf['Embedding'] or Conf['Link Title']

    items = @nodes.links
    i = 0
    while range = items[i++]
      if data = Linkify.services range
        Linkify.embed data if Conf['Embedding']
        Linkify.title data if Conf['Link Title']

    return

  makeRange: (startNode, endNode, startOffset, endOffset) ->
    range = document.createRange();
    range.setStart startNode, startOffset
    range.setEnd   endNode,   endOffset
    range

  makeLink: (range) ->
    text = range.toString()
    
    trim = ->
      range.setEnd range.endContainer, range.endOffset - 1 unless range.endOffset < 1
      text = text.slice 0, -1

    # Clean leading brackets
    if /[(\[{<]/.test text.charAt 0
      text = text.slice 1
      unless range.startOffset is range.startContainer.data.length
        range.setStart range.startContainer, range.startOffset + 1
    
    # Clean hanging brackets, commas, periods
    while /[)\]}>.,]/.test char = text.charAt text.length - 1
      if /[.,]/.test(char) or (text.match /[()\[\]{}<>]/g).length % 2
        trim()
        continue
      break

    # This is the only piece of code left based on Anthony Lieuallen's Linkify
    text =
      if text.contains ':'
        text
      else (
        if text.contains '@'
          'mailto:'
        else
          'http://'
      ) + text

    a = $.el 'a',
      className: 'linkify'
      rel:       'nofollow noreferrer'
      target:    '_blank'
      href:      text
    $.add a, range.extractContents()
    range.insertNode a
    a

  services: (link) ->
    href = link.href

    for key, type of Linkify.types
      continue unless match = type.regExp.exec href
      return [key, match[1], match[2], link]

    return

  embed: (data) ->
    [key, uid, options, link] = data
    href = link.href
    embed = $.el 'a',
      className:   'embedder'
      href:        'javascript:;'
      textContent: '(embed)'

    for name, value of {key, href, uid, options}
      embed.dataset[name] = value

    embed.dataset.nodedata = link.innerHTML

    $.addClass link, "#{embed.dataset.key}"

    $.on embed, 'click', Linkify.cb.toggle
    $.after link, [$.tn(' '), embed]

    if Conf['Auto-embed']
      Linkify.cb.toggle.call embed

    data.push embed

    return

  title: (data) ->
    [key, uid, options, link, embed] = data
    return unless service = Linkify.types[key].title
    titles = Conf['CachedTitles']
    if title = titles[uid]
      # Auto-embed may destroy our links.
      if link
        link.textContent = title[0]
      if Conf['Embedding']
        embed.dataset.title = title[0]
    else
      try
        $.cache service.api(uid), ->
          title = Linkify.cb.title @, data
      catch err
        if link
          link.innerHTML = "[#{key}] <span class=warning>Title Link Blocked</span> (are you using NoScript?)</a>"
        return
      if title
        titles[uid]  = [title, Date.now()]
        $.set 'CachedTitles', titles

  titleSync: (value) ->
    Conf['CachedTitles'] = value

  cb:
    toggle: ->
      [string, @textContent] = if $.hasClass @, "embedded"
        ['unembed', '(embed)']
      else
        ['embed', '(unembed)']
      $.replace @previousElementSibling, Linkify.cb[string] @
      $.toggleClass @, 'embedded'

    embed: (a) ->
      # We create an element to embed
      el = (type = Linkify.types[a.dataset.key]).el a

      # Set style values.
      el.style.cssText = if style = type.style
        style
      else
        "border: 0; width: 640px; height: 390px"

      return el

    unembed: (a) ->
      # Recreate the original link.
      el = $.el 'a',
        rel:         'nofollow noreferrer'
        target:      'blank'
        className:   'linkify'
        href:        a.dataset.href
        innerHTML:   a.dataset.title or a.dataset.nodedata

      $.addClass el, a.dataset.key

      return el

    title: (response, data) ->
      [key, uid, options, link, embed] = data
      service = Linkify.types[key].title
      switch response.status
        when 200, 304
          text = "#{service.text JSON.parse response.responseText}"
          if Conf['Embedding']
            embed.dataset.title = text
        when 404
          text = "[#{key}] Not Found"
        when 403
          text = "[#{key}] Forbidden or Private"
        else
          text = "[#{key}] #{@status}'d"
      link.textContent = text if link

  types:
    audio:
      regExp: /(.*\.(mp3|ogg|wav))$/
      el: (a) ->
        $.el 'audio',
          controls:    'controls'
          preload:     'auto'
          src:         a.dataset.uid

    gist:
      regExp: /.*(?:gist.github.com.*\/)([^\/][^\/]*)$/
      el: (a) ->
        div = $.el 'iframe',
          # Github doesn't allow embedding straight from the site, so we use an external site to bypass that.
          src: "http://www.purplegene.com/script?url=https://gist.github.com/#{a.dataset.uid}.js"
      title:
        api: (uid) -> "https://api.github.com/gists/#{uid}"
        text: ({files}) ->
          return file for file of files when files.hasOwnProperty file

    image:
      regExp: /(http|www).*\.(gif|png|jpg|jpeg|bmp)$/
      style: 'border: 0; width: auto; height: auto;'
      el: (a) ->
        $.el 'div',
          innerHTML: "<a target=_blank href='#{a.dataset.href}'><img src='#{a.dataset.href}'></a>"

    InstallGentoo:
      regExp: /.*(?:paste.installgentoo.com\/view\/)([0-9a-z_]+)/
      el: (a) ->
        $.el 'iframe',
          src: "http://paste.installgentoo.com/view/embed/#{a.dataset.uid}"

    LiveLeak:
      regExp: /.*(?:liveleak.com\/view.+i=)([0-9a-z_]+)/
      el: (a) ->
        $.el 'object',
          innerHTML:  "<embed src='http://www.liveleak.com/e/#{a.dataset.uid}?autostart=true' wmode='opaque' width='640' height='390' pluginspage='http://get.adobe.com/flashplayer/' type='application/x-shockwave-flash'></embed>"

    MediaCrush:
      regExp: /.*(?:mediacru.sh\/)([0-9a-z_]+)/i
      style: 'border: 0; width: 640px; height: 480px; resize: both;'
      el: (a) ->
        $.el 'iframe',
          src: "https://mediacru.sh/#{a.dataset.uid}"
# MediaCrush CORS When?
#
#        el = $.el 'div'
#        $.cache "https://mediacru.sh/#{a.dataset.uid}.json", ->
#          {status} = @
#          return unless [200, 304].contains status
#          {files} = JSON.parse req.response
#          file = file for file of files when files.hasOwnProperty file
#          el.innerHTML = switch file.type
#            when 'video/mp4', 'video/ogv'
#              """
#<video autoplay loop>
#  <source src="https://mediacru.sh/#{a.dataset.uid}.mp4" type="video/mp4;">
#  <source src="https://mediacru.sh/#{a.dataset.uid}.ogv" type="video/ogg; codecs='theora, vorbis'">
#</video>"""
#            when 'image/png', 'image/gif', 'image/jpeg'
#              "<a target=_blank href='#{a.dataset.href}'><img src='https://mediacru.sh/#{file.file}'></a>"
#            when 'image/svg', 'image/svg+xml'
#              "<embed src='https://mediacru.sh/#{file.file}' type='image/svg+xml' />"
#            when 'audio/mpeg'
#              "<audio controls><source src='https://mediacru.sh/#{file.file}'></audio>"
#        el


    pastebin:
      regExp: /.*(?:pastebin.com\/(?!u\/))([^#\&\?]*).*/
      el: (a) ->
        div = $.el 'iframe',
          src: "http://pastebin.com/embed_iframe.php?i=#{a.dataset.uid}"

    SoundCloud:
      regExp: /.*(?:soundcloud.com\/|snd.sc\/)([^#\&\?]*).*/
      style: 'height: auto; width: 500px; display: inline-block;'
      el: (a) ->
        div = $.el 'div',
          className: "soundcloud"
          name: "soundcloud"
        $.ajax(
          "//soundcloud.com/oembed?show_artwork=false&&maxwidth=500px&show_comments=false&format=json&url=https://www.soundcloud.com/#{a.dataset.uid}"
          onloadend: ->
            div.innerHTML = JSON.parse(@responseText).html
          false)
        div
      title:
        api: (uid) -> "//soundcloud.com/oembed?show_artwork=false&&maxwidth=500px&show_comments=false&format=json&url=https://www.soundcloud.com/#{uid}"
        text: (_) -> _.title

    TwitchTV:
      regExp: /.*(?:twitch.tv\/)([^#\&\?]*).*/
      style: "border: none; width: 640px; height: 360px;"
      el: (a) ->
        if result = /(\w+)\/(?:[a-z]\/)?(\d+)/i.exec a.dataset.uid
          [_, channel, chapter] = result

          $.el 'object',
            data: 'http://www.twitch.tv/widgets/archive_embed_player.swf'
            innerHTML: """
<param name='allowFullScreen' value='true' />
<param name='flashvars' value='channel=#{channel}&start_volume=25&auto_play=false#{if chapter then "&chapter_id=" + chapter else ""}' />
"""

        else
          channel = (/(\w+)/.exec a.dataset.uid)[0]

          $.el 'object',
            data: "http://www.twitch.tv/widgets/live_embed_player.swf?channel=#{channel}"
            innerHTML: """
<param  name="allowFullScreen" value="true" />
<param  name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" />
<param  name="flashvars" value="hostname=www.twitch.tv&channel=#{channel}&auto_play=true&start_volume=25" />
"""

    Vocaroo:
      regExp: /.*(?:vocaroo.com\/)([^#\&\?]*).*/
      style: 'border: 0; width: 150px; height: 45px;'
      el: (a) ->
        $.el 'object',
          innerHTML: "<embed src='http://vocaroo.com/player.swf?playMediaID=#{a.dataset.uid.replace /^i\//, ''}&autoplay=0' wmode='opaque' width='150' height='45' pluginspage='http://get.adobe.com/flashplayer/' type='application/x-shockwave-flash'></embed>"

    Vimeo:
      regExp:  /.*(?:vimeo.com\/)([^#\&\?]*).*/
      el: (a) ->
        $.el 'iframe',
          src: "//player.vimeo.com/video/#{a.dataset.uid}?wmode=opaque"
      title:
        api: (uid) -> "https://vimeo.com/api/oembed.json?url=http://vimeo.com/#{uid}"
        text: (_) -> _.title

    Vine:
      regExp: /.*(?:vine.co\/)([^#\&\?]*).*/
      style: 'border: none; width: 500px; height: 500px;'
      el: (a) ->
        $.el 'iframe',
          src: "https://vine.co/#{a.dataset.uid}/card"

    YouTube:
      regExp: /.*(?:youtu.be\/|youtube.*v=|youtube.*\/embed\/|youtube.*\/v\/|youtube.*videos\/)([^#\&\?]*)\??(t\=.*)?/
      el: (a) ->
        $.el 'iframe',
          src: "//www.youtube.com/embed/#{a.dataset.uid}#{if a.dataset.option then '#' + a.dataset.option else ''}?wmode=opaque"
      title:
        api: (uid) -> "https://gdata.youtube.com/feeds/api/videos/#{uid}?alt=json&fields=title/text(),yt:noembed,app:control/yt:state/@reasonCode"
        text: (data) -> data.entry.title.$t