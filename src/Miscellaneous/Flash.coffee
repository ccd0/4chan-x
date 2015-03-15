Flash =
  init: ->
    if g.BOARD.ID is 'f'
      $.ready Flash.initReady

  initReady: ->
    $.globalEval 'if (JSON.parse(localStorage["4chan-settings"] || "{}").disableAll) SWFEmbed.init();'
