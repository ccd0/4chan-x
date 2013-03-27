// ==UserScript==
// @name         <%= meta.name %>
// @version      <%= version %>
// @namespace    <%= name %>
// @description  Cross-browser userscript for maximum lurking on 4chan.
// @copyright    2009-2011 James Campos <james.r.campos@gmail.com>
// @copyright    2012-<%= grunt.template.today('yyyy') %> Nicolas Stepien <stepien.nicolas@gmail.com>
// @license      MIT; http://en.wikipedia.org/wiki/Mit_license
<%=
  meta.matches.map(function(match) {
    return '// @match        ' + match;
  }).join('\n')
%>
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @run-at       document-start
// @updateURL    <%= meta.page %>builds/<%= name %>.meta.js
// @downloadURL  <%= meta.page %>builds/<%= name %>.user.js
// @icon         data:image/png;base64,<%= grunt.file.read('img/icon48.png', {encoding: 'base64'}) %>
// ==/UserScript==
