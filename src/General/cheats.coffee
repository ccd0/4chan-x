# I am bad at JavaScript and if you reuse this, so are you.
Array::indexOf = (val) ->
  i = @length
  while i--
    return i if @[i] is val
  return i

# Update CoffeeScript's reference to [].indexOf
# Reserved keywords are ignored in embedded javascript.
`__indexOf = [].indexOf`
