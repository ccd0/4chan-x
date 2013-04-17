module.exports = (grunt) ->

  pkg = grunt.file.readJSON 'package.json'
  concatOptions =
    process:
      data: pkg

  # Project configuration.
  grunt.initConfig
    pkg: pkg
    concat:
      coffee:
        options: concatOptions
        src: [
          'src/code/config.coffee'
          'src/code/globals.coffee'
          'src/lib/*.coffee'
          'src/code/*/*.coffee'
          'src/code/settings.coffee'
          'src/code/main.coffee'
        ]
        dest: 'tmp-<%= pkg.type %>/script.coffee'

      crx:
        options: concatOptions
        files:
          'builds/crx/manifest.json': 'src/meta/manifest.json'
          'builds/crx/script.js': [
            'src/banner.js'
            'tmp-<%= pkg.type %>/script.js'
          ]

      userjs:
        options: concatOptions
        src: [
          'src/meta/metadata.js'
          'src/meta/banner.js'
          'tmp-<%= pkg.type %>/script.js'
        ]
        dest: 'builds/<%= pkg.name %>.js'

      userscript:
        options: concatOptions
        files:
          'builds/<%= pkg.name %>.meta.js': 'src/metadata.js'
          'builds/<%= pkg.name %>.user.js': [
            'src/meta/metadata.js'
            'src/meta/banner.js'
            'tmp-<%= pkg.type %>/script.js'
          ]

    copy:
      crx:
        src:    'src/img/*.png'
        dest:   'builds/crx/'
        expand:  true
        flatten: true

    coffee:
      script:
        src:  'tmp-<%= pkg.type %>/script.coffee'
        dest: 'tmp-<%= pkg.type %>/script.js'

    concurrent:
      build: [
        'build-crx'
        'build-userjs'
        'build-userscript'
      ]

    exec:
      commit:
        command: ->
          release = "#{pkg.meta.name} v#{pkg.version}"
          return [
            'git checkout ' + pkg.meta.mainBranch,
            'git commit -am "Release ' + release + '."',
            'git tag -a ' + pkg.version + ' -m "' + release + '."',
            'git tag -af stable-v3 -m "' + release + '."'
          ].join(' && ');
        stdout: true

      push:
        command: 'git push origin --all && git push origin --tags'
        stdout: true

    watch:
      all:
        options:
          interrupt: true
          nospawn:   true
        files: [
          'Gruntfile.coffee'
          'package.json'
          'src/**/*'
        ]
        tasks: 'build'

    compress:
      crx:
        options:
          archive: 'builds/<%= pkg.name %>.zip'
          level: 9
          pretty: true
        expand: true
        cwd: 'builds/crx/'
        src: '**'

    clean:
      builds:        'builds'
      tmpcrx:        'tmp-crx'
      tmpuserjs:     'tmp-userjs'
      tmpuserscript: 'tmp-userscript'

  grunt.loadNpmTasks 'grunt-bump'
  grunt.loadNpmTasks 'grunt-concurrent'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-compress'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-exec'

  grunt.registerTask 'default', [
    'build'
  ]

  grunt.registerTask 'set-build', 'Set the build type variable', (type) ->
    pkg.type = type;
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
    'clean:tmpcrx'
  ]

  grunt.registerTask 'build-userjs', [
    'set-build:userjs'
    'concat:coffee'
    'coffee:script'
    'concat:userjs'
    'clean:tmpuserjs'
  ]

  grunt.registerTask 'build-userscript', [
    'set-build:userscript'
    'concat:coffee'
    'coffee:script'
    'concat:userscript'
    'clean:tmpuserscript'
  ]

  grunt.registerTask 'release', [
    'default'
    'exec:commit'
    'exec:push'
  ]

  grunt.registerTask 'patch',   [
    'bump'
    'reloadPkh'
    'updcl:3'
  ]

  grunt.registerTask 'minor',   [
    'bump:minor'
    'reloadPkh'
    'updcl:2'
  ]

  grunt.registerTask 'major',   [
    'bump:major'
    'reloadPkh'
    'updcl:1'
  ]

  grunt.registerTask 'reloadPkg', 'Reload the package', ->
    # Update the `pkg` object with the new version.
    pkg = grunt.file.readJSON('package.json')
    concatOptions.process.data = pkg
    grunt.log.ok('pkg reloaded.')

  grunt.registerTask 'updcl',   'Update the changelog', (i) ->
    # i is the number of #s for markdown.
    version = []
    version.length = +i + 1
    version = version.join('#') + ' ' + pkg.version + ' *(' + grunt.template.today('yyyy-mm-dd') + ')*'
    grunt.file.write 'CHANGELOG.md', version + '\n' + grunt.file.read('CHANGELOG.md')
    grunt.log.ok     'Changelog updated for v' + pkg.version + '.'