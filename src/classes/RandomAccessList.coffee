class RandomAccessList
  constructor: (items) ->
    @length = 0
    @push item for item in items if items

  push: (data) ->
    {ID} = data
    ID or= data.id
    return if @[ID]
    {last} = @
    @[ID] = item =
      prev: last
      next: null
      data: data
      ID:   ID
    item.prev = last
    @last = if last
      last.next = item
    else
      @first = item
    @length++

  before: (root, item) ->
    return if item.next is root or item is root

    @rmi item

    {prev} = root
    root.prev = item
    item.next = root
    item.prev = prev
    if prev
      prev.next = item
    else
      @first = item

  after: (root, item) ->
    return if item.prev is root or item is root

    @rmi item

    {next} = root
    root.next = item
    item.prev = root
    item.next = next
    if next
      next.prev = item
    else
      @last = item

  prepend: (item) ->
    {first} = @
    return if item is first or not @[item.ID]
    @rmi item
    item.next  = first
    if first
      first.prev = item
    else
      @last = item
    @first = item
    delete item.prev

  shift: ->
    @rm @first.ID

  order: ->
    order = [item = @first]
    order.push item while item = item.next
    order

  rm: (ID) ->
    item = @[ID]
    return unless item
    delete @[ID]
    @length--
    @rmi item
    delete item.next
    delete item.prev

  rmi: (item) ->
    {prev, next} = item
    if prev
      prev.next = next
    else
      @first = next
    if next
      next.prev = prev
    else
      @last = prev
