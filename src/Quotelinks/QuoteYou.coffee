QuoteYou =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Mark Quotes of You'] or !Conf['Quick Reply']

    # \u00A0 is nbsp
    @text = '\u00A0(You)'
    Post.callbacks.push
      name: 'Mark Quotes of You'
      cb:   @node
  node: ->
    return if @isClone
    for quotelink in @nodes.quotelinks when QR.db.get Get.postDataFromLink quotelink
      $.add quotelink, $.tn QuoteYou.text
    return
