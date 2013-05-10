QuoteYou =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Mark Quotes of You']

    if Conf['Highlight Own Posts']
      $.addClass doc, 'highlight-own'

    if Conf['Highlight Posts Quoting You']
      $.addClass doc, 'highlight-you'

    # \u00A0 is nbsp
    @text = 
    Post::callbacks.push
      name: 'Mark Quotes of You'
      cb:   @node
  node: ->
    # Stop there if it's a clone.
    return if @isClone

    if @info.yours
      $.addClass @nodes.root, 'yourPost'

    # Stop there if there's no quotes in that post.
    return unless @quotes.length

    for quotelink in @nodes.quotelinks
      if QR.db.get Get.postDataFromLink quotelink
        $.add quotelink, $.tn '\u00A0(You)'
        $.addClass @nodes.root, 'quotesYou'
    return