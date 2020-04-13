var fs = require('fs');
var path = require('path');
var parser = require('sax').parser(true);
var BoundingHelper = require('svg-boundings');
var svgo = new (require('svgo'))();

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
  if (x.name == 'glyph' && x.attributes.unicode && x.attributes.d) {
    glyphs.set(x.attributes.unicode, x.attributes.d);
  }
};
parser.write(fs.readFileSync(font)).close();

async function generate(name) {
  var path = glyphs.get(characters.get(name));
  if (!path) {
    throw new Error('Icon not found');
  }
  var bounds = BoundingHelper.path({type: 'path', d: path}, true);
  var translateX = -Math.floor(bounds.left);
  var translateY = Math.ceil(bounds.bottom);
  var svg = `<svg xmlns="http://www.w3.org/2000/svg" class="inline-svg--fa" data-icon="${name}" viewBox="${bounds.left + translateX} ${-bounds.bottom + translateY} ${bounds.width} ${bounds.height}"><g transform="scale(1 -1) translate(${translateX}, ${-translateY})"><path fill="currentColor" d="${path}"/></g></svg>`;
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
