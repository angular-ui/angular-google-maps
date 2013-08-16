@ngGmapModule "directives.api.models.parent", ->
	class @MarkersParentModel extends directives.api.models.parent.IMarkerParentModel
		constructor: (scope, element, attrs, mapCtrl,$timeout) ->
			super(scope, element, attrs, mapCtrl,$timeout)
			self = @
			@markers = []
			@markersIndex = 0
			@scope = scope
			@bigGulp =  directives.api.utils.AsyncProcessor
			@$log.info(@)

		onTimeOut:(scope)=>
			@watch('models',scope)
			@createMarkers(scope)

		validateScope:(scope)=>
			modelsNotDefined = angular.isUndefined(scope.models) or scope.models == undefined
			if(modelsNotDefined)
				@$log.error(@constructor.name + ": no valid models attribute found")

			super(scope) or modelsNotDefined

		createMarkers:(scope) =>
			@bigGulp.handleLargeArray(scope.models,(model) =>
				scope.doRebuild = true
				@markers.push( 
					new directives.api.models.child.MarkerChildModel(@markersIndex,model,scope,@mapCtrl,@$timeout,(index) =>
						delete @markers[index]
					,@DEFAULTS,@doClick)
				)
				@markersIndex++
			)
			#put MarkerModels into local scope					
			scope.markerModels = @markers

		reBuildMarkers:(scope) =>
			if(!scope.doRebuild and scope.doRebuild != undefined)
				return
			for oldM in @markers
				do(oldM) =>
					oldM.destroy()
			delete @markers
			@markers = []
			@markersIndex = 0
			@createMarkers(scope)

		onWatch:(propNameToWatch,scope,newValue,oldValue) =>
			if(propNameToWatch == 'models' and newValue.length == oldValue.length)
				return
			@reBuildMarkers(scope)

		onDestroy:(scope)=>
			#need to figure out how to handle individual destroys
			#slap index to the external model so that when they pass external back
			#for destroy we have a lookup? 
			#this will require another attribute for destroySingle(marker)
			model.destroy() for model in @markers
		