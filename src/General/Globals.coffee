<% if (type === 'userjs') { %>
# Opera doesn't support the @match metadata key,
# return 4chan X here if we're not on 4chan.
return unless /^(boards|images|sys)\.4chan\.org$/.test location.hostname
<% } %>

Conf = {}
c    = console
d    = document
doc  = d.documentElement
g    =
  VERSION:   '<%= version %>'
  NAMESPACE: '<%= meta.name %>.'
  boards:  {}
  threads: {}
  posts:   {}
