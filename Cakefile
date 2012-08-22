{log}  = console
{exec} = require 'child_process'
fs     = require 'fs'

VERSION = '2.34.6'

HEADER  = """
// ==UserScript==
// @name           4chan x
// @version        #{VERSION}
// @namespace      aeosynth
// @description    Adds various features.
// @copyright      2009-2011 James Campos <james.r.campos@gmail.com>
// @copyright      2012 Nicolas Stepien <stepien.nicolas@gmail.com>
// @license        MIT; http://en.wikipedia.org/wiki/Mit_license
// @include        http://boards.4chan.org/*
// @include        https://boards.4chan.org/*
// @include        http://images.4chan.org/*
// @include        https://images.4chan.org/*
// @include        http://sys.4chan.org/*
// @include        https://sys.4chan.org/*
// @run-at         document-start
// @updateURL      https://github.com/MayhemYDG/4chan-x/raw/stable/4chan_x.user.js
// @downloadURL    https://github.com/MayhemYDG/4chan-x/raw/stable/4chan_x.user.js
// @icon           http://mayhemydg.github.com/4chan-x/favicon.gif
// ==/UserScript==

/* LICENSE
 *
 * Copyright (c) 2009-2011 James Campos <james.r.campos@gmail.com>
 * Copyright (c) 2012 Nicolas Stepien <stepien.nicolas@gmail.com>
 * http://mayhemydg.github.com/4chan-x/
 * 4chan X #{VERSION}
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
 * 4chan X is written in CoffeeScript[1], and developed on GitHub[2].
 *
 * [1]: http://coffeescript.org/
 * [2]: https://github.com/MayhemYDG/4chan-x
 *
 * CONTRIBUTORS
 *
 * noface - unique ID fixes
 * desuwa - Firefox filename upload fix
 * seaweed - bottom padding for image hover
 * e000 - cooldown sanity check
 * ahodesuka - scroll back when unexpanding images, file info formatting
 * Shou- - pentadactyl fixes
 * ferongr - new favicons
 * xat- - new favicons
 * Zixaphir - fix qr textarea - captcha-image gap
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
INFILE    = 'script.coffee'
OUTFILE   = '4chan_x.user.js'
CHANGELOG = 'changelog'
LATEST    = 'latest.js'

option '-v', '--version [version]', 'Upgrade version.'

task 'upgrade', (options) ->
  {version} = options
  unless version
    console.warn 'Version argument not specified. Exiting.'
    return
  regexp = RegExp VERSION, 'g'
  for file in [CAKEFILE, INFILE, OUTFILE, LATEST]
    data = fs.readFileSync file, 'utf8'
    fs.writeFileSync file, data.replace regexp, version
  data = fs.readFileSync CHANGELOG, 'utf8'
  fs.writeFileSync CHANGELOG, data.replace 'master', "master\n\n#{version}"
  exec "git commit -am 'Release #{version}.' && git tag -a #{version} -m '#{version}' && git tag -af stable -m '#{version}'"

task 'build', ->
  exec 'coffee --print script.coffee', (err, stdout, stderr) ->
    throw err if err
    fs.writeFile OUTFILE, HEADER + stdout, (err) ->
      throw err if err

task 'dev', ->
  invoke 'build'
  fs.watchFile INFILE, interval: 250, (curr, prev) ->
    if curr.mtime > prev.mtime
      invoke 'build'
