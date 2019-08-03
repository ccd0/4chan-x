Fourchan =
  init: ->
    return unless g.SITE.software is 'yotsuba' and g.VIEW in ['index', 'thread', 'archive']
    BoardConfig.ready @initBoard
    Main.ready @initReady

  initBoard: ->
    if g.BOARD.config.code_tags
      $.on window, 'prettyprint:cb', (e) ->
        return if not (post = g.posts.get(e.detail.ID))
        return if not (pre  = $$('.prettyprint', post.nodes.comment)[+e.detail.i])
        unless $.hasClass pre, 'prettyprinted'
          pre.innerHTML = e.detail.html
          $.addClass pre, 'prettyprinted'
      $.globalEval '''
        window.addEventListener('prettyprint', function(e) {
          window.dispatchEvent(new CustomEvent('prettyprint:cb', {
            detail: {
              ID:   e.detail.ID,
              i:    e.detail.i,
              html: prettyPrintOne(e.detail.html)
            }
          }));
        }, false);
      '''
      Callbacks.Post.push
        name: 'Parse [code] tags'
        cb:   Fourchan.code
      g.posts.forEach (post) -> Callbacks.Post.execute post, ['Parse [code] tags'], true
      ExpandComment.callbacks.push Fourchan.code

    if g.BOARD.config.math_tags
      $.global ->
        window.addEventListener 'mathjax', (e) ->
          if window.MathJax
            window.MathJax.Hub.Queue ['Typeset', window.MathJax.Hub, e.target]
          else
            unless document.querySelector 'script[src^="//cdn.mathjax.org/"]' # don't load MathJax if already loading
              window.loadMathJax()
              window.loadMathJax = ->
            # 4chan only handles post comments on MathJax load; anything else (e.g. the QR preview) must be queued explicitly.
            unless e.target.classList.contains 'postMessage'
              document.querySelector('script[src^="//cdn.mathjax.org/"]').addEventListener 'load', ->
                window.MathJax.Hub.Queue ['Typeset', window.MathJax.Hub, e.target]
              , false
        , false
      Callbacks.Post.push
        name: 'Parse [math] tags'
        cb:   Fourchan.math
      g.posts.forEach (post) -> Callbacks.Post.execute post, ['Parse [math] tags'], true
      ExpandComment.callbacks.push Fourchan.math

  # Disable 4chan's ID highlighting (replaced by IDHighlight) and reported post hiding.
  initReady: ->
    $.global ->
      window.clickable_ids = false
      for node in document.querySelectorAll '.posteruid, .capcode'
        node.removeEventListener 'click', window.idClick, false
      return

  code: ->
    return if @isClone
    $.ready =>
      for pre, i in $$('.prettyprint', @nodes.comment) when not $.hasClass(pre, 'prettyprinted')
        $.event 'prettyprint', {ID: @fullID, i: i, html: pre.innerHTML}, window
      return

  math: ->
    return unless /\[(math|eqn)\]/.test @nodes.comment.textContent
    # XXX <wbr> tags frequently break MathJax; remove them.
    if (wbrs = $$ 'wbr', @nodes.comment).length
      $.rm wbr for wbr in wbrs
      @nodes.comment.normalize()
    cb = =>
      return unless doc.contains @nodes.comment
      $.off d, 'PostsInserted', cb
      $.event 'mathjax', null, @nodes.comment
    $.on d, 'PostsInserted', cb
    cb()
