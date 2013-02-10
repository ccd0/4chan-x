Style =
  init: ->
    if d.head
      return @wrapper()
    @observe()

  agent: {
    'gecko':  '-moz-'
    'webkit': '-webkit-'
    'presto': '-o-'
  }[$.engine]

  addStyle: (theme) ->
    Style.css.textContent = Style.layout()

  cleanup: ->
    delete Style.init
    delete Style.observe
    delete Style.wrapper
    delete Style.cleanup

  observe: ->
    if MutationObserver
      Style.observer = new MutationObserver onMutationObserver = @wrapper
      Style.observer.observe d,
        childList: true
        subtree:   true
    else
      $.on d, 'DOMNodeInserted', @wrapper

  wrapper: ->
    if d.head
      Style.addStyleReady()

      if Style.observer
        Style.observer.disconnect()
      else
        $.off d, 'DOMNodeInserted', Style.wrapper

      Style.cleanup()

  addStyleReady: ->
    Style.css = $.addStyle Style.layout()