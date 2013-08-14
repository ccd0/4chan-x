Fourchan =
  init: ->
    return if g.VIEW is 'catalog'

    board = g.BOARD.ID
    if board is 'g'
      $.globalEval """
        window.addEventListener('prettyprint', function(e) {
          var pre = e.detail;
          pre.innerHTML = prettyPrintOne(pre.innerHTML);
        }, false);
      """
      Post::callbacks.push
        name: 'Parse /g/ code'
        cb:   @code
    if board is 'sci'
      # https://github.com/MayhemYDG/4chan-x/issues/645#issuecomment-13704562
      $.globalEval """
        window.addEventListener('jsmath', function(e) {
          if (jsMath.loaded) {
            // process one post
            jsMath.ProcessBeforeShowing(e.detail);
          } else {
            // load jsMath and process whole document
            jsMath.Autoload.Script.Push('ProcessBeforeShowing', [null]);
            jsMath.Autoload.LoadJsMath();
          }
        }, false);
      """
      Post::callbacks.push
        name: 'Parse /sci/ math'
        cb:   @math
  code: ->
    return if @isClone
    for pre in $$ '.prettyprint', @nodes.comment
      # Don't pretty print twice:
      # Might need a better way to detect if a .prettyprint
      # is already pretty-printed. We can't just look for spans
      # since 4chan inserts its quotes and whatnot inside.
      unless $ '.pln', pre
        $.event 'prettyprint', pre, window
    return
  math: ->
    return if @isClone or !$ '.math', @nodes.comment
    $.event 'jsmath', @nodes.post, window
  parseThread: (threadID, offset, limit) ->
    # Fix /sci/
    # Fix /g/
    $.event '4chanParsingDone',
      threadId: threadID
      offset: offset
      limit: limit
