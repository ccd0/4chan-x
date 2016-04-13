var fs = require('fs');

var names = [];
for (var d of fs.readdirSync('src')) {
  for (var f of fs.readdirSync(`src/${d}`)) {
    var m = f.match(/^([$A-Z]\w*)\.coffee$/);
    if (m) names.push(m[1]);
  }
}
fs.writeFileSync('tmp/declaration.js', `var ${names.sort().join(', ')};\n`);
