Linkify =
  init: ->
    return if !Conf['Linkify']

    @types = {}
    @types[type.key] = type for type in @ordered_types

    if Conf['Comment Expansion']
      ExpandComment.callbacks.push @node

    if Conf['Embedding'] or Conf['Link Title']
      @embedProcess = Function 'link', 
        """
        var data = this.services(link);
        if (data) {#{
          (if Conf['Embedding'] then 'this.embed(data); ' else '') +
          if Conf['Link Title'] then 'data.push(post); this.title(data);'   else ''
        }}
        """

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
      Linkify.embedProcess (Linkify.makeLink link), @
    return

  embedProcess: -> return

  regString: ///(
    # http, magnet, ftp, etc
    (https?|mailto|git|magnet|ftp|irc):(
      [a-z\d%/]
    )
    | # This should account for virtually all links posted without http:
    [-a-z\d]+[.](
      aero|asia|biz|cat|com|coop|info|int|jobs|mobi|museum|name|net|org|post|pro|tel|travel|xxx|edu|gov|mil|[a-z]{2}
    )([:/]|(?!.))
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
    unless /(mailto:|.+:\/\/)/.test text
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
    for type in Linkify.ordered_types when match = type.regExp.exec href
      return if type.dummy
      return [type.key, match[1], match[2], link]
    return

  embed: (data) ->
    [key, uid, options, link, post] = data
    href = link.href
    embed = $.el 'a',
      className:   'embedder'
      href:        'javascript:;'
      textContent: '(embed)'

    embed.dataset[name]    = value for name, value of {key, href, uid, options}

    $.addClass link, "#{embed.dataset.key}"

    $.on embed, 'click', Linkify.cb.toggle
    $.after link, [$.tn(' '), embed]

    Linkify.cb.toggle.call embed if Conf['Auto-embed']

  title: (data) ->
    [key, uid, options, link, post] = data
    return unless service = Linkify.types[key].title
    titles = Conf['CachedTitles']
    if title = titles[uid]
      link.textContent = title[0]
    else
      try
        $.cache service.api(uid), (-> Linkify.cb.title @, data), responseType: 'json'
      catch err
        link.innerHTML = '<span class="warning">Title Link Blocked</span> (are you using NoScript?)</a>'
        $.prepend link, $.tn "[#{key}] "
        return

  cb:
    toggle: ->
      if $.hasClass @, "embedded"
        $.rm @previousElementSibling
        @previousElementSibling.hidden = false
        @textContent = '(embed)'
      else
        @previousElementSibling.hidden = true
        $.before @, Linkify.cb.embed @
        @textContent = '(unembed)'
      $.toggleClass @, 'embedded'

    embed: (a) ->
      # We create an element to embed
      el = (type = Linkify.types[a.dataset.key]).el a

      # Set style values.
      el.style.cssText = if type.style?
        type.style
      else
        "border: 0; width: 640px; height: 390px"

      return el

    title: (req, data) ->
      [key, uid, options, link, post] = data
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

      link.textContent = text
      for post2 in post.clones
        for link2 in $$ 'a', post2.nodes.comment when link2.href is link.href
          link2.textContent = text
      return

  ordered_types: [
      key: 'audio'
      regExp: /(.*\.(mp3|ogg|wav))$/
      style: ''
      el: (a) ->
        $.el 'audio',
          controls:    true
          preload:     'auto'
          src:         a.dataset.uid
    ,
      key: 'gist'
      regExp: /.*(?:gist.github.com.*\/)([^\/][^\/]*)$/
      el: (a) ->
        div = $.el 'iframe',
          # Github doesn't allow embedding straight from the site, so we use an external site to bypass that.
          src: "http://www.purplegene.com/script?url=https://gist.github.com/#{a.dataset.uid}.js"
      title:
        api: (uid) -> "https://api.github.com/gists/#{uid}"
        text: ({files}) ->
          return file for file of files when files.hasOwnProperty file
    ,
      key: 'image'
      regExp: /(http|www).*\.(gif|png|jpg|jpeg|bmp)$/
      style: 'border: 0; width: auto; height: auto;'
      el: (a) ->
        el = $.el 'div'
        el.innerHTML = '<a target="_blank"><img></a>'
        el.firstChild.href = el.firstChild.firstChild.src = a.dataset.href
        el
    ,
      key: 'InstallGentoo'
      regExp: /.*(?:paste.installgentoo.com\/view\/)([0-9a-z_]+)/
      el: (a) ->
        $.el 'iframe',
          src: "http://paste.installgentoo.com/view/embed/#{a.dataset.uid}"
    ,
      key: 'Twitter'
      regExp: /.*twitter.com\/(.+\/status\/\d+)/
      el: (a) -> 
        $.el 'iframe',
          src: "https://twitframe.com/show?url=https://twitter.com/#{a.dataset.uid}"
    ,
      key: 'LiveLeak'
      regExp: /.*(?:liveleak.com\/view.+i=)([0-9a-z_]+)/
      el: (a) ->
        el = $.el 'iframe',
          width: "640",
          height: "360",
          src: "http://www.liveleak.com/ll_embed?i=#{a.dataset.uid}",
          frameborder: "0"
        el.setAttribute "allowfullscreen", "true"
        el
    ,
      key: 'MediaCrush'
      regExp: /.*(?:mediacru.sh\/)([0-9a-z_-]+)/i
      style: 'border: 0;'
      el: (a) ->
        el = $.el 'div'
        $.cache "https://mediacru.sh/#{a.dataset.uid}.json", ->
          {status} = @
          return el.textContent = "ERROR #{status}" unless status in [200, 304]
          {files} = @response
          for type in ['video/mp4', 'video/webm', 'video/ogv', 'image/svg+xml', 'image/png', 'image/gif', 'image/jpeg', 'audio/mpeg', 'audio/ogg']
            for file in files
              if file.type is type
                embed = file
                break
            break if embed
          return div.textContent = "ERROR: Not a valid filetype" unless embed
          switch embed.type
            when 'video/mp4', 'video/webm', 'video/ogv'
              el.innerHTML = '<video autoplay loop><source type="video/mp4"><source type="video/webm"><source type="video/ogg"></video>'
              for ext, i in ['mp4', 'webm', 'ogv']
                el.firstChild.children[i].src = "https://mediacru.sh/#{a.dataset.uid}.#{ext}"
            when 'image/svg+xml', 'image/png', 'image/gif', 'image/jpeg'
              el.innerHTML = '<a target="_blank"><img></a>'
              el.firstChild.href = a.dataset.href
              el.firstChild.firstChild.src = "https://mediacru.sh/#{file.file}"
            when 'audio/mpeg', 'audio/ogg'
              el.innerHTML = '<audio controls><source type="audio/ogg"><source type="audio/mpeg"></audio>'
              for ext, i in ['ogg', 'mp3']
                el.firstChild.children[i].src = "https://mediacru.sh/#{a.dataset.uid}.#{ext}"
            else
              el.textContent = "ERROR: No valid filetype."
        el
    ,
      key: 'pastebin'
      regExp: /.*(?:pastebin.com\/(?!u\/))([^#\&\?]*).*/
      el: (a) ->
        div = $.el 'iframe',
          src: "http://pastebin.com/embed_iframe.php?i=#{a.dataset.uid}"
    ,
      key: 'gfycat'
      regExp: /.*gfycat.com\/(?:iframe\/)?(\S*)/
      el: (a) ->
        div = $.el 'iframe',
          src: "http://gfycat.com/iframe/#{a.dataset.uid}"
    ,
      key: 'SoundCloud'
      regExp: /.*(?:soundcloud.com\/|snd.sc\/)([^#\&\?]*).*/
      style: 'border: 0; width: 500px; height: 400px;'
      el: (a) ->
        $.el 'iframe',
          src: "//w.soundcloud.com/player/?visual=true&show_comments=false&url=https%3A%2F%2Fsoundcloud.com%2F#{encodeURIComponent a.dataset.uid}"
      title:
        api: (uid) -> "//soundcloud.com/oembed?format=json&url=https%3A%2F%2Fsoundcloud.com%2F#{encodeURIComponent uid}"
        text: (_) -> _.title
    ,
      key: 'StrawPoll'
      regExp: /strawpoll\.me\/(?:embed_\d+\/)?(\d+)/
      style: 'border: 0; width: 600px; height: 406px;'
      el: (a) ->
        $.el 'iframe',
          src: "http://strawpoll.me/embed_1/#{a.dataset.uid}"
    ,
      key: 'TwitchTV'
      regExp: /.*(?:twitch.tv\/)([^#\&\?]*).*/
      style: "border: none; width: 640px; height: 360px;"
      el: (a) ->
        if result = /(\w+)\/([bc])\/(\d+)/i.exec a.dataset.uid
          [_, channel, type, id] = result
          idparam = {'b': 'archive_id', 'c': 'chapter_id'}
          obj = $.el 'object',
            data: 'http://www.twitch.tv/widgets/archive_embed_player.swf'
          obj.innerHTML = '<param name="allowFullScreen" value="true"><param name="flashvars">'
          obj.children[1].value = "channel=#{channel}&start_volume=25&auto_play=false&#{idparam[type]}=#{id}"
          obj
        else
          channel = (/(\w+)/.exec a.dataset.uid)[0]
          obj = $.el 'object',
            data: "http://www.twitch.tv/widgets/live_embed_player.swf?channel=#{channel}"
          obj.innerHTML = '<param name="allowFullScreen" value="true"><param name="flashvars">'
          obj.children[1].value = "hostname=www.twitch.tv&channel=#{channel}&auto_play=true&start_volume=25"
          obj
    ,
      key: 'Vocaroo'
      regExp: /.*(?:vocaroo.com\/)([^#\&\?]*).*/
      style: ''
      el: (a) ->
        $.el 'audio',
          controls: true
          preload: 'auto'
          src: "http://vocaroo.com/media_command.php?media=#{a.dataset.uid.replace /^i\//, ''}&command=download_ogg"
    ,
      key: 'Vimeo'
      regExp:  /.*(?:vimeo.com\/)([^#\&\?]*).*/
      el: (a) ->
        $.el 'iframe',
          src: "//player.vimeo.com/video/#{a.dataset.uid}?wmode=opaque"
      title:
        api: (uid) -> "https://vimeo.com/api/oembed.json?url=http://vimeo.com/#{uid}"
        text: (_) -> _.title
    ,
      key: 'Vine'
      regExp: /.*(?:vine.co\/)([^#\&\?]*).*/
      style: 'border: none; width: 500px; height: 500px;'
      el: (a) ->
        $.el 'iframe',
          src: "https://vine.co/#{a.dataset.uid}/card"
    ,
      key: 'YouTube'
      regExp: /.*(?:youtu.be\/|youtube.*v=|youtube.*\/embed\/|youtube.*\/v\/|youtube.*videos\/)([^#\&\?]*)\??(t\=.*)?/
      el: (a) ->
        el = $.el 'iframe',
          src: "//www.youtube.com/embed/#{a.dataset.uid}#{if a.dataset.option then '#' + a.dataset.option else ''}?wmode=opaque"
        el.setAttribute "allowfullscreen", "true"
        el
      title:
        api: (uid) -> "https://gdata.youtube.com/feeds/api/videos/#{uid}?alt=json&fields=title/text(),yt:noembed,app:control/yt:state/@reasonCode"
        text: (data) -> data.entry.title.$t
    ,
      # dummy entries: not implemented yet but included to prevent them being wrongly embedded as a subsequent type
      key: 'Loopvid'
      regExp: /.*loopvid.appspot.com\/.*/
      dummy: true
    ,
      key: 'MediaFire'
      regExp: /.*mediafire.com\/.*/
      dummy: true
    ,
      key: 'video'
      regExp: /(.*\.(ogv|webm|mp4))$/
      style: 'border: 0; width: auto; height: auto;'
      el: (a) ->
        $.el 'video',
          controls:    'controls'
          preload:     'auto'
          src:         a.dataset.uid
  ]

