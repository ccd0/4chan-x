var fs = require('fs-extra');

if (fs.existsSync('install.json')) {
  var installMap = fs.readJsonSync('install.json');
  for (src in installMap) {
    for (dest of installMap[src]) {
      fs.copySync(src, dest);
    }
  }
}
