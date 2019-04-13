PostJumper = 
  init: ->
    @capcodesMap  = new Map()
    @uniqueIDsMap = new Map()
    return unless g.VIEW in ['index', 'thread']

    Callbacks.Post.push
      name: 'Jump to previous/next post'
      cb:   @node

  node: ->
    if @nodes.uniqueIDRoot
      uniqueID = @nodes.uniqueID
      $.after @nodes.uniqueIDRoot, makeButtons 'uniqueIDJumper'
      $.on @nodes.uniqueIDJumperPrev, 'click', PostJumper.clickUniqueID @,-1 if @nodes.uniqueIDRoot
      $.on @nodes.uniqueIDJumperNext, 'click', PostJumper.clickUniqueID @,1 if @nodes.uniqueIDRoot
      if uniqueIDsMap.has @nodes.quote.innerText
        uniqueIDsMap.get(uniqueID).push @nodes.quote.innerText
      else
        uniqueIDsMap.set uniqueID, @nodes.quote.innerText
        
    if @nodes.capcode
      capcode = @nodes.capcode
      $.after @nodes.capcode, makeButtons 'capcodeJumper'
      $.on @nodes.capcodeJumperPrev, 'click', PostJumper.clickCapcode @,-1 if @nodes.capcode
      $.on @nodes.capcodeJumperNext, 'click', PostJumper.clickCapcode @,1 if @nodes.capcode
      if capcodesMap.has @nodes.quote.innerText
        capcodesMap.get(capcode).push @nodes.quote.innerText
      else
        capcodesMap.set capcode, @nodes.quote.innerText

  clickUniqueID: (post,dir) -> ->
    return unless uniqueIDsMap.size is 0
    uniqueID = post.uniqueID.innerText
    fromID   = post.quote.innerText
    idx = uniqueIDsMap.get(uniqueID).indexOf(fromID);
    return unless idx is -1
    idx = (idx + dir) %% uniqueIDsMap.size
    toID=uniqueIDsMap.get(uniqueID)[idx]
    scroll fromID,toID

  clickCapCode: (post,dir) -> ->
    return unless capcodesMap.size is 0
    capcode = post.capcode.innerText
    fromID  = post.quote.innerText
    idx = capcodesMap.get(capcode).indexOf(fromID);
    return unless idx is -1
    idx = (idx + dir) %% capcodesMap.size
    toID=capcodesMap.get(capcode)[idx]
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
    