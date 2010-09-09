#todo: remove close()?, make hiddenReplies/hiddenThreads local, comments, gc
#todo: remove stupid 'obj', arr el, make hidden an object, smarter xhr, text(), @this, images, clear hidden
#todo: watch - add board in updateWatcher?, redundant move divs?, redo css / hiding, manual clear
#todo: hotkeys? navlink at top?
#thread watching doesn't work in opera?

config =
    'Thread Hiding':        true
    'Reply Hiding':         true
    'Show Stubs':           true
    'Thread Navigation':    true
    'Reply Navigation':     true
    'Thread Watcher':       true
    'Thread Expansion':     true
    'Comment Expansion':    true
    'Quick Reply':          true
    'Quick Report':         true
    'Auto Watch':           true
    'Anonymize':            false
getValue = (name) ->
    GM_getValue(name, config[name])
x = (path, root) ->
    root or= document.body
    document.
        evaluate(path, root, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).
        singleNodeValue
$ = (selector, root) ->
    root or= document.body
    root.querySelector(selector)
$$ = (selector, root) ->
    root or= document.body
    result = root.querySelectorAll(selector)
    #magic that turns the results object into an array:
    node for node in result
inBefore = (root, el) ->
    root.parentNode.insertBefore(el, root)
inAfter = (root, el) ->
    root.parentNode.insertBefore(el, root.nextSibling)
tag = (el) ->
    document.createElement(el)
hide = (el) ->
    el.style.display = 'none'
show = (el) ->
    el.style.display = ''
remove = (el) ->
    el.parentNode.removeChild(el)
replace = (root, el) ->
    root.parentNode.replaceChild(el, root)
getTime = ->
    Math.floor(new Date().getTime() / 1000)
n = (tag, props) -> #new
    el = document.createElement tag
    if props then (el[key] = val) for key, val of props
    el
slice = (arr, id) ->
    # the while loop is the only low-level loop left in coffeescript.
    # we need to use it to see the index.
    # would it be better to just use objects and the `delete` keyword?
    i = 0
    l = arr.length
    while (i < l)
        if id == arr[i].id
            arr.splice(i, 1)
            return arr
        i++
position = (el) ->
    id = el.id
    if left = GM_getValue("#{id}Left", '0px')
        el.style.left = left
    else
        el.style.right = '0px'
    if top = GM_getValue("#{id}Top", '0px')
        el.style.top = top
    else
        el.style.bottom = '0px'


# x-browser
if typeof GM_deleteValue == 'undefined'
    this.GM_setValue = (name, value) ->
        value = (typeof value)[0] + value
        localStorage.setItem(name, value)

    this.GM_getValue = (name, defaultValue) ->
        if not value = localStorage.getItem(name)
            return defaultValue
        type = value[0]
        value = value.substring(1)
        switch type
            when 'b'
                return value == 'true'
            when 'n'
                return Number(value)
            else
                return value

    this.GM_addStyle = (css) ->
        style = tag('style')
        style.type = 'text/css'
        style.textContent = css
        $('head', document).appendChild(style)

