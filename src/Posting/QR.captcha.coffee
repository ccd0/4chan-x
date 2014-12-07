QR.captcha =
  init: ->
    return if d.cookie.indexOf('pass_enabled=1') >= 0
    return unless @isEnabled = !!$.id 'captchaContainer'

    @captchas = []
    $.get 'captchas', [], ({captchas}) ->
      QR.captcha.sync captchas
    $.sync 'captchas', @sync.bind @

    section = $.el 'div', className: 'captcha-section'
    $.extend section, <%= html(
      '<div class="captcha-container"></div>' +
      '<div class="captcha-counter"><a href="javascript:;"></a></div>'
    ) %>
    container = $ '.captcha-container',   section
    counter   = $ '.captcha-counter > a', section
    @nodes = {container, counter}
    @count()
    $.addClass QR.nodes.el, 'has-captcha'
    $.after QR.nodes.com.parentNode, section

    new MutationObserver(@afterSetup.bind @).observe container,
      childList: true
      subtree: true

    $.on counter, 'click', @toggle.bind @
    $.on window, 'captcha:success', @save.bind @

  shouldFocus: false
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
      @shouldFocus = true
      @setup true

  setup: (force) ->
    return unless @isEnabled and (@needed() or force)
    $.addClass QR.nodes.el, 'captcha-open'
    if @timeouts.destroy
      clearTimeout @timeouts.destroy
      delete @timeouts.destroy
      return @reload()
    return if @nodes.container.dataset.widgetID
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

  afterSetup: (mutations) ->
    for mutation in mutations
      for node in mutation.addedNodes
        iframe = node if node.nodeName is 'IFRAME'
    return unless iframe
    if QR.nodes.el.getBoundingClientRect().bottom > doc.clientHeight
      QR.nodes.el.style.top    = null
      QR.nodes.el.style.bottom = '0px'
    iframe.focus() if @shouldFocus
    @shouldFocus = false

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
      @shouldFocus = true
      @reload()
    else
      @nodes.counter.focus()
      @timeouts.destroy ?= setTimeout @destroy.bind(@), 3 * $.SECOND
    $.forceSync 'captchas'
    @captchas.push
      response: e.detail
      timeout:  Date.now() + 2 * $.MINUTE
    @count()
    $.set 'captchas', @captchas

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
