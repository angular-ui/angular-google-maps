Karma = require('karma').Server
_ = require 'lodash'

module.exports = (grunt, {confFile, files} = {}) ->
  log = grunt.log.oklns
  confFile = confFile or '../karma.conf.coffee'

  (done) ->
    if typeof confFile == 'string'
      confFile = require.resolve confFile
    if files
      confFactory = require confFile
      genConfig = null
      setConfig = (config) ->
        log 'getting original Karma config'
        genConfig = config

      confFactory(set: setConfig)
      copy = _.extend {}, genConfig
      copy.files.pop()
      files = copy.files.concat files

    log '-- Karma Setup --'
    try
      opts =
        singleRun: true
        configFile: confFile
      if files
        _.extend opts, files: files
      server = new Karma opts, (code) ->
        log "Karma Callback Code: #{code}"
        done(if !code then undefined else false) #note in gulp pass code
      server.start()
    catch error
      log "KARMA ERROR: #{error}"
      done(false)