watched = JSON.parse(GM_getValue('watched', '{}'))
if location.hostname.split('.')[0] is 'sys'
    if b = $('table font b')
        GM_setValue('error', b.firstChild.textContent)
    else
        GM_setValue('error', '')
        if GM_getValue('Auto Watch')
            html = $('b').innerHTML
            [nop, thread, id] = html.match(/<!-- thread:(\d+),no:(\d+) -->/)
            if thread is '0'
                board = $('meta', document).content.match(/4chan.org\/(\w+)\//)[1]
                watched[board] or= []
                watched[board].push({
                    id: id,
                    text: GM_getValue('autoText')
                })
                GM_setValue('watched', JSON.stringify(watched))
    return

[nop, BOARD, magic] = location.pathname.split('/')
if magic is 'res'
    REPLY = magic
else
    PAGENUM = parseInt(magic) || 0
xhrs = []
r = null
iframeLoop = false
move = { }
callbacks = []
#godammit moot
head = $('head', document)
if not favicon = $('link[rel="shortcut icon"]', head)#/f/
    favicon = tag('link')
    favicon.rel = 'shortcut icon'
    favicon.href = 'http://static.4chan.org/image/favicon.ico'
    head.appendChild(favicon)
favNormal = favicon.href
favEmpty = 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP///9vb2////yH5BAEAAAMALAAAAAAQABAAAAIvnI+pq+D9DBAUoFkPFnbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw=='

hiddenThreads = JSON.parse(GM_getValue("hiddenThreads/#{BOARD}/", '[]'))
hiddenReplies = JSON.parse(GM_getValue("hiddenReplies/#{BOARD}/", '[]'))

lastChecked = GM_getValue('lastChecked', 0)
now = getTime()
DAY = 24 * 60 * 60
if lastChecked < now - 1*DAY
    cutoff = now - 7*DAY
    while hiddenThreads.length
        if hiddenThreads[0].timestamp > cutoff
            break
        hiddenThreads.shift()

    while hiddenReplies.length
        if hiddenReplies[0].timestamp > cutoff
            break
        hiddenReplies.shift()

    GM_setValue("hiddenThreads/#{BOARD}/", JSON.stringify(hiddenThreads))
    GM_setValue("hiddenReplies/#{BOARD}/", JSON.stringify(hiddenReplies))
    GM_setValue('lastChecked', now)

GM_addStyle('
    #watcher {
        position: absolute;
        border: 1px solid;
    }
    #watcher div.move {
        text-decoration: underline;
        padding: 5px 5px 0 5px;
    }
    #watcher div:last-child {
        padding: 0 5px 5px 5px;
    }
    span.error {
        color: red;
    }
    #qr span.error {
        position: absolute;
        bottom: 0;
        left: 0;
    }
    #qr {
        position: fixed;
        border: 1px solid;
    }
    #qr > div {
        text-align: right;
    }
    #qr > form > div {/* ad */
        display: none;
    }
    #qr td.rules {
        display: none;
    }
    #options {
        position: fixed;
        border: 1px solid;
        padding: 5px;
        text-align: right;
    }
    span.navlinks {
        position: absolute;
        right: 5px;
    }
    span.navlinks > a {
        font-size: 16px;
        text-decoration: none;
    }
    .move {
        cursor: move;
    }
    .pointer, #options label, #options a {
        cursor: pointer;
    }
')


clearHidden = ->
    #'hidden' might be misleading; it's the number of IDs we're *looking* for,
    # not the number of posts actually hidden on the page.
    GM_deleteValue("hiddenReplies/#{BOARD}/")
    GM_deleteValue("hiddenThreads/#{BOARD}/")
    @value = "hidden: 0"
    hiddenReplies = []
    hiddenThreads = []


options = ->
    #redo this
    if div = $('#options')
        remove(div)
    else
        hiddenNum = hiddenReplies.length + hiddenThreads.length
        div = tag('div')
        div.id = 'options'
        div.className = 'reply'
        position(div)
        html = '<div class="move">4chan X</div><div>'
        for option of config
            checked = if getValue(option) then "checked" else ""
            html += "<label>#{option}<input #{checked} name=\"#{option}\" type=\"checkbox\"></label><br>"
        html += "<input type=\"button\" value=\"hidden: #{hiddenNum}\"><br>"
        html += '<a name="save">save</a> <a name="cancel">cancel</a></div>'
        div.innerHTML = html
        $('div', div).addEventListener('mousedown', mousedown, true)
        $('input[type="button"]', div).addEventListener('click', clearHidden, true)
        $('a[name="save"]', div).addEventListener('click', optionsSave, true)
        $('a[name="cancel"]', div).addEventListener('click', close, true)
        document.body.appendChild(div)


mousedown = (e) ->
    div = this.parentNode
    move.div = div
    move.clientX = e.clientX
    move.clientY = e.clientY
    move.bodyX = document.body.clientWidth
    move.bodyY = document.body.clientHeight

    # check if the string exists. parseInt('0px') is falsey.
    l = div.style.left
    move.divX = if l then parseInt(l) else move.bodyX - div.offsetWidth
    t = div.style.top
    move.divY = if t then parseInt(t) else move.bodyY - div.offsetHeight
    window.addEventListener('mousemove', mousemove, true)
    window.addEventListener('mouseup', mouseup, true)


