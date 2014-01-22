// ==UserScript==
// @name         <%= meta.name %>
// @version      <%= version %>
// @minGMVer     <%= meta.min.greasemonkey %>
// @minFFVer     <%= meta.min.firefox %>
// @namespace    <%= name %>
// @description  <%= description %>
// @license      MIT; <%= meta.repo %>blob/<%= meta.mainBranch %>/LICENSE
<%=
  meta.matches.map(function(match) {
    return '// @match        ' + match;
  }).join('\n')
%>
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @run-at       document-start
// @updateURL    <%= meta.page %><%= meta.buildsPath %><%= name %>.meta.js
// @downloadURL  <%= meta.page %><%= meta.buildsPath %><%= name %>.user.js
// @icon         data:image/png;base64,<%= grunt.file.read('img/icon48.png', {encoding: 'base64'}) %>
// ==/UserScript==
