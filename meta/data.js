// ==UserScript==
// @name                <%= meta.name %>
// @namespace           zixaphir
// @version             <%= pkg.version %>
// @description         Cross-browser userscript for maximum lurking on 4chan.
// @copyright           <%= grunt.template.today('yyyy') %> Zixaphir <zixaphirmoxphar@gmail.com>
// @copyright           2009-2011 James Campos <james.r.campos@gmail.com>
// @copyright           <%= grunt.template.today('yyyy') %> Nicolas Stepien <stepien.nicolas@gmail.com>
// @license             MIT; http://en.wikipedia.org/wiki/Mit_license
// @include             http://boards.4chan.org/*
// @include             https://boards.4chan.org/*
// @include             http://images.4chan.org/*
// @include             https://images.4chan.org/*
// @include             http://sys.4chan.org/*
// @include             https://sys.4chan.org/*
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_openInTab
// @run-at              document-start
// @updateURL           <%= meta.repo %>raw/stable/<%= meta.files.metajs %>
// @downloadURL         <%= meta.repo %>raw/stable/<%= meta.files.userjs %>
// @icon                <%= meta.repo %>raw/stable/img/icon.gif
// ==/UserScript==
