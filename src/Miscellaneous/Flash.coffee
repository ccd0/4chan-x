Flash =
  init: ->
    if g.BOARD.ID is 'f' and Conf['Enable Native Flash Embedding']
      $.ready Flash.initReady

  initReady: ->
    if $.hasStorage
      $.global -> window.SWFEmbed.init() if JSON.parse(localStorage['4chan-settings'] or '{}').disableAll
    else
      $.global -> window.SWFEmbed.init()
