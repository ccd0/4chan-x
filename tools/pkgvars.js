var fs = require('fs');

var pkg = JSON.parse(fs.readFileSync('package.json'));

var vars = {};
var k;

vars.name = pkg.name;
for (k in pkg.meta) {
  vars[`meta_${k}`] = pkg.meta[k];
}
for (k in pkg.devDependencies) {
  vars[`version_${k}`] = pkg.devDependencies[k];
}

for (k in vars) {
  console.log(`\$(eval ${k} := ${vars[k]})`);
}
