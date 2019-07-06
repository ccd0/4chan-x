PostJumper = 
  init: ->
    return unless Conf['Unique ID and Capcode Navigation'] and g.VIEW in ['index', 'thread']

    @maps =
      capcode:  Object.create(null)
      uniqueID: Object.create(null)
    @buttons  = @makeButtons()

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
    value = post.nodes[type].innerText
    buttons = PostJumper.buttons.cloneNode(true)
    buttons.dataset.type = type
    $.after post.nodes[type+(if type is 'capcode' then '' else 'Root')], buttons
    PostJumper.addListeners buttons
    if value not of PostJumper.maps[type]
      PostJumper.maps[type][value] = []
    PostJumper.maps[type][value].push {key: post.ID, val: post.fullID}
    PostJumper.maps[type][value].sort (first,second) -> first.key-second.key

  addListeners: (buttons) ->
    $.on buttons.firstChild, 'click', PostJumper.buttonClick
    $.on buttons.lastChild, 'click', PostJumper.buttonClick

  buttonClick: ->
    post = Get.postFromNode @
    {type} = @parentNode.dataset
    dir = if $.hasClass(@, 'prev') then -1 else 1
    value = (if type is 'capcode' then '## ' else '') + post.info[type]
    fromID = post.ID
    idx = PostJumper.indexOfPair PostJumper.maps[type][value],fromID
    return if idx is -1
    idx = (idx + dir) %% PostJumper.maps[type][value].length
    toID= PostJumper.maps[type][value][idx].val
    PostJumper.scroll post, g.posts[toID]

  makeButtons: ->
    charPrev = '\u23EB'
    charNext = '\u23EC'
    classPrev = 'prev'
    classNext = 'next'
    span = $.el 'span',
      className: 'postJumper'
    $.extend span, <%= html('<a href="javascript:void(0);" class="${classPrev}">${charPrev}</a><a href="javascript:void(0);" class="${classNext}">${charNext}</a>') %>
    span

  scroll: (fromPost, toPost) ->
    prevPos = fromPost.nodes.nameBlock.getBoundingClientRect().top
    destPos = toPost.nodes.nameBlock.getBoundingClientRect().top
    window.scrollBy 0, destPos-prevPos

  indexOfPair: (array,key) ->
    result = -1;
    for i in [0..array.length-1] by 1
      if array[i].key is key
        result = i
        break
    result
    