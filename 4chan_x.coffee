#todo: remove close()?, make hiddenReplies/hiddenThreads local, comments, gc
#todo: remove stupid 'obj', arr el, make hidden an object, smarter xhr, text(), @this, images, clear hidden
#todo: watch - add board in updateWatcher?, redundant move divs?, redo css / hiding, manual clear
#
#TODO - 4chan time
#addClass, removeClass; remove hide / show; makeDialog el, 'center'
#TODO - expose 'hidden' configs

config =
    '404 Redirect':        [true, 'Redirect dead threads']
    'Anonymize':           [false, 'Make everybody anonymous']
    'Auto Watch':          [true, 'Automatically watch threads that you start (Firefox only)']
    'Auto Update':         [true, 'Automatically enable automatic updating']
    'Comment Expansion':   [true, 'Expand too long comments']
    'Image Expansion':     [true, 'Expand images']
    'Keybinds':            [false, 'Binds actions to keys']
    'Localize Time':       [true, 'Show times based on your timezone']
    'Persistent QR':       [false, 'Quick reply won\'t disappear after posting. Only in replies.']
    'Post in Title':       [true, 'Show the op\'s post in the tab title']
    'Quick Reply':         [true, 'Reply without leaving the page']
    'Quick Report':        [true, 'Add quick report buttons']
    'Reply Hiding':        [true, 'Hide single replies']
    'Reply Navigation':    [true, 'Navigate to the beginning / end of a thread']
    'Restore IDs':         [true, 'Check \'em']
    'Sauce':               [true, 'Add sauce to images']
    'Show Stubs':          [true, 'Of hidden threads / replies']
    'Thread Expansion':    [true, 'View all replies']
    'Thread Hiding':       [true, 'Hide entire threads']
    'Thread Navigation':   [true, 'Navigate to previous / next thread']
    'Thread Updater':      [true, 'Update threads']
    'Thread Watcher':      [true, 'Bookmark threads']
    'Unread Count':        [true, 'Show unread post count in tab title']

#utility
AEOS =
    init: ->
        #x-browser
        if typeof GM_deleteValue is 'undefined'
            window.GM_setValue = (name, value) ->
                value = (typeof value)[0] + value
                localStorage.setItem name, value
            window.GM_getValue = (name, defaultValue) ->
                unless value = localStorage.getItem name
                    return defaultValue
                type = value[0]
                value = value[1..]
                switch type
                    when 'b'
                        value == 'true'
                    when 'n'
                        Number value
                    else
                        value
            window.GM_addStyle = (css) ->
                style = document.createElement 'style'
                style.type = 'text/css'
                style.textContent = css
                document.getElementsByTagName('head')[0].appendChild style
            window.GM_openInTab = (url) ->
                window.open url, "_blank"

        #dialog styling
        GM_addStyle '
            div.dialog {
                border: 1px solid;
            }
            div.dialog > div.move {
                cursor: move;
            }
            label, a {
                cursor: pointer;
            }
        '
    #dialog creation
    makeDialog: (id, position) ->
        dialog = document.createElement 'div'
        dialog.className = 'reply dialog'
        dialog.id = id
        switch position
            when 'topleft'
                left = '0px'
                top = '0px'
            when 'topright'
                left = null
                top = '0px'
            when 'bottomleft'
                left = '0px'
                top = null
            when 'bottomright'
                left = null
                top = null
        left = GM_getValue "#{id}Left", left
        top  = GM_getValue "#{id}Top", top
        if left then dialog.style.left = left else dialog.style.right = '0px'
        if top then dialog.style.top = top else dialog.style.bottom = '0px'
        dialog
    #movement
    move: (e) ->
        div = @parentNode
        AEOS.div = div
        #distance from pointer to div edge is constant; calculate it here.
        AEOS.dx = e.clientX - div.offsetLeft
        AEOS.dy = e.clientY - div.offsetTop
        #factor out div from document dimensions
        AEOS.width  = document.body.clientWidth  - div.offsetWidth
        AEOS.height = document.body.clientHeight - div.offsetHeight
        document.addEventListener 'mousemove', AEOS.moveMove, true
        document.addEventListener 'mouseup',   AEOS.moveEnd, true
    moveMove: (e) ->
        div = AEOS.div
        left = e.clientX - AEOS.dx
        if left < 20 then left = '0px'
        else if AEOS.width - left < 20 then left = ''
        right = if left then '' else '0px'
        div.style.left  = left
        div.style.right = right
        top = e.clientY - AEOS.dy
        if top < 20 then top = '0px'
        else if AEOS.height - top < 20 then top = ''
        bottom = if top then '' else '0px'
        div.style.top    = top
        div.style.bottom = bottom
    moveEnd: ->
        document.removeEventListener 'mousemove', AEOS.moveMove, true
        document.removeEventListener 'mouseup',   AEOS.moveEnd, true
        div = AEOS.div
        id = div.id
        GM_setValue "#{id}Left", div.style.left
        GM_setValue "#{id}Top",  div.style.top

d = document
g = null #globals

$ = (selector, root) ->
    root or= d.body
    root.querySelector selector
$$ = (selector, root) ->
    root or= d.body
    result = root.querySelectorAll selector
    #magic that turns the results object into an array:
    node for node in result
addTo = (parent, children...) ->
    for child in children
      parent.appendChild child
getConfig = (name) ->
    GM_getValue name, config[name][0]
getTime = ->
    Math.floor(new Date().getTime() / 1000)
hide = (el) ->
    el.style.display = 'none'
inAfter = (root, el) ->
    root.parentNode.insertBefore el, root.nextSibling
inBefore = (root, el) ->
    root.parentNode.insertBefore el, root
