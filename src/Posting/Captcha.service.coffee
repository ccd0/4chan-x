Captcha.service =
  init: ->
    Conf['captchaServiceDomain'] = ''
    $.on d, 'LoadCaptcha',              @loadCaptcha.bind(@)
    $.on d, 'AbortCaptcha SaveCaptcha', @abortCaptcha.bind(@)
    $.on d, 'RequestCaptcha',           @requestCaptcha.bind(@)

  isEnabled: ->
    Conf['captchaServiceDomain'] and /\S/.test(Conf['captchaServiceDomain'])

  loadCaptcha: (e) ->
    return unless @isEnabled()
    e.preventDefault() if !@pending or @aborted

  abortCaptcha: ->
    @aborted = true if @pending

  requestCaptcha: (e) ->
    return unless @isEnabled()
    return if e.defaultPrevented
    if @pending and @aborted
      @aborted = false
      return
    return if @pending
    @pending = true
    @aborted = false
    e.preventDefault()
    key = Conf['captchaServiceKey'][Conf['captchaServiceDomain']]
    return @noCaptcha 'API key not set' unless key and /\S/.test(key)
    url = "#{Conf['captchaServiceDomain']}/in.php?key=#{encodeURIComponent key}&method=userrecaptcha&googlekey=<%= meta.recaptchaKey %>&pageurl=https://boards.4channel.org/v/"
    @req = CrossOrigin.ajax url,
      responseType: 'text'
      onloadend: =>
        response = @req.response or ''
        parts = response.split('|')
        if parts[0] is 'OK'
          @requestID = parts[1]
          @interval = setInterval @poll.bind(@), 5 * $.SECOND
        else
          @noCaptcha()

  poll: ->
    key = Conf['captchaServiceKey'][Conf['captchaServiceDomain']]
    return @noCaptcha 'API key not set' unless key and /\S/.test(key)
    url = "#{Conf['captchaServiceDomain']}/res.php?key=#{encodeURIComponent key}&action=get&id=#{encodeURIComponent @requestID}"
    @req = CrossOrigin.ajax url,
      responseType: 'text'
      onloadend: =>
        return unless @req.status
        response = @req.response or ''
        parts = response.split('|')
        if parts[0] is 'CAPCHA_NOT_READY'
          # pass
        else if parts[0] is 'OK'
          clearInterval @interval
          @saveCaptcha parts[1]
        else
          clearInterval @interval
          @noCaptcha()

  noCaptcha: (error) ->
    @pending = false
    return if @aborted
    error = if @req.status is 200
      @req.response
    else if @req.status
      "#{@req.statusText} (#{@req.status})"
    else
      'Connection Error'
    error = "Failed to retrieve captcha: #{error}"
    $.event 'NoCaptcha', {error}

  saveCaptcha: (response) ->
    @pending = false
    timeout = Date.now() + Captcha.v2.lifetime
    $.event 'SaveCaptcha', {response, timeout}
