var fs = require('fs');
var child_process = require('child_process');
var webstore_upload = require('webstore-upload');
var request = require('request');

var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var v = JSON.parse(child_process.execSync('git show stable:version.json').toString());
var secrets = JSON.parse(fs.readFileSync(`../${pkg.meta.path}.keys/chrome-store.json`, 'utf8'));

request(`https://chrome.google.com/webstore/detail/${pkg.meta.chromeStoreID}`, function (error, response, body) {

  if (body && body.indexOf(`<meta itemprop="version" content="${v.version}"/>`) > 0 && process.argv[2] !== 'force') {
    console.log(`Version ${v.version} already uploaded.`);
    return;
  }

  webstore_upload({
    accounts: {
      default: {
        publish: true,
        client_id: secrets.installed.client_id,
        client_secret: secrets.installed.client_secret,
      }
    },
    extensions: {
      extension: {
        appID: pkg.meta.chromeStoreID,
        zip: `dist/builds/${pkg.name}.zip`
      }
    }
  }, 'default').catch(function() {
    process.exit(1);
  });

});
