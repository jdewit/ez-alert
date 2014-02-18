'use_strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        commit: true,
        push: false,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'bower.json']
      }
    },
    clean: {
      coverage: 'test/coverage'
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
    clean: {
      coverage: 'coverage'
    },
    uglify: {
      options: {
        mangle: true,
        compile: true,
        compress: true
      },
      dist: {
        files: {
          'dist/ez-alert.min.js': ['src/**/*.js']
        }
      }
    },
    watch: {
      all: {
        files: ['Gruntfile.js', 'src/*.js', 'test/*Spec.js'],
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
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['jshint', 'uglify']);
  grunt.registerTask('dev', ['clean', 'karma:unit:start', 'watch']);
  grunt.registerTask('test', ['karma:unit:singleRun']);
};
