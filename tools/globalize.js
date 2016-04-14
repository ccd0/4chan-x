var fs = require('fs');

var filename = process.argv[2];
var sources = process.argv.slice(3);

// Extract variables to be made global from source file list
// e.g. ImageExpand from src/Images/ImageExpand.coffee
// but not QR.post or eventPage
var names = [];
for (var f of sources) {
  f = f.match(/[^/]*$/)[0];
  var m = f.match(/^([$A-Z][$\w]*)\.coffee$/);
  if (m) names.push(m[1]);
}

var script = fs.readFileSync(filename, 'utf8').replace(/\r\n/g, '\n');

var replaced = 0;

script = script.replace(

  // matches declaration at the start of the function, not including helper function assignments
  /^( *var )(.*)(,\n *|;\n)/m,

  function(declaration, v, n, e) {
    replaced++;
    var n0 = names.sort().join(', ');
    if (n0 !== n) throw new Error(`${filename}: expected variables (${n0}) found (${n})`);
    return (e[0] === ',') ? v : '';
  }

);

if (replaced !== 1) {
  throw new Error(`${filename}: no declaration found`);
}

fs.writeFileSync(filename, script);
