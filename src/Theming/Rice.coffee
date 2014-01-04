Rice =
  init: ->
    $.ready ->
      Rice.nodes d.body

    Post.callbacks.push
      name: 'Rice Checkboxes'
      cb:   @node

  cb:
    check: (e)->
      e.preventDefault()
      e.stopPropagation()
      @check.click()

    option: (e) ->
      e.stopPropagation()
      e.preventDefault()
      select = Rice.input
      container = select.nextElementSibling
      container.firstChild.textContent = @textContent
      select.value = @dataset.value
      $.event 'change', null, select
      Rice.cleanup()

    select: (e) ->
      e.stopPropagation()
      e.preventDefault()

      {ul} = Rice

      unless ul
        Rice.ul = ul = $.el 'ul', id: "selectrice"
        $.add d.body, ul

      if ul.children.length > 0
        return Rice.cleanup()

      {width, left, bottom, top} = @getBoundingClientRect()
      {clientHeight} = d.documentElement
      {style} = ul

      style.cssText = "width: #{width}px; left: #{left}px;" + (if clientHeight - bottom < 200 then "bottom: #{clientHeight - top}px" else "top: #{bottom}px")
      Rice.input = select = @previousSibling

      nodes = []
      for option in select.options
        li = $.el 'li', textContent: option.textContent
        li.dataset.value = option.value
        $.on li, 'click', Rice.cb.option
        nodes.push li

      $.add ul, nodes

      $.on ul, 'click scroll blur', (e) ->
        e.stopPropagation()

      $.on d, 'click scroll blur resize', Rice.cleanup

  cleanup: ->
    $.off d, 'click scroll blur resize', Rice.cleanup
    $.rmAll Rice.ul
    return

  nodes: (root) ->
    root or= d.body

    fn = (items, type) ->
      func = Rice[type]
      func item for item in items

    fn $$('[type=checkbox]:not(.riced)', root), 'checkbox'
    fn $$('select:not(.riced)', root), 'select'

  node: ->
    Rice.checkbox $ '.postInfo input', @nodes.post

  checkbox: (input) ->
    return if $.hasClass input, 'riced'
    $.addClass input, 'riced'
    div = $.el 'div', className: 'rice'
    div.check = input
    $.after input, div
    $.on div, 'click', Rice.cb.check

  select: (select) ->
    $.addClass select, 'riced'
    div = $.el 'div',
      className: 'selectrice'
      innerHTML: "<div>#{select.options[select.selectedIndex or '0'].textContent or ''}</div>"
    $.on div, "click", Rice.cb.select

    $.after select, div