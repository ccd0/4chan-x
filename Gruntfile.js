module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');
  var concatOptions = {
    process: {
      data: pkg
    }
  };

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    concat: {
      coffee: {
        options: concatOptions,
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
        dest: 'tmp-<%= pkg.type %>/script.coffee'
      },
      crx: {
        options: concatOptions,
        files: {
          'builds/crx/manifest.json': 'src/manifest.json',
          'builds/crx/script.js': [
            'src/banner.js',
            'tmp-<%= pkg.type %>/script.js'
          ]
        }
      },
      userjs: {
        options: concatOptions,
        src: [
          'src/metadata.js',
          'src/banner.js',
          'tmp-<%= pkg.type %>/script.js'
        ],
        dest: 'builds/<%= pkg.name %>.js'
      },
      userscript: {
        options: concatOptions,
        files: {
          'builds/<%= pkg.name %>.meta.js': 'src/metadata.js',
          'builds/<%= pkg.name %>.user.js': [
            'src/metadata.js',
            'src/banner.js',
            'tmp-<%= pkg.type %>/script.js'
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
        src:  'tmp-<%= pkg.type %>/script.coffee',
        dest: 'tmp-<%= pkg.type %>/script.js'
      }
    },
    concurrent: {
      build: ['build-crx', 'build-userjs', 'build-userscript']
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
        command: 'git push origin --tags -f && git push origin --all',
        stdout: true
      }
    },
    watch: {
      all: {
        options: {
          interrupt: true,
          nospawn: true
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
          archive: 'builds/<%= pkg.name %>.zip',
          level: 9,
          pretty: true
        },
        expand: true,
        flatten: true,
        src: 'builds/crx/*',
        dest: '/'
      }
    },
    clean: {
      builds: 'builds',
      tmpcrx: 'tmp-crx',
      tmpuserjs: 'tmp-userjs',
      tmpuserscript: 'tmp-userscript'
    }
  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-concurrent');
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
  grunt.registerTask('build', ['concurrent:build']);
  grunt.registerTask('build-crx', [
    'set-build:crx',
    'concat:coffee',
    'coffee:script',
    'concat:crx',
    'copy:crx',
    'clean:tmpcrx'
  ]);
  grunt.registerTask('build-userjs', [
    'set-build:userjs',
    'concat:coffee',
    'coffee:script',
    'concat:userjs',
    'clean:tmpuserjs'
  ]);
  grunt.registerTask('build-userscript', [
    'set-build:userscript',
    'concat:coffee',
    'coffee:script',
    'concat:userscript',
    'clean:tmpuserscript'
  ]);

  grunt.registerTask('release', ['exec:commit', 'exec:push', 'build-crx', 'compress:crx']);
  grunt.registerTask('patch',   ['bump',       'reloadPkg', 'updcl:3', 'release']);
  grunt.registerTask('minor',   ['bump:minor', 'reloadPkg', 'updcl:2', 'release']);
  grunt.registerTask('major',   ['bump:major', 'reloadPkg', 'updcl:1', 'release']);

  grunt.registerTask('reloadPkg', 'Reload the package', function() {
    // Update the `pkg` object with the new version.
    pkg = grunt.file.readJSON('package.json');
    concatOptions.process.data = pkg;
    grunt.log.ok('pkg reloaded.');
  });

  grunt.registerTask('updcl', 'Update the changelog', function(i) {
    // i is the number of #s for markdown.
    var version = new Array(+i + 1).join('#') + ' ' + pkg.version + ' - *' + grunt.template.today('yyyy-mm-dd') + '*';
    grunt.file.write('CHANGELOG.md', version + '\n\n' + grunt.file.read('CHANGELOG.md'));
    grunt.log.ok('Changelog updated for v' + pkg.version + '.');
  });

};
