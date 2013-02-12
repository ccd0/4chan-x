module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      name: '<%= pkg.name.replace(/-/g, " ") %>',
      repo: 'https://github.com/zixaphir/appchan-x/',
      files: {
        metajs:   '4chan_x.meta.js',
        userjs:   '4chan_x.user.js',
        latestjs: 'latest.js'
      }
    },
    concat: {
      coffee: {
        src: [
          'src/config.coffee',
          'src/library.coffee',
          'src/options.coffee',
          'src/enhancing/*.coffee',
          'src/filtering/*.coffee',
          'src/imaging/*.coffee',
          'src/linkification/*.coffee',
          'src/menu/*.coffee',
          'src/monitoring/*.coffee',
          'src/posting/*.coffee',
          'src/quoting/*.coffee',
          'src/get.coffee',
          'src/build.coffee',
          'src/style.coffee',
          '<file_template:src/main.coffee>',
          'src/exec.coffee'
        ],
        dest: 'tmp/script.coffee'
      },
      js: {
        src: [
          '<file_template:meta/data.js>',
          '<file_template:meta/banner.js>',
          'tmp/script.js'
        ],
        dest: '<config:meta.files.userjs>'
      },
      meta: {
        src:  '<file_template:meta/data.js>',
        dest: '<config:meta.files.metajs>'
      },
      latest: {
        src:  '<file_template:meta/latest.js>',
        dest: '<config:meta.files.latestjs>'
      }
    },
    coffee: {
      all: {
        src:  'tmp/script.coffee',
        dest: 'tmp/script.js'
      }
    },
    exec: {
      commit: {
        command: function(grunt) {
          var name, version;
          name    = grunt.config(['pkg', 'name']).replace(/-/g, ' ');
          version = grunt.config(['pkg', 'version']);
          return [
            'git commit -am "Release ' + name + ' v' + version + '."'
          ].join(' && ');
        },
        stdout: true
      },
      push: {
        command: 'git push',
        stdout: true
      }
    },
    watch: {
      files: [
        'grunt.js',
        'src/**/*.coffee',
        'meta/**/*.js',
        'img/*'
      ],
      tasks: 'default'
    },
    clean: {
      tmp:['tmp']
    }
  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', 'concat:coffee coffee concat:js clean');
  grunt.registerTask('release', 'concat:meta concat:latest default exec:commit exec:push');
  grunt.registerTask('patch',   'bump');
  grunt.registerTask('upgrade', 'bump:minor');

};
