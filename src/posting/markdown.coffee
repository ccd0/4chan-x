Markdown =
  format: (text) ->
    tag_patterns =
      bi:   /(\*\*\*|___)(?=\S)([^\r\n]*?\S)\1/g
      b:    /(\*\*|__)(?=\S)([^\r\n]*?\S)\1/g
      i:    /(\*|_)(?=\S)([^\r\n]*?\S)\1/g
      code: /(`)(?=\S)([^\r\n]*?\S)\1/g
      ds:   /(\|\||__)(?=\S)([^\r\n]*?\S)\1/g

    for tag, pattern of tag_patterns
      text =
        if text
          text.replace pattern, Markdown.unicode_convert
        else
          '\u0020'
    text

  unicode_convert: (str, tag, inner) ->
    fmt =
      switch tag
        when '_', '*'
          'i'
        when '__', '**'
          'b'
        when '___', '***'
          'bi'
        when '||'
          'ds'
        when '`', '```'
          'code'

    #Unicode codepoints for the characters '0', 'A', and 'a'
    #http://en.wikipedia.org/wiki/Mathematical_Alphanumeric_Symbols
    codepoints =
      b:    [ 0x1D7CE, 0x1D400, 0x1D41A ] # MATHEMATICAL BOLD
      i:    [ 0x1D7F6, 0x1D434, 0x1D44E ] # MATHEMATICAL ITALIC
      bi:   [ 0x1D7CE, 0x1D468, 0x1D482 ] # MATHEMATICAL BOLD ITALIC
      code: [ 0x1D7F6, 0x1D670, 0x1D68A ] # MATHEMATICAL MONOSPACE
      ds:   [ 0x1D7D8, 0x1D538, 0x1D552 ] # I FUCKING LOVE CAPS LOCK

    charcodes = (inner.charCodeAt i for c, i in inner)

    codes = for charcode in charcodes
      if charcode >= 48 and charcode <= 57
        charcode - 48 + codepoints[fmt][0]
      else if charcode >= 65 and charcode <= 90
        charcode - 65 + codepoints[fmt][1]
      else if charcode >= 97 and charcode <= 122
        if charcode is 104 and tag is 'i'
          # http://blogs.msdn.com/b/michkap/archive/2006/04/21/580328.aspx
          # Mathematical small h -> planck constant
          0x210E
        else
          charcode - 97 + codepoints[fmt][2]
      else
        charcode

    unicode_text = codes.map(Markdown.ucs2_encode).join ''
    unicode_text = unicode_text.replace(/\x20/g, '\xA0')  if tag is 'code'
    unicode_text

  ucs2_encode: (value) ->
    # Translates Unicode codepoint integers directly into text. Javascript does this in an ugly fashion by default.
    ###
    From Punycode.js: https://github.com/bestiejs/punycode.js

    Copyright Mathias Bynens <http://mathiasbynens.be/>

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF`
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
    LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    ###

    output = ''
    if value > 0xFFFF
      value  -= 0x10000
      output += String.fromCharCode value >>> 10 & 0x3FF | 0xD800
      value  =  0xDC00 | value & 0x3FF
    output += String.fromCharCode value