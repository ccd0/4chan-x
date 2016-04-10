var fs = require('fs');
var marked = require('marked');
var _ = require('lodash');

var md = fs.readFileSync('README.md', 'utf8');
var content = marked(md);
var template = fs.readFileSync('template.jst', 'utf8');
var output = _.template(template)({content: content});
output = output.replace(/\r\n/g, '\n');
fs.writeFileSync('test.html', output);
