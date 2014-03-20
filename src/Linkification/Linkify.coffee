Linkify =
  init: ->
    return if !Conf['Linkify']

    if Conf['Comment Expansion']
      ExpandComment.callbacks.push @node

    Post.callbacks.push
      name: 'Linkify'
      cb:   @node

  events: (post) ->
    i = 0
    items = $$ '.embedder', post.nodes.comment
    while el = items[i++]
      $.on el, 'click', Linkify.cb.toggle
      Linkify.cb.toggle.call el if $.hasClass el, 'embedded'
    return

  node: ->
    return (if Conf['Embedding'] then Linkify.events @ else null) if @isClone
    return unless Linkify.regString.test @info.comment

    test     = /[^\s'"]+/g
    space    = /[\s'"]/
    snapshot = $.X './/br|.//text()', @nodes.comment
    i = 0
    links = []
    while node = snapshot.snapshotItem i++
      {data} = node
      continue if !data or node.parentElement.nodeName is "A"

      while result = test.exec data
        {index} = result
        endNode = node
        word    = result[0]
        # End of node, not necessarily end of space-delimited string
        if (length = index + word.length) is data.length
          test.lastIndex = 0

          while (saved = snapshot.snapshotItem i++)
            if saved.nodeName is 'BR'
              break

            endNode  = saved
            {data}   = saved
            word    += data
            {length} = data

            if end = space.exec data
              # Set our snapshot and regex to start on this node at this position when the loop resumes
              test.lastIndex = length = end.index
              i--
              break

        links.push Linkify.makeRange node, endNode, index, length if Linkify.regString.exec word

        break unless test.lastIndex and node is endNode

    i = links.length
    while i--
      link = links[i]
      Linkify.embedProcess Linkify.makeLink link, @
    return

  embedProcess: (link) ->
    if data = Linkify.services link
      Linkify.embed data if Conf['Embedding']
      Linkify.title data if Conf['Link Title']

  regString: ///(
    # http, magnet, ftp, etc
    (https?|mailto|git|magnet|ftp|irc):(
      [a-z\d%/]
    )
    | # This should account for virtually all links posted without http:
    [-a-z\d]+[.](
      aero|asia|biz|cat|com|coop|info|int|jobs|mobi|museum|name|net|org|post|pro|tel|travel|xxx|edu|gov|mil|[a-z]{2}
    )(/|(?!.))
    | # IPv4 Addresses
    [\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}
    | # E-mails
    [-\w\d.@]+@[a-z\d.-]+\.[a-z\d]
  )///i

  makeRange: (startNode, endNode, startOffset, endOffset) ->
    range = document.createRange()
    range.setStart startNode, startOffset
    range.setEnd   endNode,   endOffset
    range

  makeLink: (range) ->
    text = range.toString()

    # Clean start of range
    i = 0
    i++ while /[(\[{<>]/.test text.charAt i

    if i
      text = text.slice i
      i-- while range.startOffset + i >= range.startContainer.data.length

      range.setStart range.startContainer, range.startOffset + i if i

    # Clean end of range
    i = 0
    while /[)\]}>.,]/.test t = text.charAt text.length - (1 + i)
      break unless /[.,]/.test(t) or (text.match /[()\[\]{}<>]/g).length % 2
      i++

    if i
      text = text.slice 0, -i
      i-- while range.endOffset - i < 0

      if i
        range.setEnd range.endContainer, range.endOffset - i

    # Make our link 'valid' if it is formatted incorrectly.
    unless /(https?|mailto|git|magnet|ftp|irc):/.test text
      text = (
        if /@/.test text
          'mailto:'
        else
          'http://'
      ) + text

    a = $.el 'a',
      className: 'linkify'
      rel:       'nofollow noreferrer'
      target:    '_blank'
      href:      text

    # Insert the range into the anchor, the anchor into the range's DOM location, and destroy the range.
    $.add a, range.extractContents()
    range.insertNode a
    range.detach()

    a

  services: (link) ->
    {href} = link
    for key, type of Linkify.types when match = type.regExp.exec href
      return [key, match[1], match[2], link]
    return

  embed: (data) ->
    [key, uid, options, link] = data
    href = link.href
    embed = $.el 'a',
      className:   'embedder'
      href:        'javascript:;'
      textContent: '(embed)'

    embed.dataset[name]    = value for name, value of {key, href, uid, options}
    embed.dataset.nodedata = link.innerHTML

    $.addClass link, "#{embed.dataset.key}"

    $.on embed, 'click', Linkify.cb.toggle
    $.after link, [$.tn(' '), embed]

    Linkify.cb.toggle.call embed if Conf['Auto-embed']

    data.push embed

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
        $.cache service.api(uid), (-> Linkify.cb.title @, data), responseType: 'json'
      catch err
        if link
          link.innerHTML = "[#{key}] <span class=warning>Title Link Blocked</span> (are you using NoScript?)</a>"
        return

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

    title: (req, data) ->
      [key, uid, options, link, embed] = data
      {status} = req
      service = Linkify.types[key].title

      text = "[#{key}] #{switch status
        when 200, 304
          service.text req.response
        when 404
          "Not Found"
        when 403
          "Forbidden or Private"
        else
          "#{status}'d"
      }"

      embed.dataset.title = text if Conf['Embedding'] and status in [200, 304]
      link.textContent    = text if link

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
          
    Twitter:
      regExp: /.*twitter.com\/(.+\/status\/\d+)/
      el: (a) -> 
        $.el 'iframe',
          src: "https://twitframe.com/show?url=https://twitter.com/#{a.dataset.uid}"

    LiveLeak:
      regExp: /.*(?:liveleak.com\/view.+i=)([0-9a-z_]+)/
      el: (a) ->
        el = $.el 'iframe',
          width: "640",
          height: "360",
          src: "http://www.liveleak.com/ll_embed?i=#{a.dataset.uid}",
          frameborder: "0"
        el.setAttribute "allowfullscreen", "true"
        el

    MediaCrush:
      regExp: /.*(?:mediacru.sh\/)([0-9a-z_]+)/i
      style: 'border: 0;'
      el: (a) ->
        el = $.el 'div'
        $.cache "https://mediacru.sh/#{a.dataset.uid}.json", ->
          {status} = @
          return div.innerHTML = "ERROR #{status}" unless status in [200, 304]
          {files} = @response
          for type in ['video/mp4', 'video/ogv', 'image/svg+xml', 'image/png', 'image/gif', 'image/jpeg', 'image/svg', 'audio/mpeg']
            for file in files
              if file.type is type
                embed = file
                break
            break if embed
          return div.innerHTML = "ERROR: Not a valid filetype" unless embed
          el.innerHTML = switch embed.type
            when 'video/mp4', 'video/ogv' then """
<video autoplay loop>
  <source src="https://mediacru.sh/#{a.dataset.uid}.mp4" type="video/mp4;">
  <source src="https://mediacru.sh/#{a.dataset.uid}.ogv" type="video/ogg; codecs='theora, vorbis'">
</video>"""
            when 'image/png', 'image/gif', 'image/jpeg'
              "<a target=_blank href='#{a.dataset.href}'><img src='https://mediacru.sh/#{file.file}'></a>"
            when 'image/svg', 'image/svg+xml'
              "<embed src='https://mediacru.sh/#{file.file}' type='image/svg+xml' />"
            when 'audio/mpeg'
              "<audio controls><source src='https://mediacru.sh/#{file.file}'></audio>"
            else
              "ERROR: No valid filetype."
        el

    pastebin:
      regExp: /.*(?:pastebin.com\/(?!u\/))([^#\&\?]*).*/
      el: (a) ->
        div = $.el 'iframe',
          src: "http://pastebin.com/embed_iframe.php?i=#{a.dataset.uid}"

    gfycat:
      regExp: /.*gfycat.com\/(?:iframe\/)?(\S*)/
      el: (a) ->
        div = $.el 'iframe',
          src: "http://gfycat.com/iframe/#{a.dataset.uid}"

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

    StrawPoll:
      regExp: /strawpoll\.me\/(?:embed_\d+\/)?(\d+)/
      style: 'border: 0; width: 600px; height: 406px;'
      el: (a) ->
        $.el 'iframe',
          src: "http://strawpoll.me/embed_1/#{a.dataset.uid}"

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
        el = $.el 'iframe',
          src: "//www.youtube.com/embed/#{a.dataset.uid}#{if a.dataset.option then '#' + a.dataset.option else ''}?wmode=opaque"
        el.setAttribute "allowfullscreen", "true"
        el
      title:
        api: (uid) -> "https://gdata.youtube.com/feeds/api/videos/#{uid}?alt=json&fields=title/text(),yt:noembed,app:control/yt:state/@reasonCode"
        text: (data) -> data.entry.title.$t

