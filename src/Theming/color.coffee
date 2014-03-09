class Color
  minmax = (base) -> if base < 0 then 0 else if base > 255 then 255 else base

  shortToLong = (hex) ->
    longHex = []
    i = 0
    while i < 3
      longHex.push hex.substr i, 1
      i = Math.floor longHex.length / 2
    return longHex.join ""

  colorToHex = (color) ->
    if color.substr(0, 1) is '#'
      if color.length isnt 4
        return color[1..]
      else
        return shortToLong color.substr(1, 3)

    len = color.length
    if len in [3, 6]
      if /[0-9a-f]{3}/i.test color
        return if color.length is 6 then color else shortToLong color

    if digits = color.match /(.*?)rgba?\((\d+), ?(\d+), ?(\d+)(.*?)\)/
      # [R, G, B] to 0xRRGGBB
      hex = (
        (parseInt(digits[2], 10) << 16) |
        (parseInt(digits[3], 10) << 8)  |
        (parseInt(digits[4], 10))
      ).toString 16

      while hex.length < 6
        hex = "0#{hex}"
      return hex

    else
      "000000"

  constructor: (value) ->
    @raw = colorToHex value

  hex:   -> "#" + @raw
  rgb:   -> @privateRGB().join ","
  hover: -> @shiftRGB 16, true

  isLight:    ->
    rgb = @privateRGB()
    (rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) > 125

  privateRGB: ->
    hex = parseInt @raw, 16
    return [
      # 0xRRGGBB to [R, G, B]
      (hex >> 16) & 0xFF
      (hex >> 8) & 0xFF
      hex & 0xFF
    ]

  shiftRGB: (shift, smart) ->
    shift = (if @isLight() then -1 else 1) * Math.abs shift if smart
    rgb   = []
    rgb.push minmax color + shift for color in @privateRGB()
    rgb.join ","