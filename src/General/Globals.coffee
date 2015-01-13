
editTheme = {} 
editMascot = {}
userNavigation = {}
Conf = {}
c    = console
d    = document
doc  = d.documentElement
g    =
  VERSION:   '<%= meta.version %>'
  NAMESPACE: '<%= meta.name.replace(' ', '_') %>.'
  NAME:      '<%= meta.name %>'
  FAQ:       '<%= meta.faq %>'
  CHANGELOG: '<%= meta.repo %>blob/<%= meta.mainBranch %>/CHANGELOG.md'
  boards:    {}

E = do ->
  str = {'&': '&amp;', "'": '&#039;', '"': '&quot;', '<': '&lt;', '>': '&gt;'}
  r = String::replace
  regex = /[&"'<>]/g
  fn = (x) ->
    str[x]
  (text) -> r.call text, regex, fn