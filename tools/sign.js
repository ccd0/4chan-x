var fs = require('fs');
var crx = require('crx');

var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var channel = process.argv[2] || '';

var privateKey = fs.readFileSync(`../${pkg.meta.path}.keys/${pkg.name}.pem`);
var archive = fs.readFileSync(`testbuilds/${pkg.name}${channel}.crx.zip`);
var extension = new crx({privateKey, loaded: true});
extension.pack(archive).then((data) =>
  fs.writeFileSync(`testbuilds/${pkg.name}${channel}.crx`, data)
).catch(function(err) {
  console.error(err);
  process.exit(1);
});
