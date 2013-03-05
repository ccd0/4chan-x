ThreadStats =
  init: ->

    ThreadStats.postcount = $.el 'span',
      id:          'postcount'
      textContent: '0'

    ThreadStats.imagecount = $.el 'span',
      id:          'imagecount'
      textContent: '0'

    if Conf['Thread Updater'] and Conf['Merged Updater and Stats'] and move = Updater.count.parentElement
      container = $.el 'span'
      $.add container, [$.tn('['), ThreadStats.postcount, $.tn(' / '), ThreadStats.imagecount, $.tn('] ')]
      $.prepend move, container
    else
      dialog = UI.dialog 'stats', 'bottom: 0; left: 0;', '<div class=move></div>'
      dialog.className = 'dialog'
      $.add $(".move", dialog), ThreadStats.postcount
      $.add $(".move", dialog), $.tn(" / ")
      $.add $(".move", dialog), ThreadStats.imagecount
      $.add d.body, dialog

    @posts = @images = 0
    @imgLimit =
      switch g.BOARD
        when 'a', 'b', 'v', 'co', 'mlp'
          251
        when 'vg'
          376
        else
          151

    Main.callbacks.push @node

  node: (post) ->
    return if post.isInlined
    ThreadStats.postcount.textContent = ++ThreadStats.posts
    return unless post.img

    ThreadStats.imagecount.textContent = ++ThreadStats.images
    if ThreadStats.images > ThreadStats.imgLimit
      $.addClass ThreadStats.imagecount, 'warning'