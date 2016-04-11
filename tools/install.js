var fs = require('fs-extra');

try {
  var installMap = fs.readJsonSync('install.json');
  for (src in installMap) {
    for (dest of installMap[src]) {
      fs.copySync(src, dest);
    }
  }
} catch(err) {
  if (err.code !== 'ENOENT') {
    throw err;
  }
}