mousemove = (e) ->
    div = move.div
    realX = move.divX + (e.clientX - move.clientX)# x + dx
    left = if realX < 20 then 0 else realX

    if move.bodyX - div.offsetWidth - realX < 20
        div.style.left = ''
        div.style.right = '0px'
    else
        div.style.left = left + 'px'
        div.style.right = ''

    realY = move.divY + (e.clientY - move.clientY)# y + dy
    top = if realY < 20 then 0 else realY

    if move.bodyY - div.offsetHeight - realY < 20
        div.style.top = ''
        div.style.bottom = '0px'
    else
        div.style.top = top + 'px'
        div.style.bottom = ''


mouseup = ->
    id = move.div.id
    GM_setValue("#{id}Left", move.div.style.left)
    GM_setValue("#{id}Top", move.div.style.top)
    window.removeEventListener('mousemove', mousemove, true)
    window.removeEventListener('mouseup', mouseup, true)


showThread = ->
    div = this.nextSibling
    show(div)
    hide(this)
    id = div.id
    slice(hiddenThreads, id)
    GM_setValue("hiddenThreads/#{BOARD}/", JSON.stringify(hiddenThreads))


hideThread = (div) ->
    if p = this.parentNode
        div = p
        hiddenThreads.push({
            id: div.id
            timestamp: getTime()
        })
        GM_setValue("hiddenThreads/#{BOARD}/", JSON.stringify(hiddenThreads))
    hide(div)
    if getValue('Show Stubs')
        a = tag('a')
        if span = $('.omittedposts', div)
            n = Number(span.textContent.match(/\d+/)[0])
        else
            n = 0
        n += $$('table', div).length
        text = if n is 1 then "1 reply" else "#{n} replies"
        name = $('span.postername', div).textContent
        trip = $('span.postername + span.postertrip', div)?.textContent || ''
        a.textContent = "[ + ] #{name}#{trip} (#{text})"
        a.className = 'pointer'
        a.addEventListener('click', showThread, true)
        inBefore(div, a)


threadF = (current) ->
    div = tag('div')
    div.className = 'thread'
    a = tag('a')
    a.textContent = '[ - ]'
    a.className = 'pointer'
    a.addEventListener('click', hideThread, true)
    div.appendChild(a)

    inBefore(current, div)
    while (!current.clear)#<br clear>
        div.appendChild(current)
        current = div.nextSibling
    div.appendChild(current)
    current = div.nextSibling

    id = $('input[value="delete"]', div).name
    div.id = id
    #check if we should hide the thread
    for hidden in hiddenThreads
        if id == hidden.id
            hideThread(div)

    current = current.nextSibling.nextSibling
    if current.nodeName isnt 'CENTER'
        threadF(current)


showReply = ->
    div = this.parentNode
    table = div.nextSibling
    show(table)
    remove(div)
    id = $('td.reply, td.replyhl', table).id
    slice(hiddenReplies, id)
    GM_setValue("hiddenReplies/#{BOARD}/", JSON.stringify(hiddenReplies))


hideReply = (reply) ->
    if p = this.parentNode
        reply = p.nextSibling
        hiddenReplies.push({
            id: reply.id
            timestamp: getTime()
        })
        GM_setValue("hiddenReplies/#{BOARD}/", JSON.stringify(hiddenReplies))

    name = $('span.commentpostername', reply).textContent
    trip = $('span.postertrip', reply)?.textContent || ''
    table = x('ancestor::table', reply)
    hide(table)
    if getValue('Show Stubs')
        a = tag('a')
        a.textContent = "[ + ] #{name} #{trip}"
        a.className = 'pointer'
        a.addEventListener('click', showReply, true)
        div = tag('div')
        div.appendChild(a)
        inBefore(table, div)


optionsSave = ->
    div = this.parentNode.parentNode
    inputs = $$('input', div)
    for input in inputs
        GM_setValue(input.name, input.checked)
    remove(div)


close = ->
    div = this.parentNode.parentNode
    remove(div)


iframeLoad = ->
    if iframeLoop = !iframeLoop
        return
    $('iframe').src = 'about:blank'

    qr = $('#qr')
    if error = GM_getValue('error')
        $('form', qr).style.visibility = ''
        span = tag('span')
        span.textContent = error
        span.className = 'error'
        qr.appendChild(span)
        if error is 'You seem to have mistyped the verification.'
            window.location = 'javascript:Recaptcha.reload()'
    else
        remove(qr)
        window.location = 'javascript:Recaptcha.reload()'


