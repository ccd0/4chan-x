var fs = require('fs');
var JSZip = require('jszip');

var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var v = JSON.parse(fs.readFileSync('version.json', 'utf8'));
var channel = process.argv[2] || '';

var zip = new JSZip();
for (var file of ['script.js', 'eventPage.js', 'icon16.png', 'icon48.png', 'icon128.png', 'manifest.json']) {
  zip.file(
    file,
    fs.readFileSync(`testbuilds/crx${channel}/${file}`),
    {date: new Date(v.date)}
  );
}
zip.generateAsync({
  type: 'nodebuffer',
  compression: 'DEFLATE',
  compressionOptions: {level: 9},
}).then(function(output) {
  fs.writeFileSync(`testbuilds/${pkg.name}${channel}.crx.zip`, output);
}, function() {
  process.exit(1);
});
