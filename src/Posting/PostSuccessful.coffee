PostSuccessful =
  init: ->
    return unless Conf['Remember Your Posts']
    $.ready @ready

  ready: ->
    return unless d.title is 'Post successful!'

    [_, threadID, postID] = $('h1').nextSibling.textContent.match /thread:(\d+),no:(\d+)/
    postID   = +postID
    threadID = +threadID or postID

    db = new DataBoard 'yourPosts'
    db.set
      boardID: g.BOARD.ID
      threadID: threadID
      postID: postID
      val: true
