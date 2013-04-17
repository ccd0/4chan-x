// ==UserScript==
// @name         <%= meta.name %>
// @version      <%= version %>
// @namespace    <%= meta.namespace %>
// @description  <%= description %>
// @copyright    2012-2013 Zixaphir <zixaphirmoxphar@gmail.com>
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
