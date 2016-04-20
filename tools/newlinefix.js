var fs = require('fs');

var text = fs.readFileSync(process.argv[2], 'utf8');
text = text.replace(/\r\n/g, '\n');
fs.writeFileSync(process.argv[3], text);
