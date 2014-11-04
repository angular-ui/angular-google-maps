angular.module("uiGmapgoogle-maps.directives.api.utils")
.service "uiGmapLogger", [ "$log", ($log)->
  doLog: false
  info: (msg) ->
    if(@doLog)
      if $log?
        $log.info(msg)
      else
        console.info(msg)
  log: (msg) ->
    if(@doLog)
      if $log?
        $log.log(msg)
      else
        console.log(msg)
  error: (msg) ->
    if(@doLog)
      if $log?
        $log.error(msg)
      else
        console.error(msg)
  debug: (msg) ->
    if(@doLog)
      if $log?
        $log.debug(msg)
      else
        console.debug(msg)
  warn: (msg) ->
    if(@doLog)
      if $log?
        $log.warn(msg)
      else
        console.warn(msg)
]
