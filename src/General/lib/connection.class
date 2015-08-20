class Connection
  constructor: (@target, @origin, @cb={}) ->
    $.on window, 'message', @onMessage

  targetWindow: ->
    if @target instanceof window.HTMLIFrameElement
      @target.contentWindow
    else
      @target

  send: (data) =>
    @targetWindow().postMessage "#{g.NAMESPACE}#{JSON.stringify data}", @origin

  onMessage: (e) =>
    return unless e.source is @targetWindow() and
      e.origin is @origin and
      typeof e.data is 'string' and
      e.data[...g.NAMESPACE.length] is g.NAMESPACE
    data = JSON.parse e.data[g.NAMESPACE.length..]
    for type, value of data
      @cb[type]? value
    return
