module.exports = (grunt) ->

  importHTML = (filename) ->
    "'''#{grunt.file.read("src/General/html/#{filename}.html").replace(/^\s+|\s+$</gm, '').replace(/\n/g, '')}'''"

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
          'testbuilds/crx/manifest.json': 'src/General/meta/manifest.json'
          'testbuilds/updates.xml': 'src/General/meta/updates.xml'
          'testbuilds/crx/script.js': [
            'src/General/meta/botproc.js'
            'src/General/meta/banner.js'
            'src/General/meta/usestrict.js'
            'tmp-<%= pkg.type %>/script.js'
          ]
          'testbuilds/wcrx/manifest.json': 'src/General/meta/manifest-w.json'
          'testbuilds/wcrx/script.js': [
            'src/General/meta/botproc.js'
            'src/General/meta/banner.js'
            'src/General/meta/usestrict.js'
            'tmp-<%= pkg.type %>/script.js'
          ]
      userscript:
        files:
          'testbuilds/<%= pkg.name %>.meta.js': 'src/General/meta/metadata.js'
          'testbuilds/<%= pkg.name %>.user.js': [
            'src/General/meta/botproc.js'
            'src/General/meta/metadata.js'
            'src/General/meta/banner.js'
            'src/General/meta/usestrict.js'
            'tmp-<%= pkg.type %>/script.js'
          ]

    copy:
      crx:
        src:  'src/General/img/*.png'
        dest: 'testbuilds/crx/'
        expand:  true
        flatten: true
      wcrx:
        src:  'src/General/img/*.png'
        dest: 'testbuilds/wcrx/'
        expand:  true
        flatten: true
      builds:
        cwd: 'testbuilds/'
        src: '**'
        dest: 'builds/'
        expand: true

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
      pack:
        command: 'chromium --pack-extension=testbuilds/crx --pack-extension-key=$HOME/.ssh/<%= pkg.name %>.pem'
      commit:
        command: """
          git commit -am "Release <%= pkg.meta.name %> v<%= pkg.version %>."
          git tag -a <%= pkg.version %> -m "<%= pkg.meta.name %> v<%= pkg.version %>."
          git tag -af stable -m "<%= pkg.meta.name %> v<%= pkg.version %>."
          git checkout gh-pages
          git merge --ff-only stable
          git checkout -
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

    compress:
      crx:
        options:
          archive: 'testbuilds/<%= pkg.name %>.zip'
          level: 9
          pretty: true
        expand:  true
        flatten: true
        src: 'testbuilds/wcrx/*'
        dest: '/'

    clean:
      builds: 'builds'
      testbuilds: 'testbuilds'
      tmpcrx: 'tmp-crx'
      tmpuserscript: 'tmp-userscript'

  require('load-grunt-tasks') grunt

  grunt.registerTask 'default', [
    'build'
  ]

  grunt.registerTask 'set-build', 'Set the build type variable', (type) ->
    pkg = grunt.config 'pkg'
    pkg.type = type
    grunt.config 'pkg', pkg

    if type is 'crx'
      pkg.flex      = '-webkit-flex'
      pkg.order     = '-webkit-order'
      pkg.align     = '-webkit-align'
      pkg.justify   = '-webkit-justify-content'
      pkg.transform = '-webkit-transform'
    else
      pkg.flex      = 'flex'
      pkg.order     = 'order'
      pkg.align     = 'align'
      pkg.justify   = 'justify-content'
      pkg.transform = 'transform'

    grunt.log.ok 'pkg.type = %s', type

  grunt.registerTask 'build', [
    'concurrent:build'
  ]

  grunt.registerTask 'build-crx', [
    'set-build:crx'
    'concat:coffee'
    'coffee:script'
    'concat:crx'
    'copy:crx'
    'copy:wcrx'
    'clean:tmpcrx'
  ]

  grunt.registerTask 'build-userscript', [
    'set-build:userscript'
    'concat:coffee'
    'coffee:script'
    'concat:userscript'
    'clean:tmpuserscript'
  ]

  grunt.registerTask 'release', [
    'build'
    'shell:pack'
    'compress:crx'
    'concat:meta'
    'copy:builds'
    'shell:commit'
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
