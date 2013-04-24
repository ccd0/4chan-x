// ==UserScript==
// @name         <%= meta.name %>
// @version      <%= version %>
// @namespace    <%= name %>
// @description  <%= description %>
// @copyright 	 2013-<%= grunt.template.today('yyyy') %> Zixaphir <zixaphirmoxphar@gmail.com>
// @copyright 	 2013-<%= grunt.template.today('yyyy') %> Jordan Bates <saudrapsmann@gmail.com>
// @copyright 	 2009-2011 James Campos <james.r.campos@gmail.com>
// @copyright 	 2012-<%= grunt.template.today('yyyy') %> Nicolas Stepien <stepien.nicolas@gmail.com>
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
// @updateURL 	 <%= meta.repo %>raw/stable/builds/<%= meta.files.metajs %>
// @downloadURL  <%= meta.repo %>raw/stable/builds/<%= meta.files.userjs %>
// @icon         data:image/png;base64,<%= grunt.file.read('src/img/icon48.png', {encoding: 'base64'}) %>
// ==/UserScript==