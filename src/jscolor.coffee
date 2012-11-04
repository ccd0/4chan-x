JSColor =
  
  bind: (el) ->
    el.color = new JSColor.color(el) if not el.color

  images:
    pad:        [ 181, 101 ]
    sld:        [ 16, 101 ]
    cross:      [ 15, 15 ]
    arrow:      [ 7, 11 ]

  fetchElement: (mixed) ->
    document.getElementById(mixed) if typeof mixed is "string" else mixed

  fireEvent: (el, evnt) ->
    return unless el

    ev = document.createEvent 'HTMLEvents'
    ev.initEvent evnt, true, true
    el.dispatchEvent ev

  getRelMousePos: (e = window.event) ->
    x = 0
    y = 0
    if typeof e.offsetX is 'number'
      x = e.offsetX
      y = e.offsetY
    else if typeof e.layerX is 'number'
      x = e.layerX
      y = e.layerY
    x: x
    y: y

  color: (target) ->
    @valueElement       = target         # value holder
    @styleElement       = target         # where to reflect current color
    @onImmediateChange  = null           # onchange callback (can be either string or function)
    @hsv                = [0, 0, 1]      # read-only  0-6, 0-1, 0-1
    @rgb                = [1, 1, 1]      # read-only  0-1, 0-1, 0-1
    @minH               = 0              # read-only  0-6
    @maxH               = 6              # read-only  0-6
    @minS               = 0              # read-only  0-1
    @maxS               = 1              # read-only  0-1
    @minV               = 0              # read-only  0-1
    @maxV               = 1              # read-only  0-1
    @pickerButtonHeight = 20             # px
    @pickerButtonColor  = 'ButtonText'   # px
    @pickerFace         = 10             # px
    @pickerFaceColor    = 'ThreeDFace'   # CSS color
    @pickerBorder       = 1              # px
    @pickerBorderColor  = 'ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight' # CSS color
    @pickerInset        = 1              # px
    @pickerInsetColor   = 'ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow' # CSS color
    @pickerZIndex       = 1000

    @hidePicker = ->
      if isPickerOwner()
        removePicker()

    @showPicker = ->
      unless isPickerOwner()
        drawPicker()

    @importColor = ->
      unless valueElement
        @exportColor()
      else
        unless @fromString valueElement.value, leaveValue
          styleElement.style.backgroundImage = styleElement.jscStyle.backgroundImage
          styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor
          styleElement.style.color           = styleElement.jscStyle.color
          @exportColor leaveValue | leaveStyle

    @exportColor = (flags) ->
      if not (flags & leaveValue) and valueElement
        value = @toString()
        value = '#' + value
        valueElement.value = value
        valueElement.previousSibling.value = value
        editTheme[valueElement.previousSibling.name] = value
        
        Style.addStyle(editTheme)

      if not (flags & leaveStyle) and styleElement
        styleElement.style.backgroundImage = "none"
        styleElement.style.backgroundColor = '#' + @toString()
        styleElement.style.color = if ((
          0.213 * @rgb[0] +
          0.715 * @rgb[1] +
          0.072 * @rgb[2]
        ) < 0.5) then '#FFF' else '#000'

      if not (flags & leavePad) and isPickerOwner()
        redrawPad()

      if not (flags & leaveSld) and isPickerOwner()
        redrawSld()

    @fromHSV = (h, s, v, flags) -> # null = don't change
      if h isnt null then h = Math.max(0.0, @minH, Math.min(6.0, @maxH, h))
      if s isnt null then s = Math.max(0.0, @minS, Math.min(1.0, @maxS, s))
      if v isnt null then v = Math.max(0.0, @minV, Math.min(1.0, @maxV, v))

      @rgb = HSV_RGB(
        if h is null then @hsv[0] else (@hsv[0] = h)
        if s is null then @hsv[1] else (@hsv[1] = s)
        if v is null then @hsv[2] else (@hsv[2] = v)
      )

      @exportColor flags

    @fromRGB = (r, g, b, flags) -> # null = don't change
      if r isnt null then r = Math.max(0.0, Math.min(1.0, r))
      if g isnt null then g = Math.max(0.0, Math.min(1.0, g))
      if b isnt null then b = Math.max(0.0, Math.min(1.0, b))

      hsv = RGB_HSV(
        if r is null then @rgb[0] else r
        if g is null then @rgb[1] else g
        if b is null then @rgb[2] else b
      )

      if hsv[0] isnt null
        @hsv[0] = Math.max(0.0, @minH, Math.min(6.0, @maxH, hsv[0]))

      if hsv[2] isnt 0
        @hsv[1] = 
          if hsv[1] is null
            null
          else
            Math.max 0.0, @minS, Math.min 1.0, @maxS, hsv[1]

      @hsv[2] =
        if hsv[2] is null
          null
        else
          Math.max 0.0, @minV, Math.min 1.0, @maxV, hsv[2]

      # update RGB according to final HSV, as some values might be trimmed
      rgb = HSV_RGB(@hsv[0], @hsv[1], @hsv[2])
      @rgb[0] = rgb[0]
      @rgb[1] = rgb[1]
      @rgb[2] = rgb[2]

      @exportColor flags

    @fromString = (number, flags) ->
      m = number.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i)
      unless m
        return false
      else
        if m[1].length is 6 # 6-char notation
          @fromRGB(
            parseInt(m[1].substr(0,2),16) / 255
            parseInt(m[1].substr(2,2),16) / 255
            parseInt(m[1].substr(4,2),16) / 255
            flags
          )
        else # 3-char notation
          @fromRGB(
            parseInt(m[1].charAt(0)+m[1].charAt(0),16) / 255
            parseInt(m[1].charAt(1)+m[1].charAt(1),16) / 255
            parseInt(m[1].charAt(2)+m[1].charAt(2),16) / 255
            flags
          )
        true

    @toString = ->
      (0x100 | Math.round(255 * @rgb[0])).toString(16).substr(1) +
      (0x100 | Math.round(255 * @rgb[1])).toString(16).substr(1) +
      (0x100 | Math.round(255 * @rgb[2])).toString(16).substr(1)

    RGB_HSV = (r, g, b) ->
      n = Math.min(Math.min(r,g),b)
      v = Math.max(Math.max(r,g),b)
      m = v - n

      return [ null, 0, v ] if m is 0

      h =
        if r is n
          3 + (b - g) / m
        else
          if g is n
            5 + (r - b) / m
          else
            1 + (g - r) / m
      [if h is 6
          0
        else
          h
        m / v
        v]

    HSV_RGB = (h, s, v) ->
      
      return [ v, v, v ] if h is null
      
      i = Math.floor(h)
      f = if i % 2 then h - i else 1 - (h - i)
      m = v * (1 - s)
      n = v * (1 - s * f)

      switch i
        when 6, 0 then return [v,n,m]
        when 1    then return [n,v,m]
        when 2    then return [m,v,n]
        when 3    then return [m,n,v]
        when 4    then return [n,m,v]
        when 5    then return [v,m,n]

    removePicker = () ->
      delete JSColor.picker.owner
      $.rm   JSColor.picker.boxB

    drawPicker = (x, y) ->
      unless JSColor.picker
        JSColor.picker =
          box:  document.createElement('div')
          boxB: document.createElement('div')
          pad:  document.createElement('div')
          padB: document.createElement('div')
          padM: document.createElement('div')
          sld:  document.createElement('div')
          sldB: document.createElement('div')
          sldM: document.createElement('div')
          btn:  document.createElement('div')
          btnS: document.createElement('span')
          btnT: document.createTextNode('Close')

        for i in JSColor.images.sld[1] by (segSize = 4)
          seg = document.createElement('div')
          seg.style.height     = segSize + 'px'
          seg.style.fontSize   = '1px'
          seg.style.lineHeight = '0'
          $.add JSColor.picker.sld, sed

        $.add JSColor.picker.sldB, JSColor.picker.sld
        $.add JSColor.picker.box,  JSColor.picker.sldB
        $.add JSColor.picker.box,  JSColor.picker.sldM
        $.add JSColor.picker.padB, JSColor.picker.pad
        $.add JSColor.picker.box,  JSColor.picker.padB
        $.add JSColor.picker.box,  JSColor.picker.padM
        $.add JSColor.picker.btnS, JSColor.picker.btnT
        $.add JSColor.picker.btn,  JSColor.picker.btnS
        $.add JSColor.picker.box,  JSColor.picker.btn
        $.add JSColor.picker.boxB, JSColor.picker.box

      p = JSColor.picker

      # controls interaction
      p.box.onmouseup =
      p.box.onmouseout = -> target.focus()
      p.box.onmousedown = -> abortBlur=true
      p.box.onmousemove = (e) ->
        if holdPad or holdSld
          holdPad and setPad e
          holdSld and setSld e
          if document.selection
            document.selection.empty()
          else if window.getSelection
            window.getSelection().removeAllRanges()

          dispatchImmediateChange()

      p.padM.onmouseup =
      p.padM.onmouseout = -> if holdPad
        holdPad = false
        JSColor.fireEvent valueElement, 'change'
      p.padM.onmousedown = (e) ->
        # if the slider is at the bottom, move it up

        if THIS.hsv[2] is 0
          THIS.fromHSV null, null, 1.0

        holdPad = true
        setPad e
        dispatchImmediateChange()

      p.sldM.onmouseup =
      p.sldM.onmouseout = -> if holdSld
        holdSld = false
        JSColor.fireEvent valueElement, 'change'
      p.sldM.onmousedown = (e) ->
        holdSld = true
        setSld e
        dispatchImmediateChange()

      # picker
      dims                          = getPickerDims THIS
      p.box.style.width             = dims[0] + 'px'
      p.box.style.height            = dims[1] + 'px'

      # picker border
      p.boxB.style.position         = 'absolute'
      p.boxB.style.clear            = 'both'
      p.boxB.style.left             = '320px'
      p.boxB.style.bottom           = '20px'
      p.boxB.style.zIndex           = THIS.pickerZIndex
      p.boxB.style.border           = THIS.pickerBorder + 'px solid'
      p.boxB.style.borderColor      = THIS.pickerBorderColor
      p.boxB.style.background       = THIS.pickerFaceColor

      # pad image
      p.pad.style.width             = JSColor.images.pad[0] + 'px'
      p.pad.style.height            = JSColor.images.pad[1] + 'px'

      # pad border
      p.padB.style.position         = 'absolute'
      p.padB.style.left             = THIS.pickerFace  + 'px'
      p.padB.style.top              = THIS.pickerFace  + 'px'
      p.padB.style.border           = THIS.pickerInset + 'px solid'
      p.padB.style.borderColor      = THIS.pickerInsetColor

      # pad mouse area
      p.padM.style.position         = 'absolute'
      p.padM.style.left             = '0'
      p.padM.style.top              = '0'
      p.padM.style.width            = THIS.pickerFace + 2 * THIS.pickerInset + JSColor.images.pad[0] + JSColor.images.arrow[0] + 'px'
      p.padM.style.height           = p.box.style.height
      p.padM.style.cursor           = 'crosshair'

      # slider image
      p.sld.style.overflow          = 'hidden'
      p.sld.style.width             = JSColor.images.sld[0] + 'px'
      p.sld.style.height            = JSColor.images.sld[1] + 'px'

      # slider border
      p.sldB.style.display          = 'block'
      p.sldB.style.position         = 'absolute'
      p.sldB.style.right            = THIS.pickerFace  + 'px'
      p.sldB.style.top              = THIS.pickerFace  + 'px'
      p.sldB.style.border           = THIS.pickerInset + 'px solid'
      p.sldB.style.borderColor      = THIS.pickerInsetColor
      p.sldB.style.backgroundImage  = "#{Style.agent}linear-gradient(#fff, #000)"

      # slider mouse area
      p.sldM.style.display          = 'block'
      p.sldM.style.position         = 'absolute'
      p.sldM.style.right            = '0'
      p.sldM.style.top              = '0'
      p.sldM.style.width            = JSColor.images.sld[0] + JSColor.images.arrow[0] + THIS.pickerFace + 2 * THIS.pickerInset + 'px'
      p.sldM.style.height           = p.box.style.height

      p.sldM.style.cursor           = 'pointer'

      # "close" button
      setBtnBorder = ->
        insetColors = THIS.pickerInsetColor.split /\s+/
        pickerOutsetColor = if insetColors.length < 2
          insetColors[0]
        else
          insetColors[1] + ' ' + insetColors[0] + ' ' + insetColors[0] + ' ' + insetColors[1]
        p.btn.style.borderColor = pickerOutsetColor

      p.btn.style.display       = 'block'
      p.btn.style.position      = 'absolute'
      p.btn.style.left          = THIS.pickerFace + 'px'
      p.btn.style.bottom        = THIS.pickerFace + 'px'
      p.btn.style.padding       = '0 15px'
      p.btn.style.height        = '18px'
      p.btn.style.border        = THIS.pickerInset + 'px solid'
      setBtnBorder()
      p.btn.style.color         = THIS.pickerButtonColor
      p.btn.style.textAlign     = 'center'

      p.btn.style.cursor = 'pointer'

      p.btn.onmousedown = ->
        THIS.hidePicker()

      p.btnS.style.lineHeight   = p.btn.style.height

      padImg = "#{Style.agent}linear-gradient(rgba(255,255,255,0), rgba(255,255,255,1)), #{Style.agent}linear-gradient(left, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)"

      p.padM.style.backgroundImage   = "url('data:image/gif;base64,R0lGODlhDwAPAKEBAAAAAP///////////yH5BAEKAAIALAAAAAAPAA8AAAIklB8Qx53b4otSUWcvyiz4/4AeQJbmKY4p1HHapBlwPL/uVRsFADs=')"
      p.padM.style.backgroundRepeat  = "no-repeat"
      p.sldM.style.backgroundImage   = "url('data:image/gif;base64,R0lGODlhBwALAKECAAAAAP///6g8eKg8eCH5BAEKAAIALAAAAAAHAAsAAAITTIQYcLnsgGxvijrxqdQq6DRJAQA7')"
      p.sldM.style.backgroundRepeat  = "no-repeat"
      p.pad.style.backgroundImage    = padImg
      p.pad.style.backgroundRepeat   = "no-repeat"
      p.pad.style.backgroundPosition = "0 0"

      # place pointers
      redrawPad()
      redrawSld()

      JSColor.picker.owner = THIS
      $.add ThemeTools.dialog, p.boxB

    getPickerDims = (o) ->
      dims = [
        (
          2 * o.pickerInset               +
          2 * o.pickerFace                +
          JSColor.images.pad[0]           +
          (
            2 * o.pickerInset           +
            2 * JSColor.images.arrow[0] +
            JSColor.images.sld[0]
          )
        )
        (
          4 * o.pickerInset       +
          3*o.pickerFace          +
          JSColor.images.pad[1]   +
          o.pickerButtonHeight
        )
      ]

    # redraw the pad pointer
    redrawPad = () ->

      yComponent = 1

      x = Math.round (THIS.hsv[0] / 6)          * (JSColor.images.pad[0] - 1)
      y = Math.round (1 - THIS.hsv[yComponent]) * (JSColor.images.pad[1] - 1)
      JSColor.picker.padM.style.backgroundPosition =
        "#{THIS.pickerFace + THIS.pickerInset + x - Math.floor(JSColor.images.cross[0] / 2)}px " +
        "#{THIS.pickerFace + THIS.pickerInset + y - Math.floor(JSColor.images.cross[1] / 2)}px"

      # redraw the slider image
      seg = JSColor.picker.sld.childNodes

      rgb = HSV_RGB(THIS.hsv[0], THIS.hsv[1], 1)
      for item in seg
        item.style.backgroundColor =
          "rgb(" +
          "#{rgb[0]*(1-i/seg.length)*100}%, " +
          "#{rgb[1]*(1-i/seg.length)*100}%, " +
          "#{rgb[2]*(1-i/seg.length)*100}%)"
              
    redrawSld = ->
      # redraw the slider pointer
      yComponent = 2

      y = Math.round (1 - THIS.hsv[yComponent]) * (JSColor.images.sld[1] - 1)
      JSColor.picker.sldM.style.backgroundPosition =
        "0 #{THIS.pickerFace + THIS.pickerInset+y - Math.floor(JSColor.images.arrow[1] / 2)}px"


    isPickerOwner = ->
      JSColor.picker and JSColor.picker.owner is THIS

    blurTarget = ->
      if valueElement is target
        THIS.importColor()

    blurValue = ->
      if valueElement isnt target
        THIS.importColor()

    setPad = (e) ->
      mpos = JSColor.getRelMousePos e
      x = mpos.x - THIS.pickerFace - THIS.pickerInset
      y = mpos.y - THIS.pickerFace - THIS.pickerInset
      THIS.fromHSV(
        x * (
          6 / (
            JSColor.images.pad[0] - 1
          )
        )
        1 - y / (
          JSColor.images.pad[1] - 1
        )
        null
        leaveSld
      )

    setSld = (e) ->
      mpos  = JSColor.getRelMousePos e
      y     = mpos.y - THIS.pickerFace - THIS.pickerInset
      THIS.fromHSV(
        null
        null
        1 - y / (
          JSColor.images.sld[1] - 1
        )
        leavePad
      )

    dispatchImmediateChange = ->
      if THIS.onImmediateChange
        callback
        if typeof THIS.onImmediateChange is 'string'
          callback = new Function (THIS.onImmediateChange)
        else
          callback = THIS.onImmediateChange
        callback.call(THIS)

    THIS         = @
    abortBlur    = false
    valueElement = JSColor.fetchElement @valueElement
    styleElement = JSColor.fetchElement @styleElement
    holdPad      = false
    holdSld      = false
    leaveValue   = 1 << 0
    leaveStyle   = 1 << 1
    leavePad     = 1 << 2
    leaveSld     = 1 << 3

    # target
    $.on target, 'focus', ->
      THIS.showPicker()

    $.on target, 'blur', ->
      unless abortBlur
        window.setTimeout (->
            abortBlur or blurTarget()
            abortBlur = false
          )
          0
      else
        abortBlur = false

    # valueElement
    if valueElement
      updateField = ->
        THIS.fromString valueElement.value, leaveValue
        dispatchImmediateChange()

      $.on valueElement, 'keyup', updateField
      $.on valueElement, 'input', updateField
      $.on valueElement, 'blur',  blurValue
      valueElement.setAttribute 'autocomplete', 'off'

    # styleElement
    if styleElement
      styleElement.jscStyle =
        backgroundImage:    styleElement.style.backgroundImage
        backgroundColor:    styleElement.style.backgroundColor
        color:              styleElement.style.color
    
    @importColor()