path = require 'path'
crx = require 'crx'
JSZip = require 'jszip'

module.exports = (grunt) ->
  grunt.util.linefeed = '\n'

  json = (data) ->
    "`#{JSON.stringify(data).replace(/`/g, '\\`')}`"

  importCSS = (filenames...) ->
    grunt.template.process(
      filenames.map((name) -> grunt.file.read "src/General/css/#{name}.css").join(''),
      {data: grunt.config 'pkg'}
    ).trim().replace(/\n+/g, '\n').split(/^/m).map(JSON.stringify).join(' +\n').replace(/`/g, '\\`')

  importHTML = (filename) ->
    html grunt.template.process(grunt.file.read("src/General/html/#{filename}.html").replace(/^ +/gm, '').replace(/\r?\n/g, ''), data: grunt.config('pkg'))

  parseTemplate = (template, context='') ->
    context0 = context
    parts = []
    text = template
    while text
      if part = text.match /^(?:[^{}\\]|\\.)+(?!{)/
        text = text[part[0].length..]
        unescaped = part[0].replace /\\(.)/g, '$1'
        context = (context + unescaped)
          .replace(/(=['"])[^'"<>]*/g, '$1')
          .replace(/(<\w+)( [\w-]+((?=[ >])|=''|=""))*/g, '$1')
          .replace(/^([^'"<>]+|<\/?\w+>)*/, '')
        parts.push json unescaped
      else if part = text.match /^([^}]){([^}`]*)}/
        text = text[part[0].length..]
        unless context is '' or (part[1] is '$' and /\=['"]$/.test context) or part[1] is '?'
          throw new Error "Illegal insertion into HTML template (at #{context}): #{template}"
        parts.push switch part[1]
          when '$' then "E(`#{part[2]}`)"
          when '&' then "`#{part[2]}`.innerHTML"
          when '@' then "E.cat(`#{part[2]}`)"
          when '?'
            args = ['""', '""']
            for i in [0...2]
              break if text[0] isnt '{'
              text = text[1..]
              [args[i], text] = parseTemplate text, context
              if text[0] isnt '}'
                throw new Error "Unexpected characters in subtemplate (#{text}): #{template}"
              text = text[1..]
            "(if `#{part[2]}` then #{args[0]} else #{args[1]})"
          else
            throw new Error "Unrecognized substitution operator (#{part[1]}): #{template}"
      else
        break
    if context isnt context0
      throw new Error "HTML template is ill-formed (at #{context}): #{template}"
    output = if parts.length is 0 then '""' else parts.join ' + '
    [output, text]

  html = (template) ->
    [output, remaining] = parseTemplate template
    if remaining
      throw new Error "Unexpected characters in template (#{remaining}): #{template}"
    "(innerHTML: #{output})"

  assert = (statement, objs...) ->
    return '' unless grunt.config('pkg').tests_enabled
    "throw new Error 'Assertion failed: ' + #{json statement} unless #{statement}"

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    concat:
      options: process: Object.create(null, data:
        get: ->
          pkg = grunt.config 'pkg'
          pkg.importCSS  = importCSS
          pkg.importHTML = importHTML
          pkg.html = html
          pkg.assert = assert
          pkg.tests_enabled or= false
          pkg
        enumerable: true
      )
      coffee:
        src: [
          'src/General/Config.coffee'
          'src/General/Globals.coffee'
          'src/General/lib/*.coffee'
          'src/General/Header.coffee'
          'src/General/Index.coffee'
          'src/General/Build.coffee'
          'src/General/Get.coffee'
          'src/General/UI.coffee'
          'src/General/Notice.coffee'
          'src/General/CrossOrigin.coffee'
          'src/General/BuildTest.coffee'
          'src/Filtering/**/*.coffee'
          'src/Quotelinks/**/*.coffee'
          'src/Posting/QR.coffee'
          'src/Posting/Captcha.coffee'
          'src/Posting/**/*.coffee'
          'src/Images/**/*.coffee'
          'src/Linkification/**/*.coffee'
          'src/Menu/**/*.coffee'
          'src/Monitoring/**/*.coffee'
          'src/Archive/**/*.coffee'
          'src/Miscellaneous/**/*.coffee'
          'src/General/Settings.coffee'
          'src/General/Main.coffee'
        ]
        dest: 'tmp-<%= pkg.type %>/script.coffee'
      crx:
        files:
          'testbuilds/updates<%= pkg.meta.suffix[pkg.channel] %>.xml': 'src/General/meta/updates.xml'
          'testbuilds/crx<%= pkg.meta.suffix[pkg.channel] %>/manifest.json': 'src/General/meta/manifest.json'
          'testbuilds/crx<%= pkg.meta.suffix[pkg.channel] %>/script.js': [
            'src/General/meta/botproc.js'
            'LICENSE'
            'src/General/meta/usestrict.js'
            'tmp-<%= pkg.type %>/script.js'
          ]
          'testbuilds/crx<%= pkg.meta.suffix[pkg.channel] %>/eventPage.js': 'tmp-<%= pkg.type %>/eventPage.js'
      userscript:
        files:
          'testbuilds/<%= pkg.name %><%= pkg.meta.suffix[pkg.channel] %>.meta.js': 'src/General/meta/metadata.js'
          'testbuilds/<%= pkg.name %><%= pkg.meta.suffix[pkg.channel] %>.user.js': [
            'src/General/meta/botproc.js'
            'src/General/meta/metadata.js'
            'LICENSE'
            'src/General/meta/usestrict.js'
            'tmp-<%= pkg.type %>/script.js'
          ]

    copy:
      crx:
        src:  'src/General/img/*.png'
        dest: 'testbuilds/crx<%= pkg.meta.suffix[pkg.channel] %>/'
        expand:  true
        flatten: true
      zip:
        src:  'testbuilds/<%= pkg.name %><%= pkg.meta.suffix.noupdate %>.crx.zip'
        dest: 'testbuilds/<%= pkg.name %>.zip'
      builds:
        cwd: 'testbuilds/'
        src: '*'
        dest: 'builds/'
        expand: true
        filter: (src) ->
          pkg = grunt.config 'pkg'
          grunt.file.isFile(src) and not grunt.file.isMatch(src, "testbuilds/#{pkg.name}#{pkg.meta.suffix.dev}.user.js") and not /\.crx\.zip$/.test(src)
      install:
        files: if grunt.file.exists('install.json') then grunt.file.readJSON('install.json') else []
      web:
        src:  'test.html'
        dest: 'index.html'

    coffee:
      script:
        src:  'tmp-<%= pkg.type %>/script.coffee'
        dest: 'tmp-<%= pkg.type %>/script.js'
      eventPage:
        src:  'src/General/eventPage/eventPage.coffee'
        dest: 'tmp-<%= pkg.type %>/eventPage.js'

    concurrent:
      build: [
        'build-crx'
        'build-userscript'
      ]

    shell:
      options:
        stdout: true
        stderr: true
        failOnError: true
      commit:
        command: """
          git commit -am "Release <%= pkg.meta.name %> v<%= pkg.meta.version %>."
          git tag -a <%= pkg.meta.version %> -m "<%= pkg.meta.name %> v<%= pkg.meta.version %>."
        """.split('\n').join('&&')
      beta:
        command: """
          git tag -af beta -m "<%= pkg.meta.name %> v<%= pkg.meta.version %>."
          git checkout gh-pages
          git pull
          git merge --no-commit -s ours beta
          git checkout beta "builds/*<%= pkg.meta.suffix.beta %>.*" LICENSE CHANGELOG.md img .gitignore .gitattributes
          git commit -am "Move <%= pkg.meta.name %> v<%= pkg.meta.version %> to beta channel."
          git checkout -
        """.split('\n').join('&&')
      stable:
        command: """
          git push . HEAD:bstable
          git tag -af stable -m "<%= pkg.meta.name %> v<%= pkg.meta.version %>."
          git checkout gh-pages
          git pull
          git merge --no-commit -s ours stable
          git checkout stable "builds/<%= pkg.name %>.*" builds/updates.xml
          git commit -am "Move <%= pkg.meta.name %> v<%= pkg.meta.version %> to stable channel."
          git checkout -
        """.split('\n').join('&&')
      'commit-web':
        command: 'git commit -am "Build web page."'
      web:
        command: """
          git checkout gh-pages
          git pull
          git merge --no-commit -s ours -
          git checkout - README.md index.html web.css img
          git commit -am "Update web page."
          git checkout -
        """.split('\n').join('&&')
      push:
        command: 'git push origin --tags -f && git push origin --all'
      prestore:
        command: 'git checkout stable'
      poststore:
        command: 'git checkout -'
      aws:
        command: """
          git checkout gh-pages
          aws s3 cp builds/ s3://<%= pkg.meta.awsBucket %>/builds/ --recursive --exclude "*" --include "*.js" --cache-control "max-age=600" --content-type "application/javascript; charset=utf-8"
          aws s3 cp builds/ s3://<%= pkg.meta.awsBucket %>/builds/ --recursive --exclude "*" --include "*.crx" --cache-control "max-age=600" --content-type "application/x-chrome-extension"
          aws s3 cp builds/ s3://<%= pkg.meta.awsBucket %>/builds/ --recursive --exclude "*" --include "*.xml" --cache-control "max-age=600" --content-type "text/xml; charset=utf-8"
          aws s3 cp builds/ s3://<%= pkg.meta.awsBucket %>/builds/ --recursive --exclude "*" --include "*.zip" --cache-control "max-age=600" --content-type "application/zip"
          aws s3 cp img/ s3://<%= pkg.meta.awsBucket %>/img/ --recursive --cache-control "max-age=600"
          aws s3 cp index.html s3://<%= pkg.meta.awsBucket %> --cache-control "max-age=600" --content-type "text/html; charset=utf-8"
          aws s3 cp web.css s3://<%= pkg.meta.awsBucket %> --cache-control "max-age=600" --content-type "text/css; charset=utf-8"
          git checkout -
        """.split('\n').join('&&')
      captchas:
        command: 'aws s3 cp captchas.html s3://<%= pkg.meta.awsBucket %> --cache-control "max-age=0" --content-type "text/html; charset=utf-8"'
      npm:
        command: 'npm install'
      update:
        command: """
          npm update --save-dev <%= Object.keys(pkg.devDependencies).filter(function(name) {return /^\\^/.test(pkg.devDependencies[name]);}).join(' ') %>
          ./node_modules/.bin/npm-shrinkwrap --dev
        """.split('\n').join('&&')

    webstore_upload:
      accounts:
        default:
          publish: true
          client_id: '<%= grunt.file.readJSON("../"+pkg.name+"-keys/chrome-store.json").installed.client_id %>'
          client_secret: '<%= grunt.file.readJSON("../"+pkg.name+"-keys/chrome-store.json").installed.client_secret %>'
      extensions:
        extension:
          appID: '<%= pkg.meta.chromeStoreID %>'
          zip: 'builds/<%= pkg.name %>.zip'

    watch:
      options:
        interrupt: true
      all:
        files: [
          'Gruntfile.coffee'
          'package.json'
          'src/**/*'
        ]
        tasks: 'build'

    clean:
      builds: 'builds'
      testbuilds: 'testbuilds'
      tmpcrx: ['tmp-crx', 'testbuilds/updates<%= pkg.meta.suffix.noupdate %>.xml']
      tmpuserscript: [
        'tmp-userscript',
        'testbuilds/<%= pkg.name %><%= pkg.meta.suffix.noupdate %>.meta.js',
        'testbuilds/<%= pkg.name %><%= pkg.meta.suffix.dev %>.meta.js'
      ]

    markdown:
      web:
        src: 'README.md'
        dest: 'test.html'
      options:
        template: 'template.jst'

    jshint:
      options:
        undef:   true
        unused:  true
        eqnull:  true
        expr:    true
        shadow:  true
        sub:     true
        scripturl: true
        browser: true
        devel:   true
        nonstandard: true
        # XXX Temporarily suppress lots of existing warnings until we fix them.
        '-W018': true
        '-W053': true
        '-W084': true
        '-W083': true
        '-W093': true
        globals: do ->
          globals =
            Notification: true
            MediaError:   true
            Set:          true
            GM_info:      true
            cloneInto:    true
            unsafeWindow: true
            chrome:       true
          pkg = grunt.file.readJSON 'package.json'
          globals[v] = true for v in pkg.meta.grants
          globals
      script: 'tmp-<%= pkg.type %>/*.js'

  require('load-grunt-tasks') grunt

  grunt.registerTask 'default', [
    'build'
  ]

  grunt.registerTask 'set-build', 'Set the build type variable', (type) ->
    pkg = grunt.config 'pkg'
    pkg.type = type
    grunt.config 'pkg', pkg
    grunt.log.ok 'pkg.type = %s', type

  grunt.registerTask 'set-channel', 'Set the update channel', (channel) ->
    pkg = grunt.config 'pkg'
    pkg.channel = channel
    grunt.config 'pkg', pkg

  grunt.registerTask 'enable-tests', 'Include testing code', () ->
    pkg = grunt.config 'pkg'
    pkg.tests_enabled = true
    grunt.config 'pkg', pkg

  grunt.registerTask 'build', [
    'shell:npm'
    'concurrent:build'
  ]

  grunt.registerTask 'build-crx-channel', [
    'concat:crx'
    'copy:crx'
    'zip-crx'
  ]

  grunt.registerTask 'build-crx', [
    'set-build:crx'
    'concat:coffee'
    'coffee:script'
    'coffee:eventPage'
    'jshint:script'
    'set-channel:stable'
    'build-crx-channel'
    'set-channel:beta'
    'build-crx-channel'
    'set-channel:noupdate'
    'build-crx-channel'
    'copy:zip'
    'clean:tmpcrx'
  ]

  grunt.registerTask 'zip-crx', 'Pack CRX contents in ZIP file', ->
    pkg = grunt.config 'pkg'
    zip = new JSZip()
    for file in grunt.file.expand "testbuilds/crx#{pkg.meta.suffix[pkg.channel]}/*"
      zip.file path.basename(file), grunt.file.read(file, {encoding: null}), {date: new Date(pkg.meta.date)}
    output = zip.generate
      type: 'nodebuffer'
      compression: 'DEFLATE'
      compressionOptions: {level: 9}
    grunt.file.write "testbuilds/#{pkg.name}#{pkg.meta.suffix[pkg.channel]}.crx.zip", output

  grunt.registerTask 'sign-channel', 'Sign CRX package', (channel) ->
    done = @async()
    pkg = grunt.config 'pkg'
    privateKey = grunt.file.read "../#{pkg.name}-keys/#{pkg.name}.pem"
    archive    = grunt.file.read "testbuilds/#{pkg.name}#{pkg.meta.suffix[channel]}.crx.zip", {encoding: null}
    extension = new crx {privateKey, loaded: true}
    extension.pack(archive).then((data) ->
      grunt.file.write "testbuilds/#{pkg.name}#{pkg.meta.suffix[channel]}.crx", data
      done()
    ).catch(done)

  grunt.registerTask 'sign', [
    'sign-channel:stable'
    'sign-channel:beta'
    'sign-channel:noupdate'
  ]

  grunt.registerTask 'build-userscript', [
    'set-build:userscript'
    'concat:coffee'
    'coffee:script'
    'jshint:script'
    'set-channel:stable'
    'concat:userscript'
    'set-channel:beta'
    'concat:userscript'
    'set-channel:noupdate'
    'concat:userscript'
    'set-channel:dev'
    'concat:userscript'
    'clean:tmpuserscript'
    'copy:install'
  ]

  grunt.registerTask 'build-tests', [
    'enable-tests'
    'build-userscript'
    'build-crx'
  ]

  grunt.registerTask 'full', [
    'build'
    'sign'
    'copy:builds'
  ]

  grunt.registerTask 'tag', 'Tag a new release', (version) ->
    grunt.task.run [
      "setversion:#{version}"
      'updcl'
      'full'
      'shell:commit'
    ]

  grunt.registerTask 'bump', 'Bump the version number and tag a new release', (level) ->
    pkg = grunt.config 'pkg'
    parts = pkg.meta.version.split '.'
    parts[i] or= '0' for i in [0...level]
    parts[level-1] = +parts[level-1] + 1
    parts[i] = 0 for i in [level...parts.length]
    grunt.task.run "tag:#{parts.join '.'}"

  grunt.registerTask 'beta', [
    'shell:beta'
  ]

  grunt.registerTask 'stable', [
    'shell:stable'
  ]

  grunt.registerTask 'web', 'Move website changes to gh-pages.', ->
    grunt.task.run 'markdown:web'
    if grunt.file.read('test.html') isnt grunt.file.read('index.html')
      grunt.task.run [
        'copy:web'
        'shell:commit-web'
      ]
    grunt.task.run 'shell:web'

  grunt.registerTask 'push', [
    'shell:push'
  ]

  grunt.registerTask 'aws', [
    'shell:aws'
  ]

  grunt.registerTask 'store', [
    'shell:prestore'
    'webstore_upload'
    'shell:poststore'
  ]

  grunt.registerTask 'captchas', 'Set captcha complaints redirect.', (url='https://www.4chan.org/feedback') ->
    grunt.file.write 'captchas.html', grunt.template.process(grunt.file.read('redirect.html'), data: {url})
    grunt.task.run 'shell:captchas'

  grunt.registerTask 'setversion', 'Set the version number', (version) ->
    pkg = grunt.file.readJSON 'package.json'
    oldversion = pkg.meta.version
    pkg.meta.version = version
    pkg.meta.date = new Date()
    grunt.config 'pkg', pkg
    grunt.file.write 'package.json', JSON.stringify(pkg, null, 2) + '\n'
    grunt.log.ok "Version updated from v#{oldversion} to v#{version}."

  grunt.registerTask 'updcl', 'Update the changelog', ->
    {meta, name} = grunt.config('pkg')
    {version, oldVersions, suffix} = meta

    branch       = version.replace /\.\d+$/, ''
    headerLevel  = branch.replace(/(\.0)*$/, '').split('.').length
    headerPrefix = new Array(headerLevel + 1).join '#'
    separator    = "#{headerPrefix} v#{branch}"

    today    = grunt.template.today 'yyyy-mm-dd'
    filename = "/builds/#{name}#{suffix.noupdate}"
    ffLink   = "#{oldVersions}#{version}#{filename}.user.js"
    crLink   = "#{oldVersions}#{version}#{filename}.crx"
    line     = "**v#{version}** *(#{today})* - [[Firefox](#{ffLink} \"Firefox version\")] [[Chromium](#{crLink} \"Chromium version\")]"

    changelog = grunt.file.read 'CHANGELOG.md'

    breakPos = changelog.indexOf(separator)
    throw new Error 'Separator not found.' if breakPos is -1
    breakPos += separator.length

    prevVersion = changelog[breakPos..].match(/\*\*v([\d\.]+)\*\*/)[1]
    unless prevVersion.replace(/\.\d+$/, '') is branch
      line += "\n- Based on v#{prevVersion}."

    grunt.file.write 'CHANGELOG.md', "#{changelog[...breakPos]}\n\n#{line}#{changelog[breakPos..]}"
    grunt.log.ok "Changelog updated for v#{version}."
