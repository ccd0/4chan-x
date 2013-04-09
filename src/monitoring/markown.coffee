MarkOwn =
  init: ->
    Main.callbacks.push @node
    @posts = $.get 'ownedPosts', {}

  node: (post) ->
    posts = MarkOwn.posts

    for quote in post.quotes when quote.hash and posts[quote.hash[2..]]
      owned = true
      $.addClass quote, 'ownreply'
      quote.textContent += " (You)"

    if owned
      $.addClass post.el, 'quotedYou'

    if posts[post.ID]
      $.addClass post.el, 'yourPost'
      
    return