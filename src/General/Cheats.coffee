# I am bad at JavaScript and if you reuse this, so are you.
Array::indexOf = (val, i) ->
  i or= 0
  len = @length
  while i < len
    return i if @[i] is val
    i++
  return -1

# Update CoffeeScript's reference to [].indexOf
# Reserved keywords are ignored in embedded javascript.
`__indexOf = [].indexOf`
