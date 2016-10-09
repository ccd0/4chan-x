SW.yotsuba =
  isThisPageLegit: ->
    # not 404 error page or similar.
    location.hostname is 'boards.4chan.org' and
    !$('link[href*="favicon-status.ico"]', d.head) and
    d.title not in ['4chan - Temporarily Offline', '4chan - Error', '504 Gateway Time-out']
