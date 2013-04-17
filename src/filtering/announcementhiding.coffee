AnnouncementHiding =
  init: ->
    return unless gmsg = $.id 'globalMessage'

    hideState = $.get 'hidegMessage', {}

    hideButton = $.el 'a',
      id: 'toggleMsgButton'
      className: "redButton"
      textContent: "#{if hideState.hidden then 'View Important Announcement' else 'Close Announcement'}"
      href:  "javascript:;"
    $.before gmsg, hideButton

    $.on hideButton, 'click', ->
      $.toggleClass gmsg, 'hidden'
      if hideState.hidden
        @textContent = 'Close Announcement'
        hideState.hidden = false
        delete hideState.gmsg
      else
        @textContent = 'View Important Announcement'
        hideState.hidden = true
        hideState.gmsg = gmsg.textContent

      $.set 'hidegMessage', hideState

    if hideState.hidden
      $.toggleClass gmsg, 'hidden'
      if gmsg.textContent isnt hideState.gmsg
        hideButton.click()