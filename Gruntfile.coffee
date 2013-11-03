module.exports = (grunt) ->

  importHTML = (filename) ->
    "\"\"\"#{grunt.file.read("html/#{filename}.html").replace(/^\s+|\s+$</gm, '').replace(/\n/g, '')}\"\"\""

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    concat:
      options: process: Object.create(null, data:
        get: ->
          pkg = grunt.config 'pkg'
          pkg.importHTML = importHTML
          pkg
        enumerable: true
      )
      coffee:
        src: [
          'src/General/Config.coffee'
          'src/General/Globals.coffee'
          'lib/**/*'
          'src/General/UI.coffee'
          'src/General/Header.coffee'
          'src/General/Notice.coffee'
          'src/General/Settings.coffee'
          'src/General/Index.coffee'
          'src/General/Get.coffee'
          'src/General/Build.coffee'
          # Features -->
          'src/Filtering/**/*'
          'src/Quotelinks/**/*'
          'src/Posting/**/*'
          'src/Images/**/*'
          'src/Linkification/**/*'
          'src/Menu/**/*'
          'src/Monitoring/**/*'
          'src/Archive/**/*'
          'src/Miscellaneous/**/*'
          # <--|
          'src/General/Board.coffee'
          'src/General/Thread.coffee'
          'src/General/Post.coffee'
          'src/General/Clone.coffee'
          'src/General/DataBoard.coffee'
          'src/General/Main.coffee'
        ]
        dest: 'tmp-<%= pkg.type %>/script.coffee'
      crx:
        files:
          'builds/crx/manifest.json': 'src/Meta/manifest.json'
          'builds/crx/script.js': [
            'src/Meta/banner.js'
            'src/Meta/usestrict.js'
            'tmp-<%= pkg.type %>/script.js'
          ]
      userscript:
        files:
          'builds/<%= pkg.name %>.meta.js': 'src/Meta/metadata.js'
          'builds/<%= pkg.name %>.user.js': [
            'src/Meta/metadata.js'
            'src/Meta/banner.js'
            'src/Meta/usestrict.js'
            'tmp-<%= pkg.type %>/script.js'
          ]
    copy:
      crx:
        src:  'img/*.png'
        dest: 'builds/crx/'
        expand:  true
        flatten: true
    coffee:
      script:
        src:  'tmp-<%= pkg.type %>/script.coffee'
        dest: 'tmp-<%= pkg.type %>/script.js'
    concurrent:
      build: ['build-crx', 'build-userscript']
    bump:
      options:
        updateConfigs: ['pkg']
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
          git tag -af stable-v3 -m "<%= pkg.meta.name %> v<%= pkg.version %>."
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
          'lib/**/*'
          'src/**/*'
          'html/**/*'
          'css/**/*'
          'json/**/*'
          'img/**/*'
        ]
        tasks: 'build'
    compress:
      crx:
        options:
          archive: 'builds/<%= pkg.name %>.zip'
          level: 9
          pretty: true
        expand:  true
        flatten: true
        src: 'builds/crx/*'
        dest: '/'
    clean:
      builds: 'builds'
      tmpcrx: 'tmp-crx'
      tmpuserscript: 'tmp-userscript'

  require('load-grunt-tasks') grunt

  grunt.registerTask 'default', ['build']

  grunt.registerTask 'set-build', 'Set the build type variable', (type) ->
    pkg = grunt.config 'pkg'
    pkg.type = type
    grunt.config 'pkg', pkg
    grunt.log.ok 'pkg.type = %s', type
  grunt.registerTask 'build', ['concurrent:build']
  grunt.registerTask 'build-crx', [
    'set-build:crx'
    'concat:coffee'
    'coffee:script'
    'concat:crx'
    'copy:crx'
    'clean:tmpcrx'
  ]
  grunt.registerTask 'build-userscript', [
    'set-build:userscript'
    'concat:coffee'
    'coffee:script'
    'concat:userscript'
    'clean:tmpuserscript'
  ]

  grunt.registerTask 'release', ['shell:commit', 'shell:push', 'build-crx', 'compress:crx']
  grunt.registerTask 'patch',   ['shell:checkout', 'bump',       'updcl:3', 'release']
  grunt.registerTask 'minor',   ['shell:checkout', 'bump:minor', 'updcl:2', 'release']
  grunt.registerTask 'major',   ['shell:checkout', 'bump:major', 'updcl:1', 'release']

  grunt.registerTask 'updcl', 'Update the changelog', (headerLevel) ->
    headerPrefix = new Array(+headerLevel + 1).join '#'
    {version} = grunt.config 'pkg'
    today     = grunt.template.today 'yyyy-mm-dd'
    changelog = grunt.file.read 'CHANGELOG.md'

    grunt.file.write 'CHANGELOG.md', "#{headerPrefix} #{version} - *#{today}*\n\n#{changelog}"
    grunt.log.ok "Changelog updated for v#{version}."
