var fs = require('fs');
var path = require('path');
var parser = require('sax').parser(true);
var BoundingHelper = require('svg-boundings');
var svgo = new (require('svgo'))();

var PIXEL = 128;

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
  var a = x.attributes;
  if (x.name == 'glyph' && a.unicode && a.d) {
    glyphs.set(a.unicode, a);
  }
};
parser.write(fs.readFileSync(font)).close();

async function generate(name) {
  var glyph = glyphs.get(characters.get(name));
  if (!glyph) {
    throw new Error('Icon not found');
  }
  var width = Math.ceil((glyph['horiz-adv-x'] || 1536) / PIXEL);
  var bounds = BoundingHelper.path({type: 'path', d: glyph.d}, true);
  var top = Math.floor(bounds.top / PIXEL);
  var bottom = Math.ceil(bounds.bottom / PIXEL);
  var height = bottom - top;
  var svg = `<svg xmlns="http://www.w3.org/2000/svg" class="inline-svg--fa" width="${width}" height="${height}" viewBox="0 0 ${width*PIXEL} ${height*PIXEL}"><g transform="scale(1 -1) translate(0, ${-bottom*PIXEL})"><path fill="currentColor" d="${glyph.d}"/></g></svg>`;
  svg = (await svgo.optimize(svg)).data;
  return svg;
}

async function save(name) {
  try {
    var svg = await generate(name.replace(/_/g, '-'));
    var dest = path.resolve(__dirname, '..', 'src', 'Icons', `${name}.svg`);
    return fs.promises.writeFile(dest, svg);
  } catch(err) {
    console.error(`Error generating icon ${name}:`, err);
  }
}

Promise.all(process.argv.slice(2).map(save));
