cs    = require 'coffee-script'
fs    = require 'fs'
{log} = console

HEADER  = fs.readFileSync 'header', 'utf8'
INFILE  = 'script.coffee'
OUTFILE = '4chan_x.user.js'

build = ->
  fs.readFile INFILE, 'utf8', (err, code) ->
    throw err if err
    try
      code = HEADER + cs.compile code
    catch e
      log e
    fs.writeFile OUTFILE, code, (err) ->
      throw err if err

task 'build', ->
  build()

task 'dev', ->
  build()
  fs.watchFile INFILE, interval: 250, (curr, prev) ->
    if curr.mtime > prev.mtime
      build()
