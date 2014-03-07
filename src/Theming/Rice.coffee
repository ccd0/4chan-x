Rice =
  ul: $.el 'ul', id: "selectrice"
  init: ->
    $.ready @initReady

    Post.callbacks.push
      name: 'Rice Checkboxes'
      cb:   @node

  initReady: ->
    Rice.nodes d.body
    $.add d.body, Rice.ul

  node: ->
    Rice.checkbox $ '.postInfo input', @nodes.post

  nodes: (root) ->
    root or= d.body
    {process} = Rice
    process $$('[type=checkbox]:not(.riced)', root), 'checkbox'
    process $$('select:not(.riced)', root), 'select'

  process: (items, type) ->
    fn = Rice[type]
    fn item for item in items
    return

  cleanup: ->
    $.off d, 'click scroll blur resize', Rice.cleanup
    $.rmAll Rice.ul
    return

  checkbox: (input) ->
    return if $.hasClass input, 'riced'
    $.addClass input, 'riced'
    div = $.el 'div', className: 'rice'
    div.check = input
    $.after input, div
    $.on div, 'click', Rice.cb.check

  select: (select) ->
    div = $.el 'div',
      className: 'selectrice'
      innerHTML: "<div>#{select.options[select.selectedIndex or '0']?.textContent or ''}</div>"
    $.on div, 'click',   Rice.cb.select
    $.on div, 'keydown', Rice.cb.keybind

    $.after    select, div
    $.addClass select, 'riced'

  cb:
    check: (e)->
      e.preventDefault()
      e.stopPropagation()
      @check.click()

    option: (e) ->
      e.stopPropagation()
      e.preventDefault()
      
      return if @dataset.disabled

      select    = Rice.input
      container = select.nextElementSibling

      container.firstChild.textContent = @textContent
      select.value = @dataset.value

      $.event 'change', null, select
      Rice.cleanup()

    select: (e) ->
      e.stopPropagation()
      e.preventDefault()

      {ul} = Rice

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
        if option.disabled
          li.dataset.disabled = true
        $.on li, 'click', Rice.cb.option
        nodes.push li

      $.add ul, nodes

      $.on ul, 'click scroll blur', (e) ->
        e.stopPropagation()

      $.on d, 'click scroll blur resize', Rice.cleanup
