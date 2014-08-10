Conf = {}
c    = console
d    = document
doc  = d.documentElement
g    =
  VERSION:   '<%= meta.version %>'
  NAMESPACE: '<%= meta.name %>.'
  NAME:      '<%= meta.name %>'
  FAQ:       '<%= meta.faq %>'
  CHANGELOG: '<%= meta.repo %>blob/<%= meta.mainBranch %>/CHANGELOG.md'
  boards:    {}
E    = (text) ->
  (text+'').replace /[&"'<>]/g, (x) ->
    {'&': '&amp;', "'": '&#039;', '"': '&quot;', '<': '&lt;', '>': '&gt;'}[x]
