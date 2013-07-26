@module "directives.api.utils", ->
	@Logger =
		logger: undefined
		doLog: false
		info:(msg) ->
		  if(directives.api.utils.Logger.doLog)
		  		if directives.api.utils.Logger.logger?
		  			directives.api.utils.Logger.logger.info(msg) 
		  		else
		  	    	console.info(msg)