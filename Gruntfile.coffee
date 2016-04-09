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
          'testbuilds/crx<%= pkg.meta.suffix[pkg.channel] %>/script.js': [
            'src/meta/botproc.js'
            'LICENSE'
            'src/meta/usestrict.js'
            'tmp/script-crx.js'
          ]
          'testbuilds/crx<%= pkg.meta.suffix[pkg.channel] %>/eventPage.js': 'tmp/eventPage-crx.js'
      userscript:
        files:
          'testbuilds/<%= pkg.name %><%= pkg.meta.suffix[pkg.channel] %>.user.js': [
            'src/meta/botproc.js'
            'testbuilds/<%= pkg.name %><%= pkg.meta.suffix[pkg.channel] %>.meta.js'
            'LICENSE'
            'src/meta/usestrict.js'
            'tmp/script-userscript.js'
          ]

    copy:
      crx:
        src:  'src/meta/*.png'
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
        src:  'tmp/script-<%= pkg.type %>.coffee'
        dest: 'tmp/script-<%= pkg.type %>.js'
      eventPage:
        src:  'src/General/eventPage.coffee'
        dest: 'tmp/eventPage-crx.js'

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
      'templates-crx':
        command: 'node_modules/.bin/coffee tools/templates.coffee tmp/script.coffee tmp/script-crx.coffee crx - <%= pkg.tests_enabled || "" %>'.replace(/\//g, path.sep)
      'templates-crx-meta':
        command: """
          node_modules/.bin/coffee tools/templates.coffee src/meta/updates.xml testbuilds/updates<%= pkg.meta.suffix[pkg.channel] %>.xml crx <%= pkg.channel %>
          node_modules/.bin/coffee tools/templates.coffee src/meta/manifest.json testbuilds/crx<%= pkg.meta.suffix[pkg.channel] %>/manifest.json crx <%= pkg.channel %>
        """.split('\n').join('&&').replace(/\//g, path.sep)
      'templates-userscript':
        command: 'node_modules/.bin/coffee tools/templates.coffee tmp/script.coffee tmp/script-userscript.coffee userscript - <%= pkg.tests_enabled || "" %>'.replace(/\//g, path.sep)
      'templates-userscript-meta':
        command: 'node_modules/.bin/coffee tools/templates.coffee src/meta/metadata.js testbuilds/<%= pkg.name %><%= pkg.meta.suffix[pkg.channel] %>.meta.js userscript <%= pkg.channel %>'.replace(/\//g, path.sep)
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
      beta:
        command: """
          git tag -af beta -m "<%= pkg.meta.name %> v<%= pkg.meta.version %>."
          cd ..
          cd "<%= pkg.meta.path %>.gh-pages"
          git checkout gh-pages
          git pull
          git merge --no-commit -s ours beta
          git checkout beta "builds/*<%= pkg.meta.suffix.beta %>.*" LICENSE CHANGELOG.md img .gitignore .gitattributes
          git commit -am "Move <%= pkg.meta.name %> v<%= pkg.meta.version %> to beta channel."
          cd ..
          cd "<%= pkg.meta.path %>"
        """.split('\n').join('&&')
      stable:
        command: """
          git push . HEAD:bstable
          git tag -af stable -m "<%= pkg.meta.name %> v<%= pkg.meta.version %>."
          cd ..
          cd "<%= pkg.meta.path %>.gh-pages"
          git checkout gh-pages
          git pull
          git merge --no-commit -s ours stable
          git checkout stable "builds/<%= pkg.name %>.*" builds/updates.xml
          git commit -am "Move <%= pkg.meta.name %> v<%= pkg.meta.version %> to stable channel."
          cd ..
          cd "<%= pkg.meta.path %>"
        """.split('\n').join('&&')
      'commit-web':
        command: 'git commit -am "Build web page."'
      web:
        command: """
          cd ..
          cd "<%= pkg.meta.path %>.gh-pages"
          git checkout gh-pages
          git pull
          git merge --no-commit -s ours -
          git checkout - README.md index.html web.css img
          git commit -am "Update web page."
          cd ..
          cd "<%= pkg.meta.path %>"
        """.split('\n').join('&&')
      push:
        command: 'git push origin --tags -f && git push origin --all'
      aws:
        command: """
          cd ..
          cd "<%= pkg.meta.path %>.gh-pages"
          git checkout gh-pages
          aws s3 cp builds/ s3://<%= pkg.meta.awsBucket %>/builds/ --recursive --exclude "*" --include "*.js" --cache-control "max-age=600" --content-type "application/javascript; charset=utf-8"
          aws s3 cp builds/ s3://<%= pkg.meta.awsBucket %>/builds/ --recursive --exclude "*" --include "*.crx" --cache-control "max-age=600" --content-type "application/x-chrome-extension"
          aws s3 cp builds/ s3://<%= pkg.meta.awsBucket %>/builds/ --recursive --exclude "*" --include "*.xml" --cache-control "max-age=600" --content-type "text/xml; charset=utf-8"
          aws s3 cp builds/ s3://<%= pkg.meta.awsBucket %>/builds/ --recursive --exclude "*" --include "*.zip" --cache-control "max-age=600" --content-type "application/zip"
          aws s3 cp img/ s3://<%= pkg.meta.awsBucket %>/img/ --recursive --cache-control "max-age=600"
          aws s3 cp index.html s3://<%= pkg.meta.awsBucket %> --cache-control "max-age=600" --content-type "text/html; charset=utf-8"
          aws s3 cp web.css s3://<%= pkg.meta.awsBucket %> --cache-control "max-age=600" --content-type "text/css; charset=utf-8"
          cd ..
          cd "<%= pkg.meta.path %>"
        """.split('\n').join('&&')
      captchas:
        command: 'aws s3 cp captchas.html s3://<%= pkg.meta.awsBucket %> --cache-control "max-age=0" --content-type "text/html; charset=utf-8"'
      npm:
        command: 'npm install'
      update:
        command: """
          npm install --save-dev <%= Object.keys(pkg.devDependencies).filter(function(name) {return /^\\^/.test(pkg.devDependencies[name]);}).map(function(name) {return name+'@latest';}).join(' ') %>
          ./node_modules/.bin/npm-shrinkwrap --dev
        """.split('\n').join('&&').replace(/\//g, path.sep)

    webstore_upload:
      accounts:
        default:
          publish: true
          client_id: '<%= grunt.file.readJSON("../"+pkg.meta.path+".keys/chrome-store.json").installed.client_id %>'
          client_secret: '<%= grunt.file.readJSON("../"+pkg.meta.path+".keys/chrome-store.json").installed.client_secret %>'
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
          'version.json'
          'LICENSE'
          'src/**/*'
        ]
        tasks: 'build'

    clean:
      builds: 'builds'
      testbuilds: 'testbuilds'
      tmp: 'tmp'
      tmpcrx: 'testbuilds/updates<%= pkg.meta.suffix.noupdate %>.xml'
      tmpuserscript: [
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
        '-W084': true
        '-W083': true
        '-W093': true
        globals: do ->
          globals =
            MediaError:   true
            Set:          true
            GM_info:      true
            cloneInto:    true
            unsafeWindow: true
            chrome:       true
          pkg = grunt.file.readJSON 'package.json'
          globals[v] = true for v in pkg.meta.grants
          globals
      script: 'tmp/*-<%= pkg.type %>.js'

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
    'set-build:crx'
    'shell:templates-crx'
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
    for file in ['eventPage.js', 'icon128.png', 'icon16.png', 'icon48.png', 'manifest.json', 'script.js']
      zip.file file, grunt.file.read("testbuilds/crx#{pkg.meta.suffix[pkg.channel]}/#{file}", {encoding: null}), {date: new Date(pkg.meta.date)}
    output = zip.generate
      type: 'nodebuffer'
      compression: 'DEFLATE'
      compressionOptions: {level: 9}
    grunt.file.write "testbuilds/#{pkg.name}#{pkg.meta.suffix[pkg.channel]}.crx.zip", output

  grunt.registerTask 'sign-channel', 'Sign CRX package', (channel) ->
    done = @async()
    pkg = grunt.config 'pkg'
    privateKey = grunt.file.read "../#{pkg.meta.path}.keys/#{pkg.name}.pem"
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

  grunt.registerTask 'build-userscript-channel', [
    'shell:templates-userscript-meta'
    'concat:userscript'
  ]

  grunt.registerTask 'build-userscript', [
    'set-build:userscript'
    'shell:templates-userscript'
    'coffee:script'
    'jshint:script'
    'set-channel:stable'
    'build-userscript-channel'
    'set-channel:beta'
    'build-userscript-channel'
    'set-channel:noupdate'
    'build-userscript-channel'
    'set-channel:dev'
    'build-userscript-channel'
    'clean:tmpuserscript'
    'copy:install'
  ]

  grunt.registerTask 'build-tests', [
    'shell:npm'
    'enable-tests'
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
    'pushd'
    'webstore_upload'
    'popd'
  ]

  grunt.registerTask 'captchas', 'Set captcha complaints redirect.', (url='https://www.4chan.org/feedback') ->
    grunt.file.write 'captchas.html', grunt.template.process(grunt.file.read('redirect.html'), data: {url})
    grunt.task.run 'shell:captchas'

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
