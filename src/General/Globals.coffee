Conf = {}
c    = console
d    = document
doc  = d.documentElement
g    =
  VERSION:   '<%= meta.version %>'
  NAMESPACE: '<%= meta.name %>.'
  boards:    {}

E = do ->
  str = {'&': '&amp;', "'": '&#039;', '"': '&quot;', '<': '&lt;', '>': '&gt;'}
  r = String::replace
  regex = /[&"'<>]/g
  fn = (x) ->
    str[x]
  (text) -> r.call text, regex, fn
