x: (path, root) ->
    root ||= document.body
    document.
        evaluate(path, root, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).
        singleNodeValue
$: (selector, root) ->
    root ||= document.body
    root.querySelector(selector)
$$: (selector, root) ->
    root ||= document.body
    result: root.querySelectorAll(selector)
    #magic that turns the results object into an array:
    node for node in result
inBefore: (root, el) ->
    root.parentNode.insertBefore(el, root)
tag: (el) ->
    document.createElement(el)
text: (s) ->
    document.createTextNode(s)
remove: (root) ->
    root.parentNode.removeChild(root)
position: (el) ->
    id: el.id
    if left: GM_getValue("${id}Left", '0px')
        el.style.left: left
    else
        el.style.right: '0px'
    if top: GM_getValue("${id}Top", '0px')
        el.style.top: top
    else
        el.style.bottom: '0px'

move: {}
mousedown: (e) ->
    div: this.parentNode
    move.div: div
    move.divX: div.offsetLeft
    move.divY: div.offsetTop
    move.clientX: e.clientX
    move.clientY: e.clientY
    move.bodyX: document.body.clientWidth
    move.bodyY: document.body.clientHeight
    window.addEventListener('mousemove', mousemove, true)
    window.addEventListener('mouseup', mouseup, true)
mousemove: (e) ->
    div: move.div
    realX: move.divX + (e.clientX - move.clientX)# x + dx
    left: if realX < 20 then 0 else realX
    if move.bodyX - div.offsetWidth - realX < 20
        div.style.left: ''
        div.style.right: '0px'
    else
        div.style.left: left + 'px'
        div.style.right: ''
    realY: move.divY + (e.clientY - move.clientY)# y + dy
    top: if realY < 20 then 0 else realY
    if move.bodyY - div.offsetHeight - realY < 20
        div.style.top: ''
        div.style.bottom: '0px'
    else
        div.style.top: top + 'px'
        div.style.bottom: ''
mouseup: ->
    id: move.div.id
    GM_setValue("${id}Left", move.div.style.left)
    GM_setValue("${id}Top", move.div.style.top)
    window.removeEventListener('mousemove', mousemove, true)
    window.removeEventListener('mouseup', mouseup, true)

#x-browser
if typeof GM_deleteValue == 'undefined'
    this.GM_setValue: (name, value) ->
        value: (typeof value)[0] + value
        localStorage.setItem(name, value)

    this.GM_getValue: (name, defaultValue) ->
        if not value: localStorage.getItem(name)
            return defaultValue
        type: value[0]
        value: value.substring(1)
        switch type
            when 'b'
                return value == 'true'
            when 'n'
                return Number(value)
            else
                return value

    this.GM_addStyle: (css) ->
        style: tag('style')
        style.type: 'text/css'
        style.textContent: css
        $('head', document).appendChild(style)


GM_addStyle('
    #box_options input {
        width: 100px;
    }
    #box, #box_options {
        position: fixed;
        text-align: right;
        border: 1px solid;
    }
    #box.autohide:not(:hover) {
        background: rgba(0,0,0,0);
        border: none;
    }
    #box.autohide:not(:hover):not(:active) > *:not(.top) {
        display: none;
    }
    #box.autohide a:last-child {
        font-weight: bold;
    }
    #box > div {
        padding: 0 5px 0 5px;
    }
    #box > .top {
        padding: 5px 5px 0 5px;
    }
    #box > .bottom {
    padding: 0 5px 5px 5px;
    }
    .move {
        cursor: move;
    }
    #box a, #box_options a {
        cursor: pointer;
    }
    .hide {
        display: none;
    }
    div.hide + hr {
        display: none;
    }
')


#duplicated code. sigh.
# we could try threading the op, but that might affect other scripts.
# also, I really want to try out *gasp* eval().
filterThread: (thread, filter) ->
    for field of filter
        switch field
            when 'Name'
                s: $('span.postername', thread).textContent
            when 'Tripcode'
                s: x('./span[@class="postertrip"]', thread)?.textContent || ''
            when 'Email'
                s: (x('./a[@class="linkmail"]', thread)?.href.slice(7)) || ''
            when 'Subject'
                s: x('./span[@class="filetitle"]', thread)?.textContent || ''
            when 'Comment'
                s: $('blockquote', thread).textContent
            when 'File'
                s: x('./span[@class="filesize"]', thread)?.textContent || ''
        for regex in filter[field]
            if regex.test(s)
                return true


filterReply: (table, filter) ->
    for field of filter
        switch field
            when 'Name'
                s: $('span.commentpostername', table).textContent
            when 'Tripcode'
                s: $('span.postertrip', table)?.textContent || ''
            when 'Email'
                #http://github.com/jashkenas/coffee-script/issues#issue/342
                #s: $('a.linkmail', table)?.href.slice(7) || ''
                s: ($('a.linkmail', table)?.href.slice(7)) || ''
            when 'Subject'
                s: $('span.filetitle', table)?.textContent || ''
            when 'Comment'
                s: $('blockquote', table).textContent
            when 'File'
                s: $('span.filesize', table)?.textContent || ''
        for regex in filter[field]
            if regex.test(s)
                return true


