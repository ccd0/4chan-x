FappeTyme =
  init: ->
    return if !(Conf['Fappe Tyme'] or Conf['Werk Tyme']) or g.VIEW is 'catalog' or g.BOARD is 'f'

    for type in ["Fappe", "Werk"] when Conf["#{type} Tyme"]
      lc = type.toLowerCase()
      el = UI.checkbox lc, " #{type} Tyme", false
      el.title = "#{type} Tyme"

      FappeTyme[lc] = input = el.firstElementChild
      $.on input, 'change', FappeTyme.cb.toggle.bind input

      UI.addMenuEntry
        type:  'header'
        el:    el
        order: 97

      FappeTyme.cb.set lc if Conf[lc]

    Post.callbacks.push
      name: 'Fappe Tyme'
      cb:   @node

  node: ->
    return if @file
    $.addClass @nodes.root, "noFile"

  cb:
    set: (type) ->
      FappeTyme[type].checked = Conf[type]
      $["#{if Conf[type] then 'add' else 'rm'}Class"] doc, "#{type}Tyme"

    toggle: ->
      Conf[@name] = !Conf[@name]
      FappeTyme.cb.set @name
      $.cb.checked.call FappeTyme[@name]
