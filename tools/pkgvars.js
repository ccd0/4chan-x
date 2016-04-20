var fs = require('fs');

var pkg = JSON.parse(fs.readFileSync('package.json'));

console.log(
`$(eval name := ${pkg.name})
$(eval meta_name := ${pkg.meta.name})
$(eval meta_distBranch := ${pkg.meta.distBranch})
$(eval meta_awsBucket := ${pkg.meta.awsBucket})
`);
