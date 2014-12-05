angular.module("uiGmapgoogle-maps.directives.api.utils")
.service "uiGmapLogger", [ "$log", ($log) ->
  #defaulting logging to be on with error only (better for perf and less mysterious errors)
  @doLog = true

  LEVELS =
    log: 1
    info: 2
    debug: 3
    warn: 4
    error: 5
    none: 6

  maybeExecLevel = (level, current, fn) ->
    fn() if level >= current

  log = (logLevelFnName, msg) ->
    if $log?
      $log[logLevelFnName] msg
    else
      console[logLevelFnName] msg

  logFns = {}
  ['log', 'info', 'debug', 'warn', 'error'].forEach (level) =>
    logFns[level] = (msg) =>
      if @doLog
        maybeExecLevel LEVELS[level], @currentLevel, ->
          log level, msg

  @LEVELS = LEVELS
  @currentLevel =
    LEVELS.error
  @log = logFns['log']
  @info = logFns['info']
  @debug = logFns['debug']
  @warn = logFns['warn']
  @error = logFns['error']
  @
]
