Anonymize =
  init: ->
    return unless Conf['Anonymize']
    $.addClass doc, 'anonymize'
