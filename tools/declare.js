var fs = require('fs');

var names = [];
for (var d of fs.readdirSync('src')) {
  for (var f of fs.readdirSync(`src/${d}`)) {
    var m = f.match(/^([$A-Z][$\w]*)\.(?:coffee|js)$/);
    if (m) names.push(m[1]);
  }
}
var decl = `var ${names.sort().join(', ')};\n`;
var oldDecl;
try {
  oldDecl = fs.readFileSync('tmp/declaration.js', 'utf8');
} catch(err) {
}
if (decl !== oldDecl) {
  fs.writeFileSync('tmp/declaration.js', decl, 'utf8');
}
