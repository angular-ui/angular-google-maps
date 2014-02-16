angular.module("google-maps.directives.api.models.parent")
.factory "MarkersParentModel", ["IMarkerParentModel", "ModelsWatcher", "PropMap", "MarkerChildModel", "ClustererMarkerManager", "MarkerManager",
    (IMarkerParentModel, ModelsWatcher, PropMap, MarkerChildModel, ClustererMarkerManager, MarkerManager) ->
        class MarkersParentModel extends IMarkerParentModel
            @include ModelsWatcher
            constructor: (scope, element, attrs, mapCtrl, $timeout) ->
                super(scope, element, attrs, mapCtrl, $timeout)
                self = @
                @scope.markerModels = new PropMap()

                @gMarkerManager = undefined
                @$timeout = $timeout
                @$log.info @
                #assume do rebuild all is false and were lookging for a modelKey prop of id
                @doRebuildAll = if @scope.doRebuildAll? then @scope.doRebuildAll else true
                @idKey = if scope.idKey? then scope.idKey else @defaultIdKey
                @scope.$watch 'doRebuildAll', (newValue, oldValue) =>
                    if (newValue != oldValue)
                        @doRebuildAll = newValue

            onTimeOut: (scope)=>
                #watch all the below properties with end up being processed by onWatch below
                @watch('models', scope)
                @watch('doCluster', scope)
                @watch('clusterOptions', scope)
                @watch('clusterEvents', scope)
                @watch('fit', scope)
                @watch('idKey', scope)
                @createMarkersFromScratch(scope)

            onWatch: (propNameToWatch, scope, newValue, oldValue) =>
                if propNameToWatch == "idKey" and newValue != oldValue
                    @idKey = newValue
                if @doRebuildAll
                    @reBuildMarkers(scope)
                else
                    @pieceMealMarkers(scope)


            validateScope: (scope)=>
                modelsNotDefined = angular.isUndefined(scope.models) or scope.models == undefined
                if(modelsNotDefined)
                    @$log.error(@constructor.name + ": no valid models attribute found")

                super(scope) or modelsNotDefined

            createMarkersFromScratch: (scope) =>
                if scope.doCluster? and scope.doCluster == true
                    if scope.clusterOptions?
                        if @gMarkerManager == undefined
                            @gMarkerManager = new ClustererMarkerManager(@mapCtrl.getMap(),
                                    undefined,
                                    scope.clusterOptions,
                                    scope.clusterEvents)
                        else
                            @gMarkerManager = new ClustererMarkerManager(@mapCtrl.getMap(),
                                    undefined,
                                    scope.clusterOptions,
                                    scope.clusterEvents) if @gMarkerManager.opt_options != scope.clusterOptions
                    else
                        @gMarkerManager = new ClustererMarkerManager(@mapCtrl.getMap())
                else
                    @gMarkerManager = new MarkerManager(@mapCtrl.getMap())

                _async.each scope.models, (model) =>
                    @newChildMarker(model, scope)
                , () => #handle done callBack
                    @gMarkerManager.draw()
                    @fit() if angular.isDefined(@attrs.fit) and scope.fit? and scope.fit


            reBuildMarkers: (scope) =>
                if(!scope.doRebuild and scope.doRebuild != undefined)
                    return
                @onDestroy(scope) #clean @scope.markerModels
                @createMarkersFromScratch(scope)

            pieceMealMarkers: (scope)=>
                if @scope.models? and @scope.models.length > 0 and @scope.markerModels.length > 0 #and @scope.models.length == @scope.markerModels.length
                    #find the current state, async operation that calls back
                    @figureOutState @idKey, scope, @scope.markerModels, @modelKeyComparison, (state) =>
                        payload = state
                        #payload contains added, removals and flattened (existing models with their gProp appended)
                        #remove all removals clean up scope (destroy removes itself from markerManger), finally remove from @scope.markerModels
                        _async.each payload.removals, (child)=>
                            if child?
                                child.destroy()
                                @scope.markerModels.remove(child.id)
                        , () =>
                            #add all adds via creating new ChildMarkers which are appended to @scope.markerModels
                            _async.each payload.adds, (modelToAdd) =>
                                @newChildMarker(modelToAdd, scope)
                            , () =>
                                #finally redraw
                                @gMarkerManager.draw()
                                scope.markerModels = @scope.markerModels #for other directives like windows
                else
                    @reBuildMarkers(scope)

            newChildMarker: (model, scope)=>
                child = new MarkerChildModel(model, scope, @mapCtrl,
                        @$timeout,
                        @DEFAULTS, @doClick, @gMarkerManager)
                @$log.info('child', child, 'markers', @scope.markerModels)
                unless model[@idKey]?
                    @$log.error("Marker model has no id to assign a child to. This is required for performance. Please assign id, or redirect id to a different key.")
                    return
                @scope.markerModels.put(model[@idKey], child) #major change this makes model.id a requirement
                child

            onDestroy: (scope)=>
                #need to figure out how to handle individual destroys
                #slap index to the external model so that when they pass external back
                #for destroy we have a lookup?
                #this will require another attribute for destroySingle(marker)
                _.each @scope.markerModels.values(), (model)->
                    model.destroy() if model?
                delete @scope.markerModels
                @scope.markerModels = new PropMap()
                @gMarkerManager.clear() if @gMarkerManager?

            fit: ()=>
                if @mapCtrl and @scope.markerModels? and @scope.markerModels.length > 0
                    bounds = new google.maps.LatLngBounds();
                    everSet = false
                    _async.each @scope.markerModels.values(), (child) =>
                        if child.gMarker?
                            everSet = true unless everSet
                            bounds.extend(child.gMarker.getPosition())
                    , () =>
                        @mapCtrl.getMap().fitBounds(bounds) if everSet

        return MarkersParentModel
]