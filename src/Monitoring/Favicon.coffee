Favicon =
  init: ->
    $.ready ->
      Favicon.el      = $ 'link[rel="shortcut icon"]', d.head
      Favicon.el.type = 'image/x-icon'
      {href}          = Favicon.el
      Favicon.SFW     = /ws\.ico$/.test href
      Favicon.default = href
      Favicon.switch()

  switch: ->
    switch Conf['favicon']
      when 'ferongr'
        Favicon.unreadDead  = 'data:image/gif;base64,<%= grunt.file.read("src/General/img/favicons/ferongr/unreadDead.gif",   {encoding: "base64"}) %>'
        Favicon.unreadDeadY = 'data:image/png;base64,<%= grunt.file.read("src/General/img/favicons/ferongr/unreadDeadY.png",  {encoding: "base64"}) %>'
        Favicon.unreadSFW   = 'data:image/gif;base64,<%= grunt.file.read("src/General/img/favicons/ferongr/unreadSFW.gif",    {encoding: "base64"}) %>'
        Favicon.unreadSFWY  = 'data:image/png;base64,<%= grunt.file.read("src/General/img/favicons/ferongr/unreadSFWY.png",   {encoding: "base64"}) %>'
        Favicon.unreadNSFW  = 'data:image/gif;base64,<%= grunt.file.read("src/General/img/favicons/ferongr/unreadNSFW.gif",   {encoding: "base64"}) %>'
        Favicon.unreadNSFWY = 'data:image/png;base64,<%= grunt.file.read("src/General/img/favicons/ferongr/unreadNSFWY.png",  {encoding: "base64"}) %>'
      when 'xat-'
        Favicon.unreadDead  = 'data:image/png;base64,<%= grunt.file.read("src/General/img/favicons/xat-/unreadDead.png",      {encoding: "base64"}) %>'
        Favicon.unreadDeadY = 'data:image/png;base64,<%= grunt.file.read("src/General/img/favicons/xat-/unreadDeadY.png",     {encoding: "base64"}) %>'
        Favicon.unreadSFW   = 'data:image/png;base64,<%= grunt.file.read("src/General/img/favicons/xat-/unreadSFW.png",       {encoding: "base64"}) %>'
        Favicon.unreadSFWY  = 'data:image/png;base64,<%= grunt.file.read("src/General/img/favicons/xat-/unreadSFWY.png",      {encoding: "base64"}) %>'
        Favicon.unreadNSFW  = 'data:image/png;base64,<%= grunt.file.read("src/General/img/favicons/xat-/unreadNSFW.png",      {encoding: "base64"}) %>'
        Favicon.unreadNSFWY = 'data:image/png;base64,<%= grunt.file.read("src/General/img/favicons/xat-/unreadNSFWY.png",     {encoding: "base64"}) %>'
      when 'Mayhem'
        Favicon.unreadDead  = 'data:image/png;base64,<%= grunt.file.read("src/General/img/favicons/Mayhem/unreadDead.png",    {encoding: "base64"}) %>'
        Favicon.unreadDeadY = 'data:image/png;base64,<%= grunt.file.read("src/General/img/favicons/Mayhem/unreadDeadY.png",   {encoding: "base64"}) %>'
        Favicon.unreadSFW   = 'data:image/png;base64,<%= grunt.file.read("src/General/img/favicons/Mayhem/unreadSFW.png",     {encoding: "base64"}) %>'
        Favicon.unreadSFWY  = 'data:image/png;base64,<%= grunt.file.read("src/General/img/favicons/Mayhem/unreadSFWY.png",    {encoding: "base64"}) %>'
        Favicon.unreadNSFW  = 'data:image/png;base64,<%= grunt.file.read("src/General/img/favicons/Mayhem/unreadNSFW.png",    {encoding: "base64"}) %>'
        Favicon.unreadNSFWY = 'data:image/png;base64,<%= grunt.file.read("src/General/img/favicons/Mayhem/unreadNSFWY.png",   {encoding: "base64"}) %>'
      when 'Original'
        Favicon.unreadDead  = 'data:image/gif;base64,<%= grunt.file.read("src/General/img/favicons/Original/unreadDead.gif",  {encoding: "base64"}) %>'
        Favicon.unreadDeadY = 'data:image/png;base64,<%= grunt.file.read("src/General/img/favicons/Original/unreadDeadY.png", {encoding: "base64"}) %>'
        Favicon.unreadSFW   = 'data:image/gif;base64,<%= grunt.file.read("src/General/img/favicons/Original/unreadSFW.gif",   {encoding: "base64"}) %>'
        Favicon.unreadSFWY  = 'data:image/png;base64,<%= grunt.file.read("src/General/img/favicons/Original/unreadSFWY.png",  {encoding: "base64"}) %>'
        Favicon.unreadNSFW  = 'data:image/gif;base64,<%= grunt.file.read("src/General/img/favicons/Original/unreadNSFW.gif",  {encoding: "base64"}) %>'
        Favicon.unreadNSFWY = 'data:image/png;base64,<%= grunt.file.read("src/General/img/favicons/Original/unreadNSFWY.png", {encoding: "base64"}) %>'
    if Favicon.SFW
      Favicon.unread  = Favicon.unreadSFW
      Favicon.unreadY = Favicon.unreadSFWY
    else
      Favicon.unread  = Favicon.unreadNSFW
      Favicon.unreadY = Favicon.unreadNSFWY

  dead:  'data:image/gif;base64,<%= grunt.file.read("src/General/img/favicons/dead.gif", {encoding: "base64"}) %>'
  logo:  'data:image/png;base64,<%= grunt.file.read("src/General/img/icon128.png",       {encoding: "base64"}) %>'
