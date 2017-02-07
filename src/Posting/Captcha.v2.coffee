Captcha.v2 =
  lifetime: 2 * $.MINUTE

  init: ->
    return if d.cookie.indexOf('pass_enabled=1') >= 0
    return if not (@isEnabled = !!$ '#g-recaptcha, #captchaContainerAlt, #captcha-forced-noscript')

    if (@noscript = Conf['Force Noscript Captcha'] or not Main.jsEnabled)
      $.addClass QR.nodes.el, 'noscript-captcha'

    Captcha.cache.init()
    $.on d, 'CaptchaCount', @count.bind(@)

    root = $.el 'div', className: 'captcha-root'
    $.extend root, <%= html(
      '<div class="captcha-counter"><a href="javascript:;"></a></div>'
    ) %>
    counter   = $ '.captcha-counter > a', root
    @nodes = {root, counter}
    @count()
    $.addClass QR.nodes.el, 'has-captcha', 'captcha-v2'
    $.after QR.nodes.com.parentNode, root

    $.on counter, 'click', @toggle.bind @
    $.on counter, 'keydown', (e) =>
      return unless Keybinds.keyCode(e) is 'Space'
      @toggle()
      e.preventDefault()
      e.stopPropagation()
    $.on window, 'captcha:success', =>
      # XXX Greasemonkey 1.x workaround to gain access to GM_* functions.
      $.queueTask => @save false

  timeouts: {}
  prevNeeded: 0

  noscriptURL: ->
    url = 'https://www.google.com/recaptcha/api/fallback?k=<%= meta.recaptchaKey %>'
    if (lang = Conf['captchaLanguage'].trim())
      url += "&hl=#{encodeURIComponent lang}"
    url

  moreNeeded: ->
    # Post count temporarily off by 1 when called from QR.post.rm, QR.close, or QR.submit
    $.queueTask =>
      needed = Captcha.cache.needed()
      if needed and not @prevNeeded
        @setup(QR.cooldown.auto and d.activeElement is QR.nodes.status)
      @prevNeeded = needed

  toggle: ->
    if @nodes.container and !@timeouts.destroy
      @destroy()
    else
      @setup true, true

  setup: (focus, force) ->
    return unless @isEnabled and (Captcha.cache.needed() or force)

    if focus
      $.addClass QR.nodes.el, 'focus'
      @nodes.counter.focus()

    if @timeouts.destroy
      clearTimeout @timeouts.destroy
      delete @timeouts.destroy
      return @reload()

    if @nodes.container
      # XXX https://bugzilla.mozilla.org/show_bug.cgi?id=1226835
      $.queueTask =>
        if @nodes.container and d.activeElement is @nodes.counter and (iframe = $ 'iframe', @nodes.container)
          iframe.focus()
          QR.focus() # Event handler not fired in Firefox
      return

    @nodes.container = $.el 'div', className: 'captcha-container'
    $.prepend @nodes.root, @nodes.container
    new MutationObserver(@afterSetup.bind @).observe @nodes.container,
      childList: true
      subtree: true

    if @noscript
      @setupNoscript()
    else
      @setupJS()

  setupNoscript: ->
    iframe = $.el 'iframe',
      id: 'qr-captcha-iframe'
      scrolling: 'no'
      src: @noscriptURL()
    div = $.el 'div'
    textarea = $.el 'textarea'
    $.add div, textarea
    $.add @nodes.container, [iframe, div]

  setupJS: ->
    $.global ->
      render = ->
        {classList} = document.documentElement
        container = document.querySelector '#qr .captcha-container'
        container.dataset.widgetID = window.grecaptcha.render container,
          sitekey:  '<%= meta.recaptchaKey %>'
          theme:    if classList.contains('tomorrow') or classList.contains('spooky') or classList.contains('dark-captcha') then 'dark' else 'light'
          callback: (response) ->
            window.dispatchEvent new CustomEvent('captcha:success', {detail: response})
      if window.grecaptcha
        render()
      else
        cbNative = window.onRecaptchaLoaded
        window.onRecaptchaLoaded = ->
          render()
          cbNative()

  afterSetup: (mutations) ->
    for mutation in mutations
      for node in mutation.addedNodes
        @setupIFrame   iframe   if (iframe   = $.x './descendant-or-self::iframe',   node)
        @setupTextArea textarea if (textarea = $.x './descendant-or-self::textarea', node)
    return

  setupIFrame: (iframe) ->
    return unless doc.contains iframe
    Captcha.replace.iframe iframe
    $.addClass QR.nodes.el, 'captcha-open'
    @fixQRPosition()
    $.on iframe, 'load', @fixQRPosition
    iframe.focus() if d.activeElement is @nodes.counter
    # XXX Make sure scroll on space prevention (see src/css/style.css) doesn't cause scrolling of div
    if $.engine in ['blink', 'edge'] and iframe.parentNode in $$('#qr .captcha-container > div > div:first-of-type')
      $.on iframe.parentNode, 'scroll', -> @scrollTop = 0

  fixQRPosition: ->
    if QR.nodes.el.getBoundingClientRect().bottom > doc.clientHeight
      QR.nodes.el.style.top    = ''
      QR.nodes.el.style.bottom = '0px'

  setupTextArea: (textarea) ->
    $.one textarea, 'input', => @save true

  destroy: ->
    return unless @isEnabled
    delete @timeouts.destroy
    $.rmClass QR.nodes.el, 'captcha-open'
    $.rm @nodes.container if @nodes.container
    delete @nodes.container
    # Clean up abandoned iframes.
    garbage = $.X '//iframe[starts-with(@src, "https://www.google.com/recaptcha/api2/frame")]/ancestor-or-self::*[parent::body]'
    i = 0
    while node = garbage.snapshotItem i++
      $.rm ins if (ins = node.nextSibling)?.nodeName is 'INS'
      $.rm node
    return

  getOne: ->
    Captcha.cache.getOne()

  save: (pasted, token) ->
    Captcha.cache.save
      response: token or $('textarea', @nodes.container).value
      timeout:  Date.now() + @lifetime

    focus = d.activeElement?.nodeName is 'IFRAME' and /https?:\/\/www\.google\.com\/recaptcha\//.test(d.activeElement.src)
    if Captcha.cache.needed()
      if focus
        if QR.cooldown.auto or Conf['Post on Captcha Completion']
          @nodes.counter.focus()
        else
          QR.nodes.status.focus()
      @reload()
    else
      if pasted
        @destroy()
      else
        @timeouts.destroy ?= setTimeout @destroy.bind(@), 3 * $.SECOND
      QR.nodes.status.focus() if focus

    QR.submit() if Conf['Post on Captcha Completion'] and !QR.cooldown.auto

  count: ->
    count = Captcha.cache.getCount()
    @nodes.counter.textContent = "Captchas: #{count}"
    @moreNeeded()

  reload: ->
    if $ 'iframe[src^="https://www.google.com/recaptcha/api/fallback?"]', @nodes.container
      @destroy()
      @setup false, true
    else
      $.global ->
        container = document.querySelector '#qr .captcha-container'
        window.grecaptcha.reset container.dataset.widgetID
