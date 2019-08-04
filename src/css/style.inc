/* jshint esnext: true */

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

return {icons};
