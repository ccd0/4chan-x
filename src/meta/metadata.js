// ==UserScript==
// @name         <%= meta.name %>
// @version      <%= version %>
// @namespace    <%= name %>
// @description  <%= description %>
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
// @updateURL    <%= meta.page %><%= meta.buildsPath %><%= name %>.meta.js
// @downloadURL  <%= meta.page %><%= meta.buildsPath %><%= name %>.user.js
// @icon         data:image/png;base64,<%= grunt.file.read('src/img/icon48.png', {encoding: 'base64'}) %>
// ==/UserScript==
