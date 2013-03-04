Linkify =
  init: ->
    if Conf['Embedding']
      QuoteInline.callbacks.push (post) ->
        for embed in $$('.embed', post.blockquote)
          $.on embed, 'click', Linkify.toggle
        return
    QuotePreview.callbacks.push @node
    ExpandComment.callbacks.push @node
    Main.callbacks.push @node

  regString: ///(
    \b(
      [a-z]+:// # http://, ftp://
      |
      [a-z]{3,}\.[-a-z0-9]+\.[a-z]+
      |
      [-a-z0-9]+\.[a-z]{2,4} # this-is-my-web-sight.net.
      |
      [0-9]+\.[0-9]+\.[0-9]+\.[0-9]+ # IP Address
      |
      [a-z]{3,}:[a-z0-9?] # mailto:, magnet:
      |
      [a-z0-9._%+-:]+@[a-z0-9.-]+\.[a-z0-9] # E-mails, also possibly anonymous:password@192.168.2.1
    )
    [^\s'"]+ # Terminate at Whitespace
  )///gi

  cypher: $.el 'div'

  node: (post) ->
    snapshot = $.X './/text()', post.blockquote
    cypher = Linkify.cypher
    i      = -1
    len    = snapshot.snapshotLength

    while ++i < len
      nodes = d.createDocumentFragment()
      node  = snapshot.snapshotItem i
      data  = node.data

      # Test for valid links
      continue unless node.parentNode and Linkify.regString.test data

      Linkify.regString.lastIndex = 0

      cypherText = []

      if next = node.nextSibling
        # This is one of the few examples in JS where what you
        # put into a variable is different than what comes out
        cypher.textContent = node.textContent
        cypherText[0]      = cypher.innerHTML

        # i herd u leik wbr
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
          for child in cypher.childNodes
            $.add nodes, child

        cypher.innerHTML = (if link.indexOf(':') < 0 then (if link.indexOf('@') > 0 then 'mailto:' + link else 'http://' + link) else link).replace /<(wbr|s|\/s)>/g, ''

        a = $.el 'a',
          innerHTML: link
          className: 'linkify'
          rel:       'nofollow noreferrer'
          target:    'blank'
          href:      cypher.textContent

        $.add nodes, Linkify.embedder a

        data = data[index + link.length..]

      if data
        # Potential text after the last valid link.
        # & Convert <wbr> into elements
        cypher.innerHTML = data

        # Convert <wbr> into elements
        for child in cypher.childNodes
          $.add nodes, child

      # They were replaced with constructs.
      $.replace node, nodes

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

    # Embed
    else
      # We create an element to embed
      el = (type = Linkify.types[@getAttribute("data-service")]).el.call @

      # Set style values.
      el.style.cssText = if style = type.style
        style
      else
        "border: 0; width: #{$.get 'embedWidth', Config['embedWidth']}px; height: #{$.get 'embedHeight', Config['embedHeight']}px"

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
      regExp:  /.*(?:soundcloud.com\/|snd.sc\/)([^#\&\?]*).*/
      el: ->
        div = $.el 'div',
          className: "soundcloud"
          name:      "soundcloud"
        $.ajax(
          "//soundcloud.com/oembed?show_artwork=false&&maxwidth=500px&show_comments=false&format=json&url=#{@getAttribute 'data-originalURL'}&color=#{Style.colorToHex Themes[Conf['theme']]['Background Color']}"
          div: div
          onloadend: ->
            @div.innerHTML = JSON.parse(@responseText).html
          false)

    pastebin:
      regExp:  /.*(?:pastebin.com\/)([^#\&\?]*).*/
      el: ->
        div = $.el 'iframe',
          src: "http://pastebin.com/embed_iframe.php?i=#{@name}"

  embedder: (a) ->
    return [a] unless Conf['Embedding']
    
    callbacks = ->
      a.textContent = switch @status
        when 200, 304
          title = "[#{embed.getAttribute 'data-service'}] #{service.text.call @}"
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
        className:    'embed'
        href:         'javascript:;'
        textContent:  '(embed)'

      embed.setAttribute 'data-service', key
      embed.setAttribute 'data-originalURL', a.href

      $.on embed, 'click', Linkify.toggle

      if Conf['Link Title'] and (service = type.title)
        titles = $.get 'CachedTitles', {}

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
