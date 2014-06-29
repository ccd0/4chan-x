Conf = {}
c    = console
d    = document
doc  = d.documentElement
g    =
  VERSION:   '<%= version %>'
  NAMESPACE: '<%= meta.name %>.'
  boards:    {}
E    = (text) ->
  (text+'').replace /[&"'<>]/g, (x) ->
    {'&': '&amp;', "'": '&#039;', '"': '&quot;', '<': '&lt;', '>': '&gt;'}[x]
