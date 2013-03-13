module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    concat: {
      coffee: {
        options: { process: { data: pkg } },
        src: [
          'src/config.coffee',
          'src/globals.coffee',
          'lib/ui.coffee',
          'lib/$.coffee',
          'lib/polyfill.coffee',
          'src/features.coffee',
          'src/qr.coffee',
          'src/report.coffee',
          'src/main.coffee'
        ],
        dest: 'tmp/script.coffee'
      },
      script: {
        options: { process: { data: pkg } },
        src: [
          'src/metadata.js',
          'src/banner.js',
          'tmp/script.js'
        ],
        dest: '<%= pkg.meta.files.userjs %>'
      },
      metadata: {
        options: { process: { data: pkg } },
        src: 'src/metadata.js',
        dest: '<%= pkg.meta.files.metajs %>'
      }
    },
    coffee: {
      script: {
        src:  'tmp/script.coffee',
        dest: 'tmp/script.js'
      }
    },
    exec: {
      commit: {
        command: function() {
          var release = pkg.meta.name + ' v' + pkg.version;
          return [
            'git checkout ' + pkg.meta.mainBranch,
            'git commit -am "Release ' + release + '."',
            'git tag -a ' + pkg.version + ' -m "' + release + '."',
            'git tag -af stable -m "' + release + '."'
          ].join(' && ');
        },
        stdout: true
      },
      push: {
        command: 'git push origin --all && git push origin --tags',
        stdout: true
      }
    },
    watch: {
      all: {
        options: {
          interrupt: true
        },
        files: [
          'Gruntfile.js',
          'package.json',
          'lib/**/*.coffee',
          'src/**/*.coffee',
          'src/**/*.js',
          'css/**/*.css',
          'img/*'
        ],
        tasks: 'default'
      }
    },
    clean: {
      tmp: 'tmp'
    }
  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', ['concat:coffee', 'coffee:script', 'concat:script', 'concat:metadata', 'clean']);
  grunt.registerTask('release', ['default', 'exec:commit', 'exec:push']);
  grunt.registerTask('patch',   ['bump',       'updcl:3']);
  grunt.registerTask('minor',   ['bump:minor', 'updcl:2']);
  grunt.registerTask('major',   ['bump:major', 'updcl:1']);
  grunt.registerTask('updcl', 'Update the changelog', function(i) {
    // Update the `pkg` object with the new version.
    pkg = grunt.file.readJSON('package.json');
    // i is the number of #s for markdown.
    var version = new Array(+i + 1).join('#') + ' ' + pkg.version;
    grunt.file.write('CHANGELOG.md', version + '\n' + grunt.file.read('CHANGELOG.md'));
    grunt.log.ok('Changelog updated for v' + pkg.version + '.');
  });

};
