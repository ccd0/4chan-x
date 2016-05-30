var fs = require('fs');

var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

console.log(
  Object.keys(pkg.devDependencies).filter(
    name => !/^=/.test(pkg.devDependencies[name])
  ).map(
    name => `${name}@${process.argv[2] || pkg.devDependencies[name]}`
  ).join(' ')
);
