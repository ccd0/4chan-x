class SimpleDict
  constructor: ->
    @keys = []

  push: (key, data) ->
    key = "#{key}"
    @keys.push key unless @[key]
    @[key] = data

  rm: (key) ->
    key = "#{key}"
    if (i = @keys.indexOf key) isnt -1
      @keys.splice i, 1
      delete @[key]

  forEach: (fn) -> 
    fn @[key] for key in [@keys...]
    return

  get: (key) ->
    if key is 'keys'
      undefined
    else
      $.getOwn(@, key)
