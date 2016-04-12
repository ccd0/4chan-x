var fs = require('fs-extra');

var installMap = fs.readJsonSync('install.json');
for (var src in installMap) {
  for (var dest of installMap[src]) {
    fs.copySync(src, dest);
  }
}
