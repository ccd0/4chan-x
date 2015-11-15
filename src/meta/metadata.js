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
<%=
  meta.grants.map(function(grant) {
    return '// @grant        ' + grant;
  }).join('\n')
%>
// @run-at       document-start
<% if (channel !== 'dev') { %>// @updateURL    <%= (channel !== 'noupdate') ? (meta.downloads + name + meta.suffix[channel] + '.meta.js') : 'https://noupdate.invalid/' %>
// @downloadURL  <%= (channel !== 'noupdate') ? (meta.downloads + name + meta.suffix[channel] + '.user.js') : 'https://noupdate.invalid/' %>
<% } %>// @icon         data:image/png;base64,<%= grunt.file.read('src/meta/icon48.png', {encoding: 'base64'}) %>
// ==/UserScript==
