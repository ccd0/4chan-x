Updater =
  init: ->
    # Setup basic HTML layout.
    html = '<div class=move><span id=count></span> <span id=timer></span></div>'

    # Gather possible toggle configuration variables from Config object
    {checkbox} = Config.updater

    # And create fields for them.
    for name of checkbox
      title = checkbox[name][1]

      # Gather user values.
      checked = if Conf[name] then 'checked' else ''

      # And create HTML for each checkbox.
      html += "<div><label title='#{title}'>#{name}<input name='#{name}' type=checkbox #{checked}></label></div>"

    checked = if Conf['Auto Update'] then 'checked' else ''

    # Per thread auto-update and global or per board update frequency.
    html += "
      <div><label title='Controls whether *this* thread automatically updates or not'>Auto Update This<input name='Auto Update This' type=checkbox #{checked}></label></div>
      <div><label>Interval (s)<input type=number name=Interval#{if Conf['Interval per board'] then "_" + g.BOARD else ''} class=field min=1></label></div>
      <div><label>BGInterval<input type=number name=BGInterval#{if Conf['Interval per board'] then "_" + g.BOARD else ''} class=field min=1></label></div>
      <div><input value='Update Now' type=button name='Update Now'></div>"

    # Create a moveable dialog. See UI.dialog for more information.
    dialog = UI.dialog 'updater', 'bottom: 0; right: 0;', html

    # Point updater variables at HTML elements for ease of access.
    @count  = $ '#count', dialog
    @timer  = $ '#timer', dialog
    @thread = $.id "t#{g.THREAD_ID}"
    @save   = []

    @checkPostCount = 0
    @unsuccessfulFetchCount = 0
    @lastModified = '0'

    # Add event listeners to updater dialogs.
    for input in $$ 'input', dialog
      if input.type is 'checkbox'
        # Change localstorage value on click.
        $.on input, 'click', $.cb.checked
      switch input.name
        when 'Scroll BG'
          $.on input, 'click', @cb.scrollBG
          @cb.scrollBG.call input
        when 'Verbose'
          $.on input, 'click', @cb.verbose
          @cb.verbose.call input
        when 'Auto Update This'
          $.on input, 'click', @cb.autoUpdate
          @cb.autoUpdate.call input
        when 'Interval', 'BGInterval', "Interval_" + g.BOARD, "BGInterval_" + g.BOARD
          input.value = Conf[input.name]
          $.on input, 'change', @cb.interval
          @cb.interval.call input
        when 'Update Now'
          $.on input, 'click', @update

    $.add d.body, dialog

    # Check for new posts on post.
    $.on d, 'QRPostSuccessful', @cb.post

    $.on d, 'visibilitychange ovisibilitychange mozvisibilitychange webkitvisibilitychange', @cb.visibility

  ###
  beep1.wav
  http://freesound.org/people/pierrecartoons1979/sounds/90112

  This work is licensed under the Attribution Noncommercial License.
  http://creativecommons.org/licenses/by-nc/3.0/
  ###

  audio:
    $.el 'audio'
      src: 'data:audio/wav;base64,UklGRjQDAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAc21wbDwAAABBAAADAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkYXRhzAIAAGMms8em0tleMV4zIpLVo8nhfSlcPR102Ki+5JspVEkdVtKzs+K1NEhUIT7DwKrcy0g6WygsrM2k1NpiLl0zIY/WpMrjgCdbPhxw2Kq+5Z4qUkkdU9K1s+K5NkVTITzBwqnczko3WikrqM+l1NxlLF0zIIvXpsnjgydZPhxs2ay95aIrUEkdUdC3suK8N0NUIjq+xKrcz002WioppdGm091pK1w0IIjYp8jkhydXPxxq2K295aUrTkoeTs65suK+OUFUIzi7xqrb0VA0WSoootKm0t5tKlo1H4TYqMfkiydWQBxm16+85actTEseS8y7seHAPD9TIza5yKra01QyWSson9On0d5wKVk2H4DYqcfkjidUQB1j1rG75KsvSkseScu8seDCPz1TJDW2yara1FYxWSwnm9Sn0N9zKVg2H33ZqsXkkihSQR1g1bK65K0wSEsfR8i+seDEQTxUJTOzy6rY1VowWC0mmNWoz993KVc3H3rYq8TklSlRQh1d1LS647AyR0wgRMbAsN/GRDpTJTKwzKrX1l4vVy4lldWpzt97KVY4IXbUr8LZljVPRCxhw7W3z6ZISkw1VK+4sMWvXEhSPk6buay9sm5JVkZNiLWqtrJ+TldNTnquqbCwilZXU1BwpKirrpNgWFhTaZmnpquZbFlbVmWOpaOonHZcXlljhaGhpZ1+YWBdYn2cn6GdhmdhYGN3lp2enIttY2Jjco+bnJuOdGZlZXCImJqakHpoZ2Zug5WYmZJ/bGlobX6RlpeSg3BqaW16jZSVkoZ0bGtteImSk5KIeG5tbnaFkJKRinxxbm91gY2QkIt/c3BwdH6Kj4+LgnZxcXR8iI2OjIR5c3J0e4WLjYuFe3VzdHmCioyLhn52dHR5gIiKioeAeHV1eH+GiYqHgXp2dnh9hIiJh4J8eHd4fIKHiIeDfXl4eHyBhoeHhH96eHmA'

  cb:
    post: ->
      return unless Conf['Auto Update This']
      Updater.unsuccessfulFetchCount = 0
      setTimeout Updater.update, 500

    checkpost: (status) ->
      unless status is 404 or Updater.save.contains(Updater.postID) or Updater.checkPostCount >= 10
        check = (delay) ->
          setTimeout Updater.update, delay
        return check ++Updater.checkPostCount * 500
      Updater.save = []
      Updater.checkPostCount = 0
      delete Updater.postID

    visibility: ->
      return if $.hidden()
      # Reset the counter when we focus this tab.
      Updater.unsuccessfulFetchCount = 0

      if Updater.timer.textContent < (
        if Conf['Interval per board']
          -Conf['Interval_' + g.BOARD]
        else
          -Conf['Interval']
      )
        Updater.set 'timer', -Updater.getInterval()

    interval: ->
      val = parseInt @value, 10
      @value = if val > 0 then val else 30
      $.cb.value.call @
      Updater.set 'timer', -Updater.getInterval()

    verbose: ->
      if Conf['Verbose']
        Updater.set 'count', '+0'
        Updater.timer.hidden = false

      else
        Updater.set 'count', '+0'
        Updater.count.className = ''
        Updater.timer.hidden = true

    autoUpdate: ->
      if Conf['Auto Update This'] = @checked
        Updater.timeoutID = setTimeout Updater.timeout, 1000
      else
        clearTimeout Updater.timeoutID

    scrollBG: ->
      Updater.scrollBG =
        if @checked
          -> true
        else
          -> ! $.hidden()

    load: ->
      switch @status
        when 404
          Updater.set 'timer', ''
          Updater.set 'count', 404
          Updater.count.className = 'warning'
          clearTimeout Updater.timeoutID
          g.dead = true
          if Conf['Unread Count']
            Unread.title = Unread.title.match(/^.+-/)[0] + ' 404'
          else
            d.title = d.title.match(/^.+-/)[0] + ' 404'
          Unread.update true
          QR.abort()

        # XXX 304 -> 0 in Opera
        when 0, 304
          ###
          Status Code 304: Not modified
          By sending the `If-Modified-Since` header we get a proper status code, and no response.
          This saves bandwidth for both the user and the servers and avoid unnecessary computation.
          ###

          Updater.unsuccessfulFetchCount++
          Updater.set 'timer', -Updater.getInterval()
          if Conf['Verbose']
            Updater.set 'count', '+0'
            Updater.count.className = null

        when 200
          Updater.lastModified = @getResponseHeader 'Last-Modified'
          Updater.cb.update JSON.parse(@response).posts
          Updater.set 'timer', -Updater.getInterval()
        else
          Updater.unsuccessfulFetchCount++
          Updater.set 'timer', -Updater.getInterval()
          if Conf['Verbose']
            Updater.set 'count', @statusText
            Updater.count.className = 'warning'

      if Updater.postID
        Updater.cb.checkpost @status

      delete Updater.request

    update: (posts) ->
      if spoilerRange = posts[0].custom_spoiler
        Build.spoilerRange[g.BOARD] = spoilerRange

      lastPost = Updater.thread.lastElementChild
      id = +lastPost.id[2..]
      nodes = for post in posts.reverse()
        break if post.no <= id # Make sure to not insert older posts.
        Updater.save.push post.no if Updater.postID
        Build.postFromObject post, g.BOARD

      count = nodes.length
      if Conf['Verbose']
        Updater.set 'count', "+#{count}"
        Updater.count.className = if count then 'new' else null

      if count
        if Conf['Beep'] and $.hidden() and (Unread.replies.length is 0)
          Updater.audio.play()
        Updater.unsuccessfulFetchCount = 0
      else
        Updater.unsuccessfulFetchCount++
        return

      scroll = Conf['Scrolling'] and Updater.scrollBG() and
        lastPost.getBoundingClientRect().bottom - d.documentElement.clientHeight < 25
      $.add Updater.thread, nodes.reverse()
      if scroll and nodes?
        nodes[0].scrollIntoView()

  set: (name, text) ->
    el = Updater[name]
    if node = el.firstChild
      # Prevent the creation of a new DOM Node
      # by setting the text node's data.
      node.data = text
    else
      el.textContent = text

  getInput: (input) ->
    while (i = input.length) < 10
      input[i] = input[i - 1]
    parseInt(number, 10) for number in input

  getInterval: ->
    string = "Interval" + (if Conf['Interval per board'] then "_#{g.BOARD}" else "")
    increaseString = "updateIncrease"
    if $.hidden()
      string = "BG#{string}"
      increaseString += "B"
    i  = +Conf[string]
    j = if (count = @unsuccessfulFetchCount) > 9 then 9 else count
    return (
      if Conf['Optional Increase']
        (if i > increase = Updater.getInput(Conf[increaseString].split ',')[j] then i else increase)
      else
        i
    )

  timeout: ->
    Updater.timeoutID = setTimeout Updater.timeout, 1000
    n = 1 + parseInt Updater.timer.firstChild.data, 10

    if n is 0
      Updater.update()
    else if n >= Updater.getInterval()
      Updater.unsuccessfulFetchCount++
      Updater.set 'count', 'Retry'
      Updater.count.className = null
      Updater.update()
    else
      Updater.set 'timer', n

  update: ->
    Updater.set 'timer', 0
    {request} = Updater
    if request
      # Don't reset the counter when aborting.
      request.onloadend = null
      request.abort()
    url = "//api.4chan.org/#{g.BOARD}/res/#{g.THREAD_ID}.json"
    Updater.request = $.ajax url, onloadend: Updater.cb.load,
      headers: 'If-Modified-Since': Updater.lastModified