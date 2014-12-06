QR.captcha =
  init: ->
    return if d.cookie.indexOf('pass_enabled=1') >= 0
    return unless @isEnabled = !!$.id 'captchaContainer'

    @captchas = []
    $.get 'captchas', [], ({captchas}) ->
      QR.captcha.sync captchas
    $.sync 'captchas', @sync.bind @

    counter   = $.el 'a',
      className: 'captcha-counter'
      href: 'javascript:;'
    container = $.el 'div',
      className: 'captcha-container'
    @nodes = {counter, container}
    @count()
    $.addClass QR.nodes.el, 'has-captcha'
    $.after QR.nodes.com.parentNode, [counter, container]

    $.on counter, 'click', @toggle.bind @
    $.on window, 'captcha:success', @save.bind @

  timeouts: {}

  needed: ->
    captchaCount = @captchas.length
    captchaCount++ if @nodes.container.dataset.widgetID and !@timeouts.destroy
    postsCount = QR.posts.length
    postsCount = 0 if postsCount is 1 and !Conf['Auto-load captcha'] and !QR.posts[0].com and !QR.posts[0].file
    captchaCount < postsCount

  toggle: ->
    if @nodes.container.dataset.widgetID and !@timeouts.destroy
      @destroy()
    else
      @setup true

  setup: (force) ->
    return unless @isEnabled and (@needed() or force)
    $.addClass QR.nodes.el, 'captcha-open' # suppress autohide so that captcha pop-up works
    if @timeouts.destroy
      clearTimeout @timeouts.destroy
      delete @timeouts.destroy
      return @reload()
    return if @nodes.container.dataset.widgetID
    @observer?.disconnect()
    @observer = new MutationObserver @afterSetup.bind @
    @observer.observe @nodes.container,
      childList: true
      subtree: true
    $.globalEval '''
      (function() {
        var container = document.querySelector("#qr .captcha-container");
        container.dataset.widgetID = window.grecaptcha.render(container, {
          sitekey: '<%= meta.recaptchaKey %>',
          theme: document.documentElement.classList.contains('tomorrow') ? 'dark' : 'light',
          callback: function(response) {
            window.dispatchEvent(new CustomEvent("captcha:success", {detail: response}));
          }
        });
      })();
    '''

  afterSetup: ->
    return unless @nodes.container.firstElementChild?.firstElementChild
    @observer.disconnect()
    if QR.nodes.el.getBoundingClientRect().bottom > doc.clientHeight
      QR.nodes.el.style.top    = null
      QR.nodes.el.style.bottom = '0px'

  destroy: ->
    return unless @isEnabled
    delete @timeouts.destroy
    $.rmClass QR.nodes.el, 'captcha-open'
    $.rmAll @nodes.container
    # XXX https://github.com/greasemonkey/greasemonkey/issues/1571
    @nodes.container.removeAttribute 'data-widget-i-d'

  sync: (captchas) ->
    @captchas = captchas
    @clear()
    @count()

  getOne: ->
    @clear()
    if captcha = @captchas.shift()
      @count()
      $.set 'captchas', @captchas
      captcha.response
    else
      null

  save: (e) ->
    if @needed()
      @reload()
    else
      @timeouts.destroy ?= setTimeout @destroy.bind(@), 3 * $.SECOND
    $.forceSync 'captchas'
    @captchas.push
      response: e.detail
      timeout:  Date.now() + 2 * $.MINUTE
    @count()
    $.set 'captchas', @captchas
    @nodes.counter.focus()

  clear: ->
    return unless @captchas.length
    now = Date.now()
    for captcha, i in @captchas
      break if captcha.timeout > now
    return unless i
    @captchas = @captchas[i..]
    @count()
    $.set 'captchas', @captchas
    @setup()

  count: ->
    @nodes.counter.textContent = "Captchas: #{@captchas.length}"
    clearTimeout @timeouts.clear
    if @captchas.length
      @timeouts.clear = setTimeout @clear.bind(@), @captchas[0].timeout - Date.now()

  reload: (focus) ->
    $.globalEval '''
      (function() {
        var container = document.querySelector("#qr .captcha-container");
        window.grecaptcha.reset(container.dataset.widgetID);
      })();
    '''
