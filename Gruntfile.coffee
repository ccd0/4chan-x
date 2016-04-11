path = require 'path'

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

    BIN: ['node_modules', '.bin', ''].join(path.sep)

    sources: grunt.file.expand [
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

    icons: ['icon128.png', 'icon16.png', 'icon48.png']

    builds:
      ("4chan-X#{c}.crx updates#{c}.xml 4chan-X#{c}.user.js 4chan-X#{c}.meta.js" for c in ['', '-beta']).join(' ').split(' ').concat [
        '4chan-X-noupdate.crx', '4chan-X-noupdate.user.js', '4chan-X.zip'
      ]

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
      clean:
        command: 'node tools/clean.js'
      'tests-false':
        command: 'echo false> .tests_enabled'
      'tests-true':
        command: 'echo true> .tests_enabled'
      general:
        command: """
          <%= BIN %>coffee tools/templates.coffee src/meta/jshint.json .jshintrc
          node tools/cat.js <%= sources.join(' ') %> tmp/script.coffee
        """.split('\n').join('&&')
      crx:
        command: """
          <%= BIN %>coffee tools/templates.coffee tmp/script.coffee tmp/script-crx.coffee type=crx
          <%= BIN %>coffee --no-header -c tmp/script-crx.coffee
          <%= BIN %>coffee --no-header -o tmp -c src/General/eventPage.coffee
          <%= BIN %>jshint tmp/script-crx.js tmp/eventPage.js
        """.split('\n').join('&&')
      'crx-channel':
        command: (channel='') -> """
          <%= BIN %>coffee tools/templates.coffee src/meta/updates.xml testbuilds/updates#{channel}.xml type=crx channel=#{channel}
          <%= BIN %>coffee tools/templates.coffee src/meta/manifest.json testbuilds/crx#{channel}/manifest.json type=crx channel=#{channel}
          node tools/cat.js src/meta/botproc.js LICENSE src/meta/usestrict.js tmp/script-crx.js testbuilds/crx#{channel}/script.js
          <%= icons.map(file => `node tools/cp.js src/meta/${file} testbuilds/crx#{channel}/${file}`).join('&&') %>
          node tools/cp.js tmp/eventPage.js testbuilds/crx#{channel}/eventPage.js
          node tools/zip-crx.js #{channel}
        """.split('\n').join('&&')
      'copy-zip':
        command: 'node tools/cp.js testbuilds/<%= pkg.name %>-noupdate.crx.zip testbuilds/<%= pkg.name %>.zip'
      userscript:
        command: """
          <%= BIN %>coffee tools/templates.coffee tmp/script.coffee tmp/script-userscript.coffee type=userscript
          <%= BIN %>coffee --no-header -c tmp/script-userscript.coffee
          <%= BIN %>jshint tmp/script-userscript.js
        """.split('\n').join('&&')
      'userscript-channel':
        command: (channel='') -> """
          <%= BIN %>coffee tools/templates.coffee src/meta/metadata.js testbuilds/<%= pkg.name %>#{channel}.meta.js type=userscript channel=#{channel}
          node tools/cat.js src/meta/botproc.js testbuilds/<%= pkg.name %>#{channel}.meta.js LICENSE src/meta/usestrict.js tmp/script-userscript.js testbuilds/<%= pkg.name %>#{channel}.user.js
        """.split('\n').join('&&')
      install:
        command: 'node tools/install.js'
      sign:
        command: (channel='') -> "node tools/sign.js #{channel}"
      'copy-builds':
        command: '<%= builds.map(file => `node tools/cp.js testbuilds/${file} builds/${file}`).join("&&") %>'
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
          node ../<%= pkg.meta.path %>/tools/cp.js ../<%= pkg.meta.path %>/test.html index.html
          git merge --no-commit -s ours master
          git checkout master README.md web.css img
          git commit -am "Update web page."
        """.split('\n').join('&&')
      push:
        command: """
          git push origin --tags -f
          git push origin --all
        """.split('\n').join('&&')
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
      captchas:
        command: """
          <%= BIN %>coffee tools/templates.coffee redirect.html captchas.html url=#{process.env.url || 'https://www.4chan.org/feedback'}
          aws s3 cp captchas.html s3://<%= pkg.meta.awsBucket %> --cache-control "max-age=0" --content-type "text/html; charset=utf-8"
        """.split('\n').join('&&')
      npm:
        command: 'npm install'
      update:
        command: """
          npm install --save-dev <%= Object.keys(pkg.devDependencies).filter(function(name) {return /^\\^/.test(pkg.devDependencies[name]);}).map(function(name) {return name+'@latest';}).join(' ') %>
          <%= BIN %>npm-shrinkwrap --dev
        """.split('\n').join('&&')
      shrinkwrap:
        command: '<%= BIN %>npm-shrinkwrap --dev'

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

  require('load-grunt-tasks') grunt

  grunt.registerTask 'default', [
    'build'
  ]

  grunt.registerTask 'build', [
    'shell:npm'
    'shell:tests-false'
    'shell:general'
    'concurrent:build'
  ]

  grunt.registerTask 'build-tests', [
    'shell:npm'
    'shell:tests-true'
    'shell:general'
    'concurrent:build'
  ]

  grunt.registerTask 'build-crx', [
    'shell:crx'
    'shell:crx-channel'
    'shell:crx-channel:-beta'
    'shell:crx-channel:-noupdate'
    'shell:copy-zip'
  ]

  grunt.registerTask 'sign', [
    'shell:sign'
    'shell:sign:-beta'
    'shell:sign:-noupdate'
  ]

  grunt.registerTask 'build-userscript', [
    'shell:userscript'
    'shell:userscript-channel'
    'shell:userscript-channel:-beta'
    'shell:userscript-channel:-noupdate'
    'shell:install'
  ]

  grunt.registerTask 'clean', [
    'shell:clean'
  ]

  grunt.registerTask 'full', [
    'build'
    'sign'
    'shell:copy-builds'
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
    'webstore_upload'
    'popd'
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