filterAll: ->
    saveFilters()

    #better way of doing this? if we just say `compiled: filters`,
    #changing a prop in one will change a prop in the other.
    compiled: {}
    for filter of filters
        compiled[filter]: {}
        for field of filters[filter]
            s: filters[filter][field]
            split: s.split(';')
            trimmed: el.trimLeft() for el in split
            filtered: trimmed.filter((el)-> el.length)
            if filtered.length
                regexes: new RegExp(el, 'i') for el in filtered
                compiled[filter][field]: regexes

    [replies, threads]: reset()
    num: if threads.length then replies.length + threads.length else $$('blockquote', form).length

    #these loops look combinable
    for reply in replies
        for filter of compiled
            if filterReply(reply, compiled[filter])
                reply.className+= ' ' + filter
    for thread in threads
        for filter of compiled
            if filterThread(thread, compiled[filter])
                thread.className+= ' ' + filter

    imagesCount: $$('img[md5]').length
    box.firstChild.textContent: "Images: $imagesCount Posts: $num"


keydown: (e) ->
    if e.keyCode is 13 #enter
        filterAll()


reset: ->
    form: $('form[name="delform"]')
    tables: $$('table', form)
    tables.pop()
    tables.pop()
    for table in tables
        table.className: ''

    threads: $$('div', form)
    threads.pop()
    for thread in threads
        thread.className: ''

    return [tables, threads]


autoHide: ->
    if box.className is 'reply'
        box.className: 'reply autohide'
    else
        box.className: 'reply'
    GM_setValue('className', box.className)


save: ->
    div: this.parentNode.parentNode
    inputs: $$('input:enabled', div)
    for input in inputs
        if value: input.value
            filters[value]: {}
            option: tag('option')
            option.textContent: value
            select.appendChild(option)
    option?.selected: true
    loadFilters()
    GM_setValue('filters', JSON.stringify(filters))
    remove(div)


cancel: ->
    div: this.parentNode.parentNode
    remove(div)


optionKeydown: (e) ->
    if e.keyCode is 13 #enter
        save.call(this.parentNode)


addClass: ->
    div: tag('div')
    input: tag('input')
    input.addEventListener('keydown', optionKeydown, true)
    div.appendChild(input)
    inBefore(this, div)
    input.focus()


del: ->
    value: @nextElementSibling.value
    delete filters[value]
    GM_setValue('filters', JSON.stringify(filters))
    remove @parentNode
    for option in select.options
        if option.value is value
            remove option
    loadFilters()


options: ->
    if opt: $('#box_options')
        remove(opt)
    else
        opt: tag('div')
        opt.id: 'box_options'
        opt.className: 'reply'
        position(opt)
        bar: tag('div')
        bar.textContent: 'Options'
        bar.className: 'move'
        bar.addEventListener('mousedown', mousedown, true)
        opt.appendChild(bar)

        filters: JSON.parse(GM_getValue('filters', '{ "hide": {} }'))
        for filter of filters
            div: tag('div')
            a: tag('a')
            a.textContent: 'delete'
            a.addEventListener('click', del, true)
            div.appendChild(a)
            div.appendChild(text(' '))
            input: tag('input')
            input.value: filter
            input.disabled: true
            div.appendChild(input)
            opt.appendChild(div)

        div: tag('div')
        a: tag('a')
        a.textContent: 'Add Class'
        a.addEventListener('click', addClass, true)
        div.appendChild(a)
        opt.appendChild(div)

        div: tag('div')
        a: tag('a')
        a.textContent: 'save'
        a.addEventListener('click', save, true)
        div.appendChild(a)
        div.appendChild(text(' '))
        a: tag('a')
        a.textContent: 'cancel'
        a.addEventListener('click', cancel, true)
        div.appendChild(a)
        opt.appendChild(div)

        document.body.appendChild(opt)


loadFilters: ->
    filter: filters[select.value]
    inputs: $$('input', box)
    for input in inputs
        input.value: filter[input.name] || ''


saveFilters: ->
    filter: {}
    inputs: $$('input', box)
    for input in inputs
        if value: input.value
            filter[input.name]: value
    filters[select.value]: filter
    GM_setValue('filters', JSON.stringify(filters))


box: tag('div')
box.id: 'box'
box.className: GM_getValue('className', 'reply')
position(box)

bar: tag('div')
bar.className: 'move top'
bar.addEventListener('mousedown', mousedown, true)
box.appendChild(bar)

select: tag('select')
select.addEventListener('mousedown', saveFilters, true)
select.addEventListener('mouseup', loadFilters, true)
filters: JSON.parse(GM_getValue('filters', '{ "hide": {} }'))
for filter of filters
    option: tag('option')
    option.textContent: filter
    select.appendChild(option)
box.appendChild(select)

fields: [
    'Name',
    'Tripcode',
    'Email',
    'Subject',
    'Comment',
    'File',
]
for field in fields
    div: tag('div')
    label: tag('label')
    label.textContent: field
    input: tag('input')
    input.name: field
    input.addEventListener('keydown', keydown, true)
    label.appendChild(input)
    div.appendChild(label)
    box.appendChild(div)

loadFilters()

div: tag('div')
div.className: 'bottom'
for name in ['apply', 'reset', 'options', 'autohide']
    a: tag('a')
    a.textContent: name
    switch name
        when 'apply'    then f: filterAll
        when 'reset'    then f: reset
        when 'options'  then f: options
        when 'autohide' then f: autoHide
    a.addEventListener('click', f, true)
    div.appendChild(a)
    div.appendChild(text(' '))
box.appendChild(div)
document.body.appendChild(box)
filterAll()