m = (el, props) -> #mod
    if l = props.listener
        delete props.listener
        [event, funk] = l
        el.addEventListener event, funk, true
    (el[key] = val) for key, val of props
    el
n = (tag, props) -> #new
    el = d.createElement tag
    if props then m el, props
    el
remove = (el) ->
    el.parentNode.removeChild el
replace = (root, el) ->
    root.parentNode.replaceChild el, root
show = (el) ->
    el.style.display = ''
slice = (arr, id) ->
    # the while loop is the only low-level loop left in coffeescript.
    # we need to use it to see the index.
    # would it be better to just use objects and the `delete` keyword?
    i = 0
    l = arr.length
    while (i < l)
        if id == arr[i].id
            arr.splice i, 1
            return arr
        i++
tn = (s) ->
    d.createTextNode s
x = (path, root) ->
    root or= d.body
    d.evaluate(path, root, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).
        singleNodeValue
zeroPad = (n) ->
    if n < 10 then '0' + n else n

#funks
autohide = ->
    qr = $ '#qr'
    klass = qr.className
    if klass.indexOf('auto') is -1
        klass += ' auto'
    else
        klass = klass.replace(' auto', '')
    qr.className = klass

autoWatch = ->
    #TODO look for subject
    autoText = $('textarea', this).value.slice(0, 25)
    GM_setValue('autoText', "/#{g.BOARD}/ - #{autoText}")

closeQR = ->
    div = @parentNode.parentNode
    remove div

clearHidden = ->
    #'hidden' might be misleading; it's the number of IDs we're *looking* for,
    # not the number of posts actually hidden on the page.
    GM_deleteValue("hiddenReplies/#{g.BOARD}/")
    GM_deleteValue("hiddenThreads/#{g.BOARD}/")
    @value = "hidden: 0"
    g.hiddenReplies = []
    g.hiddenThreads = []

cooldown = ->
    submit = $ '#qr input[type=submit]'
    seconds = parseInt submit.value
    if seconds == 0
        submit.disabled = false
        submit.value = 'Submit'
        auto = submit.previousSibling.lastChild
        if auto.checked
            $('#qr form').submit()
            #submit.click() doesn't work
    else
        submit.value = seconds - 1
        window.setTimeout cooldown, 1000

editSauce = ->
    ta = $ '#options textarea'
    if ta.style.display then show ta else hide ta

expandComment = (e) ->
    e.preventDefault()
    a = this
    href = a.getAttribute('href')
    r = new XMLHttpRequest()
    r.onload = ->
        onloadComment(@responseText, a, href)
    r.open('GET', href, true)
    r.send()
    g.xhrs.push {
        r: r,
        id: href.match(/\d+/)[0]
    }

expandThread = ->
    id = x('preceding-sibling::input[1]', this).name
    span = this
    #close expanded thread
    if span.textContent[0] is '-'
        #goddamit moot
        num = if board is 'b' then 3 else 5
        table = x "following::br[@clear][1]/preceding::table[#{num}]", span
        while (prev = table.previousSibling) and (prev.nodeName is 'TABLE')
            remove prev
        span.textContent = span.textContent.replace '-', '+'
        return
    span.textContent = span.textContent.replace '+', 'X Loading...'
    #load cache
    for xhr in g.xhrs
        if xhr.id == id
            #why can't we just xhr.r.onload()?
            onloadThread xhr.r.responseText, span
            return
    #create new request
    r = new XMLHttpRequest()
    r.onload = ->
        onloadThread @responseText, span
    r.open 'GET', "res/#{id}", true
    r.send()
    g.xhrs.push {
        r: r,
        id: id
    }

getThread = ->
    threads = $$ 'div.thread'
    for thread, i in threads
        bottom = thread.getBoundingClientRect().bottom
        if bottom > 0 #we have not scrolled past
            return [thread, i]

formSubmit = (e) ->
    if span = @nextSibling
        remove span
    recaptcha = $('input[name=recaptcha_response_field]', this)
    if recaptcha.value
        $('#qr input[title=autohide]:not(:checked)')?.click()
    else
        e.preventDefault()
        span = n 'span',
            className: 'error'
            textContent: 'You forgot to type in the verification.'
        addTo @parentNode, span
        alert 'You forgot to type in the verification.'
        recaptcha.focus()

hideReply = (reply) ->
    if p = @parentNode
        reply = p.nextSibling
        g.hiddenReplies.push {
            id: reply.id
            timestamp: getTime()
        }
        GM_setValue("hiddenReplies/#{g.BOARD}/", JSON.stringify(g.hiddenReplies))
    name = $('span.commentpostername', reply).textContent
    trip = $('span.postertrip', reply)?.textContent or ''
    table = x 'ancestor::table', reply
    hide table
    if getConfig 'Show Stubs'
        a = n 'a',
            textContent: "[ + ] #{name} #{trip}"
            className: 'pointer'
            listener: ['click', showReply]
        div = n 'div'
        addTo div, a
        inBefore table, div

hideThread = (div) ->
    if p = @parentNode
        div = p
        g.hiddenThreads.push {
            id: div.id
            timestamp: getTime()
        }
        GM_setValue("hiddenThreads/#{g.BOARD}/", JSON.stringify(g.hiddenThreads))
    hide div
    if getConfig 'Show Stubs'
        if span = $ '.omittedposts', div
            num = Number(span.textContent.match(/\d+/)[0])
        else
            num = 0
        num += $$('table', div).length
        text = if num is 1 then "1 reply" else "#{num} replies"
        name = $('span.postername', div).textContent
        trip = $('span.postername + span.postertrip', div)?.textContent || ''
        a = n 'a',
            textContent: "[ + ] #{name}#{trip} (#{text})"
            className: 'pointer'
            listener: ['click', showThread]
        inBefore div, a

