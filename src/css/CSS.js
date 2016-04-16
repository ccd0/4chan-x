CSS = {

boards:
<%= multiline(require_style()()) %>,

report:
<%= multiline(read('src/css/report.css')) %>,

www:
<%= multiline(read('src/css/www.css')) %>

};
