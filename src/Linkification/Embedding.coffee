Embedding =
  init: ->
    return unless g.VIEW in ['index', 'thread', 'archive'] and Conf['Linkify'] and (Conf['Embedding'] or Conf['Link Title'] or Conf['Cover Preview'])
    @types = {}
    @types[type.key] = type for type in @ordered_types

    if Conf['Embedding'] and g.VIEW isnt 'archive'
      @dialog = UI.dialog 'embedding',
        <%= readHTML('Embed.html') %>
      @media = $ '#media-embed', @dialog
      $.one d, '4chanXInitFinished', @ready
      $.on  d, 'IndexRefreshInternal', ->
        g.posts.forEach (post) ->
          for post in [post, post.clones...]
            for embed in post.nodes.embedlinks
              Embedding.cb.catalogRemove.call embed
          return
    if Conf['Link Title']
      $.on d, '4chanXInitFinished PostsInserted', ->
        for key, service of Embedding.types when service.title?.batchSize
          Embedding.flushTitles service.title
        return

  events: (post) ->
    return if g.VIEW is 'archive'
    if Conf['Embedding']
      i = 0
      items = post.nodes.embedlinks = $$ '.embedder', post.nodes.comment
      while el = items[i++]
        $.on el, 'click', Embedding.cb.click
        Embedding.cb.toggle.call el if $.hasClass el, 'embedded'
    if Conf['Cover Preview']
      i = 0
      items = $$ '.linkify', post.nodes.comment
      while el = items[i++]
        if (data = Embedding.services el)
          Embedding.preview data
      return

  process: (link, post) ->
    return unless Conf['Embedding'] or Conf['Link Title'] or Conf['Cover Preview']
    return if $.x 'ancestor::pre', link
    if data = Embedding.services link
      data.post = post
      Embedding.embed data if Conf['Embedding'] and g.VIEW isnt 'archive'
      Embedding.title data if Conf['Link Title']
      Embedding.preview data if Conf['Cover Preview'] and g.VIEW isnt 'archive'

  services: (link) ->
    {href} = link
    for type in Embedding.ordered_types when (match = type.regExp.exec href)
      return {key: type.key, uid: match[1], options: match[2], link}
    return

  embed: (data) ->
    {key, uid, options, link, post} = data
    {href} = link

    $.addClass link, key.toLowerCase()

    embed = $.el 'a',
      className:   'embedder'
      href:        'javascript:;'
    ,
      <%= html('(<span>un</span>embed)') %>

    embed.dataset[name] = value for name, value of {key, uid, options, href}

    $.on embed, 'click', Embedding.cb.click
    $.after link, [$.tn(' '), embed]
    post.nodes.embedlinks.push embed

    if Conf['Auto-embed'] and !Conf['Floating Embeds'] and !post.isFetchedQuote
      if $.hasClass(doc, 'catalog-mode')
        $.addClass embed, 'embed-removed'
      else
        Embedding.cb.toggle.call embed

  ready: ->
    return if !Main.isThisPageLegit()
    $.addClass Embedding.dialog, 'empty'
    $.on $('.close', Embedding.dialog), 'click',     Embedding.closeFloat
    $.on $('.move',  Embedding.dialog), 'mousedown', Embedding.dragEmbed
    $.on $('.jump',  Embedding.dialog), 'click', ->
      (Header.scrollTo Embedding.lastEmbed if doc.contains Embedding.lastEmbed)
    $.add d.body, Embedding.dialog

  closeFloat: ->
    delete Embedding.lastEmbed
    $.addClass Embedding.dialog, 'empty'
    $.replace Embedding.media.firstChild, $.el 'div'

  dragEmbed: ->
    # only webkit can handle a blocking div
    {style} = Embedding.media
    if Embedding.dragEmbed.mouseup
      $.off d, 'mouseup', Embedding.dragEmbed
      Embedding.dragEmbed.mouseup = false
      style.pointerEvents = ''
      return
    $.on d, 'mouseup', Embedding.dragEmbed
    Embedding.dragEmbed.mouseup = true
    style.pointerEvents = 'none'

  title: (data) ->
    {key, uid, options, link, post} = data
    return if not (service = Embedding.types[key].title)
    $.addClass link, key.toLowerCase()
    if service.batchSize
      (service.queue or= []).push data
      if service.queue.length >= service.batchSize
        Embedding.flushTitles service
    else
      CrossOrigin.cache service.api(uid), (-> Embedding.cb.title @, data)

  flushTitles: (service) ->
    {queue} = service
    return unless queue?.length
    service.queue = []
    cb = ->
      Embedding.cb.title @, data for data in queue
      return
    CrossOrigin.cache service.api(data.uid for data in queue), cb

  preview: (data) ->
    {key, uid, link} = data
    return if not (service = Embedding.types[key].preview)
    $.on link, 'mouseover', (e) ->
      src = service.url uid
      {height} = service
      el = $.el 'img',
        src: src
        id: 'ihover'
      $.add Header.hover, el
      UI.hover
        root: link
        el: el
        latestEvent: e
        endEvents: 'mouseout click'
        height: height

  cb:
    click: (e) ->
      e.preventDefault()
      if not $.hasClass(@, 'embedded') and (Conf['Floating Embeds'] or $.hasClass(doc, 'catalog-mode'))
        return if not (div = Embedding.media.firstChild)
        $.replace div, Embedding.cb.embed @
        Embedding.lastEmbed = Get.postFromNode(@).nodes.root
        $.rmClass Embedding.dialog, 'empty'
      else
        Embedding.cb.toggle.call @

    toggle: ->
      if $.hasClass @, "embedded"
        $.rm @nextElementSibling
      else
        $.after @, Embedding.cb.embed @
      $.toggleClass @, 'embedded'

    embed: (a) ->
      # We create an element to embed
      container = $.el 'div', {className: 'media-embed'}
      $.add container, el = (type = Embedding.types[a.dataset.key]).el a

      # Set style values.
      el.style.cssText = if type.style?
        type.style
      else
        'border: none; width: 640px; height: 360px;'

      return container

    catalogRemove: ->
      isCatalog = $.hasClass(doc, 'catalog-mode')
      if (isCatalog and $.hasClass(@, 'embedded')) or (!isCatalog and $.hasClass(@, 'embed-removed'))
        Embedding.cb.toggle.call @
        $.toggleClass @, 'embed-removed'

    title: (req, data) ->
      return unless req.status

      {key, uid, options, link, post} = data
      {status} = req
      service = Embedding.types[key].title

      text = "[#{key}] #{switch status
        when 200, 304
          service.text req.response, uid
        when 404
          "Not Found"
        when 403
          "Forbidden or Private"
        else
          "#{status}'d"
      }"

      link.dataset.original = link.textContent
      link.textContent = text
      for post2 in post.clones
        for link2 in $$ 'a.linkify', post2.nodes.comment when link2.href is link.href
          link2.dataset.original ?= link2.textContent
          link2.textContent = text
      return

  ordered_types: [
      key: 'audio'
      regExp: /^[^?#]+\.(?:mp3|m4a|oga|wav|flac)(?:[?#]|$)/i
      style: ''
      el: (a) ->
        $.el 'audio',
          controls:    true
          preload:     'auto'
          src:         a.dataset.href
    ,
      key: 'image'
      regExp: /^[^?#]+\.(?:gif|png|jpg|jpeg|bmp)(?::\w+)?(?:[?#]|$)/i
      style: ''
      el: (a) ->
        $.el 'div', <%= html('<a target="_blank" href="${a.dataset.href}"><img src="${a.dataset.href}" style="max-width: 80vw; max-height: 80vh;"></a>') %>
    ,
      key: 'video'
      regExp: /^[^?#]+\.(?:og[gv]|webm|mp4)(?:[?#]|$)/i
      style: 'max-width: 80vw; max-height: 80vh;'
      el: (a) ->
        el = $.el 'video',
          hidden:   true
          controls: true
          preload:  'auto'
          src:      a.dataset.href
          loop:     ImageHost.test a.dataset.href.split('/')[2]
        $.on el, 'loadedmetadata', ->
          if el.videoHeight is 0 and el.parentNode
            $.replace el, Embedding.types.audio.el(a)
          else
            el.hidden = false
        el
    ,
      key: 'PeerTube'
      regExp: /^(\w+:\/\/[^\/]+\/videos\/watch\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12})(.*)/
      el: (a) ->
        options = if (start = a.dataset.options.match /[?&](start=\w+)/) then "?#{start[1]}" else ''
        el = $.el 'iframe',
          src: a.dataset.uid.replace('/videos/watch/', '/videos/embed/') + options
        el.setAttribute "allowfullscreen", "true"
        el
    ,
      key: 'BitChute'
      regExp:  /^\w+:\/\/(?:www\.)?bitchute\.com\/video\/([\w\-]+)/
      el: (a) ->
        el = $.el 'iframe',
          src: "https://www.bitchute.com/embed/#{a.dataset.uid}/"
        el.setAttribute "allowfullscreen", "true"
        el
    ,
      key: 'Clyp'
      regExp: /^\w+:\/\/(?:www\.)?clyp\.it\/(\w{8})/
      style: 'border: 0; width: 640px; height: 160px;'
      el: (a) ->
        $.el 'iframe',
          src: "https://clyp.it/#{a.dataset.uid}/widget"
      title:
        api: (uid) -> "https://api.clyp.it/#{uid}"
        text: (_) -> _.Title
    ,
      key: 'Dailymotion'
      regExp:  /^\w+:\/\/(?:(?:www\.)?dailymotion\.com\/(?:embed\/)?video|dai\.ly)\/([A-Za-z0-9]+)[^?]*(.*)/
      el: (a) ->
        options = if (start = a.dataset.options.match /[?&](start=\d+)/) then "?#{start[1]}" else ''
        el = $.el 'iframe',
          src: "//www.dailymotion.com/embed/video/#{a.dataset.uid}#{options}"
        el.setAttribute "allowfullscreen", "true"
        el
      title:
        api: (uid) -> "https://api.dailymotion.com/video/#{uid}"
        text: (_) -> _.title
      preview:
        url: (uid) -> "https://www.dailymotion.com/thumbnail/video/#{uid}"
        height: 240
    ,
      key: 'Gfycat'
      regExp: /^\w+:\/\/(?:www\.)?gfycat\.com\/(?:iframe\/)?(\w+)/
      el: (a) ->
        div = $.el 'iframe',
          src: "//gfycat.com/iframe/#{a.dataset.uid}"
    ,
      key: 'Gist'
      regExp: /^\w+:\/\/gist\.github\.com\/[\w\-]+\/(\w+)/
      style: ''
      el: do ->
        counter = 0
        (a) ->
          el = $.el 'pre',
            hidden: true
            id: "gist-embed-#{counter++}"
          CrossOrigin.cache "https://api.github.com/gists/#{a.dataset.uid}", ->
            el.textContent = Object.values(@response.files)[0].content
            el.className = 'prettyprint'
            $.global ->
              window.prettyPrint? (() ->), document.getElementById(document.currentScript.dataset.id).parentNode
            , id: el.id
            el.hidden = false
          el
      title:
        api: (uid) -> "https://api.github.com/gists/#{uid}"
        text: ({files}) ->
          return file for file of files when files.hasOwnProperty file
    ,
      key: 'InstallGentoo'
      regExp: /^\w+:\/\/paste\.installgentoo\.com\/view\/(?:raw\/|download\/|embed\/)?(\w+)/
      el: (a) ->
        $.el 'iframe',
          src: "https://paste.installgentoo.com/view/embed/#{a.dataset.uid}"
    ,
      key: 'LiveLeak'
      regExp: /^\w+:\/\/(?:\w+\.)?liveleak\.com\/.*\?.*i=(\w+)/
      el: (a) ->
        el = $.el 'iframe',
          src: "https://www.liveleak.com/ll_embed?i=#{a.dataset.uid}",
        el.setAttribute "allowfullscreen", "true"
        el
    ,
      key: 'Loopvid'
      regExp: /^\w+:\/\/(?:www\.)?loopvid.appspot.com\/#?((?:pf|kd|lv|gd|gh|db|dx|nn|cp|wu|ig|ky|mf|m2|pc|1c|pi|ni|wl|ko|gc)\/[\w\-\/]+(?:,[\w\-\/]+)*|fc\/\w+\/\d+|https?:\/\/.+)/
      style: 'max-width: 80vw; max-height: 80vh;'
      el: (a) ->
        el = $.el 'video',
          controls: true
          preload:  'auto'
          loop:     true
        if /^http/.test a.dataset.uid
          $.add el, $.el 'source', src: a.dataset.uid
          return el
        [_, host, names] = a.dataset.uid.match /(\w+)\/(.*)/
        types = switch host
          when 'gd', 'wu', 'fc' then ['']
          when 'gc' then ['giant', 'fat', 'zippy']
          else ['.webm', '.mp4']
        for name in names.split ','
          for type in types
            base = "#{name}#{type}"
            urls = switch host
              # list from src/common.py at http://loopvid.appspot.com/source.html
              when 'pf' then ["https://kastden.org/_loopvid_media/pf/#{base}", "https://web.archive.org/web/2/http://a.pomf.se/#{base}"]
              when 'kd' then ["https://kastden.org/loopvid/#{base}"]
              when 'lv' then ["https://lv.kastden.org/#{base}"]
              when 'gd' then ["https://docs.google.com/uc?export=download&id=#{base}"]
              when 'gh' then ["https://googledrive.com/host/#{base}"]
              when 'db' then ["https://dl.dropboxusercontent.com/u/#{base}"]
              when 'dx' then ["https://dl.dropboxusercontent.com/#{base}"]
              when 'nn' then ["https://kastden.org/_loopvid_media/nn/#{base}"]
              when 'cp' then ["https://copy.com/#{base}"]
              when 'wu' then ["http://webmup.com/#{base}/vid.webm"]
              when 'ig' then ["https://i.imgur.com/#{base}"]
              when 'ky' then ["https://kastden.org/_loopvid_media/ky/#{base}"]
              when 'mf' then ["https://kastden.org/_loopvid_media/mf/#{base}", "https://web.archive.org/web/2/https://d.maxfile.ro/#{base}"]
              when 'm2' then ["https://kastden.org/_loopvid_media/m2/#{base}"]
              when 'pc' then ["http://a.pomf.cat/#{base}"]
              when '1c' then ["http://b.1339.cf/#{base}"]
              when 'pi' then ["https://u.pomf.is/#{base}"]
              when 'ni' then ["https://u.nya.is/#{base}"]
              when 'wl' then ["http://webm.land/media/#{base}"]
              when 'ko' then ["https://kordy.kastden.org/loopvid/#{base}"]
              when 'fc' then ["//#{ImageHost.host()}/#{base}.webm"]
              when 'gc' then ["https://#{type}.gfycat.com/#{name}.webm"]
            for url in urls
              $.add el, $.el 'source', src: url
        el
    ,
      key: 'Openings.moe'
      regExp: /^\w+:\/\/openings.moe\/\?video=([^.&=]+)/
      style: 'max-width: 80vw; max-height: 80vh;'
      el: (a) ->
        $.el 'video',
          controls: true
          preload:  'auto'
          src:      "//openings.moe/video/#{a.dataset.uid}.webm"
          loop:     true
    ,
      key: 'Pastebin'
      regExp: /^\w+:\/\/(?:\w+\.)?pastebin\.com\/(?!u\/)(?:[\w.]+(?:\/|\?i\=))?(\w+)/
      el: (a) ->
        div = $.el 'iframe',
          src: "//pastebin.com/embed_iframe.php?i=#{a.dataset.uid}"
    ,
      key: 'SoundCloud'
      regExp: /^\w+:\/\/(?:www\.)?(?:soundcloud\.com\/|snd\.sc\/)([\w\-\/]+)/
      style: 'border: 0; width: 500px; height: 400px;'
      el: (a) ->
        $.el 'iframe',
          src: "https://w.soundcloud.com/player/?visual=true&show_comments=false&url=https%3A%2F%2Fsoundcloud.com%2F#{encodeURIComponent a.dataset.uid}"
      title:
        api: (uid) -> "#{location.protocol}//soundcloud.com/oembed?format=json&url=https%3A%2F%2Fsoundcloud.com%2F#{encodeURIComponent uid}"
        text: (_) -> _.title
    ,
      key: 'StrawPoll'
      regExp: /^\w+:\/\/(?:www\.)?strawpoll\.me\/(?:embed_\d+\/)?(\d+(?:\/r)?)/
      style: 'border: 0; width: 600px; height: 406px;'
      el: (a) ->
        $.el 'iframe',
          src: "https://www.strawpoll.me/embed_1/#{a.dataset.uid}"
    ,
      key: 'Streamable'
      regExp: /^\w+:\/\/(?:www\.)?streamable\.com\/(\w+)/
      el: (a) ->
        el = $.el 'iframe',
          src: "https://streamable.com/o/#{a.dataset.uid}"
        el.setAttribute "allowfullscreen", "true"
        el
      title:
        api: (uid) -> "https://api.streamable.com/oembed?url=https://streamable.com/#{uid}"
        text: (_) -> _.title
    ,
      key: 'TwitchTV'
      regExp: /^\w+:\/\/(?:www\.|secure\.)?twitch\.tv\/(\w[^#\&\?]*)/
      el: (a) ->
        m = a.dataset.uid.match /(\w+)(?:\/v\/(\d+))?/
        url = "//player.twitch.tv/?#{if m[2] then "video=v#{m[2]}" else "channel=#{m[1]}"}&autoplay=false"
        if (time = a.dataset.href.match /\bt=(\w+)/)
          url += "&time=#{time[1]}"
        el = $.el 'iframe',
          src: url
        el.setAttribute "allowfullscreen", "true"
        el
    ,
      key: 'Twitter'
      regExp: /^\w+:\/\/(?:www\.|mobile\.)?twitter\.com\/(\w+\/status\/\d+)/
      style: 'border: none; width: 550px; height: 250px; overflow: hidden; resize: both;'
      el: (a) ->
        el = $.el 'iframe'
        $.on el, 'load', ->
          @contentWindow.postMessage {element: 't', query: 'height'}, 'https://twitframe.com'
        onMessage = (e) ->
          if e.source is el.contentWindow and e.origin is 'https://twitframe.com'
            $.off window, 'message', onMessage
            (cont or el).style.height = "#{+$.minmax(e.data.height, 250, 0.8 * doc.clientHeight)}px"
        $.on window, 'message', onMessage
        el.src = "https://twitframe.com/show?url=https://twitter.com/#{a.dataset.uid}"
        if $.engine is 'gecko'
          # XXX https://bugzilla.mozilla.org/show_bug.cgi?id=680823
          el.style.cssText = 'border: none; width: 100%; height: 100%;'
          cont = $.el 'div'
          $.add cont, el
          cont
        else
          el
    ,
      key: 'VidLii'
      regExp:  /^\w+:\/\/(?:www\.)?vidlii\.com\/watch\?v=(\w{11})/
      style: 'border: none; width: 640px; height: 392px;'
      el: (a) ->
        el = $.el 'iframe',
          src: "https://www.vidlii.com/embed?v=#{a.dataset.uid}&a=0"
        el.setAttribute "allowfullscreen", "true"
        el
    ,
      key: 'Vimeo'
      regExp:  /^\w+:\/\/(?:www\.)?vimeo\.com\/(\d+)/
      el: (a) ->
        el = $.el 'iframe',
          src: "//player.vimeo.com/video/#{a.dataset.uid}?wmode=opaque"
        el.setAttribute "allowfullscreen", "true"
        el
      title:
        api: (uid) -> "https://vimeo.com/api/oembed.json?url=https://vimeo.com/#{uid}"
        text: (_) -> _.title
    ,
      key: 'Vine'
      regExp: /^\w+:\/\/(?:www\.)?vine\.co\/v\/(\w+)/
      style: 'border: none; width: 500px; height: 500px;'
      el: (a) ->
        $.el 'iframe',
          src: "https://vine.co/v/#{a.dataset.uid}/card"
    ,
      key: 'Vocaroo'
      regExp: /^\w+:\/\/(?:www\.)?vocaroo\.com\/i\/(\w+)/
      style: ''
      el: (a) ->
        el = $.el 'audio',
          controls: true
          preload: 'auto'
        type = if el.canPlayType 'audio/webm' then 'webm' else 'mp3'
        el.src = "//vocaroo.com/media_command.php?media=#{a.dataset.uid}&command=download_#{type}"
        el
    ,
      key: 'YouTube'
      regExp: /^\w+:\/\/(?:youtu.be\/|[\w.]*youtube[\w.]*\/.*(?:v=|\bembed\/|\bv\/))([\w\-]{11})(.*)/
      el: (a) ->
        start = a.dataset.options.match /\b(?:star)?t\=(\w+)/
        start = start[1] if start
        if start and !/^\d+$/.test start
          start += ' 0h0m0s'
          start = 3600 * start.match(/(\d+)h/)[1] + 60 * start.match(/(\d+)m/)[1] + 1 * start.match(/(\d+)s/)[1]
        el = $.el 'iframe',
          src: "//www.youtube.com/embed/#{a.dataset.uid}?rel=0&wmode=opaque#{if start then '&start=' + start else ''}"
        el.setAttribute "allowfullscreen", "true"
        el
      title:
        batchSize: 50
        api: (uids) ->
          ids = encodeURIComponent uids.join(',')
          key = '<%= meta.youtubeAPIKey %>'
          "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=#{ids}&fields=items%28id%2Csnippet%28title%29%29&key=#{key}"
        text: (data, uid) ->
          for item in data.items when item.id is uid
            return item.snippet.title
          'Not Found'
      preview:
        url: (uid) -> "https://img.youtube.com/vi/#{uid}/0.jpg"
        height: 360
  ]
