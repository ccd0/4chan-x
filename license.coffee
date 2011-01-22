CoffeeScript = require 'coffee-script'
CoffeeScript.on 'success', (task) ->
  task.output = """
    // ==UserScript==
    // @name           4chan x
    // @namespace      aeosynth
    // @description    Adds various features.
    // @version        1.23.1
    // @copyright      2009-2011 James Campos <james.r.campos@gmail.com>
    // @license        MIT; http://en.wikipedia.org/wiki/Mit_license
    // @include        http://boards.4chan.org/*
    // @include        http://sys.4chan.org/*
    // ==/UserScript==

    /* LICENSE
     *
     * Copyright (c) 2009-2011 James Campos <james.r.campos@gmail.com>
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
     */

    /* HACKING
     *
     * 4chan x is written in CoffeeScript[1], and developed on github[2].
     *
     * [1]: http://jashkenas.github.com/coffee-script/
     * [2]: http://github.com/aeosynth/4chan-x
     */

    /* CONTRIBUTORS
     *
     * Ongpot - sfw favicon
     * thisisanon - nsfw + 404 favicons
     * Anonymous - empty favicon
     * Seiba - chrome quick reply focusing
     * herpaderpderp - recaptcha fixes
     * wakimoko - recaptcha tab order http://userscripts.org/scripts/show/82657
     * All the people who've taken the time to write bug reports.
     *
     * Thank you.
     */


   """ + task.output
