Embedding =
  init: ->
    return unless Conf['Embedding'] or Conf['Link Title']
    @types = {}
    @types[type.key] = type for type in @ordered_types

    if Conf['Floating Embeds']
      @dialog = UI.dialog 'embedding', 'top: 50px; right: 0px;',
        <%= importHTML('Features/Embed') %>
      @media = $ '#media-embed', @dialog
      $.one d, '4chanXInitFinished', @ready

    if Conf['Link Title']
      $.on d, '4chanXInitFinished PostsInserted', ->
        for key, service of Embedding.types when service.title?.batchSize
          Embedding.flushTitles service.title
        return

  events: (post) ->
    return unless Conf['Embedding']
    i = 0
    items = $$ '.embedder', post.nodes.comment
    while el = items[i++]
      $.on el, 'click', Embedding.cb.toggle
      Embedding.cb.toggle.call el if $.hasClass el, 'embedded'
    return

  process: (link, post) ->
    return unless Conf['Embedding'] or Conf['Link Title']
    return if $.x 'ancestor::pre', link
    if data = Embedding.services link
      data.post = post
      Embedding.embed data if Conf['Embedding']
      Embedding.title data if Conf['Link Title']

  services: (link) ->
    {href} = link
    for type in Embedding.ordered_types when match = type.regExp.exec href
      return if type.dummy
      return {key: type.key, uid: match[1], options: match[2], link}
    return

  embed: (data) ->
    {key, uid, options, link, post} = data
    {href} = link
    $.addClass link, key.toLowerCase()

    if Embedding.types[key].httpOnly and location.protocol isnt 'http:'
      embed = $.el 'a',
        href:        "http://boards.4chan.org/#{post.board}/thread/#{post.thread}#p#{post}"
        textContent: '(HTTP)'
        title:       "#{key} does not support HTTPS."
      $.after link, [$.tn(' '), embed]
      return

    embed = $.el 'a',
      className:   'embedder'
      href:        'javascript:;'
      textContent: '(embed)'

    embed.dataset[name] = value for name, value of {key, uid, options, href}

    $.on embed, 'click', Embedding.cb.toggle
    $.after link, [$.tn(' '), embed]

    if Conf['Auto-embed'] and !Conf['Floating Embeds'] and !post.isFetchedQuote
      $.asap (-> doc.contains embed), ->
        Embedding.cb.toggle.call embed

  ready: ->
    $.addClass Embedding.dialog, 'empty'
    $.on $('.close', Embedding.dialog), 'click',     Embedding.closeFloat
    $.on $('.move',  Embedding.dialog), 'mousedown', Embedding.dragEmbed
    $.on $('.jump',  Embedding.dialog), 'click', ->
      Header.scrollTo Embedding.lastEmbed if doc.contains Embedding.lastEmbed
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
      style.visibility = ''
      return
    $.on d, 'mouseup', Embedding.dragEmbed
    Embedding.dragEmbed.mouseup = true
    style.visibility = 'hidden'

  title: (data) ->
    {key, uid, options, link, post} = data
    return unless service = Embedding.types[key].title
    if service.batchSize
      (service.queue or= []).push data
      if service.queue.length >= service.batchSize
        Embedding.flushTitles service
    else
      unless $.cache service.api(uid), (-> Embedding.cb.title @, data), {responseType: 'json'}
        $.extend link, <%= html('[${key}] <span class="warning">Title Link Blocked</span> (are you using NoScript?)</a>') %>

  flushTitles: (service) ->
    {queue} = service
    return unless queue?.length
    service.queue = []
    cb = ->
      Embedding.cb.title @, data for data in queue
      return
    unless $.cache service.api(data.uid for data in queue), cb, {responseType: 'json'}
      for data in queue
        $.extend data.link, <%= html('[${data.key}] <span class="warning">Title Link Blocked</span> (are you using NoScript?)</a>') %>
    return

  cb:
    toggle: (e) ->
      e?.preventDefault()
      if Conf['Floating Embeds']
        return unless div = Embedding.media.firstChild
        $.replace div, Embedding.cb.embed @
        Embedding.lastEmbed = Get.postFromNode(@).nodes.root
        $.rmClass Embedding.dialog, 'empty'
        return
      if $.hasClass @, "embedded"
        $.rm @nextElementSibling
        @textContent = '(embed)'
      else
        $.after @, Embedding.cb.embed @
        @textContent = '(unembed)'
      $.toggleClass @, 'embedded'

    embed: (a) ->
      # We create an element to embed
      container = $.el 'div'
      $.add container, el = (type = Embedding.types[a.dataset.key]).el a

      # Set style values.
      el.style.cssText = if type.style?
        type.style
      else
        "border:0;width:640px;height:390px"

      return container

    title: (req, data) ->
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
      regExp: /\.(?:mp3|ogg|wav)(?:\?|$)/i
      style: ''
      el: (a) ->
        $.el 'audio',
          controls:    true
          preload:     'auto'
          src:         a.dataset.href
    ,
      key: 'Gist'
      regExp: /^\w+:\/\/gist\.github\.com\/(?:[\w\-]+\/)?(\w+)/
      el: (a) ->
        el = $.el 'iframe'
        el.setAttribute 'sandbox', 'allow-scripts'
        content = <%= html('<html><head><title>${a.dataset.uid}</title></head><body><script src="https://gist.github.com/${a.dataset.uid}.js"></script></body></html>') %>
        el.src = "data:text/html;charset=utf-8,<!doctype html>#{encodeURIComponent content.innerHTML}"
        el
      title:
        api: (uid) -> "https://api.github.com/gists/#{uid}"
        text: ({files}) ->
          return file for file of files when files.hasOwnProperty file
    ,
      key: 'image'
      regExp: /\.(?:gif|png|jpg|jpeg|bmp)(?:\?|$)/i
      style: ''
      el: (a) ->
        $.el 'div', <%= html('<a target="_blank" href="${a.dataset.href}"><img src="${a.dataset.href}" style="max-width: 80vw; max-height: 80vh;"></a>') %>
    ,
      key: 'InstallGentoo'
      regExp: /^\w+:\/\/paste\.installgentoo\.com\/view\/(?:raw\/|download\/|embed\/)?(\w+)/
      el: (a) ->
        $.el 'iframe',
          src: "https://paste.installgentoo.com/view/embed/#{a.dataset.uid}"
    ,
      key: 'Twitter'
      regExp: /^\w+:\/\/(?:www\.)?twitter\.com\/(\w+\/status\/\d+)/
      el: (a) -> 
        $.el 'iframe',
          src: "https://twitframe.com/show?url=https://twitter.com/#{a.dataset.uid}"
    ,
      key: 'LiveLeak'
      regExp: /^\w+:\/\/(?:\w+\.)?liveleak\.com\/.*\?.*i=(\w+)/
      httpOnly: true
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
      regExp: /^\w+:\/\/(?:www\.)?mediacru\.sh\/([\w\-]+)/
      style: ''
      el: (a) ->
        el = $.el 'div'
        $.queueTask -> $.cache "https://mediacru.sh/#{a.dataset.uid}.json", ->
          return unless doc.contains el
          {status} = @
          return el.textContent = "ERROR #{status}" unless status in [200, 304]
          {files} = @response
          for type in ['video/mp4', 'video/webm', 'video/ogv', 'image/svg+xml', 'image/png', 'image/gif', 'image/jpeg', 'audio/mpeg', 'audio/ogg']
            for file in files
              if file.type is type
                embed = file
                break
            break if embed
          return el.textContent = "ERROR: Not a valid filetype" unless embed
          switch embed.type
            when 'video/mp4', 'video/webm', 'video/ogv'
              $.extend el, <%= html('<video controls loop style="max-width: 80vw; max-height: 80vh;"><source type="video/mp4"><source type="video/webm"></video>') %>
              for ext, i in ['mp4', 'webm']
                el.firstChild.children[i].src = "https://mediacru.sh/#{a.dataset.uid}.#{ext}"
            when 'image/svg+xml', 'image/png', 'image/gif', 'image/jpeg'
              $.extend el, <%= html('<a target="_blank" href="${a.dataset.href}"><img src="https://mediacru.sh/${file.file}" style="max-width: 80vw; max-height: 80vh;"></a>') %>
            when 'audio/mpeg', 'audio/ogg'
              $.extend el, <%= html('<audio controls><source type="audio/ogg" src="https://mediacru.sh/${a.dataset.uid}.ogg"></audio>') %>
            else
              el.textContent = "ERROR: No valid filetype."
          return
        el
    ,
      key: 'Pastebin'
      regExp: /^\w+:\/\/(?:\w+\.)?pastebin\.com\/(?!u\/)(?:[\w\.]+\?i\=)?(\w+)/
      httpOnly: true
      el: (a) ->
        div = $.el 'iframe',
          src: "http://pastebin.com/embed_iframe.php?i=#{a.dataset.uid}"
    ,
      key: 'Gfycat'
      regExp: /^\w+:\/\/(?:www\.)?gfycat\.com\/(?:iframe\/)?(\w+)/
      el: (a) ->
        div = $.el 'iframe',
          src: "//gfycat.com/iframe/#{a.dataset.uid}"
    ,
      key: 'SoundCloud'
      regExp: /^\w+:\/\/(?:www\.)?(?:soundcloud\.com\/|snd\.sc\/)([\w\-\/]+)/
      style: 'border: 0; width: 500px; height: 400px;'
      el: (a) ->
        $.el 'iframe',
          src: "https://w.soundcloud.com/player/?visual=true&show_comments=false&url=https%3A%2F%2Fsoundcloud.com%2F#{encodeURIComponent a.dataset.uid}"
      title:
        api: (uid) -> "//soundcloud.com/oembed?format=json&url=https%3A%2F%2Fsoundcloud.com%2F#{encodeURIComponent uid}"
        text: (_) -> _.title
    ,
      key: 'StrawPoll'
      regExp: /^\w+:\/\/(?:www\.)?strawpoll\.me\/(?:embed_\d+\/)?(\d+(?:\/r)?)/
      httpOnly: true
      style: 'border: 0; width: 600px; height: 406px;'
      el: (a) ->
        $.el 'iframe',
          src: "http://strawpoll.me/embed_1/#{a.dataset.uid}"
    ,
      key: 'TwitchTV'
      regExp: /^\w+:\/\/(?:www\.)?twitch\.tv\/([^#\&\?]*)/
      httpOnly: true
      style: "border: none; width: 640px; height: 360px;"
      el: (a) ->
        if result = /(\w+)\/([bc])\/(\d+)/i.exec a.dataset.uid
          [_, channel, type, id] = result
          idparam = {'b': 'archive_id', 'c': 'chapter_id'}
          obj = $.el 'object',
            data: 'http://www.twitch.tv/widgets/archive_embed_player.swf'
          $.extend obj, <%= html('<param name="allowFullScreen" value="true"><param name="flashvars">') %>
          obj.children[1].value = "channel=#{channel}&start_volume=25&auto_play=false&#{idparam[type]}=#{id}"
          obj
        else
          channel = (/(\w+)/.exec a.dataset.uid)[0]
          obj = $.el 'object',
            data: "http://www.twitch.tv/widgets/live_embed_player.swf?channel=#{channel}"
          $.extend obj, <%= html('<param name="allowFullScreen" value="true"><param name="flashvars">') %>
          obj.children[1].value = "hostname=www.twitch.tv&channel=#{channel}&auto_play=true&start_volume=25"
          obj
    ,
      key: 'Vocaroo'
      regExp: /^\w+:\/\/(?:www\.)?vocaroo\.com\/i\/(\w+)/
      style: ''
      el: (a) ->
        $.el 'audio',
          controls: true
          preload: 'auto'
          src: "http://vocaroo.com/media_command.php?media=#{a.dataset.uid}&command=download_ogg"
    ,
      key: 'Vimeo'
      regExp:  /^\w+:\/\/(?:www\.)?vimeo\.com\/(\d+)/
      el: (a) ->
        $.el 'iframe',
          src: "//player.vimeo.com/video/#{a.dataset.uid}?wmode=opaque"
      title:
        api: (uid) -> "https://vimeo.com/api/oembed.json?url=http://vimeo.com/#{uid}"
        text: (_) -> _.title
    ,
      key: 'Vine'
      regExp: /^\w+:\/\/(?:www\.)?vine\.co\/v\/(\w+)/
      style: 'border: none; width: 500px; height: 500px;'
      el: (a) ->
        $.el 'iframe',
          src: "https://vine.co/v/#{a.dataset.uid}/card"
    ,
      key: 'YouTube'
      regExp: /^\w+:\/\/(?:youtu.be\/|[\w\.]*youtube[\w\.]*\/.*(?:v=|\/embed\/|\/v\/|\/videos\/))([\w\-]{11})[^#\&\?]?(.*)/
      el: (a) ->
        start = a.dataset.options.match /\b(?:star)?t\=(\w+)/
        start = start[1] if start
        if start and !/^\d+$/.test start
          start += ' 0h0m0s'
          start = 3600 * start.match(/(\d+)h/)[1] + 60 * start.match(/(\d+)m/)[1] + 1 * start.match(/(\d+)s/)[1]
        el = $.el 'iframe',
          src: "//www.youtube.com/embed/#{a.dataset.uid}?wmode=opaque#{if start then '&start=' + start else ''}"
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
    ,
      key: 'Loopvid'
      regExp: /^\w+:\/\/(?:www\.)?loopvid.appspot.com\/((?:pf|kd|lv|mc|gd|gh|db|nn)\/[\w\-]+(,[\w\-]+)*|fc\/\w+\/\d+)/
      style: 'max-width: 80vw; max-height: 80vh;'
      el: (a) ->
        el = $.el 'video',
          controls: true
          preload:  'auto'
          loop:     true
        [_, host, names] = a.dataset.uid.match /(\w+)\/(.*)/
        types = if host in ['gd', 'fc'] then [''] else ['.webm', '.mp4']
        for name in names.split ','
          for type in types
            base = "#{name}#{type}"
            url = switch host
              # list from src/loopvid.py at http://loopvid.appspot.com/source.html
              when 'pf' then "http://a.pomf.se/#{base}"
              when 'kd' then "http://kastden.org/loopvid/#{base}"
              when 'lv' then "http://loopvid.mooo.com/videos/#{base}"
              when 'mc' then "https://cdn.mediacru.sh/#{base}"
              when 'gd' then "https://docs.google.com/uc?export=download&id=#{base}"
              when 'gh' then "https://googledrive.com/host/#{base}"
              when 'db' then "https://googledrive.com/host/#{base}"
              when 'fc' then "//i.4cdn.org/#{base}.webm"
              when 'nn' then "http://naenara.eu/loopvids/#{base}"
            $.add el, $.el 'source', src: url
        el
    ,
      key: 'Clyp'
      regExp: /^\w+:\/\/(?:www\.)?clyp\.it\/(\w+)/
      style: ''
      el: (a) ->
        $.el 'audio',
          controls: true
          preload: 'auto'
          src: "http://clyp.it/#{a.dataset.uid}.ogg"
    ,
      # dummy entries: not implemented but included to prevent them being wrongly embedded as a subsequent type
      key: 'Loopvid-dummy'
      regExp: /^\w+:\/\/(?:www\.)?loopvid.appspot.com\//
      dummy: true
    ,
      key: 'MediaFire-dummy'
      regExp: /^\w+:\/\/(?:www\.)?mediafire.com\//
      dummy: true
    ,
      key: 'video'
      regExp: /\.(?:ogv|webm|mp4)(?:\?|$)/i
      style: 'max-width: 80vw; max-height: 80vh;'
      el: (a) ->
        $.el 'video',
          controls: true
          preload:  'auto'
          src:      a.dataset.href
  ]
