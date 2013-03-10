module.exports = (grunt) ->
  
  pkg = grunt.file.readJSON('package.json')
  
  meta = 
    name: pkg.name.replace(/-/g, " ")
    repo: 'https://github.com/zixaphir/appchan-x/'
    files:
      metajs:   '4chan_x.meta.js',
      userjs:   '4chan_x.user.js',
      latestjs: 'latest.js'
      
  template = (filename) ->
    processed = grunt.template.process grunt.file.read(filename), data: {
      pkg
      meta
    }
    grunt.file.write nFilename = "tmp/#{filename}", processed
    nFilename

  # Project configuration.
  grunt.initConfig
    pkg: pkg
    meta: meta

    concat:
      coffee:
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
          template 'src/main.coffee'
          'src/exec.coffee'
        ]
        dest: 'tmp/script.coffee'

      js:
        src: [
          template 'meta/data.js'
          template 'meta/banner.js'
          'tmp/script.js'
        ]
        dest: '<%= meta.files.userjs %>'

      meta:
        src:  [template 'meta/data.js']
        dest: '<%= meta.files.metajs %>'

      latest: 
        src:  [template 'meta/latest.js']
        dest: '<%= meta.files.latestjs %>'

    coffee:
      all:
        src:  'tmp/script.coffee'
        dest: 'tmp/build.js'
      notugly:
        src:  'tmp/script.coffee'
        dest: 'tmp/script.js'

    uglify:
      options:
        compress: false
      files:
        src:  ['tmp/build.js']
        dest: 'tmp/script.js'

    exec:
      commit:
        command: (grunt) ->
          name    = grunt.config(['pkg', 'name']).replace /-/g, ' '
          version = grunt.config ['pkg', 'version']
          return [
            'git checkout master'
            'git commit -am "Release ' + name + ' v' + version + '."'
            'git tag -a ' + version + ' -m "' + version + '"'
            'git tag -af stable -m "' + version + '"'
          ].join ' && '
        stdout: true
      push:
        command: 'git push && git push --tags',
        stdout:  true

    watch:
      files: [
        'grunt.js'
        'src/**/*.coffee'
        'meta/**/*.js'
        'img/*'
      ]
      tasks: 'default'

    clean:
      tmp: ['tmp']

  grunt.loadNpmTasks 'grunt-bump'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-exec'

  grunt.registerTask 'default', [
    'concat:coffee'
    'coffee:all'
    'uglify'
    'concat:js'
    'clean'
  ]
  grunt.registerTask 'notugly', [
    'concat:coffee'
    'coffee:notugly'
    'concat:js'
    'clean'
  ]
  grunt.registerTask 'release', [
    'concat:meta'
    'concat:latest'
    'default'
    'exec:commit'
    'exec:push'
  ]
  grunt.registerTask 'patch',   ['bump']
  grunt.registerTask 'upgrade', ['bump:minor']
