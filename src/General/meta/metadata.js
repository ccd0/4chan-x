// ==UserScript==
// @name         <%= meta.name %>
// @version      <%= meta.version %>
// @minGMVer     <%= meta.min.greasemonkey %>
// @minFFVer     <%= meta.min.firefox %>
// @namespace    <%= meta.namespace %>
// @description  <%= description %>
// @license      MIT; <%= meta.repo %>blob/<%= meta.mainBranch %>/LICENSE 
<%=
  meta.matches.map(function(match) {
    return '// @match        ' + match;
  }).join('\n')
%>
<%=
  meta.excludes.map(function(exclude) {
    return '// @exclude      ' + exclude;
  }).join('\n')
%>
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @updateURL 	 <%= meta.downloads %><%= meta.files.metajs %>
// @downloadURL  <%= meta.downloads %><%= meta.files.userjs %>
// @icon         data:image/png;base64,<%= grunt.file.read('src/General/img/icon48.png', {encoding: 'base64'}) %>
// ==/UserScript==
