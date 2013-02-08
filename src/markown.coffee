MarkOwn = 
  init: ->
    Main.callbacks.push @node
    @posts = $.get 'ownedPosts', {}

  node: (post) ->
    posts = MarkOwn.posts
    for quote in post.quotes
      if quote.hash and posts[quote.hash[2..]]
        $.addClass quote, 'ownpost'