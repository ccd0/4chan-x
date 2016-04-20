CSS = {

boards:
<%= multiline(require['style']()()) %>,

report:
<%= multiline(read('report.css')) %>,

www:
<%= multiline(read('www.css')) %>

};
