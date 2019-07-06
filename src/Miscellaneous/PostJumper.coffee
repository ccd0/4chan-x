PostJumper = 
  init: ->
    return unless Conf['Unique ID and Capcode Navigation'] and g.VIEW in ['index', 'thread']

    @capcode  = Object.create(null)
    @uniqueID = Object.create(null)

    Callbacks.Post.push
      name: 'Post Jumper'
      cb:   @node

  node: ->
    if @nodes.uniqueIDRoot and not @isClone
      PostJumper.addButtons @,'uniqueID'

    if @nodes.capcode and not @isClone
      PostJumper.addButtons @,'capcode'

  addButtons: (post,type) ->
    value = post.nodes[type].innerText
    buttons = PostJumper.makeButtons type+'Jumper'
    $.after post.nodes[type+(if type is 'capcode' then '' else 'Root')], buttons
    $.on buttons.firstChild, 'click', PostJumper.buttonClick post,type,-1
    $.on buttons.lastChild, 'click', PostJumper.buttonClick post,type,1
    if value not of PostJumper[type]
      PostJumper[type][value] = []
    PostJumper[type][value].push {key: post.ID, val: post.fullID}
    PostJumper[type][value].sort (first,second) -> first.key-second.key

  buttonClick: (post,type,dir) -> ->
    value = (if type is 'capcode' then '## ' else '') + post.info[type]
    fromID = post.ID
    idx = PostJumper.indexOfPair PostJumper[type][value],fromID
    fromID = PostJumper[type][value][idx].val
    return if idx is -1
    idx = (idx + dir) %% PostJumper[type][value].length
    toID= PostJumper[type][value][idx].val
    PostJumper.scroll fromID,toID

  makeButtons: ->
    charPrev = '\u23EB'
    charNext = '\u23EC'
    classPrev = 'prev'
    classNext = 'next'
    span = $.el 'span',
      className: 'postJumper'
    $.extend span, <%= html('<a href="javascript:void(0);" class="${classPrev}">${charPrev}</a><a href="javascript:void(0);" class="${classNext}">${charNext}</a>') %>
    span

  scroll: (fromID,toID) ->
    prevPos = g.posts[fromID].nodes.nameBlock.getBoundingClientRect().top
    destPos = g.posts[toID].nodes.nameBlock.getBoundingClientRect().top
    window.scrollBy 0, destPos-prevPos

  indexOfPair: (array,key) ->
    result = -1;
    for i in [0..array.length-1] by 1
      if array[i].key is key
        result = i
        break
    result
    