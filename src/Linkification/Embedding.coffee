Embedding =
  init: ->
    return unless g.VIEW in ['index', 'thread', 'archive'] and Conf['Linkify'] and (Conf['Embedding'] or Conf['Link Title'] or Conf['Cover Preview'])
    @types = $.dict()
    @types[type.key] = type for type in @ordered_types

    if Conf['Embedding'] and g.VIEW isnt 'archive'
      @dialog = UI.dialog 'embedding',
        `<%= readHTML('Embed.html') %>`
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
      `<%= html('(<span>un</span>embed)') %>`

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
      {key, uid, options, link, post} = data
      service = Embedding.types[key].title

      {status} = req
      if status in [200, 304] and service.status
        status = service.status(req.response)[0]

      return unless status

      text = "[#{key}] #{switch status
        when 200, 304
          text = service.text req.response, uid
          if typeof text is 'string'
            text
          else
            text = link.textContent
        when 404
          "Not Found"
        when 403, 401
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
      regExp: /^[^?#]+\.(?:gif|png|jpg|jpeg|bmp|webp)(?::\w+)?(?:[?#]|$)/i
      style: ''
      el: (a) ->
        $.el 'div', `<%= html('<a target="_blank" href="${a.dataset.href}"><img src="${a.dataset.href}" style="max-width: 80vw; max-height: 80vh;"></a>') %>`
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
        api: (uid) -> "https://api.clyp.it/oembed?url=https://clyp.it/#{uid}"
        text: (_) -> _.title
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
        el = $.el 'iframe',
          src: "//gfycat.com/ifr/#{a.dataset.uid}"
        el.setAttribute "allowfullscreen", "true"
        el
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
      regExp: /^\w+:\/\/(?:\w+\.)?liveleak\.com\/.*\?.*[tif]=(\w+)/
      el: (a) ->
        el = $.el 'iframe',
          src: "https://www.liveleak.com/e/#{a.dataset.uid}",
        el.setAttribute "allowfullscreen", "true"
        el
    ,
      key: 'Loopvid'
      regExp: /^\w+:\/\/(?:www\.)?loopvid.appspot.com\/#?((?:pf|kd|lv|gd|gh|db|dx|nn|cp|wu|ig|ky|mf|m2|pc|1c|pi|ni|wl|ko|mm|ic|gc)\/[\w\-\/]+(?:,[\w\-\/]+)*|fc\/\w+\/\d+|https?:\/\/.+)/
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
              when 'pc' then ["https://kastden.org/_loopvid_media/pc/#{base}", "https://web.archive.org/web/2/http://a.pomf.cat/#{base}"]
              when '1c' then ["http://b.1339.cf/#{base}"]
              when 'pi' then ["https://kastden.org/_loopvid_media/pi/#{base}", "https://web.archive.org/web/2/https://u.pomf.is/#{base}"]
              when 'ni' then ["https://kastden.org/_loopvid_media/ni/#{base}", "https://web.archive.org/web/2/https://u.nya.is/#{base}"]
              when 'wl' then ["http://webm.land/media/#{base}"]
              when 'ko' then ["https://kordy.kastden.org/loopvid/#{base}"]
              when 'mm' then ["https://kastden.org/_loopvid_media/mm/#{base}", "https://web.archive.org/web/2/https://my.mixtape.moe/#{base}"]
              when 'ic' then ["https://media.8ch.net/file_store/#{base}"]
              when 'fc' then ["//#{ImageHost.host()}/#{base}.webm"]
              when 'gc' then ["https://#{type}.gfycat.com/#{name}.webm"]

            for url in urls
              $.add el, $.el 'source', src: url
        el
    ,
      key: 'Openings.moe'
      regExp: /^\w+:\/\/openings.moe\/\?video=([^.&=]+)/
      style: 'width: 1280px; height: 720px; max-width: 80vw; max-height: 80vh;'
      el: (a) ->
        el = $.el 'iframe',
          src: "https://openings.moe/?video=#{a.dataset.uid}",
        el.setAttribute "allowfullscreen", "true"
        el
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
      regExp: /^\w+:\/\/(?:www\.|secure\.|clips\.|m\.)?twitch\.tv\/(\w[^#\&\?]*)/
      el: (a) ->
        m = a.dataset.href.match /^\w+:\/\/(?:(clips\.)|\w+\.)?twitch\.tv\/(?:\w+\/)?(clip\/)?(\w[^#\&\?]*)/;
        if m[1] or m[2]
          url = "//clips.twitch.tv/embed?clip=#{m[3]}&parent=#{location.hostname}"
        else
          m = a.dataset.uid.match /(\w+)(?:\/(?:v\/)?(\d+))?/
          url = "//player.twitch.tv/?#{if m[2] then "video=v#{m[2]}" else "channel=#{m[1]}"}&autoplay=false&parent=#{location.hostname}"
          if (time = a.dataset.href.match /\bt=(\w+)/)
            url += "&time=#{time[1]}"
        el = $.el 'iframe',
          src: url
        el.setAttribute "allowfullscreen", "true"
        el
    ,
      key: 'Twitter'
      regExp: /^\w+:\/\/(?:www\.|mobile\.)?(?:(?:(?:fx|vx)?twitter|(?:fixup|fixv)?x|twittpr|xcancel)\.com|nitter\.\w+\.\w+)\/(\w+\/status\/\d+)/
      style: 'width: 550px; overflow: hidden; resize: both;'
      el: (a) ->
        cont = $.el 'div'
        renderText = (text) ->
          text.replace /(@\w+|#[^\s#]+)/g, (match) ->
            prefix = match[0]
            word = match.slice 1
            href = if prefix is '#' then "https://x.com/hashtag/#{encodeURIComponent word}" else "https://x.com/#{word}"
            "<a href='#{href}' target='_blank' rel='noopener noreferrer' style='color:#1d9bf0;text-decoration:none;'>#{match}</a>"

        renderMedia = (tweet) ->
          return '' unless tweet.media?.all?.length
          count = tweet.media.all.length

          items = tweet.media.all.map (media, i) ->
            spanStyle = if count is 3 and i is 0 then 'grid-row:span 2;' else ''
            imgStyle  = if count is 1 then 'width:100%;height:auto;display:block;' else 'width:100%;height:100%;object-fit:cover;object-position:center;display:block;'
            inner = switch media.type
              when 'photo'
                "<a href='#{media.url}' target='_blank' rel='noopener noreferrer' style='display:block;height:100%;'><img src='#{media.url}' style='#{imgStyle}'></a>"
              when 'video', 'gif'
                "<video data-src='#{media.url}' controls poster='#{media.thumbnail_url}' preload='meta' style='width:100%;height:100%;object-fit:cover;display:block;'></video>"
              else ''
            "<div style='height:100%;overflow:hidden;#{spanStyle}'>#{inner}</div>"

          grid = switch count
            when 1 then 'display:flex;align-items:center;'
            when 3 then 'display:grid;grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(2,1fr);aspect-ratio:1.5;gap:2px;'
            else       "display:grid;grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(#{Math.ceil count / 2},1fr);aspect-ratio:1.5;gap:2px;"

          "<div style='margin:12px 0;border-radius:12px;overflow:hidden;border:0.5px solid rgba(0,0,0,0.1);max-height:70vh;#{grid}'>#{items.join ''}</div>"

        renderPoll = (poll) ->
          return '' unless poll
          max = Math.max.apply null, poll.choices.map (c) -> c.percentage
          choices = poll.choices.map (choice) ->
            highlight = if choice.percentage is max then 'font-weight:500;' else ''
            """
            <div style='margin-bottom:8px;'>
              <div style='display:flex;justify-content:space-between;font-size:14px;margin-bottom:4px;#{highlight}'>
                <span>#{choice.label}</span>
                <span>#{choice.percentage}%</span>
              </div>
              <div style='background:rgba(0,0,0,0.1);border-radius:4px;height:4px;'>
                <div style='background:#{if choice.percentage is max then '#1d9bf0' else '#cfd9de'};width:#{choice.percentage}%;height:100%;border-radius:4px;'></div>
              </div>
            </div>
            """
          """
          <div style='margin:12px 0;padding:12px;border:0.5px solid rgba(0,0,0,0.1);border-radius:12px;'>
            #{choices.join ''}
            <div style='font-size:13px;color:#536471;margin-top:4px;'>#{poll.total_votes.toLocaleString()} votes</div>
          </div>
          """

        renderQuote = (quote) ->
          return '' unless quote
          avatar = if quote.author?.avatar_url then "<img src='#{quote.author.avatar_url}' style='width:20px;height:20px;border-radius:50%;'>" else ''
          media = renderMedia quote
          poll = renderPoll quote.poll
          """
          <div style='margin-top:12px;border:0.5px solid rgba(0,0,0,0.15);border-radius:12px;padding:12px;'>
            <div style='display:flex;align-items:center;gap:6px;margin-bottom:6px;'>
              #{avatar}
              <span style='font-size:14px;font-weight:700;color:#0f1419;'>#{quote.author?.name or ''}</span>
              <span style='font-size:13px;color:#536471;'>@#{quote.author?.screen_name or ''}</span>
            </div>
            <div style='font-size:14px;line-height:1.5;color:#0f1419;'>#{renderText quote.text or ''}</div>
            #{media}
            #{poll}
          </div>
          """

        renderTweet = (tweet) ->
          date = if tweet.created_at then new Date(tweet.created_at).toLocaleString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true, month: 'short', day: 'numeric', year: 'numeric'}) else ''
          likes = if tweet.likes >= 1000 then "#{(tweet.likes / 1000).toFixed 1}K" else "#{tweet.likes or 0}"
          avatar = if tweet.author?.avatar_url then "<img src='#{tweet.author.avatar_url}' style='width:48px;height:48px;border-radius:50%;display:block;'>" else "<div style='width:48px;height:48px;border-radius:50%;background:#cfd9de;'></div>"
          media = renderMedia tweet
          poll = renderPoll tweet.poll
          quote = renderQuote tweet.quote
          tweetHref = tweet.url or a.dataset.href
          """
          <div style='font-family:sans-serif;border:0.5px solid rgba(0,0,0,0.15);border-radius:12px;padding:16px;box-sizing:border-box;background:#fff;color:#0f1419;'>
            <div style='display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;'>
              <a href='#{tweetHref}' target='_blank' rel='noopener noreferrer' style='flex-shrink:0;'>#{avatar}</a>
              <div style='flex:1;min-width:0;'>
                <a href='#{tweetHref}' target='_blank' rel='noopener noreferrer' style='text-decoration:none;color:inherit;'>
                  <div style='font-size:15px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#0f1419;'>#{tweet.author?.name or ''}</div>
                  <div style='font-size:14px;color:#536471;'>@#{tweet.author?.screen_name or ''}</div>
                </a>
              </div>
              <a href='#{tweetHref}' target='_blank' rel='noopener noreferrer' style='flex-shrink:0;margin-top:2px;'>
                <svg width='20' height='20' viewBox='0 0 24 24' fill='#0f1419'><path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.735-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z'/></svg>
              </a>
            </div>
            <div style='font-size:15px;line-height:1.5;color:#0f1419;margin-bottom:12px;'>#{renderText tweet.text or ''}</div>
            #{media}
            #{poll}
            #{quote}
            <a href='#{tweetHref}' target='_blank' rel='noopener noreferrer' style='font-size:14px;color:#536471;text-decoration:none;display:block;#{if tweet.quote then 'margin-top:12px;' else ''}margin-bottom:12px;'>#{date}</a>
            <div style='display:flex;align-items:center;gap:20px;padding-top:12px;border-top:0.5px solid rgba(0,0,0,0.1);'>
              <a href='https://twitter.com/intent/like?tweet_id=#{tweet.id}' target='_blank' rel='noopener noreferrer' style='display:flex;align-items:center;gap:6px;font-size:14px;color:#536471;text-decoration:none;'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640' width='24' height='24' fill='rgb(249,24,128)'><path d='M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z'/></svg>
                #{likes}
              </a>
              <a href='https://twitter.com/intent/tweet?in_reply_to=#{tweet.id}' target='_blank' rel='noopener noreferrer' style='display:flex;align-items:center;gap:6px;font-size:14px;color:#536471;text-decoration:none;'>
                <svg viewBox='0 0 24 24' width='24' height='24' fill='rgb(29,155,240)'><path d='M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01z'/></svg>
                Reply
              </a>
              <a href='#{tweetHref}' target='_blank' rel='noopener noreferrer' style='margin-left:auto;font-size:14px;color:#006fd6;text-decoration:none;font-weight:500;'>Read on X</a>
            </div>
          </div>
          """

        fetch("https://api.fxtwitter.com/#{a.dataset.uid}")
          .then (r) -> r.json()
          .then ({tweet}) ->
            return unless tweet
            cont.innerHTML = renderTweet tweet
            for videoEl in cont.querySelectorAll 'video[data-src]'
              do (videoEl) ->
                fetch(videoEl.dataset.src, {referrerPolicy: 'no-referrer'})
                  .then (r) -> r.blob()
                  .then (blob) ->
                    videoEl.src = URL.createObjectURL blob
        cont
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
      regExp: /^\w+:\/\/(?:(?:www\.|old\.)?vocaroo\.com|voca\.ro)\/((?:i\/)?\w+)/
      style: ''
      el: (a) ->
        el = $.el 'iframe'
        el.width = 300
        el.height = 60
        el.setAttribute('frameborder', 0)
        el.src = "https://vocaroo.com/embed/#{a.dataset.uid.replace(/^i\//, '')}?autoplay=0"
        el
    ,
      key: 'YouTube'
      regExp: /^\w+:\/\/(?:youtu.be\/|[\w.]*youtube[\w.]*\/.*(?:v=|\bembed\/|\bv\/|live\/|shorts\/))([\w\-]{11})(.*)/
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
        api: (uid) -> "https://www.youtube.com/oembed?url=https%3A//www.youtube.com/watch%3Fv%3D#{uid}&format=json"
        text: (_) -> _.title
        status: (_) ->
          if _.error
            m = _.error.match(/^(\d*)\s*(.*)/)
            [+m[1], m[2]]
          else
            [200, 'OK']
      preview:
        url: (uid) -> "https://img.youtube.com/vi/#{uid}/0.jpg"
        height: 360
  ]