submit = (e) ->
    if span = @nextSibling
        remove(span)
    recaptcha = $('#recaptcha_response_field', this)
    if not recaptcha.value
        e.preventDefault()
        span = n 'span', {
            className: 'error'
            textContent: 'You forgot to type in the verification.'
        }
        @parentNode.appendChild span
        alert 'You forgot to type in the verification.'
        recaptcha.focus()
    else
        @style.visibility = 'collapse'


minimize = ->
    form = this.parentNode.nextSibling
    if form.style.visibility
        form.style.visibility = ''
    else
        form.style.visibility = 'collapse'


quickReply = (e) ->
    e.preventDefault()
    if !qr = $('#qr')
        #make quick reply dialog
        qr = tag('div')
        qr.id = 'qr'
        qr.className = 'reply'
        position(qr)

        div = tag('div')
        div.innerHTML = 'Quick Reply '
        div.className = 'move'
        div.addEventListener('mousedown', mousedown, true)
        qr.appendChild(div)

        minimizeB = n 'a', {
            textContent: '_'
            className: 'pointer'
            title: 'minimize'
        }
        minimizeB.addEventListener('click', minimize, true)
        div.appendChild(minimizeB)
        div.appendChild(document.createTextNode(' '))
        closeB = n 'a', {
            textContent: 'X'
            className: 'pointer'
            title: 'close'
        }
        closeB.addEventListener('click', close, true)
        div.appendChild(closeB)

        form = $ 'form[name=post]'
        clone = form.cloneNode(true)
        #hack - nuke the original recaptcha's id so it doesn't grab focus
        # when reloading
        $('input[name=recaptcha_response_field]', form).id = ''
        #remove recaptcha scripts
        for script in $$ 'script', clone
            remove script
        clone.addEventListener('submit', submit, true)
        clone.target = 'iframe'
        if not REPLY
            xpath = 'preceding::span[@class="postername"][1]/preceding::input[1]'
            input = n 'input', {
                value: x(xpath, this).name
                type: 'hidden'
                name: 'resto'
            }
            clone.appendChild(input)
        qr.appendChild(clone)
        document.body.appendChild(qr)

    selection = window.getSelection()
    id = x('preceding::span[@id][1]', selection.anchorNode)?.id
    text = selection.toString()

    textarea = $('textarea', qr)
    textarea.focus()
    #we can't just use @textContent b/c of the xxxs. goddamit moot.
    textarea.value += '>>' + @parentNode.id.match(/\d+$/)[0] + '\n'
    if text and id is this.parentNode.id
        textarea.value += ">#{text}\n"

watch = ->
    id = this.nextSibling.name
    if this.src[0] is 'd'#data:png
        this.src = favNormal
        text = "/#{BOARD}/ - " +
            x('following-sibling::blockquote', this).textContent.slice(0,25)
        watched[BOARD] or= []
        watched[BOARD].push({
            id: id,
            text: text
        })
    else
        this.src = favEmpty
        watched[BOARD] = slice(watched[BOARD], id)

    GM_setValue('watched', JSON.stringify(watched))
    watcherUpdate()


watchX = ->
    [board, nop, id] =
        this.nextElementSibling.getAttribute('href').substring(1).split('/')
    watched[board] = slice(watched[board], id)
    GM_setValue('watched', JSON.stringify(watched))
    watcherUpdate()
    if input = $("input[name=\"#{id}\"]")
        favicon = input.previousSibling
        favicon.src = favEmpty


watcherUpdate = ->
    div = tag('div')
    for board of watched
        for thread in watched[board]
            a = tag('a')
            a.textContent = 'X'
            a.className = 'pointer'
            a.addEventListener('click', watchX, true)
            div.appendChild(a)
            div.appendChild(document.createTextNode(' '))
            link = tag('a')
            link.textContent = thread.text
            link.href = "/#{board}/res/#{thread.id}"
            div.appendChild(link)
            div.appendChild(tag('br'))
    old = $('#watcher div:last-child')
    replace(old, div)


parseResponse = (responseText) ->
    body = n 'body', {
        innerHTML: responseText
    }
    replies = $$('td.reply', body)
    opbq = $('blockquote', body)
    return [replies, opbq]


