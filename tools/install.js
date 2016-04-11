var fs = require('fs-extra');

var installMap = fs.readJsonSync('install.json');
for (src in installMap) {
  for (dest of installMap[src]) {
    fs.copySync(src, dest);
  }
}
