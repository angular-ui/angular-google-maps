angular.module("google-maps.directives.api.utils")
.service "Logger", [ "$log", ($log)->
  doLog: false
  info: (msg) ->
    if(@doLog)
      if $log?
        $log.info(msg)
      else
        console.info(msg)
  error: (msg) ->
    if(@doLog)
      if $log?
        $log.error(msg)
      else
        console.error(msg)
  warn: (msg) ->
    if(@doLog)
      if $log?
        $log.warn(msg)
      else
        console.warn(msg)
]