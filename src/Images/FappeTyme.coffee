FappeTyme =
  init: ->
    return unless (Conf['Fappe Tyme'] or Conf['Werk Tyme']) and g.VIEW in ['index', 'thread', 'archive']

    @nodes = {}
    @enabled =
      fappe: false
      werk:  Conf['werk']

    for type in ["Fappe", "Werk"] when Conf["#{type} Tyme"]
      lc = type.toLowerCase()
      el = UI.checkbox lc, "#{type} Tyme", false
      el.title = "#{type} Tyme"

      @nodes[lc] = el.firstElementChild
      @set lc, true if Conf[lc]
      $.on @nodes[lc], 'change', @toggle.bind(@, lc)

      Header.menu.addEntry
        el:    el
        order: 97

      indicator = $.el 'span',
        className: 'indicator'
        textContent: type[0]
        title: "#{type} Tyme active"
      $.on indicator, 'click', ->
        check = FappeTyme.nodes[@parentNode.id.replace('shortcut-', '')]
        check.checked = !check.checked
        $.event 'change', null, check
      Header.addShortcut lc, indicator, 410

    if Conf['Werk Tyme']
      $.sync 'werk', @set.bind(@, 'werk')

    Callbacks.Post.push
      name: 'Fappe Tyme'
      cb:   @node

    Callbacks.CatalogThread.push
      name: 'Werk Tyme'
      cb:   @catalogNode

  node: ->
    @nodes.root.classList.toggle 'noFile', !@files.length

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
