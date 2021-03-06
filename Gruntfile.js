module.exports = function (grunt) {
  'use strict';
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  // config
  var projectConfig = {
    app: 'app',
    dist: 'dist'
  };
  grunt.initConfig({
    project: projectConfig,
    pkg: grunt.file.readJSON('package.json'),
    karma: {
      unit: { configFile: 'karma.conf.js', background: true }
    },
    mocha_phantomjs: {
      all: {
        options: {
          urls: [
            'http://localhost:8000/specrunner.html'
          ]
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: '.'
        }
      }
    },
    clean: ['<%= project.dist %>/'],
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> | version: <%= pkg.version %> | built: <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      multi: {
        files: [{
          expand: true,
          cwd: '<%= project.app %>',
          src: [
            '*.js',
            'js/*.js',
            'js/controllers/*.js',
            'js/widgets/*.js',
            'js/widgets/**/*.js',
            'js/widgets/**/**/*.js',
            'js/widgets/**/**/**/*.js',
            // ignore spec files
            '!*Spec.js',
            '!js/*Spec.js',
            '!js/controllers/*Spec.js',
            '!js/widgets/*Spec.js',
            '!js/widgets/**/*Spec.js',
            '!js/widgets/**/**/*Spec.js',
            '!js/widgets/**/**/**/*Spec.js'
          ],
          dest: '<%= project.dist %>/',
          ext: '.js'
        }]
      }

    },
    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      prod: {
        files: [{
          expand: true,
          cwd: '<%= project.app %>',
          src: ['*.html'],
          dest: '<%= project.dist %>/',
          ext: '.html'
        }, {
          expand: true,
          cwd: '<%= project.app %>',
          src: ['**/**/**/**/*.tpl.html'],
          dest: '<%= project.dist %>/',
          ext: '.tpl.html'
        }
        ]
      },
      single: {
        files: [{
          expand: true,
          cwd: '<%= project.app %>',
          src: ['*.html'],
          dest: '<%= project.dist %>/',
          ext: '.html'
        }]
      }
    },
    copy: {
      prod: {
        files: [{
          expand: true,
          cwd: '<%= project.app %>',
          src: ['config.deploy.json'],
          dest: '<%= project.dist %>/',
          rename: function(dest) {
            return dest + 'config.json';
          }
        }, {
          expand: 'true',
          flatten: 'true',
          src: ['<%= project.app %>/css/main.css'],
          dest: '<%= project.dist %>/css',
          filter: 'isFile'
        }, {
          expand: true,
          cwd: '<%= project.app %>',
          src: ['img/**', 'css/fonts/**', 'vendor/**'],
          dest: '<%= project.dist %>/'
        }
        ]
      },
      single: {
        files: [{
          expand: 'true',
          flatten: 'true',
          src: ['<%= project.app %>/js/run.js'],
          dest: '<%= project.dist %>/js',
          filter: 'isFile'
        }, {
          expand: 'true',
          flatten: 'true',
          src: ['<%= project.app %>/css/main.css'],
          dest: '<%= project.dist %>/css',
          filter: 'isFile'
        }, {
          expand: true,
          cwd: '<%= project.app %>',
          src: ['img/**', 'css/fonts/**', 'config.json', 'vendor/**'],
          dest: '<%= project.dist %>/'
        }]
      },
      dev: {
        files: [{
          expand: 'true',
          flatten: 'true',
          src: ['<%= project.app %>/css/main.css'],
          dest: '<%= project.dist %>/css',
          filter: 'isFile'
        }, {
          expand: true,
          cwd: '<%= project.app %>',
          src: ['img/**', 'css/fonts/**', 'config.json', 'vendor/**'],
          dest: '<%= project.dist %>/'
        }]
      }
    },
    less: {
      options: {
        paths: ['<%= project.app %>/css/less'],
        compress: true,
        cleancss: true
      },
      dev: {
        files: {
          '<%= project.app %>/css/main.css': [
            '<%= project.app %>/css/less/main.less',
            '<%= project.app %>/js/**/**/css/*.less'
          ]
        }
      },
      prod: {
        files: {
          '<%= project.dist %>/css/main.css': [
            '<%= project.app %>/css/less/main.less',
            '<%= project.app %>/js/**/**/css/*.less',
            '<%= project.app %>/js/**/**/**/css/*.less'
          ]
        }
      }
    },
    watch: {
      styles: {
        files: [
          '<%= project.app %>/css/less/*.less',
          '<%= project.app %>/js/**/**/css/*.less',
          '<%= project.app %>/js/**/**/**/css/*.less'
        ],
        tasks: ['less:dev'],
        nospawn: true
      },
      code: {
        files: [
          '<%= project.app %>/*.js',
          '<%= project.app %>/**/*.js',
          '<%= project.app %>/**/**/*.js',
          '<%= project.app %>/**/**/**/*.js',
          'spec/*.js', 'spec/**/*.js',
          'spec/**/**/*.js',
          'spec/**/**/**/*.js',
          'spec/**/**/**/**/*.js'
        ],
        tasks: ['karma:unit:run'],
        options: { livereload: true }
      }
    }
  });

  grunt.registerTask('dev', ['karma:unit:start', 'watch']);
  grunt.registerTask('test', ['connect', 'mocha_phantomjs']);
  grunt.registerTask('default', ['clean', 'uglify:multi', 'htmlmin:prod', 'less:prod', 'copy:dev']);
};
