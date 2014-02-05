Fourchan =
  init: ->
    board = g.BOARD.ID
    if board is 'g'
      $.globalEval """
        window.addEventListener('prettyprint', function(e) {
          window.dispatchEvent(new CustomEvent('prettyprint:cb', {
            detail: prettyPrintOne(e.detail)
          }));
        }, false);
      """
      Post.callbacks.push
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
      Post.callbacks.push
        name: 'Parse /sci/ math'
        cb:   @math
  code: ->
    return if @isClone
    apply = (e) -> pre.innerHTML = e.detail
    $.on window, 'prettyprint:cb', apply
    for pre in $$ '.prettyprint:not(.prettyprinted)', @nodes.comment
      $.event 'prettyprint', pre.innerHTML, window
    $.off window, 'prettyprint:cb', apply
    return
  math: ->
    return if @isClone or !$ '.math', @nodes.comment
    $.event 'jsmath', @nodes.post, window