iframeLoad = ->
    if g.iframe = !g.iframe
        return
    $('iframe').src = 'about:blank'
    qr = $ '#qr'
    if error = GM_getValue 'error'
        span = n 'span',
            textContent: error
            className: 'error'
        addTo qr, span
        $('input[title=autohide]:checked', qr)?.click()
    else if g.REPLY and getConfig 'Persistent QR'
        $('textarea', qr).value = ''
        $('input[name=recaptcha_response_field]', qr).value = ''
        submit = $ 'input[type=submit]', qr
        submit.value = 30
        submit.disabled = true
        window.setTimeout cooldown, 1000
        auto = submit.previousSibling.lastChild
        if auto.checked
            #unhide the qr so you know it's ready for the next item
            $('input[title=autohide]:checked', qr)?.click()
    else
        remove qr
    recaptchaReload()

imageClick = (e) ->
    return if e.shiftKey or e.altKey or e.ctrlKey
    e.preventDefault()
    imageToggle this

imageToggle = (image) ->
    # 'image' is actually the <a> container
    thumb = image.firstChild
    if thumb.className is 'hide'
        imageThumb thumb
    else
        imageFull thumb

imageExpandClick = ->
    thumbs = $$ 'img[md5]'
    g.expand = @checked
    if @checked #expand
        for thumb in thumbs
            if thumb.className isnt 'hide'
                #we want the thumbs hidden - we want full sized images
                imageFull thumb
    else #contract
        for thumb in thumbs
            if thumb.className is 'hide'
                #we want thumbs shown
                imageThumb thumb

imageFull = (thumb) ->
    # show full size image, hide thumb
    thumb.className = 'hide'
    link = thumb.parentNode
    img = n 'img',
        src: link.href
    link.appendChild img

imageThumb = (thumb) ->
    #thumbify the image - show thumb, remove full sized image
    thumb.className = ''
    remove thumb.nextSibling

keydown = (e) ->
    kc = e.keyCode
    g.keyCode = kc
    g.char = String.fromCharCode kc

keypress = (e) ->
    if document.activeElement.nodeName in ['TEXTAREA', 'INPUT']
        keyModeInsert e
    else
        keyModeNormal e

keyModeInsert = (e) ->
    kc = g.keyCode
    char = g.char
    if kc is 27 #escape
        remove $ '#qr'
        e.preventDefault()
    else if e.ctrlKey and char is "S"
        ta = document.activeElement
        return unless ta.nodeName is 'TEXTAREA'

        value    = ta.value
        selStart = ta.selectionStart
        selEnd   = ta.selectionEnd

        valStart = value[0...selStart] + '[spoiler]'
        valMid   = value[selStart...selEnd]
        valEnd   = '[/spoiler]' + value[selEnd..]

        ta.value = valStart + valMid + valEnd
        range = valStart.length + valMid.length
        ta.setSelectionRange range, range
        e.preventDefault()

keyModeNormal = (e) ->
    return if e.ctrlKey or e.altKey
    char = g.char
    hash = location.hash
    count = g.count
    if char in '1234567890'
        temp = Number char
        if temp is 0 and count is 0 # special - immediately go to page 0
            location.pathname = "/#{g.BOARD}"
        else
            g.count = (count * 10) + temp
        return
    g.count = 0
    if char is "G"
        if count
            temp = if count > 15 then 15 else count
            location.pathname = "/#{g.BOARD}/#{temp}#1"
        else
            if e.shiftKey
                window.scrollTo 0, 99999
            else
                window.scrollTo 0, 0
                location.hash = ''
    count or= 1
    switch char
        when "H"
            if e.shiftKey
                unless g.REPLY
                    temp = g.PAGENUM - count
                    if temp < 0 then temp = 0
                    location.pathname = "/#{g.BOARD}/#{temp}#1"
            else
                window.scrollBy -20 * count, 0
        when "I"
            if g.REPLY
                unless qrLink = $ 'td.replyhl span[id] a:not(:first-child)'
                    qrLink = $ "span[id^=nothread] a:not(:first-child)"
            else
                [thread] = getThread()
                unless qrLink = $ 'td.replyhl span[id] a:not(:first-child)', thread
                    qrLink = $ "span#nothread#{thread.id} a:not(:first-child)", thread
            if e.shiftKey
                quickReply qrLink
            else
                quickReply qrLink, qrText qrLink
        when "J"
            if e.shiftKey
                if not g.REPLY then [root] = getThread()
                if td = $ 'td.replyhl', root
                    td.className = 'reply'
                    rect = td.getBoundingClientRect()
                    if rect.top > 0 and rect.bottom < d.body.clientHeight #you're visible
                        next = x 'following::td[@class="reply"]', td
                        rect = next.getBoundingClientRect()
                        if rect.top > 0 and rect.bottom < d.body.clientHeight #and so is the next
                            next.className = 'replyhl'
                        return
                replies = $$ 'td.reply', root
                for reply in replies
                    top = reply.getBoundingClientRect().top
                    if top > 0
                        reply.className = 'replyhl'
                        break
            else
                window.scrollBy 0,  20 * count
        when "K"
            if e.shiftKey
                if not g.REPLY then [root] = getThread()
                if td = $ 'td.replyhl', root
                    td.className = 'reply'
                    rect = td.getBoundingClientRect()
                    if rect.top > 0 and rect.bottom < d.body.clientHeight #you're visible
                        prev = x 'preceding::td[@class="reply"][1]', td
                        rect = prev.getBoundingClientRect()
                        if rect.top > 0 and rect.bottom < d.body.clientHeight #and so is the prev
                            prev.className = 'replyhl'
                        return
                replies = $$ 'td.reply', root
                replies.reverse()
                height = d.body.clientHeight
                for reply in replies
                    bot = reply.getBoundingClientRect().bottom
                    if bot < height
                        reply.className = 'replyhl'
                        break
            else
                window.scrollBy 0, -20 * count
        when "L"
            if e.shiftKey
                unless g.REPLY
                    temp = g.PAGENUM + count
                    if temp > 15 then temp = 15
                    location.pathname = "/#{g.BOARD}/#{temp}#0"
            else
                window.scrollBy 20 * count, 0
        when "M"
            if e.shiftKey
                $("#imageExpand").click()
            else
                if not g.REPLY then [root] = getThread()
                unless image = $ 'td.replyhl span.filesize ~ a[target]', root
                    image = $ 'span.filesize ~ a[target]', root
                imageToggle image
        when "N"
            sign = if e.shiftKey then -1 else 1
            scrollThread sign * count
        when "O"
            href = $("#{hash} ~ span[id] a:last-of-type").href
            if e.shiftKey
                location.href = href
            else
                GM_openInTab href
        when "W"
            root = if g.REPLY then null else getThread()[0]
            watchButton = $ "span.filesize ~ img", root
            watch.call watchButton

