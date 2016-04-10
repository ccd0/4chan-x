var fs = require('fs-extra');

fs.copySync(process.argv[2], process.argv[3]);
