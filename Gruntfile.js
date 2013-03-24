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
      manifest: {
        options: { process: { data: pkg } },
        src: 'src/manifest.json',
        dest: 'builds/crx/manifest.json'
      },
      crx: {
        options: { process: { data: pkg } },
        src: [
          'src/banner.js',
          'tmp/script.js'
        ],
        dest: 'builds/crx/script.js'
      },
      metadata: {
        options: { process: { data: pkg } },
        src: 'src/metadata.js',
        dest: 'builds/<%= pkg.name %>.meta.js'
      },
      userscript: {
        options: { process: { data: pkg } },
        src: [
          'src/metadata.js',
          'src/banner.js',
          'tmp/script.js'
        ],
        dest: 'builds/<%= pkg.name %>.user.js'
      }
    },
    copy: {
      userjs: {
        // Lazily copy the userscript
        src: 'builds/<%= pkg.name %>.user.js',
        dest: 'builds/<%= pkg.name %>.js'
      },
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
        tasks: 'default'
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

  grunt.registerTask('default', [
    'concat:coffee',
    'coffee:script',
    'concat:manifest',
    'concat:crx',
    'copy:crx',
    'concat:userscript',
    'concat:metadata',
    'copy:userjs',
    'clean:tmp'
  ]);
  grunt.registerTask('release', ['default', 'exec:commit', 'exec:push', 'compress:crx']);
  grunt.registerTask('patch',   ['bump',       'updcl:3']);
  grunt.registerTask('minor',   ['bump:minor', 'updcl:2']);
  grunt.registerTask('major',   ['bump:major', 'updcl:1']);
  grunt.registerTask('updcl', 'Update the changelog', function(i) {
    // Update the `pkg` object with the new version.
    pkg = grunt.file.readJSON('package.json');
    // i is the number of #s for markdown.
    var version = new Array(+i + 1).join('#') + ' ' + pkg.version + ' *(' + grunt.template.today('yyyy-mm-dd') + ')*';
    grunt.file.write('CHANGELOG.md', version + '\n' + grunt.file.read('CHANGELOG.md'));
    grunt.log.ok('Changelog updated for v' + pkg.version + '.');
  });

};