nodeInserted = (e) ->
    target = e.target
    if target.nodeName is 'TABLE'
        for callback in g.callbacks
            callback target
    else if target.id is 'recaptcha_challenge_field' and qr = $ '#qr'
        $('#recaptcha_image img', qr).src = "http://www.google.com/recaptcha/api/image?c=" + target.value
        $('#recaptcha_challenge_field', qr).value = target.value

onloadComment = (responseText, a, href) ->
    [_, op, id] = href.match /(\d+)#(\d+)/
    [replies, opbq] = parseResponse responseText
    if id is op
        html = opbq.innerHTML
    else
        #css selectors don't like ids starting with numbers,
        # getElementById only works for root document.
        for reply in replies
            if reply.id == id
                html = $('blockquote', reply).innerHTML
    bq = x 'ancestor::blockquote', a
    bq.innerHTML = html

onloadThread = (responseText, span) ->
    [replies, opbq] = parseResponse responseText
    span.textContent = span.textContent.replace 'X Loading...', '- '
    #make sure all comments are fully expanded
    span.previousSibling.innerHTML = opbq.innerHTML
    while (next = span.nextSibling) and not next.clear#<br clear>
        remove next
    if next
        for reply in replies
            inBefore next, x('ancestor::table', reply)
    else#threading
        div = span.parentNode
        for reply in replies
            addTo div, x 'ancestor::table', reply

options = ->
    if div = $ '#options'
        remove div
    else
        div = AEOS.makeDialog 'options', 'center'
        hiddenNum = g.hiddenReplies.length + g.hiddenThreads.length
        html = '<div class="move">Options <a class=pointer>X</a></div><div>'
        for option, value of config
            description  = value[1]
            checked = if getConfig option then "checked" else ""
            html += "<label title=\"#{description}\">#{option}<input #{checked} name=\"#{option}\" type=\"checkbox\"></label><br>"
        html += "<div><a class=sauce>Flavors</a></div>"
        html += "<div><textarea cols=50 rows=4 style=\"display: none;\"></textarea></div>"
        html += "<input type=\"button\" value=\"hidden: #{hiddenNum}\"><br>"
        div.innerHTML = html
        $('div.move', div).addEventListener 'mousedown', AEOS.move, true
        $('a.pointer', div).addEventListener 'click', optionsClose, true
        $('a.sauce', div).addEventListener 'click', editSauce, true
        $('textarea', div).value = GM_getValue 'flavors', g.flavors
        $('input[type="button"]', div).addEventListener 'click', clearHidden, true
        addTo d.body, div

optionsClose = ->
    div = @parentNode.parentNode
    inputs = $$ 'input', div
    for input in inputs
        GM_setValue(input.name, input.checked)
    GM_setValue 'flavors', $('textarea', div).value
    remove div

parseResponse = (responseText) ->
    body = n 'body',
        innerHTML: responseText
    replies = $$ 'td.reply', body
    opbq = $ 'blockquote', body
    return [replies, opbq]

qrListener = (e) ->
    e.preventDefault()
    link = e.target
    text = qrText link
    quickReply link, text

qrText = (link) ->
    #we can't just use textContent b/c of the xxxs. goddamit moot.
    text = '>>' + link.parentNode.id.match(/\d+$/)[0] + '\n'

    selection = window.getSelection()
    id = x('preceding::span[@id][1]', selection.anchorNode)?.id
    text += selection.toString() if id is link.parentNode.id

    text

quickReply = (link, text) ->
    unless qr = $ '#qr'
        #make quick reply dialog
        qr = AEOS.makeDialog 'qr', 'topleft'
        titlebar = n 'div',
            innerHTML: 'Quick Reply '
            className: 'move'
            listener: ['mousedown', AEOS.move]
        addTo qr, titlebar
        autohideB = n 'input',
            type: 'checkbox'
            className: 'pointer'
            title: 'autohide'
            listener: ['click', autohide]
        closeB = n 'a',
            textContent: 'X'
            className: 'pointer'
            title: 'close'
            listener: ['click', closeQR]
        addTo titlebar, autohideB, tn(' '), closeB
        form = $ 'form[name=post]'
        clone = form.cloneNode true
        #remove recaptcha scripts
        for script in $$ 'script', clone
            remove script
        m $('input[name=recaptcha_response_field]', clone),
            listener: ['keydown', recaptchaListener]
        m clone,
            listener: ['submit', formSubmit]
            target: 'iframe'
        if not g.REPLY
            #figure out which thread we're replying to
            xpath = 'preceding::span[@class="postername"][1]/preceding::input[1]'
            input = n 'input',
                type: 'hidden'
                name: 'resto'
                value: x(xpath, link).name
            addTo clone, input
        else if getConfig 'Persistent QR'
            submit = $ 'input[type=submit]', clone
            auto = n 'label',
                textContent: 'Auto'
            autoBox = n 'input',
                type: 'checkbox'
            addTo auto, autoBox
            inBefore submit, auto
        addTo qr, clone
        addTo d.body, qr

    $('input[title=autohide]:checked', qr)?.click()
    textarea = $('textarea', qr)
    textarea.focus()
    if text then textarea.value += text

