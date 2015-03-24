Flash =
  init: ->
    if g.BOARD.ID is 'f' and Conf['Enable Native Flash Embedding']
      $.ready Flash.initReady

  initReady: ->
    $.globalEval 'if (JSON.parse(localStorage["4chan-settings"] || "{}").disableAll) SWFEmbed.init();'
