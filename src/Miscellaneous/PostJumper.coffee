PostJumper = 
  init: ->
    return unless Conf['Unique ID and Capcode Navigation'] and g.VIEW in ['index', 'thread']

    @buttons = @makeButtons()

    Callbacks.Post.push
      name: 'Post Jumper'
      cb:   @node

  node: ->
    if @isClone
      for buttons in $$ '.postJumper', @nodes.info
        PostJumper.addListeners buttons
      return

    if @nodes.uniqueIDRoot
      PostJumper.addButtons @,'uniqueID'

    if @nodes.capcode
      PostJumper.addButtons @,'capcode'

  addButtons: (post,type) ->
    value = post.info[type]
    buttons = PostJumper.buttons.cloneNode(true)
    $.extend buttons.dataset, {type, value}
    $.after post.nodes[type+(if type is 'capcode' then '' else 'Root')], buttons
    PostJumper.addListeners buttons

  addListeners: (buttons) ->
    $.on buttons.firstChild, 'click', PostJumper.buttonClick
    $.on buttons.lastChild, 'click', PostJumper.buttonClick

  buttonClick: ->
    dir = if $.hasClass(@, 'prev') then -1 else 1
    if (toJumper = PostJumper.find @parentNode, dir)
      PostJumper.scroll @parentNode, toJumper

  find: (jumper, dir) ->
    {type, value} = jumper.dataset
    xpath = "span[contains(@class,\"postJumper\") and @data-value=\"#{value}\" and @data-type=\"#{type}\"]"
    axis = if dir < 0 then 'preceding' else 'following'
    jumper2 = jumper
    while (jumper2 = $.x "#{axis}::#{xpath}", jumper2)
      return jumper2 if jumper2.getBoundingClientRect().height
    if (jumper2 = $.x "(//#{xpath})[#{if dir < 0 then 'last()' else '1'}]")
      return jumper2 if jumper2.getBoundingClientRect().height
    while (jumper2 = $.x "#{axis}::#{xpath}", jumper2) and jumper2 isnt jumper
      return jumper2 if jumper2.getBoundingClientRect().height
    null

  makeButtons: ->
    charPrev = '\u23EB'
    charNext = '\u23EC'
    classPrev = 'prev'
    classNext = 'next'
    span = $.el 'span',
      className: 'postJumper'
    $.extend span, <%= html('<a href="javascript:void(0);" class="${classPrev}">${charPrev}</a><a href="javascript:void(0);" class="${classNext}">${charNext}</a>') %>
    span

  scroll: (fromJumper, toJumper) ->
    prevPos = fromJumper.getBoundingClientRect().top
    destPos = toJumper.getBoundingClientRect().top
    window.scrollBy 0, destPos-prevPos
