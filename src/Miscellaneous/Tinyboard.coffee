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
            try
              {redirect, noko} = request.responseJSON
              if redirect and originalNoko? and !originalNoko and !noko
                detail.redirect = redirect
            event = new CustomEvent 'QRPostSuccessful', {bubbles: true, detail: detail}
            document.dispatchEvent event
          originalNoko = window.tb_settings?.ajax?.always_noko_replies
          ((window.tb_settings or= {}).ajax or= {}).always_noko_replies = true
        , {boardID: g.BOARD.ID, threadID: g.THREADID}
