// ==UserScript==
// @name         <%= meta.name %>
// @version      <%= version %>
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
// @grant        GM_openInTab
// @run-at       document-start
// @updateURL 	 <%= meta.repo %>raw/stable/builds/<%= meta.files.metajs %>
// @downloadURL  <%= meta.repo %>raw/stable/builds/<%= meta.files.userjs %>
// @icon         data:image/png;base64,<%= grunt.file.read('src/General/img/icon48.png', {encoding: 'base64'}) %>
// ==/UserScript==