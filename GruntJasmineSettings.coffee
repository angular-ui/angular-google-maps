_ = require('lodash')
log = require('util').log

doCover = false #clean cheap way to disable coverage so you can debug the darn code.. thank you blanket

requireConfig =
    paths:
      "lodash": "bower_components/lodash/dist/lodash.underscore"
    deps: ["lodash"]
    callback: (_) ->

log("jasmineSettings: past requireConfig")

spec =
  src: ["bower_components/lodash-amd/main.js", "dist/angular-google-maps.js"]
  options:
    keepRunner: true
    vendor: ["http://maps.googleapis.com/maps/api/js?sensor=false&language=en",
             "bower_components/jquery/dist/jquery.js",
             "bower_components/angular/angular.js",
             "bower_components/angular-mocks/angular-mocks.js"]
    specs: ["tmp/spec/js/bootstrap.js", "tmp/spec/js/**/*spec.js"]
    helpers: ["tmp/spec/js/helpers/helpers.js"]
    template: require "grunt-template-jasmine-requirejs"
    templateOptions:
      requireConfig: requireConfig

log("jasmineSettings: past spec")

coverage = undefined

if doCover
  coverage = _.clone spec
  coverage.options =  _.extend coverage.options,
    template: require "grunt-template-jasmine-istanbul"
    templateOptions:
      template: require "grunt-template-jasmine-requirejs"
      templateOptions:
        requireConfig:
          requireConfig
      coverage: "spec/coverage/coverage.json"
      report: "spec/coverage"
      thresholds:
        lines: 25
        statements: 25
        branches: 5
        functions: 25

log("jasmineSettings: past coverage")

toExport =
  spec: spec
toExport["coverage"] = coverage if coverage

log("jasmineSettings: past toExport")
module.exports = toExport
