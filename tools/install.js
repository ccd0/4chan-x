var fs = require('fs');

var installMap = JSON.parse(fs.readFileSync('install.json', 'utf8'));
for (var src in installMap) {
  for (var dest of installMap[src]) {
    fs.writeFileSync(dest, fs.readFileSync(src));
  }
}
