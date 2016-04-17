var fs = require('fs');
var webstore_upload = require('webstore-upload');

var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var secrets = JSON.parse(fs.readFileSync(`../${pkg.meta.path}.keys/chrome-store.json`, 'utf8'));

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
}, 'default').catch(function(err) {
  var code;
  try {
    code = JSON.parse(err).more.error.itemError[0].error_code;
  } catch(err2) {
  }
  // PKG_INVALID_VERSION_NUMBER occurs when re-uploading an old version
  if (code !== 'PKG_INVALID_VERSION_NUMBER') {
    process.exit(1);
  }
});
