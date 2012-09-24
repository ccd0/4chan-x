module.exports = function(grunt) {

  // Some tasks do not support directives.
  var meta = {
    name: '4chan X Alpha',
    version: '3.0.0',
  };

  // Project configuration.
  grunt.initConfig({
    meta: {
      name: meta.name,
      version: meta.version,
      repo: 'https://github.com/MayhemYDG/4chan-x/',
      banner: [
        '/* <%= meta.name %> - Version <%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
        ' * http://mayhemydg.github.com/4chan-x/',
        ' *',
        ' * Copyright (c) 2009-2011 James Campos <james.r.campos@gmail.com>',
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> Nicolas Stepien <stepien.nicolas@gmail.com>',
        ' * Licensed under the MIT license.',
        ' * <%= meta.repo %>blob/master/LICENSE',
        ' *',
        ' * Contributors:',
        ' * <%= meta.repo %>graphs/contributors',
        ' * Non-GitHub contributors:',
        ' * ferongr, xat-, Ongpot, thisisanon and Anonymous - favicon contributions',
        ' * e000 - cooldown sanity check',
        ' * Seiba - chrome quick reply focusing',
        ' * herpaderpderp - recaptcha fixes',
        ' * WakiMiko - recaptcha tab order http://userscripts.org/scripts/show/82657',
        ' *',
        ' * All the people who\'ve taken the time to write bug reports.',
        ' *',
        ' * Thank you.',
        ' */'
      ].join('\n'),
      metadataBlock: [
        '// ==UserScript==',
        '// @name         <%= meta.name %>',
        '// @version      <%= meta.version %>',
        '// @description  Adds various features.',
        '// @copyright    2009-2011 James Campos <james.r.campos@gmail.com>',
        '// @copyright    <%= grunt.template.today("yyyy") %> Nicolas Stepien <stepien.nicolas@gmail.com>',
        '// @license      MIT; http://en.wikipedia.org/wiki/Mit_license',
        '// @match        *://boards.4chan.org/*',
        '// @match        *://images.4chan.org/*',
        '// @match        *://sys.4chan.org/*',
        '// @match        *://api.4chan.org/*',
        '// @match        *://*.foolz.us/api/*',
        '// @grant        GM_getValue',
        '// @grant        GM_setValue',
        '// @grant        GM_deleteValue',
        '// @grant        GM_openInTab',
        '// @run-at       document-start',
        '// @updateURL    <%= meta.repo %>raw/stable/<%= meta.files.metajs %>',
        '// @downloadURL  <%= meta.repo %>raw/stable/<%= meta.files.userjs %>',
        '// @icon         <%= meta.repo %>raw/stable/img/icon.gif',
        '// ==/UserScript=='
      ].join('\n'),
      latest: 'document.dispatchEvent(new CustomEvent("<%= meta.name.replace(/ /g, "") %>Update",{detail:{v:"<%= meta.version %>"}}))',
      files: {
        metajs:   '4chan_x.meta.js',
        userjs:   '4chan_x.user.js',
        latestjs: 'latestv3.js'
      },
    },
    concat: {
      coffee: {
        src: [
          '<file_template:src/config.coffee>',
          '<file_template:lib/ui.coffee>',
          '<file_template:lib/$.coffee>',
          '<file_template:src/globals.coffee>',
          '<file_template:src/main.coffee>',
          '<file_template:src/features.coffee>'
        ],
        dest: 'tmp/script.coffee'
      },
      js: {
        src: ['<banner:meta.metadataBlock>', '<banner:meta.banner>', 'tmp/script.js'],
        dest: '<config:meta.files.userjs>'
      },
      meta: {
        src:  '<banner:meta.metadataBlock>',
        dest: '<config:meta.files.metajs>'
      },
      latest: {
        src:  '<banner:meta.latest>',
        dest: '<config:meta.files.latestjs>'
      }
    },
    exec: {
      coffee: {
        command: 'coffee --compile tmp/script.coffee',
        stdout: true
      },
      commit: {
        command: [
          'git commit -am "Release ' + meta.name + ' v' + meta.version + '."',
          'git tag -a ' + meta.version + ' -m "' + meta.version + '"',
          'git tag -af stable -m "' + meta.version + '"'
        ].join(' && '),
        stdout: true
      },
      clean: {
        command: 'rm -r tmp'
      }
    },
    watch: {
      files: ['grunt.js', 'lib/**/*.coffee', 'src/**/*.coffee', 'css/**/*.css', 'img/*'],
      tasks: 'coffee concat:build'
    }
  });

  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', 'concat:coffee exec:coffee concat:js exec:clean');
  grunt.registerTask('upgrade', 'concat:meta concat:latest default exec:commit');

};
