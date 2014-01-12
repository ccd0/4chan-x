Favicon =
  init: ->
    t = 'data:image/png;base64,'
    f = Favicon
    [f.unreadDead, funreadDeadY, f.unreadSFW, f.unreadSFWY, f.unreadNSFW, f.unreadNSFWY] = switch Conf['favicon']
      when 'ferongr' then [
        t + '<%= grunt.file.read("src/General/img/favicons/ferongr/unreadDead.png",   {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/ferongr/unreadDeadY.png",  {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/ferongr/unreadSFW.png",    {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/ferongr/unreadSFWY.png",   {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/ferongr/unreadNSFW.png",   {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/ferongr/unreadNSFWY.png",  {encoding: "base64"}) %>'
      ]
      when 'xat-' then [
        t + '<%= grunt.file.read("src/General/img/favicons/xat-/unreadDead.png",      {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/xat-/unreadDeadY.png",     {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/xat-/unreadSFW.png",       {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/xat-/unreadSFWY.png",      {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/xat-/unreadNSFW.png",      {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/xat-/unreadNSFWY.png",     {encoding: "base64"}) %>'
      ]
      when 'Mayhem' then [
        t + '<%= grunt.file.read("src/General/img/favicons/Mayhem/unreadDead.png",    {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/Mayhem/unreadDeadY.png",   {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/Mayhem/unreadSFW.png",     {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/Mayhem/unreadSFWY.png",    {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/Mayhem/unreadNSFW.png",    {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/Mayhem/unreadNSFWY.png",   {encoding: "base64"}) %>'
      ]
      when '4chanJS' then [
        t + '<%= grunt.file.read("src/General/img/favicons/4chanJS/unreadDead.png",   {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/4chanJS/unreadDeadY.png",  {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/4chanJS/unreadSFW.png",    {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/4chanJS/unreadSFWY.png",   {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/4chanJS/unreadNSFW.png",   {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/4chanJS/unreadNSFWY.png",  {encoding: "base64"}) %>'
      ]
      when 'Original' then [
        t + '<%= grunt.file.read("src/General/img/favicons/Original/unreadDead.png",  {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/Original/unreadDeadY.png", {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/Original/unreadSFW.png",   {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/Original/unreadSFWY.png",  {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/Original/unreadNSFW.png",  {encoding: "base64"}) %>'
        t + '<%= grunt.file.read("src/General/img/favicons/Original/unreadNSFWY.png", {encoding: "base64"}) %>'
      ]
    if Favicon.SFW
      Favicon.unread  = Favicon.unreadSFW
      Favicon.unreadY = Favicon.unreadSFWY
    else
      Favicon.unread  = Favicon.unreadNSFW
      Favicon.unreadY = Favicon.unreadNSFWY

  dead:  'data:image/gif;base64,<%= grunt.file.read("src/General/img/favicons/dead.gif", {encoding: "base64"}) %>'
  logo:  'data:image/png;base64,<%= grunt.file.read("src/General/img/icon128.png",       {encoding: "base64"}) %>'
