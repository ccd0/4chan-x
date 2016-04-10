var fs = require('fs-extra');

if (fs.existsSync('install.json')) {
  var pairs = fs.readJsonSync('install.json');
  for (pair of pairs) {
    fs.copySync(pair[0], pair[1]);
  }
}
