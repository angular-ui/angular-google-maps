log = require('util').log
_ = require 'lodash'

module.exports = (grunt) ->
  # Load the required plugins
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-open"
  grunt.loadNpmTasks "grunt-mkdir"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-jasmine"
  grunt.loadNpmTasks "grunt-conventional-changelog"
  grunt.loadNpmTasks "grunt-bump"
  grunt.loadNpmTasks 'grunt-wrap'

  #squishing this file done by moving grunt options out to its own file. This way we can focus on tasks!
  options = require('./GruntOptions')(grunt)

  allExamples = grunt.file.expand('example/*.html')

  #map allExamples listed from grunt.file.expand to an open format of 'example' -> path
  allExamplesOpen = {}
  allExamples.forEach (path) ->
    root = path.replace('example/', '').replace('.html', '')
    pathValue = "http://localhost:3100/#{path}"
    allExamplesOpen[root] =
      path: pathValue

  showOpenType = (toIterate = allExamplesOpen) ->
    _(toIterate).each (v, k) ->
      log "#{k} -> #{v.path}"
  #showAllExamples()
  options.open = _.extend options.open, allExamplesOpen
  grunt.initConfig options


  # Default task: build a release in dist/
  grunt.registerTask "default", ["clean:dist", "jshint", "mkdir", "coffee", "wrap:basic", "concat:dist", "copy:dist",
                                 "uglify",
                                 "jasmine:spec"]

  grunt.registerTask "fast", ["clean:dist", "jshint", "mkdir", "coffee", "wrap:basic", "concat:dist", "copy:dist",
                              "jasmine:spec"]

  # run default "grunt" prior to generate _SpecRunner.html
  grunt.registerTask "spec", ["clean:dist", "jshint", "mkdir", "coffee", "wrap:basic", "concat:dist", "copy:dist",
                              "connect:jasmineServer", "open:jasmine", "watch:spec"]

  grunt.registerTask "coverage", ["clean:dist", "jshint", "mkdir", "coffee", "wrap:basic", "concat:dist", "copy:dist",
                                  "uglify", "jasmine:coverage"]

  # Run the example page by creating a local copy of angular-google-maps.js
  # and running a webserver on port 3100 with livereload. Web page is opened
  # automatically in the default browser.

  grunt.registerTask 'bump-@', ['bump-only', 'default', 'bump-commit']
  grunt.registerTask 'bump-@-minor', ['bump-only:minor', 'default', 'bump-commit']
  grunt.registerTask 'bump-@-major', ['bump-only:major', 'default', 'bump-commit']

  exampleOpenTasks = []
  _(allExamplesOpen).each (v, key) ->
    basicTask = "open:" + key
    #register individual task (runs by itself)
    grunt.registerTask key, ["clean:example", "connect:server", basicTask, "watch:all"]
    exampleOpenTasks.push basicTask

  #  allExamplesTaskToRun = ["clean:example", "connect:server"].concat(['open:free-draw-polygons','open:example']).concat ['watch:all']
  allExamplesTaskToRun = ["clean:example", "connect:server"].concat(exampleOpenTasks).concat ['watch:all']


  listWithQuotes = (collection, doLog = true) ->
    last = collection.length - 1
    all = ''
    collection.forEach (t, i) ->
      all += if i < last then "'#{t}'," else "'#{t}'"
    if doLog
      return log all
    all

  grunt.registerTask 'listExamples', showOpenType
  grunt.registerTask 'listAllOpen', ->
    showOpenType(options.open)

  grunt.registerTask 'listAllExamplesTasks', ->
    listWithQuotes exampleOpenTasks

  grunt.registerTask 'allExamples', allExamplesTaskToRun

#to see all tasks available don't forget "grunt --help" !!!