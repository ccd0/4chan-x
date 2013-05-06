Rice =
  init: ->
    $.ready ->
      Rice.nodes d.body

    Post::callbacks.push
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
      select.value = @getAttribute 'data-value'
      $.event 'change', null, select
      Rice.cleanup()

    select: (e) ->
      e.stopPropagation()
      e.preventDefault()

      {ul} = Rice

      unless ul
        Rice.ul = ul = $.el 'ul',
          id: "selectrice"
        $.add d.body, ul

      if ul.children.length > 0
        return Rice.cleanup()

      rect = @getBoundingClientRect()
      {clientHeight} = d.documentElement
      {style} = ul

      style.cssText = "width: #{rect.width}px; left: #{rect.left}px;" + (if clientHeight - rect.bottom < 200 then "bottom: #{clientHeight - rect.top}px" else "top: #{rect.bottom}px")
      Rice.input = select = @previousSibling
      nodes = []

      for option in select.options
        li = $.el 'li',
          textContent: option.textContent
        li.setAttribute 'data-value', option.value

        $.on li, 'click', Rice.cb.option
        nodes.push li
      $.add ul, nodes

      $.on ul, 'click scroll blur', (e) ->
        e.stopPropagation()

      $.on d, 'click scroll blur resize', Rice.cleanup

  cleanup: ->
    $.off d, 'click scroll blur resize', Rice.cleanup
    for child in [Rice.ul.children...]
      $.rm child
    return

  nodes: (root) ->
    root or= d.body

    checkboxes = $$('[type=checkbox]:not(.riced)', root)
    checkrice = Rice.checkbox

    for input in checkboxes
      checkrice input

    selects = $$('select:not(.riced)', root)
    selectrice = Rice.select

    for select in selects
      selectrice select

    return

  node: ->
    Rice.checkbox $ '.postInfo input', @nodes.post

  checkbox: (input) ->
    return if $.hasClass input, 'riced'
    $.addClass input, 'riced'
    div = $.el 'div',
      className: 'rice'
    div.check = input
    $.after input, div
    $.on div, 'click', Rice.cb.check

  select: (select) ->
    $.addClass select, 'riced'
    div = $.el 'div',
      className: 'selectrice'
      innerHTML: "<div>#{select.options[select.selectedIndex].textContent or null}</div>"
    $.on div, "click", Rice.cb.select

    $.after select, div