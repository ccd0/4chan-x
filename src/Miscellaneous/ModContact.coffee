ModContact =
  init: ->
    return unless g.SITE.software is 'yotsuba' and g.VIEW in ['index', 'thread']
    Callbacks.Post.push
      name: 'Mod Contact Links'
      cb:   @node

  node: ->
    return if @isClone or !$.hasOwn(ModContact.specific, @info.capcode)
    links = $.el 'span', className: 'contact-links brackets-wrap'
    $.extend links, ModContact.template(@info.capcode)
    $.after @nodes.capcode, links
    if (moved = @info.comment.match /This thread was moved to >>>\/(\w+)\//) and $.hasOwn(ModContact.moveNote, moved[1])
      moveNote = $.el 'div', className: 'move-note'
      $.extend moveNote, ModContact.moveNote[moved[1]]
      $.add @nodes.post, moveNote

  template: (capcode) ->
    `<%= html(
      '<a href="https://www.4chan.org/feedback" target="_blank">feedback</a>&{ModContact.specific[capcode]()}'
    ) %>`

  specific:
    Mod:       -> `<%= html(' <a href="https://www.4chan-x.net/4chan-irc.html" target="_blank">IRC</a>') %>`
    Manager:   -> ModContact.specific.Mod()
    Developer: -> `<%= html(' <a href="https://github.com/4chan" target="_blank">github</a>') %>`
    Admin:     -> `<%= html(' <a href="https://twitter.com/hiroyuki_ni" target="_blank">twitter</a>') %>`

  moveNote:
    qa: `<%= html(
      'Moving a thread to /qa/ does not imply mods will read it. If you wish to contact mods, use ' +
      '<a href="https://www.4chan.org/feedback" target="_blank">feedback</a><span class="invisible"> (https://www.4chan.org/feedback)</span> or ' +
      '<a href="https://www.4chan-x.net/4chan-irc.html" target="_blank">IRC</a><span class="invisible"> (https://www.4chan-x.net/4chan-irc.html)</span>.'
    ) %>`
