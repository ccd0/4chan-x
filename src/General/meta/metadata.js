// ==UserScript==
// @name         <%= meta.name %><%= meta.namesuffix[channel] %>
// @version      <%= meta.version %>
// @minGMVer     <%= meta.min.greasemonkey %>
// @minFFVer     <%= meta.min.firefox %>
// @namespace    <%= name %>
// @description  <%= description %>
// @license      MIT; <%= meta.license %> 
<%=
  meta.matches.map(function(match) {
    if (/^\*/.test(match)) {
      return (
        '// @include      ' + match.replace(/^\*/, 'http') + '\n' +
        '// @include      ' + match.replace(/^\*/, 'https')
      );
    } else {
      return '// @include      ' + match;
    }
  }).join('\n')
%>
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @run-at       document-start
<% if (channel !== 'dev') { %><% if (channel !== 'noupdate') { %>// @updateURL 	 <%= meta.downloads %><%= name %><%= meta.suffix[channel] %>.meta.js
<% } %>// @downloadURL  <%= meta.downloads %><%= name %><%= meta.suffix[channel] %>.user.js
<% } %>// @icon         data:image/png;base64,<%= grunt.file.read('src/General/img/icon48.png', {encoding: 'base64'}) %>
// ==/UserScript==
