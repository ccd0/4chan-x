EmbedLink =
  init: ->
    a = $.el 'a'
      className: 'embed_link'
      textContent: 'Embed all in post'

    $.on a, 'click', EmbedLink.toggle

    Menu.addEntry
      el: a
      open: (post) ->
        if $ '.embed', (quote = post.blockquote)
          if $ '.embedded', quote
            @el.textContent = 'Unembed all in post'
            EmbedLink[post.id] = true
          $.on @el, 'click', @toggle
          return true
        false

  toggle: ->
    menu   = $.id 'menu'
    id     = menu.dataset.id
    root   = $.id "m#{id}"

    for embed in $$ '.embed', root
      if (!EmbedLink[id] and embed.className.contains 'embedded') or (EmbedLink[id] and !embed.className.contains 'embedded')
        continue
      embed.click()
    EmbedLink[id] = !EmbedLink[id]