var fs = require('fs');
var JSZip = require('jszip');

var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var v = JSON.parse(fs.readFileSync('version.json', 'utf8'));
var channel = process.argv[2] || '';

var zip = new JSZip();
for (var file of ['eventPage.js', 'icon128.png', 'icon16.png', 'icon48.png', 'manifest.json', 'script.js']) {
  zip.file(
    file,
    fs.readFileSync(`testbuilds/crx${channel}/${file}`),
    {date: new Date(v.date)}
  );
}
var output = zip.generate({
  type: 'nodebuffer',
  compression: 'DEFLATE',
  compressionOptions: {level: 9},
});
fs.writeFileSync(`testbuilds/${pkg.name}${channel}.crx.zip`, output);
