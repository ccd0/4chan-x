var fs = require('fs');
var md = require('markdown-it')({linkify: true}).use(require('markdown-it-anchor'), {slugify: s => String(s).trim().toLowerCase().replace(/\W+/g, '-')});
var template = require('lodash.template');

var readme = fs.readFileSync('README.md', 'utf8');
var content = md.render(readme);
var webtemplate = fs.readFileSync('template.jst', 'utf8');
var output = template(webtemplate)({content: content});
output = output.replace(/\r\n/g, '\n');
fs.writeFileSync('test.html', output);
