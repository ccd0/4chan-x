var fs = require('fs');
var path = require('path');

var text = process.argv.slice(2, -1).map(x => fs.readFileSync(x, 'utf8')).join('\n');
text = text.replace(/\r\n/g, '\n');

var outName = process.argv[process.argv.length - 1];
var dir = path.dirname(outName);
if (!fs.existsSync(dir)) fs.mkdirSync(dir);
fs.writeFileSync(outName, text);
