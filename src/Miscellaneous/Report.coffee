Report =
  init: ->
    return unless /report/.test(location.search)
    $.asap (-> $.id 'recaptcha_response_field'), Report.ready
  ready: ->
    field = $.id 'recaptcha_response_field'
    $.on field, 'keydown', (e) ->
      $.globalEval 'Recaptcha.reload()' if e.keyCode is 8 and not field.value
