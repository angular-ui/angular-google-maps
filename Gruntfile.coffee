# grunt is split up to be easier to read
# options / customizations are located in ./grunt
# this files purpose:
#  - initialization
#  - list tasks


loads = ['grunt-git-log-json', 'grunt-gh-pages', 'grunt-bower', 'grunt-contrib-copy']
# # Globbing
# for performance reasons we're only matching one level down:
# 'test/spec/{,*/}*.js'
# use this if you want to recursively match all subfolders:
# 'test/spec/**/*.js'
options = require './grunt/options'
# console.log options
module.exports = (grunt) ->
  require('load-grunt-tasks') grunt
  require('time-grunt') grunt

  loads.forEach (l) ->
    grunt.loadNpmTasks l

  #stuff is split up as it is easier to read
  grunt.initConfig options

  grunt.registerTask 'server', (target) ->
    if target is 'dist'
      return grunt.task.run([
        'build'
        'open'
        'connect:dist:keepalive'
      ])
    grunt.task.run [
      'clean:server'
      'concurrent:server'
      'autoprefixer'
      'connect:livereload'
      'open'
      'watch'
    ]
    return

  grunt.registerTask 'test', [
    'clean:server'
    'concurrent:test'
    'autoprefixer'
    'connect:test'
    'bower:test'
    'karma'
  ]

  grunt.registerTask 'build', [
    'clean:dist'
    'bower:dev'
    'git_log_json'
    'useminPrepare'
    'concat:vendor_js' #for testing /devs , overwritten by uglify/usemin
    'concat:vendor_app_js'
    'concat:vendor_css'#for testing /devs, overwritten by cssmin/usemin
    'concat:vendor_app_css'
    "concat:generated"
    "concat:main_js"
    "concat:main_css"
    'concurrent:dist'
    'autoprefixer'
    'copy:vendor_fonts'
    'copy:dist'
    'ngmin'
  ]

  grunt.registerTask 'prod_build', [
    'build'
    'cssmin'
    'uglify'
    'rev'
    'usemin'
  ]

  grunt.registerTask 'default', [
    'clean'
    'test'
    'prod_build'
  ]

  grunt.registerTask 's', ['server']

  return