onloadThread = (responseText, span) ->
    [replies, opbq] = parseResponse(responseText)
    span.textContent = span.textContent.replace('X Loading...', '- ')

    #make sure all comments are fully expanded
    span.previousSibling.innerHTML = opbq.innerHTML
    while (next = span.nextSibling) and not next.clear#<br clear>
        remove(next)
    if next
        for reply in replies
            inBefore(next, x('ancestor::table', reply))
    else#threading
        div = span.parentNode
        for reply in replies
            div.appendChild(x('ancestor::table', reply))


expandThread = ->
    id = x('preceding-sibling::input[1]', this).name
    span = this

    #close expanded thread
    if span.textContent[0] is '-'
        #goddamit moot
        num = if board is 'b' then 3 else 5
        table = x("following::br[@clear][1]/preceding::table[#{num}]", span)
        while (prev = table.previousSibling) and (prev.nodeName is 'TABLE')
            remove(prev)
        span.textContent = span.textContent.replace('-', '+')
        return

    span.textContent = span.textContent.replace('+', 'X Loading...')
    #load cache
    for xhr in xhrs
        if xhr.id == id
            #why can't we just xhr.r.onload()?
            onloadThread(xhr.r.responseText, span)
            return

    #create new request
    r = new XMLHttpRequest()
    r.onload = ->
        onloadThread(this.responseText, span)
    r.open('GET', "res/#{id}", true)
    r.send()
    xhrs.push({
        r: r,
        id: id
    })


