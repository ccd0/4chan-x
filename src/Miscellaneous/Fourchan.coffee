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
        window.addEventListener('jsmath', function(e) {
          if (!jsMath) return;
          if (jsMath.loaded) {
            // process one post
            jsMath.ProcessBeforeShowing(e.target);
          } else if (jsMath.Autoload && jsMath.Autoload.checked) {
            // load jsMath and process whole document
            jsMath.Autoload.Script.Push('ProcessBeforeShowing', [null]);
            jsMath.Autoload.LoadJsMath();
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
    return if (@isClone and doc.contains @origin.nodes.root) or !$ '.math', @nodes.comment
    $.asap (=> doc.contains @nodes.comment), =>
      $.event 'jsmath', null, @nodes.comment
