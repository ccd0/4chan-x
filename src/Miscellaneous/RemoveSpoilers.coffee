RemoveSpoilers =
  init: ->
    if Conf['Reveal Spoilers']
      $.addClass doc, 'reveal-spoilers'

    if Conf['Remove Spoilers']
      $.addClass doc, 'remove-spoilers'
