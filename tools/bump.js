var fs = require('fs');

function bump(version, level) {
  var parts = version.split('.');
  var i;
  for (i = 0; i < level; i++) {
    parts[i] = (parts[i] || '0');
  }
  parts[level-1] = +parts[level-1] + 1;
  for (i = level; i < parts.length; i++) {
    parts[i] = '0';
  }
  return parts.join('.');
}

function setversion(version) {
  var data = {version: version, date: new Date()};
  fs.writeFileSync('version.json', JSON.stringify(data, null, 2));
}

var level = +process.argv[2];
var v = JSON.parse(fs.readFileSync('version.json', 'utf8'));
var oldversion = v.version;
var version = bump(oldversion, level);
setversion(version);
console.log(`Version updated from v${oldversion} to v${version}.`);