recaptchaListener = (e) ->
    if e.keyCode is 8 and @value is ''
        recaptchaReload()

recaptchaReload = ->
    window.location = 'javascript:Recaptcha.reload()'

redirect = ->
    switch g.BOARD
        when 'a', 'g', 'lit', 'sci', 'tv'
            url = "http://green-oval.net/cgi-board.pl/#{g.BOARD}/thread/#{g.THREAD_ID}"
        when 'cgl', 'jp', 'm', 'tg'
            url = "http://archive.easymodo.net/cgi-board.pl/#{g.BOARD}/thread/#{g.THREAD_ID}"
        when '3', 'adv', 'an', 'c', 'ck', 'co', 'fa', 'fit', 'int', 'k', 'mu', 'n', 'new', 'o', 'p', 'po', 'sp', 'toy', 'trv', 'v', 'vp', 'x'
            url = "http://173.74.0.45/archive/#{g.BOARD}/thread/#{g.THREAD_ID}"
        else
            url = "http://boards.4chan.org/#{g.BOARD}"
    location.href = url

replyNav = ->
    if g.REPLY
        window.location = if @textContent is '▲' then '#navtop' else '#navbot'
    else
        direction = if @textContent is '▲' then 'preceding' else 'following'
        op = x("#{direction}::span[starts-with(@id, 'nothread')][1]", this).id
        window.location = "##{op}"

report = ->
    input = x('preceding-sibling::input[1]', this)
    input.click()
    $('input[value="Report"]').click()
    input.click()

scrollThread = (count) ->
    [thread, idx] = getThread()
    top = thread.getBoundingClientRect().top
    if idx is 0 and top > 1
        #we haven't scrolled to the first thread
        idx = -1
    if count < 0 and top < -1
        #we've started scrolling past this thread,
        # but now want to read from the beginning
        count++
    temp = idx + count
    if temp < 0
        hash = ''
    else if temp > 9
        hash = 'p9'
    else
        hash = "p#{temp}"
    location.hash = hash

showReply = ->
    div = @parentNode
    table = div.nextSibling
    show(table)
    remove(div)
    id = $('td.reply, td.replyhl', table).id
    slice(g.hiddenReplies, id)
    GM_setValue("hiddenReplies/#{g.BOARD}/", JSON.stringify(g.hiddenReplies))

showThread = ->
    div = @nextSibling
    show div
    hide this
    id = div.id
    slice g.hiddenThreads, id
    GM_setValue("hiddenThreads/#{g.BOARD}/", JSON.stringify(g.hiddenThreads))

stopPropagation = (e) ->
    e.stopPropagation()

threadF = (current) ->
    div = n 'div',
        className: 'thread'
    a = n 'a',
        textContent: '[ - ]'
        className: 'pointer'
        listener: ['click', hideThread]
    addTo div, a
    inBefore current, div
    while (!current.clear)#<br clear>
        addTo div, current
        current = div.nextSibling
    addTo div, current
    current = div.nextSibling
    id = $('input[value="delete"]', div).name
    div.id = id
    #check if we should hide the thread
    for hidden in g.hiddenThreads
        if id == hidden.id
            hideThread(div)
    current = current.nextSibling.nextSibling
    if current.nodeName isnt 'CENTER'
        threadF(current)

request = (url, callback) ->
    r = new XMLHttpRequest()
    r.onload = callback
    r.open 'get', url, true
    r.send()
    r

updateCallback = ->
    count = $ '#updater #count'
    timer = $ '#updater #timer'
    if @status is 404
        count.textContent = 404
        count.className = 'error'
        timer.textContent = ''
        clearInterval g.interval
        for input in $$ 'input[type=submit]'
            input.disabled = true
            input.value = 404
        s = ''
        if getConfig 'Unread Count' then s += "(#{g.replies.length}) "
        s += "/#{g.BOARD}/ - 404"
        document.title = s
        g.dead = true
        updateFavicon()
        return
    body = n 'body', innerHTML: @responseText
    replies = $$ 'td.reply', body

    root = $('br[clear]').previousElementSibling
    if reply = $ 'td.reply, td.replyhl', root
        id = Number reply.id
    else
        id = 0
    i = 0

    while (reply = replies.pop()) and (Number reply.id > id)
        table = x 'ancestor::table', reply
        inAfter root, table
        ++i

    count.textContent = "+#{i}"
    count.className = if i is 0 then '' else 'new'

    timer.textContent = -1 * GM_getValue 'Interval', 10

updateFavicon = ->
    len = g.replies.length
    if g.dead
        if len > 0
            href = g.favDeadHalo
        else
            href = g.favDead
    else
        if len > 0
            href = g.favHalo
        else
            href = g.favDefault
    favicon = $ 'link[rel="shortcut icon"]', d
    clone = favicon.cloneNode true
    clone.href = href
    replace favicon, clone

updateTime = ->
    span = $ '#updater #timer'
    time = Number span.textContent
    if ++time is 0
        updateNow()
    else if time > 10
        time = 0
        g.req.abort()
        updateNow()
    span.textContent = time

updateTitle = ->
    len = g.replies.length
    document.title = document.title.replace /\d+/, len
    updateFavicon()

