var fs = require('fs');

var read       = filename => fs.readFileSync(filename, 'utf8').replace(/\r\n/g, '\n');
var readBase64 = filename => fs.readFileSync(filename).toString('base64');

module.exports = () => (

// Font Awesome CSS attribution and license
read('node_modules/font-awesome/css/font-awesome.css').match(/\/\*\![^]*?\*\//)[0] + '\n' +

// Font Awesome web font
`@font-face {
  font-family: FontAwesome;
  src: url('data:application/font-woff;base64,${readBase64('node_modules/font-awesome/fonts/fontawesome-webfont.woff')}') format('woff');
  font-weight: 400;
  font-style: normal;
}
` +

// fa-[icon name] classes
read('node_modules/font-awesome/css/font-awesome.css')
  .match(/(\.fa-[^{]*{\s*content:[^}]*}\s*)+/)[0]
  .replace(/([,{;])\s+/g, '$1')
  .replace(/,/g, ', ') +

[
  'font-awesome',
  'style',
  'yotsuba', 'yotsuba-b', 'futaba', 'burichan', 'tomorrow', 'photon'
].map(
  name => read(`src/css/${name}.css`)
).join('') +

'/* Link Title Favicons */\n' +
fs.readdirSync('src/css').filter(file =>
  /^linkify\.[^.]+\.png$/.test(file)
).map(file =>
`.linkify.${file.split('.')[1]} {
  background: transparent url('data:image/png;base64,${readBase64(`src/css/${file}`)}') center left no-repeat!important;
  padding-left: 18px;
}
`
).join('') +

// XXX Moved to end of stylesheet to avoid breaking whole stylesheet in Maxthon.
read('src/css/supports.css')

);
