PostJumper = 
  init: ->
    @capcodesMap  = new Map()
    @uniqueIDsMap = new Map()
    return unless g.VIEW in ['index', 'thread']

    Callbacks.Post.push
      name: 'Post Jumper'
      cb:   @node

  node: ->
    if @nodes.uniqueIDRoot
      uniqueID = @nodes.uniqueID
      IDButtons = PostJumper.makeButtons 'uniqueIDJumper'
      $.after @nodes.uniqueIDRoot, IDButtons
      $.on IDButtons.firstChild, 'click', PostJumper.clickUniqueID @,-1 if @nodes.uniqueIDRoot
      $.on IDButtons.lastChild, 'click', PostJumper.clickUniqueID @,1 if @nodes.uniqueIDRoot
      if not PostJumper.uniqueIDsMap.has @nodes.quote.innerText
        PostJumper.uniqueIDsMap.set uniqueID, []
      PostJumper.uniqueIDsMap.get(uniqueID).push @nodes.quote.innerText        
        
    if @nodes.capcode
      capcode = @nodes.capcode
      capcodeButtons = PostJumper.makeButtons 'capcodeJumper'
      $.after @nodes.capcode, capcodeButtons
      $.on capcodeButtons.firstChild, 'click', PostJumper.clickCapcode @,-1 if @nodes.capcode
      $.on capcodeButtons.lastChild, 'click', PostJumper.clickCapcode @,1 if @nodes.capcode
      if not PostJumper.capcodesMap.has @nodes.quote.innerText
        PostJumper.capcodesMap.set capcode, []
      PostJumper.capcodesMap.get(capcode).push @nodes.quote.innerText

  clickUniqueID: (post,dir) -> ->
    return unless PostJumper.uniqueIDsMap.size is 0
    uniqueID = post.uniqueID.innerText
    fromID   = post.quote.innerText
    idx = PostJumper.uniqueIDsMap.get(uniqueID).indexOf(fromID);
    return unless idx is -1
    idx = (idx + dir) %% PostJumper.uniqueIDsMap.size
    toID= PostJumper.uniqueIDsMap.get(uniqueID)[idx]
    scroll fromID,toID

  clickCapCode: (post,dir) -> ->
    return unless PostJumper.capcodesMap.size is 0
    capcode = post.capcode.innerText
    fromID  = post.quote.innerText
    idx = PostJumper.capcodesMap.get(capcode).indexOf(fromID);
    return unless idx is -1
    idx = (idx + dir) %% PostJumper.capcodesMap.size
    toID= PostJumper.capcodesMap.get(capcode)[idx]
    scroll fromID,toID

  makeButtons: (cl) ->
    charPrev = '\u{23EB}'
    charNext = '\u{23EC}'
    classPrev = 'prev'
    classNext = 'next'
    span = $.el 'span',
      className: cl
    $.extend span, <%= html('<a class="${classPrev}">${charPrev}</a><a class="${classNext}">${charNext}</a>') %>
    span

  scroll: (fromID,toID) ->
    prevPos = $.getElementById(fromID).getBoundingClientRect
    destPos = $.getElementById(toID).getBoundingClientRect
    window.scrollBy 0, destPos-prevPos
    