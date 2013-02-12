MarkOwn = 
  init: ->
    Main.callbacks.push @node
    @posts = $.get 'ownedPosts', {}

  node: (post) ->
    posts = MarkOwn.posts
    quotes = []
    for quote in quotes.pushArrays post.quotes, post.backlinks
      if quote.hash and posts[quote.hash[2..]]
        $.addClass quote, 'ownpost'