updateAuto = ->
    span = $ '#updater #timer'
    if @checked
        span.textContent = -1 * GM_getValue 'Interval', 10
        g.interval = window.setInterval updateTime, 1000
    else
        span.textContent = ''
        clearInterval g.interval

updateInterval = ->
    unless n = Number @value
        n = 10
    @value = n
    GM_setValue 'Interval', n

    span = $ '#updater #timer'
    if 0 > Number span.textContent
        span.textContent = -1 * n

updateNow = ->
    g.req = request location.href, updateCallback

updaterMake = ->
    div = AEOS.makeDialog 'updater', 'topright'
    html  = "<div class=move><span id=count></span> <span id=timer>Thread Updater</span></div>"
    html += "<div><label>Auto Update<input type=checkbox name=auto></label></div>"
    html += "<div><label>Interval (s)<input type=text name=interval></label></div>"
    html += "<div><input type=button value='Update Now'></div>"
    div.innerHTML = html

    $('div.move', div).addEventListener 'mousedown', AEOS.move, true
    auto = $ 'input[name=auto]', div
    auto.addEventListener 'click', updateAuto, true
    interval = $ 'input[name=interval]', div
    interval.value = GM_getValue 'Interval', 10
    interval.addEventListener 'change', updateInterval, true
    $('input[type=button]', div).addEventListener 'click', updateNow, true
    document.body.appendChild div
    if getConfig 'Auto Update' then auto.click()

watch = ->
    id = @nextSibling.name
    if @src is g.favEmpty
        @src = g.favDefault
        text = "/#{g.BOARD}/ - " +
            x('following-sibling::blockquote', this).textContent.slice(0,25)
        g.watched[g.BOARD] or= []
        g.watched[g.BOARD].push {
            id: id,
            text: text
        }
    else
        @src = g.favEmpty
        g.watched[g.BOARD] = slice(g.watched[g.BOARD], id)
    GM_setValue('watched', JSON.stringify(g.watched))
    watcherUpdate()

watcherUpdate = ->
    div = n 'div'
    for board of g.watched
        for thread in g.watched[board]
            a = n 'a',
                textContent: 'X'
                className: 'pointer'
                listener: ['click', watchX]
            link = n 'a',
                textContent: thread.text
                href: "/#{board}/res/#{thread.id}"
            addTo div, a, tn(' '), link, n('br')
    old = $('#watcher div:last-child')
    replace(old, div)

watchX = ->
    [board, _, id] = @nextElementSibling.
        getAttribute('href').substring(1).split('/')
    g.watched[board] = slice(g.watched[board], id)
    GM_setValue('watched', JSON.stringify(g.watched))
    watcherUpdate()
    if input = $("input[name=\"#{id}\"]")
        favicon = input.previousSibling
        favicon.src = g.favEmpty

#main
AEOS.init()
g =
    callbacks: []
    count: 0
    expand: false
    favDead: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEUAAAAAAAD/AAA9+90tAAAAAXRSTlMAQObYZgAAADtJREFUCB0FwUERxEAIALDszMG730PNSkBEBSECoU0AEPe0mly5NWprRUcDQAdn68qtkVsj3/84z++CD5u7CsnoBJoaAAAAAElFTkSuQmCC'
    favDeadHalo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAWUlEQVR4XrWSAQoAIAgD/f+njSApsTqjGoTQ5oGWPJMOOs60CzsWwIwz1I4PUIYh+WYEMGQ6I/txw91kP4oA9BdwhKp1My4xQq6e8Q9ANgDJjOErewFiNesV2uGSfGv1/HYAAAAASUVORK5CYII='
    favDefault: $('link[rel="shortcut icon"]', d)?.href or '' #no favicon in `post successful` page
    favEmpty: 'http://static.4chan.org/image/favicon-dis.ico'
    flavors: [
        'http://regex.info/exif.cgi?url='
        'http://iqdb.org/?url='
        'http://saucenao.com/search.php?db=999&url='
        'http://tineye.com/search?url='
    ].join '\n'
    iframe: false
    watched: JSON.parse(GM_getValue('watched', '{}'))
    xhrs: []
g.favHalo = if /ws/.test g.favDefault then 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAZklEQVR4XrWRQQoAIQwD+6L97j7Ih9WTQQxhDqJQCk4Mranuvqod6LgwawSqSuUmWSPw/UNlJlnDAmA2ARjABLYj8ZyCzJHHqOg+GdAKZmKPIQUzuYrxicHqEgHzP9g7M0+hj45sAnRWxtPj3zSPAAAAAElFTkSuQmCC' else 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEUAAABmzDP///8AAABet0i+AAAAAXRSTlMAQObYZgAAAExJREFUeF4tyrENgDAMAMFXKuQswQLBG3mOlBnFS1gwDfIYLpEivvjq2MlqjmYvYg5jWEzCwtDSQlwcXKCVLrpFbvLvvSf9uZJ2HusDtJAY7Tkn1oYAAAAASUVORK5CYII='
pathname = location.pathname.substring(1).split('/')
[g.BOARD, temp] = pathname
if temp is 'res'
    g.REPLY = temp
    g.THREAD_ID = pathname[2]
else
    g.PAGENUM = parseInt(temp) || 0
g.hiddenThreads = JSON.parse(GM_getValue("hiddenThreads/#{g.BOARD}/", '[]'))
g.hiddenReplies = JSON.parse(GM_getValue("hiddenReplies/#{g.BOARD}/", '[]'))
tzOffset = (new Date()).getTimezoneOffset() / 60
# GMT -8 is given as +480; would GMT +8 be -480 ?
g.chanOffset = 5 - tzOffset# 4chan = EST = GMT -5

