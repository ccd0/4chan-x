Icon =
  set: (node, name, altText) ->
    node.dataset.icon = name
    html = $.getOwn(Icons, name)
    if altText
      $.extend node, `<%= html('<span class="icon--alt-text">${altText}</span>&{html}') %>`
    else
      $.extend node, html
