Post.Clone = class extends Post
  isClone: true

  constructor: (@origin, @context, contractThumb) ->
    for key in ['ID', 'fullID', 'board', 'thread', 'info', 'quotes', 'isReply']
      # Copy or point to the origin's key value.
      @[key] = @origin[key]

    {nodes} = @origin
    cloneNode = if contractThumb
      @cloneWithoutVideo
    else
      (node) -> node.cloneNode true
    root = cloneNode nodes.root
    # Handle case where comment has been moved into catalog thread
    if nodes.comment.parentNode isnt nodes.post
      $.add $('.post', root), cloneNode(nodes.comment)
    Post.Clone.prefix or= 0
    for node in [root, $$('[id]', root)...]
      node.id = Post.Clone.prefix + node.id
    Post.Clone.prefix++

    @nodes = @parseNodes root

    # Remove inlined posts inside of this post.
    for inline  in $$ '.inline',  @nodes.post
      $.rm inline
    for inlined in $$ '.inlined', @nodes.post
      $.rmClass inlined, 'inlined'

    root.hidden = false # post hiding
    $.rmClass root,        'forwarded' # quote inlining
    $.rmClass @nodes.post, 'highlight' # keybind navigation, ID highlighting

    @parseQuotes()
    @quotes = [@origin.quotes...]

    if @origin.file
      # Copy values, point to relevant elements.
      # See comments in Post's constructor.
      @file = {}
      for key, val of @origin.file
        @file[key] = val
      file = $ '.file', @nodes.post
      @file.text  = file.firstElementChild
      @file.link  = $ '.fileText > a, .fileText-original', file
      @file.thumb = $ '.fileThumb > [data-md5]', file
      @file.fullImage = $ '.full-image', file
      @file.videoControls = $ '.video-controls', @file.text

      @file.thumb.muted = true if @file.videoThumb

      if @file.thumb?.dataset.src
        @file.thumb.src = @file.thumb.dataset.src
        # XXX https://bugzilla.mozilla.org/show_bug.cgi?id=1021289
        @file.thumb.removeAttribute 'data-src'

      # Contract thumbnails in quote preview
      ImageExpand.contract @ if @file.thumb and contractThumb

    @isDead  = true if @origin.isDead
    root.dataset.clone = @origin.clones.push(@) - 1

  cloneWithoutVideo: (node) ->
    if node.tagName is 'VIDEO' and !node.dataset.md5 # (exception for WebM thumbnails)
      []
    else if node.nodeType is Node.ELEMENT_NODE and $ 'video', node
      clone = node.cloneNode false
      $.add clone, @cloneWithoutVideo child for child in node.childNodes
      clone
    else
      node.cloneNode true
