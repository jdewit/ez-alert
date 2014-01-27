'use_strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: [],
        commit: true,
        push: false,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'bower.json']
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: {
        files: {
          src: ['src/**/*.js', 'test/**/*.js']
        },
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
      },
      singleRun: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    less: {
      dist: {
        options: {
          yuicompress: true
        },
        files: {
          "dist/ez-alert.min.css": "src/less/ez-alert.less"
        }
      }
    },
    clean: {
      coverage: 'coverage'
    },
    ngtemplates:  {
      notify:      {
        src:      'src/**/*.html',
        dest:     'dist/ez-alert-notify-tpl.js',
        options: {
          module: 'ez.alert',
          url: function(url) {
            return url.replace('src/', '');
          }
        }
      }
    },
    uglify: {
      options: {
        mangle: false,
        compile: true,
        compress: true
      },
      dist: {
        files: {
          'dist/ez-alert.min.js': ['src/**/*.js'],
          'dist/ez-alert-notify-tpl.js': 'dist/ez-alert-notify-tpl.js'
        }
      }
    },
    watch: {
      all: {
        files: ['Gruntfile.js', 'src/**/*', 'test/**/*Spec.js'],
        tasks: ['default', 'karma:unit:run'],
        options: {
          livereload: 1676,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-angular-templates');

  grunt.registerTask('default', ['jshint', 'ngtemplates', 'uglify']);
  grunt.registerTask('dev', ['shell:clearCoverage', 'karma:unit:start', 'watch']);
  grunt.registerTask('test', ['karma:unit:singleRun']);
};
