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

E.cat = (templates) ->
  html = ''
  html += x.innerHTML for x in templates
  html

E.url = (content) ->
  "data:text/html;charset=utf-8,<!doctype html>#{encodeURIComponent content.innerHTML}"
