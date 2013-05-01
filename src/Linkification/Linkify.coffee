Linkify =
  init: ->
    return if g.VIEW is 'catalog' or not Conf['Linkify']

    if Conf['Comment Expansion']
      ExpandComment.callbacks.push @node

    Post::callbacks.push
      name: 'Linkify'
      cb:   @node

  regString: ///(
    \b(
      [a-z]+://
      |
      [a-z]{3,}\.[-a-z0-9]+\.[a-z]+
      |
      [-a-z0-9]+\.[a-z]
      |
      [0-9]+\.[0-9]+\.[0-9]+\.[0-9]+
      |
      [a-z]{3,}:[a-z0-9?]
      |
      [a-z0-9._%+-:]+@[a-z0-9.-]+\.[a-z0-9]
    )
    [^\s'"]+
  )///gi

  cypher: $.el 'div'

  node: ->
    if @isClone and Conf['Embedding']
      for embedder in $$ '.embedder', @nodes.comment
        $.on embedder, "click", Linkify.toggle
      return
    snapshot = $.X './/text()', @nodes.comment
    cypher = Linkify.cypher
    i      = -1
    len    = snapshot.snapshotLength

    while ++i < len
      nodes = $.frag()
      node  = snapshot.snapshotItem i
      data  = node.data

      # Test for valid links
      continue unless node.parentNode and Linkify.regString.test data

      Linkify.regString.lastIndex = 0

      cypherText = []

      if next = node.nextSibling
        cypher.textContent = node.textContent
        cypherText[0]      = cypher.innerHTML

        while (next.nodeName.toLowerCase() is 'wbr' or next.nodeName.toLowerCase() is 's') and (lookahead = next.nextSibling) and ((name = lookahead.nodeName) is "#text" or name.toLowerCase() is 'br')
          cypher.textContent = lookahead.textContent

          cypherText.push if spoiler = next.innerHTML then "<s>#{spoiler.replace /</g, ' <'}</s>" else '<wbr>'
          cypherText.push cypher.innerHTML

          $.rm next
          next = lookahead.nextSibling
          $.rm lookahead if lookahead.nodeName is "#text"

          unless next
            break

      if cypherText.length
        data = cypherText.join ''

      links = data.match Linkify.regString

      for link in links
        index = data.indexOf link

        if text = data[...index]
          # press button get bacon
          cypher.innerHTML = text
          for child in [cypher.childNodes...]
            $.add nodes, child

        cypher.innerHTML = (if link.indexOf(':') < 0 then (if link.indexOf('@') > 0 then 'mailto:' + link else 'http://' + link) else link).replace /<(wbr|s|\/s)>/g, ''

        a = $.el 'a',
          innerHTML: link
          className: 'linkify'
          rel:       'nofollow noreferrer'
          target:    '_blank'
          href:      cypher.textContent

        $.add nodes, Linkify.embedder a

        data = data[index + link.length..]

      if data
        # Potential text after the last valid link.
        cypher.innerHTML = data

        # Convert <wbr> into elements
        for child in [cypher.childNodes...]
          $.add nodes, child

      $.replace node, nodes

    if Conf['Auto-embed']
      embeds = $$ '.embedder', @nodes.comment
      for embed in embeds
        embed.click()
    return

  toggle: ->
    # We setup the link to be replaced by the embedded video
    embed = @previousElementSibling

    # Unembed.
    if @className.contains "embedded"
      # Recreate the original link.
      el = $.el 'a',
        rel:         'nofollow noreferrer'
        target:      'blank'
        className:   'linkify'
        href:        url = @getAttribute("data-originalURL")
        textContent: @getAttribute("data-title") or url

      @textContent = '(embed)'
      $.addClass el, "#{@getAttribute 'data-service'}"

    else
      # We create an element to embed
      el = (type = Linkify.types[@getAttribute("data-service")]).el.call @

      # Set style values.
      el.style.cssText = if style = type.style
        style
      else
        "border: 0; width: 640px; height: 390px"

      @textContent = '(unembed)'

    $.replace embed, el
    $.toggleClass @, 'embedded'

  types:
    YouTube:
      regExp:  /.*(?:youtu.be\/|youtube.*v=|youtube.*\/embed\/|youtube.*\/v\/|youtube.*videos\/)([^#\&\?]*).*/
      el: ->
        $.el 'iframe',
          src: "//www.youtube.com/embed/#{@name}"
      title:
        api:  -> "https://gdata.youtube.com/feeds/api/videos/#{@name}?alt=json&fields=title/text(),yt:noembed,app:control/yt:state/@reasonCode"
        text: -> JSON.parse(@responseText).entry.title.$t

    Vocaroo:
      regExp:  /.*(?:vocaroo.com\/)([^#\&\?]*).*/
      style: 'border: 0; width: 150px; height: 45px;'
      el: ->
        $.el 'object',
          innerHTML:  "<embed src='http://vocaroo.com/player.swf?playMediaID=#{@name.replace /^i\//, ''}&autoplay=0' width='150' height='45' pluginspage='http://get.adobe.com/flashplayer/' type='application/x-shockwave-flash'></embed>"

    Vimeo:
      regExp:  /.*(?:vimeo.com\/)([^#\&\?]*).*/
      el: ->
        $.el 'iframe',
          src: "//player.vimeo.com/video/#{@name}"
      title:
        api:  -> "https://vimeo.com/api/oembed.json?url=http://vimeo.com/#{@name}"
        text: -> JSON.parse(@responseText).title

    LiveLeak:
      regExp:  /.*(?:liveleak.com\/view.+i=)([0-9a-z_]+)/
      el: ->
        $.el 'iframe',
          src: "http://www.liveleak.com/e/#{@name}?autostart=true"

    audio:
      regExp:  /(.*\.(mp3|ogg|wav))$/
      el: ->
        $.el 'audio',
          controls:    'controls'
          preload:     'auto'
          src:         @name

    SoundCloud:
      regExp: /.*(?:soundcloud.com\/|snd.sc\/)([^#\&\?]*).*/
      style: 'height: auto; width: 500px; display: inline-block;'
      el: ->
        div = $.el 'div',
          className: "soundcloud"
          name: "soundcloud"
        $.ajax(
          "//soundcloud.com/oembed?show_artwork=false&&maxwidth=500px&show_comments=false&format=json&url=https://www.soundcloud.com/#{@name}"
          div: div
          onloadend: ->
            @div.innerHTML = JSON.parse(@responseText).html
          false)
        div
      title:
        api: -> "//soundcloud.com/oembed?show_artwork=false&&maxwidth=500px&show_comments=false&format=json&url=https://www.soundcloud.com/#{@name}"
        text: -> JSON.parse(@responseText).title

    pastebin:
      regExp:  /.*(?:pastebin.com\/(?!u\/))([^#\&\?]*).*/
      el: ->
        div = $.el 'iframe',
          src: "http://pastebin.com/embed_iframe.php?i=#{@name}"

    gist:
      regExp: /.*(?:gist.github.com\/.*\/)([^#\&\?]*).*/
      el: ->
        div = $.el 'iframe',
          # Github doesn't allow embedding straight from the site, so we use an external site to bypass that.
          src: "http://www.purplegene.com/script?url=https://gist.github.com/#{@name}.js"

  embedder: (a) ->
    return [a] unless Conf['Link Title']
    titles = {}

    callbacks = ->
      a.textContent = switch @status
        when 200, 304
          title = "#{service.text.call @}"
          embed.setAttribute 'data-title', title
          titles[embed.name] = [title, Date.now()]
          $.set 'CachedTitles', titles
          title
        when 404
          "[#{key}] Not Found"
        when 403
          "[#{key}] Forbidden or Private"
        else
          "[#{key}] #{@status}'d"

    for key, type of Linkify.types
      continue unless match = a.href.match type.regExp

      embed = $.el 'a',
        name:         (a.name = match[1])
        className:    'embedder'
        href:         'javascript:;'
        textContent:  '(embed)'

      embed.setAttribute 'data-service', key
      embed.setAttribute 'data-originalURL', a.href
      $.addClass a, "#{embed.getAttribute 'data-service'}"

      $.on embed, 'click', Linkify.toggle

      unless Conf['Embedding']
        embed.hidden = true

      if Conf['Link Title'] and (service = type.title)
        $.get 'CachedTitles', {}, (item) ->
          titles = item['CachedTitles']
          if title = titles[match[1]]
            a.textContent = title[0]
            embed.setAttribute 'data-title', title[0]
          else
            try
              $.cache service.api.call(a), callbacks
            catch err
              a.innerHTML = "[#{key}] <span class=warning>Title Link Blocked</span> (are you using NoScript?)</a>"

      return [a, $.tn(' '), embed]
    return [a]