Style =
  init: ->
    if d.head
      @wrapper()
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

    if observer
      observer.disconnect()
    else
      $.off d, 'DOMNodeInserted', Style.wrapper

  observe: ->
    if MutationObserver
      observer = new MutationObserver onMutationObserver = @wrapper
      observer.observe d,
        childList: true
        subtree:   true
    else
      $.on d, 'DOMNodeInserted', @wrapper

  wrapper: ->
    if d.head
      Style.addStyleReady()
      Style.cleanup()

  addStyleReady: ->
    Style.css = $.addStyle Style.layout()