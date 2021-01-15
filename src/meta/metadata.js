// ==UserScript==
// @name         <%= meta.name %><%= (channel === '-beta') ? ' beta' : '' %>
// @version      <%= readJSON('/version.json').version %>
// @minGMVer     <%= meta.min.greasemonkey %>
// @minFFVer     <%= meta.min.firefox %>
// @namespace    <%= name %>
// @description  <%= description %>
// @license      MIT; <%= meta.license %> 
<%=
  (function() {
    function expand(items, regex, substitutions) {
      var results = [];
      items.forEach(function(item) {
        if (regex.test(item)) {
          substitutions.forEach(function(s) {
            results.push(item.replace(regex, s));
          });
        } else {
          results.push(item);
        }
      });
      return results;
    }
    function expandMatches(matches) {
      return expand(matches, /^\*/, ['http', 'https']);
    }
    return [].concat(
      expandMatches(meta.includes_only.concat(meta.matches, meta.matches_extra)).map(function(match) {
        return '// @include      ' + match;
      }),
      expandMatches(meta.exclude_matches).map(function(match) {
        return '// @exclude      ' + match;
      })
    ).join('\n');
  })()
%>
// @connect      4chan.org
// @connect      4channel.org
// @connect      4cdn.org
// @connect      4chenz.github.io
<%=
  readJSON('/src/Archive/archives.json').map(function(archive) {
    return '// @connect      ' + archive.domain;
  }).join('\n')
%>
// @connect      api.clyp.it
// @connect      api.dailymotion.com
// @connect      api.github.com
// @connect      soundcloud.com
// @connect      api.streamable.com
// @connect      vimeo.com
// @connect      www.youtube.com
// @connect      *
<%=
  meta.grants.map(function(grant) {
    return '// @grant        ' + grant;
  }).join('\n')
%>
// @run-at       document-start
// @updateURL    <%= (channel !== '-noupdate') ? `${meta.downloads}${name}${channel}.meta.js` : 'https://noupdate.invalid/' %>
// @downloadURL  <%= (channel !== '-noupdate') ? `${meta.downloads}${name}${channel}.user.js` : 'https://noupdate.invalid/' %>
// @icon         data:image/png;base64,<%= readBase64('/src/meta/icon48.png') %>
// ==/UserScript==
