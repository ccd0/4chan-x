BoardTips =
  tips:
    qa: [
      1
      <%= html(
        'New to /qa/?<br>' +
        '/qa/ is NOT an effective way to contact the mods.<br>' +
        'Message a mod on <a href="https://www.rizon.net/chat" target="_blank">IRC</a> or use <a href="https://www.4chan.org/feedback" target="_blank">feedback</a> instead. ' +
        'More details <a href="https://www.4chan-x.net/qa_instructions.png" target="_blank">here</a>.'
      ) %>
    ]

  init: ->
    tip = BoardTips.tips[g.BOARD.ID]
    seen = Conf['BoardTips.seen']
    return if !tip or (seen[g.BOARD.ID] and seen[g.BOARD.ID] >= tip[0])
    seen[g.BOARD.ID] = tip[0]
    $.set 'BoardTips.seen', seen
    el = $.el 'span', tip[1]
    new Notice 'info', el
