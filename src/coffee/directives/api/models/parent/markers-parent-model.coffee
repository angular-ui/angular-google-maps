@ngGmapModule "directives.api.models.parent", ->
	class @MarkersParentModel extends directives.api.models.parent.IMarkerParentModel
		constructor: (scope, element, attrs, mapCtrl,$timeout) ->
			super(scope, element, attrs, mapCtrl,$timeout)
			self = @
			@markers = []
			@markersIndex = 0
			@gMarkerManager = undefined
			@scope = scope
			@bigGulp =  directives.api.utils.AsyncProcessor
			@$timeout = $timeout
			@$log.info(@)

		onTimeOut:(scope)=>
			@watch('models',scope)
			@watch('doCluster',scope)
			@watch('clusterOptions',scope)
			@createMarkers(scope)

		validateScope:(scope)=>
			modelsNotDefined = angular.isUndefined(scope.models) or scope.models == undefined
			if(modelsNotDefined)
				@$log.error(@constructor.name + ": no valid models attribute found")

			super(scope) or modelsNotDefined

		createMarkers:(scope) =>
			if scope.doCluster? and scope.doCluster == true
				if scope.clusterOptions?
					@gMarkerManager = new directives.api.managers.ClustererMarkerManager(@mapCtrl.getMap(),scope.clusterOptions)
				else
					@gMarkerManager = new directives.api.managers.ClustererMarkerManager(@mapCtrl.getMap())
			else
				@gMarkerManager = new directives.api.managers.MarkerManager(@mapCtrl.getMap())
				
			@bigGulp.handleLargeArray(scope.models,(model) =>
				scope.doRebuild = true
				child = new directives.api.models.child.MarkerChildModel(@markersIndex,model,scope,@mapCtrl,@$timeout,
					@DEFAULTS,@doClick,@gMarkerManager)
				@markers.push(child)
				@markersIndex++
			)
			@gMarkerManager.draw()
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
			@gMarkerManager.clear() if @gMarkerManager?
			@createMarkers(scope)

		onWatch:(propNameToWatch,scope,newValue,oldValue) =>
			if(propNameToWatch == 'models' and newValue.length == oldValue.length)
				return
			if propNameToWatch == 'options' and newValue?
				@DEFAULTS = newValue
				return
			@reBuildMarkers(scope)

		onDestroy:(scope)=>
			#need to figure out how to handle individual destroys
			#slap index to the external model so that when they pass external back
			#for destroy we have a lookup? 
			#this will require another attribute for destroySingle(marker)
			model.destroy() for model in @markers
			@gMarkerManager.clear() if @gMarkerManager?
		