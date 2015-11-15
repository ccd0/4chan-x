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
        '<%= grunt.file.read("src/Monitoring/Favicon/ferongr/unreadDead.png",   {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/ferongr/unreadDeadY.png",  {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/ferongr/unreadSFW.png",    {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/ferongr/unreadSFWY.png",   {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/ferongr/unreadNSFW.png",   {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/ferongr/unreadNSFWY.png",  {encoding: "base64"}) %>'
      ]
      'xat-': [
        '<%= grunt.file.read("src/Monitoring/Favicon/xat-/unreadDead.png",      {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/xat-/unreadDeadY.png",     {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/xat-/unreadSFW.png",       {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/xat-/unreadSFWY.png",      {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/xat-/unreadNSFW.png",      {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/xat-/unreadNSFWY.png",     {encoding: "base64"}) %>'
      ]
      Mayhem: [
        '<%= grunt.file.read("src/Monitoring/Favicon/Mayhem/unreadDead.png",    {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/Mayhem/unreadDeadY.png",   {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/Mayhem/unreadSFW.png",     {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/Mayhem/unreadSFWY.png",    {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/Mayhem/unreadNSFW.png",    {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/Mayhem/unreadNSFWY.png",   {encoding: "base64"}) %>'
      ]
      '4chanJS': [
        '<%= grunt.file.read("src/Monitoring/Favicon/4chanJS/unreadDead.png",   {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/4chanJS/unreadDeadY.png",  {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/4chanJS/unreadSFW.png",    {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/4chanJS/unreadSFWY.png",   {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/4chanJS/unreadNSFW.png",   {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/4chanJS/unreadNSFWY.png",  {encoding: "base64"}) %>'
      ]
      Original: [
        '<%= grunt.file.read("src/Monitoring/Favicon/Original/unreadDead.png",  {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/Original/unreadDeadY.png", {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/Original/unreadSFW.png",   {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/Original/unreadSFWY.png",  {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/Original/unreadNSFW.png",  {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/Original/unreadNSFWY.png", {encoding: "base64"}) %>'
      ]
      'Metro': [
        '<%= grunt.file.read("src/Monitoring/Favicon/Metro/unreadDead.png",     {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/Metro/unreadDeadY.png",    {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/Metro/unreadSFW.png",      {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/Metro/unreadSFWY.png",     {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/Metro/unreadNSFW.png",     {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/Monitoring/Favicon/Metro/unreadNSFWY.png",    {encoding: "base64"}) %>'
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

  dead:  'data:image/gif;base64,<%= grunt.file.read("src/Monitoring/Favicon/dead.gif", {encoding: "base64"}) %>'
  logo:  'data:image/png;base64,<%= grunt.file.read("src/meta/icon128.png",       {encoding: "base64"}) %>'
