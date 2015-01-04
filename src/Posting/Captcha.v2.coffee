Captcha.v2 =
  lifetime: 2 * $.MINUTE

  init: ->
    return if d.cookie.indexOf('pass_enabled=1') >= 0
    return unless @isEnabled = !!$.id('g-recaptcha') or g.BOARD.ID is 'b'

    @captchas = []
    $.get 'captchas', [], ({captchas}) ->
      QR.captcha.sync captchas
    $.sync 'captchas', @sync.bind @

    root = $.el 'div', className: 'captcha-root'
    $.extend root, <%= html(
      '<div class="captcha-counter"><a href="javascript:;"></a></div>'
    ) %>
    counter   = $ '.captcha-counter > a', root
    @nodes = {root, counter}
    @count()
    $.addClass QR.nodes.el, 'has-captcha'
    $.after QR.nodes.com.parentNode, root

    $.on counter, 'click', @toggle.bind @
    $.on window, 'captcha:success', =>
      # XXX Greasemonkey 1.x workaround to gain access to GM_* functions.
      $.queueTask => @save false

  shouldFocus: false
  timeouts: {}
  postsCount: 0

  needed: ->
    captchaCount = @captchas.length
    captchaCount++ if QR.req
    @postsCount = QR.posts.length
    @postsCount = 0 if @postsCount is 1 and !Conf['Auto-load captcha'] and !QR.posts[0].com and !QR.posts[0].file
    captchaCount < @postsCount

  onNewPost: ->
    @setup()

  onPostChange: ->
    @setup() if @postsCount is 0
    @postsCount = 0 if QR.posts.length is 1 and !Conf['Auto-load captcha'] and !QR.posts[0].com and !QR.posts[0].file

  toggle: ->
    if @nodes.container and !@timeouts.destroy
      @destroy()
    else
      @setup true, true

  setup: (focus, force) ->
    return unless @isEnabled and (@needed() or force)
    $.addClass QR.nodes.el, 'captcha-open'
    @shouldFocus = true if focus
    if @timeouts.destroy
      clearTimeout @timeouts.destroy
      delete @timeouts.destroy
      return @reload()

    if @nodes.container
      if @shouldFocus and iframe = $ 'iframe', @nodes.container
        iframe.focus()
        delete @shouldFocus
      return

    @nodes.container = $.el 'div', className: 'captcha-container'
    $.prepend @nodes.root, @nodes.container
    new MutationObserver(@afterSetup.bind @).observe @nodes.container,
      childList: true
      subtree: true

    $.globalEval '''
      (function() {
        function render() {
          var container = document.querySelector("#qr .captcha-container");
          container.dataset.widgetID = window.grecaptcha.render(container, {
            sitekey: '<%= meta.recaptchaKey %>',
            theme: document.documentElement.classList.contains('tomorrow') ? 'dark' : 'light',
            callback: function(response) {
              window.dispatchEvent(new CustomEvent("captcha:success", {detail: response}));
            }
          });
        }
        if (window.grecaptcha) {
          render();
        } else {
          var cbNative = window.onRecaptchaLoaded;
          window.onRecaptchaLoaded = function() {
            render();
            cbNative();
          }
        }
      })();
    '''

  afterSetup: (mutations) ->
    for mutation in mutations
      for node in mutation.addedNodes
        @setupIFrame   iframe   if iframe   = $.x './descendant-or-self::iframe',   node
        @setupTextArea textarea if textarea = $.x './descendant-or-self::textarea', node
    return

  setupIFrame: (iframe) ->
    @setupTime = Date.now()
    if QR.nodes.el.getBoundingClientRect().bottom > doc.clientHeight
      QR.nodes.el.style.top    = null
      QR.nodes.el.style.bottom = '0px'
    iframe.focus() if @shouldFocus
    @shouldFocus = false

  setupTextArea: (textarea) ->
    $.one textarea, 'input', => @save true

  destroy: ->
    return unless @isEnabled
    delete @timeouts.destroy
    $.rmClass QR.nodes.el, 'captcha-open'
    $.rm @nodes.container if @nodes.container
    delete @nodes.container

  sync: (captchas=[]) ->
    @captchas = captchas
    @clear()
    @count()

  getOne: ->
    @clear()
    if captcha = @captchas.shift()
      $.set 'captchas', @captchas
      @count()
      captcha.response
    else
      null

  save: (pasted) ->
    $.forceSync 'captchas'
    @captchas.push
      response: $('textarea', @nodes.container).value
      timeout:  (if pasted then @setupTime else Date.now()) + @lifetime
    $.set 'captchas', @captchas
    @count()

    if @needed()
      if QR.cooldown.auto or Conf['Post on Captcha Completion']
        @shouldFocus = true
      else
        QR.nodes.status.focus()
      @reload()
    else
      if pasted
        @destroy()
      else
        @timeouts.destroy ?= setTimeout @destroy.bind(@), 3 * $.SECOND
      QR.nodes.status.focus()

    QR.submit() if Conf['Post on Captcha Completion'] and !QR.cooldown.auto

  notify: (el) ->
    QR.notify el

  clear: ->
    return unless @captchas.length
    $.forceSync 'captchas'
    now = Date.now()
    for captcha, i in @captchas
      break if captcha.timeout > now
    return unless i
    @captchas = @captchas[i..]
    @count()
    $.set 'captchas', @captchas
    @setup true

  count: ->
    @nodes.counter.textContent = "Captchas: #{@captchas.length}"
    clearTimeout @timeouts.clear
    if @captchas.length
      @timeouts.clear = setTimeout @clear.bind(@), @captchas[0].timeout - Date.now()

  reload: ->
    $.globalEval '''
      (function() {
        var container = document.querySelector("#qr .captcha-container");
        window.grecaptcha.reset(container.dataset.widgetID);
      })();
    '''
