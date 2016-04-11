var fs = require('fs-extra');

fs.removeSync('tmp');
fs.removeSync('testbuilds');
fs.removeSync('builds');
fs.removeSync('.jshintrc');
fs.removeSync('.tests_enabled');
