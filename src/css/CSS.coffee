<%
  var inc       = require['style'];
  var faCSS     = read('/node_modules/font-awesome/css/font-awesome.css');
  var faWebFont = readBase64('/node_modules/font-awesome/fonts/fontawesome-webfont.woff');
  var mainCSS   = ['font-awesome', 'style', 'yotsuba', 'yotsuba-b', 'futaba', 'burichan', 'tomorrow', 'photon'].map(x => read(`${x}.css`)).join('');
  var iconNames = files.filter(f => /^linkify\.[^.]+\.png$/.test(f));
  var icons     = iconNames.map(readBase64);
%>CSS =
  css: `<%= multiline(inc.fa(faCSS, faWebFont) + mainCSS + inc.icons(iconNames, icons) + read('supports.css')) %>`

  init: ->
    # set up CSS when <head> is completely loaded
    $.onExists doc, 'body', CSS.initStyle

  initStyle: ->
    return unless Main.isThisPageLegit()

    # disable the mobile layout
    $('link[href*=mobile]', d.head)?.disabled = true
    $.addClass doc, 'fourchan-x', 'seaweedchan'
    $.addClass doc, if g.VIEW is 'thread' then 'thread-view' else g.VIEW
    $.addClass doc, $.engine if $.engine
    $.onExists doc, '.ad-cnt', (ad) -> $.onExists ad, 'img', -> $.addClass doc, 'ads-loaded'
    $.addClass doc, 'autohiding-scrollbar' if Conf['Autohiding Scrollbar']
    $.ready ->
      if d.body.clientHeight > doc.clientHeight and (window.innerWidth is doc.clientWidth) isnt Conf['Autohiding Scrollbar']
        Conf['Autohiding Scrollbar'] = !Conf['Autohiding Scrollbar']
        $.set 'Autohiding Scrollbar', Conf['Autohiding Scrollbar']
        $.toggleClass doc, 'autohiding-scrollbar'
    $.addStyle CSS.css, 'fourchanx-css'
    CSS.bgColorStyle = $.el 'style', id: 'fourchanx-bgcolor-css'

    keyboard = false
    $.on d, 'mousedown', -> keyboard = false
    $.on d, 'keydown', (e) -> keyboard = true if e.keyCode is 9 # tab
    window.addEventListener 'focus', (-> doc.classList.toggle 'keyboard-focus', keyboard), true

    if g.VIEW is 'catalog'
      $.addClass doc, $.id('base-css').href.match(/catalog_(\w+)/)[1].replace('_new', '').replace /_+/g, '-'
    else
      CSS.style          = 'yotsuba-b'
      CSS.mainStyleSheet = $ 'link[title=switch]', d.head
      CSS.styleSheets    = $$ 'link[rel="alternate stylesheet"]', d.head
      CSS.setStyle()
      if CSS.mainStyleSheet
        new MutationObserver(CSS.setStyle).observe CSS.mainStyleSheet,
          attributes: true
          attributeFilter: ['href']

  setStyle: ->
    $.rmClass doc, CSS.style
    CSS.style = null
    for styleSheet in CSS.styleSheets
      if styleSheet.href is CSS.mainStyleSheet?.href
        CSS.style = styleSheet.title.toLowerCase().replace('new', '').trim().replace /\s+/g, '-'
        break
    if CSS.style
      $.addClass doc, CSS.style
      $.rm CSS.bgColorStyle
    else
      # Determine proper background color for dialogs if 4chan is using a special stylesheet.
      div = $.el 'div',
        className: 'reply'
      div.style.cssText = 'position: absolute; visibility: hidden;'
      $.add d.body, div
      bgColor = window.getComputedStyle(div).backgroundColor
      $.rm div
      CSS.bgColorStyle.textContent = """
        .dialog, .suboption-list > div:last-of-type {
          background-color: #{bgColor};
        }
      """
      $.after $.id('fourchanx-css'), CSS.bgColorStyle

return CSS
