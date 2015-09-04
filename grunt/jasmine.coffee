_ = require('lodash')
log = require('util').log

doCover = false #clean cheap way to disable coverage so you can debug the darn code.. thank you blanket

_requireConfig =
  paths:
    'lodash': 'bower_components/lodash/lodash'
    'angular-mock': 'bower_components/angular-mocks/angular-mocks'
  deps: ['lodash', 'angular-mock']

# log('jasmineSettings: past requireConfig')

spec =
  src: ['dist/angular-google-maps_dev_mapped.js']
  options:
    keepRunner: true
    vendor: [
      'tmp/string.js'
      'bower_components/angular/angular.js'
      'bower_components/angular-simple-logger/dist/index.js'

    ]
    specs: ['tmp/spec/coffee/bootstrap.spec.js', 'tmp/spec/**/*spec.js']
    helpers: [
      # 'tmp/spec/coffee/helpers/initiator.spec.js'
    ]
    template: require 'grunt-template-jasmine-requirejs'
    templateOptions:
      requireConfig: _requireConfig

consoleSpec = _.extend {}, spec
consoleSpec.src = 'dist/angular-google-maps.js'

# log('jasmineSettings: past spec')

coverage = undefined

if doCover
  coverage = _.clone spec
  coverage.options = _.extend coverage.options,
    template: require 'grunt-template-jasmine-istanbul'
    templateOptions:
      template: require 'grunt-template-jasmine-requirejs'
      templateOptions:
        requireConfig:
          _requireConfig
      coverage: 'spec/coverage/coverage.json'
      report: 'spec/coverage'
      thresholds:
        lines: 25
        statements: 25
        branches: 5
        functions: 25

# log('jasmineSettings: past coverage')

toExport =
  spec: spec
  consoleSpec: consoleSpec
toExport['coverage'] = coverage if coverage

# log('jasmineSettings: past toExport')
module.exports = toExport
