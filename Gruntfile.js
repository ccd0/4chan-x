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
          'src/databoard.coffee',
          'src/main.coffee'
        ],
        dest: 'tmp/script.coffee'
      },
      crx: {
        options: { process: { data: pkg } },
        files: {
          'builds/crx/manifest.json': 'src/manifest.json',
          'builds/crx/script.js': [
            'src/banner.js',
            'tmp/script.js'
          ]
        }
      },
      userjs: {
        options: { process: { data: pkg } },
        src: [
          'src/metadata.js',
          'src/banner.js',
          'tmp/script.js'
        ],
        dest: 'builds/<%= pkg.name %>.js'
      },
      userscript: {
        options: { process: { data: pkg } },
        files: {
          'builds/<%= pkg.name %>.meta.js': 'src/metadata.js',
          'builds/<%= pkg.name %>.user.js': [
            'src/metadata.js',
            'src/banner.js',
            'tmp/script.js'
          ]
        }
      }
    },
    copy: {
      crx: {
        src: 'img/*.png',
        dest: 'builds/crx/',
        expand: true,
        flatten: true
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
            'git tag -af stable-v3 -m "' + release + '."'
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
          'lib/**/*',
          'src/**/*',
          'css/**/*',
          'img/**/*'
        ],
        tasks: 'build'
      }
    },
    compress: {
      crx: {
        options: {
          archive: 'builds/4chan-X.zip',
          level: 9,
          pretty: true
        },
        expand: true,
        cwd: 'builds/crx/',
        src: '**'
      }
    },
    clean: {
      builds: 'builds',
      tmp: 'tmp'
    }
  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', ['build']);

  grunt.registerTask('set-build', 'Set the build type variable', function(type) {
    pkg.type = type;
    grunt.log.ok('pkg.type = %s', type);
  });
  grunt.registerTask('build', ['build-crx', 'build-userjs', 'build-userscript']);
  grunt.registerTask('build-crx', [
    'set-build:crx',
    'concat:coffee',
    'coffee:script',
    'concat:crx',
    'copy:crx',
    'clean:tmp'
  ]);
  grunt.registerTask('build-userjs', [
    'set-build:userjs',
    'concat:coffee',
    'coffee:script',
    'concat:userjs',
    'clean:tmp'
  ]);
  grunt.registerTask('build-userscript', [
    'set-build:userscript',
    'concat:coffee',
    'coffee:script',
    'concat:userscript',
    'clean:tmp'
  ]);

  grunt.registerTask('release', ['exec:commit', 'exec:push', 'compress:crx']);
  grunt.registerTask('patch',   ['bump',       'updcl:3']);
  grunt.registerTask('minor',   ['bump:minor', 'updcl:2']);
  grunt.registerTask('major',   ['bump:major', 'updcl:1']);
  grunt.registerTask('updcl', 'Update the changelog', function(i) {
    // Update the `pkg` object with the new version.
    pkg = grunt.file.readJSON('package.json');
    // i is the number of #s for markdown.
    var version = new Array(+i + 1).join('#') + ' ' + pkg.version + ' - *' + grunt.template.today('yyyy-mm-dd') + '*';
    grunt.file.write('CHANGELOG.md', version + '\n\n' + grunt.file.read('CHANGELOG.md'));
    grunt.log.ok('Changelog updated for v' + pkg.version + '.');
  });

};
