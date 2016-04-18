var fs = require('fs');
var marked = require('marked');
var template = require('lodash.template');

var md = fs.readFileSync('README.md', 'utf8');
var content = marked(md);
var webtemplate = fs.readFileSync('template.jst', 'utf8');
var output = template(webtemplate)({content: content});
output = output.replace(/\r\n/g, '\n');
fs.writeFileSync('test.html', output);
