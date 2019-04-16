PostJumper = 
  init: ->
    @capcode  = new Map()
    @uniqueID = new Map()
    return unless g.VIEW in ['index', 'thread']

    Callbacks.Post.push
      name: 'Post Jumper'
      cb:   @node

  node: ->
    return unless Conf['Unique ID and capcode Navigation']

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
    if not PostJumper[type].has value
      PostJumper[type].set value, []
    PostJumper[type].get(value).push {key: post.ID, val: post.fullID}
    PostJumper[type].get(value).sort (first,second) -> first.key-second.key

  buttonClick: (post,type,dir) -> ->
    return if PostJumper[type].size is 0
    value = (if type is 'capcode' then '## ' else '') + post.info[type]
    fromID = post.ID
    idx = PostJumper.indexOfPair PostJumper[type].get(value),fromID
    fromID = PostJumper[type].get(value)[idx].val
    return if idx is -1
    idx = (idx + dir) %% PostJumper[type].get(value).length
    toID= PostJumper[type].get(value)[idx].val
    PostJumper.scroll fromID,toID

  makeButtons: ->
    charPrev = '\u{23EB}'
    charNext = '\u{23EC}'
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
    