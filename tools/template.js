/* jshint evil: true */
var fs = require('fs');
var path = require('path');
var _template = require('lodash.template');
var esprima = require('esprima');

// disable ES6 delimiters
var _templateSettings = {interpolate: /<%=([\s\S]+?)%>/g};

// Functions used in templates.
var tools = {};

var read     = tools.read     = filename => fs.readFileSync(filename, 'utf8').replace(/\r\n/g, '\n');
var readJSON = tools.readJSON = filename => JSON.parse(read(filename));
tools.readBase64              = filename => fs.readFileSync(filename).toString('base64');

tools.readHTML = function(filename) {
  var text = read(filename).replace(/^ +/gm, '').replace(/\r?\n/g, '');
  text = _template(text, _templateSettings)(pkg); // package.json data only; no recursive imports
  return tools.html(text);
};

tools.multiline = function(text) {
  return text.replace(/\n+/g, '\n').split(/^/m).map(JSON.stringify).join('+').replace(/"\+"/g, '\\\n');
};

// Convert JSONify-able object to Javascript expression.
var constExpression = data => JSON.stringify(data).replace(/`/g, '\\`');

function TextStream(text) {
  this.text = text;
}

TextStream.prototype.eat = function(regexp) {
  var match = regexp.exec(this.text);
  if (match && match.index === 0) {
    this.text = this.text.slice(match[0].length);
  }
  return match;
};

function parseHTMLTemplate(stream, context) {
  var template = stream.text; // text from beginning, for error messages
  var expression = new HTMLExpression(context);
  var match;

  try {

    while (stream.text) {
      // Literal HTML
      if ((match = stream.eat(
        // characters not indicating start or end of placeholder, using backslash as escape
        /^(?:[^\\{}]|\\.)+(?!{)/
      ))) {
        var unescaped = match[0].replace(/\\(.)/g, '$1');
        expression.addLiteral(unescaped);

      // Placeholder
      } else if ((match = stream.eat(
        // symbol identifying placeholder type and first argument (enclosed by {})
        // backtick not allowed in arguments as it can end embedded JS in Coffeescript
        /^([^}]){([^}`]*)}/
      ))) {
        var type = match[1];
        var args = [match[2]];
        if (type === '?') {
          // conditional expression can take up to two subtemplate arguments
          for (var i = 0; i < 2 && stream.eat(/^{/); i++) {
            var subtemplate = parseHTMLTemplate(stream, context);
            args.push(subtemplate);
            if (!stream.eat(/^}/)) {
              throw new Error(`Unexpected characters in subtemplate (${stream.text})`);
            }
          }
        }
        expression.addPlaceholder(new Placeholder(type, args));

      // No match: end of subtemplate (} next) or error
      } else {
        break;
      }
    }

    return expression.build();

  } catch(err) {
    throw new Error(`${err.message}: ${template}`);
  }
}

function HTMLExpression(context) {
  this.parts = [];
  this.startContext = this.endContext = (context || '');
}

HTMLExpression.prototype.addLiteral = function(text) {
  this.parts.push(constExpression(text));
  this.endContext = (
    this.endContext
      .replace(/(=['"])[^'"<>]*/g, '$1')                    // remove values from quoted attributes (no '"<> allowed)
      .replace(/(<\w+)( [\w-]+((?=[ >])|=''|=""))*/g, '$1') // remove attributes from tags
      .replace(/^([^'"<>]+|<\/?\w+>)*/, '')                 // remove text (no '"<> allowed) and tags
  );
};

HTMLExpression.prototype.addPlaceholder = function(placeholder) {
  if (!placeholder.allowed(this.endContext)) {
    throw new Error(`Illegal insertion of placeholder (type ${placeholder.type}) into HTML template (at ${this.endContext})`);
  }
  this.parts.push(placeholder.build());
};

HTMLExpression.prototype.build = function() {
  if (this.startContext !== this.endContext) {
    throw new Error(`HTML template is ill-formed (at ${this.endContext})`);
  }
  return (this.parts.length === 0 ? '""' : this.parts.join(' + '));
};

function Placeholder(type, args) {
  this.type = type;
  this.args = args;
}

Placeholder.prototype.allowed = function(context) {
  switch(this.type) {
    case '$':
      // escaped text allowed outside tags or in quoted attributes
      return (context === '' || /\=['"]$/.test(context));
    case '&':
    case '@':
      // contents of one/many HTML element or template allowed outside tags only
      return (context === '');
    case '?':
      // conditionals allowed anywhere so long as their contents don't change context (checked by HTMLExpression.prototype.build)
      return true;
  }
  throw new Error(`Unrecognized placeholder type (${this.type})`);
};

Placeholder.prototype.build = function() {
  // first argument is always JS expression; validate it so we don't accidentally break out of placeholders
  var expr = this.args[0];
  var ast;
  try {
    ast = esprima.parse(expr);
  } catch (err) {
    throw new Error(`Invalid JavaScript in template (${expr})`);
  }
  if (!(ast.type === 'Program' && ast.body.length == 1 && ast.body[0].type === 'ExpressionStatement')) {
    throw new Error(`JavaScript in template is not an expression (${expr})`);
  }
  switch(this.type) {
    case '$': return `E(${expr})`;        // $ : escaped text
    case '&': return `(${expr}).innerHTML`; // & : contents of HTML element or template (of form {innerHTML: "safeHTML"})
    case '@': return `E.cat(${expr})`;    // @ : contents of array of HTML elements or templates (see src/General/Globals.coffee for E.cat)
    case '?':
      return `((${expr}) ? ${this.args[1] || '""'} : ${this.args[2] || '""'})`; // ? : conditional expression
  }
  throw new Error(`Unrecognized placeholder type (${this.type})`);
};

// HTML template generator with placeholders of forms ${}, &{}, @{}, and ?{}{}{} (see Placeholder.prototype.build)
// that checks safety of generated expressions at compile time.
tools.html = function(template) {
  var stream = new TextStream(template);
  var output = parseHTMLTemplate(stream);
  if (stream.text) {
    throw new Error(`Unexpected characters in template (${stream.text}): ${template}`);
  }
  return `(innerHTML: \`${output}\`)`;
};

tools.assert = function(statement) {
  return `throw new Error 'Assertion failed: ' + \`${constExpression(statement)}\` unless ${statement}`;
};

function includesDir(templateName) {
  var dir = path.dirname(templateName);
  var subdir = path.basename(templateName).replace(/\.[^.]+$/, '');
  if (fs.readdirSync(dir).indexOf(subdir) >= 0) {
    return path.join(dir, subdir);
  } else {
    return dir;
  }
}

function resolvePath(includeName, templateName) {
  var dir;
  if (includeName[0] === '/') {
    dir = process.cwd();
  } else {
    dir = includesDir(templateName);
  }
  return path.join(dir, includeName);
}

function wrapTool(tool, templateName) {
  return function(includeName) {
    return tool(resolvePath(includeName, templateName));
  };
}

function loadModules(templateName) {
  var dir = includesDir(templateName);
  var moduleNames = fs.readdirSync(dir).filter(f => /\.inc$/.test(f));
  var modules = {};
  for (var name of moduleNames) {
    var code = read(path.join(dir, name));
    modules[name.replace(/\.inc$/, '')] = new Function(code)();
  }
  return modules;
}

// Import variables from package.json.
var pkg = readJSON('package.json');

function interpolate(text, data, filename) {
  var context = {}, key;
  for (key in tools) {
    context[key] = /^read/.test(key) ? wrapTool(tools[key], filename) : tools[key];
  }
  for (key in pkg) {
    context[key] = pkg[key];
  }
  if (data) {
    for (key in data) {
      context[key] = data[key];
    }
  }
  context.files = fs.readdirSync(includesDir(filename));
  context.require = loadModules(filename);
  return _template(text, _templateSettings)(context);
}

module.exports = interpolate;

if (require.main === module) {
  (function() {
    // Take variables from command line.
    var data = {};
    for (var i = 4; i < process.argv.length; i++) {
      var m = process.argv[i].match(/(.*?)=(.*)/);
      data[m[1]] = m[2];
    }

    var text = read(process.argv[2]);
    text = interpolate(text, data, process.argv[2]);
    fs.writeFileSync(process.argv[3], text);
  })();
}
