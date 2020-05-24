PSA =
  init: ->
    if g.SITE.software is 'yotsuba' and g.BOARD.ID is 'qa'
      announcement = <%= html('Stay in touch with your <a href="https://www.4chan-x.net/qa_friends.html" target="_blank" rel="noopener">/qa/ friends</a>!') %>
      el = $.el 'div', {className: 'fcx-announcement'}, announcement
      $.onExists doc, '.boardBanner', (banner) ->
        $.after banner, el
    if 'samachan.org' of Conf['siteProperties'] and 'samachan' not in Conf['PSAseen']
      el = $.el 'span',
        <%= html('<a href="https://sushigirl.us/yakuza/res/776.html" target="_blank" rel="noopener">Looking for a new home?<br>Some former Samachan users are regrouping on SushiChan.</a><br>(a message from 4chan X)') %>
      Main.ready ->
        new Notice 'info', el
        Conf['PSAseen'].push('samachan')
        $.set 'PSAseen', Conf['PSAseen']
