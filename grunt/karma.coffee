Karma = require('karma').Server

module.exports = (grunt) ->
  log = grunt.log.oklns
  (done, karmaConf = require.resolve('../karma.conf.coffee')) ->
    log '-- Karma Setup --'
    try
      server = new Karma
        configFile: karmaConf
        singleRun: true, (code) ->
          log "Karma Callback Code: #{code}"
          done(if !code then undefined else false) #note in gulp pass code
      server.start()
    catch e
      log "KARMA ERROR: #{e}"
      done(false)
