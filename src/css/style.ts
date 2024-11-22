// == Reprocess Font Awesome CSS == //
export const fa = (css: string, font: string) => (

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
export const icons = (data: { name: string, data: string }[]) => (

  '/* Link Title Favicons */\n' +
  data.map(({ name, data }) =>
    `.linkify.${name}::before {
  content: "";
  background: transparent url('data:image/png;base64,${data}') center left no-repeat!important;
  padding-left: 18px;
}
`
  ).join('')

);
