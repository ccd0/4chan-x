Flash =
  init: ->
    if g.BOARD.ID is 'f' and Conf['Enable Native Flash Embedding']
      Callbacks.Thread.push
        name: 'Flash Embedding'
        cb:   @node

  node: ->
    if $.hasStorage
      $.global -> window.SWFEmbed.init() if JSON.parse(localStorage['4chan-settings'] or '{}').disableAll
    else
      if g.VIEW is 'thread'
        $.global -> window.Main.tid = location.pathname.split(/\/+/)[3]
      $.global -> window.SWFEmbed.init()

return Flash
