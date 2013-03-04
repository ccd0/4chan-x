RevealSpoilers =
  init: ->
    QuotePreview.callbacks.push @node
    ExpandComment.callbacks.push @node
    Main.callbacks.push @node

  node: (post) ->
    img = post.img
    if not (img and /^Spoiler/.test img.alt) or post.isArchived
      return
    img.removeAttribute 'style'
    # revealed spoilers do not have height/width set, this fixes auto-gifs dimensions.
    s = img.style
    s.maxHeight = s.maxWidth = if /\bop\b/.test post.class then '250px' else '125px'
    img.src = "//thumbs.4chan.org#{img.parentNode.pathname.replace /src(\/\d+).+$/, 'thumb$1s.jpg'}"