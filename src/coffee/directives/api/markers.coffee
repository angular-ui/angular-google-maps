###
Markers will map icon and coords differently as there us not 1:1 Scope to marker
icon - will be the iconKey to the marker value ie: to get the icon marker[iconKey]
coords - will be the coordsKey to the marker value ie: to get the icon marker[coordsKey]

property changes from IMarker reflect that the look up key for a value has changed and not the actual icon or coords itself

Coords and icons need to be rewatched within Markers linked scope
###
@module "directives.api", ->
	class @Markers extends directives.api.IMarker
		constructor: ($log, $timeout) ->
			super($log,$timeout)
			self = @
			@clsName = "Markers"
			@scope.markers = '=markers'
			@markers = {}
			@markersIndex = 0
			@mapCtrl = undefined
			@$timeout = $timeout
			@$log = $log
			$log.info(@)

		validateLinkedScope:(scope)->
			markerNotDefined = angular.isUndefined(scope.markers) or scope.markers == undefined
			if(markerNotDefined)
				$log.error(@clsName + ": no valid markers attribute found")

			super.validateLinkedScope(scope) or markerNotDefined

		# if we have made it here all attributes are valid so we can initialize and glue things together	
		linkInit:(element,mapCtrl,scope,animate,doClick) =>
			@mapCtrl = mapCtrl
			@createMarkers(element,scope,animate,doClick)

		createMarkers:(element,scope,animate,doClick) =>
			for model in scope.markers
				do(model) =>
					@markers[@markersIndex] = 
						new directives.api.models.MarkerModel(index,model,scope,@$timeout,@$log, (index) =>
							delete @markers[index]
						)

					@markersIndex++
					element.data('instance', @markers)

		watchCoords:(scope) =>
			scope.$watch('coords', (newValue, oldValue) =>
				if (newValue != oldValue) 
					model.coordsKey = newValue for model in @markers
			, true)
					
		watchIcon:(scope) =>
			scope.$watch('icon', (newValue, oldValue) =>
				if (newValue != oldValue) 
					model.iconKey = newValue for model in @markers
			, true)

		watchDestroy:(scope)=>
			#need to figure out how to handle individual destroys
			#slap index to the external model so that when they pass external back
			#for destroy we have a lookup? 
			#this will require another attribute for destroySingle(marker)
			scope.$on("$destroy", => 
				model.destroy() for model in @markers
			)