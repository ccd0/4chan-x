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
      uniqueID = @nodes.uniqueID.innerText
      IDButtons = PostJumper.makeButtons 'uniqueIDJumper'
      $.after @nodes.uniqueIDRoot, IDButtons
      $.on IDButtons.firstChild, 'click', PostJumper.clickUniqueID @,-1
      $.on IDButtons.lastChild, 'click', PostJumper.clickUniqueID @,1
      if not PostJumper.uniqueIDsMap.has uniqueID
        PostJumper.uniqueIDsMap.set uniqueID, []
      PostJumper.uniqueIDsMap.get(uniqueID).push @nodes.quote.innerText        
        
    if @nodes.capcode
      capcode = @nodes.capcode.innerText
      capcodeButtons = PostJumper.makeButtons 'capcodeJumper'
      $.after @nodes.capcode, capcodeButtons
      $.on capcodeButtons.firstChild, 'click', PostJumper.clickCapcode @,-1
      $.on capcodeButtons.lastChild, 'click', PostJumper.clickCapcode @,1
      if not PostJumper.capcodesMap.has capcode
        PostJumper.capcodesMap.set capcode, []
      PostJumper.capcodesMap.get(capcode).push @nodes.quote.innerText

  clickUniqueID: (post,dir) -> ->
    return if PostJumper.uniqueIDsMap.size is 0
    uniqueID = post.info.uniqueID
    fromID   = post.ID.toString()
    idx = PostJumper.uniqueIDsMap.get(uniqueID).indexOf(fromID);
    return if idx is -1
    idx = (idx + dir) %% PostJumper.uniqueIDsMap.get(uniqueID).length
    toID= PostJumper.uniqueIDsMap.get(uniqueID)[idx]
    PostJumper.scroll fromID,toID

  clickCapcode: (post,dir) -> ->
    return if PostJumper.capcodesMap.size is 0
    capcode = "## " + post.info.capcode
    fromID  = post.ID.toString()
    idx = PostJumper.capcodesMap.get(capcode).indexOf(fromID);
    return if idx is -1
    idx = (idx + dir) %% PostJumper.capcodesMap.get(capcode).length
    toID= PostJumper.capcodesMap.get(capcode)[idx]
    PostJumper.scroll fromID,toID

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
    prevPos = $.id("pc"+fromID).getBoundingClientRect().top
    destPos = $.id("pc"+toID).getBoundingClientRect().top
    window.scrollBy 0, destPos-prevPos
    