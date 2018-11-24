/* jshint esnext: true */

// == Reprocess Font Awesome CSS == //
var fa = (css, font) => (

// Font Awesome CSS attribution and license
css.match(/\/\*\![^]*?\*\//)[0] + '\n' +

// Font Awesome web font
`@font-face {
  font-family: FontAwesome;
  src: url('data:application/font-woff;base64,${font}') format('woff');
  font-weight: 400;
  font-style: normal;
}
` +

// fa-[icon name] classes
css
  .match(/(\.fa-[^{]*{\s*content:[^}]*}\s*)+/)[0]
  .replace(/([,{;])\s+/g, '$1')
  .replace(/,/g, ', ')

);

// == Create CSS for Link Title Favicons == //
var icons = (names, data) => (

'/* Link Title Favicons */\n' +
names.map((file, i) =>
`.linkify.${file.split('.')[1]}::before {
  content: "";
  background: transparent url('data:image/png;base64,${data[i]}') center left no-repeat!important;
  padding-left: 18px;
}
`
).join('')

);

return {fa, icons};
