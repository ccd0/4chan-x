var fs = require('fs-extra');

var text = process.argv.slice(2, -1).map(x => fs.readFileSync(x, 'utf8')).join('\n');
text = text.replace(/\r\n/g, '\n');

var outName = process.argv[process.argv.length - 1];
fs.outputFileSync(outName, text);
