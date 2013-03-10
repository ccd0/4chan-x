Anonymize =
  init: ->
    QuotePreview.callbacks.push @node
    Main.callbacks.push @node

  node: (post) ->
    name = $ '.postInfo .name', post.el
    name.textContent = 'Anonymous'
    if (trip = name.nextElementSibling) and trip.className is 'postertrip'
      $.rm trip
    if (parent = name.parentNode).className is 'useremail' and not /^mailto:sage$/i.test parent.href
      $.replace parent, name