@module "directives.api.models.parent", ->
	class @MarkersParentModel extends directives.api.models.parent.IMarkerParentModel
		constructor: (scope, element, attrs, mapCtrl,$timeout) ->
			super(scope, element, attrs, mapCtrl,$timeout)
			self = @
			@clsName = "MarkersParentModel"
			@markers = []
			@markersIndex = 0
			@scope = scope
			@$log.info(@)

		onTimeOut:(scope)=>
			@watchModels(scope)
			@createMarkers(scope)

		validateScope:(scope)=>
			modelsNotDefined = angular.isUndefined(scope.models) or scope.models == undefined
			if(modelsNotDefined)
				@$log.error(@clsName + ": no valid models attribute found")

			super(scope) or modelsNotDefined

		createMarkers:(scope) =>
			for model in scope.models
				do(model) =>
					@markers.push( 
						new directives.api.models.child.MarkerChildModel(@markersIndex,model,scope,@mapCtrl,@$timeout,(index) =>
							delete @markers[index]
						,@DEFAULTS,@doClick)
					)
					@markersIndex++
			#put MarkerModels into local scope					
			scope.markerModels = @markers

		reBuildMarkers:(scope) =>
			for oldM in @markers
				do(oldM) =>
					oldM.destroy()
			delete @markers
			@markers = []
			@markersIndex = 0
			@createMarkers(scope)

		watchModels:(scope) =>
			scope.$watch('models', (newValue, oldValue) =>
				if (newValue != oldValue) 
					@reBuildMarkers(scope)
			, true)

		watchCoords:(scope) =>
			scope.$watch('coords', (newValue, oldValue) =>
				if (newValue != oldValue) 
					@reBuildMarkers(scope)
			, true)
					
		watchIcon:(scope) =>
			scope.$watch('icon', (newValue, oldValue) =>
				if (newValue != oldValue) 
					@reBuildMarkers(scope)
			, true)

		watchDestroy:(scope)=>
			#need to figure out how to handle individual destroys
			#slap index to the external model so that when they pass external back
			#for destroy we have a lookup? 
			#this will require another attribute for destroySingle(marker)
			scope.$on("$destroy", => 
				model.destroy() for model in @markers
			)