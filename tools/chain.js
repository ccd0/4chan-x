var fs = require('fs');
var template = require('./template');
var coffee = require('coffee-script');
var globalize = require('./globalize');

for (var name of process.argv.slice(2)) {
  try {
    var parts = name.split('_');
    var basename = parts[0]; // e.g. template_crx -> template
    var script = fs.readFileSync(`tmp/${basename}.jst`, 'utf8');
    script = script.replace(/\r\n/g, '\n');
    script = template(script, {type: parts[1]});
    if (fs.readdirSync(`src/${basename}`).some(f => /\.coffee$/.test(f))) {
      script = coffee.compile(script);
      var varNames = globalize.getNames(name);
      script = globalize.globalize(script, varNames);
    }
    fs.writeFileSync(`tmp/${name}.js`, script);
  } catch (err) {
    console.error(`Error processing ${name}`);
    throw err;
  }
}


