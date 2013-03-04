BanChecker =
  init: ->
    @now = Date.now()
    return if not Conf['Check for Bans constantly'] and reason = $.get 'isBanned'
      BanChecker.prepend(reason)
    else if Conf['Check for Bans constantly'] or $.get('lastBanCheck', 0) < @now - 6 * $.HOUR
      BanChecker.load()

  load: ->
    @url = 'https://www.4chan.org/banned'
    $.ajax @url,
      onloadend: ->
        if @status is 200 or 304
          $.set 'lastBanCheck', BanChecker.now unless Conf['Check for Bans constantly']
          doc = d.implementation.createHTMLDocument ''
          doc.documentElement.innerHTML = @response
          if /no entry in our database/i.test (msg = $('.boxcontent', doc).textContent.trim())
            if $.get 'isBanned', false
              $.delete 'isBanned'
              $.rm BanChecker.el
              delete BanChecker.el
            return
          $.set 'isBanned', reason =
            if /This ban will not expire/i.test msg
              'You are permabanned.'
            else
              'You are banned.'
          BanChecker.prepend(reason)

  prepend: (reason) ->
    unless BanChecker.el
      Banchecker.el = el = $.el 'h2',
        id:    'banmessage'
        class: 'warning'
        innerHTML: "
          <span>#{reason}</span>
          <a href=#{BanChecker.url} title='Click to find out why.' target=_blank>Click to find out why.</a>"
        title:  'Click to recheck.'
        $.on el.lastChild, 'click', ->
          $.delete 'lastBanCheck' unless Conf['Check for Bans constantly']
          $.delete 'isBanned'
          @parentNode.style.opacity = '.5'
          BanChecker.load()
      $.before $.id('delform'), el
    else
      Banchecker.el.firstChild.textContent = reason