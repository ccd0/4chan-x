class ShimSet
  constructor: ->
    @elements = {}
    @size = 0
  has: (value) ->
    value of @elements
  add: (value) ->
    return if @elements[value]
    @elements[value] = true
    @size++
  delete: (value) ->
    return unless @elements[value]
    delete @elements[value]
    @size--

window.Set = ShimSet unless 'Set' of window
