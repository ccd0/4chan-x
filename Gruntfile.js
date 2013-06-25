module.exports = function(grunt) {

  var concatOptions = {
    process: {
      get data() { return grunt.config('pkg'); }
    }
  };
  var shellOptions = {
    stdout: true,
    stderr: true,
    failOnError: true
  };

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      coffee: {
        options: concatOptions,
        src: [
          'src/General/Config.coffee',
          'src/General/Globals.coffee',
          'lib/**/*',
          'src/General/UI.coffee',
          'src/General/Header.coffee',
          'src/General/Notification.coffee',
          'src/General/Settings.coffee',
          'src/General/Get.coffee',
          'src/General/Build.coffee',
          // Features -->
          'src/Filtering/**/*',
          'src/Quotelinks/**/*',
          'src/Posting/**/*',
          'src/Images/**/*',
          'src/Menu/**/*',
          'src/Monitoring/**/*',
          'src/Archive/**/*',
          'src/Miscellaneous/**/*',
          // <--|
          'src/General/Board.coffee',
          'src/General/Thread.coffee',
          'src/General/Post.coffee',
          'src/General/Clone.coffee',
          'src/General/DataBoard.coffee',
          'src/General/Main.coffee'
        ],
        dest: 'tmp-<%= pkg.type %>/script.coffee'
      },
      crx: {
        options: concatOptions,
        files: {
          'builds/crx/manifest.json': 'src/Meta/manifest.json',
          'builds/crx/script.js': [
            'src/Meta/banner.js',
            'tmp-<%= pkg.type %>/script.js'
          ]
        }
      },
      userjs: {
        options: concatOptions,
        src: [
          'src/Meta/metadata.js',
          'src/Meta/banner.js',
          'tmp-<%= pkg.type %>/script.js'
        ],
        dest: 'builds/<%= pkg.name %>.js'
      },
      userscript: {
        options: concatOptions,
        files: {
          'builds/<%= pkg.name %>.meta.js': 'src/Meta/metadata.js',
          'builds/<%= pkg.name %>.user.js': [
            'src/Meta/metadata.js',
            'src/Meta/banner.js',
            'tmp-<%= pkg.type %>/script.js'
          ]
        }
      }
    },
    copy: {
      crx: {
        src: 'img/*.png',
        dest: 'builds/crx/',
        expand:  true,
        flatten: true
      },
      // for_d19
      // 19 juin 2013 10:32:22
      // We're currently sniffing the type of the file based on file extension.
      // We have a different type of content, Themes, which use a pure zip-file with a .zip ending.
      // This solution is sub-optimal and will be changed in the future.
      // For now, upload an unsigned ZIP-file with the ending .nex or .crx.
      nex: {
        src:  'builds/<%= pkg.name %>.zip',
        dest: 'builds/<%= pkg.name %>.nex'
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
    bump: {
      options: {
        updateConfigs: ['pkg'],
        commit:    false,
        createTag: false,
        push:      false
      }
    },
    shell: {
      commit: {
        options: shellOptions,
        command: [
          'git checkout <%= pkg.meta.mainBranch %>',
          'git commit -am "Release <%= pkg.meta.name %> v<%= pkg.version %>."',
          'git tag -a <%= pkg.version %> -m "<%= pkg.meta.name %> v<%= pkg.version %>."',
          'git tag -af stable-v3 -m "<%= pkg.meta.name %> v<%= pkg.version %>."'
        ].join(' && ')
      },
      push: {
        options: shellOptions,
        command: 'git push origin --tags -f && git push origin --all'
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
          'html/**/*',
          'css/**/*',
          'json/**/*',
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
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', ['build']);

  grunt.registerTask('set-build', 'Set the build type variable', function(type) {
    var pkg  = grunt.config('pkg');
    pkg.type = type;
    grunt.config('pkg', pkg);
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

  grunt.registerTask('release', ['shell:commit', 'shell:push', 'build-crx', 'compress:crx', 'copy:nex']);
  grunt.registerTask('patch',   ['bump',       'updcl:3', 'release']);
  grunt.registerTask('minor',   ['bump:minor', 'updcl:2', 'release']);
  grunt.registerTask('major',   ['bump:major', 'updcl:1', 'release']);

  grunt.registerTask('updcl', 'Update the changelog', function(i) {
    // i is the number of #s for markdown.
    var pkg = grunt.config('pkg');
    var version = new Array(+i + 1).join('#') + ' ' + pkg.version + ' - *' + grunt.template.today('yyyy-mm-dd') + '*';
    grunt.file.write('CHANGELOG.md', version + '\n\n' + grunt.file.read('CHANGELOG.md'));
    grunt.log.ok('Changelog updated for v' + pkg.version + '.');
  });
};
