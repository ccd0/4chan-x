Favicon =
  init: ->
    $.asap (-> d.head and (Favicon.el = $ 'link[rel="shortcut icon"]', d.head)), Favicon.initAsap

  set: (status) ->
    Favicon.status = status
    if Favicon.el
      Favicon.el.href = Favicon[status]
      # `favicon.href = href` doesn't work on Firefox.
      $.add d.head, Favicon.el

  initAsap: ->
    Favicon.el.type = 'image/x-icon'
    {href}          = Favicon.el
    Favicon.isSFW   = /ws\.ico$/.test href
    Favicon.default = href
    Favicon.switch()
    if Favicon.status
      Favicon.set Favicon.status

  switch: ->
    items = {
      ferongr: [
        '<%= readBase64("ferongr.unreadDead.png") %>'
        '<%= readBase64("ferongr.unreadDeadY.png") %>'
        '<%= readBase64("ferongr.unreadSFW.png") %>'
        '<%= readBase64("ferongr.unreadSFWY.png") %>'
        '<%= readBase64("ferongr.unreadNSFW.png") %>'
        '<%= readBase64("ferongr.unreadNSFWY.png") %>'
      ]
      'xat-': [
        '<%= readBase64("xat-.unreadDead.png") %>'
        '<%= readBase64("xat-.unreadDeadY.png") %>'
        '<%= readBase64("xat-.unreadSFW.png") %>'
        '<%= readBase64("xat-.unreadSFWY.png") %>'
        '<%= readBase64("xat-.unreadNSFW.png") %>'
        '<%= readBase64("xat-.unreadNSFWY.png") %>'
      ]
      Mayhem: [
        '<%= readBase64("Mayhem.unreadDead.png") %>'
        '<%= readBase64("Mayhem.unreadDeadY.png") %>'
        '<%= readBase64("Mayhem.unreadSFW.png") %>'
        '<%= readBase64("Mayhem.unreadSFWY.png") %>'
        '<%= readBase64("Mayhem.unreadNSFW.png") %>'
        '<%= readBase64("Mayhem.unreadNSFWY.png") %>'
      ]
      '4chanJS': [
        '<%= readBase64("4chanJS.unreadDead.png") %>'
        '<%= readBase64("4chanJS.unreadDeadY.png") %>'
        '<%= readBase64("4chanJS.unreadSFW.png") %>'
        '<%= readBase64("4chanJS.unreadSFWY.png") %>'
        '<%= readBase64("4chanJS.unreadNSFW.png") %>'
        '<%= readBase64("4chanJS.unreadNSFWY.png") %>'
      ]
      Original: [
        '<%= readBase64("Original.unreadDead.png") %>'
        '<%= readBase64("Original.unreadDeadY.png") %>'
        '<%= readBase64("Original.unreadSFW.png") %>'
        '<%= readBase64("Original.unreadSFWY.png") %>'
        '<%= readBase64("Original.unreadNSFW.png") %>'
        '<%= readBase64("Original.unreadNSFWY.png") %>'
      ]
      'Metro': [
        '<%= readBase64("Metro.unreadDead.png") %>'
        '<%= readBase64("Metro.unreadDeadY.png") %>'
        '<%= readBase64("Metro.unreadSFW.png") %>'
        '<%= readBase64("Metro.unreadSFWY.png") %>'
        '<%= readBase64("Metro.unreadNSFW.png") %>'
        '<%= readBase64("Metro.unreadNSFWY.png") %>'
      ]
    }
    items = $.getOwn(items, Conf['favicon'])

    f = Favicon
    t = 'data:image/png;base64,'
    i = 0
    while items[i]
      items[i] = t + items[i++]

    [f.unreadDead, f.unreadDeadY, f.unreadSFW, f.unreadSFWY, f.unreadNSFW, f.unreadNSFWY] = items
    f.update()

  update: ->
    if @isSFW
      @unread  = @unreadSFW
      @unreadY = @unreadSFWY
    else
      @unread  = @unreadNSFW
      @unreadY = @unreadNSFWY

  SFW:   '//s.4cdn.org/image/favicon-ws.ico'
  NSFW:  '//s.4cdn.org/image/favicon.ico'
  dead:  'data:image/gif;base64,<%= readBase64("dead.gif") %>'
  logo:  'data:image/png;base64,<%= readBase64("/src/meta/icon128.png") %>'
