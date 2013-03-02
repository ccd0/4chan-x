QuoteBacklink =
  init: ->
    format = Conf['backlink'].replace /%id/g, "' + id + '"
    @funk  = Function 'id', "return '#{format}'"
    Main.callbacks.push @node

  node: (post) ->
    return if post.isInlined

    quotes = {}
    for quote in post.quotes
      # Stop at 'Admin/Mod/Dev Replies:' on /q/
      break if quote.parentNode.parentNode.className is 'capcodeReplies'
      # Don't process >>>/b/.
      if quote.hostname is 'boards.4chan.org' and !/catalog$/.test(quote.pathname) and qid = quote.hash?[2..]
        # Duplicate quotes get overwritten.
        quotes[qid] = true

    a = $.el 'a',
      href: "/#{g.BOARD}/res/#{post.threadID}#p#{post.ID}"
      className: if post.el.hidden then 'filtered backlink' else 'backlink'
      textContent: QuoteBacklink.funk post.ID

    if Conf['Mark Owned Posts']
      if MarkOwn.posts[post.ID]
        $.addClass a, 'ownpost'
        a.textContent += " (You)"
        owned = true

    for qid of quotes
      # Don't backlink the OP.
      continue if !(el = $.id "pi#{qid}") or !Conf['OP Backlinks'] and /\bop\b/.test el.parentNode.className
      link = a.cloneNode true
      nodes = $.nodes [$.tn(' '), link]

      if Conf['Quote Preview']
        $.on link, 'mouseover', QuotePreview.mouseover

      if Conf['Quote Inline']
        $.on link, 'click', QuoteInline.toggle
        QuoteInline.qiQuote link if Conf['Quote Hash Navigation']

      unless container = $.id "blc#{qid}"
        $.addClass el.parentNode, 'quoted'

        if owned
          $.addClass el.parentNode, 'youQuoted'

        container = $.el 'span',
          className: 'container'
          id: "blc#{qid}"
        $.add el, container

      $.add container, nodes
      unless Conf["Backlinks Position"] is "default" or /\bop\b/.test el.parentNode.className
        el.parentNode.style.paddingBottom = "#{container.offsetHeight}px"
    return