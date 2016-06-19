var fs = require('fs');
var child_process = require('child_process');

var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var v   = JSON.parse(fs.readFileSync('version.json', 'utf8'));

var name = pkg.name;
var oldVersions = pkg.meta.oldVersions;
var version = v.version;
var date = v.date;

var branch       = version.replace(/\.\d+$/, '');
var headerLevel  = branch.replace(/(\.0)*$/, '').split('.').length;
var headerPrefix = new Array(headerLevel + 1).join('#');
var separator    = `${headerPrefix} v${branch}`;

var today    = date.split('T')[0];
var filename = `/builds/${name}-noupdate`;
var ffLink   = `${oldVersions}${version}${filename}.user.js`;
var crLink   = `${oldVersions}${version}${filename}.crx`;
var line     = `**v${version}** *(${today})* - [[Userscript](${ffLink})] [[Chrome extension](${crLink})]`;

var changelog = fs.readFileSync('CHANGELOG.md', 'utf8');

var breakPos = changelog.indexOf(separator);
if (breakPos < 0) throw new Error('Separator not found.');
breakPos += separator.length;

var prevVersion = changelog.substr(breakPos).match(/\*\*v([\d\.]+)\*\*/)[1];
if (prevVersion.replace(/\.\d+$/, '') !== branch) {
  line += `\n- Based on v${prevVersion}.`;
}
line += '\n- ' + child_process.execSync(`git log --pretty=format:%s ${prevVersion}..HEAD`).toString().replace(/\n/g, '\n- ');

fs.writeFileSync('CHANGELOG.md', `${changelog.substr(0, breakPos)}\n\n${line}${changelog.substr(breakPos)}`, 'utf8');
console.log(`Changelog updated for v${version}.`);
