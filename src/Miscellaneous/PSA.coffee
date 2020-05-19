PSA =
  init: ->
    return unless g.SITE.software is 'yotsuba'
    if g.BOARD.ID is 'qa'
      announcement = <%= html('Stay in touch with your <a href="https://www.4chan-x.net/qa_friends.html" target="_blank" rel="noopener">/qa/ friends</a>!') %>
    return unless announcement
    el = $.el 'div', {className: 'fcx-announcement'}, announcement
    $.onExists doc, '.boardBanner', (banner) ->
      $.after banner, el

  site: ->
    if location.hostname is 'samachan.org'
      $.onExists doc, '.navbar', (navbar) ->
        link = $.el 'a',
          href: 'https://sushigirl.us/yakuza/res/776.html'
          target: '_blank'
          rel: 'noopener'
          textContent: 'Looking for a new home? Some users are regrouping on SushiChan. (a message from 4chan X)'
        $.add navbar, [$.el('br'), link]
