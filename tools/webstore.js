var fs = require('fs');
var child_process = require('child_process');
var request = require('request');

var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var v = JSON.parse(child_process.execSync('git show stable:version.json').toString());
var secrets = JSON.parse(fs.readFileSync(`../${pkg.meta.path}.keys/chrome-store.json`, 'utf8'));
var refresh = JSON.parse(fs.readFileSync(`../${pkg.meta.path}.keys/refresh-token.json`, 'utf8'));

var webStore = require('chrome-webstore-upload')({
  extensionId: pkg.meta.chromeStoreID,
  clientId: secrets.installed.client_id,
  clientSecret: secrets.installed.client_secret,
  refreshToken: refresh.refresh_token
});

request(`https://chrome.google.com/webstore/detail/${pkg.meta.chromeStoreID}`, function (error, response, body) {

  if (body && body.indexOf(`<meta itemprop="version" content="${v.version}"/>`) > 0 && process.argv[2] !== 'force') {
    console.log(`Version ${v.version} already uploaded.`);
    return;
  }

  var myZipFile = fs.createReadStream(`dist/builds/${pkg.name}.zip`);
  var token;
  webStore.fetchToken().then(t => {
    token = t;
    return webStore.uploadExisting(myZipFile, token);
  }).then(() =>
    webStore.publish()
  ).catch(res => {
    console.error(res);
    process.exit(1);
  });

});
