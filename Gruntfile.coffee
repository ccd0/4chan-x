path = require 'path'
crx = require 'crx'
JSZip = require 'jszip'

module.exports = (grunt) ->
  grunt.util.linefeed = '\n'

  loadPkg = ->
    pkg = grunt.file.readJSON 'package.json'
    version = grunt.file.readJSON 'version.json'
    pkg.meta[key] = val for key, val of version
    pkg

  # Project configuration.
  grunt.initConfig
    pkg: loadPkg()

    concat:
      options: process: (src) -> src.replace /\r\n/g, '\n'
      coffee:
        src: [
          'src/General/Config.coffee'
          'src/General/Globals.coffee'
          'src/General/$.coffee'
          'src/classes/Callbacks.coffee'
          'src/classes/Board.coffee'
          'src/classes/Thread.coffee'
          'src/classes/CatalogThread.coffee'
          'src/classes/Post.coffee'
          'src/classes/Clone.coffee'
          'src/classes/DataBoard.coffee'
          'src/classes/Notice.coffee'
          'src/classes/RandomAccessList.coffee'
          'src/classes/SimpleDict.coffee'
          'src/classes/Set.coffee'
          'src/classes/Connection.coffee'
          'src/classes/Fetcher.coffee'
          'src/General/Polyfill.coffee'
          'src/General/Header.coffee'
          'src/General/Index.coffee'
          'src/General/Build.coffee'
          'src/General/Get.coffee'
          'src/General/UI.coffee'
          'src/General/Notice.coffee'
          'src/General/CrossOrigin.coffee'
          'src/General/BuildTest.coffee'
          'src/Filtering/*.coffee'
          'src/Quotelinks/*.coffee'
          'src/Posting/QR.coffee'
          'src/Posting/Captcha.coffee'
          'src/Posting/*.coffee'
          'src/Images/*.coffee'
          'src/Linkification/*.coffee'
          'src/Menu/*.coffee'
          'src/Monitoring/*.coffee'
          'src/Archive/*.coffee'
          'src/Miscellaneous/*.coffee'
          'src/General/Settings.coffee'
          'src/General/Main.coffee'
        ]
        dest: 'tmp/script.coffee'
      crx:
        files:
          'testbuilds/crx<%= pkg.channel %>/script.js': [
            'src/meta/botproc.js'
            'LICENSE'
            'src/meta/usestrict.js'
            'tmp/script-crx.js'
          ]
      userscript:
        files:
          'testbuilds/<%= pkg.name %><%= pkg.channel %>.user.js': [
            'src/meta/botproc.js'
            'testbuilds/<%= pkg.name %><%= pkg.channel %>.meta.js'
            'LICENSE'
            'src/meta/usestrict.js'
            'tmp/script-userscript.js'
          ]

    copy:
      crx:
        src:  ['src/meta/*.png', 'tmp/eventPage.js']
        dest: 'testbuilds/crx<%= pkg.channel %>/'
        expand:  true
        flatten: true
      zip:
        src:  'testbuilds/<%= pkg.name %>-noupdate.crx.zip'
        dest: 'testbuilds/<%= pkg.name %>.zip'
      builds:
        cwd: 'testbuilds/'
        src: ['*.js', '*.crx', '*.xml', '<%= pkg.name %>.zip']
        dest: 'builds/'
        expand: true
        filter: (src) ->
          not /-noupdate\.(xml|meta\.js)$/.test src
      install:
        files: if grunt.file.exists('install.json') then grunt.file.readJSON('install.json') else []
      web:
        src:  '../<%= pkg.meta.path %>/test.html'
        dest: 'index.html'

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
      'templates-jshint':
        command: 'node_modules/.bin/coffee tools/templates.coffee src/meta/jshint.json .jshintrc'.replace(/\//g, path.sep)
      crx:
        command: """
          node_modules/.bin/coffee tools/templates.coffee tmp/script.coffee tmp/script-crx.coffee type=crx tests_enabled=<%= pkg.tests_enabled || "" %>
          node_modules/.bin/coffee --no-header -c tmp/script-crx.coffee
          node_modules/.bin/coffee --no-header -o tmp -c src/General/eventPage.coffee
          node_modules/.bin/jshint tmp/script-crx.js tmp/eventPage.js
        """.split('\n').join('&&').replace(/\//g, path.sep)
      'templates-crx-meta':
        command: """
          node_modules/.bin/coffee tools/templates.coffee src/meta/updates.xml testbuilds/updates<%= pkg.channel %>.xml type=crx channel=<%= pkg.channel %>
          node_modules/.bin/coffee tools/templates.coffee src/meta/manifest.json testbuilds/crx<%= pkg.channel %>/manifest.json type=crx channel=<%= pkg.channel %>
        """.split('\n').join('&&').replace(/\//g, path.sep)
      userscript:
        command: """
          node_modules/.bin/coffee tools/templates.coffee tmp/script.coffee tmp/script-userscript.coffee type=userscript tests_enabled=<%= pkg.tests_enabled || "" %>
          node_modules/.bin/coffee --no-header -c tmp/script-userscript.coffee
          node_modules/.bin/jshint tmp/script-userscript.js
        """.split('\n').join('&&').replace(/\//g, path.sep)
      'templates-userscript-meta':
        command: 'node_modules/.bin/coffee tools/templates.coffee src/meta/metadata.js testbuilds/<%= pkg.name %><%= pkg.channel %>.meta.js type=userscript channel=<%= pkg.channel %>'.replace(/\//g, path.sep)
      markdown:
        command: 'node tools/markdown.js'
      commit:
        command: """
          git commit -am "Release <%= pkg.meta.name %> v<%= pkg.meta.version %>."
          git tag -a <%= pkg.meta.version %> -m "<%= pkg.meta.name %> v<%= pkg.meta.version %>."
        """.split('\n').join('&&')
      'gh-pages':
        command: """
          git checkout gh-pages
          git pull
        """.split('\n').join('&&')
      'tag-beta':
        command: """
          git tag -af beta -m "<%= pkg.meta.name %> v<%= pkg.meta.version %>."
        """.split('\n').join('&&')
      beta:
        command: """
          git merge --no-commit -s ours beta
          git checkout beta "builds/*-beta.*" LICENSE CHANGELOG.md img .gitignore .gitattributes
          git commit -am "Move <%= pkg.meta.name %> v<%= pkg.meta.version %> to beta channel."
        """.split('\n').join('&&')
      'tag-stable':
        command: """
          git push . HEAD:bstable
          git tag -af stable -m "<%= pkg.meta.name %> v<%= pkg.meta.version %>."
        """.split('\n').join('&&')
      stable:
        command: """
          git merge --no-commit -s ours stable
          git checkout stable "builds/<%= pkg.name %>.*" builds/updates.xml
          git commit -am "Move <%= pkg.meta.name %> v<%= pkg.meta.version %> to stable channel."
        """.split('\n').join('&&')
      web:
        command: """
          git merge --no-commit -s ours master
          git checkout master README.md web.css img
          git commit -am "Update web page."
        """.split('\n').join('&&')
      push:
        command: 'git push origin --tags -f && git push origin --all'
      aws:
        command: """
          aws s3 cp builds/ s3://<%= pkg.meta.awsBucket %>/builds/ --recursive --exclude "*" --include "*.js" --cache-control "max-age=600" --content-type "application/javascript; charset=utf-8"
          aws s3 cp builds/ s3://<%= pkg.meta.awsBucket %>/builds/ --recursive --exclude "*" --include "*.crx" --cache-control "max-age=600" --content-type "application/x-chrome-extension"
          aws s3 cp builds/ s3://<%= pkg.meta.awsBucket %>/builds/ --recursive --exclude "*" --include "*.xml" --cache-control "max-age=600" --content-type "text/xml; charset=utf-8"
          aws s3 cp builds/ s3://<%= pkg.meta.awsBucket %>/builds/ --recursive --exclude "*" --include "*.zip" --cache-control "max-age=600" --content-type "application/zip"
          aws s3 cp img/ s3://<%= pkg.meta.awsBucket %>/img/ --recursive --cache-control "max-age=600"
          aws s3 cp index.html s3://<%= pkg.meta.awsBucket %> --cache-control "max-age=600" --content-type "text/html; charset=utf-8"
          aws s3 cp web.css s3://<%= pkg.meta.awsBucket %> --cache-control "max-age=600" --content-type "text/css; charset=utf-8"
        """.split('\n').join('&&')
      store:
        command: 'node tools/webstore.js'
      captchas:
        command: """
          #{'node_modules/.bin/coffee tools/templates.coffee'.replace(/\//g, path.sep)} redirect.html captchas.html url=#{process.env.url || 'https://www.4chan.org/feedback'}
          aws s3 cp captchas.html s3://<%= pkg.meta.awsBucket %> --cache-control "max-age=0" --content-type "text/html; charset=utf-8"
        """.split('\n').join('&&')
      npm:
        command: 'npm install'
      update:
        command: """
          npm install --save-dev <%= Object.keys(pkg.devDependencies).filter(function(name) {return /^\\^/.test(pkg.devDependencies[name]);}).map(function(name) {return name+'@latest';}).join(' ') %>
          node_modules/.bin/npm-shrinkwrap --dev
        """.split('\n').join('&&').replace(/\//g, path.sep)
      shrinkwrap:
        command: 'node_modules/.bin/npm-shrinkwrap --dev'.replace(/\//g, path.sep)

    clean:
      builds: ['tmp', 'testbuilds', 'builds']

  require('load-grunt-tasks') grunt

  grunt.registerTask 'default', [
    'build'
  ]

  grunt.registerTask 'set-channel', 'Set the update channel', (channel='') ->
    pkg = grunt.config 'pkg'
    pkg.channel = channel
    grunt.config 'pkg', pkg

  grunt.registerTask 'enable-tests', 'Include testing code', () ->
    pkg = grunt.config 'pkg'
    pkg.tests_enabled = true
    grunt.config 'pkg', pkg

  grunt.registerTask 'build', [
    'shell:npm'
    'shell:templates-jshint'
    'concat:coffee'
    'concurrent:build'
  ]

  grunt.registerTask 'build-crx-channel', [
    'shell:templates-crx-meta'
    'concat:crx'
    'copy:crx'
    'zip-crx'
  ]

  grunt.registerTask 'build-crx', [
    'shell:crx'
    'set-channel'
    'build-crx-channel'
    'set-channel:-beta'
    'build-crx-channel'
    'set-channel:-noupdate'
    'build-crx-channel'
    'copy:zip'
  ]

  grunt.registerTask 'zip-crx', 'Pack CRX contents in ZIP file', ->
    pkg = grunt.config 'pkg'
    zip = new JSZip()
    for file in ['eventPage.js', 'icon128.png', 'icon16.png', 'icon48.png', 'manifest.json', 'script.js']
      zip.file file, grunt.file.read("testbuilds/crx#{pkg.channel}/#{file}", {encoding: null}), {date: new Date(pkg.meta.date)}
    output = zip.generate
      type: 'nodebuffer'
      compression: 'DEFLATE'
      compressionOptions: {level: 9}
    grunt.file.write "testbuilds/#{pkg.name}#{pkg.channel}.crx.zip", output

  grunt.registerTask 'sign-channel', 'Sign CRX package', (channel='') ->
    done = @async()
    pkg = grunt.config 'pkg'
    privateKey = grunt.file.read "../#{pkg.meta.path}.keys/#{pkg.name}.pem"
    archive    = grunt.file.read "testbuilds/#{pkg.name}#{channel}.crx.zip", {encoding: null}
    extension = new crx {privateKey, loaded: true}
    extension.pack(archive).then((data) ->
      grunt.file.write "testbuilds/#{pkg.name}#{channel}.crx", data
      done()
    ).catch(done)

  grunt.registerTask 'sign', [
    'sign-channel'
    'sign-channel:-beta'
    'sign-channel:-noupdate'
  ]

  grunt.registerTask 'build-userscript-channel', [
    'shell:templates-userscript-meta'
    'concat:userscript'
  ]

  grunt.registerTask 'build-userscript', [
    'shell:userscript'
    'set-channel'
    'build-userscript-channel'
    'set-channel:-beta'
    'build-userscript-channel'
    'set-channel:-noupdate'
    'build-userscript-channel'
    'copy:install'
  ]

  grunt.registerTask 'build-tests', [
    'shell:npm'
    'enable-tests'
    'shell:templates-jshint'
    'concat:coffee'
    'build-crx'
    'build-userscript'
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

  grunt.registerTask 'pushd', 'Change directory to the distribution worktree and check out gh-pages branch.', ->
    pkg = grunt.config 'pkg'
    grunt.file.setBase "../#{pkg.meta.path}.gh-pages"
    grunt.task.run 'shell:gh-pages'

  grunt.registerTask 'popd', 'Return to the normal working directory.', ->
    pkg = grunt.config 'pkg'
    grunt.file.setBase "../#{pkg.meta.path}"

  grunt.registerTask 'beta', [
    'shell:tag-beta'
    'pushd'
    'shell:beta'
    'popd'
  ]

  grunt.registerTask 'stable', [
    'shell:tag-stable'
    'pushd'
    'shell:stable'
    'popd'
  ]

  grunt.registerTask 'markdown', [
    'shell:markdown'
  ]

  grunt.registerTask 'web', [
    'shell:markdown'
    'pushd'
    'copy:web'
    'shell:web'
    'popd'
  ]

  grunt.registerTask 'push', [
    'shell:push'
  ]

  grunt.registerTask 'aws', [
    'pushd'
    'shell:aws'
    'popd'
  ]

  grunt.registerTask 'store', [
    'pushd'
    'popd'
    'shell:store'
  ]

  grunt.registerTask 'captchas', [
    'shell:captchas'
  ]

  grunt.registerTask 'setversion', 'Set the version number', (version) ->
    data = grunt.file.readJSON 'version.json'
    oldversion = data.version
    data.version = version
    data.date = new Date()
    grunt.file.write 'version.json', JSON.stringify(data, null, 2) + '\n'
    grunt.log.ok "Version updated from v#{oldversion} to v#{version}."
    grunt.config 'pkg', loadPkg()

  grunt.registerTask 'updcl', 'Update the changelog', ->
    {meta, name} = grunt.config('pkg')
    {version, oldVersions} = meta

    branch       = version.replace /\.\d+$/, ''
    headerLevel  = branch.replace(/(\.0)*$/, '').split('.').length
    headerPrefix = new Array(headerLevel + 1).join '#'
    separator    = "#{headerPrefix} v#{branch}"

    today    = grunt.template.today 'yyyy-mm-dd'
    filename = "/builds/#{name}-noupdate"
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
