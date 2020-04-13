var fs = require('fs');
var path = require('path');
var parser = require('sax').parser(true);
var BoundingHelper = require('svg-boundings');
var svgo = new (require('svgo'))({plugins: [{cleanupNumericValues: false}]});

var variables = require.resolve('font-awesome/less/variables.less');
var font = require.resolve('font-awesome/fonts/fontawesome-webfont.svg');

var characters = new Map();
var lines = fs.readFileSync(variables, {encoding: 'utf-8'}).split('\n');
for (var line of lines) {
  var match = line.match(/^@fa-var-([\w-]+):\s*"\\([0-9a-z]{4})"/);
  if (match) {
    var character = String.fromCharCode(parseInt(match[2], 16));
    characters.set(match[1], character);
  }
}

var glyphs = new Map();
var parser = require('sax').parser(true);
parser.onopentag = function(x) {
  if (x.name == 'glyph') {
    glyphs.set(x.attributes.unicode, x.attributes.d);
  }
};
parser.write(fs.readFileSync(font)).close();

async function generate(name, offsetX, offsetY) {
  var path = glyphs.get(characters.get(name));
  var bounds = BoundingHelper.path({type: 'path', d: path}, true);
  var svg = `<svg xmlns="http://www.w3.org/2000/svg" class="inline-svg--fa" data-icon="${name}" viewBox="${offsetX} ${offsetY} ${bounds.width} ${bounds.height}"><g transform="scale(1 -1) translate(${-bounds.left + offsetX}, ${-bounds.bottom - offsetY})"><path fill="currentColor" d="${path}"/></g></svg>`;
  svg = (await svgo.optimize(svg)).data;
  return svg;
}

async function save(name, offsetX, offsetY) {
  var svg = await generate(name.replace(/_/g, '-'), offsetX, offsetY);
  var dest = path.resolve(__dirname, '..', 'src', 'Icons', `${name}.svg`);
  return fs.promises.writeFile(dest, svg);
}

var args = process.argv.slice(2);
save(args[0], +(args[1] || "0"), +(args[2] || "0"));
