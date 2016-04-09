fs = require 'fs'
path = require 'path'
_ = require 'lodash'
glob = require 'glob'

# disable ES6 delimiters
_.templateSettings.interpolate = /<%=([\s\S]+?)%>/g

read = (filename) -> fs.readFileSync(filename, 'utf8').replace(/\r\n/g, '\n')

pkg = JSON.parse(read 'package.json')
_.assign pkg.meta, JSON.parse(read 'version.json')

json = (data) ->
  "`#{JSON.stringify(data).replace(/`/g, '\\`')}`"

importCSS = (filenames...) ->
  text = filenames.map((name) -> read "src/css/#{name}.css").join('')
  text = _.template(text)(pkg)
  text.trim().replace(/\n+/g, '\n').split(/^/m).map(JSON.stringify).join(' +\n').replace(/`/g, '\\`')

importHTML = (filename) ->
  text = read("src/#{filename}.html").replace(/^ +/gm, '').replace(/\r?\n/g, '')
  text = _.template(text)(pkg)
  html text

parseTemplate = (template, context='') ->
  context0 = context
  parts = []
  text = template
  while text
    if part = text.match /^(?:[^{}\\]|\\.)+(?!{)/
      text = text[part[0].length..]
      unescaped = part[0].replace /\\(.)/g, '$1'
      context = (context + unescaped)
        .replace(/(=['"])[^'"<>]*/g, '$1')
        .replace(/(<\w+)( [\w-]+((?=[ >])|=''|=""))*/g, '$1')
        .replace(/^([^'"<>]+|<\/?\w+>)*/, '')
      parts.push json unescaped
    else if part = text.match /^([^}]){([^}`]*)}/
      text = text[part[0].length..]
      unless context is '' or (part[1] is '$' and /\=['"]$/.test context) or part[1] is '?'
        throw new Error "Illegal insertion into HTML template (at #{context}): #{template}"
      parts.push switch part[1]
        when '$' then "E(`#{part[2]}`)"
        when '&' then "`#{part[2]}`.innerHTML"
        when '@' then "E.cat(`#{part[2]}`)"
        when '?'
          args = ['""', '""']
          for i in [0...2]
            break if text[0] isnt '{'
            text = text[1..]
            [args[i], text] = parseTemplate text, context
            if text[0] isnt '}'
              throw new Error "Unexpected characters in subtemplate (#{text}): #{template}"
            text = text[1..]
          "(if `#{part[2]}` then #{args[0]} else #{args[1]})"
        else
          throw new Error "Unrecognized substitution operator (#{part[1]}): #{template}"
    else
      break
  if context isnt context0
    throw new Error "HTML template is ill-formed (at #{context}): #{template}"
  output = if parts.length is 0 then '""' else parts.join ' + '
  [output, text]

html = (template) ->
  [output, remaining] = parseTemplate template
  if remaining
    throw new Error "Unexpected characters in template (#{remaining}): #{template}"
  "(innerHTML: #{output})"

assert = (statement, objs...) ->
  return '' unless pkg.tests_enabled
  "throw new Error 'Assertion failed: ' + #{json statement} unless #{statement}"

_.assign pkg, {importCSS, importHTML, html, assert}

pkg.grunt = file:
  read: (filename, options) ->
    if options?.encoding is 'base64'
      fs.readFileSync(filename).toString('base64')
    else
      read filename
  readJSON: (filename) -> JSON.parse read filename
  expand: glob.sync

pkg.type = process.argv[4]
pkg.channel = process.argv[5]
pkg.tests_enabled = !!process.argv[6]

dir = path.dirname process.argv[3]
fs.mkdirSync dir unless fs.existsSync dir

text = read process.argv[2]
text = _.template(text)(pkg)
fs.writeFileSync process.argv[3], text
