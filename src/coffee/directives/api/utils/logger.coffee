@ngGmapModule "directives.api.utils", ->
    @Logger =
        logger: undefined
        doLog: false
        info: (msg) ->
            if(logger.doLog)
                if logger.logger?
                    logger.logger.info(msg)
                else
                    console.info(msg)
        error: (msg) ->
            if(logger.doLog)
                if logger.logger?
                    logger.logger.error(msg)
                else
                    console.error(msg)
    logger = @Logger