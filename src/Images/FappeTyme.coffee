FappeTyme =
  init: ->
    return unless (Conf['Fappe Tyme'] or Conf['Werk Tyme']) and g.VIEW in ['index', 'thread'] and g.BOARD.ID isnt 'f'

    @nodes = {}
    @enabled =
      fappe: false
      werk:  Conf['werk']

    for type in ["Fappe", "Werk"] when Conf["#{type} Tyme"]
      lc = type.toLowerCase()
      el = UI.checkbox lc, " #{type} Tyme", false
      el.title = "#{type} Tyme"

      @nodes[lc] = el.firstElementChild
      @set lc, true if Conf[lc]
      $.on @nodes[lc], 'change', @toggle.bind(@, lc)

      Header.menu.addEntry
        el:    el
        order: 97

    if Conf['Werk Tyme']
      $.sync 'werk', @set.bind(@, 'werk')

    Post.callbacks.push
      name: 'Fappe Tyme'
      cb:   @node

    CatalogThread.callbacks.push
      name: 'Werk Tyme'
      cb:   @catalogNode

  node: ->
    return if @file
    $.addClass @nodes.root, "noFile"

  catalogNode: ->
    {file} = @thread.OP
    return if !file
    filename = $.el 'div',
      textContent: file.name
      className:   'werkTyme-filename'
    $.add @nodes.thumb.parentNode, filename

  set: (type, enabled) ->
    @enabled[type] = @nodes[type].checked = enabled
    $["#{if enabled then 'add' else 'rm'}Class"] doc, "#{type}Tyme"

  toggle: (type) ->
    @set type, !@enabled[type]
    $.cb.checked.call @nodes[type] if type is 'werk'