if location.hostname.split('.')[0] is 'sys'
    if recaptcha = $ '#recaptcha_response_field'
        m recaptcha, listener: ['keydown', recaptchaListener]
    else if b = $ 'table font b'
        GM_setValue 'error', b.firstChild.textContent
    else
        GM_setValue 'error', ''
        if getConfig 'Auto Watch'
            html = $('b').innerHTML
            [_, thread, id] = html.match(/<!-- thread:(\d+),no:(\d+) -->/)
            if thread is '0'
                board = $('meta', d).content.match(/4chan.org\/(\w+)\//)[1]
                g.watched[board] or= []
                g.watched[board].push {
                    id: id,
                    text: GM_getValue 'autoText'
                }
                GM_setValue 'watched', JSON.stringify g.watched
    return

lastChecked = GM_getValue('lastChecked', 0)
now = getTime()
DAY = 24 * 60 * 60
if lastChecked < now - 1*DAY
    cutoff = now - 7*DAY
    while g.hiddenThreads.length
        if g.hiddenThreads[0].timestamp > cutoff
            break
        g.hiddenThreads.shift()

    while g.hiddenReplies.length
        if g.hiddenReplies[0].timestamp > cutoff
            break
        g.hiddenReplies.shift()

    GM_setValue("hiddenThreads/#{g.BOARD}/", JSON.stringify(g.hiddenThreads))
    GM_setValue("hiddenReplies/#{g.BOARD}/", JSON.stringify(g.hiddenReplies))
    GM_setValue('lastChecked', now)

GM_addStyle '
    #updater {
        position: fixed;
        text-align: right;
    }
    #updater input[type=text] {
        width: 50px;
    }
    #updater:not(:hover) {
        border: none;
        background: transparent;
    }
    #updater:not(:hover) > div:not(.move) {
        display: none;
    }
    #watcher {
        position: absolute;
    }
    #watcher > div.move {
        text-decoration: underline;
        padding: 5px 5px 0 5px;
    }
    #watcher > div:last-child {
        padding: 0 5px 5px 5px;
    }
    span.error {
        color: red;
    }
    #qr.auto:not(:hover) form {
        visibility: collapse;
    }
    #qr span.error {
        position: absolute;
        bottom: 0;
        left: 0;
    }
    #qr {
        position: fixed;
    }
    #qr > div {
        text-align: right;
    }
    #qr > form > div, /* ad */
    #qr td.rules {
        display: none;
    }
    #options {
        position: fixed;
        padding: 5px;
        text-align: right;
    }
    form[name=delform] a img {
        border: 0px;
        float: left;
        margin: 0px 20px;
    }
    span.navlinks {
        position: absolute;
        right: 5px;
    }
    span.navlinks > a {
        font-size: 16px;
        text-decoration: none;
    }
    .hide {
        display: none;
    }
    .new {
        background: lime;
    }
'

if navtopr = $ '#navtopr a'
    text = navtopr.nextSibling #css doesn't see text nodes
    a = n 'a',
        textContent: 'X'
        className: 'pointer'
        listener: ['click', options]
    inBefore text, tn(' / ')
    inBefore text, a
    navbotr = $ '#navbotr a'
    text = navbotr.nextSibling
    a = n 'a',
        textContent: 'X'
        className: 'pointer'
        listener: ['click', options]
    inBefore text, tn(' / ')
    inBefore text, a
else if getConfig('404 Redirect') and d.title is '4chan - 404'
    redirect()
else
    return

#hack to tab from comment straight to recaptcha
for el in $$ '#recaptcha_table a'
    el.tabIndex = 1
recaptcha = $ '#recaptcha_response_field'
recaptcha.addEventListener('keydown', recaptchaListener, true)

scroll = ->
    height = document.body.clientHeight
    while reply = g.replies[0]
        bottom = reply.getBoundingClientRect().bottom
        if bottom > height #post is not completely read
            break
        g.replies.shift()
    updateTitle()

#major features
if getConfig 'Restore IDs'
    g.callbacks.push (root) ->
        quotes = $$ 'a.quotejs:not(:first-child)', root
        for quote in quotes
            quote.textContent = quote.parentNode.id.match(/\d+$/)[0]

if getConfig 'Image Expansion'
    delform = $ 'form[name=delform]'
    expand = n 'div',
        innerHTML: "<label>Expand Images<input type=checkbox id=imageExpand></label>"
    $("input", expand).addEventListener 'click', imageExpandClick, true
    inBefore delform.firstChild, expand

    g.callbacks.push (root) ->
        thumbs = $$ 'img[md5]', root
        for thumb in thumbs
            thumb.parentNode.addEventListener 'click', imageClick, true
            if g.expand then imageFull thumb

if getConfig 'Localize Time'
    g.callbacks.push (root) ->
        spans = $$ 'span[id^=no]', root
        for span in spans
            s = span.previousSibling
            [_, month, day, year, hour, min_sec] =
                s.textContent.match /(\d+)\/(\d+)\/(\d+)\(\w+\)(\d+):(\S+)/
            year = "20#{year}"
            month -= 1 #months start at 0
            hour = g.chanOffset + Number hour
            date = new Date year, month, day, hour
            year = date.getFullYear() - 2000
            month = zeroPad date.getMonth() + 1
            day = zeroPad date.getDate()
            hour = zeroPad date.getHours()
            dotw = [
                'Sun'
                'Mon'
                'Tue'
                'Wed'
                'Thu'
                'Fri'
                'Sat'
            ][date.getDay()]
            s.textContent = " #{month}/#{day}/#{year}(#{dotw})#{hour}:#{min_sec} "

if getConfig 'Sauce'
    g.callbacks.push (root) ->
        spans = $$ 'span.filesize', root
        prefixes = GM_getValue('flavors', g.flavors).split '\n'
        names = (prefix.match(/(\w+)\./)[1] for prefix in prefixes)
        for span in spans
            suffix = $('a', span).href
            i = 0; l = names.length
            while i < l
                link = n 'a',
                    textContent: names[i]
                    href: prefixes[i] + suffix
                addTo span, tn(' '), link
                i++

