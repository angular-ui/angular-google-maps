angular.module("google-maps.directives.api.utils")
.service "Logger", [ "$log", ($log)->
    logger: $log
    doLog: false
    info: (msg) ->
        if(@doLog)
            if @logger?
               @logger.info(msg)
            else
                console.info(msg)
    error: (msg) ->
        if(@doLog)
            if @logger?
                @logger.error(msg)
            else
                console.error(msg)
    warn: (msg) ->
        if(@doLog)
            if @logger?
                @logger.warn(msg)
            else
                console.warn(msg)
]