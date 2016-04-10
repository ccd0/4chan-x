fs = require 'fs'
dateFormat = require 'dateformat'

pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
v = JSON.parse(fs.readFileSync('version.json', 'utf8'))
level = +process.argv[2]

parts = v.version.split '.'
parts[i] or= '0' for i in [0...level]
parts[level-1] = +parts[level-1] + 1
parts[i] = 0 for i in [level...parts.length]
version = parts.join '.'

oldversion = v.version
v.version = version
v.date = new Date()
fs.writeFileSync 'version.json', JSON.stringify(v, null, 2) + '\n'
console.log "Version updated from v#{oldversion} to v#{version}."

{meta, name} = pkg
{oldVersions} = meta

branch       = version.replace /\.\d+$/, ''
headerLevel  = branch.replace(/(\.0)*$/, '').split('.').length
headerPrefix = new Array(headerLevel + 1).join '#'
separator    = "#{headerPrefix} v#{branch}"

today    = dateFormat v.date, 'yyyy-mm-dd'
filename = "/builds/#{name}-noupdate"
ffLink   = "#{oldVersions}#{version}#{filename}.user.js"
crLink   = "#{oldVersions}#{version}#{filename}.crx"
line     = "**v#{version}** *(#{today})* - [[Firefox](#{ffLink} \"Firefox version\")] [[Chromium](#{crLink} \"Chromium version\")]"

changelog = fs.readFileSync 'CHANGELOG.md', 'utf8'

breakPos = changelog.indexOf(separator)
throw new Error 'Separator not found.' if breakPos is -1
breakPos += separator.length

prevVersion = changelog[breakPos..].match(/\*\*v([\d\.]+)\*\*/)[1]
unless prevVersion.replace(/\.\d+$/, '') is branch
  line += "\n- Based on v#{prevVersion}."

fs.writeFileSync 'CHANGELOG.md', "#{changelog[...breakPos]}\n\n#{line}#{changelog[breakPos..]}"
console.log "Changelog updated for v#{version}."
