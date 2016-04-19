Favicon =
  init: ->
    $.asap (-> d.head and Favicon.el = $ 'link[rel="shortcut icon"]', d.head), Favicon.initAsap
  
  initAsap: ->
    Favicon.el.type = 'image/x-icon'
    {href}          = Favicon.el
    Favicon.SFW     = /ws\.ico$/.test href
    Favicon.default = href
    Favicon.switch()

  switch: ->
    items = {
      ferongr: [
        '<%= readBase64("src/Monitoring/Favicon/ferongr/unreadDead.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/ferongr/unreadDeadY.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/ferongr/unreadSFW.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/ferongr/unreadSFWY.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/ferongr/unreadNSFW.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/ferongr/unreadNSFWY.png") %>'
      ]
      'xat-': [
        '<%= readBase64("src/Monitoring/Favicon/xat-/unreadDead.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/xat-/unreadDeadY.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/xat-/unreadSFW.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/xat-/unreadSFWY.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/xat-/unreadNSFW.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/xat-/unreadNSFWY.png") %>'
      ]
      Mayhem: [
        '<%= readBase64("src/Monitoring/Favicon/Mayhem/unreadDead.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/Mayhem/unreadDeadY.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/Mayhem/unreadSFW.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/Mayhem/unreadSFWY.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/Mayhem/unreadNSFW.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/Mayhem/unreadNSFWY.png") %>'
      ]
      '4chanJS': [
        '<%= readBase64("src/Monitoring/Favicon/4chanJS/unreadDead.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/4chanJS/unreadDeadY.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/4chanJS/unreadSFW.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/4chanJS/unreadSFWY.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/4chanJS/unreadNSFW.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/4chanJS/unreadNSFWY.png") %>'
      ]
      Original: [
        '<%= readBase64("src/Monitoring/Favicon/Original/unreadDead.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/Original/unreadDeadY.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/Original/unreadSFW.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/Original/unreadSFWY.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/Original/unreadNSFW.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/Original/unreadNSFWY.png") %>'
      ]
      'Metro': [
        '<%= readBase64("src/Monitoring/Favicon/Metro/unreadDead.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/Metro/unreadDeadY.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/Metro/unreadSFW.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/Metro/unreadSFWY.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/Metro/unreadNSFW.png") %>'
        '<%= readBase64("src/Monitoring/Favicon/Metro/unreadNSFWY.png") %>'
      ]
    }[Conf['favicon']]

    f = Favicon
    t = 'data:image/png;base64,'
    i = 0
    while items[i]
      items[i] = t + items[i++]

    [f.unreadDead, f.unreadDeadY, f.unreadSFW, f.unreadSFWY, f.unreadNSFW, f.unreadNSFWY] = items
    f.update()

  update: ->
    if @SFW
      @unread  = @unreadSFW
      @unreadY = @unreadSFWY
    else
      @unread  = @unreadNSFW
      @unreadY = @unreadNSFWY

  dead:  'data:image/gif;base64,<%= readBase64("src/Monitoring/Favicon/dead.gif") %>'
  logo:  'data:image/png;base64,<%= readBase64("src/meta/icon128.png") %>'

return Favicon
