PSA =
  init: ->
    return unless g.SITE.software is 'yotsuba'
    if g.BOARD.ID is 'qa'
      announcement = <%= html('Stay in touch with your <a href="https://www.4chan-x.net/qa_friends.html" target="_blank" rel="noopener">/qa/ friends</a>!') %>
    return unless announcement
    el = $.el 'div', {className: 'fcx-announcement'}, announcement
    $.onExists doc, '.boardBanner', (banner) ->
      $.after banner, el
