var fs = require('fs');

var filename = process.argv[2];
var script = fs.readFileSync(filename, 'utf8').replace(/\r\n/g, '\n');
var header = '';
var footer = '';
script = script.replace(/^[^]*?\n\n/, x => (header = x, ''));
script = script.replace(/\n\n(.+\n)*$/, (_, x) => (footer = x.slice(1), '\n'));
fs.writeFileSync(filename.replace(/\.js$/, '') + '.hd', header);
fs.writeFileSync(filename.replace(/\.js$/, '') + '.ft', footer);
fs.writeFileSync(filename, script);
