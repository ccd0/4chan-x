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
  / *\bvar\s+[$\w]+(,\s*[$\w]+)*(,\s*|;\n)/,

  function(declaration) {
    var parts = declaration.split(/([$\w]+)(?=[,;])/);

    for (var name of names) {
      var i = parts.indexOf(name);
      if (i < 0) {
        throw new Error(`${filename}: ${name} not found`);
      } else if (i !== 1) {
        // not first: remove variable and separator before it
        parts.splice(i - 1, 2);
      } else if (!(i === parts.length - 2 && parts[parts.length - 1][0] === ';')) {
        // not last: remove variable and separator after it
        parts.splice(i, 2);
      } else {
        // removing only variable: nuke whole declaration
        parts = [];
      }
    }

    replaced++;
    return parts.join('');
  }

);

if (replaced !== 1) {
  throw new Error(`${filename}: no declaration found`);
}

fs.writeFileSync(filename, script);
