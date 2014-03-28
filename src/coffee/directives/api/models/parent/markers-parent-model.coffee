@ngGmapModule "directives.api.models.parent", ->
    class @MarkersParentModel extends directives.api.models.parent.IMarkerParentModel
        @include directives.api.utils.ModelsWatcher
        constructor: (scope, element, attrs, mapCtrl, $timeout, $injector) ->
            super(scope, element, attrs, mapCtrl, $timeout, $injector)
            self = @
            @markersIndex = 0
            @gMarkerManager = undefined
            @scope = scope
            @scope.markerModels = []
            @bigGulp = directives.api.utils.AsyncProcessor
            @$timeout = $timeout
            @$injector = $injector
            @$log.info @

        onTimeOut: (scope)=>
            @watch('models', scope)
            @watch('doCluster', scope)
            @watch('clusterOptions', scope)
            @watch('fit', scope)
            @createMarkers(scope)

        validateScope: (scope)=>
            modelsNotDefined = angular.isUndefined(scope.models) or scope.models == undefined
            if(modelsNotDefined)
                @$log.error(@constructor.name + ": no valid models attribute found")

            super(scope) or modelsNotDefined

        createMarkers: (scope) =>
            if scope.doCluster? and scope.doCluster == true
                if scope.clusterOptions?
                    if @gMarkerManager == undefined
                        @gMarkerManager = new directives.api.managers.ClustererMarkerManager(@mapCtrl.getMap(), undefined,
                                scope.clusterOptions)
                    else
                        @gMarkerManager = new directives.api.managers.ClustererMarkerManager(@mapCtrl.getMap(), undefined,
                                scope.clusterOptions) if @gMarkerManager.opt_options != scope.clusterOptions
                else
                    @gMarkerManager = new directives.api.managers.ClustererMarkerManager(@mapCtrl.getMap())
            else
                @gMarkerManager = new directives.api.managers.MarkerManager(@mapCtrl.getMap())

            markers = []
            scope.isMarkerModelsReady = false
            @bigGulp.handleLargeArray(scope.models, (model) =>
                scope.doRebuild = true
                child = new directives.api.models.child.MarkerChildModel(@markersIndex, model, scope, @mapCtrl, @$timeout,
                        @DEFAULTS, @doClick, @gMarkerManager, @$injector)
                @$log.info('child', child, 'markers', markers)
                markers.push(child)
                @markersIndex++
            , (()->) #nothing for pause
            , () => #handle done callBack
                @gMarkerManager.draw()
                scope.markerModels = markers
                @fit() if angular.isDefined(@attrs.fit) and scope.fit? and scope.fit
                scope.isMarkerModelsReady = true
                scope.onMarkerModelsReady(scope) if scope.onMarkerModelsReady?
            )


        reBuildMarkers: (scope) =>
            if(!scope.doRebuild and scope.doRebuild != undefined)
                return
            _.each scope.markerModels, (oldM) =>
                oldM.destroy()
            @markersIndex = 0
            @gMarkerManager.clear() if @gMarkerManager?
            @createMarkers(scope)

        onWatch: (propNameToWatch, scope, newValue, oldValue) =>
            if propNameToWatch == 'models'
                unless @didModelsChange(newValue, oldValue)
                    return
            if propNameToWatch == 'options' and newValue? #do we want to rebuild if options has changed?
                @DEFAULTS = newValue
                return
            @reBuildMarkers(scope)

        onDestroy: (scope)=>
            #need to figure out how to handle individual destroys
            #slap index to the external model so that when they pass external back
            #for destroy we have a lookup?
            #this will require another attribute for destroySingle(marker)
            model.destroy() for model in scope.markerModels
            @gMarkerManager.clear() if @gMarkerManager?

        fit: ()=>
            if @mapCtrl and @scope.markerModels? and @scope.markerModels.length > 0
                bounds = new google.maps.LatLngBounds();
                everSet = false
                _.each @scope.markerModels, (childModelMarker) =>
                    if childModelMarker.gMarker?
                        everSet = true unless everSet
                        bounds.extend(childModelMarker.gMarker.getPosition())
                @mapCtrl.getMap().fitBounds(bounds) if everSet

