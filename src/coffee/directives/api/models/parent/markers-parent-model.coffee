angular.module("google-maps.directives.api.models.parent".ns())
.factory "MarkersParentModel".ns(), [
  "IMarkerParentModel".ns(), "ModelsWatcher".ns(),
  "PropMap".ns(), "MarkerChildModel".ns(), "_async".ns(),
  "ClustererMarkerManager".ns(), "MarkerManager".ns(), "$timeout", "IMarker".ns(),
    (IMarkerParentModel, ModelsWatcher,
      PropMap, MarkerChildModel, _async,
      ClustererMarkerManager, MarkerManager,$timeout,IMarker) ->
        class MarkersParentModel extends IMarkerParentModel
            @include ModelsWatcher
            constructor: (scope, element, attrs, map) ->
                super(scope, element, attrs, map)
                self = @
                @scope.markerModels = new PropMap()

                @$log.info @
                #assume do rebuild all is false and were lookging for a modelKey prop of id
                @doRebuildAll = if @scope.doRebuildAll? then @scope.doRebuildAll else false
                @setIdKey scope
                @scope.$watch 'doRebuildAll', (newValue, oldValue) =>
                    if (newValue != oldValue)
                        @doRebuildAll = newValue

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
                    @pieceMeal(scope)

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
                                      self.maybeExecMappedEvent cluster, 'click'
                                  mouseout:(cluster) ->
                                      self.maybeExecMappedEvent cluster, 'mouseout'
                                  mouseover:(cluster) ->
                                    self.maybeExecMappedEvent cluster, 'mouseover'

                    if scope.clusterOptions or scope.clusterEvents
                        if @gMarkerManager == undefined
                            @gMarkerManager = new ClustererMarkerManager @map,
                                    undefined,
                                    scope.clusterOptions,
                                    @clusterInternalOptions
                        else
                            if @gMarkerManager.opt_options != scope.clusterOptions
                                @gMarkerManager = new ClustererMarkerManager @map,
                                      undefined,
                                      scope.clusterOptions,
                                      @clusterInternalOptions
                    else
                        @gMarkerManager = new ClustererMarkerManager @map
                else
                    @gMarkerManager = new MarkerManager @map

                _async.waitOrGo @, =>
                  _async.each scope.models, (model) =>
                      @newChildMarker(model, scope)
                  , false
                  .then =>
                    @gMarkerManager.draw()
                    @gMarkerManager.fit() if scope.fit
                .then =>
                  @existingPieces = undefined


            reBuildMarkers: (scope) =>
              if(!scope.doRebuild and scope.doRebuild != undefined)
                  return
              if @scope.markerModels?.length
                @onDestroy(scope) #clean @scope.markerModels

              @createMarkersFromScratch(scope)

            pieceMeal: (scope)=>
                doChunk = if @existingPieces? then false else _async.defaultChunkSize
                if @scope.models? and @scope.models.length > 0 and @scope.markerModels.length > 0 #and @scope.models.length == @scope.markerModels.length
                    #find the current state, async operation that calls back
                    @figureOutState @idKey, scope, @scope.markerModels, @modelKeyComparison, (state) =>
                        payload = state
                        #payload contains added, removals and flattened (existing models with their gProp appended)
                        #remove all removals clean up scope (destroy removes itself from markerManger), finally remove from @scope.markerModels

                        _async.waitOrGo @, =>
                          _async.each(payload.removals, (child) =>
                              if child?
                                  child.destroy() if child.destroy?
                                  @scope.markerModels.remove(child.id)
                          ,doChunk)
                          .then =>
                              #add all adds via creating new ChildMarkers which are appended to @scope.markerModels
                            _async.each(payload.adds, (modelToAdd) =>
                                @newChildMarker(modelToAdd, scope)
                            ,doChunk)
                          .then () =>
                            _async.each(payload.updates, (update) =>
                                @updateChild update.child, update.model
                            ,doChunk)
                          .then =>
                            #finally redraw if something has changed
                            if(payload.adds.length > 0 or payload.removals.length > 0 or payload.updates.length > 0)
                              @gMarkerManager.draw()
                              scope.markerModels = @scope.markerModels #for other directives like windows
                              @gMarkerManager.fit() if scope.fit #note fit returns a promise
                        .then =>
                          @existingPieces = undefined
                else
                    @reBuildMarkers(scope)

            updateChild:(child, model) =>
                unless model[@idKey]?
                    @$log.error("Marker model has no id to assign a child to. This is required for performance. Please assign id, or redirect id to a different key.")
                    return
                #set isInit to true to force redraw after all updates are processed
                child.setMyScope model,child.model, false

            newChildMarker: (model, scope)=>
                unless model[@idKey]?
                    @$log.error("Marker model has no id to assign a child to. This is required for performance. Please assign id, or redirect id to a different key.")
                    return
                @$log.info('child', child, 'markers', @scope.markerModels)
                childScope = scope.$new(false)
                childScope.events = scope.events
                keys = {}
                _.each IMarker.keys, (v,k) ->
                  keys[k] = scope[k]
                child = new MarkerChildModel(childScope, model, keys, @map, @DEFAULTS,
                    @doClick, @gMarkerManager, doDrawSelf = false) #this is managed so child is not drawing itself
                @scope.markerModels.put(model[@idKey], child) #major change this makes model.id a requirement
                child

            onDestroy: (scope)=>
              #need to figure out how to handle individual destroys
              #slap index to the external model so that when they pass external back
              #for destroy we have a lookup?
              #this will require another attribute for destroySingle(marker)
              _async.waitOrGo @, =>
                  @gMarkerManager.clear() if @gMarkerManager?
                  _.each @scope.markerModels.values(), (model)->
                      model.destroy() if model?
                  delete @scope.markerModels
                  @scope.markerModels = new PropMap()
                  Promise.resolve()

            maybeExecMappedEvent:(cluster, fnName) ->
              if _.isFunction @scope.clusterEvents?[fnName]
                pair = @mapClusterToMarkerModels cluster
                @origClusterEvents[fnName](pair.cluster,pair.mapped) if @origClusterEvents[fnName]

            mapClusterToMarkerModels:(cluster) ->
                gMarkers = cluster.getMarkers().values()
                mapped = gMarkers.map (g) =>
                    @scope.markerModels[g.key].model
                cluster: cluster
                mapped: mapped

        return MarkersParentModel
]
