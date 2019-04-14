PostJumper = 
  init: ->
    @capcodeMap  = new Map()
    @uniqueIDMap = new Map()
    return unless g.VIEW in ['index', 'thread']

    Callbacks.Post.push
      name: 'Post Jumper'
      cb:   @node

  node: ->
    if @nodes.uniqueIDRoot and Conf['Unique ID Navigation'] and not @nodes.uniqueIDJumperRoot
      PostJumper.addButtons @,'uniqueID'

    if @nodes.capcode and Conf['Capcode Navigation'] and not @nodes.capcodeJumperRoot
      PostJumper.addButtons @,'capcode'

  addButtons: (post,type) ->
    value = post.nodes[type].innerText
    buttons = PostJumper.makeButtons type+'Jumper'
    $.after post.nodes[type+(if type is 'capcode' then '' else 'Root')], buttons
    $.on buttons.firstChild, 'click', PostJumper.buttonClick post,type,-1
    $.on buttons.lastChild, 'click', PostJumper.buttonClick post,type,1
    if not PostJumper[type+'Map'].has value
      PostJumper[type+'Map'].set value, []
    PostJumper[type+'Map'].get(value).push post.nodes.quote.innerText  

  buttonClick: (post,type,dir) -> ->
    return if PostJumper[type+'Map'].size is 0
    value = (if type is 'capcode' then '## ' else '') + post.info[type]
    fromID = post.ID.toString()
    idx = PostJumper[type+'Map'].get(value).indexOf(fromID);
    return if idx is -1
    idx = (idx + dir) %% PostJumper[type+'Map'].get(value).length
    toID= PostJumper[type+'Map'].get(value)[idx]
    PostJumper.scroll fromID,toID

  makeButtons: (cl) ->
    charPrev = '\u{23EB}'
    charNext = '\u{23EC}'
    classPrev = 'prev'
    classNext = 'next'
    span = $.el 'span',
      className: cl
    $.extend span, <%= html('<a href="javascript:void(0);" class="${classPrev}">${charPrev}</a><a href="javascript:void(0);" class="${classNext}">${charNext}</a>') %>
    span

  scroll: (fromID,toID) ->
    prevPos = $.id("pc"+fromID).getBoundingClientRect().top
    destPos = $.id("pc"+toID).getBoundingClientRect().top
    window.scrollBy 0, destPos-prevPos
    