###
Markers will map icon and coords differently than directibes.api.Marker. This is because Scope and the model marker are
not 1:1 in this setting.
	
	- icon - will be the iconKey to the marker value ie: to get the icon marker[iconKey]
	- coords - will be the coordsKey to the marker value ie: to get the icon marker[coordsKey]

    - watches from IMarker reflect that the look up key for a value has changed and not the actual icon or coords itself
    - actual changes to a model are tracked inside directives.api.model.MarkerModel

###
@module "directives.api", ->
	class @Markers extends directives.api.IMarker
		constructor: ($log, $timeout) ->
			super($log,$timeout)
			self = @
			@template = '<span class="angular-google-map-markers" ng-transclude></span>'
			@clsName = "Markers"
			@scope.models = '=models'
			@markers = []
			@markersIndex = 0
			@mapCtrl = undefined
			@$timeout = $timeout
			@doClick = undefined
			@animate = undefined 
			@$log.info(@)

		controller:($scope, $element) ->
			@getMarkers = ->
				$scope.markers

		validateLinkedScope:(scope)=>
			modelsNotDefined = angular.isUndefined(scope.models) or scope.models == undefined
			if(modelsNotDefined)
				@$log.error(@clsName + ": no valid models attribute found")

			super(scope) or modelsNotDefined

		# if we have made it here all attributes are valid so we can initialize and glue things together	
		linkInit:(element,mapCtrl,scope,animate,doClick) =>
			@mapCtrl = mapCtrl
			@doClick = doClick
			@animate = animate
			@createMarkers(scope)

		createMarkers:(scope) =>
			for model in scope.models
				do(model) =>
					@markers.push( 
						new directives.api.models.MarkerModel(@markersIndex,model,scope,@mapCtrl,@$timeout,@$log, (index) =>
							delete @markers[index]
						,@DEFAULTS,@doClick)
					)
					@markersIndex++
			#put MarkerModels into local scope					
			scope.markers = @markers

		watchModels:(scope) =>
			scope.$watch('models', (newValue, oldValue) =>
				if (newValue != oldValue) 
					for oldM in @markers
						do(oldM) =>
							oldM.destroy()
					delete @markers
					@markers = []
					@markersIndex = 0
					@createMarkers(scope)

			, true)

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