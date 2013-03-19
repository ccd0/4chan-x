module.exports = (grunt) ->

  pkg = grunt.file.readJSON 'package.json'

  # Project configuration.
  grunt.initConfig
    pkg: pkg
    concat:
      coffee:
        options:
          process:
            data: pkg
        src: [
          'src/config.coffee'
          'src/globals.coffee'
          'lib/ui.coffee'
          'lib/$.coffee'
          'lib/polyfill.coffee'
          'src/appchan.coffee'
          'src/features.coffee'
          'src/qr.coffee'
          'src/report.coffee'
          'src/main.coffee'
        ]
        dest: 'tmp/script.coffee'

      manifest:
        options:
          process:
            data: pkg
        src: 'src/manifest.json',
        dest: 'builds/crx/manifest.json'

      metadata:
        options:
          process:
            data: pkg
        src:  'src/metadata.js',
        dest: '<%= pkg.name %>.meta.js'

      crx:
        options:
          process:
            data: pkg
        src: [
          'src/banner.js'
          'tmp/script.js'
        ]
        dest: 'builds/crx/script.js'

      userscript:
        options:
          process:
            data: pkg
        src: [
          'src/metadata.js'
          'src/banner.js'
          'tmp/script.js'
        ]
        dest: '<%= pkg.name %>.user.js'

      userjs:
        # Lazily copy the userscript
        src:  '<%= pkg.name %>.user.js'
        dest: 'builds/<%= pkg.name %>.js'

    coffee:
      script:
        src:  'tmp/script.coffee'
        dest: 'tmp/script.js'

    exec:
      commit:
        command: ->
          release = "#{pkg.meta.name} v#{pkg.version}"
          return [
            "git checkout #{pkg.meta.mainBranch}"
            "git commit -am 'Release #{release}.'"
            "git tag -a #{pkg.version} -m '#{release}.'"
            "git tag -af stable -m '#{release}.'"
          ].join(' && ');
        stdout: true

      push:
        command: 'git push origin --all && git push origin --tags'
        stdout: true

    watch:
      all:
        options:
          interrupt: true
        files: [
          'Gruntfile.js'
          'package.json'
          'lib/**/*.coffee'
          'src/**/*.coffee'
          'src/**/*.js'
          'css/**/*.css'
          'img/*'
        ]
        tasks: 'default'

    clean:
      tmp: 'tmp'

  grunt.loadNpmTasks 'grunt-bump'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-exec'

  grunt.registerTask 'default', [
    'concat:coffee',
    'coffee:script',
    'concat:manifest',
    'concat:crx',
    'concat:userscript',
    'concat:userjs',
    'concat:metadata',
    'clean'
  ]

  grunt.registerTask 'release', [
    'default'
    'exec:commit'
    'exec:push'
  ]

  grunt.registerTask 'patch',   [
    'bump'
    'updcl:3'
  ]

  grunt.registerTask 'minor',   [
    'bump:minor'
    'updcl:2'
  ]

  grunt.registerTask 'major',   [
    'bump:major'
    'updcl:1'
  ]
  grunt.registerTask 'updcl',   'Update the changelog', (i) ->
    # Update the `pkg` object with the new version.
    pkg = grunt.file.readJSON('package.json');
    # i is the number of #s for markdown.
    version = []
    version.length = +i + 1
    version = version.join('#') + ' ' + pkg.version + ' *(' + grunt.template.today('yyyy-mm-dd') + ')*'
    grunt.file.write 'CHANGELOG.md', version + '\n' + grunt.file.read('CHANGELOG.md')
    grunt.log.ok     'Changelog updated for v' + pkg.version + '.'