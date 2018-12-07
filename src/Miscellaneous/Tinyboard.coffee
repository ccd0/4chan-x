Tinyboard =
  init: ->
    return unless Site.software is 'tinyboard'
    if g.VIEW is 'thread'
      Main.ready ->
        $.global ->
          {boardID, threadID} = document.currentScript.dataset
          threadID = +threadID
          window.$(document).on 'new_post', (e, post) ->
            postID = +post.id.match(/\d*$/)[0]
            detail = {boardID, threadID, postID}
            event = new CustomEvent 'QRPostSuccessful', {bubbles: true, detail: detail}
            document.dispatchEvent event
        , {boardID: g.BOARD.ID, threadID: g.THREADID}
