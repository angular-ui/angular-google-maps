
module.exports = (config) ->
  config.set
  # base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './'

  # frameworks to use
  # available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine']

  # preprocess matching files before serving them to the browser
  # available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      # 'spec/**/*.coffee': ['coffee']
      'spec/**/**/*.coffee': ['coffee']
    }

  # list of files / patterns to load in the browser
    files: [
      # 'https://maps.googleapis.com/maps/api/js?sensor=false'
      'node_modules/phantomjs-polyfill/bind-polyfill.js'
      './tmp/acceptance/webpack.acceptance.js'
      'bower_components/angular-mocks/angular-mocks.js'
      'spec/coffee/bootstrap/bootstrap.coffee'
      'spec/coffee/bootstrap/google-api-mock.coffee'
      'spec/coffee/bootstrap/initiator.coffee'
      #do not include those specs for jasmine html runner by karma kama_jasmine_runner.html
      {pattern:'*coffee', included: false}
      'spec/coffee/**/*.spec.coffee'
    ]

  # list of files to exclude
    exclude: [
    ]

  # test results reporter to use
  # possible values: 'dots', 'progress'
  # available reporters: https://npmjs.org/browse/keyword/karma-reporter
  # NOTE , TODO 'html' reporter use if you want to hit the karma jasmine runner (frequently causes karma to blow up at the end of run),
  # test results reporter to use
  # possible values: 'dots', 'progress', 'mocha'
    reporters: ['mocha', 'coverage']

  # web server port
    port: 9876

  # enable / disable colors in the output (reporters and logs)
    colors: true

  # level of logging
  # possible values:
  # - config.LOG_DISABLE
  # - config.LOG_ERROR
  # - config.LOG_WARN
  # - config.LOG_INFO
  # - config.LOG_DEBUG
    logLevel: config.LOG_INFO

  # enable / disable watching file and executing tests whenever any file changes
    autoWatch: false

  # start these browsers
  # available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: process.env.KARMA_BROWSERS?.split(',') ? ['PhantomJS']# options Chrome, PhantomJS
  #browserNoActivityTimeout: 200000000000000000000000000000000
  # If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000
  # Continuous Integration mode
  # if true, Karma captures browsers, runs the tests and exits
    singleRun: false

    plugins: [
      'karma-mocha-reporter'
      'karma-jasmine'
      'karma-coverage'
      'karma-chrome-launcher'
      'karma-phantomjs-launcher'
      'karma-coffee-preprocessor'
    ]