if getConfig 'Reply Hiding'
    g.callbacks.push (root) ->
        tds = $$('td.doubledash', root)
        for td in tds
            a = n 'a',
                textContent: '[ - ]'
                className: 'pointer'
                listener: ['click', hideReply]
            replace(td.firstChild, a)

            next = td.nextSibling
            id = next.id
            for obj in g.hiddenReplies
                if obj.id is id
                    hideReply(next)

if getConfig 'Quick Reply'
    iframe = n 'iframe',
        name: 'iframe'
        listener: ['load', iframeLoad]
    hide(iframe)
    addTo d.body, iframe

    g.callbacks.push (root) ->
        quotes = $$('a.quotejs:not(:first-child)', root)
        for quote in quotes
            quote.addEventListener('click', qrListener, true)

    #hack - nuke id so it doesn't grab focus when reloading
    recaptcha.id = ''


if getConfig 'Quick Report'
    g.callbacks.push (root) ->
        arr = $$('span[id^=no]', root)
        for el in arr
            a = n 'a',
                textContent: '[ ! ]'
                className: 'pointer'
                listener: ['click', report]
            inAfter el, a
            inAfter el, tn(' ')

if getConfig 'Thread Watcher'
    #create watcher
    watcher = AEOS.makeDialog 'watcher', 'topleft'
    watcher.innerHTML = '<div class="move">Thread Watcher</div><div></div>'
    $('div', watcher).addEventListener('mousedown', AEOS.move, true)
    addTo d.body, watcher
    watcherUpdate()

    #add buttons
    threads = g.watched[g.BOARD] || []
    #normal, threading
    inputs = $$('form > input[value="delete"], div > input[value="delete"]')
    for input in inputs
        id = input.name
        src = (->
            for thread in threads
                if id is thread.id
                    return g.favDefault
            g.favEmpty
        )()
        img = n 'img',
            src: src
            className: 'pointer'
            listener: ['click', watch]
        inBefore input, img

if getConfig 'Anonymize'
    g.callbacks.push (root) ->
        names = $$('span.postername, span.commentpostername', root)
        for name in names
            name.innerHTML = 'Anonymous'
        trips = $$('span.postertrip', root)
        for trip in trips
            if trip.parentNode.nodeName is 'A'
                remove(trip.parentNode)
            else
                remove(trip)

if getConfig 'Reply Navigation'
    g.callbacks.push (root) ->
        arr = $$('span[id^=norep]', root)
        for el in arr
            span = n 'span'
            up = n 'a',
                textContent: '▲'
                className: 'pointer'
                listener: ['click', replyNav]
            down = n 'a',
                textContent: '▼'
                className: 'pointer'
                listener: ['click', replyNav]
            addTo span, tn(' '), up, tn(' '), down
            inAfter el, span

if getConfig 'Keybinds'
    document.addEventListener 'keydown', keydown, true
    document.addEventListener 'keypress', keypress, true

if g.REPLY
    if getConfig 'Thread Updater'
        updaterMake()
    if getConfig('Quick Reply') and getConfig 'Persistent QR'
        quickReply()
        $('#qr input[title=autohide]').click()
    if getConfig 'Post in Title'
        unless text = $('span.filetitle').textContent
            text = $('blockquote').textContent
        if text
            d.title = "/#{g.BOARD}/ - #{text}"
    if getConfig 'Unread Count'
        g.replies = []
        document.title = '(0) ' + document.title
        document.addEventListener 'scroll', scroll, true
        g.callbacks.push (root) ->
            g.replies = g.replies.concat $$ 'td.reply, td.replyhl', root
            updateTitle()

else #not reply
    if getConfig 'Thread Hiding'
        delform = $('form[name=delform]')
        start = $ 'form[name=delform] > *'
        start = start.nextSibling if getConfig 'Image Expansion' #skip over image expansion dialog
        #don't confuse other scripts
        d.addEventListener('DOMNodeInserted', stopPropagation, true)
        threadF start
        d.removeEventListener('DOMNodeInserted', stopPropagation, true)

    if getConfig 'Auto Watch'
        $('form[name="post"]').addEventListener('submit', autoWatch, true)

    if getConfig 'Thread Navigation'
        arr = $$ 'div > span.filesize, form > span.filesize'
        l1 = arr.length - 1
        for el, i in arr
            span = n 'span',
                className: 'navlinks'
                id: 'p' + i
            if i
                textContent = '▲'
                href = "#p#{i - 1}"
            else if g.PAGENUM
                textContent = '◀'
                href = "#{g.PAGENUM - 1}#p0"
            else
                textContent = '▲'
                href = "#navtop"
            up = n 'a',
                className: 'pointer'
                textContent: textContent
                href: href
            if i < l1
                textContent = '▼'
                href = "#p#{i + 1}"
            else
                textContent = '▶'
                href = "#{g.PAGENUM + 1}#p0"
            down = n 'a',
                className: 'pointer'
                textContent: textContent
                href: href
            addTo span, up, tn(' '), down
            inBefore el, span
        if location.hash is '#p0'
            window.location = window.location

    if getConfig 'Thread Expansion'
        omitted = $$('span.omittedposts')
        for span in omitted
            a = n 'a',
                className: 'pointer omittedposts'
                textContent: "+ #{span.textContent}"
                listener: ['click', expandThread]
            replace(span, a)

    if getConfig 'Comment Expansion'
        as = $$('span.abbr a')
        for a in as
            a.addEventListener('click', expandComment, true)

callback() for callback in g.callbacks
d.body.addEventListener('DOMNodeInserted', nodeInserted, true)
