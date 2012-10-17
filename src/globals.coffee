unitTesting = !!window.QUnit

# Opera doesn't support the @match metadata key,
# return 4chan X here if we're not on 4chan.
return unless /^(boards|images|sys)\.4chan\.org$/.test(location.hostname) or unitTesting

Conf = {}
d = document
g =
  VERSION:   '<%= pkg.version %>'
  NAMESPACE: "<%= pkg.name.replace(/-/g, '_') %>."
  boards:  {}
  threads: {}
  posts:   {}
