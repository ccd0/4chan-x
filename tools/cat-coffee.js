var fs = require('fs');

var inputFiles = process.argv.slice(2, -1);

var allVars = [];
var allHelperNames = [];
var allHelperValues = {};
var allBodies = [];

for (var file of inputFiles) {
  var inputText = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

  var parts = inputText.match(/^\(function\(\) {\n  var ([\w$]+(?:, [\w$]+)*)((?:,\n    [\w$]+ = .*)*);\n\n([^]*)\n\n}\)\.call\(this\);\n$/);
  if (!parts) throw new Error(`${file}: unexpected format`);

  var vars = parts[1].split(', ');
  for (var v of vars) {
    if (allVars.indexOf(v) >= 0) {
      throw new Error(`${file}: reused variable name ${v}`);
    }
    if (allHelperNames.indexOf(v) >= 0) {
      throw new Error(`${file}: variable clashes with helper ${v}`);
    }
    allVars.push(v);
  }

  var helpers = parts[2].split(',\n    ').slice(1);
  for (var h of helpers) {
    var hparts = h.match(/^([\w$]+) = (.*)$/);
    var hn = hparts[1];
    var hv = hparts[2];
    if (allVars.indexOf(hn) >= 0) {
      throw new Error(`${file}: helper clashes with variable ${v}`);
    }
    if (allHelperNames.indexOf(hn) >= 0) {
      if (allHelperValues[hn] !== hv) {
        throw new Error(`${file}: redefined helper ${hn}`);
      }
    } else {
      allHelperNames.push(hn);
      allHelperValues[hn] = hv;
    }
  }

  var body = parts[3];
  allBodies.push(body);
}

var varText = allVars.sort().join(', ');
var helperText = allHelperNames.map(hn => `,\n    ${hn} = ${allHelperValues[hn]}`).join('');
var bodyText = allBodies.join('\n\n');

var outputText = `(function() {\n  var ${varText}${helperText};\n\n${bodyText}\n\n}).call(this);\n`;

var outputName = process.argv[process.argv.length - 1];
fs.writeFileSync(outputName, outputText);
