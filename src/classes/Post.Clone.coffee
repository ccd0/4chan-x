Post.Clone = class extends Post
  isClone: true

  constructor: ->
    that = Object.create(Post.Clone.prototype)
    that.construct arguments...
    return that

  construct: (@origin, @context, contractThumb) ->
    for key in ['ID', 'postID', 'threadID', 'boardID', 'siteID', 'fullID', 'board', 'thread', 'info', 'quotes', 'isReply']
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

    @files = []
    fileRoots = @fileRoots() if @origin.files.length
    for originFile in @origin.files
      # Copy values, point to relevant elements.
      file = {}
      for key, val of originFile
        file[key] = val
      fileRoot = fileRoots[file.docIndex]
      for key, selector of g.SITE.selectors.file
        file[key] = $ selector, fileRoot
      file.thumbLink = file.thumb?.parentNode
      file.fullImage = $ '.full-image', file.thumbLink if file.thumbLink
      file.videoControls = $ '.video-controls', file.text
      file.thumb.muted = true if file.videoThumb
      @files.push file

    if @files.length
      @file = @files[0]

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
