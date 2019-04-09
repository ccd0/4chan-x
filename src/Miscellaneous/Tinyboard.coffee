Tinyboard =
  init: ->
    return unless g.SITE.software is 'tinyboard'
    if g.VIEW is 'thread'
      Main.ready ->
        $.global ->
          {boardID, threadID} = document.currentScript.dataset
          threadID = +threadID
          form = document.querySelector 'form[name="post"]'
          window.$(document).ajaxComplete (event, request, settings) ->
            return unless settings.url is form.action
            return unless (postID = +request.responseJSON?.id)
            detail = {boardID, threadID, postID}
            event = new CustomEvent 'QRPostSuccessful', {bubbles: true, detail: detail}
            document.dispatchEvent event
        , {boardID: g.BOARD.ID, threadID: g.THREADID}
