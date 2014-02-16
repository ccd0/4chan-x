Favicon =
  init: ->
    items = {
      ferongr: [
        '<%= grunt.file.read("src/General/img/favicons/ferongr/unreadDead.png",   {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/ferongr/unreadDeadY.png",  {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/ferongr/unreadSFW.png",    {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/ferongr/unreadSFWY.png",   {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/ferongr/unreadNSFW.png",   {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/ferongr/unreadNSFWY.png",  {encoding: "base64"}) %>'
      ]
      'xat-': [
        '<%= grunt.file.read("src/General/img/favicons/xat-/unreadDead.png",      {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/xat-/unreadDeadY.png",     {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/xat-/unreadSFW.png",       {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/xat-/unreadSFWY.png",      {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/xat-/unreadNSFW.png",      {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/xat-/unreadNSFWY.png",     {encoding: "base64"}) %>'
      ]
      Mayhem: [
        '<%= grunt.file.read("src/General/img/favicons/Mayhem/unreadDead.png",    {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/Mayhem/unreadDeadY.png",   {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/Mayhem/unreadSFW.png",     {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/Mayhem/unreadSFWY.png",    {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/Mayhem/unreadNSFW.png",    {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/Mayhem/unreadNSFWY.png",   {encoding: "base64"}) %>'
      ]
      '4chanJS': [
        '<%= grunt.file.read("src/General/img/favicons/4chanJS/unreadDead.png",   {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/4chanJS/unreadDeadY.png",  {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/4chanJS/unreadSFW.png",    {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/4chanJS/unreadSFWY.png",   {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/4chanJS/unreadNSFW.png",   {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/4chanJS/unreadNSFWY.png",  {encoding: "base64"}) %>'
      ]
      Original: [
        '<%= grunt.file.read("src/General/img/favicons/Original/unreadDead.png",  {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/Original/unreadDeadY.png", {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/Original/unreadSFW.png",   {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/Original/unreadSFWY.png",  {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/Original/unreadNSFW.png",  {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/Original/unreadNSFWY.png", {encoding: "base64"}) %>'
      ]
      'Metro': [
        '<%= grunt.file.read("src/General/img/favicons/Metro/unreadDead.png",     {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/Metro/unreadDeadY.png",    {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/Metro/unreadSFW.png",      {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/Metro/unreadSFWY.png",     {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/Metro/unreadNSFW.png",     {encoding: "base64"}) %>'
        '<%= grunt.file.read("src/General/img/favicons/Metro/unreadNSFWY.png",    {encoding: "base64"}) %>'
      ]
    }[Conf['favicon']]

    f = Favicon
    t = 'data:image/png;base64,'
    i = 0
    while items[i]
      items[i] = t + items[i++]

    [f.unreadDead, funreadDeadY, f.unreadSFW, f.unreadSFWY, f.unreadNSFW, f.unreadNSFWY] = items
    f.update()

  update: ->
    if @SFW
      @unread  = @unreadSFW
      @unreadY = @unreadSFWY
    else
      @unread  = @unreadNSFW
      @unreadY = @unreadNSFWY

  dead:  'data:image/gif;base64,<%= grunt.file.read("src/General/img/favicons/dead.gif", {encoding: "base64"}) %>'
  logo:  'data:image/png;base64,<%= grunt.file.read("src/General/img/icon128.png",       {encoding: "base64"}) %>'
