@module "directives.api", ->
	class @Marker extends directives.api.IMarker
		constructor: ($log, $timeout) ->
			super($log,$timeout)
			self = @
			$log.info(@)