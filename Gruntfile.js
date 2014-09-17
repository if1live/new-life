module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bowercopy: {
      options: {
        clean: false
      },
      glob: {
        files: {
          'static/libs/js': [
            'sprintf/dist/*.js',
            'mocha/*.js',
            'assert/*.js'
          ],
          'static/libs/css': [
            'mocha/*.css'
          ],
          'static/libs/fonts': [
          ]
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-bowercopy');

  // Default tasks
  grunt.registerTask('default', ['bowercopy']);
}
