Fourchan =
  init: ->
    return unless g.VIEW in ['index', 'thread']

    if g.BOARD.ID is 'g'
      $.on window, 'prettyprint:cb', (e) ->
        return unless post = g.posts[e.detail.ID]
        return unless pre  = $$('.prettyprint', post.nodes.comment)[e.detail.i]
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
      Post.callbacks.push
        name: 'Parse /g/ code'
        cb:   @code

    if g.BOARD.ID is 'sci'
      $.globalEval '''
        window.addEventListener('mathjax', function(e) {
          if (window.MathJax) {
            window.MathJax.Hub.Queue(function() {
              if (!e.target.querySelector('.MathJax')) {
                window.MathJax.Hub.Typeset(e.target);
              }
            });
          } else {
            if (!document.querySelector('script[src^="//cdn.mathjax.org/"]')) {
              window.loadMathJax();
              window.loadMathJax = function() {};
            }
          }
        }, false);
      '''
      Post.callbacks.push
        name: 'Parse /sci/ math'
        cb:   @math
      CatalogThread.callbacks.push
        name: 'Parse /sci/ math'
        cb:   @math

    # Disable 4chan's ID highlighting (replaced by IDHighlight) and reported post hiding.
    Main.ready ->
      $.globalEval '''
        (function() {
          window.clickable_ids = false;
          var nodes = document.querySelectorAll('.posteruid, .capcode');
          for (var i = 0; i < nodes.length; i++) {
            nodes[i].removeEventListener("click", window.idClick, false);
          }
          window.removeEventListener("message", Report.onMessage, false);
        })();
      '''

  code: ->
    return if @isClone
    $.ready =>
      for pre, i in $$('.prettyprint', @nodes.comment) when not $.hasClass(pre, 'prettyprinted')
        $.event 'prettyprint', {ID: @fullID, i: i, html: pre.innerHTML}, window
      return

  math: ->
    return unless /\[(math|eqn)\]/.test(@nodes.comment.textContent) or $('.math:not([id])', @nodes.comment)
    cb = =>
      return unless doc.contains @nodes.comment
      $.off d, 'PostsInserted', cb
      $.event 'mathjax', null, @nodes.comment
    $.on d, 'PostsInserted', cb
    cb()
