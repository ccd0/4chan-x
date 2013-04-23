UpdateAlert =
  init: ->
    return if $.get 'alertupdate'
    
    $.set 'alertupdate', true
    
    dialog = UpdateAlert.el = $.el 'div',
      className: 'updateAlert reply dialog'
      innerHTML: '
      <span class=dear>Dear user,</span><span class=alertMessage>As the <a href=https://github.com/seaweedchan/4chan-x/issues/17>rewrite based on Mayhem X v3</a> nears completion, this version -- v1.0.10 -- will be the last v2-based version of this fork of 4chan X.<br>It is highly likely that other userscripts will break.<br>Please disable all update checking if you do not want to make the switch, as the next stable version of 4chan X will be the rewrite.<br><br>Thank you for your love and support, and we hope you enjoy the next version because we did put a lot of work into making it just right.<br></span><span class=authors>--Zixaphir and Seaweed</span><br><br><span class=dismissMessage>Click Dismiss below to never see this message again.</span>
      <br>
      <a class="dismiss redButton">Dismiss</a>'

    overlay = $.el 'div', id: 'overlay'
    dismiss = $('.dismiss', dialog)
    $.on overlay, 'click', ->
      $.rm overlay
    $.on dismiss, 'click', ->
      $.rm overlay
    $.add overlay, dialog
    $.add d.body, overlay
    d.body.style.setProperty 'width', "#{d.body.clientWidth}px", null
    $.addClass d.body, 'unscroll'