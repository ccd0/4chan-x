module.exports = (grunt) ->

  importHTML = (filename) ->
    "(innerHTML: #{JSON.stringify grunt.file.read("src/General/html/#{filename}.html").replace(/^\s+|\s+$</gm, '').replace(/\n/g, '')})"

  html = (template) ->
    parts = template.split /([\$&@]){([^}]*)}/
    parts2 = []
    checkText = ''
    for part, i in parts
      switch i % 3
        when 0
          parts2.push JSON.stringify part unless part is ''
          checkText += part
        when 1
          if /<[^>]*$/.test(checkText) and not (part is '$' and /\=['"][^"'<>]*$/.test checkText)
            throw new Error "Illegal insertion into HTML template: #{template}"
          expr = parts[i+1]
          expr = "(#{expr})" for x in parts[i+1].split ')'
          parts2.push switch part
            when '$' then "E#{expr}"
            when '&' then "#{expr}.innerHTML"
            when '@' then "#{expr}.map((x) -> x.innerHTML).join('')"
    unless /^(<\w+( [\w-]+(='[^"'<>]*'|="[^"'<>]*")?)*>|<\/\w+>|[^"'<>]*)*$/.test checkText
      throw new Error "HTML template is ill-formed: #{template}"
    output = if parts2.length is 0 then '""' else parts2.join ' + '
    "(innerHTML: #{output})"

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    concat:
      options: process: Object.create(null, data:
        get: ->
          pkg = grunt.config 'pkg'
          pkg.importHTML = importHTML
          pkg.html = html
          pkg.tests_enabled or= false
          pkg
        enumerable: true
      )
      coffee:
        src: [
          'src/General/Cheats.coffee'
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
      meta:
        files:
          'LICENSE':   'src/General/meta/banner.js'
      crx:
        files:
          'testbuilds/updates<%= pkg.meta.suffix[pkg.channel] %>.xml': 'src/General/meta/updates.xml'
          'testbuilds/crx<%= pkg.meta.suffix[pkg.channel] %>/manifest.json': 'src/General/meta/manifest.json'
          'testbuilds/crx<%= pkg.meta.suffix[pkg.channel] %>/script.js': [
            'src/General/meta/botproc.js'
            'src/General/meta/banner.js'
            'src/General/meta/usestrict.js'
            'tmp-<%= pkg.type %>/script.js'
          ]
      userscript:
        files:
          'testbuilds/<%= pkg.name %><%= pkg.meta.suffix[pkg.channel] %>.meta.js': 'src/General/meta/metadata.js'
          'testbuilds/<%= pkg.name %><%= pkg.meta.suffix[pkg.channel] %>.user.js': [
            'src/General/meta/botproc.js'
            'src/General/meta/metadata.js'
            'src/General/meta/banner.js'
            'src/General/meta/usestrict.js'
            'tmp-<%= pkg.type %>/script.js'
          ]

    copy:
      crx:
        src:  'src/General/img/*.png'
        dest: 'testbuilds/crx<%= pkg.meta.suffix[pkg.channel] %>/'
        expand:  true
        flatten: true
      builds:
        cwd: 'testbuilds/'
        src: '*'
        dest: 'builds/'
        expand: true
        filter: 'isFile'

    coffee:
      script:
        src:  'tmp-<%= pkg.type %>/script.coffee'
        dest: 'tmp-<%= pkg.type %>/script.js'

    concurrent:
      build: [
        'build-crx'
        'build-userscript'
      ]

    bump:
      options:
        updateConfigs: [
          'pkg'
        ]
        commit:    false
        createTag: false
        push:      false

    shell:
      options:
        stdout: true
        stderr: true
        failOnError: true
      checkout:
        command: 'git checkout <%= pkg.meta.mainBranch %>'
      commit:
        command: """
          git commit -am "Release <%= pkg.meta.name %> v<%= pkg.version %>."
          git tag -a <%= pkg.version %> -m "<%= pkg.meta.name %> v<%= pkg.version %>."
        """
      beta:
        command: """
          git tag -af beta -m "<%= pkg.meta.name %> v<%= pkg.version %>."
          git checkout gh-pages
          git checkout beta 'builds/*<%= pkg.meta.suffix.beta %>.*'
          git commit -am "Move <%= pkg.meta.name %> v<%= pkg.version %> to beta channel."
          git checkout -
        """
      stable:
        command: """
          git tag -af stable -m "<%= pkg.meta.name %> v<%= pkg.version %>."
          git checkout -b tmp
          git merge --no-commit -s ours gh-pages
          git checkout gh-pages 'builds/*<%= pkg.meta.suffix.beta %>.*'
          git commit -am "Move <%= pkg.meta.name %> v<%= pkg.version %> to stable channel."
          git checkout gh-pages
          git merge --ff-only tmp
          git branch -d tmp
          git checkout @{-2}
        """
      push:
        command: 'git push origin --tags -f && git push origin --all'

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

    crx:
      prod:
        src: 'testbuilds/crx<%= pkg.meta.suffix[pkg.channel] %>/'
        dest: 'testbuilds/<%= pkg.name %><%= pkg.meta.suffix[pkg.channel] %>.crx'
        privateKey: '~/.ssh/<%= pkg.name %>.pem'

    compress:
      crx:
        options:
          archive: 'testbuilds/<%= pkg.name %>.zip'
          level: 9
          pretty: true
        expand:  true
        flatten: true
        src: 'testbuilds/crx<%= pkg.meta.suffix.noupdate %>/*'
        dest: '/'

    clean:
      builds: 'builds'
      testbuilds: 'testbuilds'
      tmpcrx: ['tmp-crx', 'testbuilds/updates<%= pkg.meta.suffix.noupdate %>.xml']
      tmpuserscript: ['tmp-userscript', 'testbuilds/<%= pkg.name %><%= pkg.meta.suffix.noupdate %>.meta.js']

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
    'concurrent:build'
  ]

  grunt.registerTask 'build-crx-channel', [
    'concat:crx'
    'copy:crx'
  ]

  grunt.registerTask 'build-crx', [
    'set-build:crx'
    'concat:coffee'
    'coffee:script'
    'set-channel:stable'
    'build-crx-channel'
    'set-channel:beta'
    'build-crx-channel'
    'set-channel:noupdate'
    'build-crx-channel'
    'compress:crx'
    'clean:tmpcrx'
  ]

  grunt.registerTask 'pack', [
    'set-channel:stable'
    'crx:prod'
    'set-channel:beta'
    'crx:prod'
    'set-channel:noupdate'
    'crx:prod'
  ]

  grunt.registerTask 'build-userscript', [
    'set-build:userscript'
    'concat:coffee'
    'coffee:script'
    'set-channel:stable'
    'concat:userscript'
    'set-channel:beta'
    'concat:userscript'
    'set-channel:noupdate'
    'concat:userscript'
    'clean:tmpuserscript'
  ]

  grunt.registerTask 'build-tests', [
    'enable-tests'
    'build-userscript'
    'build-crx'
  ]

  grunt.registerTask 'tag', [
    'build'
    'pack'
    'concat:meta'
    'copy:builds'
    'shell:commit'
  ]

  grunt.registerTask 'beta', [
    'tag'
    'shell:beta'
    'shell:push'
  ]

  grunt.registerTask 'stable', [
    'shell:stable'
    'shell:push'
  ]

  grunt.registerTask 'release', [
    'tag'
    'shell:beta'
    'shell:stable'
    'shell:push'
  ]

  grunt.registerTask 'patch', [
    'bump'
    'updcl:3'
  ]

  grunt.registerTask 'minor', [
    'bump:minor'
    'updcl:2'
  ]

  grunt.registerTask 'major', [
    'bump:major'
    'updcl:1'
  ]

  grunt.registerTask 'updcl', 'Update the changelog', (headerLevel) ->
    headerPrefix = new Array(+headerLevel + 1).join '#'
    {version} = grunt.config 'pkg'
    today     = grunt.template.today 'yyyy-mm-dd'
    changelog = grunt.file.read 'CHANGELOG.md'

    grunt.file.write 'CHANGELOG.md', "#{headerPrefix} v#{version} \n*#{today}*\n\n#{changelog}"
    grunt.log.ok "Changelog updated for v#{version}."
