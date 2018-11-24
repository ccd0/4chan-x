<%
  var inc       = require['style'];
  var faCSS     = read('/node_modules/font-awesome/css/font-awesome.css');
  var faWebFont = readBase64('/node_modules/font-awesome/fonts/fontawesome-webfont.woff');
  var mainCSS   = ['font-awesome', 'style', 'yotsuba', 'yotsuba-b', 'futaba', 'burichan', 'tomorrow', 'photon', 'spooky'].map(x => read(`${x}.css`)).join('');
  var iconNames = files.filter(f => /^linkify\.[^.]+\.png$/.test(f));
  var icons     = iconNames.map(readBase64);
%>CSS = {

boards:
<%= multiline(
  inc.fa(faCSS, faWebFont) + mainCSS + inc.icons(iconNames, icons) + read('supports.css')
) %>,

report:
<%= multiline(read('report.css')) %>,

www:
<%= multiline(read('www.css')) %>

};
