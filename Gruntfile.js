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
            'bootstrap/dist/js/*.js',
            'jquery/dist/*.js',
            'assert/*.js',
            'mocha/*.js'
          ],
          'static/libs/css': [
            'bootstrap/dist/css/*.css',
            'mocha/*.css'
          ],
          'static/libs/fonts': [
            'bootstrap/dist/fonts/*'
          ]
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-bowercopy');

  // Default tasks
  grunt.registerTask('default', ['bowercopy']);
}
