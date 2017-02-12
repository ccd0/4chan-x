var fs = require('fs');
var crypto = require('crypto');
var RSA = require('node-rsa');

var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var channel = process.argv[2] || '';

var privateKey = fs.readFileSync(`../${pkg.meta.path}.keys/${pkg.name}.pem`);
var archive = fs.readFileSync(`testbuilds/${pkg.name}${channel}.crx.zip`);

// https://developer.chrome.com/extensions/crx

var publicKey = new RSA(privateKey).exportKey('pkcs8-public-der');
var signature = crypto.createSign('sha1').update(archive).sign(privateKey);

var header = Buffer.alloc(16);
header.write('Cr24');
header.writeInt32LE(2, 4);
header.writeInt32LE(publicKey.length, 8);
header.writeInt32LE(signature.length, 12);

var crx = Buffer.concat([header, publicKey, signature, archive]);

fs.writeFileSync(`testbuilds/${pkg.name}${channel}.crx`, crx);
