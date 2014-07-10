angular.module("google-maps.directives.api.models.parent")
.factory "MarkersParentModel", ["IMarkerParentModel", "ModelsWatcher", "PropMap", "MarkerChildModel", "ClustererMarkerManager", "MarkerManager",
    (IMarkerParentModel, ModelsWatcher, PropMap, MarkerChildModel, ClustererMarkerManager, MarkerManager) ->
        class MarkersParentModel extends IMarkerParentModel
            @include ModelsWatcher
            constructor: (scope, element, attrs, mapCtrl, $timeout) ->
                super(scope, element, attrs, mapCtrl, $timeout)
                self = @
                @scope.markerModels = new PropMap()

                @$timeout = $timeout
                @$log.info @
                #assume do rebuild all is false and were lookging for a modelKey prop of id
                @doRebuildAll = if @scope.doRebuildAll? then @scope.doRebuildAll else false
                @setIdKey scope
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
                @gMarkerManager = undefined
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
                if scope.doCluster
                    if scope.clusterEvents
                      @clusterInternalOptions = do _.once =>
                          self = @
                          unless @origClusterEvents
                              @origClusterEvents =
                                  click: scope.clusterEvents?.click
                                  mouseout: scope.clusterEvents?.mouseout
                                  mouseover: scope.clusterEvents?.mouseover
                              _.extend scope.clusterEvents,
                                  click:(cluster) ->
                                      self.maybeExecMappedEvent cluster, "click"
                                  mouseout:(cluster) ->
                                      self.maybeExecMappedEvent cluster, "mouseout"
                                  mouseover:(cluster) ->
                                    self.maybeExecMappedEvent cluster, "mouseover"

                    if scope.clusterOptions or scope.clusterEvents
                        if @gMarkerManager == undefined
                            @gMarkerManager = new ClustererMarkerManager @mapCtrl.getMap(),
                                    undefined,
                                    scope.clusterOptions,
                                    @clusterInternalOptions
                        else
                            if @gMarkerManager.opt_options != scope.clusterOptions
                                @gMarkerManager = new ClustererMarkerManager @mapCtrl.getMap(),
                                      undefined,
                                      scope.clusterOptions,
                                      @clusterInternalOptions
                    else
                        @gMarkerManager = new ClustererMarkerManager(@mapCtrl.getMap())
                else
                    @gMarkerManager = new MarkerManager(@mapCtrl.getMap())

                _async.each scope.models, (model) =>
                    @newChildMarker(model, scope)
                , () => #handle done callBack
                    @gMarkerManager.draw()
                    @gMarkerManager.fit() if scope.fit


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
                                child.destroy() if child.destroy?
                                @scope.markerModels.remove(child.id)
                        , () =>
                            #add all adds via creating new ChildMarkers which are appended to @scope.markerModels
                            _async.each payload.adds, (modelToAdd) =>
                                @newChildMarker(modelToAdd, scope)
                            , () =>
                                #finally redraw if something has changed
                                if(payload.adds.length > 0 or payload.removals.length > 0)
                                  @gMarkerManager.draw()
                                  scope.markerModels = @scope.markerModels #for other directives like windows
                else
                    @reBuildMarkers(scope)

            newChildMarker: (model, scope)=>
                unless model[@idKey]?
                    @$log.error("Marker model has no id to assign a child to. This is required for performance. Please assign id, or redirect id to a different key.")
                    return
                @$log.info('child', child, 'markers', @scope.markerModels)
                child = new MarkerChildModel(model, scope, @mapCtrl, @$timeout, @DEFAULTS,
                    @doClick, @gMarkerManager, @idKey)
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

            maybeExecMappedEvent:(cluster, fnName) ->
              if _.isFunction @scope.clusterEvents?[fnName]
                pair = @mapClusterToMarkerModels cluster
                @origClusterEvents[fnName](pair.cluster,pair.mapped) if @origClusterEvents[fnName]

            mapClusterToMarkerModels:(cluster) ->
                gMarkers = cluster.getMarkers()
                mapped = gMarkers.map (g) =>
                    @scope.markerModels[g.key].model
                cluster: cluster
                mapped: mapped

        return MarkersParentModel
]
