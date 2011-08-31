{log}  = console
{exec} = require 'child_process'
fs     = require 'fs'

HEADER  = fs.readFileSync 'header', 'utf8'
INFILE  = 'script.coffee'
OUTFILE = '4chan_x.user.js'

build = ->
  exec 'coffee --print script.coffee', (err, stdout, stderr) ->
    throw err if err
    fs.writeFile OUTFILE, HEADER + stdout, (err) ->
      throw err if err

task 'build', ->
  build()

task 'dev', ->
  build()
  fs.watchFile INFILE, interval: 250, (curr, prev) ->
    if curr.mtime > prev.mtime
      build()
