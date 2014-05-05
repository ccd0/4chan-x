FappeTyme =
  init: ->
    return if !(Conf['Fappe Tyme'] or Conf['Werk Tyme']) or g.BOARD.ID is 'f'

    for type in ["Fappe", "Werk"] when Conf["#{type} Tyme"]
      lc = type.toLowerCase()
      FappeTyme[lc] = el = $.el 'a',
        href: 'javascript:;'
        id:   "#{lc}Tyme"
        title: "#{type} Tyme"
        className: 'a-icon'
      
      if type is 'Werk'
        el.textContent = '\uf0b1'
        el.className   = 'fa'

      $.on el, 'click', FappeTyme.cb.toggle.bind {name: "#{lc}"}
      Header.addShortcut el, true
      FappeTyme.cb.set lc

    Post.callbacks.push
      name: 'Fappe Tyme'
      cb:   @node

  node: ->
    return if @file
    $.addClass @nodes.root, "noFile"

  cb:
    set: (type) -> $["#{if Conf[type] then 'add' else 'rm'}Class"] doc, "#{type}Tyme"
    toggle: ->
      Conf[@name] = !Conf[@name]
      FappeTyme.cb.set @name
      $.cb.checked.call {name: @name, checked: Conf[@name]}
