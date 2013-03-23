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
          'src/library.coffee'
          'src/options.coffee'
          'src/enhancing/*.coffee'
          'src/filtering/*.coffee'
          'src/imaging/*.coffee'
          'src/linkification/*.coffee'
          'src/menu/*.coffee'
          'src/monitoring/*.coffee'
          'src/posting/*.coffee'
          'src/quoting/*.coffee'
          'src/style.coffee'
          'src/get.coffee'
          'src/build.coffee'
          'src/main.coffee'
          'src/exec.coffee'
        ]
        dest: 'tmp/script.coffee'

      script:
        options:
          process:
            data: pkg
        src: [
          'meta/data.js'
          'meta/banner.js'
          'tmp/script.js'
        ]
        dest: '<%= pkg.meta.files.userjs %>'

      metadata:
        options:
          process:
            data: pkg
        src:  'meta/data.js',
        dest: '<%= pkg.meta.files.metajs %>'

      latest:
        options:
          process:
            data: pkg
        src:  'meta/latest.js',
        dest: 'latest.js'

    coffee:
      script:
        src:  'tmp/script.coffee'
        dest: 'tmp/script.js'

    exec:
      commit:
        command: ->
          release = "#{pkg.meta.name} v#{pkg.version}"
          return [
            'git checkout master'
            'git commit -am "Release ' + release + '."'
            'git tag -a ' + pkg.version + ' -m "' + release + '."'
            'git tag -af stable -m "' + release + '."'
          ].join(' && ')
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
    'concat:coffee'
    'coffee:script'
    'concat:script'
    'concat:metadata'
    'clean'
  ]

  grunt.registerTask 'release', [
    'default'
    'concat:latest'
    'exec:commit'
    'exec:push'
  ]

  grunt.registerTask 'patch',   [
    'bump'
  ]

  grunt.registerTask 'upgrade', [
    'bump:minor'
  ]
