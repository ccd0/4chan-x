var fs = require('fs');
var template = require('./template');
var coffee = require('coffee-script');
var decaffeinate = require('decaffeinate');

for (var name of process.argv.slice(2)) {
  try {
    var parts = name.match(/^tmp\/([^_]*)(?:_(.*))?-(.*)\.(.*)\.js$/);
    var sourceName = `src/${parts[1]}/${parts[3]}.${parts[4]}`;
    var script = fs.readFileSync(sourceName, 'utf8');
    script = script.replace(/\r\n/g, '\n');
    script = template(script, {type: parts[2]}, sourceName);
    if (!script.trim()) {
      fs.writeFileSync(name, '');
      continue;
    }
    if (parts[4] === 'coffee') {
      var definesVar = /^[$A-Z][$\w]*$/.test(parts[3]);
      try {
        script = decaffeinate.convert(script).code;
        script = script.trim()
        if (definesVar) {
          script += `\n\nreturn ${parts[3]};`;
        }
        script = script.replace(/^(?!$)/gm, '  ');
        script = `(function() {\n${script}\n})();\n`;
        console.log(`decaffeinate succeeded for ${name}`);
      } catch(err) {
        console.log(`decaffeinate failed for ${name}: ${err.message}`);
        if (err.source) {
          var line = err.source.slice(0, err.start).match(/.*$/)[0] + err.source.slice(err.start, err.end) + err.source.slice(err.end).match(/^.*/)[0];
          console.log(line);
        }
        if (definesVar) {
          script = `${script}\nreturn ${parts[3]};\n`;
        }
        script = coffee.compile(script);
      }
      if (definesVar) {
        script = `${parts[3]} = ${script}`;
      }
    }
    script += '\n';
    fs.writeFileSync(name, script);
  } catch (err) {
    console.error(`Error processing ${name}`);
    throw err;
  }
}


