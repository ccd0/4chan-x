PostRedirect =
  init: ->
    $.on d, 'QRPostSuccessful', (e) =>
      return unless e.detail.redirect
      @event = e
      @delays = 0
      $.queueTask =>
        if e is @event and @delays is 0
          location.href = e.detail.redirect

  delays: 0

  delay: ->
    return null unless @event
    e = @event
    @delays++
    () =>
      return unless e is @event
      @delays--
      if @delays is 0
        location.href = e.detail.redirect
