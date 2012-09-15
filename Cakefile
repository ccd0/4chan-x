{log}  = console
{exec} = require 'child_process'
fs     = require 'fs'

VERSION = '0.8beta'

HEADER = """
// ==UserScript==
// @name           AppChan x
// @version        #{VERSION}
// @namespace      zixaphir
// @description    Adds various features and stylings.
// @copyright      4chan x - 2009-2011 James Campos <james.r.campos@gmail.com>
// @copyright      4chan x - 2012 Nicolas Stepien <stepien.nicolas@gmail.com>
// @copyright      Appchan x - 2012 Zixaphir <zixaphirmoxphar@gmail.com>
// @license        MIT; http://en.wikipedia.org/wiki/Mit_license
// @include        http://boards.4chan.org/*
// @include        https://boards.4chan.org/*
// @include        http://images.4chan.org/*
// @include        https://images.4chan.org/*
// @include        http://sys.4chan.org/*
// @include        https://sys.4chan.org/*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_openInTab
// @run-at         document-start
// @updateURL      https://github.com/zixaphir/appchan-x/raw/stable/appchan_x.user.js
// @downloadURL    https://github.com/zixaphir/appchan-x/raw/stable/appchan_x.user.js
// @icon           data:image/gif;base64,R0lGODlhEAAQAKECAAAAAGbMM////////yH5BAEKAAIALAAAAAAQABAAAAIxlI+pq+D9DAgUoFkPDlbs7lGiI2bSVnKglnJMOL6omczxVZK3dH/41AG6Lh7i6qUoAAA7
// ==/UserScript==

/* LICENSE
*
* 4chan x Copyright (c) 2009-2011 James Campos <james.r.campos@gmail.com>
* http://aeosynth.github.com/4chan-x/
* 4chan x Copyright (c) 2012 Nicolas Stepien <stepien.nicolas@gmail.com>
* http://mayhemydg.github.com/4chan-x/
* Appchan X Copyright (c) 2012 Zixaphir <zixaphirmodnar@gmail.com>
* http://zixaphir.github.com/appchan-x/
* OneeChan Copyright (c) 2012 Jordan Bates
* http://seaweedchan.github.com/oneechan/
* 4chan SS Copyright (c) 2012 Ahodesuka
* http://ahodesuka.github.com/4chan-Style-Script/
*
* 4chan X
* Appchan X
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*
* HACKING
*
* Appchan X is written in CoffeeScript[1], and developed on GitHub[2].
*
* [1]: http://coffeescript.org/
* [2]: https://github.com/zixaphir/appchan-x
*
* CONTRIBUTORS
*
* blaise - mentoring and support
* aeosynth - original author of 4chan x
* mayhemydg - a current maintainer of 4chan x
* noface - a current maintainer of 4chan x
* that4chanwolf - former maintainer of 4chan x
* desuwa - Firefox filename upload fix
* seaweed - bottom padding for image hover
* e000 - cooldown sanity check
* ahodesuka - scroll back when unexpanding images, file info formatting
* Shou - pentadactyl fixes
* ferongr - favicons
* xat - favicons
* Ongpot - sfw favicon
* thisisanon - nsfw + 404 favicons
* Anonymous - empty favicon
* Seiba - chrome quick reply focusing
* herpaderpderp - recaptcha fixes
* WakiMiko - recaptcha tab order http://userscripts.org/scripts/show/82657
* btmcsweeney - allow users to specify text for sauce links
*
* All the people who've taken the time to write bug reports.
*
* Thank you.
*/

"""

CAKEFILE  = 'Cakefile'
SOURCEDIR = 'src'
OUTFILE   = 'appchan_x.user.js'
CHANGELOG = 'changelog'
LATEST    = 'latest.js'
APPFILES  = [
  'config'
  'themes'
  'library'
  'options'
  'chanx'
  'quickreply'
  'themeoptions'
  'mascotoptions'
  'appchan'
  'css/style'
  'main'
  'exec'
]

option '-v', '--version [version]', 'Upgrade version.'

task 'upgrade', (options) ->
  {version} = options
  unless version
    console.warn 'Version argument not specified. Exiting.'
    return
  regexp = RegExp VERSION, 'g'
  for file in [CAKEFILE, OUTFILE, LATEST]
    data = fs.readFileSync file, 'utf8'
    fs.writeFileSync file, data.replace regexp, version
  for file in APPFILES
    file = SOURCEDIR + "/" + file + ".coffee"
    data = fs.readFileSync file, 'utf8'
    fs.writeFileSync file, data.replace regexp, version
  data = fs.readFileSync CHANGELOG, 'utf8'
  fs.writeFileSync CHANGELOG, data.replace 'master', "master\n\n#{version}"
  exec "git commit -am 'Release #{version}.' && git tag -a #{version} -m '#{version}' && git tag -af stable -m '#{version}'"

task 'build', ->
  appContents = new Array remaining = APPFILES.length
  for file, index in APPFILES then do (file, index) ->
    fs.readFile SOURCEDIR + "/" + file + ".coffee", 'utf8', (err, fileContents) ->
      throw err if err
      appContents[index] = fileContents
      process() if --remaining is 0
  process = ->
    fs.writeFile "app.coffee", appContents.join('\n\n'), 'utf8', (err) ->
      throw err if err
      exec 'coffee --print app.coffee', {maxBuffer: 1024 * 1024}, (err, stdout, stderr) ->
        throw err if err
        fs.writeFile OUTFILE, HEADER + stdout, (err) ->
        fs.unlink 'app.coffee', (err) ->
          throw err if err

task 'dev', ->
  invoke 'build'
  for file in APPFILES then do (file) ->
    curFile = SOURCEDIR + "/" + file + ".coffee"
    console.log('Watching ' + curFile);
    fs.watchFile curFile, (curr, prev) ->
      if +curr.mtime isnt +prev.mtime
        console.log "Saw change in #{file}"
        invoke 'build'
