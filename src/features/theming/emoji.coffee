Emoji =
  init: ->
    Emoji.icons.not.push ['PlanNine', Emoji.icons.not[0][1]]

  css: (position) ->
    _conf = Conf
    css = []
    margin = "margin-#{if position is "before" then "right" else "left"}: #{parseInt _conf['Emoji Spacing']}px;"

    for key, category of Emoji.icons
      if (_conf['Emoji'] isnt "disable ponies" and key is "pony") or (_conf['Emoji'] isnt "only ponies" and key is "not")
        for icon in category
          name = icon[0]
          css[css.length] = """
a.useremail[href*='#{name}']:last-of-type::#{position},
a.useremail[href*='#{name.toLowerCase()}']:last-of-type::#{position},
a.useremail[href*='#{name.toUpperCase()}']:last-of-type::#{position} {
  content: url('data:image/png;base64,#{icon[1]}');
  vertical-align: top;
  #{margin}
}\n
"""
    css.join ""

  icons:
    pony: [
      ['Pinkie',     '<%= grunt.file.read("src/img/emoji/pinkie.png",       {encoding: "base64"}) %>']
      ['Applejack',  '<%= grunt.file.read("src/img/emoji/applejack.png",    {encoding: "base64"}) %>']
      ['Fluttershy', '<%= grunt.file.read("src/img/emoji/fluttershy.png",   {encoding: "base64"}) %>']
      ['Twilight',   '<%= grunt.file.read("src/img/emoji/twilight.png",     {encoding: "base64"}) %>']
      ['Rainbow',    '<%= grunt.file.read("src/img/emoji/rainbow.png",      {encoding: "base64"}) %>']
      ['Rarity',     '<%= grunt.file.read("src/img/emoji/rarity.png",       {encoding: "base64"}) %>']
      ['Spike',      '<%= grunt.file.read("src/img/emoji/spike.png",        {encoding: "base64"}) %>']
    ]
    not: [
      ['Plan9',      '<%= grunt.file.read("src/img/emoji/plan9.png",        {encoding: "base64"}) %>']
      ['Neko',       '<%= grunt.file.read("src/img/emoji/neko.png",         {encoding: "base64"}) %>']
      ['Madotsuki',  '<%= grunt.file.read("src/img/emoji/madotsuki.png",    {encoding: "base64"}) %>']
      ['Sega',       '<%= grunt.file.read("src/img/emoji/sega.png",         {encoding: "base64"}) %>']
      ['Sakamoto',   '<%= grunt.file.read("src/img/emoji/sakamoto.png",     {encoding: "base64"}) %>']
      ['Baka',       '<%= grunt.file.read("src/img/emoji/baka.png",         {encoding: "base64"}) %>']
      ['Ponyo',      '<%= grunt.file.read("src/img/emoji/ponyo.png",        {encoding: "base64"}) %>']
      ['Rabite',     '<%= grunt.file.read("src/img/emoji/rabite.png",       {encoding: "base64"}) %>']
      ['Arch',       '<%= grunt.file.read("src/img/emoji/arch.png",         {encoding: "base64"}) %>']
      ['CentOS',     '<%= grunt.file.read("src/img/emoji/centos.png",       {encoding: "base64"}) %>']
      ['Debian',     '<%= grunt.file.read("src/img/emoji/debian.png",       {encoding: "base64"}) %>']
      ['Fedora',     '<%= grunt.file.read("src/img/emoji/fedora.png",       {encoding: "base64"}) %>']
      ['FreeBSD',    '<%= grunt.file.read("src/img/emoji/freebsd.png",      {encoding: "base64"}) %>']
      ['Gentoo',     '<%= grunt.file.read("src/img/emoji/gentoo.png",       {encoding: "base64"}) %>']
      ['Mint',       '<%= grunt.file.read("src/img/emoji/mint.png",         {encoding: "base64"}) %>']
      ['Osx',        '<%= grunt.file.read("src/img/emoji/osx.png",          {encoding: "base64"}) %>']
      ['Rhel',       '<%= grunt.file.read("src/img/emoji/rhel.png",         {encoding: "base64"}) %>']
      ['Sabayon',    '<%= grunt.file.read("src/img/emoji/sabayon.png",      {encoding: "base64"}) %>']
      ['Slackware',  '<%= grunt.file.read("src/img/emoji/slackware.png",    {encoding: "base64"}) %>']
      ['Trisquel',   '<%= grunt.file.read("src/img/emoji/trisquel.png",     {encoding: "base64"}) %>']
      ['Ubuntu',     '<%= grunt.file.read("src/img/emoji/ubuntu.png",       {encoding: "base64"}) %>']
      ['Windows',    '<%= grunt.file.read("src/img/emoji/windows.png",      {encoding: "base64"}) %>']
      ['OpenBSD',    '<%= grunt.file.read("src/img/emoji/openbsd.png",      {encoding: "base64"}) %>']
      ['Gnu',        '<%= grunt.file.read("src/img/emoji/gnu.png",          {encoding: "base64"}) %>']
      ['CrunchBang', '<%= grunt.file.read("src/img/emoji/crunchbang.png",   {encoding: "base64"}) %>']
      ['Yuno',       '<%= grunt.file.read("src/img/emoji/yuno.png",         {encoding: "base64"}) %>']
    ]