onloadComment = (responseText, a, href) ->
    [nop, op, id] = href.match(/(\d+)#(\d+)/)
    [replies, opbq] = parseResponse(responseText)
    if id is op
        html = opbq.innerHTML
    else
        #css selectors don't like ids starting with numbers,
        # getElementById only works for root document.
        for reply in replies
            if reply.id == id
                html = $('blockquote', reply).innerHTML
    bq = x('ancestor::blockquote', a)
    bq.innerHTML = html


expandComment = (e) ->
    e.preventDefault()
    a = this
    href = a.getAttribute('href')
    r = new XMLHttpRequest()
    r.onload = ->
        onloadComment(this.responseText, a, href)
    r.open('GET', href, true)
    r.send()
    xhrs.push({
        r: r,
        id: href.match(/\d+/)[0]
    })


report = ->
    input = x('preceding-sibling::input[1]', this)
    input.click()
    $('input[value="Report"]').click()
    input.click()


nodeInserted = (e) ->
    target = e.target
    if target.nodeName is 'TABLE'
        for callback in callbacks
            callback(target)
    else if target.id is 'recaptcha_challenge_field' and qr = $ '#qr'
        $('#recaptcha_image img', qr).src = "http://www.google.com/recaptcha/api/image?c=" + target.value
        $('#recaptcha_challenge_field', qr).value = target.value


autoWatch = ->
    autoText = $('textarea', this).value.slice(0, 25)
    GM_setValue('autoText', "/#{BOARD}/ - #{autoText}")


stopPropagation = (e) ->
    e.stopPropagation()


replyNav = ->
    if REPLY
        window.location = if @textContent is '▲' then '#navtop' else '#navbot'
    else
        direction = if @textContent is '▲' then 'preceding' else 'following'
        op = x("#{direction}::span[starts-with(@id, 'nothread')][1]", this).id
        window.location = "##{op}"


#graceful exit
unless navtopr = $ '#navtopr a'
    return
text = navtopr.nextSibling
a = tag('a')
a.textContent = 'X'
a.className = 'pointer'
a.addEventListener('click', options, true)
inBefore(text, document.createTextNode(' / '))
inBefore(text, a)

#hack to tab from comment straight to recaptcha
for el in $$ '#recaptcha_table a'
    el.tabIndex = 1

if getValue('Reply Hiding')
    callbacks.push((root) ->
        tds = $$('td.doubledash', root)
        for td in tds
            a = tag('a')
            a.textContent = '[ - ]'
            a.className = 'pointer'
            a.addEventListener('click', hideReply, true)
            replace(td.firstChild, a)

            next = td.nextSibling
            id = next.id
            for obj in hiddenReplies
                if obj.id is id
                    hideReply(next)
    )

if getValue('Quick Reply')
    iframe = tag('iframe')
    hide(iframe)
    iframe.name = 'iframe'
    iframe.addEventListener('load', iframeLoad, true)
    document.body.appendChild(iframe)

    callbacks.push((root) ->
        quotes = $$('a.quotejs:not(:first-child)', root)
        for quote in quotes
            quote.addEventListener('click', quickReply, true)
    )


if getValue('Quick Report')
    callbacks.push((root) ->
        arr = $$('span[id^=no]', root)
        for el in arr
            a = tag('a')
            a.textContent = '[ ! ]'
            a.className = 'pointer'
            a.addEventListener('click', report, true)
            inAfter(el, a)
            inAfter(el, document.createTextNode(' '))
    )

if getValue('Thread Watcher')
    #create watcher
    watcher = tag('div')
    watcher.innerHTML = '<div class="move">Thread Watcher</div><div></div>'
    watcher.className = 'reply'
    watcher.id = 'watcher'
    position(watcher)
    $('div', watcher).addEventListener('mousedown', mousedown, true)
    document.body.appendChild(watcher)
    watcherUpdate()

    #add buttons
    threads = watched[BOARD] || []
    #normal, threading
    inputs = $$('form > input[value="delete"], div > input[value="delete"]')
    for input in inputs
        img = tag('img')
        id = input.name
        for thread in threads
            if id == thread.id
                img.src = favNormal
                break
        img.src or= favEmpty
        img.className = 'pointer'
        img.addEventListener('click', watch, true)
        inBefore(input, img)

if getValue('Anonymize')
    callbacks.push((root) ->
        names = $$('span.postername, span.commentpostername', root)
        for name in names
            name.innerHTML = 'Anonymous'
        trips = $$('span.postertrip', root)
        for trip in trips
            if trip.parentNode.nodeName is 'A'
                remove(trip.parentNode)
            else
                remove(trip)
    )

if getValue('Reply Navigation')
    callbacks.push((root) ->
        arr = $$('span[id^=norep]', root)
        for el in arr
            span = tag('span')
            up = tag('a')
            up.textContent = '▲'
            up.className = 'pointer'
            up.addEventListener('click', replyNav, true)
            down = tag('a')
            down.textContent = '▼'
            down.className = 'pointer'
            down.addEventListener('click', replyNav, true)
            span.appendChild(document.createTextNode(' '))
            span.appendChild(up)
            span.appendChild(document.createTextNode(' '))
            span.appendChild(down)
            inAfter(el, span)
    )


if not REPLY
    if getValue('Thread Hiding')
        delform = $('form[name=delform]')
        #don't confuse other scripts
        document.addEventListener('DOMNodeInserted', stopPropagation, true)
        threadF(delform.firstChild)
        document.removeEventListener('DOMNodeInserted', stopPropagation, true)

    if getValue('Auto Watch')
        $('form[name="post"]').addEventListener('submit', autoWatch, true)

    if getValue('Thread Navigation')
        arr = $$('div > span.filesize, form > span.filesize')
        i = 0
        l = arr.length
        l1 = l + 1
        #should this be a while loop?
        for el in arr
            up = tag('a')
            up.className = 'pointer'
            if i isnt 0
                up.textContent = '▲'
                up.href = "##{i}"
            else if PAGENUM isnt 0
                up.textContent = '◀'
                up.href = "#{PAGENUM - 1}"
            else
                up.textContent = '▲'
                up.href = "#navtop"

            span = tag('span')
            span.className = 'navlinks'
            span.id = ++i
            i1 = i + 1
            down = tag('a')
            down.className = 'pointer'
            span.appendChild(up)
            span.appendChild(document.createTextNode(' '))
            span.appendChild(down)
            if i1 == l1
                down.textContent = '▶'
                down.href = "#{PAGENUM + 1}#1"
            else
                down.textContent = '▼'
                down.href = "##{i1}"
            inBefore(el, span)
        if location.hash is '#1'
            window.location = window.location

    if getValue('Thread Expansion')
        omitted = $$('span.omittedposts')
        for span in omitted
            a = tag('a')
            a.className = 'pointer omittedposts'
            a.textContent = "+ #{span.textContent}"
            a.addEventListener('click', expandThread, true)
            replace(span, a)

    if getValue('Comment Expansion')
        as = $$('span.abbr a')
        for a in as
            a.addEventListener('click', expandComment, true)

for callback in callbacks
    callback()
document.body.addEventListener('DOMNodeInserted', nodeInserted, true)
