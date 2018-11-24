Post.Clone = class extends Post
  isClone: true

  constructor: (@origin, @context, contractThumb) ->
    for key in ['ID', 'fullID', 'board', 'thread', 'info', 'quotes', 'isReply']
      # Copy or point to the origin's key value.
      @[key] = @origin[key]

    {nodes} = @origin
    root = if contractThumb
      @cloneWithoutVideo nodes.root
    else
      nodes.root.cloneNode true
    Post.Clone.suffix or= 0
    for node in [root, $$('[id]', root)...]
      node.id += "_#{Post.Clone.suffix}"
    Post.Clone.suffix++

    # Remove inlined posts inside of this post.
    for inline  in $$ '.inline', root
      $.rm inline
    for inlined in $$ '.inlined', root
      $.rmClass inlined, 'inlined'

    @nodes = @parseNodes root

    root.hidden = false # post hiding
    $.rmClass root,        'forwarded' # quote inlining
    $.rmClass @nodes.post, 'highlight' # keybind navigation, ID highlighting

    # Remove catalog stuff.
    unless @isReply
      @setCatalogOP false
      $.rm $('.catalog-link', @nodes.post)
      $.rm $('.catalog-stats', @nodes.post)
      $.rm $('.catalog-replies', @nodes.post)

    @parseQuotes()
    @quotes = [@origin.quotes...]

    if @origin.file
      # Copy values, point to relevant elements.
      # See comments in Post's constructor.
      @file = {}
      for key, val of @origin.file
        @file[key] = val
      for key, selector of Site.selectors.file
        @file[key] = $ selector, @nodes.root
      @file.thumbLink = @file.thumb?.parentNode
      @file.fullImage = $ '.full-image', @file.thumbLink if @file.thumbLink
      @file.videoControls = $ '.video-controls', @file.text

      @file.thumb.muted = true if @file.videoThumb

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
