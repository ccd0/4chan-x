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
tag: (el) ->
    document.createElement(el)
text: (s) ->
    document.createTextNode(s)
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


GM_addStyle('
    #filter {
        position: fixed;
        text-align: right;
    }
    #filter:hover {
        border: 1px solid;
    }
    #filter:not(:hover) {
        background: rgba(0,0,0,0)
    }
    #filter:not(:hover) > div {
        display: none;
    }
    #filter:not(:hover) > div.top {
        display: block;
        padding: 0;
    }
    #filter > div {
        padding: 0 5px 0 5px;
    }
    #filter > .top {
        padding: 5px 5px 0 5px;
    }
    #filter > .bottom {
    padding: 0 5px 5px 5px;
    }
    .move {
        cursor: move;
    }
    .pointer {
        cursor: pointer;
    }
    .hide {
        display: none;
    }
')


filterSingle: (table, regex) ->
    for family of regex
        switch family
            when 'Name'
                s: $('span.commentpostername', table).textContent
            when 'Tripcode'
                s: $('span.postertrip', table)?.textContent || ''
            when 'Email'
                s: $('a.linkmail', table)?.href.slice(7) || ''
            when 'Subject'
                s: $('span.filetitle', table)?.textContent || ''
            when 'Comment'
                s: $('blockquote', table).textContent
            when 'File'
                s: $('span.filesize', table)?.textContent || ''
        if regex[family].test(s)
            return true


filterAll: ->
    regex: {}
    inputs: $$('input', filter)
    for input in inputs
        if value: input.value
            regex[input.name]: new RegExp(value, 'i')

    tables: $$('form[name="delform"] table')
    tables.pop()
    tables.pop()
    for table in tables
        if filterSingle(table, regex)
            table.className: 'hide'
        else
            table.className: ''


keydown: (e) ->
    if e.keyCode is 13 #enter
        filterAll()


filter: tag('div')
filter.id: 'filter'
filter.className: 'reply'
position(filter)

bar: tag('div')
bar.textContent: '4chon foltor'
bar.className: 'move top'
bar.addEventListener('mousedown', mousedown, true)
filter.appendChild(bar)

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
    label.appendChild(text(field))
    input: tag('input')
    input.name: field
    input.addEventListener('keydown', keydown, true)
    label.appendChild(input)
    div.appendChild(label)
    filter.appendChild(div)

apply: tag('a')
apply.textContent: 'apply'
apply.className: 'pointer'
reset: tag('a')
reset.textContent: 'reset'
reset.className: 'pointer'
div: tag('div')
div.className: 'bottom'
div.appendChild(apply)
div.appendChild(text(' '))
div.appendChild(reset)
filter.appendChild(div)
document.body.appendChild(filter)
