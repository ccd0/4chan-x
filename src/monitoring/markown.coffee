MarkOwn = 
  init: ->
    Main.callbacks.push @node
    @posts = $.get 'ownedPosts', {}

  node: (post) ->
    posts = MarkOwn.posts
    $.addClass quote, 'ownpost' for quote in post.quotes when quote.hash and posts[quote.hash[2..]]