Embed =
  init: ->
    if Conf['Linkify']
      @node = @inlined

    Main.callbacks.push @node

  node: (post) ->
    return if Embed.inlined post
      
  inlined: (post) ->
    if post.isInlined and not post.isCrosspost
      for embed in $$('.embed', post.blockquote)
        $.on embed, 'click', Linkify.toggle
      return true

  regString: ///(
    \b(
      [a-z]+:// # http://, ftp://
      |
      [-a-z0-9]+\.[-a-z0-9]+\.[-a-z0-9]+
      |
      [-a-z0-9]+\.(com|net|tv|org|xxx|us)
    )
    [^\s,]+
  )///gi

  types:
    YouTube:
      regExp:  /.*(?:youtu.be\/|youtube.*v=|youtube.*\/embed\/|youtube.*\/v\/|youtube.*videos\/)([^#\&\?]*).*/
      el: ->
        $.el 'iframe'
          src: "//www.youtube.com/embed/#{@name}"
      title:
        api:  -> "https://gdata.youtube.com/feeds/api/videos/#{@name}?alt=json&fields=title/text(),yt:noembed,app:control/yt:state/@reasonCode"
        text: -> JSON.parse(@responseText).entry.title.$t

    Vocaroo:
      regExp:  /.*(?:vocaroo.com\/)([^#\&\?]*).*/
      style: 'border: 0; width: 150px; height: 45px;'
      el: ->
        $.el 'object'
          innerHTML:  "<embed src='http://vocaroo.com/player.swf?playMediaID=#{@name.replace /^i\//, ''}&autoplay=0' width='150' height='45' pluginspage='http://get.adobe.com/flashplayer/' type='application/x-shockwave-flash'></embed>"

    Vimeo:
      regExp:  /.*(?:vimeo.com\/)([^#\&\?]*).*/
      el: ->
        $.el 'iframe'
          src: "//player.vimeo.com/video/#{@name}"
      title:
        api:  -> "https://vimeo.com/api/oembed.json?url=http://vimeo.com/#{@name}"
        text: -> JSON.parse(@responseText).title

    LiveLeak:
      regExp:  /.*(?:liveleak.com\/view.+i=)([0-9a-z_]+)/
      el: ->
        $.el 'iframe'
          src: "http://www.liveleak.com/e/#{@name}?autostart=true"

    audio:
      regExp:  /(.*\.(mp3|ogg|wav))$/
      el: ->
        $.el 'audio'
          controls:    'controls'
          preload:     'auto'
          src:         @name

    SoundCloud:
      regExp:  /.*(?:soundcloud.com\/|snd.sc\/)([^#\&\?]*).*/
      el: ->
        div = $.el 'div'
          className: "soundcloud"
          name:      "soundcloud"
        $.ajax(
          "//soundcloud.com/oembed?show_artwork=false&&maxwidth=500px&show_comments=false&format=json&url=#{@getAttribute 'data-originalURL'}&color=#{Style.colorToHex Themes[Conf['theme']]['Background Color']}"
          div: div
          onloadend: ->
            @div.innerHTML = JSON.parse(@responseText).html
          false)
        div

  cb: ->
    a.textContent = switch @status
      when 200, 304
        title = "[#{embed.getAttribute 'data-service'}] #{service.text.call @}"
        embed.setAttribute   'data-title', title
        titles[embed.name] = [title, Date.now()]
        $.set 'CachedTitles', titles
        title
        
      when 404
        "[#{key}] Not Found"
        
      when 403
        "[#{key}] Forbidden or Private"
        
      else
        "[#{key}] #{@status}'d"

  embedder: (a) ->
    for key, type of Embed.types
      continue unless match = a.href.match type.regExp

      embed = $.el 'a'
        name:         (a.name = match[1])
        className:    'embed'
        href:         'javascript:;'
        textContent:  '(embed)'

      embed.setAttribute 'data-service',     key
      embed.setAttribute 'data-originalURL', a.href

      $.on embed, 'click', Embed.toggle

      if Conf['Link Title'] and service = type.title
        Embed.title service

      return [a, $.tn(' '), embed]
    return [a]

  title: (service) ->
    titles = $.get 'CachedTitles', {}

    if title = titles[match[1]]
      a.textContent = title[0]
      embed.setAttribute 'data-title', title[0]
    else
      try
        $.cache service.api.call(a), Embedder.cb
      catch err
        a.innerHTML = "[#{key}] <span class=warning>Title Link Blocked</span> (are you using NoScript?)</a>"

  toggle: ->
    # We setup the link to be replaced by the embedded video
    embed = @previousElementSibling

    # Unembed.
    if @className.contains "embedded"
      # Recreate the original link.
      el = $.el 'a'
        rel:         'nofollow noreferrer'
        target:      'blank'
        className:   'linkify'
        href:        url = @getAttribute("data-originalURL")
        textContent: @getAttribute("data-title") or url

      @textContent = '(embed)'

    # Embed
    else
      # We create an element to embed
      el = (type = Embed.types[@getAttribute("data-service")]).el.call @

      # Set style values.
      el.style.cssText = if style = type.style
        style
      else
        "border: 0; width: #{$.get 'embedWidth', Config['embedWidth']}px; height: #{$.get 'embedHeight', Config['embedHeight']}px"

      @textContent = '(unembed)'

    $.replace embed, el
    $.toggleClass @, 'embedded'
