fs = require 'fs'
exec = require('child_process').exec

module.exports = (grunt) ->
  grunt.registerTask 'bower', 'Install bower if bower_components is missing.', ->
    cb = this.async()
    # return if fs.existsSync('bower_components')
    exec 'bower install', (error, stdout, stderr) ->
      console.error error if error
      console.error stderr if stdout
      console.log stdout if stderr
      cb()
